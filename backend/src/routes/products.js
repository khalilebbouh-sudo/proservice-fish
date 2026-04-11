const express = require('express');
const rateLimit = require('express-rate-limit');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { requireAdmin } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { verifyImageMagic } = require('../middleware/verifyImageMagic');
const {
  createProductRules,
  updateProductRules,
  deleteProductRules,
  mongoIdParam,
} = require('../validators/productValidators');
const { validateRequest } = require('../middleware/validateRequest');
const { asyncHandler, sendError } = require('../utils/errors');

const router = express.Router();

const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many write requests, try again later' },
});

function publicImageUrl(req, filename) {
  if (!filename) return '';
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${filename}`;
}

function isDbReady() {
  return mongoose.connection.readyState === 1;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    if (!isDbReady()) {
      return res.json({ products: [] });
    }
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const mapped = products.map((p) => ({
      ...p,
      id: String(p._id),
      image: p.image
        ? p.image.startsWith('http')
          ? p.image
          : publicImageUrl(req, path.basename(p.image))
        : '',
    }));
    return res.json({ products: mapped });
  })
);

router.get(
  '/:id',
  mongoIdParam,
  validateRequest,
  asyncHandler(async (req, res) => {
    if (!isDbReady()) {
      return sendError(res, 503, 'Database unavailable');
    }
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }
    const image = product.image
      ? product.image.startsWith('http')
        ? product.image
        : publicImageUrl(req, path.basename(product.image))
      : '';
    return res.json({
      product: {
        ...product,
        id: String(product._id),
        image,
      },
    });
  })
);

router.post(
  '/',
  mutationLimiter,
  requireAdmin,
  uploadSingle('image'),
  verifyImageMagic,
  createProductRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, price, description, stock } = req.body;
    const imagePath = req.file ? req.file.filename : '';

    const product = await Product.create({
      name,
      price: Number(price),
      description,
      stock: Number(stock),
      image: imagePath,
    });

    return res.status(201).json({
      product: {
        id: String(product._id),
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        image: publicImageUrl(req, product.image),
        createdAt: product.createdAt,
      },
    });
  })
);

router.put(
  '/:id',
  mutationLimiter,
  requireAdmin,
  uploadSingle('image'),
  verifyImageMagic,
  updateProductRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, 'Product not found');
    }

    const { name, price, description, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (req.file) {
      product.image = req.file.filename;
    }

    await product.save();

    return res.json({
      product: {
        id: String(product._id),
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
        image: publicImageUrl(req, product.image),
        createdAt: product.createdAt,
      },
    });
  })
);

router.delete(
  '/:id',
  mutationLimiter,
  requireAdmin,
  deleteProductRules,
  validateRequest,
  asyncHandler(async (req, res) => {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) {
      return sendError(res, 404, 'Product not found');
    }
    return res.json({ ok: true });
  })
);

module.exports = router;

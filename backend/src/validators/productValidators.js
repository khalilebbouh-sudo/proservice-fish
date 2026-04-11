const { body, param } = require('express-validator');

const nameRules = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ max: 200 })
  .withMessage('Name is too long');

const priceRules = body('price')
  .notEmpty()
  .withMessage('Price is required')
  .isFloat({ min: 0 })
  .withMessage('Price must be a non-negative number');

const descriptionRules = body('description')
  .trim()
  .notEmpty()
  .withMessage('Description is required')
  .isLength({ max: 5000 })
  .withMessage('Description is too long');

const stockRules = body('stock')
  .notEmpty()
  .withMessage('Stock is required')
  .isInt({ min: 0 })
  .withMessage('Stock must be a non-negative integer');

const mongoIdParam = param('id')
  .isMongoId()
  .withMessage('Invalid product id');

const createProductRules = [nameRules, priceRules, descriptionRules, stockRules];

const updateProductRules = [
  mongoIdParam,
  body('name').optional().trim().notEmpty().isLength({ max: 200 }),
  body('price').optional().isFloat({ min: 0 }),
  body('description').optional().trim().notEmpty().isLength({ max: 5000 }),
  body('stock').optional().isInt({ min: 0 }),
];

const deleteProductRules = [mongoIdParam];

module.exports = {
  createProductRules,
  updateProductRules,
  deleteProductRules,
  mongoIdParam,
};

const fs = require('fs/promises');
const { sendError } = require('../utils/errors');

function matchesMagic(buf) {
  if (buf.length < 12) return false;
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47 &&
    buf[4] === 0x0d &&
    buf[5] === 0x0a &&
    buf[6] === 0x1a &&
    buf[7] === 0x0a
  ) {
    return true;
  }
  // GIF87a / GIF89a
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return true;
  // WebP (RIFF....WEBP)
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return true;
  }
  return false;
}

async function verifyImageMagic(req, res, next) {
  if (!req.file) return next();
  try {
    const fh = await fs.open(req.file.path, 'r');
    const buf = Buffer.alloc(16);
    try {
      await fh.read(buf, 0, 16, 0);
    } finally {
      await fh.close();
    }
    if (!matchesMagic(buf)) {
      await fs.unlink(req.file.path).catch(() => {});
      return sendError(res, 400, 'Invalid image file');
    }
    return next();
  } catch {
    await fs.unlink(req.file.path).catch(() => {});
    return sendError(res, 400, 'Invalid image file');
  }
}

module.exports = { verifyImageMagic };

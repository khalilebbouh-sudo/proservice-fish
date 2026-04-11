const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || '';

  if (!email || !password) {
    // eslint-disable-next-line no-console
    console.warn(
      '[proservice-fish] ADMIN_EMAIL and ADMIN_PASSWORD not fully set; skipping admin bootstrap.'
    );
    return;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({
    email,
    passwordHash,
    role: 'admin',
  });

  // eslint-disable-next-line no-console
  console.log(`[proservice-fish] Created admin user: ${email}`);
}

module.exports = { ensureAdminUser };

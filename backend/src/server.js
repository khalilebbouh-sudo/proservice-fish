require('dotenv').config();

const app = require('./app');
const { connectDb } = require('./config/db');
const { ensureAdminUser } = require('./scripts/ensureAdmin');

const port = Number(process.env.PORT) || 5000;

function start() {
  const isProd = process.env.NODE_ENV === 'production';
  const secret = process.env.JWT_SECRET || '';
  if (isProd && secret.length < 32) {
    // eslint-disable-next-line no-console
    console.error(
      '[proservice-fish] Refusing to start: JWT_SECRET must be at least 32 characters in production.'
    );
    process.exit(1);
  }
  if (!isProd && secret.length < 32) {
    // eslint-disable-next-line no-console
    console.warn(
      '[proservice-fish] Use JWT_SECRET of 32+ characters before deploying to production.'
    );
  }

  app.listen(port, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://127.0.0.1:${port}`);
  });

  connectDb()
    .then(() => ensureAdminUser())
    .then(async () => {
      if (process.env.USE_MEMORY_MONGO !== '1' || process.env.NODE_ENV === 'production') {
        return;
      }
      const Product = require('./models/Product');
      const { runSeedCatalog } = require('./scripts/seedProducts');
      const n = await Product.countDocuments();
      if (n > 0) return;
      // eslint-disable-next-line no-console
      console.log('[proservice-fish] Catalogue vide — insertion des produits démo (Mongo mémoire).');
      try {
        const stats = await runSeedCatalog({ fresh: false, silent: true });
        // eslint-disable-next-line no-console
        console.log(
          `[proservice-fish] Auto-seed OK — ${stats.inserted} produit(s), total: ${stats.total}.`
        );
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[proservice-fish] Auto-seed échoué:', err?.message || err);
      }
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[proservice-fish] MongoDB not ready:', err?.message || err);
      // eslint-disable-next-line no-console
      console.error(
        '[proservice-fish] Fix MONGODB_URI (or USE_MEMORY_MONGO=1 en dev) et redémarrez. En attendant, GET /api/products renvoie [].'
      );
    });
}

start();

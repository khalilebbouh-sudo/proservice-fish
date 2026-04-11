/**
 * Insère le catalogue ProService Fish (images dans backend/seed-assets).
 * Prix catalogue à 0 → site public « prix sur demande » (mettre prix > 0 pour afficher un montant).
 * Usage: npm run seed-products
 * Options: --fresh  supprime tous les produits avant d'insérer
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { connectDb } = require('../config/db');
const Product = require('../models/Product');

const SEED_DIR = path.join(__dirname, '../../seed-assets');
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const CATALOG = [
  {
    file: 'european-pilchard.png',
    name: 'Sardine européenne (pilchard)',
    price: 0,
    stock: 40,
    description:
      'Sardine entière fraîche, argentée et brillante. Riche en oméga-3, idéale au grill, en friture ou marinée. ProService Fish sélectionne des poissons de taille homogène pour une cuisson régulière.',
  },
  {
    file: 'atlantic-bonito.png',
    name: 'Bonite atlantique',
    price: 0,
    stock: 12,
    description:
      'Bonite atlantique au dos bleu-vert et chair rose ferme. Poisson pélagique savoureux, parfait en sashimi léger, tataki ou grillé. À consommer rapidement après achat pour une fraîcheur optimale.',
  },
  {
    file: 'european-squid.png',
    name: 'Calmar européen',
    price: 0,
    stock: 25,
    description:
      'Calmar entier frais, peau lisse et chair tendre. Idéal pour encornets farcis, friture ou plancha. Nettoyage possible sur demande — contactez-nous sur WhatsApp.',
  },
  {
    file: 'goatfish.png',
    name: 'Rouget-barbet',
    price: 0,
    stock: 18,
    description:
      'Rouget-barbet reconnaissable à ses barbillons. Chair fine et légèrement sucrée, excellent poisson de roche pour la poêle ou le four. Livré entier avec tête pour plus de goût au bouillon.',
  },
  {
    file: 'giant-tiger-prawn.png',
    name: 'Crevette tigre géante',
    price: 0,
    stock: 15,
    description:
      'Crevette tigre entière, chair dense et goût iodé marqué. Parfaite pour barbecue, wok ou grillades. Décongélation interdite si produit frais : respecter la chaîne du froid.',
  },
  {
    file: 'golden-grouper.png',
    name: 'Mérou doré',
    price: 0,
    stock: 6,
    description:
      'Mérou à reflets dorés, chair épaisse et ferme. Poisson noble pour cuisson au four, vapeur ou en papillote. Stock limité selon arrivages — réservez par message.',
  },
  {
    file: 'golden-mullet.png',
    name: 'Mulet doré',
    price: 0,
    stock: 30,
    description:
      'Mulet doré aux flancs argentés. Poisson gras et parfumé, très apprécié frit ou au four avec herbes. Excellente valeur pour la table familiale.',
  },
  {
    file: 'great-barracuda.png',
    name: 'Barracuda',
    price: 0,
    stock: 8,
    description:
      'Barracuda entier, prédateur au corps fuselé. Chair blanche ferme, adaptée aux grillades et currys de poisson. Nous vous conseillons la cuisson pour une texture optimale.',
  },
  {
    file: 'hake.png',
    name: 'Merlu (colin)',
    price: 0,
    stock: 35,
    description:
      'Merlu entier frais, chair blanche délicate et peu arêteuse. Incontournable des fish & chips maison, brandade ou papillote. Produit phare de la pêche durable locale quand disponible.',
  },
  {
    file: 'octopus.png',
    name: 'Poulpe',
    price: 0,
    stock: 10,
    description:
      'Poulpe entier, tentacules charnus après cuisson lente. Idéal salades méditerranéennes, grillades ou ragouts. Nous recommandons un attendrissement à la cocotte-minute ou mijotage.',
  },
  {
    file: 'madeiran-sardinella.png',
    name: 'Sardinelle de Madère',
    price: 0,
    stock: 50,
    description:
      'Sardinelle petite taille, poisson gras et économique. Parfait en friture panée ou en soupe de poisson. Idéal pour les grandes tablées et apéritifs marins.',
  },
  {
    file: 'horse-mackerel.png',
    name: 'Chinchard (saurel)',
    price: 0,
    stock: 28,
    description:
      'Chinchard au dos bleuté et queue fourchue. Chair ferme, goût prononcé — excellent en escabèche, au four ou fumé maison. Idéal pour une cuisine quotidienne.',
  },
  {
    file: 'pink-shrimp.png',
    name: 'Crevette rose entière',
    price: 0,
    stock: 22,
    description:
      'Crevette rose avec tête, chair translucide et sucrée. Pour paella, bisque ou grill. Qualité premium sélectionnée par ProService Fish pour les restaurateurs et particuliers.',
  },
  {
    file: 'ribbon-fish.png',
    name: 'Poisson-ruban (sabre argenté)',
    price: 0,
    stock: 14,
    description:
      'Poisson-ruban au corps très allongé et argent brillant. Chair fine une fois préparé — demandez-nous les conseils de levée de filets. Cuisson rapide à la poêle recommandée.',
  },
  {
    file: 'round-sardinella.png',
    name: 'Sardinelle ronde',
    price: 0,
    stock: 45,
    description:
      'Sardinelle ronde, petite espèce grasse et savoureuse. Idéale pour fritures et marinades. Disponibilité selon saison de pêche.',
  },
  {
    file: 'royal-spiny-lobster.png',
    name: 'Langouste royale',
    price: 0,
    stock: 4,
    description:
      'Langouste royale entière, chair longue et sucrée sans grosses pinces. Plat de fête par excellence : grillée, flambée ou en salade tiède. Sur commande selon stock.',
  },
  {
    file: 'caramote-prawn.png',
    name: 'Crevette caramote',
    price: 0,
    stock: 20,
    description:
      'Crevette caramote méditerranéenne, goût iodé fin. Idéale en grillade ou plat mijoté. Taille généreuse — comptez 3 à 4 pièces par personne en plat principal.',
  },
  {
    file: 'cuttlefish.png',
    name: 'Seiche',
    price: 0,
    stock: 16,
    description:
      'Seiche entière, peau marbrée et encre conservée si possible. Risotto à l’encre, grillades ou farcie. Chair tendre si cuisson courte, fondante si braisée.',
  },
  {
    file: 'capitain-fish.png',
    name: 'Capitaine (thazard)',
    price: 0,
    stock: 9,
    description:
      'Capitaine au corps élancé, poisson de grande profondeur à la chair blanche ferme. Excellent en darnes grillées ou en bouillabaisse. Arrivages selon pêche.',
  },
  {
    file: 'spotted-seabass.png',
    name: 'Bar moucheté',
    price: 0,
    stock: 11,
    description:
      'Bar moucheté aux points sombres sur le dos, chair fine et élégante. Cuisson en croûte de sel ou à la plancha. Produit recherché — quantités limitées.',
  },
  {
    file: 'canary-dentex.png',
    name: 'Denté des Canaries',
    price: 0,
    stock: 7,
    description:
      'Denté aux flancs rosés, chair dense et savoureuse. Poisson noble méditerranéen pour le four ou le barbecue. Demandez la taille disponible du jour sur WhatsApp.',
  },
  {
    file: 'white-grouper.png',
    name: 'Mérou blanc',
    price: 0,
    stock: 5,
    description:
      'Mérou blanc à la robe claire tachetée, chair épaisse et peu arêteuse. Cuisson douce recommandée (four, vapeur). Produit haut de gamme pour tables exigeantes.',
  },
  {
    file: 'sharpsnout-seabream.png',
    name: 'Dorade (sar à museau pointu)',
    price: 0,
    stock: 24,
    description:
      'Dorade / sar à museau pointu, bandes sombres et tache caudale distinctive. Chair blanche et goûtée, polyvalente au four ou au grill. Classique des poissonneries de qualité.',
  },
];

function copyToUploads(seedFile) {
  const src = path.join(SEED_DIR, seedFile);
  if (!fs.existsSync(src)) {
    throw new Error(`Fichier manquant: ${src}`);
  }
  const ext = path.extname(seedFile) || '.png';
  const destName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const dest = path.join(UPLOADS_DIR, destName);
  fs.copyFileSync(src, dest);
  return destName;
}

/**
 * @param {{ fresh?: boolean; silent?: boolean }} opts
 * @returns {Promise<{ inserted: number; skipped: number; total: number }>}
 */
async function runSeedCatalog(opts = {}) {
  const { fresh = false, silent = false } = opts;
  if (!fs.existsSync(SEED_DIR)) {
    throw new Error(
      `Dossier seed-assets introuvable: ${SEED_DIR}\nPlacez les PNG exportés depuis Cursor dans ce dossier.`
    );
  }

  if (fresh) {
    const r = await Product.deleteMany({});
    if (!silent) {
      // eslint-disable-next-line no-console
      console.log(`Suppression: ${r.deletedCount} produit(s).`);
    }
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }

  let inserted = 0;
  let skipped = 0;

  for (const item of CATALOG) {
    if (!fresh) {
      const exists = await Product.findOne({ name: item.name });
      if (exists) {
        skipped += 1;
        if (!silent) {
          // eslint-disable-next-line no-console
          console.log(`Déjà présent, ignoré: ${item.name}`);
        }
        continue;
      }
    }

    const image = copyToUploads(item.file);
    await Product.create({
      name: item.name,
      price: item.price,
      description: item.description,
      stock: item.stock,
      image,
    });
    inserted += 1;
    if (!silent) {
      // eslint-disable-next-line no-console
      console.log(`OK: ${item.name} → ${image}`);
    }
  }

  const total = await Product.countDocuments();
  if (!silent) {
    // eslint-disable-next-line no-console
    console.log(`\nTerminé. Ajoutés: ${inserted}, ignorés: ${skipped}. Total en base: ${total}`);
  }
  return { inserted, skipped, total };
}

async function main() {
  const fresh = process.argv.includes('--fresh');
  if (!fs.existsSync(SEED_DIR)) {
    // eslint-disable-next-line no-console
    console.error(
      `Dossier seed-assets introuvable: ${SEED_DIR}\nPlacez les PNG exportés depuis Cursor dans ce dossier.`
    );
    process.exit(1);
  }

  await connectDb();
  await runSeedCatalog({ fresh, silent: false });
  process.exit(0);
}

if (require.main === module) {
  main().catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  });
}

module.exports = { runSeedCatalog };

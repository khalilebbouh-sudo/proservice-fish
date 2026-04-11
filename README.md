# ProService Fish

Application web complète (catalogue public + tableau de bord admin sécurisé) pour **ProService Fish**.

## Structure

- `frontend/` — Next.js 14 (App Router), Tailwind CSS, responsive.
- `backend/` — API REST Express, MongoDB (Mongoose), JWT (cookie httpOnly), Multer (uploads locaux).

## GitHub

Le dépôt Git est initialisé en local (`main`, `.env` ignorés). Pour **pousser** vers votre compte :

1. Créez un dépôt **vide** sur [github.com/new](https://github.com/new) (sans README imposé).
2. Dans un terminal, à la racine du projet :

```bash
git remote add origin https://github.com/VOTRE_USER/VOTRE_REPO.git
git push -u origin main
```

Si `origin` existe déjà : `git remote set-url origin https://github.com/...` puis `git push -u origin main`.

**Windows (PowerShell)** — script qui configure `origin` et pousse :

```powershell
cd chemin\vers\proservice
powershell -ExecutionPolicy Bypass -File .\scripts\push-to-github.ps1 -RemoteUrl "https://github.com/VOTRE_USER/VOTRE_REPO.git"
```

Authentification : GitHub exige souvent un **Personal Access Token** (classique HTTPS) ou une clé **SSH** à la place du mot de passe.

## Prérequis

- Node.js **18+**
- MongoDB en local ou URI cloud (MongoDB Atlas)

## MongoDB : se connecter

Sans base joignable, l’API démarre quand même mais le **catalogue reste vide** (et lecture seule) tant que Mongo n’est pas prêt ; l’**admin** nécessite une base connectée.

### 0. Mode mémoire (sans Docker ni Atlas)

Pour tester tout de suite sur votre PC **sans installer MongoDB** :

```bash
cd backend
npm install
npm run dev:memory
```

La première fois, `mongodb-memory-server` peut télécharger un binaire Mongo (plusieurs minutes selon la connexion). En dev, `USE_MEMORY_MONGO=1` utilise une base **en RAM** : les données disparaissent à l’arrêt du serveur. Le catalogue démo est inséré automatiquement au premier démarrage si la base est vide.

Vous pouvez aussi ajouter `USE_MEMORY_MONGO=1` dans `backend/.env` et lancer `npm run dev`.

### 1. Docker (recommandé sur Windows)

1. Installez [Docker Desktop](https://www.docker.com/products/docker-desktop/) et lancez-le.
2. À la racine du projet :

```bash
docker compose up -d
```

3. Dans `backend/.env`, gardez ou mettez :

```env
MONGODB_URI=mongodb://127.0.0.1:27017/proservice_fish
```

4. Redémarrez l’API (`npm run dev` dans `backend`). Dans le terminal, vous ne devez plus voir d’erreur Mongo ; chargez le catalogue avec `npm run seed-products` si besoin.

### 2. MongoDB Atlas (cloud, gratuit possible)

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Créez un cluster (gratuit M0 suffit pour le dev).
3. **Database Access** : utilisateur + mot de passe (notez-les).
4. **Network Access** : pour le dev, ajoutez `0.0.0.0/0` (toutes les IP) ou votre IP fixe uniquement en prod.
5. **Connect** → Drivers → copiez l’URI (remplacez `<password>` par le mot de passe, encodez les caractères spéciaux dans le mot de passe si besoin).
6. Collez l’URI dans `backend/.env` sous `MONGODB_URI=...` et redémarrez l’API.

### 3. MongoDB installé sur la machine

Installez [MongoDB Community Server](https://www.mongodb.com/try/download/community) pour Windows, lancez le service **MongoDB**, puis utilisez la même URI locale que dans l’exemple `backend/.env.example`.

## Configuration

### Backend (`backend/.env`)

Copiez `backend/.env.example` vers `backend/.env` et ajustez :

| Variable | Description |
|----------|-------------|
| `PORT` | Port API (défaut `5000`) |
| `MONGODB_URI` | URI MongoDB |
| `JWT_SECRET` | Secret JWT (32+ caractères en production) |
| `JWT_EXPIRES_IN` | Durée du token (ex. `1d`) |
| `FRONTEND_URL` | Origine autorisée CORS + cookie (ex. `http://localhost:3000`) |
| `ADMIN_EMAIL` | Email du compte admin (créé au premier démarrage si absent) |
| `ADMIN_PASSWORD` | Mot de passe initial (à changer après déploiement) |

Pour **réinitialiser le mot de passe admin** :

```bash
cd backend
npm install
npm run seed-admin
```

Pour **charger le catalogue démo** (23 produits + images depuis `backend/seed-assets/`, copie vers `uploads/`) :

```bash
cd backend
npm run seed-products
```

Réinsérer tout le catalogue (vide la collection produits) :

```bash
npm run seed-products -- --fresh
```

### Frontend (`frontend/.env.local`)

Copiez `frontend/.env.example` vers `frontend/.env.local` :

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL de l’API (ex. `http://localhost:5000`) |
| `NEXT_PUBLIC_SITE_URL` | URL du site Next (SEO / métadonnées) |

## Démarrage en développement

Terminal 1 — API :

```bash
cd backend
npm install
npm run dev
```

Terminal 2 — site :

```bash
cd frontend
npm install
npm run dev
```

- Site (redirige vers la langue par défaut) : [http://localhost:3000](http://localhost:3000) → `/fr`, `/en`, `/es`  
- Exemple accueil FR : [http://localhost:3000/fr](http://localhost:3000/fr)  
- API : [http://localhost:5000/health](http://localhost:5000/health)  
- Admin (hors préfixe langue) : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Build production (Hostinger / VPS)

### API

```bash
cd backend
npm install
# Définir NODE_ENV=production et les variables d’environnement sur le serveur
npm start
```

Assurez-vous que le dossier `uploads/` est **persistant** (volume ou répertoire non écrasé au déploiement).

### Frontend

```bash
cd frontend
npm install
npm run build
npm start
```

Sur **Hostinger** (hébergement Node), configurez les variables d’environnement dans le panneau, pointez `NEXT_PUBLIC_API_URL` vers l’URL publique de votre API (HTTPS), et `FRONTEND_URL` côté backend vers l’URL publique du site (HTTPS).

**Même domaine (recommandé)** : placez l’API derrière un reverse proxy (Nginx) sous `/api` et les fichiers statiques `/uploads`, ou utilisez un sous-domaine dédié avec CORS + cookies `Secure` en HTTPS.

## API (REST)

| Méthode | Route | Auth |
|---------|--------|------|
| GET | `/health` | Non |
| POST | `/api/auth/login` | Non (rate limit renforcé) |
| POST | `/api/auth/logout` | Non |
| GET | `/api/auth/me` | Cookie ou Bearer |
| GET | `/api/products` | Non |
| GET | `/api/products/:id` | Non |
| POST | `/api/products` | Admin (JWT) |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

Schéma produit : `name`, `price`, `description`, `image`, `stock`, `createdAt`.

## Sécurité (implémenté)

- Mots de passe hashés (**bcrypt**), jamais en clair.
- **JWT** en cookie **httpOnly**, `SameSite=strict` + `Secure` en production (option Bearer pour outils).
- **Démarrage production** : arrêt si `JWT_SECRET` a moins de 32 caractères ; `FRONTEND_URL` doit être en **https**.
- **Helmet** : HSTS (prod), `noSniff`, `frameguard: deny`, `Referrer-Policy`, `X-Powered-By` désactivé.
- **CORS** : une seule origine (`FRONTEND_URL`), credentials, préflight `maxAge`.
- **Rate limiting** : global (hors `/health`), login (**5**/15 min), `/api/auth/me` (60/min), écritures produits (**120**/15 min).
- **Login** : délai aléatoire après échec (réduit fuite timing / énumération).
- **express-validator** (entrées), **express-mongo-sanitize** (injection NoSQL).
- **Upload** : MIME autorisés, taille max **2 Mo**, noms aléatoires, **contrôle des octets magiques** (JPEG/PNG/GIF/WebP) après Multer.
- **Next.js** : en-têtes `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, **HSTS** en prod ; admin **`noindex`**.
- **Admin UI** : messages d’erreur génériques (pas de détail API côté client).
- Messages d’erreur génériques en production côté API.

## Logo

Logo société : `frontend/public/assets/company-logo.png` (navbar, favicon, Open Graph). Ancien visuel SVG : `frontend/public/assets/fish-logo.svg` (non utilisé par défaut).

## Contact affiché sur le site

- Téléphone : 20 78 36 74 / 36 36 37 66  
- Email : proservice986@gmail.com  
- WhatsApp : 00222 20 78 36 74 — **Proservice_fish**

## Cloudinary (optionnel)

L’upload actuel est **local (Multer + `/uploads`)**. Pour passer à Cloudinary, ajoutez le SDK, uploadez dans le handler produit, et stockez l’URL HTTPS dans `image` au lieu du nom de fichier.

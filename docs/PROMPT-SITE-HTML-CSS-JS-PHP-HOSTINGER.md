# Prompt : reproduire « ProService Fish » en HTML / CSS / JS / PHP (Hostinger mutualisé)

Copiez tout le bloc ci-dessous dans une autre IA ou un cahier des charges.

---

## Contexte

Tu dois produire un **site vitrine + catalogue** pour **ProService Fish** (poissonnerie / export poisson et fruits de mer, Mauritanie), **équivalent fonctionnel et visuel** au site de référence décrit ci-dessous, mais **sans Node.js, sans React, sans MongoDB**.

**Stack imposée :** HTML5, CSS3, JavaScript (vanilla, pas de framework obligatoire), **PHP 8.x** (compatible hébergement web **Hostinger** classique : PHP + Apache, pas de serveur Node).

**Objectif hébergement :** déposer les fichiers via **FTP / Gestionnaire de fichiers** ou déploiement Git Hostinger ; tout doit fonctionner avec **PHP inclus** et éventuellement **MySQL** (base fournie par Hostinger).

---

## Identité & contenu

- **Marque :** ProService Fish (logo circulaire + texte PROSERVICE FISH en capitales, teal foncé).
- **Langues :** au minimum **FR** ; idéalement **FR / EN / ES** (fichiers de traduction PHP en tableaux, ou dossiers `/fr/`, `/en/`, `/es/` avec les mêmes gabarits).
- **Contacts affichés :** Tél. 20 78 36 74 / 36 36 37 66 — WhatsApp 00222 20 78 36 74 — email proservice986@gmail.com — mention « Proservice_fish » sur WhatsApp.
- **Prix :** afficher **« Prix sur demande »** (pas de prix catalogue fixe) ; possibilité d’afficher un prix si renseigné en base.
- **CTA WhatsApp :** bouton flottant vert (coin bas-droite) + liens `https://wa.me/22220783674` avec texte prérempli adapté à la page / au produit.

---

## Design (à respecter visuellement)

### Palette (proche du site actuel)

- **Teal marque (principal) :** environ `#237892` à `#215f72` (boutons, liens actifs, accents).
- **Fond pages :** `#f8fafc` (slate très clair).
- **Header :** barre **blanche**, bordure légère, ombre discrète ; sticky en haut.
- **Navigation :** liens centrés sur desktop (Accueil, Produits, Contact) ; menu hamburger sur mobile.
- **Langue :** pastilles FR | EN | ES — langue active dans un pilule **fond teal + texte blanc**.

### Page d’accueil

1. **Hero plein largeur** (min-height ~70–80vh) :
   - Image de fond : **marché / poissons sur glace** (photo libre de droits type Unsplash « seafood on ice »), `object-fit: cover`.
   - **Overlay** dégradé diagonal teal très sombre semi-transparent pour la lisibilité.
   - Texte **blanc** : petite ligne d’accroche (eyebrow), **titre** fort (2 lignes max sur mobile), **sous-titre** court, **2 boutons** : primaire teal « Voir le catalogue », secondaire contour blanc « Nous contacter ».
   - Bandeau bas : téléphone + WhatsApp en petit texte.
   - Crédit photo discret si image externe (ex. Unsplash).

2. **Trois cartes** sous le hero (chevauchement léger `-margin-top` possible) :
   - Fond blanc, coins arrondis, ombre légère.
   - Titres : **Chaîne du froid**, **Traçabilité**, **Logistique sur mesure** (ou équivalent) + courte description chacune.

3. **Section catalogue** : grille responsive (1 → 2 → 3 colonnes), **cartes produit** : image, nom, extrait description, badge stock (vert / rouge), lien « Détails », mention prix sur demande si pas de prix.

### Pages intérieures

- **Liste produits (`/produits.php` ou `/produits/`)** : titre, intro, grille de cartes identiques à l’accueil.
- **Fiche produit** : grande image, nom, description complète, stock, bouton WhatsApp prérempli, lien retour catalogue.
- **Contact** : coordonnées + liens cliquables (tel, mail, WhatsApp).

### Footer

- Fond gris très clair, 3 colonnes : logo + baseline ; liens navigation ; bloc contact.
- Même style sobre que le header.

### Responsive

- Mobile first ; breakpoints cohérents (ex. 640px, 1024px).

---

## Architecture PHP (recommandée pour Hostinger)

```
/public_html/
  index.php              # accueil
  produits.php           # liste
  produit.php?id=...    # fiche (ou rewrite .htaccess)
  contact.php
  includes/
    header.php
    footer.php
    config.php           # constantes (pas de secrets en clair dans Git si possible)
  assets/
    css/style.css
    js/main.js           # menu mobile, switch langue si besoin
    img/                 # logo + images locales
  data/
    produits.json        # OU connexion MySQL via config
  lang/
    fr.php en.php es.php # tableaux de chaînes
```

- **`config.php` :** chemins de base, URL du site ; si MySQL : `mysqli` ou PDO avec identifiants lus depuis **variables d’environnement** Hostinger ou `config.local.php` **hors dépôt public** si l’hébergeur le permet.
- **Données produits :**
  - **Option simple :** fichier **`data/produits.json`** (tableau d’objets : `id`, `nom`, `description`, `prix`, `stock`, `image`) — le PHP fait `json_decode` et boucle ; mise à jour manuelle FTP ou petite page **admin PHP protégée** (session + mot de passe fort) pour CRUD basique (optionnel dans le prompt).
  - **Option Hostinger classique :** table MySQL `produits` + même schéma ; script SQL d’import initial fourni.

- **Sécurité minimale :** `htmlspecialchars()` sur toutes les sorties utilisateur ; pas d’`eval` ; uploads images réservés à l’admin avec validation MIME / taille si tu ajoutes un formulaire.

- **`.htaccess` :** `DirectoryIndex index.php` ; éventuellement réécriture d’URL propres (`/produit/slug` → `produit.php?slug=`).

---

## JavaScript (vanilla)

- Ouverture / fermeture **menu mobile**.
- Optionnel : bascule FR/EN/ES via **cookie + rechargement** ou paramètre `?lang=en` sans framework.
- Préremplissage du lien WhatsApp (encodeURIComponent) sur les fiches produit.

---

## Livrables attendus de l’IA / du dev

1. Arborescence complète des fichiers listée.
2. **CSS** dans un ou plusieurs fichiers (variables `:root` pour les couleurs).
3. **PHP** commenté, syntaxe PHP 8+, compatible hébergement mutualisé.
4. **Jeux de données** : au moins **8–10 produits** exemples (noms réalistes poisson / mer) avec `prix: 0` et texte « Prix sur demande ».
5. **README** en français : comment uploader sur Hostinger, où mettre `produits.json` ou les identifiants MySQL, URL du site.
6. Aucune dépendance à **npm**, **Composer** optionnel uniquement si tu documentes clairement (sinon zéro Composer pour rester simple).

---

## Ce qu’il ne faut PAS faire

- Pas de Next.js, React, Vue, MongoDB, Express.
- Pas de JWT complexe obligatoire pour la vitrine ; si admin PHP : session + mot de passe hashé (`password_hash`).

---

## Résumé en une phrase

> « Clône visuel et fonctionnel du site ProService Fish (accueil hero marché, cartes forces, catalogue, fiche, contact, WhatsApp, 3 langues, prix sur demande) en **HTML + CSS + JS + PHP** prêt pour **Hostinger mutualisé**, données en **JSON ou MySQL**, sans stack Node. »

---

_Fichier généré pour le dépôt proservice-fish — à adapter ou coller tel quel dans une demande à une IA._

/**
 * Hero accueil — photo libre de droits (Unsplash, licence Unsplash).
 * Source : marché, fruits de mer sur glace (Georg Eiermann).
 * Paramètres w=3840 : cible grands écrans / qualité proche « 4K » côté navigateur.
 */
const HERO_PHOTO_ID = 'photo-1754587489058-b6b710ef78ea';

export function homeHeroImageUrl(width: 3840 | 2400 | 1920 = 3840, quality = 88) {
  return `https://images.unsplash.com/${HERO_PHOTO_ID}?auto=format&fit=crop&w=${width}&q=${quality}&fm=jpg`;
}

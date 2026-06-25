/*
 * config.js — Données initiales (mock) et constantes globales.
 * Chargé en premier ; les autres modules peuvent lire DEFAULT_DATA et today().
 */

/* Retourne la date du jour au format YYYY-MM-DD */
function today() {
  return new Date().toISOString().split('T')[0];
}

/* Jeu de données de démonstration utilisé si le localStorage est vide */
const DEFAULT_DATA = [
  {
    id: 1, titre: 'Salaire Maman',
    montant: 2400, date: today(),
    categorie: 'Revenu', payePar: 'Maman',
    type: 'revenu', isDraft: false
  },
  {
    id: 2, titre: 'Courses Carrefour',
    montant: 120.50, date: today(),
    categorie: 'Courses', payePar: 'Papa',
    type: 'commun', isDraft: false
  },
  {
    id: 3, titre: 'EDF',
    montant: 85, date: today(),
    categorie: 'Logement', payePar: 'Maman',
    type: 'commun', isDraft: false
  },
  {
    id: 4, titre: 'Cadeau perso',
    montant: 45, date: today(),
    categorie: 'Loisirs', payePar: 'Papa',
    type: 'personnel', isDraft: false
  },
  {
    id: 5, titre: 'Estimation Vacances Eté',
    montant: 1200, date: today(),
    categorie: 'Loisirs', payePar: 'Maman',
    type: 'commun', isDraft: true
  }
];

/* Clé de stockage localStorage */
const STORAGE_KEY = 'carnet_transactions';

/* Correspondance page → identifiant de vue (pour la nav active) */
const PAGE_MAP = {
  'index.html':      'dashboard',
  'ajouter.html':    'add',
  'historique.html': 'history',
  'brouillons.html': 'drafts',
  'archives.html':   'archives'
};

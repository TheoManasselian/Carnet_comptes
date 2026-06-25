/*
 * utils.js — Fonctions utilitaires de formatage et d'affichage.
 * Aucune dépendance sur les autres modules.
 */

/*
 * Formate un nombre en devise EUR (fr-FR).
 * @param {number} num
 * @returns {string}  ex : "1 234,50 €"
 */
function formatCurrency(num) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(num);
}

/*
 * Formate une date ISO en affichage court français.
 * @param {string} dateStr  ex : "2024-06-15"
 * @returns {string}        ex : "15 juin"
 */
function formatDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short'
  }).format(new Date(dateStr));
}

/*
 * Retourne l'emoji correspondant à une catégorie.
 * @param {string} cat
 * @returns {string}
 */
function getCategoryIcon(cat) {
  const icons = {
    'Courses':   '🛒',
    'Logement':  '🏠',
    'Transport': '🚗',
    'Sante':     '⚕️',
    'Loisirs':   '🎉',
    'Revenu':    '💰',
    'Autre':     '📦'
  };
  return icons[cat] || '🏷️';
}

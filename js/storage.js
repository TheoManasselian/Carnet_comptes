/*
 * storage.js — Persistance par fichier JSON mensuel via API serveur.
 * Chaque mois a son propre fichier : data/YYYY-MM.json
 *
 * API utilisée :
 *   GET  /api/data/2026-05   → lit   data/2026-05.json
 *   POST /api/data/2026-05   → écrit data/2026-05.json
 *   GET  /api/months         → liste tous les mois disponibles
 */

/*  Charge les transactions d'un mois donné  */
async function loadData(month = app.currentMonth) {
  try {
    const res  = await fetch(`/api/data/${month}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('loadData:', e);
    alert('⚠️ Impossible de charger les données.\nLe serveur est-il démarré (start.bat) ?');
    return [];
  }
}

/*  Sauvegarde les transactions du mois courant  */
async function saveData() {
  try {
    await fetch(`/api/data/${app.currentMonth}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(app.transactions)
    });
  } catch (e) {
    console.error('saveData:', e);
    alert('⚠️ Sauvegarde impossible.\nLe serveur est-il démarré (start.bat) ?');
  }
}

/*  Récupère la liste de tous les mois disponibles  */
async function fetchMonths() {
  try {
    const res = await fetch('/api/months');
    return await res.json();
  } catch { return []; }
}

/*
 * actions.js — Gestionnaires des interactions utilisateur.
 * Dépend de : storage.js (saveData), render.js (renderCurrentPage), main.js (app).
 * saveData() est désormais async — toutes les actions l'attendent avant de continuer.
 */

/*
 * Soumission du formulaire « Nouvelle opération ».
 * Navigue vers index.html ou brouillons.html selon le choix.
 * @param {Event} e
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  const newTx = {
    id:        Date.now(),
    titre:     document.getElementById('t-titre').value.trim(),
    montant:   parseFloat(document.getElementById('t-montant').value),
    date:      document.getElementById('t-date').value,
    categorie: document.getElementById('t-categorie').value,
    payePar:   document.getElementById('t-payepar').value,
    type:      document.getElementById('t-type').value,
    isDraft:   document.getElementById('t-brouillon').checked
  };

  app.transactions.push(newTx);
  await saveData();

  /* Redirection multi-page */
  window.location.href = newTx.isDraft ? 'brouillons.html' : 'index.html';
}

/*
 * Valide un brouillon (le bascule en opération définitive).
 * @param {number} id
 */
async function validateDraft(id) {
  const tx = app.transactions.find(t => t.id === id);
  if (tx) {
    tx.isDraft = false;
    await saveData();
    renderCurrentPage();
  }
}

/*
 * Supprime une opération après confirmation.
 * @param {number} id
 */
async function deleteTx(id) {
  if (confirm('Supprimer cette opération ?')) {
    app.transactions = app.transactions.filter(t => t.id !== id);
    await saveData();
    renderCurrentPage();
  }
}

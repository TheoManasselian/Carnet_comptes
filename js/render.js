/*
 * render.js — Fonctions de rendu du DOM.
 * Dépend de : config.js, utils.js, storage.js, main.js (app).
 */

/*  Tableau de bord  */
function renderDashboard() {
  let solde = 0, depenses = 0, revenus = 0;
  let payeMaman = 0, payePapa = 0;

  const valids = app.transactions.filter(t => !t.isDraft);

  valids.forEach(t => {
    const m = parseFloat(t.montant);
    if (t.type === 'revenu') {
      revenus += m;
      solde   += m;
    } else {
      depenses += m;
      solde    -= m;
      if (t.type === 'commun') {
        if (t.payePar === 'Maman') payeMaman += m;
        if (t.payePar === 'Papa')  payePapa  += m;
      }
    }
  });

  /* KPI */
  _setText('kpi-solde',    formatCurrency(solde));
  _setText('kpi-depenses', formatCurrency(depenses));
  _setText('kpi-revenus',  formatCurrency(revenus));

  /* Balance familiale */
  _setText('bal-maman-paye', formatCurrency(payeMaman));
  _setText('bal-papa-paye',  formatCurrency(payePapa));

  const balBox = document.getElementById('balance-result-box');
  if (balBox) {
    const diff = Math.abs(payeMaman - payePapa) / 2;
    if (diff === 0) {
      balBox.innerHTML = `<h3>✅ Les comptes sont équilibrés</h3><p>Personne ne se doit d'argent.</p>`;
    } else if (payeMaman > payePapa) {
      balBox.innerHTML = `<h3 class="balance-result red">Papa doit rembourser Maman</h3>
                          <p>Montant : <strong>${formatCurrency(diff)}</strong></p>`;
    } else {
      balBox.innerHTML = `<h3 class="balance-result red">Maman doit rembourser Papa</h3>
                          <p>Montant : <strong>${formatCurrency(diff)}</strong></p>`;
    }
  }

  /* Dernières opérations (5 max) */
  renderList('dashboard-recent-list', false, 5);
}

/*  Liste générique (historique / brouillons / widget récent)  */
/*
 * @param {string}  containerId  ID de l'élément conteneur
 * @param {boolean} showDrafts   true → brouillons, false → validées
 * @param {number|null} limit    Nombre max d'éléments (null = tous)
 */
function renderList(containerId, showDrafts, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  let list = app.transactions.filter(t => t.isDraft === showDrafts);
  list.sort((a, b) => new Date(b.date) - new Date(a.date));
  if (limit) list = list.slice(0, limit);

  if (list.length === 0) {
    container.innerHTML = `<p style="color:var(--muted);padding:1rem 0;text-align:center;">
      Aucune opération trouvée.
    </p>`;
    return;
  }

  list.forEach(t => {
    const isIncome = t.type === 'revenu';
    const sign     = isIncome ? '+' : '-';
    const amtClass = isIncome ? 'income' : 'expense';

    let tagHtml = '';
    if (t.type === 'commun')    tagHtml = `<span class="tag commun">50/50</span>`;
    if (t.type === 'personnel') tagHtml = `<span class="tag perso">Perso</span>`;

    const actionsBtns = showDrafts
      ? `<button class="btn btn-outline"
           style="padding:.2rem .5rem;font-size:.7rem;margin-top:.3rem;"
           onclick="validateDraft(${t.id})">Valider ✔</button>
         <button class="btn btn-outline"
           style="padding:.2rem .5rem;font-size:.7rem;margin-top:.3rem;color:var(--red);border-color:var(--red);"
           onclick="deleteTx(${t.id})">✖</button>`
      : `<button class="btn btn-outline"
           style="padding:.1rem .3rem;border:none;color:var(--muted);"
           onclick="deleteTx(${t.id})">🗑️</button>`;

    container.insertAdjacentHTML('beforeend', `
      <div class="transaction-item">
        <div class="t-left">
          <div class="t-icon">${getCategoryIcon(t.categorie)}</div>
          <div class="t-info">
            <p>${t.titre}</p>
            <div class="t-meta">
              <span>${formatDate(t.date)}</span>
              <span>· payé par ${t.payePar}</span>
              ${tagHtml}
            </div>
          </div>
        </div>
        <div class="t-right">
          <p class="t-amount ${amtClass}">${sign} ${formatCurrency(t.montant)}</p>
          ${actionsBtns}
        </div>
      </div>
    `);
  });
}

/*  Détection de la page courante et rendu adapté  */
function renderCurrentPage() {
  const page = _currentPage();
  if (page === 'index.html' || page === '')  renderDashboard();
  if (page === 'historique.html')            renderList('history-list', false);
  if (page === 'brouillons.html')            renderList('drafts-list',  true);
  /* ajouter.html et archives.html : pas de rendu dynamique nécessaire */
}

/*  Helpers privés  */
function _setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

function _currentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

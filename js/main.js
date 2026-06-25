/*
 * main.js — Point d'entrée de l'application.
 * Ordre de chargement : config.js → utils.js → storage.js → render.js → actions.js → main.js
 */

/*  État global  */
const app = {
  transactions:  [],
  currentMonth:  new Date().toISOString().slice(0, 7)  /* YYYY-MM */
};

/*  Initialisation  */
document.addEventListener('DOMContentLoaded', async function () {

  /* 1. Charger les données du mois courant */
  app.transactions = await loadData(app.currentMonth);

  /* 2. Date dans la topbar */
  const dateEl = document.getElementById('topbar-date');
  if (dateEl) {
    dateEl.innerText = new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date());
  }

  /* 3. Pré-remplir la date du formulaire */
  const dateInput = document.getElementById('t-date');
  if (dateInput) dateInput.value = today();

  /* 4. Nav active */
  const page       = window.location.pathname.split('/').pop() || 'index.html';
  const activeView = PAGE_MAP[page] || 'dashboard';
  const activeLink = document.querySelector(`.nav-item[data-view="${activeView}"]`);
  if (activeLink) activeLink.classList.add('active');

  /* 5. Sélecteur de mois dans la sidebar */
  await renderMonthSelector();

  /* 6. Rendu de la page */
  renderCurrentPage();
});

/*  Change le mois affiché  */
async function switchMonth(month) {
  app.currentMonth   = month;
  app.transactions   = await loadData(month);
  renderCurrentPage();

  /* Met à jour le sélecteur visuel */
  document.querySelectorAll('.month-option').forEach(el => {
    el.classList.toggle('active', el.dataset.month === month);
  });
}

/*  Injecte le sélecteur de mois dans la sidebar  */
async function renderMonthSelector() {
  const container = document.getElementById('month-selector');
  if (!container) return;

  const months = await fetchMonths();
  if (months.length === 0) return;

  container.innerHTML = months.map(m => {
    const label   = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
                        .format(new Date(m + '-01'));
    const isActive = m === app.currentMonth;
    return `<button class="month-option${isActive ? ' active' : ''}"
              data-month="${m}"
              onclick="switchMonth('${m}')">
              ${label}
            </button>`;
  }).join('');
}

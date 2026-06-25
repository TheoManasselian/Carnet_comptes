/**
 * server.js — Serveur local Carnet Familial
 * node server.js  →  http://localhost:3000
 *
 * Un fichier JSON par mois dans data/YYYY-MM.json
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT     = 3000;
const DATA_DIR = path.join(__dirname, 'data');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css' : 'text/css',
  '.js'  : 'application/javascript',
  '.json': 'application/json',
  '.png' : 'image/png',
  '.jpg' : 'image/jpeg',
  '.ico' : 'image/x-icon',
};

/* Mois courant YYYY-MM */
function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

/* Crée le fichier du mois si absent */
function ensureMonth(month) {
  const file = path.join(DATA_DIR, `${month}.json`);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2), 'utf8');
    console.log(`📄 Nouveau fichier créé : data/${month}.json`);
  }
  return file;
}

/* Lit un fichier mois */
function readMonth(month) {
  try {
    return JSON.parse(fs.readFileSync(ensureMonth(month), 'utf8'));
  } catch { return []; }
}

/* Écrit un fichier mois */
function writeMonth(month, data) {
  fs.writeFileSync(ensureMonth(month), JSON.stringify(data, null, 2), 'utf8');
}

/* Liste tous les mois disponibles */
function listMonths() {
  return fs.readdirSync(DATA_DIR)
    .filter(f => /^\d{4}-\d{2}\.json$/.test(f))
    .map(f => f.replace('.json', ''))
    .sort()
    .reverse();
}

/* Collecte le body d'une requête POST */
function collectBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; });
    req.on('end',  () => resolve(body));
    req.on('error', reject);
  });
}

/* SERVEUR */
const server = http.createServer(async (req, res) => {
  const url    = req.url.split('?')[0];
  const method = req.method;

  /* CORS pour fetch depuis file:// (inutile ici mais propre) */
  res.setHeader('Access-Control-Allow-Origin', '*');

  /* API : liste des mois */
  if (method === 'GET' && url === '/api/months') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(listMonths()));
  }

  /* API : lecture d'un mois */
  const getMatch = url.match(/^\/api\/data\/(\d{4}-\d{2})$/);
  if (method === 'GET' && getMatch) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(readMonth(getMatch[1])));
  }

  /* API : écriture d'un mois */
  const postMatch = url.match(/^\/api\/data\/(\d{4}-\d{2})$/);
  if (method === 'POST' && postMatch) {
    try {
      const body = await collectBody(req);
      writeMonth(postMatch[1], JSON.parse(body));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    } catch {
      res.writeHead(400);
      return res.end('JSON invalide');
    }
  }

  /* Fichiers statiques */

  /* Racine → vrai redirect 302 vers /html/index.html */
  /* (le navigateur met à jour l'URL → les liens relatifs fonctionnent) */
  if (url === '/') {
    res.writeHead(302, { Location: '/html/index.html' });
    return res.end();
  }

  const filePath = path.join(__dirname, url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end(`Fichier introuvable : ${url}`);
    }
    const mime = MIME[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    res.end(content);
  });
});

/* Démarrage */
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
ensureMonth(currentMonth());   /* crée le mois courant si absent */

server.listen(PORT, () => {
  console.log(`\n✅  Carnet Familial démarré`);
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   Mois courant : ${currentMonth()}\n`);
});

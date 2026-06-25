# Carnet Familial 💰

Carnet de compte bancaire numérique, fonctionnant **en local**.
Suivez vos dépenses et recettes mois par mois, sans cloud ni base de données externe : toutes vos données restent sur votre machine.

## ✨ Fonctionnalités

- Suivi des comptes organisé **par mois** (un fichier JSON par mois)
- Navigation entre les mois via un sélecteur dans le menu de gauche
- Création automatique du fichier du mois suivant
- Données stockées localement, faciles à sauvegarder ou à transférer
- Interface web légère (HTML / CSS / JavaScript) servie par un petit serveur Node.js

## 🛠️ Prérequis

- [Node.js](https://nodejs.org/) installé sur la machine

## 🚀 Lancement

### Windows
Double-cliquez sur :
```
start.bat
```

### macOS / Linux
```bash
./start.sh
```

Puis ouvrez votre navigateur à l'adresse :
```
http://localhost:3000
```

## 📁 Structure des données

Chaque mois possède son propre fichier JSON dans le dossier `data/` :

```
data/
  2026-05.json   ← mai 2026
  2026-06.json   ← juin 2026
  ...
```

## 🗓️ Début d'un nouveau mois

Pour générer automatiquement le fichier du mois suivant :

### Windows
Double-cliquez sur :
```
nouveau-mois.bat
```

## 💾 Sauvegarde / changement de PC

Copiez le dossier entier vers la nouvelle machine. Vos données se trouvent dans le dossier `data/`.
Node.js doit être installé sur le nouveau PC.

## 🗂️ Arborescence du projet

```
Carnet_comptes/
├── css/                # Feuilles de style
├── data/               # Fichiers de données mensuels (JSON)
├── html/               # Pages de l'interface
├── img/                # Images / ressources graphiques
├── js/                 # Scripts front-end
├── server.js           # Serveur Node.js (local)
├── start.bat           # Lancement (Windows)
├── start.sh            # Lancement (macOS / Linux)
├── nouveau-mois.bat    # Création du fichier du mois suivant
├── Carnet.lnk          # Raccourci Windows
└── README.txt          # Notice d'origine
```

## 🧱 Technologies

- HTML, CSS, JavaScript (front-end)
- Node.js (serveur local)
- Stockage en fichiers JSON

## 📝 Licence

Aucune licence spécifiée à ce jour. Ajoutez un fichier `LICENSE` si vous souhaitez préciser les conditions d'utilisation.
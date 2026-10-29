# Instructions pour Claude

## Mémoire de travail

La mémoire de tout le travail sur Xerxès est un vault Obsidian situé dans le dépôt **privé** `timotheebiesel54/Xerxes---3D-STL`, dossier `Xerxes-Vault/` (pas ici : ce dépôt est public).

À chaque session sur ce dépôt :
1. Clone aussi `timotheebiesel54/Xerxes---3D-STL` (l'ajouter à la session si besoin) et lis `Xerxes-Vault/00 Accueil.md`, `Xerxes-Vault/Points ouverts.md` et `Xerxes-Vault/04 Technique/Architecture du site.md`.
2. Avant de terminer, suis le protocole décrit dans le `CLAUDE.md` de ce dépôt-là : note de session dans `02 Sessions/`, décisions, points ouverts, chronologie, historique des PR. Commit et push sur la branche de la session.

## Conventions du dépôt
- HTML/CSS/JS vanilla, sans bundler ; scripts classiques chargés dans un ordre fixe, `js/main.js` en dernier.
- Aucune nouvelle dépendance : GSAP, ScrollTrigger et Lenis sont dans `js/vendor/`.
- Messages de commit en français (« Ajoute… », « Corrige… », préfixe de page si utile : « Maison : … »).

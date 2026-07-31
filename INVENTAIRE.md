# Inventaire de `index.html`

Document produit sur la branche `refactor-multifichier`, sans aucune modification
de `index.html`. Sert de base à un futur découpage en plusieurs fichiers
(HTML / CSS / JS).

## 1. Répartition des lignes

Le fichier compte **3816 lignes** au total (la dernière ligne, `</html>`, n'a
pas de retour à la ligne final, d'où un `wc -l` à 3815).

| Zone                          | Lignes          | Nombre de lignes | % du fichier |
|--------------------------------|-----------------|------------------|--------------|
| HTML (hors style/script)       | 1–6, 1761–1825, 3814–3816 | 74      | 1.9 %  |
| `<style>` (un seul bloc)       | 7–1760          | 1754             | 46.0 % |
| `<script>` (5 blocs)           | 1826–3813       | 1988             | 52.1 % |
| **Total**                      |                 | **3816**         | 100 %  |

## 2. Blocs `<style>` et `<script>`

| # | Type     | Début | Fin  | Lignes | Contenu |
|---|----------|-------|------|--------|---------|
| 1 | `<style>` | 7     | 1760 | 1754   | Tout le CSS du site (reset, layout, composants, pages) |
| 2 | `<script>` | 1826  | 1827 | 2      | Lenis 1.3.25, minifié, vendorisé inline |
| 3 | `<script>` | 1828  | 1839 | 12     | GSAP core 3.15.0, vendorisé inline |
| 4 | `<script>` | 1840  | 1851 | 12     | GSAP ScrollTrigger 3.15.0, vendorisé inline |
| 5 | `<script>` | 1852  | 1883 | 32     | Constantes JS d'images encodées en base64 (logo, hero, décor, portraits composition) |
| 6 | `<script>` | 1884  | 3813 | 1930   | Toute la logique applicative (routing SPA, animations, rendu des pages, données produits) |

## 3. Variables CSS déclarées dans `:root` (ligne 32–38)

| Variable        | Valeur     | Occurrences de `var(--nom)` |
|------------------|-----------|------------------------------|
| `--black`        | `#0a0a0a` | 7                             |
| `--white`        | `#f5f2ec` | 27                            |
| `--gold`         | `#e8d5b0` | 46                            |
| `--gold-light`   | `#f1e5ca` | 29                            |
| `--grey`         | `#6b6b6b` | 16                            |

Total : **125** usages de `var(--...)` dans le fichier.

## 4. Règles CSS où une couleur sombre est utilisée comme fond

Couleurs considérées sombres : `var(--black)` (`#0a0a0a`), `#0e0e0e`, et les
déclinaisons `rgba(10,10,10,...)`.

| Sélecteur                    | Ligne | Déclaration |
|-------------------------------|-------|-------------|
| `body`                        | 43    | `background: var(--black);` |
| `.nav-mobile-overlay`         | 138   | `background: rgba(10, 10, 10, 0.97);` |
| `.xs-card-face`               | 430   | `background-color: #0a0a0a;` |
| `.fiche-img-wrap`             | 619   | `background: #0e0e0e;` |
| `.fiche-img-wrap::after`      | 630   | `background: radial-gradient(ellipse at center, transparent 40%, rgba(10,10,10,0.5) 100%);` |
| `footer`                      | 889   | `background: var(--black);` |
| `.compo-veil`                 | 1374  | `background: var(--black);` |
| `.compo-panel`                | 1389  | `background: var(--black);` |
| `.newsletter-section`         | 1538  | `background: rgba(10,10,10,0.55);` |
| `.xs-suggestion-heading`      | 1642  | `background: var(--black);` |
| `.xs-cats-section`            | 1678  | `background: var(--black);` |
| `.xs-focus-veil`              | 1747  | `background:var(--black);` |
| `.xs-focus-content`           | 1756  | `background:linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,.4) 45%, rgba(10,10,10,.82) 100%)` |

(Les fonds `var(--gold)`, `rgba(201,169,110,...)` et les dégradés de swatches
matières/coloris ne sont pas comptés ici : ce sont des tons or/clairs, pas des
fonds sombres.)

## 5. Constantes JS contenant du base64 (`data:image/...`)

| Constante              | Ligne | Type MIME     | Poids approx. |
|-------------------------|-------|---------------|---------------|
| `XERXES_LOGO_IMG`       | 1853  | `image/webp`  | 14.7 Ko |
| `XS_ONE_MAIN_IMG`       | 1854  | `image/webp`  | 70.3 Ko |
| `XS_ONE_DECOR_IMGS[0..12]` (13 images) | 1856–1868 | `image/webp` (×13) | 249.3 Ko cumulés (10.1 à 32.4 Ko/image) |
| `COMPO_SLOT_MEDUSA_IMG` | 1871  | `image/webp`  | 54.5 Ko |
| `COMPO_SLOT_ATHENA_IMG` | 1872  | `image/webp`  | 59.5 Ko |
| `XS_HERO_IMG_1`         | 1880  | `image/webp`  | 29.1 Ko |
| `XS_HERO_IMG_2`         | 1881  | `image/webp`  | 54.9 Ko |
| `XS_HERO_IMG_3`         | 1882  | `image/webp`  | 119.7 Ko |
| `APHRODITE_OR_IMG`      | 3519  | `image/png`   | 81.8 Ko |

Poids cumulé des images encodées en base64 : **≈ 734 Ko** de données binaires
(soit ~978 Ko de texte base64 dans le fichier source, du fait du surcoût
d'encodage de 33 %).

Note : `XS_CAT_HOMMES_IMG`, `XS_CAT_FEMMES_IMG`, `XS_CAT_SUR_MESURE_IMG`
(lignes 1876–1878) sont des alias de `XS_ONE_DECOR_IMGS[1..3]`, pas de
nouvelles données base64.

## 6. Fonctions JS de premier niveau (53)

| Fonction | Ligne | Rôle |
|---|---|---|
| `toggleMobileMenu` | 1897 | Bascule l'overlay du menu mobile et met en pause/reprend le scroll Lenis. |
| `closeMobileMenu` | 1903 | Ferme l'overlay du menu mobile et relance le scroll Lenis. |
| `xsCreateBlinds` | 1917 | Génère les rectangles SVG (stores) d'un calque du hero pour la transition au scroll. |
| `xsOpenBlinds` | 1956 | Anime (GSAP) l'ouverture d'un jeu de stores. |
| `xsBuildMasterTimeline` | 1976 | Construit la timeline GSAP/ScrollTrigger qui enchaîne texte + ouverture des blinds du hero. |
| `xsUpdateLayout` | 2020 | Recalcule les dimensions SVG du hero, régénère les blinds et la timeline (resize). |
| `xsInitProgressBar` | 2058 | Crée le ScrollTrigger pilotant la barre de progression du hero. |
| `navigate` | 2092 | Change de vue SPA : fade, purge ScrollTrigger/timelines/focus actifs, appelle `render()`. |
| `render` | 2109 | Routeur : appelle la fonction de rendu correspondant à la vue demandée. |
| `renderContact` | 2123 | Construit le HTML de la page Contact. |
| `renderMentions` | 2148 | Construit le HTML des Mentions légales. |
| `renderCGV` | 2182 | Construit le HTML des Conditions générales de vente. |
| `renderConfidentialite` | 2269 | Construit le HTML de la Politique de confidentialité. |
| `renderRetour` | 2341 | Construit le HTML de la Politique de retour. |
| `renderMaison` | 2398 | Construit le HTML de la page "La Maison" (storytelling de marque). |
| `compoMatiereLabel` | 2458 | Retourne le libellé d'une matière du configurateur Éditions. |
| `renderComposition` | 2465 | Initialise l'état du configurateur et construit le HTML de la page Éditions. |
| `compoSlotHTML` | 2509 | Génère le HTML d'un emplacement du configurateur (rempli ou vide). |
| `compoRenderSlots` | 2541 | Réinjecte le HTML des emplacements et affiche/masque le lien "élargir". |
| `compoExpand` | 2549 | Ajoute un emplacement (jusqu'à 4) avec animation FLIP GSAP des emplacements existants. |
| `compoOpenSlot` | 2582 | Ouvre le panneau latéral de sélection pour un emplacement. |
| `compoCloseSlot` | 2594 | Ferme le panneau/voile du configurateur. |
| `compoStepBack` | 2602 | Revient à l'étape précédente du parcours de sélection. |
| `compoChooseType` | 2608 | Enregistre le type choisi (bague/bracelet), passe à l'étape modèle. |
| `compoChooseModele` | 2616 | Enregistre le modèle choisi, passe à l'étape matière. |
| `compoChooseMatiere` | 2623 | Finalise l'emplacement, ferme le panneau, rafraîchit slots + récap. |
| `compoRenderPanel` | 2632 | Construit le HTML du panneau selon l'étape courante. |
| `compoNarrative` | 2693 | Retourne le texte narratif du récapitulatif selon le nombre de pièces. |
| `compoRenderRecap` | 2698 | Construit ou masque le récapitulatif de l'édition composée. |
| `compoRequestAccess` | 2719 | Prépare le message pré-rempli puis redirige vers la page Contact. |
| `handleContact` | 2726 | Intercepte la soumission du formulaire de contact, affiche la confirmation. |
| `handleNewsletter` | 2731 | Valide l'email et affiche l'état "inscrit" du formulaire newsletter. |
| `renderHome` | 2742 | Construit le HTML de la page d'accueil (hero, galerie, catégories, newsletter). |
| `initHomeAnimations` | 2871 | Purge les ScrollTrigger existants et initialise hero, barre de progression, galerie. |
| `xsGalleryItemHTML` | 2917 | Génère le HTML d'un item de la galerie horizontale. |
| `xsGalleryInit` | 2926 | Initialise la bande de galerie en boucle infinie et le drag souris. |
| `xsGalleryRenderFocus` | 2988 | Remplit l'image/texte de la vue focus pour l'item sélectionné. |
| `xsFocusPrefersReducedMotion` | 2997 | Détecte la préférence utilisateur "reduced motion". |
| `xsFocusFreezeScroll` | 3003 | Bloque/débloque le scroll de la page et de la bande pendant le focus. |
| `xsGalleryOpenFocus` | 3013 | Anime (FLIP manuel GSAP) l'ouverture de la vue focus depuis la vignette cliquée. |
| `xsGalleryCloseFocus` | 3061 | Anime la fermeture de la vue focus et le retour à la vignette d'origine. |
| `xsGalleryForceCloseFocus` | 3097 | Ferme instantanément la vue focus sans animation (resize/navigation). |
| `xsSplitTitleChars` | 3130 | Découpe un titre en spans par caractère pour l'animation lettre par lettre. |
| `xsGetCarouselCellTransforms` | 3144 | Calcule les transforms CSS (rotateY/translateZ) des cellules d'un carrousel 3D. |
| `xsSetupCarouselCells` | 3152 | Applique les transforms calculés aux cellules d'un carrousel donné. |
| `xsCreateCarouselTimeline` | 3160 | Construit la timeline GSAP/ScrollTrigger de rotation du carrousel + reveal du titre. |
| `xsFillProductCardImages` | 3194 | Assigne les images (pool base64) aux cartes produit via la variable CSS `--img`. |
| `xsInitProductCarousels` | 3201 | Initialise tous les carrousels 3D de la page Collection. |
| `renderCollection` | 3211 | Construit le HTML de la page Collection (Bagues/Bracelets, scènes de carrousels). |
| `renderFiche` | 3630 | Construit le HTML de la fiche produit (visuel, coloris, tailles, CTA) pour un modèle donné. |
| `ficheSelectSwatch` | 3750 | Met à jour le coloris sélectionné (dégradé SVG ou photo) sur la fiche produit. |
| `selectTaille` | 3775 | Marque la taille sélectionnée sur la fiche produit. |
| `handleJoin` | 3781 | Intercepte la soumission d'un formulaire d'inscription (compteur de places, message de succès). |

(Fonctions imbriquées non comptées ici, car non "de premier niveau" :
`xsGalleryOnDragMove`/`xsGalleryOnDragEnd` dans `xsGalleryInit`, `buildSVG`
dans `renderFiche`.)

## 7. Scripts CDN chargés et globales exposées

**Aucun script n'est chargé depuis un CDN** (aucune balise `<script src="...">`,
aucun `<link>`). Les trois bibliothèques tierces sont vendorisées et collées
intégralement en inline dans le fichier :

| Bibliothèque | Bloc `<script>` | Mécanisme d'exposition | Globale(s) exposée(s) |
|---|---|---|---|
| Lenis 1.3.25 | 1826–1827 | `globalThis.Lenis = p` en fin d'IIFE | `window.Lenis` |
| GSAP core 3.15.0 | 1828–1839 | UMD (`typeof exports`/`define.amd`, fallback `window`) | `window.gsap` |
| GSAP ScrollTrigger 3.15.0 | 1840–1851 | UMD, se greffe sur l'objet `gsap` existant | `window.ScrollTrigger` (utilisé via `gsap.registerPlugin(ScrollTrigger)`, ligne 1890) |

## Risques pour un découpage en modules

1. **Handlers `onclick="..."` en attributs HTML → dépendance à la portée
   globale.** Toutes les fonctions appelées depuis les templates générés
   (`navigate`, `compoOpenSlot`, `compoChooseType`, `ficheSelectSwatch`,
   `selectTaille`, `handleContact`, `handleNewsletter`, `handleJoin`,
   `toggleMobileMenu`, `closeMobileMenu`, `compoExpand`, `compoStepBack`,
   `compoCloseSlot`, `compoRequestAccess`, `xsGalleryOpenFocus`,
   `xsGalleryCloseFocus`, etc.) sont des `function` de script classique, donc
   automatiquement globales (`window.xxx`). Si le JS est réparti en modules ES
   (`type="module"`), les déclarations deviennent scoped au module et ces
   `onclick` échoueront (`ReferenceError`) sauf à réexposer explicitement
   chaque fonction sur `window`.

2. **Ordre d'exécution des 3 bibliothèques vendorisées.** `gsap.registerPlugin
   (ScrollTrigger)` (ligne 1890) suppose que les globales `window.gsap` et
   `window.ScrollTrigger` existent déjà, et `new Lenis(...)` (ligne 1891)
   suppose que `globalThis.Lenis` est déjà assigné. Cela ne fonctionne que
   parce que les blocs `<script>` s'exécutent dans l'ordre où ils apparaissent
   dans le fichier. Un découpage doit impérativement conserver cet ordre
   (Lenis → GSAP core → ScrollTrigger → app) ou passer par de vrais imports.

3. **`COLORIS_MAP` déclaré après son point d'utilisation.** `renderFiche`
   (ligne 3630) référence `COLORIS_MAP`, mais celui-ci n'est déclaré qu'à la
   ligne 3799, *après* la fonction. Cela ne casse rien aujourd'hui car
   `renderFiche` n'est appelée qu'au runtime (via `render('home')` en fin de
   script, bien après l'initialisation de toutes les constantes) — mais c'est
   une dépendance d'ordre fragile en `const` (zone morte temporelle) qui
   cassera si `COLORIS_MAP` est déplacé dans un module importé après
   `renderFiche`, ou si `renderFiche` est appelée plus tôt dans un nouveau
   découpage.

4. **`MODELES` et les constantes base64 doivent précéder leur usage.**
   `MODELES` (ligne 3521) est utilisé par `renderFiche` ; `XERXES_LOGO_IMG`,
   `XS_HERO_IMG_1/2/3`, `XS_ONE_MAIN_IMG`, `XS_ONE_DECOR_IMGS`,
   `COMPO_SLOT_MEDUSA_IMG`/`ATHENA_IMG` (bloc 1852–1883) sont utilisés dans le
   bloc de script suivant (1884–3813). Le découpage en fichiers séparés doit
   garantir que ces modules "données/assets" sont chargés/importés avant les
   modules "rendu" qui les consomment.

5. **État mutable partagé entre fonctions via variables de module implicites.**
   Plusieurs groupes de fonctions communiquent uniquement par des variables
   `let`/`const` déclarées en tête de script, sans paramètres explicites :
   `xsMaster`, `xsBlindsSets`, `xsResizeTimer` (hero/blinds) ;
   `xsCarouselTimelines` (carrousels, purgé dans `navigate`) ; `compoState`
   (configurateur) ; `xsFocusActive` / `xsFocusAnimating` / `xsFocusOriginEl`
   (galerie focus). Découper ces fonctions dans des fichiers distincts sans
   regrouper aussi leur état partagé cassera silencieusement leur
   synchronisation.

6. **Couplage global caché via `window.__compoPrefill` et
   `window.currentFicheSlug`.** `compoRequestAccess` écrit
   `window.__compoPrefill`, lu uniquement par `renderContact` ; `renderFiche`
   écrit `window.currentFicheSlug`, lu uniquement par `ficheSelectSwatch`. Ce
   sont des dépendances croisées entre modules "Composition"/"Contact" et
   "Fiche produit" qui ne sont visibles nulle part dans une signature de
   fonction.

7. **Nettoyage centralisé des animations dans `navigate()`.** `navigate()`
   tue globalement tous les `ScrollTrigger` actifs et les timelines de
   carrousel (`ScrollTrigger.getAll().forEach(st => st.kill())`,
   `xsCarouselTimelines.forEach(tl => tl.kill())`) avant de rendre la
   nouvelle vue. Toute nouvelle vue/module qui créerait ses propres
   ScrollTrigger devra soit s'enregistrer dans ce nettoyage centralisé, soit
   dupliquer sa propre logique de purge — sinon fuite mémoire et animations
   fantômes lors des changements de page.

8. **IDs DOM comme unique contrat entre templates et logique.** Le lien entre
   le HTML généré par les fonctions `render*`/`compo*` et la logique qui les
   pilote passe uniquement par des `document.getElementById('...')` avec des
   chaînes en dur (`app`, `compo-veil`, `compo-panel-inner`, `xs-focus-veil`,
   `xs-focus-img`, `fiche-svg`, `fiche-photo`, `g-fiche`, `nl-input`,
   `success-`+type, etc.). Aucun contrôle statique ne garantit leur
   cohérence : séparer templates et logique en fichiers différents introduit
   un risque de désynchronisation silencieuse (l'ID change d'un côté, pas de
   l'autre).

9. **Variable CSS `--img` définie uniquement en JS.** `xsFillProductCardImages`
   fait `card.style.setProperty('--img', ...)`, consommée par la règle CSS de
   `.xs-card` dans le bloc `<style>`. Si CSS et JS sont séparés dans des
   fichiers distincts, ce nom de variable (`--img`) devient un contrat
   implicite entre les deux fichiers, sans vérification à la compilation.

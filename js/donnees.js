// ─── donnees.js ───
// Donnees statiques du site Xerxes : chemins d'images, catalogue produits,
// palette de coloris et autres structures de contenu. Aucune fonction ici.

// ─── Chemins d'images ───
    const XS_ONE_MAIN_IMG = "images/site/one-main.webp";
    const XS_ONE_DECOR_IMGS = [
      "images/site/decor-00.webp",
      "images/site/decor-01.webp",
      "images/site/decor-02.webp",
      "images/site/decor-03.webp",
      "images/site/decor-04.webp",
      "images/site/decor-05.webp",
      "images/site/decor-06.webp",
      "images/site/decor-07.webp",
      "images/site/decor-08.webp",
      "images/site/decor-09.webp",
      "images/site/decor-10.webp",
      "images/site/decor-11.webp",
      "images/site/decor-12.webp",
    ];

    const COMPO_SLOT_MEDUSA_IMG = "images/medaillons/meduse.webp";
    const COMPO_SLOT_ATHENA_IMG = "images/medaillons/athena.webp";

    // Placeholders temporaires pour la section Hommes/Femmes/Sur mesure — à remplacer
    // par les vraies photos (une constante par carte, pas de refonte de structure requise).
    const XS_CAT_HOMMES_IMG = XS_ONE_DECOR_IMGS[1];
    const XS_CAT_FEMMES_IMG = XS_ONE_DECOR_IMGS[2];
    const XS_CAT_SUR_MESURE_IMG = XS_ONE_DECOR_IMGS[3];

    const XS_HERO_IMG_1 = "images/site/hero-1.webp";
    const XS_HERO_IMG_2 = "images/site/hero-2.webp";

    const XS_EDITION_IMG = "images/site/edition-gravure.webp";

    // Source de verite unique de la sequence hero de la page d'accueil : source de
    // l'image, titre, sous-titre, texte, libelle du bouton et route de destination
    // (slug reel du routeur, voir render() dans main.js). Le nombre d'images n'est
    // ecrit en dur nulle part ailleurs ; tout se derive de XS_HERO_SLIDES.length.
    const XS_HERO_SLIDES = [
      {
        src: XS_HERO_IMG_1,
        titre: 'Genève',
        sousTitre: "L'origine",
        texte: "Une maison discrète, entre lac et lumière, où chaque pièce prend forme.",
        bouton: 'Découvrir les bagues',
        route: 'bagues',
      },
      {
        src: XS_HERO_IMG_2,
        titre: "L'heure dorée",
        sousTitre: "L'instant précis",
        texte: "Le crépuscule comme mesure du temps; l'or comme matière du souvenir.",
        bouton: 'Découvrir les bracelets',
        route: 'bracelets',
      },
    ];

const APHRODITE_OR_IMG = "images/produits/bague-aphrodite-or.png";

    // ─── DONNÉES MODÈLES ───
    const MODELES = {
      // ── BAGUES ──
      aphrodite: {
        genre: 'bagues',
        collection: 'Femme',
        type: 'bague',
        nom: 'Aphrodite',
        intention: 'La plus ancienne des forces. Un trait qui tourne, sans début ni fin. Aphrodite ne cherche pas à s\u2019imposer, elle s\u2019impose.',
        materiaux: [
          { label: 'Métal', valeur: 'Or 18 carats' },
          { label: 'Finition', valeur: 'Polie miroir' },
          { label: 'Épaisseur', valeur: '1,8 mm' },
          { label: 'Poids', valeur: '3,2 g' },
        ],
        tailles: ['48','50','52','54','56','58'],
        edition: '50',
        svgStroke: 9,
        svgType: 'ring',
      },
      gaia: {
        genre: 'bagues',
        collection: 'Femme',
        type: 'bague',
        nom: 'Gaïa',
        intention: 'Large, présente, affirmée. Gaïa est la bague de celles qui n\u2019ont pas besoin d\u2019explications. Elle parle avant vous.',
        materiaux: [
          { label: 'Métal', valeur: 'Or 18 carats' },
          { label: 'Finition', valeur: 'Brossée mate' },
          { label: 'Épaisseur', valeur: '4 mm' },
          { label: 'Poids', valeur: '6,8 g' },
        ],
        tailles: ['48','50','52','54','56','58'],
        edition: '50',
        svgStroke: 16,
        svgType: 'ring',
      },
      eos: {
        genre: 'bagues',
        collection: 'Femme',
        type: 'bague',
        nom: 'Éos',
        intention: 'Déesse de l\u2019aurore, elle précède la lumière. Éos est la bague de celles qui annoncent ce qui vient, et le portent avant les autres.',
        materiaux: [
          { label: 'Métal', valeur: 'Or 18 carats' },
          { label: 'Finition', valeur: 'Biseautée, poli miroir' },
          { label: 'Épaisseur', valeur: '3 mm' },
          { label: 'Poids', valeur: '5,1 g' },
        ],
        tailles: ['48','50','52','54','56','58'],
        edition: '50',
        svgStroke: 12,
        svgType: 'ring-beveled',
      },
      // ── BRACELETS ──
      cephale: {
        genre: 'bracelets',
        collection: 'Homme',
        type: 'bracelet',
        nom: 'Céphale',
        intention: 'Chasseur infatigable, époux fidèle. Céphale est le bracelet de ceux qui avancent sans regarder derrière, portant leurs engagements comme une armure légère.',
        materiaux: [
          { label: 'Matière', valeur: 'Cuir de veau pleine fleur' },
          { label: 'Fermoir', valeur: 'Acier inoxydable 316L' },
          { label: 'Largeur', valeur: '12 mm' },
          { label: 'Longueur', valeur: '19 cm ajustable' },
        ],
        tailles: ['S','M','L','XL'],
        edition: '50',
        svgStroke: 0,
        svgType: 'bracelet-thin',
      },
      achille: {
        genre: 'bracelets',
        collection: 'Homme',
        type: 'bracelet',
        nom: 'Achille',
        intention: 'Le plus grand des guerriers, invincible sauf en un point. Achille rappelle que la force n\u2019exclut pas la vulnérabilité, elle la sublime.',
        materiaux: [
          { label: 'Matière', valeur: 'Corde de soie tressée' },
          { label: 'Fermoir', valeur: 'Or vermeil 18 carats' },
          { label: 'Largeur', valeur: '8 mm' },
          { label: 'Longueur', valeur: '18,5 cm ajustable' },
        ],
        tailles: ['S','M','L','XL'],
        edition: '50',
        svgStroke: 0,
        svgType: 'bracelet-cord',
      },
      heracles: {
        genre: 'bracelets',
        collection: 'Homme',
        type: 'bracelet',
        nom: 'Héraclès',
        intention: 'Douze travaux, une seule volonté. Héraclès est le bracelet des épreuves traversées, de ce qu\u2019on ne montre pas mais qu\u2019on porte.',
        materiaux: [
          { label: 'Matière', valeur: 'Mailles d\u2019acier milanais' },
          { label: 'Fermoir', valeur: 'Magnétique, acier brossé' },
          { label: 'Largeur', valeur: '6 mm' },
          { label: 'Longueur', valeur: '20 cm ajustable' },
        ],
        tailles: ['S','M','L','XL'],
        edition: '50',
        svgStroke: 0,
        svgType: 'bracelet-chain',
      },
    };

    const COLORIS_MAP = {
      bagues: {
        or:     { label: 'Or jaune',  stops: ['#f5d78e','#c9a96e','#7a5c28'], swatch: 'radial-gradient(circle at 35% 35%, #f5d78e, #c9a96e 55%, #7a5c28)' },
        rose:   { label: 'Or rose',   stops: ['#f4c5b0','#c9836a','#7a3a20'], swatch: 'radial-gradient(circle at 35% 35%, #f4c5b0, #c9836a 55%, #7a3a20)' },
        argent: { label: 'Argent',    stops: ['#f0f0f0','#c8c8c8','#888888'], swatch: 'radial-gradient(circle at 35% 35%, #f0f0f0, #c8c8c8 55%, #888888)' },
      },
      bracelets: {
        bleu:    { label: 'Bleu nuit',  stops: ['#7ba7d4','#3a6fa8','#1a3a60'], swatch: 'radial-gradient(circle at 35% 35%, #7ba7d4, #3a6fa8 55%, #1a3a60)' },
        vert:    { label: 'Vert forêt', stops: ['#7db88a','#3d7a50','#1a4028'], swatch: 'radial-gradient(circle at 35% 35%, #7db88a, #3d7a50 55%, #1a4028)' },
        bordeaux:{ label: 'Bordeaux',   stops: ['#c47a8a','#8b2a42','#4a0f1e'], swatch: 'radial-gradient(circle at 35% 35%, #c47a8a, #8b2a42 55%, #4a0f1e)' },
      },
    };

    // ─── CATALOGUE : seule source de vérité pour la vue focus des duos (grille duo,
    // js/duo.js) — matières, mesures, description courte, prix et détail (composition,
    // entretien) par modèle. Les teintes reprennent les mêmes valeurs que COLORIS_MAP, la
    // composition les mêmes valeurs que MODELES.materiaux, pour rester visuellement et
    // factuellement cohérentes ; le tout est néanmoins déclaré ici en propre, CATALOGUE ne
    // lisant jamais MODELES à l'exécution.
    const CATALOGUE = {
      aphrodite: {
        type: 'bague',
        nom: 'Aphrodite',
        description: 'Un trait continu, sans début ni fin.',
        prix: 480,
        matieres: [
          { key: 'or',     label: 'Or jaune', swatch: 'radial-gradient(circle at 35% 35%, #f5d78e, #c9a96e 55%, #7a5c28)' },
          { key: 'rose',   label: 'Or rose',  swatch: 'radial-gradient(circle at 35% 35%, #f4c5b0, #c9836a 55%, #7a3a20)' },
          { key: 'argent', label: 'Argent',   swatch: 'radial-gradient(circle at 35% 35%, #f0f0f0, #c8c8c8 55%, #888888)' },
        ],
        mesures: ['48', '50', '52', '54', '56', '58'],
        composition: [
          { label: 'Métal', valeur: 'Or 18 carats' },
          { label: 'Finition', valeur: 'Polie miroir' },
          { label: 'Épaisseur', valeur: '1,8 mm' },
          { label: 'Poids', valeur: '3,2 g' },
        ],
        entretien: "Éviter le contact prolongé avec l'eau chlorée et les parfums. Polir avec un chiffon doux ; ranger séparément pour préserver l'éclat du poli miroir.",
      },
      gaia: {
        type: 'bague',
        nom: 'Gaïa',
        description: 'Large et affirmée, elle parle avant vous.',
        prix: 620,
        matieres: [
          { key: 'or',     label: 'Or jaune', swatch: 'radial-gradient(circle at 35% 35%, #f5d78e, #c9a96e 55%, #7a5c28)' },
          { key: 'rose',   label: 'Or rose',  swatch: 'radial-gradient(circle at 35% 35%, #f4c5b0, #c9836a 55%, #7a3a20)' },
          { key: 'argent', label: 'Argent',   swatch: 'radial-gradient(circle at 35% 35%, #f0f0f0, #c8c8c8 55%, #888888)' },
        ],
        mesures: ['48', '50', '52', '54', '56', '58'],
        composition: [
          { label: 'Métal', valeur: 'Or 18 carats' },
          { label: 'Finition', valeur: 'Brossée mate' },
          { label: 'Épaisseur', valeur: '4 mm' },
          { label: 'Poids', valeur: '6,8 g' },
        ],
        entretien: "Nettoyer à l'eau tiède savonneuse et un chiffon doux. La finition brossée s'entretient sans polissage, qui en atténuerait le grain mat.",
      },
      eos: {
        type: 'bague',
        nom: 'Éos',
        description: "La bague de celles qui annoncent ce qui vient.",
        prix: 540,
        matieres: [
          { key: 'or',     label: 'Or jaune', swatch: 'radial-gradient(circle at 35% 35%, #f5d78e, #c9a96e 55%, #7a5c28)' },
          { key: 'rose',   label: 'Or rose',  swatch: 'radial-gradient(circle at 35% 35%, #f4c5b0, #c9836a 55%, #7a3a20)' },
          { key: 'argent', label: 'Argent',   swatch: 'radial-gradient(circle at 35% 35%, #f0f0f0, #c8c8c8 55%, #888888)' },
        ],
        mesures: ['48', '50', '52', '54', '56', '58'],
        composition: [
          { label: 'Métal', valeur: 'Or 18 carats' },
          { label: 'Finition', valeur: 'Biseautée, poli miroir' },
          { label: 'Épaisseur', valeur: '3 mm' },
          { label: 'Poids', valeur: '5,1 g' },
        ],
        entretien: "Retirer avant toute activité physique intense. Un chiffon microfibre suffit à raviver l'éclat des facettes biseautées.",
      },
      cephale: {
        type: 'bracelet',
        nom: 'Céphale',
        description: 'Cuir souple, fermoir discret, présence légère.',
        prix: 280,
        matieres: [
          { key: 'bleu',     label: 'Bleu nuit',  swatch: 'radial-gradient(circle at 35% 35%, #7ba7d4, #3a6fa8 55%, #1a3a60)' },
          { key: 'vert',     label: 'Vert forêt', swatch: 'radial-gradient(circle at 35% 35%, #7db88a, #3d7a50 55%, #1a4028)' },
          { key: 'bordeaux', label: 'Bordeaux',   swatch: 'radial-gradient(circle at 35% 35%, #c47a8a, #8b2a42 55%, #4a0f1e)' },
        ],
        mesures: ['S', 'M', 'L', 'XL'],
        composition: [
          { label: 'Matière', valeur: 'Cuir de veau pleine fleur' },
          { label: 'Fermoir', valeur: 'Acier inoxydable 316L' },
          { label: 'Largeur', valeur: '12 mm' },
          { label: 'Longueur', valeur: '19 cm ajustable' },
        ],
        entretien: "Garder au sec ; éviter l'exposition prolongée au soleil, qui ternit le cuir. Un baume incolore appliqué une fois l'an préserve sa souplesse.",
      },
      achille: {
        type: 'bracelet',
        nom: 'Achille',
        description: 'Corde de soie tressée, fermoir en or vermeil.',
        prix: 340,
        matieres: [
          { key: 'bleu',     label: 'Bleu nuit',  swatch: 'radial-gradient(circle at 35% 35%, #7ba7d4, #3a6fa8 55%, #1a3a60)' },
          { key: 'vert',     label: 'Vert forêt', swatch: 'radial-gradient(circle at 35% 35%, #7db88a, #3d7a50 55%, #1a4028)' },
          { key: 'bordeaux', label: 'Bordeaux',   swatch: 'radial-gradient(circle at 35% 35%, #c47a8a, #8b2a42 55%, #4a0f1e)' },
        ],
        mesures: ['S', 'M', 'L', 'XL'],
        composition: [
          { label: 'Matière', valeur: 'Corde de soie tressée' },
          { label: 'Fermoir', valeur: 'Or vermeil 18 carats' },
          { label: 'Largeur', valeur: '8 mm' },
          { label: 'Longueur', valeur: '18,5 cm ajustable' },
        ],
        entretien: "La soie craint l'humidité prolongée. Laisser sécher à plat avant de ranger ; éviter tout contact avec des produits abrasifs.",
      },
      heracles: {
        type: 'bracelet',
        nom: 'Héraclès',
        description: 'Mailles milanaises, fermoir magnétique.',
        prix: 360,
        matieres: [
          { key: 'bleu',     label: 'Bleu nuit',  swatch: 'radial-gradient(circle at 35% 35%, #7ba7d4, #3a6fa8 55%, #1a3a60)' },
          { key: 'vert',     label: 'Vert forêt', swatch: 'radial-gradient(circle at 35% 35%, #7db88a, #3d7a50 55%, #1a4028)' },
          { key: 'bordeaux', label: 'Bordeaux',   swatch: 'radial-gradient(circle at 35% 35%, #c47a8a, #8b2a42 55%, #4a0f1e)' },
        ],
        mesures: ['S', 'M', 'L', 'XL'],
        composition: [
          { label: 'Matière', valeur: 'Mailles d’acier milanais' },
          { label: 'Fermoir', valeur: 'Magnétique, acier brossé' },
          { label: 'Largeur', valeur: '6 mm' },
          { label: 'Longueur', valeur: '20 cm ajustable' },
        ],
        entretien: 'Nettoyer les mailles avec un chiffon doux légèrement humide. Tenir à distance des champs magnétiques puissants et des appareils électroniques sensibles.',
      },
    };

    // ─── GRILLE DUO : deux pièces portées ensemble, sur une même photo. Les emplacements
    // gauche/droite sont génériques (type + modèle) : un duo peut associer un bracelet et
    // une bague, ou deux pièces du même type, sans hypothèse dans le code (voir js/duo.js).
    // Images placeholders réutilisées le temps de recevoir les vraies photos duo.
    const XS_DUOS = [
      {
        id: 'heracles-gaia',
        label: 'Héraclès & Gaïa',
        mainImg: XS_ONE_DECOR_IMGS[2],
        description: 'Un bracelet et une bague, gravés du même numéro.',
        gauche: { type: 'bracelet', modele: 'heracles' },
        droite: { type: 'bague', modele: 'gaia' },
      },
      {
        id: 'cephale-aphrodite',
        label: 'Céphale & Aphrodite',
        mainImg: XS_ONE_DECOR_IMGS[3],
        description: 'Deux gestes qui se répondent, portés ensemble.',
        gauche: { type: 'bracelet', modele: 'cephale' },
        droite: { type: 'bague', modele: 'aphrodite' },
      },
      {
        id: 'achille-eos',
        label: 'Achille & Éos',
        mainImg: XS_ONE_DECOR_IMGS[1],
        description: 'Un même instant, partagé entre deux mains.',
        gauche: { type: 'bracelet', modele: 'achille' },
        droite: { type: 'bague', modele: 'eos' },
      },
      {
        id: 'cephale-achille',
        label: 'Céphale & Achille',
        mainImg: XS_ONE_DECOR_IMGS[4],
        description: 'Deux bracelets, une seule promesse.',
        gauche: { type: 'bracelet', modele: 'cephale' },
        droite: { type: 'bracelet', modele: 'achille' },
      },
    ];

    // Image de repli si le fichier produit attendu (images/produits/{type}-{modele}-{matiere}.webp)
    // n'est pas encore déposé — voir dgProduitSrc dans js/duo.js.
    const DG_PANEL_FALLBACK_IMG = XS_ONE_DECOR_IMGS[0];

// ─── Autres structures de donnees ───
    // Compteurs statiques — à connecter à une API plus tard
    const PLACES = { bagues: 23, bracelets: 17 };

    const COMPO_ICON_BAGUE = '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="21" rx="13" ry="6" stroke="currentColor" stroke-width="1.4"/></svg>';
    const COMPO_ICON_BRACELET = '<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="16" width="28" height="8" rx="4" stroke="currentColor" stroke-width="1.4"/></svg>';
    const COMPO_MODELES = {
      bague: ['Aphrodite', 'Gaïa', 'Éos'],
      bracelet: ['Céphale', 'Achille', 'Héraclès'],
    };
    const COMPO_SLOT_NAMES = ["L'un", "L'autre", 'Le troisième', 'Le quatrième'];
    // Portrait par emplacement — à compléter au fur et à mesure (null tant qu'aucune image
    // n'est fournie pour cet emplacement ; le clic ouvre le même parcours de sélection
    // que les emplacements sans portrait).
    const COMPO_SLOT_IMAGES = [COMPO_SLOT_MEDUSA_IMG, COMPO_SLOT_ATHENA_IMG, null, null];
    const COMPO_MATIERES = [
      { key: 'argent',  label: 'Argent 925', swatch: 'radial-gradient(circle at 35% 35%, #f0f0f0, #c8c8c8 55%, #888888)' },
      { key: 'vermeil', label: 'Vermeil',    swatch: 'radial-gradient(circle at 35% 35%, #f6dca0, #cf9a5c 55%, #8a5a24)' },
      { key: 'or',      label: 'Or',         swatch: 'radial-gradient(circle at 35% 35%, #f5d78e, #c9a96e 55%, #7a5c28)' },
      { key: 'rose',    label: 'Or rose',    swatch: 'radial-gradient(circle at 35% 35%, #f4c5b0, #c9836a 55%, #7a3a20)' },
    ];


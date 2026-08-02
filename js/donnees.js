// ─── donnees.js ───
// Donnees statiques du site Xerxes : chemins d'images, catalogue produits,
// palette de coloris et autres structures de contenu. Aucune fonction ici.

// ─── Chemins d'images ───
    const XERXES_LOGO_IMG = "images/site/logo.webp";
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
    const XS_HERO_IMG_3 = "images/site/hero-3.webp";

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

    const XS_GALLERY_ITEMS = [
      {
        src: '/images/christian-regg-FNaFLvbLFuk-unsplash.webp',
        label: 'Seealpsee',
        description: 'Seealpsee lies at eleven hundred meters in the Appenzell Alps, a sliver of meltwater cupped beneath the limestone walls of the Säntis. For much of the day the cliffs keep it in shadow, and its surface settles into a still, glassy green.',
      },
      {
        src: '/images/fabrizio-conti-rMWmDMeaoBk-unsplash.webp',
        label: 'K2',
        description: 'K2 rises to 8,611 meters on the Pakistan-China border, the second-highest point on Earth and by far the more dangerous to climb. It went unclimbed in winter until 2021, decades after every other eight-thousander had already fallen.',
      },
      {
        src: '/images/johannes-andersson-UCd78vfC8vU-unsplash.webp',
        label: 'The North Face',
        description: "A mountain's north face turns away from the sun, so its ice never fully lets go. The Eiger's is eighteen hundred meters of it, a wall so deadly that climbers renamed the Nordwand the Mordwand, the murder wall.",
      },
      {
        src: '/images/mads-schmidt-rasmussen-xfngap_DToE-unsplash.webp',
        label: 'Titre test',
        description: 'Description test — à connecter au contenu définitif de cette pièce.',
      },
      {
        src: '/images/weichao-deng-eyn0LjpNWV4-unsplash.webp',
        label: 'Mount Everest',
        description: 'Mount Everest grows roughly four millimeters taller each year as the Indian plate keeps pushing into Asia. Its summit was once seabed, and fossilized marine creatures are still found near the top.',
      },
    ];

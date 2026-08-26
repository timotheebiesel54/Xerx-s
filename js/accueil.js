// ─── accueil.js ───
// Rendu de la page d'accueil et initialisation de ses animations. Aucune
// variable d'etat exclusive identifiee a l'inventaire (app/currentView/lenis
// sont partagees avec navigate()/render() et restent dans main.js).

    // ─── HOME ───
    // Nombre de "vh" de scroll pin par transition entre deux images, derive de la
    // section historique a 3 images (250vh pour 2 transitions). Sert a recalculer la
    // hauteur de .xs-stage proportionnellement a XS_HERO_SLIDES.length, sans jamais
    // ecrire le nombre d'images en dur.
    const XS_STAGE_VH_PAR_TRANSITION = 125;

    // ─── Sélecteur Femme / Homme (entre le hero et "Le duo Xerxès") ───
    // Trois modèles par genre, puisés dans le catalogue existant (MODELES) : aucune
    // nouvelle image, le bijou de chaque tuile est le meme rendu SVG detoure que la
    // fiche produit (voir buildSVG dans fiche.js), avec un degrade chaud fixe plutot
    // que la palette de coloris (les tuiles n'ont pas de selecteur de teinte).
    const XS_GENRE_FEMME_SLUGS = ['aphrodite', 'gaia', 'eos'];
    const XS_GENRE_HOMME_SLUGS = ['cephale', 'achille', 'heracles'];
    let xsGenreEtat = 'femme';

    function xsGenrePackshotSVG(slug, gradId, classeGenre) {
      const m = MODELES[slug];
      const formes = {
        'ring': `<ellipse cx="100" cy="100" rx="64" ry="21" fill="none" stroke="url(#${gradId})" stroke-width="${m.svgStroke}" opacity="0.93"/>`,
        'ring-beveled': `
          <ellipse cx="100" cy="100" rx="64" ry="21" fill="none" stroke="url(#${gradId})" stroke-width="${m.svgStroke}" opacity="0.9"/>
          <ellipse cx="100" cy="100" rx="76" ry="27" fill="none" stroke="url(#${gradId})" stroke-width="1" opacity="0.45"/>`,
        'bracelet-thin': `<rect x="20" y="88" width="160" height="24" rx="12" fill="url(#${gradId})" opacity="0.9"/>`,
        'bracelet-cord': `
          <rect x="20" y="93" width="160" height="14" rx="7" fill="url(#${gradId})" opacity="0.85"/>
          <circle cx="170" cy="100" r="9" fill="url(#${gradId})"/>`,
        'bracelet-chain': `
          ${[0,1,2,3,4,5,6,7].map(i => `<rect x="${22+i*20}" y="91" width="14" height="18" rx="4" fill="none" stroke="url(#${gradId})" stroke-width="2.5" opacity="0.9"/>`).join('')}
          <circle cx="172" cy="100" r="8" fill="url(#${gradId})" opacity="0.9"/>`,
      };
      return `
        <svg class="xs-genre-tile-visual ${classeGenre}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:var(--accent-clair)"/>
              <stop offset="100%" style="stop-color:var(--accent)"/>
            </linearGradient>
          </defs>
          ${formes[m.svgType] || ''}
        </svg>`;
    }

    function xsGenreSetGenre(genre) {
      if (genre === xsGenreEtat) return;
      xsGenreEtat = genre;

      const toggle = document.getElementById('xs-genre-toggle');
      const curseur = document.getElementById('xs-genre-cursor');
      const labelFemme = document.getElementById('xs-genre-label-femme');
      const labelHomme = document.getElementById('xs-genre-label-homme');
      if (!toggle || !curseur) return;

      const inset = 4;
      const dx = genre === 'homme' ? (toggle.offsetWidth - inset * 2 - curseur.offsetWidth) : 0;

      gsap.killTweensOf(curseur);
      gsap.to(curseur, { x: dx, duration: 0.45, ease: 'power3.out' });

      // Le crossfade graisse 300 <-> 400 (calques superposes) est purement CSS, pilote
      // par .is-active via transition: opacity — voir .xs-genre-label-layer.
      const labelActif = genre === 'homme' ? labelHomme : labelFemme;
      const labelInactif = genre === 'homme' ? labelFemme : labelHomme;
      labelActif.classList.add('is-active');
      labelInactif.classList.remove('is-active');

      const montrerFemme = genre === 'femme';
      document.querySelectorAll('.xs-genre-tile-visual--femme').forEach(el => {
        gsap.killTweensOf(el);
        gsap.to(el, { opacity: montrerFemme ? 1 : 0, duration: 0.45, ease: 'power2.out' });
      });
      document.querySelectorAll('.xs-genre-tile-visual--homme').forEach(el => {
        gsap.killTweensOf(el);
        gsap.to(el, { opacity: montrerFemme ? 0 : 1, duration: 0.45, ease: 'power2.out' });
      });
    }

    function xsGenreNavigate() {
      navigate(xsGenreEtat === 'femme' ? 'bagues' : 'bracelets');
    }

    function renderHome() {
      const mobile = estMobile();
      const nSlides = XS_HERO_SLIDES.length;
      const stageHeight = Math.max(1, nSlides - 1) * XS_STAGE_VH_PAR_TRANSITION;

      const genreTilesHTML = XS_GENRE_FEMME_SLUGS.map((slugFemme, i) => {
        const slugHomme = XS_GENRE_HOMME_SLUGS[i];
        return `
            <div class="xs-genre-tile" onclick="xsGenreNavigate()">
              <div class="xs-genre-tile-bg"></div>
              ${xsGenrePackshotSVG(slugFemme, `g-genre-f${i}`, 'xs-genre-tile-visual--femme')}
              ${xsGenrePackshotSVG(slugHomme, `g-genre-h${i}`, 'xs-genre-tile-visual--homme')}
            </div>`;
      }).join('');

      // ─── Hero : sur ordinateur, sequence a lames SVG pilotee au scroll
      // (inchangee). Sur mobile (estMobile()), une seule image statique,
      // sans SVG ni mask ni blinds : la seconde slide n'est ni construite
      // ni inseree dans le DOM, donc jamais requetee. Voir Correction B/D
      // de la serie mobile et le bloc @media dedie (section Accueil). ───
      let heroHTML;
      if (mobile) {
        const slide = XS_HERO_SLIDES[0];
        heroHTML = `
        <section class="xs-stage">
          <div class="xs-layers">
            <img class="xs-hero-mobile-img" src="${slide.src}" alt="" />
            <div class="xs-texts">
              <div class="xs-txt xs-txt--static">
                <div class="xs-txt-inner">
                  <h1>${slide.titre}</h1>
                  <h2>${slide.sousTitre}</h2>
                  <span>${slide.texte}</span>
                  <button class="xs-lien xs-lien--clair" onclick="navigate('${slide.route}')">${slide.bouton}<span class="xs-lien-trait"></span></button>
                </div>
              </div>
            </div>
          </div>
        </section>`;
      } else {
        const layersHTML = XS_HERO_SLIDES.map((slide, i) => `
            <svg class="xs-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id="xs-mask${i}" maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g id="xs-blinds${i}"></g>
                </mask>
              </defs>
              <image href="${slide.src}"
                     x="0" y="0" width="100" height="100"
                     preserveAspectRatio="xMidYMid slice"
                     mask="url(#xs-mask${i})" />
            </svg>`).join('');

        const indicateurHTML = `
            <div class="xs-indicateur" id="xs-indicateur">
              <span class="xs-indic-num" id="xs-indic-num"></span>
              ${XS_HERO_SLIDES.map((_, i) => `<div class="xs-indic-bar" onclick="xsHeroGoTo(${i})"></div>`).join('')}
            </div>`;

        const textsHTML = `
            <div class="xs-texts">
              ${XS_HERO_SLIDES.map((slide) => `
              <div class="xs-txt">
                <div class="xs-txt-inner">
                  <h1>${slide.titre}</h1>
                  <h2>${slide.sousTitre}</h2>
                  <span>${slide.texte}</span>
                  <button class="xs-lien xs-lien--clair" onclick="navigate('${slide.route}')">${slide.bouton}<span class="xs-lien-trait"></span></button>
                </div>
              </div>`).join('')}
            </div>`;

        heroHTML = `
        <section class="xs-stage" style="height:${stageHeight}vh">
          <div class="xs-layers">
            ${layersHTML}
            ${indicateurHTML}
            ${textsHTML}
          </div>
        </section>`;
      }

      xsGenreEtat = 'femme';

      app.innerHTML = `
        ${heroHTML}

        <section class="xs-genre-section">
          <div class="xs-genre-toggle" id="xs-genre-toggle">
            <div class="xs-genre-cursor" id="xs-genre-cursor"></div>
            <button type="button" class="xs-genre-label is-active" id="xs-genre-label-femme" onclick="xsGenreSetGenre('femme')">
              <span class="xs-genre-label-layer xs-genre-label-layer--light">Femme</span>
              <span class="xs-genre-label-layer xs-genre-label-layer--bold" aria-hidden="true">Femme</span>
            </button>
            <button type="button" class="xs-genre-label" id="xs-genre-label-homme" onclick="xsGenreSetGenre('homme')">
              <span class="xs-genre-label-layer xs-genre-label-layer--light">Homme</span>
              <span class="xs-genre-label-layer xs-genre-label-layer--bold" aria-hidden="true">Homme</span>
            </button>
          </div>

          <div class="xs-genre-tiles">
            ${genreTilesHTML}
          </div>
        </section>

        <section class="xs-edition-section">
          <div class="xs-edition-texte">
            <h2 class="xs-edition-titre xs-head-title">Composez une édition</h2>
            <p class="xs-edition-soustitre">Un même numéro gravé sur chaque pièce ; à chacun sa forme, sa matière, sa mesure.</p>
            <button class="xs-lien xs-edition-cta" onclick="navigate('composition')">Ouvrir la composition<span class="xs-lien-trait"></span></button>
          </div>

          <div class="xs-edition-image">
            <img id="xs-edition-image-img" class="xs-edition-image-img" src="${XS_EDITION_IMG}" alt="Gravure du numéro d'édition sur la pièce" loading="lazy" />
          </div>
        </section>

        <section class="dg-section">
          <div class="dg-heading">
            <h2 class="dg-heading-title xs-head-title">Le duo Xerxès</h2>
            <p class="dg-heading-quote">Deux pièces, portées ensemble, sous un même numéro gravé.</p>
          </div>
          <div class="dg-grid-wrap">
            <div class="dg-grid-viewport" id="dg-grid-viewport">
              <div class="dg-grid-track" id="dg-grid-track"></div>
            </div>
            <button type="button" class="dg-grid-arrow dg-grid-arrow--prev" id="dg-grid-prev" aria-label="Précédent" hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M15 5L8 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button type="button" class="dg-grid-arrow dg-grid-arrow--next" id="dg-grid-next" aria-label="Suivant" hidden>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="dg-grid-nav" id="dg-grid-nav" hidden>
            <div class="dg-grid-progress" id="dg-grid-progress">
              <div class="dg-grid-progress-fill" id="dg-grid-progress-fill"></div>
            </div>
          </div>
        </section>

        ${xsSavoirFaireHTML()}

        <!-- NEWSLETTER -->
        <div class="newsletter-section">
          <h2 class="newsletter-title">Rejoindre la liste privée</h2>
          <p class="newsletter-sub">Accès prioritaire aux nouvelles pièces<br>et aux éditions limitées.</p>
          <div class="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="votre adresse email" id="nl-input"/>
            <button class="newsletter-submit" onclick="handleNewsletter()">Rejoindre</button>
          </div>
          <span class="newsletter-success" id="nl-success">Vous êtes sur la liste.</span>
        </div>
      `;
      initHomeAnimations();
    }

    function initHomeAnimations() {
      ScrollTrigger.getAll().forEach(st => st.kill());

      xsUpdateLayout();
      if (!estMobile()) xsInitHeroIndicator();
      xsInitNavOpacity();
      dgInit();
    }

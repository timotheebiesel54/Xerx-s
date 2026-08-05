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

    // ─── Sélecteur Femme / Homme (entre le hero et "La suggestion Xerxès") ───
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

      const encreActive = getComputedStyle(document.documentElement).getPropertyValue('--encre').trim();
      const inset = 4;
      const dx = genre === 'homme' ? (toggle.offsetWidth - inset * 2 - curseur.offsetWidth) : 0;

      gsap.killTweensOf(curseur);
      gsap.to(curseur, { x: dx, duration: 0.45, ease: 'power3.out' });

      const labelActif = genre === 'homme' ? labelHomme : labelFemme;
      const labelInactif = genre === 'homme' ? labelFemme : labelHomme;
      gsap.killTweensOf([labelFemme, labelHomme]);
      // Les tweens capturent la valeur de depart (via getComputedStyle) avant que les
      // classes ne changent ; l'inline style pose par GSAP prime ensuite sur la classe
      // pendant toute la duree de l'animation, donc l'ordre classList -> gsap.to
      // provoquerait un saut instantane (depart == arrivee) plutot qu'une animation.
      gsap.to(labelActif, { fontWeight: 600, color: encreActive, duration: 0.45, ease: 'power3.out' });
      gsap.to(labelInactif, { fontWeight: 400, color: 'rgba(10,10,10,0.55)', duration: 0.45, ease: 'power3.out' });
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
                  <button class="fiche-cta" onclick="navigate('${slide.route}')">${slide.bouton}</button>
                </div>
              </div>`).join('')}
            </div>`;

      xsGenreEtat = 'femme';

      app.innerHTML = `
        <section class="xs-stage" style="height:${stageHeight}vh">
          <div class="xs-layers">
            ${layersHTML}
            ${indicateurHTML}
            ${textsHTML}
          </div>
        </section>

        <section class="xs-genre-section">
          <div class="xs-genre-toggle" id="xs-genre-toggle">
            <div class="xs-genre-cursor" id="xs-genre-cursor"></div>
            <button type="button" class="xs-genre-label is-active" id="xs-genre-label-femme" onclick="xsGenreSetGenre('femme')">Femme</button>
            <button type="button" class="xs-genre-label" id="xs-genre-label-homme" onclick="xsGenreSetGenre('homme')">Homme</button>
          </div>

          <div class="xs-genre-tiles">
            ${genreTilesHTML}
          </div>
        </section>

        <section class="xs-suggestion-heading">
          <h2 class="xs-suggestion-title">La suggestion Xerxès</h2>
          <p class="xs-suggestion-quote">Nos bijoux sont conçus pour être portés à deux ou à plusieurs, scellant ce qui a été vécu ensemble.</p>
        </section>

        <section class="xs-gallery">
          <div class="xs-gallery-track-wrap" id="xs-gallery-scroller">
            <div class="xs-gallery-track" id="xs-gallery-track"></div>
          </div>
        </section>

        <div class="xs-focus-veil" id="xs-focus-veil" aria-hidden="true">
          <div class="back-arrow" onclick="xsGalleryCloseFocus()">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="back-arrow-label">Retour</span>
          </div>
        </div>
        <div class="xs-focus-box" id="xs-focus-box">
          <img class="xs-focus-img" id="xs-focus-img" src="" alt="" draggable="false" />
          <div class="xs-focus-content" id="xs-focus-content">
            <h3 class="xs-focus-label" id="xs-focus-label"></h3>
            <p class="xs-focus-desc" id="xs-focus-desc"></p>
            <a href="#" class="fiche-cta xs-focus-cta" onclick="event.preventDefault()">Découvrir</a>
          </div>
        </div>

        <section class="xs-cats-section">
          <p class="xs-suggestion-quote">Certains préfèrent porter Xerxès seul ; la collection s'explore pièce à pièce.</p>
          <div class="xs-cats-grid">
            <div class="xs-cat-card" onclick="navigate('bracelets')">
              <div class="xs-cat-img" style="background-image:url(${XS_CAT_HOMMES_IMG})"></div>
              <span class="xs-cat-label">Hommes</span>
            </div>
            <div class="xs-cat-card" onclick="navigate('bagues')">
              <div class="xs-cat-img" style="background-image:url(${XS_CAT_FEMMES_IMG})"></div>
              <span class="xs-cat-label">Femmes</span>
            </div>
            <div class="xs-cat-card" onclick="navigate('composition')">
              <div class="xs-cat-img" style="background-image:url(${XS_CAT_SUR_MESURE_IMG})"></div>
              <span class="xs-cat-label">Sur mesure</span>
            </div>
          </div>
        </section>

        <!-- LA MAISON / USINE : teaser à venir, attend les vraies photos -->
        <section></section>

        <!-- NEWSLETTER -->
        <div class="newsletter-section">
          <span class="newsletter-label">Accès privé</span>
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
      xsInitHeroIndicator();
      xsInitNavOpacity();
      xsGalleryInit();
    }

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

    function renderHome() {
      const nSlides = XS_HERO_SLIDES.length;
      const stageHeight = Math.max(1, nSlides - 1) * XS_STAGE_VH_PAR_TRANSITION;

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

      app.innerHTML = `
        <section class="xs-stage" style="height:${stageHeight}vh">
          <div class="xs-layers">
            ${layersHTML}
            ${indicateurHTML}
            ${textsHTML}
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
      xsInitNavTransparency();
      xsGalleryInit();
    }

// ─── accueil.js ───
// Rendu de la page d'accueil et initialisation de ses animations. Aucune
// variable d'etat exclusive identifiee a l'inventaire (app/currentView/lenis
// sont partagees avec navigate()/render() et restent dans main.js).

    // ─── HOME ───
    function renderHome() {
      app.innerHTML = `
        <section class="xs-stage">
          <div class="xs-layers">
            <svg class="xs-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id="xs-mask1" maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g id="xs-blinds1"></g>
                </mask>
              </defs>
              <image href="${XS_HERO_IMG_1}"
                     x="0" y="0" width="100" height="100"
                     preserveAspectRatio="xMidYMid slice"
                     mask="url(#xs-mask1)" />
            </svg>
            <svg class="xs-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id="xs-mask2" maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g id="xs-blinds2"></g>
                </mask>
              </defs>
              <image href="${XS_HERO_IMG_2}"
                     x="0" y="0" width="100" height="100"
                     preserveAspectRatio="xMidYMid slice"
                     mask="url(#xs-mask2)" />
            </svg>
            <svg class="xs-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <mask id="xs-mask3" maskUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="100" height="100" fill="black" />
                  <g id="xs-blinds3"></g>
                </mask>
              </defs>
              <image href="${XS_HERO_IMG_3}"
                     x="0" y="0" width="100" height="100"
                     preserveAspectRatio="xMidYMid slice"
                     mask="url(#xs-mask3)" />
            </svg>
            <div class="xs-progress-bar">
              <div class="xs-segment"><div class="xs-fill"></div></div>
              <div class="xs-segment"><div class="xs-fill"></div></div>
              <div class="xs-segment"><div class="xs-fill"></div></div>
            </div>
            <div class="xs-texts">
              <div class="xs-txt">
                <h1>Genève</h1>
                <h2>L'origine</h2>
                <span>Une maison discrète, entre lac et lumière, où chaque pièce prend forme.</span>
              </div>
              <div class="xs-txt">
                <h1>L'heure dorée</h1>
                <h2>L'instant précis</h2>
                <span>Le crépuscule comme mesure du temps; l'or comme matière du souvenir.</span>
              </div>
              <div class="xs-txt">
                <h1>Le silence</h1>
                <h2>L'épreuve du geste</h2>
                <span>Au cœur des montagnes, la patience façonne ce que l'éclat révèle.</span>
              </div>
            </div>
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
      xsInitProgressBar();
      xsGalleryInit();
    }

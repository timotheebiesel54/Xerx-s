// ─── fiche.js ───
// Fiche produit et carrousels 3D de la page Collection, avec leur etat
// (xsCarouselTimelines).

    // ─── CARROUSEL 3D PRODUITS (scroll-driven, sans transition preview) ───
    let xsCarouselTimelines = [];

    // ─── FICHE PRODUIT ───
    function renderFiche(slug) {
      const m = MODELES[slug];
      if (!m) { navigate('bagues'); return; }
      window.currentFicheSlug = slug;

      const isBracelet = m.svgType.startsWith('bracelet');
      const defaultColoris = isBracelet ? 'bleu' : 'or';
      const firstColoris = COLORIS_MAP[m.genre][defaultColoris];
      const svgGradId = 'g-fiche';

      function buildSVG(gradId) {
        if (m.svgType === 'ring') return `
          <ellipse cx="100" cy="105" rx="64" ry="21" fill="none" stroke="url(#${gradId})" stroke-width="${m.svgStroke}" opacity="0.93"/>
          <ellipse cx="100" cy="105" rx="64" ry="21" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="1"/>`;
        if (m.svgType === 'ring-beveled') return `
          <ellipse cx="100" cy="105" rx="64" ry="21" fill="none" stroke="url(#${gradId})" stroke-width="${m.svgStroke}" opacity="0.9"/>
          <ellipse cx="100" cy="105" rx="54" ry="15" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
          <ellipse cx="100" cy="105" rx="74" ry="26" fill="none" stroke="var(--accent)" stroke-width="1"/>`;
        if (m.svgType === 'bracelet-thin') return `
          <rect x="30" y="88" width="140" height="24" rx="12" fill="url(#${gradId})" opacity="0.9"/>
          <rect x="30" y="88" width="140" height="24" rx="12" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>`;
        if (m.svgType === 'bracelet-cord') return `
          <rect x="30" y="93" width="140" height="14" rx="7" fill="url(#${gradId})" opacity="0.85"/>
          <line x1="30" y1="100" x2="170" y2="100" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
          <circle cx="162" cy="100" r="9" fill="url(#${gradId})" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>`;
        if (m.svgType === 'bracelet-chain') return `
          ${[0,1,2,3,4,5,6].map(i => `<rect x="${32+i*20}" y="91" width="14" height="18" rx="4" fill="none" stroke="url(#${gradId})" stroke-width="2.5" opacity="0.9"/>`).join('')}
          <circle cx="162" cy="100" r="8" fill="url(#${gradId})" opacity="0.9"/>`;
        return '';
      }

      const swatchKeys = Object.keys(COLORIS_MAP[m.genre]);
      const swatchesHTML = swatchKeys.map(key => {
        const c = COLORIS_MAP[m.genre][key];
        const isDefault = key === defaultColoris;
        return `<div class="fiche-swatch${isDefault?' selected':''}" style="background:${c.swatch}" onclick="ficheSelectSwatch(event,'${key}','${m.genre}')" title="${c.label}"></div>`;
      }).join('');

      app.innerHTML = `
        <div class="fiche-view animate-in">
          <div class="fiche-grid">

            <!-- VISUEL -->
            <div class="fiche-visuel">
              <div class="fiche-img-wrap" id="fiche-img-wrap">
                ${slug === 'aphrodite' && defaultColoris === 'or' ? `
                <img id="fiche-photo" src="${APHRODITE_OR_IMG}" alt="${m.nom}" style="width:58%;height:auto;object-fit:contain;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1);" />
                ` : ''}
                <svg id="fiche-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="${slug === 'aphrodite' && defaultColoris === 'or' ? 'display:none;' : ''}">
                  <defs>
                    <linearGradient id="${svgGradId}" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="${firstColoris.stops[0]}"/>
                      <stop offset="50%" stop-color="${firstColoris.stops[1]}"/>
                      <stop offset="100%" stop-color="${firstColoris.stops[2]}"/>
                    </linearGradient>
                  </defs>
                  ${buildSVG(svgGradId)}
                </svg>
              </div>

              <div class="fiche-swatches">
                ${swatchesHTML}
                <span class="fiche-swatch-label" id="fiche-coloris-label">${firstColoris.label}</span>
              </div>
            </div>

            <!-- INFOS -->
            <div class="fiche-infos">
              <span class="fiche-eyebrow">Collection ${m.collection}</span>
              <h1 class="fiche-nom">${m.nom}</h1>
              <span class="fiche-coloris-actif" id="fiche-coloris-actif">${firstColoris.label}</span>

              <div class="fiche-divider"></div>

              <p class="fiche-intention">${m.intention}</p>

              <span class="fiche-section-label">Matériaux</span>
              <ul class="fiche-materiaux">
                ${m.materiaux.map(mat => `<li>${mat.label}<span>${mat.valeur}</span></li>`).join('')}
              </ul>

              <span class="fiche-section-label">Édition numérotée</span>
              <div class="fiche-edition">
                <p class="fiche-edition-num">Édition limitée à ${m.edition} exemplaires</p>
              </div>

              <span class="fiche-section-label">${isBracelet ? 'Tour de poignet' : 'Taille (diamètre intérieur)'}</span>
              <div class="fiche-tailles">
                ${m.tailles.map((t,i) => `<div class="fiche-taille${i===1?' selected':''}" onclick="selectTaille(this)">${t}</div>`).join('')}
              </div>
              <span class="fiche-taille-hint">Guide des tailles →</span>

              <div class="fiche-duo">
                <div class="fiche-duo-line"></div>
                <p class="fiche-duo-text">${isBracelet
                  ? 'Ce bracelet a son pendant féminin.<br><strong>La bague Xerxès</strong> complète le duo.'
                  : 'Cette bague a son pendant masculin.<br><strong>Le bracelet Xerxès</strong> complète le duo.'
                }</p>
              </div>

              <!-- CTA ACHETER -->
              <div style="margin-bottom: 12px;">
                <span class="fiche-section-label">Prix</span>
                <p style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; letter-spacing:0.1em; color:var(--encre); margin-bottom:20px;">300 CHF</p>
              </div>
              <button class="fiche-cta-achat" onclick="window.open('https://buy.stripe.com','_blank')">Acheter, 300 CHF</button>

            </div>

          </div>
        </div>
      `;
    }

    function ficheSelectSwatch(e, coloris, genre) {
      document.querySelectorAll('.fiche-swatch').forEach(s => s.classList.remove('selected'));
      e.target.classList.add('selected');
      const c = COLORIS_MAP[genre][coloris];
      document.getElementById('fiche-coloris-label').textContent = c.label;
      document.getElementById('fiche-coloris-actif').textContent = c.label;
      const grad = document.getElementById('g-fiche');
      if (grad) {
        grad.children[0].setAttribute('stop-color', c.stops[0]);
        grad.children[1].setAttribute('stop-color', c.stops[1]);
        grad.children[2].setAttribute('stop-color', c.stops[2]);
      }
      const photoEl = document.getElementById('fiche-photo');
      const svgEl = document.getElementById('fiche-svg');
      if (window.currentFicheSlug === 'aphrodite') {
        if (coloris === 'or') {
          if (photoEl) { photoEl.style.display = ''; }
          if (svgEl) { svgEl.style.display = 'none'; }
        } else {
          if (photoEl) { photoEl.style.display = 'none'; }
          if (svgEl) { svgEl.style.display = ''; }
        }
      }
    }

    function selectTaille(el) {
      document.querySelectorAll('.fiche-taille').forEach(t => t.classList.remove('selected'));
      el.classList.add('selected');
    }

    // ─── INSCRIPTION ───
    function handleJoin(e, type) {
      e.preventDefault();
      const form = e.target;
      const successEl = document.getElementById('success-' + type);
      const countEl = document.getElementById('count-' + type);

      // Décrémenter localement
      const current = parseInt(countEl.textContent);
      if (current > 1) countEl.textContent = current - 1;

      // Masquer le form, afficher le message
      form.style.opacity = '0.3';
      form.style.pointerEvents = 'none';
      successEl.style.display = 'block';

      // Ici plus tard : fetch('/api/subscribe', { method:'POST', body: ... })
    }

    // ─── COLLECTION ───
    // Route de la fiche produit d'un modele, deduite de sa cle CATALOGUE (seule source de
    // verite) plutot que construite a la main : evite tout risque de desynchronisation
    // avec les cles reellement lues par renderFiche() en cas d'ajout/retrait de modele.
    function xsRouteProduit(slug) {
      return CATALOGUE[slug] ? 'fiche-' + slug : null;
    }

    // Bloc "savoir faire" : section fixe apres la derniere vague, hors de .xs-scenes-wrap
    // (aucun rapport avec le tambour). Commune a Bagues, Bracelets et Editions (contenu
    // identique, aucune donnee produit). Purement informative, sans navigation ni effet : les
    // trois volets sont statiques, visibles des le chargement, meme ratio d'image et meme
    // alignement. Images pas encore livrees : blocs de remplacement --fond-2, convention
    // de nom prevue en images/site/atelier.webp, images/site/ecrin.webp,
    // images/site/materiaux.webp, coherente avec images/site/edition-gravure.webp deja
    // utilisee sur le site.
    function xsSavoirFaireHTML() {
      return `
      <section class="xs-savoir-faire">
        <div class="xs-savoir-grille">
          <div class="xs-savoir-volet">
            <div class="xs-savoir-image"></div>
            <h3 class="xs-savoir-titre">L’atelier</h3>
            <button type="button" class="xs-lien" onclick="navigate('atelier')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-savoir-volet">
            <div class="xs-savoir-image"></div>
            <h3 class="xs-savoir-titre">L’écrin</h3>
            <button type="button" class="xs-lien" onclick="navigate('ecrin')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-savoir-volet">
            <div class="xs-savoir-image"></div>
            <h3 class="xs-savoir-titre">Les matériaux</h3>
            <button type="button" class="xs-lien" onclick="navigate('materiaux')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
        </div>
      </section>
      `;
    }

    function renderCollection(type) {
      const isBagues = type === 'bagues';
      const titre = isBagues ? 'Bagues' : 'Bracelets';

      const scenes = isBagues ? `
      <div class="xs-scenes-wrap xs-scenes-wrap--offset">
        <div class="xs-scene" data-radius="500">
          <div class="xs-scene-editorial">
            <h2 class="xs-scene-title" onclick="navigate('fiche-aphrodite')"><span>Aphrodite</span></h2>
            <p class="xs-scene-text">${MODELES.aphrodite.intention}</p>
            <button class="xs-lien xs-scene-lien" onclick="navigate('${xsRouteProduit('aphrodite')}')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-scene-3d">
          <div class="xs-carousel">
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 1</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 1</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 2</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 2</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 3</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 3</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 4</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Aphrodite</span><span class="xs-card-view">Vue 4</span></span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div class="xs-scene" data-radius="500">
          <div class="xs-scene-editorial">
            <h2 class="xs-scene-title" onclick="navigate('fiche-gaia')"><span>Gaïa</span></h2>
            <p class="xs-scene-text">${MODELES.gaia.intention}</p>
            <button class="xs-lien xs-scene-lien" onclick="navigate('${xsRouteProduit('gaia')}')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-scene-3d">
          <div class="xs-carousel">
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 1</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 1</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 2</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 2</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 3</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 3</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 4</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Gaïa</span><span class="xs-card-view">Vue 4</span></span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div class="xs-scene" data-radius="500">
          <div class="xs-scene-editorial">
            <h2 class="xs-scene-title" onclick="navigate('fiche-eos')"><span>Éos</span></h2>
            <p class="xs-scene-text">${MODELES.eos.intention}</p>
            <button class="xs-lien xs-scene-lien" onclick="navigate('${xsRouteProduit('eos')}')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-scene-3d">
          <div class="xs-carousel">
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 1</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 1</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 2</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 2</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 3</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 3</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 4</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Éos</span><span class="xs-card-view">Vue 4</span></span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      ` : `
      <div class="xs-scenes-wrap xs-scenes-wrap--offset xs-scenes-wrap--offset-inverse">
        <div class="xs-scene" data-radius="500">
          <div class="xs-scene-editorial">
            <h2 class="xs-scene-title" onclick="navigate('fiche-cephale')"><span>Céphale</span></h2>
            <p class="xs-scene-text">${MODELES.cephale.intention}</p>
            <button class="xs-lien xs-scene-lien" onclick="navigate('${xsRouteProduit('cephale')}')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-scene-3d">
          <div class="xs-carousel">
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 1</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 1</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 2</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 2</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 3</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 3</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 4</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Céphale</span><span class="xs-card-view">Vue 4</span></span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div class="xs-scene" data-radius="500">
          <div class="xs-scene-editorial">
            <h2 class="xs-scene-title" onclick="navigate('fiche-achille')"><span>Achille</span></h2>
            <p class="xs-scene-text">${MODELES.achille.intention}</p>
            <button class="xs-lien xs-scene-lien" onclick="navigate('${xsRouteProduit('achille')}')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-scene-3d">
          <div class="xs-carousel">
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 1</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 1</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 2</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 2</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 3</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 3</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 4</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Achille</span><span class="xs-card-view">Vue 4</span></span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div class="xs-scene" data-radius="500">
          <div class="xs-scene-editorial">
            <h2 class="xs-scene-title" onclick="navigate('fiche-heracles')"><span>Héraclès</span></h2>
            <p class="xs-scene-text">${MODELES.heracles.intention}</p>
            <button class="xs-lien xs-scene-lien" onclick="navigate('${xsRouteProduit('heracles')}')">Découvrir<span class="xs-lien-trait"></span></button>
          </div>
          <div class="xs-scene-3d">
          <div class="xs-carousel">
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 1</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 1</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 2</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 2</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 3</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 3</span></span>
                </div>
              </div>
            </div>
            <div class="xs-carousel-cell">
              <div class="xs-card" style="--img: none">
                <div class="xs-card-face xs-card-face--front">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 4</span></span>
                </div>
                <div class="xs-card-face xs-card-face--back">
                  <span class="xs-card-label"><span class="xs-card-name">Héraclès</span><span class="xs-card-view">Vue 4</span></span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      `;

      const savoirFaire = xsSavoirFaireHTML();

      app.innerHTML = `
        <div class="collection-view animate-in">
          <h1 class="collection-title">${titre}</h1>

          ${scenes}
          ${savoirFaire}
        </div>
      `;

      xsInitProductCarousels();
    }

    function xsSplitTitleChars(el) {
      const text = el.textContent;
      el.innerHTML = '';
      const chars = [];
      for (const ch of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(span);
        chars.push(span);
      }
      return chars;
    }

    function xsGetCarouselCellTransforms(count, radius) {
      const angleStep = 360 / count;
      return Array.from({ length: count }, (_, i) => {
        const angle = i * angleStep;
        return `rotateY(${angle}deg) translateZ(${radius}px)`;
      });
    }

    function xsSetupCarouselCells(carousel) {
      const scene = carousel.closest('.xs-scene');
      const radius = parseFloat(scene.dataset.radius) || 500;
      const cells = carousel.querySelectorAll('.xs-carousel-cell');
      const transforms = xsGetCarouselCellTransforms(cells.length, radius);
      cells.forEach((cell, i) => { cell.style.transform = transforms[i]; });
    }

    function xsCreateCarouselTimeline(carousel) {
      const scene = carousel.closest('.xs-scene');
      const cards = carousel.querySelectorAll('.xs-card');
      const titleSpan = scene.querySelector('.xs-scene-title span');
      const chars = titleSpan ? xsSplitTitleChars(titleSpan) : [];

      const tl = gsap.timeline({
        defaults: { ease: 'sine.inOut' },
        scrollTrigger: {
          trigger: scene,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      tl.fromTo(carousel, { rotationY: 0 }, { rotationY: -180 }, 0)
        .fromTo(carousel, { rotationZ: 3, rotationX: 3 }, { rotationZ: -3, rotationX: -3 }, 0)
        .fromTo(cards, { filter: 'brightness(130%)' }, { filter: 'brightness(90%)', ease: 'power3' }, 0)
        .fromTo(cards, { rotationZ: 4 }, { rotationZ: -4, ease: 'none' }, 0);

      if (chars.length) {
        gsap.fromTo(chars, { autoAlpha: 0 }, {
          autoAlpha: 1,
          duration: 0.02,
          ease: 'none',
          stagger: { each: 0.04, from: 'start' },
          scrollTrigger: { trigger: scene, start: 'top center', toggleActions: 'play none none reverse' },
        });
      }

      return tl;
    }

    function xsFillProductCardImages() {
      const pool = [XS_ONE_MAIN_IMG, ...XS_ONE_DECOR_IMGS];
      document.querySelectorAll('.xs-card').forEach((card, i) => {
        card.style.setProperty('--img', `url(${pool[i % pool.length]})`);
      });
    }

    function xsInitProductCarousels() {
      xsCarouselTimelines = [];
      xsFillProductCardImages();
      document.querySelectorAll('.xs-carousel').forEach((carousel) => {
        xsSetupCarouselCells(carousel);
        xsCarouselTimelines.push(xsCreateCarouselTimeline(carousel));
      });
    }

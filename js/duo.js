// ─── duo.js ───
// Grille duo de la page d'accueil (dg-section/dg-grid-*/dg-item) et la page dediee /duo/{id}
// qu'elle ouvre (renderDuo, rendue par le routeur comme n'importe quelle autre page). Au clic
// sur une image de la grille, celle ci est clonee en position fixed et animee (FLIP manuel,
// aucun plugin Flip sous licence Club GreenSock) vers la position de l'image principale de la
// nouvelle page ; une fois immobile, les deux panneaux lateraux (un par piece du duo) et le
// bouton d'ajout au panier apparaissent. CATALOGUE (donnees.js) est la seule source de verite
// pour matieres, mesures, descriptions, prix et details (composition, entretien) des pieces ;
// XS_DUOS ne fait que designer, pour chaque duo, quelle piece occupe l'emplacement gauche et
// lequel occupe le droit. La grille elle meme reutilise le systeme de navigation par piste +
// barre de progression + fleches (mêmes regles que l'ancien carrousel) : navigation visible
// seulement si les duos depassent la largeur disponible, grille simple sinon.

    let dgFocus = null;       // etat de travail de la page duo actuellement rendue (selections, etc.)

    // Position de la grille d'accueil et defilement de la page au moment de quitter l'accueil
    // pour un duo : restaures au retour (voir dgRememberHomeState/dgConsumeHomeScroll et
    // dgGridInit), pour qu'un visiteur revenant du cinquieme duo ne retombe pas en haut de la
    // grille. Consommes une seule fois chacun, puis remis a null.
    let dgSavedHomeScrollY = null;
    let dgSavedCarouselPos = null;

    function dgRememberHomeState() {
      dgSavedHomeScrollY = window.scrollY;
      dgSavedCarouselPos = dgGridNav ? dgGridNav.pos : 0;
    }

    function dgConsumeHomeScroll() {
      const y = dgSavedHomeScrollY;
      dgSavedHomeScrollY = null;
      return y;
    }

    // ─── Panier minimal : tableau en memoire persiste en localStorage, compteur d'en tete.
    // Aucun tunnel de commande ni page panier dans cette iteration. ───
    const DG_PANIER_KEY = 'xs_panier';
    let dgPanier = [];
    (function dgLoadPanier() {
      try {
        const raw = localStorage.getItem(DG_PANIER_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        dgPanier = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        dgPanier = [];
      }
    })();

    function dgSavePanier() {
      try { localStorage.setItem(DG_PANIER_KEY, JSON.stringify(dgPanier)); } catch (e) { /* stockage indisponible, on continue sans persister */ }
      if (typeof majPanier === 'function') majPanier(dgPanier.length);
    }

    function dgPulseCompteur() {
      const pastille = document.querySelector('.nav-pastille');
      if (!pastille) return;
      gsap.killTweensOf(pastille);
      gsap.fromTo(pastille, { scale: 1 }, { scale: 1.15, duration: 0.25, ease: 'power2.out', yoyo: true, repeat: 1 });
    }

    // ─── Lecture des donnees ───
    function dgReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function dgRatio() {
      const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duo-ratio'));
      return v > 0 ? v : 0.82;
    }

    function dgProduitSrc(type, modele, matiere) {
      return `images/produits/${type}-${modele}-${matiere}.webp`;
    }

    // Prix d'une piece pour une matiere donnee : lit un eventuel prix specifique a la matiere
    // dans CATALOGUE, sinon retombe sur le prix de base du modele.
    function dgPrixPiece(slot, matiereKey) {
      const cat = CATALOGUE[slot.modele];
      if (!cat) return 0;
      const m = cat.matieres.find((x) => x.key === matiereKey);
      return (m && typeof m.prix === 'number') ? m.prix : cat.prix;
    }

    function dgDefaultSelection(modele) {
      const cat = CATALOGUE[modele];
      if (!cat) return { matiere: null, mesure: null, front: 'a' };
      const mesures = cat.mesures || [];
      return {
        matiere: cat.matieres[0] ? cat.matieres[0].key : null,
        mesure: mesures[Math.floor(mesures.length / 2)] || mesures[0] || null,
        front: 'a',
      };
    }

    // ─── Grille : piste + navigation (reprend telle quelle la mecanique page/bornee de
    // l'ancien carrousel — pas de boucle, deplacement d'une page entiere, boutons inertes
    // aux bornes) ; la barre et les fleches restent masquees si tous les duos tiennent deja
    // dans la largeur visible (piste alors simplement centree, aucune navigation affichee). ───
    let dgGridNav = null;
    const DG_GRID_GAP = 32;   // doit rester synchronise avec .dg-grid-track{gap} en CSS
    const DG_GRID_VISIBLE = 4; // nombre de duos visibles simultanement, jamais deduit d'une largeur en vw

    function dgGridItemHTML(duo) {
      return `
        <div class="dg-item" data-duo-id="${duo.id}" onclick="dgOpen('${duo.id}', this)">
          <img class="dg-item-img" src="${duo.mainImg}" alt="Duo ${duo.label}" loading="lazy" draggable="false" />
          <span class="dg-item-label">${duo.label}</span>
        </div>
      `;
    }

    // La largeur d'une carte est deduite de la largeur mesuree du conteneur visible, jamais
    // approximee en vw : a largeur egale, DG_GRID_VISIBLE cartes remplissent exactement la
    // fenetre, sans qu'un debut de carte suivante ne deborde a l'etat initial.
    function dgGridApplyItemWidth(pageWidth) {
      const nav = dgGridNav;
      if (window.innerWidth < 900) {
        nav.viewport.style.removeProperty('--dg-grid-item-w');
        return;
      }
      const itemWidth = (pageWidth - DG_GRID_GAP * (DG_GRID_VISIBLE - 1)) / DG_GRID_VISIBLE;
      nav.viewport.style.setProperty('--dg-grid-item-w', itemWidth + 'px');
    }

    function dgGridMeasure() {
      const nav = dgGridNav;
      nav.pageWidth = nav.viewport.getBoundingClientRect().width;
      dgGridApplyItemWidth(nav.pageWidth);
      nav.trackWidth = nav.track.scrollWidth;
      nav.maxX = Math.max(0, nav.trackWidth - nav.pageWidth);
      const items = nav.track.children;
      nav.cardStep = items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : nav.pageWidth;
    }

    function dgGridUpdateNavVisibility() {
      const nav = dgGridNav;
      if (!nav) return;
      nav.navEl.hidden = nav.maxX <= 0;
    }

    function dgGridApply(pos, animate) {
      const nav = dgGridNav;
      if (!nav) return;
      if (nav.maxX <= 0) {
        // Tous les duos tiennent deja dans la largeur visible : piste centree, sans navigation.
        const centered = (nav.pageWidth - nav.trackWidth) / 2;
        gsap.killTweensOf(nav.track);
        if (animate) gsap.to(nav.track, { x: centered, duration: 0.6, ease: 'power2.out' });
        else gsap.set(nav.track, { x: centered });
        nav.pos = 0;
        return;
      }
      const clamped = Math.min(Math.max(pos, 0), nav.maxX);
      const ratio = nav.trackWidth > 0 ? Math.min(1, Math.max(0, (clamped + nav.pageWidth) / nav.trackWidth)) : 0;
      gsap.killTweensOf([nav.track, nav.fill]);
      if (animate) {
        gsap.to(nav.track, { x: -clamped, duration: 0.6, ease: 'power2.out' });
        gsap.to(nav.fill, { width: (ratio * 100) + '%', duration: 0.6, ease: 'power2.out' });
      } else {
        gsap.set(nav.track, { x: -clamped });
        gsap.set(nav.fill, { width: (ratio * 100) + '%' });
      }
      nav.pos = clamped;
      nav.prevBtn.disabled = clamped <= 0.5;
      nav.nextBtn.disabled = clamped >= nav.maxX - 0.5;
    }

    function dgGridNext() { if (dgGridNav) dgGridApply(dgGridNav.pos + dgGridNav.pageWidth, true); }
    function dgGridPrev() { if (dgGridNav) dgGridApply(dgGridNav.pos - dgGridNav.pageWidth, true); }

    function dgGridOnResize() {
      if (!dgGridNav) return;
      dgGridMeasure();
      dgGridUpdateNavVisibility();
      dgGridApply(Math.min(dgGridNav.pos, dgGridNav.maxX), false);
    }

    function dgGridOnDragStart(e) {
      const nav = dgGridNav;
      if (!nav || nav.maxX <= 0) return;
      gsap.killTweensOf([nav.track, nav.fill]);
      nav.gesture = { startX: e.clientX, startPos: nav.pos, pointerId: e.pointerId, moved: false };
      nav.viewport.classList.add('is-dragging');
      window.addEventListener('pointermove', dgGridOnDragMove);
      window.addEventListener('pointerup', dgGridOnDragEnd);
      window.addEventListener('pointercancel', dgGridOnDragEnd);
    }
    function dgGridOnDragMove(e) {
      const nav = dgGridNav;
      if (!nav || !nav.gesture || e.pointerId !== nav.gesture.pointerId) return;
      const dx = e.clientX - nav.gesture.startX;
      if (Math.abs(dx) > 4) nav.gesture.moved = true;
      const clamped = Math.min(Math.max(nav.gesture.startPos - dx, 0), nav.maxX);
      const ratio = nav.trackWidth > 0 ? Math.min(1, Math.max(0, (clamped + nav.pageWidth) / nav.trackWidth)) : 0;
      gsap.set(nav.track, { x: -clamped });
      gsap.set(nav.fill, { width: (ratio * 100) + '%' });
      nav.pos = clamped;
      nav.prevBtn.disabled = clamped <= 0.5;
      nav.nextBtn.disabled = clamped >= nav.maxX - 0.5;
    }
    function dgGridOnDragEnd(e) {
      const nav = dgGridNav;
      if (!nav || !nav.gesture || e.pointerId !== nav.gesture.pointerId) return;
      nav.viewport.classList.remove('is-dragging');
      window.removeEventListener('pointermove', dgGridOnDragMove);
      window.removeEventListener('pointerup', dgGridOnDragEnd);
      window.removeEventListener('pointercancel', dgGridOnDragEnd);
      const step = nav.cardStep || nav.pageWidth;
      const nearest = Math.round(nav.pos / step) * step;
      dgGridApply(nearest, true);
    }

    function dgGridCleanup() {
      if (!dgGridNav) return;
      clearTimeout(dgGridNav.resizeTimer);
      window.removeEventListener('resize', dgGridNav.handleResize);
      window.removeEventListener('pointermove', dgGridOnDragMove);
      window.removeEventListener('pointerup', dgGridOnDragEnd);
      window.removeEventListener('pointercancel', dgGridOnDragEnd);
      gsap.killTweensOf([dgGridNav.track, dgGridNav.fill]);
      dgGridNav = null;
    }

    function dgGridInit() {
      dgGridCleanup();
      const viewport = document.getElementById('dg-grid-viewport');
      const track = document.getElementById('dg-grid-track');
      const fill = document.getElementById('dg-grid-progress-fill');
      const prevBtn = document.getElementById('dg-grid-prev');
      const nextBtn = document.getElementById('dg-grid-next');
      const navEl = document.getElementById('dg-grid-nav');
      if (!viewport || !track || !fill || !prevBtn || !nextBtn || !navEl) return;

      track.innerHTML = XS_DUOS.map(dgGridItemHTML).join('');

      dgGridNav = {
        viewport, track, fill, prevBtn, nextBtn, navEl,
        pos: 0, pageWidth: 0, trackWidth: 0, maxX: 0, cardStep: 0,
        resizeTimer: null, gesture: null, handleResize: null,
      };

      dgGridMeasure();
      dgGridUpdateNavVisibility();
      const restorePos = dgSavedCarouselPos;
      dgSavedCarouselPos = null;
      dgGridApply(restorePos != null ? Math.min(restorePos, dgGridNav.maxX) : 0, false);

      prevBtn.addEventListener('click', dgGridPrev);
      nextBtn.addEventListener('click', dgGridNext);
      viewport.addEventListener('pointerdown', dgGridOnDragStart);

      // Un drag qui a effectivement bouge ne doit pas declencher l'ouverture du focus sur la
      // carte relachee.
      viewport.addEventListener('click', (e) => {
        if (dgGridNav && dgGridNav.gesture && dgGridNav.gesture.moved) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (dgGridNav && dgGridNav.gesture) dgGridNav.gesture.moved = false;
      }, true);

      dgGridNav.handleResize = () => {
        clearTimeout(dgGridNav.resizeTimer);
        dgGridNav.resizeTimer = setTimeout(dgGridOnResize, 150);
      };
      window.addEventListener('resize', dgGridNav.handleResize);
    }

    // ─── Panneau d'une piece (gauche ou droite), en trois blocs empiles dont la hauteur vient
    // uniquement de leur contenu (voir CSS) : image seule, identite + selection rapide, puis
    // description detaillee. Aucun ne defile ni n'est jamais rogne : un texte plus long allonge
    // simplement le bloc, et la page avec lui. ───
    function dgPanelHTML(side, slot, sel) {
      const cat = CATALOGUE[slot.modele];
      if (!cat) return '';
      const initialSrc = dgProduitSrc(slot.type, slot.modele, sel.matiere);
      const matieresHTML = cat.matieres.map((m) => `
        <button type="button" class="dg-swatch${m.key === sel.matiere ? ' is-active' : ''}" style="background:${m.swatch}" data-matiere="${m.key}" aria-label="${m.label}" onclick="dgSwapMatiere('${side}','${m.key}')"></button>
      `).join('');
      const mesuresHTML = (cat.mesures || []).map((v) => `<option value="${v}"${v === sel.mesure ? ' selected' : ''}>${v}</option>`).join('');
      const compositionHTML = (cat.composition || []).map((c) => `<li>${c.label} : ${c.valeur}</li>`).join('');
      const mesuresListe = (cat.mesures || []).join(', ');

      return `
        <div class="dg-panel-image">
          <img class="dg-panel-img dg-panel-img--a" id="dg-panel-img-${side}-a" src="${initialSrc}" alt="${cat.nom}" onerror="this.onerror=null;this.src='${DG_PANEL_FALLBACK_IMG}';" />
          <img class="dg-panel-img dg-panel-img--b" id="dg-panel-img-${side}-b" src="" alt="" />
        </div>
        <div class="dg-panel-identite">
          <h4 class="dg-panel-nom">${cat.nom}</h4>
          <p class="dg-panel-desc">${cat.description}</p>
          <div class="dg-panel-matieres" role="group" aria-label="Choix de la matière">${matieresHTML}</div>
          <select class="dg-panel-mesure" aria-label="Choix de la mesure" onchange="dgSetMesure('${side}', this.value)">${mesuresHTML}</select>
          <p class="dg-panel-prix" id="dg-panel-prix-${side}">${dgPrixPiece(slot, sel.matiere)} CHF</p>
        </div>
        <div class="dg-panel-detail">
          <p class="dg-panel-detail-label">Matière</p>
          <ul class="dg-panel-detail-list">${compositionHTML}</ul>
          <p class="dg-panel-detail-label">Mesures disponibles</p>
          <p class="dg-panel-detail-text">${mesuresListe}</p>
          <p class="dg-panel-detail-label">Entretien</p>
          <p class="dg-panel-detail-text">${cat.entretien || ''}</p>
        </div>
      `;
    }

    function dgSwapMatiere(side, matiereKey) {
      if (!dgFocus) return;
      const sel = dgFocus[side];
      const slot = dgFocus.duo[side];
      const cat = CATALOGUE[slot.modele];
      if (!sel || !cat || sel.matiere === matiereKey) return;
      const matiere = cat.matieres.find((m) => m.key === matiereKey);
      if (!matiere) return;

      const panel = document.getElementById(`dg-focus-panel-${side}`);
      if (panel) {
        panel.querySelectorAll('.dg-swatch').forEach((btn) => {
          btn.classList.toggle('is-active', btn.dataset.matiere === matiereKey);
        });
      }
      const prixEl = document.getElementById(`dg-panel-prix-${side}`);
      if (prixEl) prixEl.textContent = `${dgPrixPiece(slot, matiereKey)} CHF`;

      const front = sel.front;
      const back = front === 'a' ? 'b' : 'a';
      const frontEl = document.getElementById(`dg-panel-img-${side}-${front}`);
      const backEl = document.getElementById(`dg-panel-img-${side}-${back}`);
      const newSrc = dgProduitSrc(slot.type, slot.modele, matiereKey);
      sel.matiere = matiereKey;
      if (!frontEl || !backEl) return;

      const reduced = dgReducedMotion();
      const probe = new Image();
      probe.onload = () => dgFinishMatiereSwap(frontEl, backEl, newSrc, matiere.label, sel, back, reduced);
      probe.onerror = () => dgFinishMatiereSwap(frontEl, backEl, DG_PANEL_FALLBACK_IMG, matiere.label, sel, back, reduced);
      probe.src = newSrc;
    }

    function dgFinishMatiereSwap(frontEl, backEl, src, label, sel, back, reduced) {
      // dgFocus peut avoir ete ferme (ou la matiere re-changee) pendant le prechargement.
      if (!dgFocus) return;
      backEl.src = src;
      backEl.alt = label;
      if (reduced) {
        gsap.set(backEl, { opacity: 1 });
        gsap.set(frontEl, { opacity: 0 });
      } else {
        gsap.set(backEl, { opacity: 0 });
        gsap.to(backEl, { opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.to(frontEl, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      }
      sel.front = back;
    }

    function dgSetMesure(side, value) {
      if (!dgFocus || !dgFocus[side]) return;
      dgFocus[side].mesure = value;
    }

    // ─── Page duo (rendue par le routeur, voir main.js) ───
    // Construit la page duo directement remplie (jamais une coquille vide peuplee ensuite en
    // JS) : un chargement direct de /duo/{id} doit s'afficher correct sans aucune transition.
    // dgOpen (plus bas) se charge seul de masquer puis reveler ces memes elements lorsque la
    // page arrive depuis un clic sur la grille d'accueil.
    function renderDuo(id) {
      const duo = XS_DUOS.find((d) => d.id === id);
      if (!duo) { navigate('home'); return; }

      const gaucheSel = dgDefaultSelection(duo.gauche.modele);
      const droiteSel = dgDefaultSelection(duo.droite.modele);
      dgFocus = { duoId: id, duo, gauche: gaucheSel, droite: droiteSel };

      app.innerHTML = `
        <div class="dg-focus-page">
          <div class="dg-focus-back" onclick="navigate('home')">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="back-arrow-label">Retour</span>
          </div>
          <div class="dg-focus-columns">
            <div class="dg-focus-panel dg-focus-panel--gauche" id="dg-focus-panel-gauche">${dgPanelHTML('gauche', duo.gauche, gaucheSel)}</div>
            <div class="dg-focus-central">
              <div class="dg-focus-image-slot" id="dg-focus-image-slot">
                <img class="dg-focus-image" id="dg-focus-image" src="${duo.mainImg}" alt="${duo.label}" />
                <div class="dg-focus-content">
                  <h1 class="dg-focus-title">${duo.label}</h1>
                  <p class="dg-focus-desc">${duo.description}</p>
                </div>
              </div>
              <div class="dg-focus-addcart-wrap" id="dg-focus-addcart-wrap">
                <button type="button" class="dg-focus-addcart" onclick="dgAddToCart()">Ajouter au panier</button>
              </div>
            </div>
            <div class="dg-focus-panel dg-focus-panel--droite" id="dg-focus-panel-droite">${dgPanelHTML('droite', duo.droite, droiteSel)}</div>
          </div>
          <div class="dg-focus-below"></div>
        </div>
      `;
    }

    // ─── Transition depuis la grille d'accueil (FLIP manuel) ───
    // Le clone volant est insere dans <body>, hors de #app : il survit donc au re-rendu que
    // navigate() declenche pour la nouvelle route (#app.innerHTML est entierement remplace).
    // Aucun etat d'ouverture "actif" n'est plus garde ici — chaque page duo est independante,
    // rechargeable directement — dgOpen ne fait que sequencer une animation par dessus une
    // navigation de route normale.
    function dgOpen(duoId, itemEl) {
      if (!itemEl) return;
      const duo = XS_DUOS.find((d) => d.id === duoId);
      if (!duo) return;

      dgRememberHomeState();

      if (dgReducedMotion()) {
        navigate('duo-' + duoId);
        return;
      }

      const img = itemEl.querySelector('.dg-item-img');
      const startRect = img.getBoundingClientRect();

      const clone = document.createElement('div');
      clone.className = 'dg-route-clone';
      clone.innerHTML = `<img src="${duo.mainImg}" alt="" draggable="false" />`;
      document.body.appendChild(clone);
      gsap.set(clone, {
        x: startRect.left, y: startRect.top,
        width: startRect.width, height: startRect.height,
        opacity: 1,
      });

      navigate('duo-' + duoId, {
        onRendered: () => {
          const imageSlot = document.getElementById('dg-focus-image-slot');
          if (!imageSlot) { clone.remove(); return; }
          const panelG = document.getElementById('dg-focus-panel-gauche');
          const panelD = document.getElementById('dg-focus-panel-droite');
          const addcartWrap = document.getElementById('dg-focus-addcart-wrap');
          const reveals = [imageSlot, panelG, panelD, addcartWrap].filter(Boolean);

          // Masque la page reelle avant le premier rendu visible (meme tick que render(),
          // avant peinture du navigateur : aucun scintillement) le temps que le clone volant
          // termine sa course vers la position finale de l'image centrale.
          gsap.set(reveals, { opacity: 0 });
          if (panelG) gsap.set(panelG, { x: -24 });
          if (panelD) gsap.set(panelD, { x: 24 });

          const destRect = imageSlot.getBoundingClientRect();
          gsap.to(clone, {
            x: destRect.left, y: destRect.top,
            width: destRect.width, height: destRect.height,
            duration: 0.7, ease: 'power3.inOut',
            onComplete: () => {
              gsap.set(imageSlot, { opacity: 1 });
              clone.remove();
              if (panelG) gsap.to(panelG, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
              if (panelD) gsap.to(panelD, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.08 });
              if (addcartWrap) gsap.to(addcartWrap, { opacity: 1, duration: 0.5, ease: 'power2.out' });
            },
          });
        },
      });
    }

    // ─── Panier ───
    function dgAddToCart() {
      if (!dgFocus) return;
      const duo = dgFocus.duo;
      const g = dgFocus.gauche, d = dgFocus.droite;
      const item = {
        type: 'duo',
        duoId: duo.id,
        gauche: { type: duo.gauche.type, modele: duo.gauche.modele, matiere: g.matiere, mesure: g.mesure },
        droite: { type: duo.droite.type, modele: duo.droite.modele, matiere: d.matiere, mesure: d.mesure },
        prix: dgPrixPiece(duo.gauche, g.matiere) + dgPrixPiece(duo.droite, d.matiere),
      };
      dgPanier.push(item);
      dgSavePanier();
      dgPulseCompteur();
    }

    // ─── Cycle de vie ───
    // Appelee par initHomeAnimations (accueil.js) a chaque rendu de l'accueil ; dgGridInit
    // nettoie et re-attache seul la grille (piste, navigation, gestes), pour eviter tout
    // doublon d'ecouteur au retour sur l'accueil.
    function dgInit() {
      dgGridInit();
    }

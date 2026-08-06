// ─── duo.js ───
// Grille duo de la page d'accueil (dg-section/dg-grid-*/dg-item) et sa vue focus, transformee
// en parcours d'achat : au clic sur une image, l'image cliquee est clonee en position fixed
// et animee (FLIP manuel, aucun plugin Flip sous licence Club GreenSock) vers le centre ; une
// fois immobile, deux panneaux lateraux (un par piece du duo) et un bouton d'ajout au panier
// apparaissent. CATALOGUE (donnees.js) est la seule source de verite pour matieres, mesures,
// descriptions, prix et details (composition, entretien) des pieces ; XS_DUOS ne fait que
// designer, pour chaque duo, quelle piece occupe l'emplacement gauche et lequel occupe le
// droit. La grille elle meme reutilise le systeme de navigation par piste + barre de
// progression + fleches (mêmes regles que l'ancien carrousel) : navigation visible seulement
// si les duos depassent la largeur disponible, grille simple sinon.

    let dgActive = null;      // id du duo ouvert, ou null
    let dgClosing = false;    // vrai pendant l'animation de fermeture (anti double-fermeture)
    let dgFocus = null;       // etat de travail de la vue focus ouverte (selections, etc.)
    let dgHistoryPushed = false;

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

    function dgGridItemHTML(duo) {
      return `
        <div class="dg-item" data-duo-id="${duo.id}" onclick="dgOpen('${duo.id}', this)">
          <img class="dg-item-img" src="${duo.mainImg}" alt="Duo ${duo.label}" loading="lazy" draggable="false" />
          <span class="dg-item-label">${duo.label}</span>
        </div>
      `;
    }

    function dgGridMeasure() {
      const nav = dgGridNav;
      nav.pageWidth = nav.viewport.getBoundingClientRect().width;
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
      dgGridApply(0, false);

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

    // ─── Panneau d'une piece (gauche ou droite), en trois blocs : image (44% environ),
    // identite + selection rapide (auto), detail defilant (flex:1, jamais dependant de la
    // longueur du contenu — voir .dg-panel-detail). ───
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
        <div class="dg-panel-detail" data-lenis-prevent>
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

    // ─── Mise en page de la composition (3 colonnes 1fr/0.8fr/1fr en bureau, empilee sous
    // 900px). Toutes les dimensions sont calculees ici, jamais codees en dur ailleurs :
    // destW/destH derivent de --duo-ratio et de la largeur totale (92% du viewport, max
    // 1800px, gouttiere 56px) ; la hauteur de l'image reste la reference de toute la
    // composition, les panneaux s'y alignant en haut et en bas (voir CSS, height:100%). ───
    function dgComputeComposition() {
      const vw = window.innerWidth, vh = window.innerHeight;
      const ratio = dgRatio();
      const mobile = vw < 900;

      if (mobile) {
        const margin = 20;
        const destW = vw - margin * 2;
        const destH = destW / ratio;
        return { mobile: true, destX: margin, destY: margin, destW, destH, panelWidth: destW, gap: 20 };
      }

      const margin = 40;
      const gap = 56;
      const cartMarginTop = 48;
      const cartRowH = 60;
      const colUnits = 1 + 0.8 + 1;

      let totalW = Math.min(vw * 0.92, 1800);
      let unitW = (totalW - gap * 2) / colUnits;
      let panelWidth = unitW;
      let destW = unitW * 0.8;
      let destH = destW / ratio;

      // L'image centrale reste la reference de hauteur des panneaux, jamais l'inverse : si la
      // composition totale (image + marge + bouton) depasse la hauteur de fenetre disponible,
      // on la reduit en bloc (largeur et hauteur ensemble), sans jamais recalculer les
      // panneaux independamment de l'image.
      const vAvail = vh - margin * 2;
      if (destH + cartMarginTop + cartRowH > vAvail && vAvail > 200) {
        const scale = Math.max(0.4, Math.min(1, (vAvail - cartMarginTop - cartRowH) / destH));
        totalW *= scale; unitW *= scale; panelWidth *= scale; destW *= scale; destH *= scale;
      }

      const destX = (vw - totalW) / 2 + panelWidth + gap;
      const destY = Math.max(margin, (vh - (destH + cartMarginTop + cartRowH)) / 2);
      return { mobile: false, destX, destY, destW, destH, panelWidth, gap };
    }

    function dgApplyCompositionLayout(compEl, comp) {
      compEl.style.setProperty('--dg-img-w', comp.destW + 'px');
      compEl.style.setProperty('--dg-img-h', comp.destH + 'px');
      compEl.style.setProperty('--dg-panel-w', comp.panelWidth + 'px');
      compEl.style.setProperty('--dg-gap', comp.gap + 'px');
      if (comp.mobile) {
        compEl.style.left = comp.destX + 'px';
        compEl.style.top = comp.destY + 'px';
        compEl.style.width = comp.destW + 'px';
        compEl.style.maxHeight = (window.innerHeight - comp.destY * 2) + 'px';
      } else {
        const left = comp.destX - comp.panelWidth - comp.gap;
        compEl.style.left = left + 'px';
        compEl.style.top = comp.destY + 'px';
        compEl.style.width = (comp.panelWidth * 2 + comp.destW + comp.gap * 2) + 'px';
        compEl.style.maxHeight = (window.innerHeight - 40) + 'px';
      }
    }

    // ─── Ouverture / fermeture (FLIP manuel) ───
    function dgOpen(duoId, itemEl) {
      if (dgActive || dgClosing || !itemEl) return;
      const duo = XS_DUOS.find((d) => d.id === duoId);
      if (!duo) return;
      const img = itemEl.querySelector('.dg-item-img');
      const startRect = img.getBoundingClientRect();

      const veil = document.getElementById('dg-veil');
      const clone = document.getElementById('dg-clone');
      const comp = document.getElementById('dg-focus-composition');
      const focusImg = document.getElementById('dg-focus-image');
      const imageSlot = document.getElementById('dg-focus-image-slot');
      const panelG = document.getElementById('dg-focus-panel-gauche');
      const panelD = document.getElementById('dg-focus-panel-droite');
      const addcartWrap = document.getElementById('dg-focus-addcart-wrap');
      if (!veil || !clone || !comp || !panelG || !panelD) return;

      const gaucheSel = dgDefaultSelection(duo.gauche.modele);
      const droiteSel = dgDefaultSelection(duo.droite.modele);
      dgFocus = { duoId, duo, itemEl, gauche: gaucheSel, droite: droiteSel };
      dgActive = duoId;

      document.getElementById('dg-focus-title').textContent = duo.label;
      document.getElementById('dg-focus-desc').textContent = duo.description;
      focusImg.src = duo.mainImg;
      focusImg.alt = duo.label;
      panelG.innerHTML = dgPanelHTML('gauche', duo.gauche, gaucheSel);
      panelD.innerHTML = dgPanelHTML('droite', duo.droite, droiteSel);

      const composition = dgComputeComposition();
      dgFocus.mobile = composition.mobile;
      dgApplyCompositionLayout(comp, composition);

      const reveals = [imageSlot, panelG, panelD, addcartWrap];
      gsap.set(reveals, { opacity: 0 });
      gsap.set(panelG, { x: -24 });
      gsap.set(panelD, { x: 24 });
      comp.classList.remove('is-open');

      document.querySelectorAll('.dg-item').forEach((el) => { if (el !== itemEl) gsap.set(el, { opacity: 1 }); });

      const reduced = dgReducedMotion();

      dgFreezeScroll(true);
      if (!dgHistoryPushed) {
        history.pushState({ dgFocus: duoId }, '');
        dgHistoryPushed = true;
      }

      if (reduced) {
        gsap.set(veil, { opacity: 1, pointerEvents: 'auto' });
        gsap.set(clone, { opacity: 0 });
        document.querySelectorAll('.dg-item').forEach((el) => { if (el !== itemEl) gsap.set(el, { opacity: 0 }); });
        gsap.set(reveals, { opacity: 1, x: 0 });
        comp.classList.add('is-open');
        return;
      }

      gsap.set(clone, {
        x: startRect.left, y: startRect.top,
        width: startRect.width, height: startRect.height,
        opacity: 1,
      });
      clone.querySelector('img').src = duo.mainImg;

      document.querySelectorAll('.dg-item').forEach((el) => { if (el !== itemEl) gsap.to(el, { opacity: 0, duration: 0.3 }); });
      gsap.to(veil, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power2.out' });

      gsap.to(clone, {
        x: composition.destX, y: composition.destY,
        width: composition.destW, height: composition.destH,
        duration: 0.6, ease: 'power3.inOut',
        onComplete: () => {
          if (!dgFocus || dgFocus.duoId !== duoId) return; // fermeture entre temps
          gsap.set(clone, { opacity: 0 });
          comp.classList.add('is-open');
          gsap.to(imageSlot, { opacity: 1, duration: 0.5, ease: 'power2.out' });
          gsap.to(panelG, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' });
          gsap.to(panelD, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.08 });
          gsap.to(addcartWrap, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        },
      });
    }

    function dgClose(skipHistory) {
      if (!dgActive || dgClosing || !dgFocus) return;
      dgClosing = true;
      const duoId = dgFocus.duoId;
      const itemEl = dgFocus.itemEl;
      const img = itemEl.querySelector('.dg-item-img');
      const rect = img.getBoundingClientRect();

      const veil = document.getElementById('dg-veil');
      const clone = document.getElementById('dg-clone');
      const comp = document.getElementById('dg-focus-composition');
      const imageSlot = document.getElementById('dg-focus-image-slot');
      const panelG = document.getElementById('dg-focus-panel-gauche');
      const panelD = document.getElementById('dg-focus-panel-droite');
      const addcartWrap = document.getElementById('dg-focus-addcart-wrap');
      const reveals = [imageSlot, panelG, panelD, addcartWrap];

      const reduced = dgReducedMotion();
      comp.classList.remove('is-open');

      const finish = () => {
        gsap.set(clone, { opacity: 0 });
        gsap.set(reveals, { opacity: 0 });
        document.querySelectorAll('.dg-item').forEach((el) => gsap.set(el, { opacity: 1 }));
        gsap.set(veil, { opacity: 0, pointerEvents: 'none' });
        dgFreezeScroll(false);
        if (!skipHistory && dgHistoryPushed) { history.back(); }
        dgHistoryPushed = false;
        dgActive = null;
        dgFocus = null;
        dgClosing = false;
      };

      if (reduced) { finish(); return; }

      gsap.to(document.querySelectorAll('.dg-item'), { opacity: 1, duration: 0.3 });
      gsap.to(reveals, {
        opacity: 0, duration: 0.25, ease: 'power2.out',
        onComplete: () => {
          // Le clone est reste, invisible, exactement a la position d'arrivee du morphing
          // d'ouverture (x/y/width/height inchanges depuis l'onComplete de dgOpen — un resize
          // pendant l'ouverture force une fermeture instantanee via dgForceClose, donc cet etat
          // n'est jamais perime ici) : on le rend visible depuis cette position pour repartir
          // vers le rect d'origine de la vignette.
          gsap.set(clone, { opacity: 1 });
          gsap.to(veil, { opacity: 0, duration: 0.4, ease: 'power2.out' });
          gsap.to(clone, {
            x: rect.left, y: rect.top, width: rect.width, height: rect.height,
            duration: 0.5, ease: 'power3.inOut',
            onComplete: finish,
          });
        },
      });
    }

    function dgFreezeScroll(freeze) {
      document.body.style.overflow = freeze ? 'hidden' : '';
      if (typeof lenis !== 'undefined' && lenis) { if (freeze) lenis.stop(); else lenis.start(); }
    }

    // Fermeture immediate, sans animation : resize pendant l'ouverture ou changement de vue.
    function dgForceClose() {
      if (!dgActive && !dgClosing) return;
      const veil = document.getElementById('dg-veil');
      const clone = document.getElementById('dg-clone');
      const comp = document.getElementById('dg-focus-composition');
      const reveals = [
        document.getElementById('dg-focus-image-slot'),
        document.getElementById('dg-focus-panel-gauche'),
        document.getElementById('dg-focus-panel-droite'),
        document.getElementById('dg-focus-addcart-wrap'),
      ];
      if (comp) comp.classList.remove('is-open');
      [veil, clone, comp, ...reveals].forEach((el) => el && gsap.killTweensOf(el));
      if (veil) gsap.set(veil, { opacity: 0, pointerEvents: 'none' });
      if (clone) gsap.set(clone, { opacity: 0 });
      gsap.set(reveals, { opacity: 0, x: 0 });
      document.querySelectorAll('.dg-item').forEach((el) => gsap.set(el, { opacity: 1 }));
      dgFreezeScroll(false);
      // Consomme l'entree d'historique poussee a l'ouverture, meme ici (resize ou changement
      // de vue), pour ne jamais laisser une entree fantome : le prochain "retour" du
      // navigateur doit quitter la page reellement visitee, pas repasser silencieusement par
      // un focus deja ferme. dgActive est efface avant, le prochain evenement popstate ne
      // relancera donc pas de fermeture.
      const hadHistory = dgHistoryPushed;
      dgHistoryPushed = false;
      dgActive = null;
      dgFocus = null;
      dgClosing = false;
      if (hadHistory) history.back();
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
      dgClose();
    }

    // ─── Cycle de vie ───
    // Le redimensionnement pendant l'ouverture ferme le focus instantanement (ecouteur global,
    // voir main.js). dgInit reste appelable une seule fois par rendu ; dgCleanup ferme d'abord
    // tout focus laisse ouvert par un rendu precedent, dgGridInit nettoie et re-attache la
    // grille, pour eviter tout doublon d'ecouteur au retour sur l'accueil.
    function dgCleanup() {
      dgForceClose();
    }

    function dgInit() {
      dgCleanup();
      dgGridInit();
    }

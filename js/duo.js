// ─── duo.js ───
// Grille duo de la page d'accueil (dg-section/dg-grid/dg-item) et sa vue focus, transformee
// en parcours d'achat : au clic sur une image, l'image cliquee est clonee en position fixed
// et animee (FLIP manuel, aucun plugin Flip sous licence Club GreenSock) vers le centre ; une
// fois immobile, deux panneaux lateraux (un par piece du duo) et un bouton d'ajout au panier
// apparaissent. CATALOGUE (donnees.js) est la seule source de verite pour matieres, mesures,
// descriptions et prix des pieces ; XS_DUOS ne fait que designer, pour chaque duo, quelle
// piece occupe l'emplacement gauche et lequel occupe le droit.

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

    // ─── Grille ───
    function dgGridItemHTML(duo) {
      return `
        <div class="dg-item" data-duo-id="${duo.id}" onclick="dgOpen('${duo.id}', this)">
          <img class="dg-item-img" src="${duo.mainImg}" alt="Duo ${duo.label}" loading="lazy" draggable="false" />
          <span class="dg-item-label">${duo.label}</span>
        </div>
      `;
    }

    function dgGridHTML() {
      return XS_DUOS.map(dgGridItemHTML).join('');
    }

    // ─── Panneau d'une piece (gauche ou droite) ───
    function dgPanelHTML(side, slot, sel) {
      const cat = CATALOGUE[slot.modele];
      if (!cat) return '';
      const initialSrc = dgProduitSrc(slot.type, slot.modele, sel.matiere);
      const matieresHTML = cat.matieres.map((m) => `
        <button type="button" class="dg-swatch${m.key === sel.matiere ? ' is-active' : ''}" style="background:${m.swatch}" data-matiere="${m.key}" aria-label="${m.label}" onclick="dgSwapMatiere('${side}','${m.key}')"></button>
      `).join('');
      const mesuresHTML = (cat.mesures || []).map((v) => `<option value="${v}"${v === sel.mesure ? ' selected' : ''}>${v}</option>`).join('');
      return `
        <div class="dg-panel-imgwrap">
          <img class="dg-panel-img dg-panel-img--a" id="dg-panel-img-${side}-a" src="${initialSrc}" alt="${cat.nom}" onerror="this.onerror=null;this.src='${DG_PANEL_FALLBACK_IMG}';" />
          <img class="dg-panel-img dg-panel-img--b" id="dg-panel-img-${side}-b" src="" alt="" />
        </div>
        <h4 class="dg-panel-nom">${cat.nom}</h4>
        <p class="dg-panel-desc">${cat.description}</p>
        <div class="dg-panel-matieres" role="group" aria-label="Choix de la matière">${matieresHTML}</div>
        <select class="dg-panel-mesure" aria-label="Choix de la mesure" onchange="dgSetMesure('${side}', this.value)">${mesuresHTML}</select>
        <p class="dg-panel-prix" id="dg-panel-prix-${side}">${dgPrixPiece(slot, sel.matiere)} CHF</p>
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

    // ─── Mise en page de la composition (3 colonnes en bureau, empilee sous 900px) ───
    // Toutes les dimensions sont calculees ici, jamais codees en dur ailleurs : destW/destH
    // derivent de --duo-ratio, la largeur des panneaux et les marges du viewport courant.
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
      const gap = 32;
      let destH = Math.min(vh * 0.56, 520);
      let destW = destH * ratio;
      let panelWidth = Math.min(260, Math.max(200, destW * 0.6));
      const total = () => panelWidth * 2 + destW + gap * 2;
      const maxTotal = vw - margin * 2;
      if (total() > maxTotal) {
        const scale = maxTotal / total();
        destW *= scale; destH *= scale; panelWidth *= scale;
      }
      const compW = panelWidth * 2 + destW + gap * 2;
      const destX = (vw - compW) / 2 + panelWidth + gap;
      const destY = Math.max(margin, (vh - destH) / 2 - 16);
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
      const decouvrirWrap = document.getElementById('dg-focus-decouvrir-wrap');
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

      const reveals = [imageSlot, decouvrirWrap, panelG, panelD, addcartWrap];
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
          gsap.to([imageSlot, decouvrirWrap], { opacity: 1, duration: 0.5, ease: 'power2.out' });
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
      const decouvrirWrap = document.getElementById('dg-focus-decouvrir-wrap');
      const panelG = document.getElementById('dg-focus-panel-gauche');
      const panelD = document.getElementById('dg-focus-panel-droite');
      const addcartWrap = document.getElementById('dg-focus-addcart-wrap');
      const reveals = [imageSlot, decouvrirWrap, panelG, panelD, addcartWrap];

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
        document.getElementById('dg-focus-decouvrir-wrap'),
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
    // voir main.js, meme convention que xsGalleryForceCloseFocus). dgInit ne pose donc aucun
    // ecouteur resize propre ; il ne reste qu'a re-attacher la grille a chaque rendu, en
    // fermant d'abord tout focus laisse ouvert par un rendu precedent pour eviter les doublons
    // au retour sur l'accueil.
    function dgCleanup() {
      dgForceClose();
    }

    function dgInit() {
      dgCleanup();
      const grid = document.getElementById('dg-grid');
      if (!grid) return;
      grid.innerHTML = dgGridHTML();
    }

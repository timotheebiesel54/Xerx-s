// ─── galerie.js ───
// Navigation (barre de progression + flèches) de la galerie d'accueil et vue
// focus au clic, avec leur etat (xsGalleryNav, xsFocusActive,
// xsFocusAnimating, xsFocusOriginEl).

    // ─── GALERIE D'ACCUEIL : piste à pages, bornée, + vue focus au clic ───
    // Aucun ScrollTrigger, aucun scrub, aucun pin, aucune propriété liée au scroll de la PAGE :
    // la piste est un flex row translaté par GSAP sur x à l'intérieur d'un conteneur overflow
    // hidden, la page continue de défiler normalement par-dessus/en dessous. Alimentée par un
    // tableau JS pour pouvoir passer de 5 à N images sans toucher au HTML.

    let xsGalleryNav = null;
    let xsFocusActive = null;
    let xsFocusAnimating = false;
    let xsFocusOriginEl = null;

    function xsGalleryItemHTML(item, i) {
      return `
        <figure class="xs-gallery-item" onclick="xsGalleryOpenFocus(${i}, this)">
          <img src="${item.src}" alt="${item.label}" loading="lazy" draggable="false" />
          <figcaption>${item.label}</figcaption>
        </figure>
      `;
    }

    // Nettoie les listeners posés sur window (resize, drag en cours) et les tweens résiduels.
    // Appelée avant chaque (ré)initialisation et depuis navigate() au changement de page, pour
    // ne jamais accumuler de doublons au retour sur l'accueil.
    function xsGalleryCleanup() {
      if (!xsGalleryNav) return;
      clearTimeout(xsGalleryNav.resizeTimer);
      window.removeEventListener('resize', xsGalleryNav.handleResize);
      window.removeEventListener('pointermove', xsGalleryOnDragMove);
      window.removeEventListener('pointerup', xsGalleryOnDragEnd);
      window.removeEventListener('pointercancel', xsGalleryOnDragEnd);
      gsap.killTweensOf([xsGalleryNav.track, xsGalleryNav.fill]);
      xsGalleryNav = null;
    }

    // Mesure page/piste/carte à l'instant présent — jamais de valeur codée en dur.
    function xsGalleryMeasure() {
      const { viewport, track } = xsGalleryNav;
      xsGalleryNav.pageWidth = viewport.getBoundingClientRect().width;
      xsGalleryNav.trackWidth = track.scrollWidth;
      xsGalleryNav.maxX = Math.max(0, xsGalleryNav.trackWidth - xsGalleryNav.pageWidth);
      const items = track.children;
      xsGalleryNav.cardStep = items.length > 1
        ? items[1].offsetLeft - items[0].offsetLeft
        : xsGalleryNav.pageWidth;
    }

    // Déplace la piste à `pos` (borné 0..maxX) et anime la barre de progression en accord —
    // ratio = (déplacement + largeur visible) / largeur totale de la piste, borné 0..1.
    function xsGalleryApply(pos, animate) {
      const nav = xsGalleryNav;
      if (!nav) return;
      const clamped = Math.min(Math.max(pos, 0), nav.maxX);
      const ratio = nav.trackWidth > 0
        ? Math.min(1, Math.max(0, (clamped + nav.pageWidth) / nav.trackWidth))
        : 0;
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

    // Le pas est une page entière (largeur du conteneur visible), systématiquement écrêté aux
    // bornes — pas de boucle, pas de retour au début.
    function xsGalleryNext() {
      if (!xsGalleryNav) return;
      xsGalleryApply(xsGalleryNav.pos + xsGalleryNav.pageWidth, true);
    }
    function xsGalleryPrev() {
      if (!xsGalleryNav) return;
      xsGalleryApply(xsGalleryNav.pos - xsGalleryNav.pageWidth, true);
    }

    function xsGalleryOnResize() {
      if (!xsGalleryNav) return;
      xsGalleryMeasure();
      xsGalleryApply(Math.min(xsGalleryNav.pos, xsGalleryNav.maxX), false);
    }

    // Glissement au doigt/à la souris (pointerdown/move/up), mêmes bornes que les flèches. Pas
    // de setPointerCapture : ça redirigerait le 'click' final vers le conteneur au lieu de la
    // figure sous le curseur, empêchant l'ouverture du focus sur un simple clic. On suit donc le
    // pointeur via des listeners posés sur window pendant la durée du drag.
    function xsGalleryOnDragStart(e) {
      const nav = xsGalleryNav;
      if (!nav || xsFocusActive !== null) return;
      gsap.killTweensOf([nav.track, nav.fill]);
      nav.gesture = { startX: e.clientX, startPos: nav.pos, pointerId: e.pointerId, moved: false };
      nav.viewport.classList.add('is-dragging');
      window.addEventListener('pointermove', xsGalleryOnDragMove);
      window.addEventListener('pointerup', xsGalleryOnDragEnd);
      window.addEventListener('pointercancel', xsGalleryOnDragEnd);
    }
    function xsGalleryOnDragMove(e) {
      const nav = xsGalleryNav;
      if (!nav || !nav.gesture || e.pointerId !== nav.gesture.pointerId) return;
      const dx = e.clientX - nav.gesture.startX;
      if (Math.abs(dx) > 4) nav.gesture.moved = true;
      const clamped = Math.min(Math.max(nav.gesture.startPos - dx, 0), nav.maxX);
      const ratio = nav.trackWidth > 0
        ? Math.min(1, Math.max(0, (clamped + nav.pageWidth) / nav.trackWidth))
        : 0;
      gsap.set(nav.track, { x: -clamped });
      gsap.set(nav.fill, { width: (ratio * 100) + '%' });
      nav.pos = clamped;
      nav.prevBtn.disabled = clamped <= 0.5;
      nav.nextBtn.disabled = clamped >= nav.maxX - 0.5;
    }
    function xsGalleryOnDragEnd(e) {
      const nav = xsGalleryNav;
      if (!nav || !nav.gesture || e.pointerId !== nav.gesture.pointerId) return;
      nav.viewport.classList.remove('is-dragging');
      window.removeEventListener('pointermove', xsGalleryOnDragMove);
      window.removeEventListener('pointerup', xsGalleryOnDragEnd);
      window.removeEventListener('pointercancel', xsGalleryOnDragEnd);
      // Au relâchement, la piste se cale sur la carte la plus proche, puis reste bornée.
      const step = nav.cardStep || nav.pageWidth;
      const nearest = Math.round(nav.pos / step) * step;
      xsGalleryApply(nearest, true);
    }

    function xsGalleryInit() {
      xsGalleryCleanup();

      const viewport = document.getElementById('xs-gallery-viewport');
      const track = document.getElementById('xs-gallery-track');
      const fill = document.getElementById('xs-gallery-progress-fill');
      const prevBtn = document.getElementById('xs-gallery-prev');
      const nextBtn = document.getElementById('xs-gallery-next');
      if (!viewport || !track || !fill || !prevBtn || !nextBtn) return;

      track.innerHTML = XS_GALLERY_ITEMS.map(xsGalleryItemHTML).join('');

      xsGalleryNav = {
        viewport, track, fill, prevBtn, nextBtn,
        pos: 0, pageWidth: 0, trackWidth: 0, maxX: 0, cardStep: 0,
        resizeTimer: null, gesture: null, handleResize: null,
      };

      xsGalleryMeasure();
      xsGalleryApply(0, false);

      prevBtn.addEventListener('click', xsGalleryPrev);
      nextBtn.addEventListener('click', xsGalleryNext);
      viewport.addEventListener('pointerdown', xsGalleryOnDragStart);

      // Un drag qui a effectivement bougé ne doit pas déclencher le clic (ouverture du focus)
      // sur la figure relâchée.
      viewport.addEventListener('click', (e) => {
        if (xsGalleryNav && xsGalleryNav.gesture && xsGalleryNav.gesture.moved) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (xsGalleryNav && xsGalleryNav.gesture) xsGalleryNav.gesture.moved = false;
      }, true);

      xsGalleryNav.handleResize = () => {
        clearTimeout(xsGalleryNav.resizeTimer);
        xsGalleryNav.resizeTimer = setTimeout(xsGalleryOnResize, 150);
      };
      window.addEventListener('resize', xsGalleryNav.handleResize);
    }

    // Contenu affiché dans le focus (image, label, description) — appelé à l'ouverture.
    function xsGalleryRenderFocus(index) {
      const item = XS_GALLERY_ITEMS[index];
      if (!item) return;
      document.getElementById('xs-focus-img').src = item.src;
      document.getElementById('xs-focus-img').alt = item.label;
      document.getElementById('xs-focus-label').textContent = item.label;
      document.getElementById('xs-focus-desc').textContent = item.description;
    }

    function xsFocusPrefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Fige le scroll de la page pendant le focus, pour que le rect d'origine (utilisé au
    // retour) reste valide tant que l'overlay est ouvert. La piste elle-même est déjà en
    // overflow hidden en permanence et le drag est bloqué tant que le focus est actif
    // (voir xsGalleryOnDragStart).
    function xsFocusFreezeScroll(freeze) {
      document.body.style.overflow = freeze ? 'hidden' : '';
      if (typeof lenis !== 'undefined' && lenis) { if (freeze) lenis.stop(); else lenis.start(); }
    }

    // FLIP manuel (pas de gsap.Flip, non sous licence ici) : le cadre .xs-focus-box part
    // exactement du rect de l'image cliquée et anime x/y/width/height ensemble vers le rect de
    // destination. Un flag isAnimating bloque tout nouveau clic pendant la transition.
    function xsGalleryOpenFocus(index, clickedEl) {
      if (xsFocusAnimating || xsFocusActive !== null || !clickedEl) return;
      const item = XS_GALLERY_ITEMS[index];
      if (!item) return;

      xsFocusAnimating = true;
      xsFocusActive = index;
      xsFocusOriginEl = clickedEl;
      xsGalleryRenderFocus(index);
      xsFocusFreezeScroll(true);

      const veil = document.getElementById('xs-focus-veil');
      const box = document.getElementById('xs-focus-box');
      const content = document.getElementById('xs-focus-content');
      const startRect = clickedEl.getBoundingClientRect();
      const reduced = xsFocusPrefersReducedMotion();

      gsap.set(box, {
        x: startRect.left, y: startRect.top,
        width: startRect.width, height: startRect.height,
        opacity: 1, pointerEvents: 'none',
      });
      gsap.set(content, { opacity: 0 });

      // Le contenu (titre, description, CTA) est superposé à l'image, dans sa partie basse
      // (cf. .xs-focus-content bottom:0) : l'image occupe donc l'essentiel du cadre plutôt
      // qu'une vignette réduite avec du texte en dessous.
      const destH = Math.min(window.innerHeight * 0.8, 680, (window.innerWidth * 0.85) / 0.52);
      const destW = destH * 0.52;
      const destX = (window.innerWidth - destW) / 2;
      const destY = (window.innerHeight - destH) / 2;

      const otherItems = Array.from(document.querySelectorAll('.xs-gallery-item')).filter((el) => el !== clickedEl);
      gsap.to(otherItems, { opacity: 0, pointerEvents: 'none', duration: reduced ? 0 : 0.3 });
      gsap.to(veil, { opacity: 1, pointerEvents: 'auto', duration: reduced ? 0 : 0.3, ease: 'power2.out' });
      gsap.to(box, {
        x: destX, y: destY, width: destW, height: destH,
        duration: reduced ? 0 : 0.6, ease: 'power3.inOut',
        onComplete: () => {
          box.style.pointerEvents = 'auto';
          gsap.to(content, {
            opacity: 1, duration: reduced ? 0 : 0.35,
            onComplete: () => { xsFocusAnimating = false; },
          });
        },
      });
    }

    function xsGalleryCloseFocus() {
      if (xsFocusAnimating || xsFocusActive === null) return;
      xsFocusAnimating = true;

      const veil = document.getElementById('xs-focus-veil');
      const box = document.getElementById('xs-focus-box');
      const content = document.getElementById('xs-focus-content');
      const returnRect = xsFocusOriginEl.getBoundingClientRect();
      const reduced = xsFocusPrefersReducedMotion();

      const otherItems = Array.from(document.querySelectorAll('.xs-gallery-item')).filter((el) => el !== xsFocusOriginEl);
      box.style.pointerEvents = 'none';
      gsap.to(content, { opacity: 0, duration: reduced ? 0 : 0.2 });
      gsap.to(otherItems, { opacity: 1, pointerEvents: '', duration: reduced ? 0 : 0.3 });
      // Le voile ne s'estompe qu'UNE FOIS l'image revenue à son rect d'origine (onComplete du
      // tween de retour), jamais en même temps que le repli du cadre.
      gsap.to(box, {
        x: returnRect.left, y: returnRect.top, width: returnRect.width, height: returnRect.height,
        duration: reduced ? 0 : 0.5, ease: 'power3.inOut', delay: reduced ? 0 : 0.1,
        onComplete: () => {
          gsap.set(box, { opacity: 0 });
          gsap.to(veil, {
            opacity: 0, pointerEvents: 'none', duration: reduced ? 0 : 0.3,
            onComplete: () => {
              xsFocusFreezeScroll(false);
              xsFocusActive = null;
              xsFocusOriginEl = null;
              xsFocusAnimating = false;
            },
          });
        },
      });
    }

    // Ferme instantanément, sans animation : resize pendant le focus (rects plus valides) ou
    // changement de vue (navigate()).
    function xsGalleryForceCloseFocus() {
      if (xsFocusActive === null && !xsFocusAnimating) return;
      const veil = document.getElementById('xs-focus-veil');
      const box = document.getElementById('xs-focus-box');
      const content = document.getElementById('xs-focus-content');
      const items = document.querySelectorAll('.xs-gallery-item');
      [veil, box, content, ...items].forEach((el) => el && gsap.killTweensOf(el));
      if (veil) gsap.set(veil, { opacity: 0, pointerEvents: 'none' });
      if (box) gsap.set(box, { opacity: 0, pointerEvents: 'none' });
      if (content) gsap.set(content, { opacity: 0 });
      gsap.set(items, { opacity: 1, pointerEvents: '' });
      xsFocusFreezeScroll(false);
      xsFocusActive = null;
      xsFocusOriginEl = null;
      xsFocusAnimating = false;
    }

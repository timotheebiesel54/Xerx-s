// ─── galerie.js ───
// Bande horizontale de la galerie d'accueil et vue focus au clic, avec
// leur etat (xsGalleryGesture, xsFocusActive, xsFocusAnimating,
// xsFocusOriginEl).

    // ─── GALERIE D'ACCUEIL : bande horizontale en boucle infinie + vue focus au clic ───
    // Aucun ScrollTrigger, aucun scrub, aucun pin, aucune propriété liée au scroll de la PAGE :
    // la bande défile dans son propre conteneur overflow-x, la page continue de défiler
    // normalement par-dessus/en dessous. Alimentée par un tableau JS pour pouvoir passer de 5 à
    // N images sans toucher au HTML.

    let xsGalleryGesture = null;
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

    function xsGalleryInit() {
      const scroller = document.getElementById('xs-gallery-scroller');
      const track = document.getElementById('xs-gallery-track');
      if (!scroller || !track) return;

      // Boucle infinie : la liste est dupliquée deux fois dans le DOM (mêmes index logiques
      // 0..N-1 dans chaque copie), et on recale scrollLeft d'une largeur de copie dès qu'on la
      // dépasse — repositionnement instantané et invisible car les deux copies sont identiques.
      const onceHTML = XS_GALLERY_ITEMS.map(xsGalleryItemHTML).join('');
      track.innerHTML = onceHTML + onceHTML;

      const halfWidth = () => track.scrollWidth / 2;
      scroller.scrollLeft = halfWidth();

      scroller.addEventListener('scroll', () => {
        const half = halfWidth();
        if (scroller.scrollLeft > half) {
          scroller.scrollLeft -= half;
        } else if (scroller.scrollLeft <= 0) {
          scroller.scrollLeft += half;
        }
      });

      // Drag à la souris uniquement (le swipe tactile et le trackpad horizontal restent gérés
      // nativement par le navigateur — aucun listener 'wheel' n'est posé ici, la molette
      // verticale continue donc toujours de faire défiler la page, jamais la bande).
      // Pas de setPointerCapture : ça redirigerait le 'click' final vers le conteneur au lieu
      // de la figure sous le curseur, empêchant l'ouverture du focus sur un simple clic. On
      // suit donc le pointeur via des listeners posés sur window pendant la durée du drag.
      scroller.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        xsGalleryGesture = { startX: e.clientX, startScrollLeft: scroller.scrollLeft, moved: false, pointerId: e.pointerId };
        scroller.classList.add('is-dragging');
        window.addEventListener('pointermove', xsGalleryOnDragMove);
        window.addEventListener('pointerup', xsGalleryOnDragEnd);
        window.addEventListener('pointercancel', xsGalleryOnDragEnd);
      });
      function xsGalleryOnDragMove(e) {
        if (!xsGalleryGesture || e.pointerId !== xsGalleryGesture.pointerId) return;
        const dx = e.clientX - xsGalleryGesture.startX;
        if (Math.abs(dx) > 4) xsGalleryGesture.moved = true;
        scroller.scrollLeft = xsGalleryGesture.startScrollLeft - dx;
      }
      function xsGalleryOnDragEnd(e) {
        if (!xsGalleryGesture || e.pointerId !== xsGalleryGesture.pointerId) return;
        scroller.classList.remove('is-dragging');
        window.removeEventListener('pointermove', xsGalleryOnDragMove);
        window.removeEventListener('pointerup', xsGalleryOnDragEnd);
        window.removeEventListener('pointercancel', xsGalleryOnDragEnd);
      }
      // Un drag qui a effectivement bougé ne doit pas déclencher le clic (ouverture du focus)
      // sur la figure relâchée.
      scroller.addEventListener('click', (e) => {
        if (xsGalleryGesture && xsGalleryGesture.moved) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (xsGalleryGesture) xsGalleryGesture.moved = false;
      }, true);
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

    // Fige le scroll de la page ET de la bande pendant le focus, pour que le rect d'origine
    // (utilisé au retour) reste valide tant que l'overlay est ouvert.
    function xsFocusFreezeScroll(freeze) {
      document.body.style.overflow = freeze ? 'hidden' : '';
      const scroller = document.getElementById('xs-gallery-scroller');
      if (scroller) scroller.style.overflowX = freeze ? 'hidden' : '';
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

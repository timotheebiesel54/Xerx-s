// ─── main.js ───
// Point d'entree : variable app, routeur (navigate/render), menu mobile,
// initialisation Lenis/GSAP, ecouteurs globaux, et l'appel final qui lance
// le premier rendu. Doit rester le DERNIER script charge.

    const app = document.getElementById('app');
    let currentView = 'home';

    // ─── NAVIGATION ───
    function updateActiveNav(view) {
      document.querySelectorAll('.nav-groupe li[data-vue]').forEach(li => {
        li.classList.toggle('active', li.dataset.vue === view);
      });
    }

    function navigate(view) {
      if (view === currentView) return;
      app.classList.add('fade-out');
      setTimeout(() => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (xsMaster) { xsMaster.kill(); xsMaster = null; }
        xsCarouselTimelines.forEach(tl => tl.kill());
        xsCarouselTimelines = [];
        if (xsFocusActive !== null) xsGalleryForceCloseFocus();
        currentView = view;
        document.body.classList.toggle('view-home', view === 'home');
        updateActiveNav(view);
        render(view);
        app.classList.remove('fade-out');
        window.scrollTo(0, 0);
        document.getElementById('navbar').classList.remove('nav-bar--cachee');
        if (view !== 'home') document.getElementById('navbar').classList.remove('nav-bar--opaque');
        xsNavCachee = false;
        xsNavLastY = window.scrollY;
        xsNavScrollCheck();
      }, 350);
    }

    function render(view) {
      if (view === 'home') renderHome();
      else if (view === 'bagues') renderCollection('bagues');
      else if (view === 'bracelets') renderCollection('bracelets');
      else if (view.startsWith('fiche-')) renderFiche(view.replace('fiche-', ''));
      else if (view === 'contact') renderContact();
      else if (view === 'mentions') renderMentions();
      else if (view === 'cgv') renderCGV();
      else if (view === 'confidentialite') renderConfidentialite();
      else if (view === 'retour') renderRetour();
      else if (view === 'maison') renderMaison();
      else if (view === 'composition') renderComposition();
    }

    // ─── MENU MOBILE (burger) ───
    function toggleMobileMenu() {
      const overlay = document.getElementById('nav-mobile-overlay');
      if (!overlay) return;
      const isOpen = overlay.classList.toggle('open');
      if (isOpen) {
        lenis.stop();
        document.getElementById('navbar').classList.remove('nav-bar--cachee');
        xsNavCachee = false;
      } else {
        lenis.start();
      }
    }
    function closeMobileMenu() {
      const overlay = document.getElementById('nav-mobile-overlay');
      if (!overlay || !overlay.classList.contains('open')) return;
      overlay.classList.remove('open');
      lenis.start();
    }

    // ─── LENIS SMOOTH SCROLL ───
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.addEventListener('click', (e) => {
      if (e.target.id === 'xs-focus-veil') xsGalleryCloseFocus();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && xsFocusActive !== null) xsGalleryCloseFocus();
    });
    window.addEventListener('resize', () => {
      clearTimeout(xsResizeTimer);
      xsResizeTimer = setTimeout(() => {
        if (document.querySelector('.xs-stage')) xsUpdateLayout();
        if (document.querySelector('.xs-stage')) {
          ScrollTrigger.refresh();
        }
      }, 250);
    });

    // Resize pendant le focus : les rects (origine et destination) ne sont plus valides,
    // on ferme directement plutôt que de tenter de les recalculer.
    window.addEventListener('resize', () => {
      if (xsFocusActive !== null || xsFocusAnimating) xsGalleryForceCloseFocus();
    });

    // ─── NAVBAR : masquage au defilement ───
    // (l'opacite sur la section photo est pilotee par le ScrollTrigger unique de
    // xsInitNavOpacity, dans hero.js, via la classe .nav-bar--opaque)
    // nav-bar--cachee au defilement vers le bas, retiree vers le haut ou sous 80px de
    // defilement ; hysteresis de 8px sur le delta (n'avance la reference que lorsqu'elle
    // est franchie, pour ne pas rater un defilement lent fait de petits pas).
    let xsNavCachee = false;
    let xsNavLastY = window.scrollY;
    let xsNavTicking = false;

    function xsNavScrollCheck() {
      const navEl = document.getElementById('navbar');
      const y = window.scrollY;

      const delta = y - xsNavLastY;
      if (y < 80) {
        if (xsNavCachee) { navEl.classList.remove('nav-bar--cachee'); xsNavCachee = false; }
        xsNavLastY = y;
      } else if (delta > 8) {
        if (!xsNavCachee) { navEl.classList.add('nav-bar--cachee'); xsNavCachee = true; }
        xsNavLastY = y;
      } else if (delta < -8) {
        if (xsNavCachee) { navEl.classList.remove('nav-bar--cachee'); xsNavCachee = false; }
        xsNavLastY = y;
      }
    }

    function xsNavOnScroll() {
      if (xsNavTicking) return;
      xsNavTicking = true;
      requestAnimationFrame(() => { xsNavScrollCheck(); xsNavTicking = false; });
    }

    if (typeof lenis !== 'undefined' && lenis) {
      lenis.on('scroll', xsNavOnScroll);
    } else {
      window.addEventListener('scroll', xsNavOnScroll, { passive: true });
    }

    // ─── PASTILLE PANIER ───
    // Point d'entree pour Stripe : ecrit le nombre d'articles et bascule l'attribut hidden.
    function majPanier(n) {
      const pastille = document.querySelector('.nav-pastille');
      if (!pastille) return;
      pastille.textContent = n;
      pastille.hidden = n === 0;
    }

    updateActiveNav('home');
    render('home');
    xsNavScrollCheck();
    majPanier(0);

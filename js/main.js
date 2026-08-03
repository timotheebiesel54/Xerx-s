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
      if (isOpen) { lenis.stop(); } else { lenis.start(); }
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

    updateActiveNav('home');
    render('home');

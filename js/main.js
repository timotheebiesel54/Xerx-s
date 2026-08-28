// ─── main.js ───
// Point d'entree : variable app, routeur (navigate/render), menu mobile,
// initialisation Lenis/GSAP, ecouteurs globaux, et l'appel final qui lance
// le premier rendu. Doit rester le DERNIER script charge.

    const app = document.getElementById('app');
    let currentView = 'home';

    // Le retour navigateur sur /duo/{id} doit restaurer le defilement de l'accueil tel que
    // memorise par dgConsumeHomeScroll (voir navigate()), jamais une position que le
    // navigateur aurait tentee de deviner seul et qui entrerait en conflit avec la notre.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    // ─── NAVIGATION ───
    function updateActiveNav(view) {
      document.querySelectorAll('.nav-groupe li[data-vue]').forEach(li => {
        li.classList.toggle('active', li.dataset.vue === view);
      });
    }

    // La route /duo/{id} est la seule vue synchronisee avec l'URL : navigate() y pousse une
    // entree d'historique dediee, et la remet a '/' des qu'on la quitte ; aucune autre vue de
    // ce routeur n'a jamais eu d'URL propre, ce narrow scope n'y change rien.
    function xsDuoIdFromPath(pathname) {
      const m = pathname.match(/^\/duo\/([^\/]+)\/?$/);
      if (!m) return null;
      return XS_DUOS.some((d) => d.id === m[1]) ? m[1] : null;
    }

    function navigate(view, opts) {
      opts = opts || {};
      if (view === currentView) return;
      // Pousse l'entree d'historique avant tout changement visuel : Chrome fige le defilement
      // associe a l'entree qu'on quitte au moment ou l'URL change (pas plus tard), donc le
      // faire ici, avant que le rendu ne fasse defiler la page ailleurs, est ce qui permet au
      // retour navigateur de retrouver la bonne position sur l'accueil.
      if (!opts.skipHistory) {
        if (view.startsWith('duo-')) {
          history.pushState({ view }, '', '/duo/' + view.slice(4));
        } else if (location.pathname !== '/') {
          history.pushState({ view }, '', '/');
        }
      }
      app.classList.add('fade-out');
      setTimeout(() => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (xsMaster) { xsMaster.kill(); xsMaster = null; }
        xsCarouselTimelines.forEach(tl => tl.kill());
        xsCarouselTimelines = [];
        dgGridCleanup();
        currentView = view;
        document.body.classList.toggle('view-home', view === 'home');
        document.body.classList.toggle('view-bagues', view === 'bagues');
        document.body.classList.toggle('view-bracelets', view === 'bracelets');
        document.body.classList.toggle('view-composition', view === 'composition');
        document.body.classList.toggle('view-maison', view === 'maison');
        document.body.classList.toggle('view-contact', view === 'contact');
        document.body.classList.toggle('view-duo', view.startsWith('duo-'));
        updateActiveNav(view);
        render(view);
        app.classList.remove('fade-out');
        // window.scrollTo seul ne suffit pas : Lenis garde sa propre position cible et la
        // reimpose au prochain frame (voir js/vendor/lenis.min.js, setScroll). lenis.scrollTo
        // en immediate:true la met a jour en meme temps que le defilement natif ; resize()
        // d'abord force Lenis a remesurer la hauteur du nouveau contenu (son observateur de
        // redimensionnement est debounce, il mesurerait sinon encore l'ancienne page et
        // plafonnerait le defilement a son ancienne limite, trop courte).
        const targetY = (view === 'home' && typeof dgConsumeHomeScroll === 'function') ? dgConsumeHomeScroll() : null;
        const y = targetY != null ? targetY : 0;
        if (typeof lenis !== 'undefined' && lenis) {
          lenis.resize();
          lenis.scrollTo(y, { immediate: true });
          // Une image encore en cours de chargement au moment du resize() ci-dessus peut
          // allonger le document juste apres : un second resize+scrollTo au frame suivant,
          // une fois la mise en page stabilisee, corrige cet ecart residuel.
          requestAnimationFrame(() => {
            lenis.resize();
            lenis.scrollTo(y, { immediate: true });
          });
        } else {
          window.scrollTo(0, y);
        }
        document.getElementById('navbar').classList.remove('nav-bar--cachee');
        if (view !== 'home') document.getElementById('navbar').classList.remove('nav-bar--opaque');
        xsNavCachee = false;
        xsNavLastY = window.scrollY;
        xsNavScrollCheck();
        if (typeof opts.onRendered === 'function') opts.onRendered();
      }, 350);
    }

    function render(view) {
      if (view === 'home') renderHome();
      else if (view === 'bagues') renderCollection('bagues');
      else if (view === 'bracelets') renderCollection('bracelets');
      else if (view.startsWith('fiche-')) renderFiche(view.replace('fiche-', ''));
      else if (view.startsWith('duo-')) renderDuo(view.slice(4));
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

    window.addEventListener('resize', () => {
      clearTimeout(xsResizeTimer);
      xsResizeTimer = setTimeout(() => {
        if (document.querySelector('.xs-stage')) xsUpdateLayout();
        if (document.querySelector('.xs-stage')) {
          ScrollTrigger.refresh();
        }
      }, 250);
    });

    // /duo/{id} est la seule route synchronisee avec l'historique du navigateur (voir
    // navigate()) : un retour/avance du navigateur doit donc y correspondre. skipHistory evite
    // de repousser une entree d'historique deja geree par le navigateur lui meme.
    window.addEventListener('popstate', () => {
      const id = xsDuoIdFromPath(location.pathname);
      const target = id ? 'duo-' + id : 'home';
      if (target !== currentView) navigate(target, { skipHistory: true });
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
      const panel = document.getElementById('cart-panel');
      if (panel && panel.classList.contains('open')) renderCart();
    }

    // ─── PANIER : panneau lateral ───
    // Pas de page dediee : un tiroir ancre a droite (voir .cart-panel, index.html), ouvert/
    // ferme sur le meme modele que le menu mobile (toggleMobileMenu/closeMobileMenu plus haut).
    // dgPanier (js/duo.js) reste la seule source de verite des articles ; ce bloc ne fait que
    // les afficher et les retirer.
    function cartLigneHTML(i, img, nom, detail, prix) {
      return `
        <div class="cart-item">
          <div class="cart-item-img"><img src="${img}" alt="${nom}" onerror="this.onerror=null;this.src='${DG_PANEL_FALLBACK_IMG}';"></div>
          <div class="cart-item-info">
            <span class="cart-item-nom">${nom}</span>
            <span class="cart-item-detail">${detail}</span>
            <span class="cart-item-prix">${prix} CHF</span>
          </div>
          <button type="button" class="cart-item-remove" onclick="cartRemoveItem(${i})" aria-label="Retirer du panier">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
        </div>
      `;
    }

    function cartDetailPiece(cat, slot) {
      if (!cat) return '';
      const mat = (cat.matieres || []).find((m) => m.key === slot.matiere);
      const label = mat ? mat.label : '';
      return slot.mesure ? `${cat.nom} — ${label}, taille ${slot.mesure}` : `${cat.nom} — ${label}`;
    }

    function cartLigneDuo(item, i) {
      const duo = XS_DUOS.find((d) => d.id === item.duoId);
      const catG = CATALOGUE[item.gauche.modele];
      const catD = CATALOGUE[item.droite.modele];
      const nom = duo ? duo.label : [catG && catG.nom, catD && catD.nom].filter(Boolean).join(' & ');
      const img = duo ? duo.mainImg : dgProduitSrc(item.gauche.type, item.gauche.modele, item.gauche.matiere);
      const detail = [cartDetailPiece(catG, item.gauche), cartDetailPiece(catD, item.droite)].filter(Boolean).join('<br>');
      return cartLigneHTML(i, img, nom, detail, item.prix);
    }

    function cartPrixComposition(item) {
      return item.slots.reduce((somme, s) => somme + dgPrixPiece(s, s.matiere), 0);
    }

    function cartLigneComposition(item, i) {
      const detail = item.slots.map((s) => cartDetailPiece(CATALOGUE[s.modele], s)).filter(Boolean).join('<br>');
      const premier = item.slots[0];
      const img = premier ? dgProduitSrc(premier.type, premier.modele, premier.matiere) : DG_PANEL_FALLBACK_IMG;
      return cartLigneHTML(i, img, `Composition, ${item.slots.length} pièce${item.slots.length > 1 ? 's' : ''}`, detail, cartPrixComposition(item));
    }

    function cartItemPrix(item) {
      return item.type === 'composition' ? cartPrixComposition(item) : (item.prix || 0);
    }

    // highlightIndex : index d'un article a signaler juste apres son ajout (voir
    // cartNotifyAdded plus bas), pour que le tiroir qui s'ouvre montre sans ambiguite
    // ce qui vient d'entrer dans le panier plutot qu'un simple compteur discret.
    function renderCart(highlightIndex) {
      const body = document.getElementById('cart-panel-body');
      const totalEl = document.getElementById('cart-panel-total-value');
      const checkoutBtn = document.getElementById('cart-panel-checkout');
      if (!body || !totalEl) return;
      body.innerHTML = dgPanier.length === 0
        ? '<p class="cart-panel-empty">Votre panier est vide.</p>'
        : dgPanier.map((item, i) => item.type === 'composition' ? cartLigneComposition(item, i) : cartLigneDuo(item, i)).join('');
      totalEl.textContent = `${dgPanier.reduce((somme, item) => somme + cartItemPrix(item), 0)} CHF`;
      if (checkoutBtn) checkoutBtn.disabled = dgPanier.length === 0;
      if (typeof highlightIndex === 'number') {
        const rows = body.querySelectorAll('.cart-item');
        const row = rows[highlightIndex];
        if (row) {
          row.classList.add('cart-item--added');
          row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }

    function cartRemoveItem(i) {
      dgPanier.splice(i, 1);
      dgSavePanier();
      renderCart();
    }

    function openCart(highlightIndex) {
      renderCart(highlightIndex);
      document.getElementById('cart-overlay').classList.add('open');
      document.getElementById('cart-panel').classList.add('open');
      if (typeof lenis !== 'undefined' && lenis) lenis.stop();
    }

    function closeCart() {
      document.getElementById('cart-overlay').classList.remove('open');
      document.getElementById('cart-panel').classList.remove('open');
      if (typeof lenis !== 'undefined' && lenis) lenis.start();
    }

    // Retour visuel explicite apres un clic sur "Ajouter au panier", ou qu'il se trouve
    // (fiche duo, composition...) : ouvre le tiroir sur l'article qui vient d'etre ajoute,
    // au lieu du seul pulse discret de la pastille (voir dgPulseCompteur, js/duo.js).
    function cartNotifyAdded() {
      openCart(dgPanier.length - 1);
    }

    // Chargement direct de /duo/{id} (rechargement de page, lien partage) : la vue s'ouvre
    // telle quelle, sans animation ni entree d'historique supplementaire (l'URL est deja la
    // bonne). Toute autre adresse retombe sur l'accueil habituel.
    const bootDuoId = xsDuoIdFromPath(location.pathname);
    const bootView = bootDuoId ? 'duo-' + bootDuoId : 'home';
    currentView = bootView;
    document.body.classList.toggle('view-home', bootView === 'home');
    document.body.classList.toggle('view-duo', bootView.startsWith('duo-'));
    updateActiveNav(bootView);
    render(bootView);
    xsNavScrollCheck();
    majPanier(dgPanier.length);

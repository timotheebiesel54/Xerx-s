// ─── mobile.js ───
// Detection mobile partagee par tous les modules. Constante de breakpoint
// definie ici une seule fois ; toute autre partie du code doit appeler
// estMobile() plutot que de retester une largeur en dur.
// xsMobileMQL est le seul MediaQueryList de ce seuil dans tout le site :
// estMobile() le lit, et l'unique listener 'change' ci-dessous s'y abonne
// une fois pour toutes au chargement du script (jamais dans une fonction
// rappelee a chaque rendu), pour ne jamais s'accumuler au fil des rendus
// de la home. 'change' ne se declenche nativement que lorsque .matches
// change reellement de valeur, donc jamais sur un resize qui ne franchit
// pas le seuil.

    const XS_MOBILE_BREAKPOINT = 900;
    const xsMobileMQL = window.matchMedia(`(max-width: ${XS_MOBILE_BREAKPOINT}px)`);

    function estMobile() {
      return xsMobileMQL.matches;
    }

    xsMobileMQL.addEventListener('change', () => {
      if (typeof currentView !== 'undefined' && currentView === 'home') {
        render('home');
      }
    });

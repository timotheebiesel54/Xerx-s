// ─── mobile.js ───
// Detection mobile partagee par tous les modules. Constante de breakpoint
// definie ici une seule fois ; toute autre partie du code doit appeler
// estMobile() plutot que de retester une largeur en dur.

    const XS_MOBILE_BREAKPOINT = 900;

    function estMobile() {
      return window.matchMedia(`(max-width: ${XS_MOBILE_BREAKPOINT}px)`).matches;
    }

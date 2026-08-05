# PALETTE.md — Bascule sombre -> ivoire

Un seul commit sur `refactor-multifichier` : remplacement du bloc `:root`
et reclassement des 125 occurrences de `var(--...)` plus des couleurs
écrites en dur, selon la propriété CSS où chacune apparaît (TEXTE / SURFACE
/ TRAIT). `index.html` n'a pas été restructuré, seules les valeurs de
couleur ont changé.

## Nouveau `:root`

```css
:root {
  --fond: #fffdf8;
  --fond-2: #eae5da;
  --encre: #241c15;
  --encre-2: #6b5a48;
  --trait: #d9d2c4;
}
```

## 1. Tableau des substitutions (171)

125 usages de `var(--black|white|gold|gold-light|grey)` + 46 couleurs
écrites en dur (`#0a0a0a`, `#0e0e0e`, `rgba(10,10,10,...)`,
`rgba(201,169,110,...)`) repérées dans le fichier, converties une par une.
Les 8 occurrences des voiles/dégradés posés sur une photographie (point 2
ci-dessous) ne figurent pas dans ce tableau : elles sont inchangées.

| Ligne | Sélecteur / contexte | Propriété | Ancienne valeur | Nouvelle valeur | Rôle retenu |
|---|---|---|---|---|---|
| 43 | `body` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 44 | `body` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 103 | `.nav-links li` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 108 | `.nav-links li:hover` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 131 | `.nav-burger span` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 138 | `.nav-mobile-overlay` | `background` | `rgba(10, 10, 10, 0.97)` | `var(--fond)` | SURFACE |
| 160 | `.nav-mobile-links li` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 165 | `.nav-mobile-links li:hover` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 189 | `.top-line` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 240 | `.xs-txt` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 251 | `.xs-txt h1` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 261 | `.xs-txt h2` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 272 | `.xs-txt span` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 297 | `.xs-fill` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 309 | `.about-divider` | `background` | `rgba(201, 169, 110, 0.35)` | `var(--fond)` | SURFACE |
| 319 | `.about-body` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 329 | `.about-body--indent` | `border-left` | `rgba(201, 169, 110, 0.2)` | `var(--trait)` | TRAIT |
| 347 | `.collection-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 360 | `.collection-divider` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 389 | `.xs-scene-title` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 430 | `.xs-card-face` | `background-color` | `#0a0a0a` | `var(--fond)` | SURFACE |
| 431 | `.xs-card-face` | `background-image` | `#0a0a0a` | `var(--fond)` | SURFACE |
| 434 | `.xs-card-face` | `border` | `rgba(201,169,110,0.14)` | `var(--trait)` | TRAIT |
| 453 | `.xs-card-name` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 463 | `.xs-card-view` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 473 | `.liste-privee` | `border` | `rgba(201,169,110,0.15)` | `var(--trait)` | TRAIT |
| 481 | `.liste-privee::before` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 489 | `.liste-tag` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 501 | `.liste-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 515 | `.compteur-dot` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 526 | `.compteur-text` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 531 | `.compteur-number` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 544 | `.liste-input-wrap` | `border-bottom` | `rgba(201,169,110,0.3)` | `var(--trait)` | TRAIT |
| 549 | `.liste-input-wrap:focus-within` | `border-color` | `var(--gold)` | `var(--trait)` | TRAIT |
| 556 | `.liste-input` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 563 | `.liste-input::placeholder` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 567 | `.liste-btn` | `border` | `rgba(201,169,110,0.4)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 568 | `.liste-btn` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 580 | `.liste-btn:hover` | `background` | `rgba(201,169,110,0.08)` | `var(--fond)` | SURFACE |
| 581 | `.liste-btn:hover` | `border-color` | `var(--gold)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 590 | `.liste-success` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 619 | `.fiche-img-wrap` | `background` | `#0e0e0e` | `var(--fond)` | SURFACE |
| 651 | `.fiche-swatch-label` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 666 | `.fiche-swatch.selected` | `border-color` | `rgba(201,169,110,0.8)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 681 | `.fiche-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 691 | `.fiche-nom` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 699 | `.fiche-coloris-actif` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 708 | `.fiche-divider` | `background` | `rgba(201,169,110,0.35)` | `var(--fond)` | SURFACE |
| 719 | `.fiche-intention` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 729 | `.fiche-section-label` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 741 | `.fiche-materiaux li` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 744 | `.fiche-materiaux li` | `border-bottom` | `rgba(201,169,110,0.07)` | `var(--trait)` | TRAIT |
| 748 | `.fiche-materiaux li span` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 753 | `.fiche-edition` | `border` | `rgba(201,169,110,0.12)` | `var(--trait)` | TRAIT |
| 762 | `.fiche-edition::before` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 769 | `.fiche-edition-num` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 783 | `.fiche-taille` | `border` | `rgba(201,169,110,0.2)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 789 | `.fiche-taille` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 794 | `.fiche-taille:hover, .fiche-taille.selected` | `border-color` | `var(--gold)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 795 | `.fiche-taille:hover, .fiche-taille.selected` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 800 | `.fiche-taille-hint` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 813 | `.fiche-duo` | `border-top` | `rgba(201,169,110,0.1)` | `var(--trait)` | TRAIT |
| 819 | `.fiche-duo-line` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 824 | `.fiche-duo-text` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 829 | `.fiche-duo-text strong` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 838 | `.fiche-cta` | `border` | `rgba(201,169,110,0.35)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 839 | `.fiche-cta` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 850 | `.fiche-cta:hover` | `background` | `rgba(201,169,110,0.06)` | `var(--fond)` | SURFACE |
| 851 | `.fiche-cta:hover` | `border-color` | `var(--gold)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 882 | `.back-arrow-label` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 889 | `footer` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 891 | `footer` | `border-top` | `rgba(201,169,110,0.08)` | `var(--trait)` | TRAIT |
| 900 | `.footer-col-title` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 909 | `.footer-col a, .footer-col span` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 918 | `.footer-col a:hover, .footer-col span:hover` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 923 | `.footer-bottom` | `border-top` | `rgba(201,169,110,0.06)` | `var(--trait)` | TRAIT |
| 932 | `.footer-copy` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 952 | `.contact-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 962 | `.contact-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 968 | `.contact-subtitle` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 983 | `.contact-input` | `border-bottom` | `rgba(201,169,110,0.2)` | `var(--trait)` | TRAIT |
| 989 | `.contact-input` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 994 | `.contact-input::placeholder` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 995 | `.contact-input:focus` | `border-bottom-color` | `rgba(201,169,110,0.6)` | `var(--trait)` | TRAIT |
| 1003 | `.contact-btn` | `border` | `rgba(201,169,110,0.3)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 1004 | `.contact-btn` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1016 | `.contact-btn:hover` | `background` | `rgba(201,169,110,0.06)` | `var(--fond)` | SURFACE |
| 1017 | `.contact-btn:hover` | `border-color` | `var(--gold)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 1022 | `.contact-email-alt` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1026 | `.contact-email-alt a` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1045 | `.mentions-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1055 | `.mentions-section-title` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1064 | `.mentions-body` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1080 | `.maison-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1090 | `.maison-hero-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1096 | `.maison-divider` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 1111 | `.maison-chapter-title` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1120 | `.maison-chapter-body` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1131 | `.maison-closing-text` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1139 | `.maison-closing-link` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1158 | `.compo-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1168 | `.compo-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1177 | `.compo-intro` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1211 | `.compo-slot.is-filled .compo-slot-socle` | `background` | `rgba(201,169,110,0.03)` | `var(--fond)` | SURFACE |
| 1222 | `.compo-slot-index` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1231 | `.compo-slot-name` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1245 | `.compo-slot-icon` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1254 | `.compo-slot-modele` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1261 | `.compo-slot-matiere` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1273 | `.compo-expand-link` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1278 | `.compo-expand-link:hover` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1298 | `.compo-recap-divider` | `background` | `var(--gold)` | `var(--fond-2)` | SURFACE |
| 1306 | `.compo-recap-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1316 | `.compo-recap-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1329 | `.compo-recap-list li` | `border-bottom` | `rgba(201,169,110,0.08)` | `var(--trait)` | TRAIT |
| 1332 | `.compo-recap-list li` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1338 | `.compo-recap-num` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1346 | `.compo-recap-narrative` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1353 | `.compo-recap-cta` | `border` | `rgba(201,169,110,0.35)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 1354 | `.compo-recap-cta` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1365 | `.compo-recap-cta:hover` | `background` | `rgba(201,169,110,0.06)` | `var(--fond)` | SURFACE |
| 1366 | `.compo-recap-cta:hover` | `border-color` | `var(--gold)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 1374 | `.compo-veil` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 1389 | `.compo-panel` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 1390 | `.compo-panel` | `border` | `rgba(201,169,110,0.2)` | `var(--trait)` | TRAIT |
| 1407 | `.compo-panel-close` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1419 | `.compo-panel-eyebrow` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1436 | `.compo-panel-step` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1439 | `.compo-panel-step.is-active` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1445 | `.compo-panel-step:not(:last-child)::after` | `background` | `rgba(201,169,110,0.25)` | `var(--fond)` | SURFACE |
| 1454 | `.compo-panel-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1466 | `.compo-card` | `border` | `rgba(201,169,110,0.18)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 1477 | `.compo-card:hover, .compo-card:active` | `border-color` | `var(--gold)` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 1478 | `.compo-card:hover, .compo-card:active` | `background` | `rgba(201,169,110,0.06)` | `var(--fond)` | SURFACE |
| 1480 | `.compo-card-icon` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1486 | `.compo-card-label` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1493 | `.compo-card-modele` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1509 | `.compo-panel-back` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1546 | `.newsletter-label` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1556 | `.newsletter-title` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1562 | `.newsletter-sub` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1570 | `.newsletter-form` | `border-bottom` | `rgba(201,169,110,0.25)` | `var(--trait)` | TRAIT |
| 1582 | `.newsletter-input` | `color` | `var(--white)` | `var(--encre)` | TEXTE |
| 1585 | `.newsletter-input::placeholder` | `color` | `var(--grey)` | `var(--encre-2)` | TEXTE |
| 1589 | `.newsletter-submit` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1603 | `.newsletter-success` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1642 | `.xs-suggestion-heading` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 1652 | `.xs-suggestion-title` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1664 | `.xs-suggestion-quote` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1678 | `.xs-cats-section` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 1716 | `.xs-cat-label` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1735 | `.xs-gallery-item figcaption` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 1747 | `.xs-focus-veil` | `background` | `var(--black)` | `var(--fond)` | SURFACE |
| 1757 | `.xs-focus-label` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1758 | `.xs-focus-desc` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 1784 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2129 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2152 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2186 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2224 | `<a> lien vers Politique de retour (page CGV)` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 2239 | `<a> lien vers Politique de confidentialité (page CGV)` | `color` | `var(--gold)` | `var(--encre)` | TEXTE |
| 2273 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2345 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2402 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2479 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 2728 | `handleContact() message de confirmation` | `color` | `var(--gold-light)` | `var(--encre-2)` | TEXTE |
| 2821 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 3501 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 3647 | `renderFiche() buildSVG ring-beveled accent ellipse` | `stroke` | `rgba(201,169,110,0.25)` | `var(--trait)` | TRAIT |
| 3671 | `icône flèche retour / bouton fermer (SVG stroke)` | `stroke` | `#e8d5b0` | `var(--encre)` | TRAIT (exception bouton/cliquable) |
| 3739 | `renderFiche() prix` | `color` | `var(--white)` | `var(--encre)` | TEXTE |

## 2. Cas laissés de côté (voiles/dégradés posés sur une photographie)

Conformément au point 4 de la consigne, ces zones ne sont **pas converties** :
elles restent en `rgba(10,10,10,...)` sur fond sombre, car il s'agit de
dégradés de lisibilité posés directement sur une photographie, pas de
surfaces de page.

| Sélecteur / contexte | Ligne | Rôle exact |
|---|---|---|
| `.xs-layers::after` | 231–232 | Vignette radiale + dégradé linéaire assombrissant les 3 photos du hero (`XS_HERO_IMG_1/2/3`), pour que les textes `.xs-txt` restent lisibles par-dessus. Non nommé explicitement dans la consigne mais structurellement identique aux 3 cas ci-dessous — traité comme un cas similaire et laissé inchangé. |
| `.fiche-img-wrap::after` | 630 | Dégradé radial assombrissant le pourtour du visuel produit (bague/bracelet/photo Aphrodite) sur la fiche produit. Nommé explicitement au point 4. |
| `.newsletter-section` | 1538 | Fond translucide sombre de la section newsletter (accès privé), pensé comme un bandeau "nuit" distinct du reste de la page. Nommé explicitement au point 4. |
| `.xs-focus-content` | 1756 | Dégradé vertical assombrissant le bas de la vue focus de la galerie, sous le titre/description/CTA superposés à la photo cliquée. Nommé explicitement au point 4. |
| `compoSlotHTML()` — dégradé inline du portrait d'emplacement | 2517 | `background-image: linear-gradient(180deg, rgba(10,10,10,.2/.55/.85), url(portrait))`, assombrit le portrait (Méduse/Athéna) affiché dans un emplacement rempli du configurateur Éditions, pour la lisibilité du nom/matière superposés. Même rôle que les cas ci-dessus mais écrit en JS plutôt que dans le bloc `<style>` — ajouté à cette liste par analogie, la consigne ne le nommait pas explicitement. |

## 3. Alertes de contrast (point 5)

### 3.1 Paires texte/fond issues de la conversion normale — toutes conformes

| Paire | Contraste | Seuil 4.5:1 |
|---|---|---|
| `--encre` (#241c15) sur `--fond` (#f4f1ea) | **14.87:1** | OK (largement AAA) |
| `--encre` (#241c15) sur `--fond-2` (#eae5da) | **13.35:1** | OK (largement AAA) |
| `--encre-2` (#6b5a48) sur `--fond` (#f4f1ea) | **5.85:1** | OK (AA, pas AAA à 7:1) |
| `--encre-2` (#6b5a48) sur `--fond-2` (#eae5da) | **5.26:1** | OK (AA, pas AAA à 7:1) |

Tous les textes qui se retrouvent sur une surface elle-même convertie
(`--fond` ou `--fond-2`) passent le seuil de 4.5:1. C'est le cas de
l'immense majorité du site après bascule.

### 3.2 Échecs directement causés par les cas laissés de côté (point 2)

Ces alertes existent **parce que** le texte a été converti vers la nouvelle
encre sombre alors que son fond, lui, reste sombre (laissé inchangé au
point 2). Le résultat est une encre sombre sur un fond sombre.

- **`.xs-focus-label` / `.xs-focus-desc`** (`var(--gold-light)` -> `var(--encre-2)`,
  lignes 1757–1758) affichés dans `.xs-focus-content`, dont le fond reste
  `rgba(10,10,10,.4)` à `rgba(10,10,10,.82)` (non converti, cf. 2). Estimation :
  `--encre-2` sur un fond proche du noir pur donne un contraste **≈ 1.9 à 3.0:1**
  selon la photo sous-jacente — **échec net du seuil de 4.5:1**, quel que soit
  le cas. Texte illisible.
- **`.newsletter-label/.newsletter-title/.newsletter-sub/.newsletter-input/
  .newsletter-submit/.newsletter-success`** (convertis vers `--encre`/`--encre-2`,
  lignes 1546–1603) affichés dans `.newsletter-section`, dont le fond reste
  `rgba(10,10,10,0.55)` (non converti). En composant ce fond avec le nouveau
  fond de page `--fond` derrière lui, on obtient un gris chaud `rgb(115,114,111)`
  environ. Contraste obtenu : `--encre` **≈ 3.49:1** (échec), `--encre-2`
  **≈ 1.37:1** (échec sévère). Toute la section newsletter devient illisible.
- **`.xs-txt` / `.xs-txt h1` / `.xs-txt h2` / `.xs-txt span`** (convertis vers
  `--encre`/`--encre-2`, lignes 240–272) affichés par-dessus `.xs-layers::after`,
  dont le voile reste sombre (non converti par analogie, cf. 2) sur des photos
  déjà assombries par `filter: brightness(0.5)`. Non chiffrable précisément
  (dépend de la photo), mais structurellement identique aux deux cas
  ci-dessus : **échec attendu du seuil de 4.5:1**.

**Conclusion pour ces 3 zones** : convertir le texte sans convertir son fond
casse la lisibilité. Il faudra soit garder une variante de texte claire
propre à ces trois zones (une 6ᵉ variable, p. ex. `--encre-sur-photo`, plus
proche de l'ancien `--gold-light`), soit convertir aussi ces fonds — les
deux options sortent du périmètre strict de cette tâche et sont donc
signalées ici plutôt que tranchées.

### 3.3 Cas non calculables de façon fiable (texte posé sur une photo réelle)

- **`.xs-card-name` / `.xs-card-view`** (lignes 453/463, convertis vers
  `--encre-2`/`--encre`) : centrés sur `.xs-card-face`, en superposition
  directe de la photo produit (`--img`) quand elle est définie, avec une
  opacité de 0.55 et 0.3 respectivement. Le contraste réel dépend des
  pixels de la photo sous le texte et de cette opacité (qui dilue encore
  l'encre vers la couleur du fond) : impossible à chiffrer de façon fiable
  sans geler une image précise. Signalé plutôt que calculé.
- **`.xs-cat-label`, `.xs-gallery-item figcaption`** : à l'inverse, ces
  libellés sont **sous** l'image (bloc séparé, `margin-top`/`padding-top`),
  pas superposés — ils retombent sur `--fond` (page), donc bien dans le
  tableau 3.1 (OK).

### 3.4 Observation hors périmètre strict (non-texte, mais bon à signaler)

Le point 5 ne porte que sur les paires texte/fond, mais la conversion
SURFACE de `--gold` vers `--fond-2` produit aussi des éléments non-textuels
quasi invisibles une fois posés sur `--fond` (contraste **≈ 1.11:1** entre
`--fond` et `--fond-2`) : `.nav-burger span` (barres du menu burger),
`.xs-fill` (remplissage de la barre de progression du hero),
`.collection-divider`, `.maison-divider`, `.compo-recap-divider`,
`.fiche-divider`, `.fiche-duo-line`, `.fiche-edition::before`,
`.liste-privee::before`, `.compteur-dot`. Ce n'est pas un échec de contraste
texte/fond au sens du point 5, mais ces accents décoratifs/fonctionnels
(dont un élément d'interface, le burger) deviennent pratiquement invisibles
sur fond ivoire. Signalé sans correction, la tâche portant sur le texte.

### 3.5 Autre effet de bord signalé sans correction

`.xs-card-face` (ligne 431) : le dégradé `linear-gradient(155deg, #17140f 0%,
#0a0a0a 65%, #12100b 100%)` n'a que son arrêt central (`#0a0a0a`) converti
en `var(--fond)`, car `#17140f` et `#12100b` ne figurent pas dans la liste
des couleurs à traiter (point 3). Résultat : un dégradé sombre → ivoire →
sombre sur les cartes produit sans photo (`--img: none`), visible sur les
cartes statiques de démonstration de `renderCollection()`. Signalé plutôt
que corrigé, ces deux teintes étant hors du périmètre défini par la tâche.

### 3.6 Remarque annexe

`.about-divider`, `.about-body`, `.about-body--indent`, `.liste-privee` et
les classes `.liste-*`/`.compteur-*` (lignes 306–590) ne sont référencées
par aucun template JS actuel (recherche `class="liste-privee`,
`class="about-body`, etc. sans résultat) : CSS orpheline d'une itération
précédente. Convertie normalement comme le reste, par cohérence avec la
consigne qui porte sur les 125 occurrences du fichier, sans distinction
d'usage.


---

# Pass 2 — Réintroduction du bronze (`--accent` / `--accent-clair` / `--encre-inverse`)

Le choix « sans accent » de la première passe est abandonné. `:root` gagne
trois tokens :

```css
--accent: #8a6e45;
--accent-clair: #c9a96e;
--encre-inverse: #f4f1ea;
```

Seules les 117 lignes dont l'ancienne valeur (avant la toute première passe)
était `--gold`, `--gold-light`, `#e8d5b0`, `#f1e5ca` ou
`rgba(201,169,110,...)` sont reprises ici. Les lignes issues de `--black`,
`--white` et `--grey` (déjà `--fond`/`--fond-2`/`--encre`/`--encre-2`)
restent telles quelles, sauf le cas particulier `.xs-card-face` (point 5,
détaillé plus bas) qui touche aussi une valeur noire d'origine.

## 1. Tableau des réaffectations (117 lignes)

Règle appliquée : bordure/outline/stroke d'élément cliquable et
filet/séparateur/ornement décoratif → `--accent` ; surtitre/petites
capitales espacées/numéro d'édition/compteur/libellé court en capitales →
`--accent` ; état de survol → `--accent` ; icône (flèches, bouton fermer)
→ `--accent` ; fond/aplat/dégradé → `--fond-2` (inchangé) ; texte courant
et paragraphe → `--encre` (inchangé). Le libellé des boutons reste
`--encre`, seule leur bordure passe à `--accent`. Tout texte qui aurait dû
passer en `--accent` mais descend sous ~18px reste (ou revient) en
`--encre`, avec la mention "échec contraste" ci-dessous.

| Ligne (fichier actuel) | Sélecteur | Propriété | Avant cette passe | Après | Traitement retenu | Remarque |
|---|---|---|---|---|---|---|
| 106 | `.nav-links li` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 10px, echec contraste |
| 111 | `.nav-links li:hover` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 10px, echec contraste |
| 134 | `.nav-burger span` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 163 | `.nav-mobile-links li` | `color` | `var(--encre)` | `var(--accent)` | --accent | 24px capitales espacees |
| 168 | `.nav-mobile-links li:hover` | `color` | `var(--encre-2)` | `var(--accent)` | --accent | 24px, etat de survol |
| 192 | `.top-line` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 264 | `.xs-txt h2` | `color` | `var(--encre-2)` | `var(--encre-inverse)` | îlot sombre — --encre-inverse | ilot xs-layers::after |
| 300 | `.xs-fill` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 312 | `.about-divider` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 332 | `.about-body--indent` | `border-left` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 350 | `.collection-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 363 | `.collection-divider` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 392 | `.xs-scene-title` | `color` | `var(--encre-2)` | `var(--accent)` | --accent | 32-56px capitales espacees, cliquable |
| 437 | `.xs-card-face` | `border` | `var(--trait)` | `var(--accent-clair)` | îlot sombre — bordure, --accent-clair | ilot (point 5) |
| 456 | `.xs-card-name` | `color` | `var(--encre-2)` | `var(--encre-inverse)` | îlot sombre — --encre-inverse | ilot .xs-card-face (point 5) |
| 476 | `.liste-privee` | `border` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 484 | `.liste-privee::before` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 492 | `.liste-tag` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7px, echec contraste |
| 518 | `.compteur-dot` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 529 | `.compteur-text` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 10px, echec contraste |
| 534 | `.compteur-number` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 15px, echec contraste |
| 547 | `.liste-input-wrap` | `border-bottom` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 552 | `.liste-input-wrap:focus-within` | `border-color` | `var(--trait)` | `var(--accent)` | --accent | etat focus |
| 570 | `.liste-btn` | `border` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton |
| 571 | `.liste-btn` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — libellé de bouton, reste --encre | libelle bouton |
| 583 | `.liste-btn:hover` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 584 | `.liste-btn:hover` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton survol |
| 593 | `.liste-success` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 14px, echec contraste |
| 654 | `.fiche-swatch-label` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 669 | `.fiche-swatch.selected` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure cliquable |
| 684 | `.fiche-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7.5px, echec contraste |
| 702 | `.fiche-coloris-actif` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 9px, echec contraste |
| 711 | `.fiche-divider` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 732 | `.fiche-section-label` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7px, echec contraste |
| 747 | `.fiche-materiaux li` | `border-bottom` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 751 | `.fiche-materiaux li span` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 11px, echec contraste |
| 756 | `.fiche-edition` | `border` | `var(--trait)` | `var(--accent)` | --accent | filet/ornement |
| 765 | `.fiche-edition::before` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 772 | `.fiche-edition-num` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 13px, echec contraste |
| 786 | `.fiche-taille` | `border` | `var(--encre)` | `var(--accent)` | --accent | bordure cliquable |
| 797 | `.fiche-taille:hover, .fiche-taille.selected` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure cliquable survol |
| 798 | `.fiche-taille:hover, .fiche-taille.selected` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 9px, echec contraste |
| 816 | `.fiche-duo` | `border-top` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 822 | `.fiche-duo-line` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 832 | `.fiche-duo-text strong` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8.5px, echec contraste |
| 841 | `.fiche-cta` | `border` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton |
| 842 | `.fiche-cta` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — libellé de bouton, reste --encre | libelle bouton |
| 853 | `.fiche-cta:hover` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 854 | `.fiche-cta:hover` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton survol |
| 885 | `.back-arrow-label` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7px, echec contraste |
| 894 | `footer` | `border-top` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 903 | `.footer-col-title` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7px, echec contraste |
| 921 | `.footer-col a:hover, .footer-col span:hover` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 9px, echec contraste |
| 926 | `.footer-bottom` | `border-top` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 955 | `.contact-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7.5px, echec contraste |
| 986 | `.contact-input` | `border-bottom` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 998 | `.contact-input:focus` | `border-bottom-color` | `var(--trait)` | `var(--accent)` | --accent | etat focus |
| 1006 | `.contact-btn` | `border` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton |
| 1007 | `.contact-btn` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — libellé de bouton, reste --encre | libelle bouton |
| 1019 | `.contact-btn:hover` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 1020 | `.contact-btn:hover` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton survol |
| 1029 | `.contact-email-alt a` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 1058 | `.mentions-section-title` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 1083 | `.maison-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7.5px, echec contraste |
| 1099 | `.maison-divider` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 1114 | `.maison-chapter-title` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — titre de chapitre, hors catégories accent | titre de chapitre, pas un libelle court |
| 1123 | `.maison-chapter-body` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — paragraphe/phrase longue | texte courant / paragraphe |
| 1142 | `.maison-closing-link` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 1161 | `.compo-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7.5px, echec contraste |
| 1180 | `.compo-intro` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — paragraphe/phrase longue | texte courant / paragraphe |
| 1214 | `.compo-slot.is-filled .compo-slot-socle` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 1248 | `.compo-slot-icon` | `color` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 1264 | `.compo-slot-matiere` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 1281 | `.compo-expand-link:hover` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 8px, echec contraste |
| 1301 | `.compo-recap-divider` | `background` | `var(--fond-2)` | `var(--fond-2)` | SURFACE — --fond-2 (déjà correct) | surface, inchange |
| 1309 | `.compo-recap-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7.5px, echec contraste |
| 1332 | `.compo-recap-list li` | `border-bottom` | `var(--trait)` | `var(--accent)` | --accent | filet |
| 1335 | `.compo-recap-list li` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 11px, echec contraste |
| 1356 | `.compo-recap-cta` | `border` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton/CTA |
| 1357 | `.compo-recap-cta` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — libellé de bouton, reste --encre | libelle bouton/CTA |
| 1368 | `.compo-recap-cta:hover` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 1369 | `.compo-recap-cta:hover` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure bouton survol |
| 1393 | `.compo-panel` | `border` | `var(--trait)` | `var(--accent)` | --accent | filet cadre |
| 1410 | `.compo-panel-close` | `color` | `var(--encre-2)` | `var(--accent)` | --accent | icone bouton fermer |
| 1422 | `.compo-panel-eyebrow` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7.5px, echec contraste |
| 1442 | `.compo-panel-step.is-active` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 7px, echec contraste |
| 1448 | `.compo-panel-step:not(:last-child)::after` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 1469 | `.compo-card` | `border` | `var(--encre)` | `var(--accent)` | --accent | bordure cliquable |
| 1480 | `.compo-card:hover, .compo-card:active` | `border-color` | `var(--encre)` | `var(--accent)` | --accent | bordure cliquable survol |
| 1481 | `.compo-card:hover, .compo-card:active` | `background` | `var(--fond)` | `var(--fond-2)` | SURFACE — --fond-2 (correction d’un bug de la passe 1, était --fond) | correction bug passe 1 |
| 1483 | `.compo-card-icon` | `color` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 1489 | `.compo-card-label` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 9px, echec contraste |
| 1549 | `.newsletter-label` | `color` | `var(--encre)` | `var(--encre-inverse)` | îlot sombre — --encre-inverse | ilot .newsletter-section |
| 1573 | `.newsletter-form` | `border-bottom` | `var(--trait)` | `var(--accent-clair)` | îlot sombre — bordure, --accent-clair | ilot .newsletter-section |
| 1592 | `.newsletter-submit` | `color` | `var(--encre)` | `var(--encre-inverse)` | îlot sombre — libellé de bouton, --encre-inverse (prime sur "libellé bouton = encre") | libelle bouton dans ilot |
| 1606 | `.newsletter-success` | `color` | `var(--encre-2)` | `var(--encre-inverse)` | îlot sombre — --encre-inverse | ilot .newsletter-section |
| 1655 | `.xs-suggestion-title` | `color` | `var(--encre-2)` | `var(--accent)` | --accent | 36-56px capitales espacees |
| 1667 | `.xs-suggestion-quote` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — paragraphe/phrase longue | texte courant / phrase longue |
| 1719 | `.xs-cat-label` | `color` | `var(--encre-2)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | clamp min 15px, echec contraste |
| 1738 | `.xs-gallery-item figcaption` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 14px, echec contraste |
| 1760 | `.xs-focus-label` | `color` | `var(--encre-2)` | `var(--encre-inverse)` | îlot sombre — --encre-inverse | ilot .xs-focus-content |
| 1761 | `.xs-focus-desc` | `color` | `var(--encre-2)` | `var(--encre-inverse)` | îlot sombre — --encre-inverse | ilot .xs-focus-content |
| 1787 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2132 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2155 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2189 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2227 | `<a> lien retour (CGV)` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 10px herite, echec contraste |
| 2242 | `<a> lien confidentialite (CGV)` | `color` | `var(--encre)` | `var(--encre)` | TEXTE — échec contraste, conservé/ramené à --encre | 10px herite, echec contraste |
| 2276 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2348 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2405 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2482 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 2731 | `handleContact() message` | `color` | `var(--encre-2)` | `var(--accent)` | --accent | 18px, message court |
| 2824 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 3504 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |
| 3650 | `renderFiche() ring-beveled accent` | `stroke` | `var(--trait)` | `var(--accent)` | --accent | ornement decoratif |
| 3674 | `icone fleche/fermer` | `stroke` | `var(--encre)` | `var(--accent)` | --accent | icone |

### Corrections de la passe 1

9 lignes SURFACE dont l'ancienne valeur était `rgba(201,169,110,...)`
avaient été mappées à `--fond` au lieu de `--fond-2` lors de la première
passe (bug de règle non affichant pas la distinction de famille pour les
couleurs écrites en dur) : `.about-divider`, `.liste-btn:hover`,
`.fiche-divider`, `.fiche-cta:hover`, `.contact-btn:hover`,
`.compo-slot.is-filled .compo-slot-socle`, `.compo-recap-cta:hover`,
`.compo-panel-step:not(:last-child)::after`, `.compo-card:hover,
.compo-card:active`. Corrigées à `--fond-2` dans cette passe (marquées
« FOND2-FIX » dans le tableau).

## 2. `.xs-card-face` (point 5)

`.xs-card-face` sert de support à une photographie produit : son
`background-image` empile `var(--img, none)` (la photo, quand elle est
définie) par-dessus un dégradé de secours
`linear-gradient(155deg, #17140f 0%, ... 65%, #12100b 100%)`. Ce dégradé
est visible en clair sur les cartes de démonstration sans photo
(`--img: none`, cartes statiques de `renderCollection()`) et reste la
base sous la photo dans les autres cas. **Cas retenu : îlot sombre**, au
sens du point 4 — ce n'est pas un simple aplat de page, c'est le support
visuel d'une photographie de produit.

En conséquence :
- `background-color` et l'arrêt central du dégradé, convertis par erreur
  en `var(--fond)` lors de la première passe, sont **revenus à leur
  valeur d'origine `#0a0a0a`** (fond conservé, comme les 4 autres îlots).
  Les arrêts `#17140f` et `#12100b` restent inchangés (hors du périmètre
  des couleurs à traiter, comme déjà noté en passe 1) : le dégradé est de
  nouveau uniformément sombre.
- La bordure de la carte (ligne 437, `rgba(201,169,110,0.14)` → `var(--trait)`
  en passe 1) passe à **`var(--accent-clair)`**, qui tient bien sur fond
  sombre.
- `.xs-card-name` (`--gold-light`, dans le périmètre de cette passe) passe
  à **`var(--encre-inverse)`**.
- `.xs-card-view` (`--white` à l'origine, donc hors périmètre strict de
  cette passe) est néanmoins également passé à **`var(--encre-inverse)`** :
  laisser `var(--encre)` (encre sombre) sur un fond resté sombre aurait
  reproduit exactement le défaut de lisibilité identifié en passe 1 sur
  `.xs-txt`. Traité comme conséquence directe et nécessaire du point 5,
  qui demande de traiter tout l'ensemble « au sens du point 4 ».

## 3. Contrastes recalculés

### 3.1 `--accent` sur `--fond` — texte passé en accent

| Paire | Contraste |
|---|---|
| `--accent` (#8a6e45) sur `--fond` (#f4f1ea) | **4.23:1** (conforme à l'estimation ~4.25:1 de la consigne) |
| `--accent` (#8a6e45) sur `--fond-2` (#eae5da) | **3.80:1** — plus bas ; aucun des textes passés en `--accent` dans cette passe ne se trouve en pratique sur `--fond-2` (tous les surtitres/labels concernés sont posés sur `--fond`), donc sans impact réel, mais à surveiller si `--accent` est réutilisé ailleurs sur `--fond-2`. |

Tous les textes routés vers `--accent` dans le tableau ci-dessus ont une
taille ≥ 18px (`.nav-mobile-links li` 24px, `.xs-scene-title` 32–56px,
`.xs-suggestion-title` 36–56px, message de confirmation de contact 18px
pile) et obtiennent donc un contraste de 4.23:1, jugé acceptable par la
consigne au-dessus de 18px. **Cas limite signalé** : le message de
`handleContact()` fait exactement 18px, pile sur le seuil — accepté ici,
mais à confirmer si le seuil doit être strictement "supérieur à" 18px.

### 3.2 Texte resté (ou ramené) en `--encre` faute de taille suffisante

24 lignes étaient déjà en `--encre` (venant de `--gold`, catégorie
"surtitre/libellé" mais trop petites) et le restent sans changement de
valeur ; 16 lignes supplémentaires, qui étaient en `--encre-2` (venant de
`--gold-light`), sont ramenées à `--encre` par cette passe puisqu'un
passage en `--accent` aurait échoué au contraste. Toutes ces occurrences
sont en 7 à 15px, largement sous le seuil de 18px : `.nav-links li` (10px),
`.collection-eyebrow` (8px), `.liste-tag` (7px), `.compteur-text` (10px),
`.compteur-number` (15px), `.fiche-swatch-label` (8px),
`.fiche-eyebrow`/`.contact-eyebrow`/`.maison-eyebrow`/`.compo-eyebrow`/
`.compo-recap-eyebrow`/`.compo-panel-eyebrow` (7.5px), `.fiche-coloris-actif`
(9px), `.fiche-section-label`/`.back-arrow-label`/`.footer-col-title`
(7px), `.fiche-materiaux li span` (11px), `.fiche-edition-num` (13px,
malgré son rôle de "numéro d'édition"), `.fiche-taille` en survol/sélection
(9px), `.fiche-duo-text strong` (8.5px), `.footer-col a:hover`/`span:hover`
(9px), `.contact-email-alt a` (8px, hérité de `.mentions-body`),
`.maison-closing-link` (8px), `.compo-slot-matiere`/`.compo-expand-link:hover`
(8px), `.compo-recap-list li` (11px), `.compo-panel-step.is-active` (7px),
`.compo-card-label` (9px), `.xs-cat-label` (borne basse du `clamp()` à
15px, donc jamais garanti ≥ 18px), `.xs-gallery-item figcaption` (14px),
les deux liens inline des pages CGV/confidentialité (10px, hérité de
`.mentions-body`). Le contraste `--encre` sur `--fond`/`--fond-2` reste
excellent (13–15:1) dans tous ces cas.

`.maison-chapter-title` reste également en `--encre`, mais pour une raison
différente : c'est un titre de chapitre en romain italique, pas un
surtitre ni un libellé court en capitales — il ne correspond à aucune des
catégories qui basculent vers `--accent`.

### 3.3 Les 5 îlots sombres — contraste recalculé pour `--encre-inverse`

| Îlot | Contraste `--encre-inverse` | Avant cette passe (`--encre-2`) |
|---|---|---|
| `.xs-card-face` (fond `#0a0a0a` exact) | **17.55:1** | contraste non calculé (photo), risque signalé |
| `.xs-focus-content` (fond estimé, borne haute) | **≈ 11.1:1** (borne basse ≈ 3:1 sur fond quasi noir pur) | ≈ 1.9 à 3.0:1 — échec |
| `.newsletter-section` (fond mêlé ≈ rgb(115,114,111)) | **≈ 4.26:1** — tout juste sous 4.5:1, mais très largement amélioré | ≈ 1.37 à 3.49:1 — échec net |
| `.xs-layers::after` (vignette sur photo hero) | non chiffrable précisément (dépend de la photo), mais structurellement identique aux cas ci-dessus | échec attendu (signalé en passe 1) |

Amélioration nette pour `.xs-card-face` et `.xs-focus-content` (largement
au-dessus de 4.5:1). `.newsletter-section` reste **juste sous le seuil de
4.5:1** (≈4.26:1) : le mélange orange-brun devient un gris chaud clair
assez lisible, mais pas totalement conforme AA en corps courant — signalé
plutôt que corrigé, une correction demanderait de toucher au fond de
l'îlot lui-même, hors du périmètre de cette tâche.

La bordure `.newsletter-form` (`--accent-clair`) obtient en revanche un
contraste faible sur ce même fond mêlé (**≈ 2.15:1**), sous le seuil
non-texte de 3:1 recommandé par WCAG pour les limites de composants
d'interface — signalé, non corrigé (même raison : toucher au fond de
l'îlot sort du périmètre défini).

`.xs-txt h1` et `.xs-txt span` (origine `--white`, hors périmètre de cette
passe car ni `--gold` ni `--gold-light`) restent en `--encre` alors qu'ils
sont affichés sur ce même îlot `.xs-layers::after` : l'incohérence relevée
en passe 1 (texte sombre sur fond resté sombre) subsiste pour ces deux
règles précises, seul `.xs-txt h2` (`--gold-light`) a pu être corrigé dans
le périmètre autorisé ici.

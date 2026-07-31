# PALETTE.md — Bascule sombre -> ivoire

Un seul commit sur `refactor-multifichier` : remplacement du bloc `:root`
et reclassement des 125 occurrences de `var(--...)` plus des couleurs
écrites en dur, selon la propriété CSS où chacune apparaît (TEXTE / SURFACE
/ TRAIT). `index.html` n'a pas été restructuré, seules les valeurs de
couleur ont changé.

## Nouveau `:root`

```css
:root {
  --fond: #f4f1ea;
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

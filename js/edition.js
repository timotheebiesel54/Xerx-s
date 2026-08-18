// ─── edition.js ───
// Configurateur "Composer une edition" (page Editions), avec son etat
// (compoState).

    // ─── COMPOSITION (Éditions sur mesure) ───
    function compoMatiereLabel(key) {
      const m = COMPO_MATIERES.find(x => x.key === key);
      return m ? m.label : '';
    }

    let compoState = null;

    function renderComposition() {
      compoState = {
        slots: [
          { type: null, modele: null, matiere: null },
          { type: null, modele: null, matiere: null },
        ],
        activeSlot: null,
        step: 1,
        draftType: null,
        draftModele: null,
        justAdded: null,
      };
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="compo-view animate-in">
          <h1 class="compo-title">Composer une édition</h1>
          <p class="compo-intro">Le duo reste le socle du modèle Xerxès; chaque emplacement reçoit une pièce, une matière, un même numéro gravé pour tous.</p>

          <div class="compo-slots" id="compo-slots"></div>

          <button type="button" class="compo-add-lien" id="compo-add-lien" onclick="compoAddLienClick()">Ajouter un autre membre</button>

          <div class="compo-recap" id="compo-recap"></div>
        </div>

        <div class="compo-veil" id="compo-veil" onclick="compoCloseSlot()"></div>
        <div class="compo-panel" id="compo-panel">
          <button class="compo-panel-close" onclick="compoCloseSlot()" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5L19 19M19 5L5 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <div class="compo-panel-inner" id="compo-panel-inner"></div>
        </div>
      `;
      compoRenderSlots();
      compoRenderRecap();
    }

    const COMPO_PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="var(--encre)" stroke-width="1.5" stroke-linecap="round"/></svg>';

    // Libelle unique par emplacement (jamais les deux a la fois, voir 3.5) : "Vider" des qu'une
    // piece est choisie (matiere non nulle), y compris sur les emplacements 1/2 qui ne sont
    // sinon jamais retirables ; "Retirer" seulement sur un 3e/4e emplacement encore vide.
    function compoSlotActionHTML(i, filled) {
      if (filled) {
        return `<button type="button" class="compo-slot-action" onclick="compoClearSlot(${i}, event)" aria-label="Vider cet emplacement">Vider</button>`;
      }
      if (i >= 2) {
        return `<button type="button" class="compo-slot-action" onclick="compoRemoveSlot(${i}, event)" aria-label="Retirer cet emplacement">Retirer</button>`;
      }
      return '';
    }

    // Le titre de chaque emplacement ("L'un", "Le troisième"...) est derive uniquement de sa
    // position dans compoState.slots (COMPO_SLOT_NAMES[i]) : retirer un emplacement du milieu
    // decale automatiquement titre et piece des suivants, sans code dedie (voir compoRemoveSlot).
    function compoSlotHTML(slot, i, opts) {
      opts = opts || {};
      const filled = !!slot.matiere;
      const icon = slot.type === 'bracelet' ? COMPO_ICON_BRACELET : COMPO_ICON_BAGUE;
      const name = COMPO_SLOT_NAMES[i] || String(i + 1).padStart(2, '0');
      const actionHTML = compoSlotActionHTML(i, filled);
      // Reserve la place du libelle en bas du socle (voir .compo-slot-socle--with-action) :
      // sans ce modificateur, rien ne distingue un socle qui doit degager cet espace d'un
      // socle qui n'affiche aucun libelle (emplacements 1/2 vides).
      const socleActionClass = actionHTML ? ' compo-slot-socle--with-action' : '';
      const stateClass = (opts.lone ? ' compo-slot--lone' : '') + (opts.entering ? ' compo-slot--enter' : '');
      // Genere dans les deux etats (voir .compo-slot.is-filled .compo-slot-name, index.html) :
      // rendu invisible mais toujours dans le flux une fois rempli, pour reserver exactement
      // la meme hauteur qu'a l'etat vide — cette hauteur suit le clamp() du font-size, donc
      // seul l'element reel (pas une valeur calculee a la main) reste juste a tous les viewports.
      const nameHTML = `<span class="compo-slot-name">${name}</span>`;

      if (filled) {
        return `
          <div class="compo-slot is-filled${stateClass}" onclick="compoOpenSlot(${i})">
            ${nameHTML}
            <div class="compo-slot-socle${socleActionClass}">
              <span class="compo-slot-index">${name}</span>
              <div class="compo-slot-icon">${icon}</div>
              <span class="compo-slot-modele">${slot.modele}</span>
              <span class="compo-slot-matiere">${compoMatiereLabel(slot.matiere)}</span>
              ${actionHTML}
            </div>
          </div>
        `;
      }

      return `
        <div class="compo-slot${stateClass}" onclick="compoOpenSlot(${i})">
          ${nameHTML}
          <div class="compo-slot-socle compo-slot-socle--center${socleActionClass}">
            <span class="compo-slot-plus" aria-hidden="true">${COMPO_PLUS_SVG}</span>
            ${actionHTML}
          </div>
        </div>
      `;
    }

    function compoRenderSlots() {
      const grid = document.getElementById('compo-slots');
      if (!grid) return;
      const n = compoState.slots.length;
      const justAdded = compoState.justAdded;
      grid.innerHTML = compoState.slots.map((s, i) => compoSlotHTML(s, i, {
        lone: n === 3 && i === 2,
        entering: justAdded === i,
      })).join('');
      compoState.justAdded = null;
      const addLien = document.getElementById('compo-add-lien');
      if (addLien) addLien.style.display = n >= 4 ? 'none' : '';
    }

    // Ajout : simple fade en opacite sur le nouvel emplacement (voir .compo-slot--enter),
    // aucune reanimation des emplacements existants — la grille CSS fixe leurs colonnes,
    // ajouter une rangee ne deplace jamais la premiere.
    function compoExpand() {
      if (!compoState || compoState.slots.length >= 4) return;
      compoState.slots.push({ type: null, modele: null, matiere: null });
      compoState.justAdded = compoState.slots.length - 1;
      compoRenderSlots();
      compoRenderRecap();
    }

    // Clic sur "Ajouter un autre membre" (voir .compo-add-lien::after) : rétracte d'abord le
    // soulignement (scaleX 1→0, transition CSS déjà posée sur le pseudo-élément), puis une fois
    // la transition finie déclenche compoExpand() — le lien, élément de flux ordinaire, se
    // retrouve alors déjà repositionné sous la grille agrandie — et enfin retire la classe au
    // frame suivant pour rejouer scaleX 0→1 (même transition, donc même durée dans les deux
    // sens). Si ce clic fait apparaître le 4e emplacement, compoRenderSlots masque le lien
    // (display:none) : la classe est simplement nettoyée sans navigateur, aucune 2e phase ne
    // joue puisque l'élément est déjà invisible à ce moment.
    function compoAddLienClick() {
      const link = document.getElementById('compo-add-lien');
      if (!link || !compoState || compoState.slots.length >= 4) return;
      if (link.classList.contains('compo-add-lien--retract')) return;
      const proceed = () => {
        compoExpand();
        if (compoState.slots.length >= 4) {
          link.classList.remove('compo-add-lien--retract');
        } else {
          requestAnimationFrame(() => link.classList.remove('compo-add-lien--retract'));
        }
      };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { proceed(); return; }
      link.classList.add('compo-add-lien--retract');
      link.addEventListener('transitionend', proceed, { once: true });
    }

    // Retrait (emplacements 3 et 4 uniquement, voir compoSlotHTML) : fondu en opacite sur
    // l'element existant avant de le retirer du tableau, pour laisser le temps a la
    // transition de jouer. Le splice reassigne automatiquement titre et piece des emplacements
    // suivants (COMPO_SLOT_NAMES[i] etant purement positionnel, voir 0.5).
    function compoRemoveSlot(i, evt) {
      if (evt) evt.stopPropagation();
      if (!compoState) return;
      const grid = document.getElementById('compo-slots');
      const el = grid ? grid.querySelectorAll('.compo-slot')[i] : null;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const doRemove = () => {
        compoState.slots.splice(i, 1);
        compoRenderSlots();
        compoRenderRecap();
      };
      if (!el || reduceMotion) { doRemove(); return; }
      el.style.transition = 'opacity 0.25s ease';
      el.style.opacity = '0';
      el.addEventListener('transitionend', doRemove, { once: true });
    }

    // Vidage (tout emplacement rempli, y compris 1/2, voir compoSlotActionHTML) : remet le
    // slot a son etat vide sans toucher au tableau (pas de splice), donc sans renumeroter les
    // emplacements suivants. Rendu instantane, aucune transition (voir 3.10).
    function compoClearSlot(i, evt) {
      if (evt) evt.stopPropagation();
      if (!compoState) return;
      compoState.slots[i] = { type: null, modele: null, matiere: null };
      compoRenderSlots();
      compoRenderRecap();
    }

    function compoOpenSlot(i) {
      if (!compoState) return;
      compoState.activeSlot = i;
      const slot = compoState.slots[i];
      compoState.draftType = slot.type;
      compoState.draftModele = slot.modele;
      compoState.step = slot.type ? (slot.modele ? 3 : 2) : 1;
      compoRenderPanel();
      document.getElementById('compo-veil').classList.add('is-open');
      document.getElementById('compo-panel').classList.add('is-open');
      document.body.classList.add('compo-scroll-lock');
    }

    function compoCloseSlot() {
      const veil = document.getElementById('compo-veil');
      const panel = document.getElementById('compo-panel');
      if (veil) veil.classList.remove('is-open');
      if (panel) panel.classList.remove('is-open');
      if (compoState) compoState.activeSlot = null;
      document.body.classList.remove('compo-scroll-lock');
    }

    function compoStepBack() {
      if (!compoState) return;
      compoState.step = Math.max(1, compoState.step - 1);
      compoRenderPanel();
    }

    function compoChooseType(type) {
      if (!compoState) return;
      compoState.draftType = type;
      compoState.draftModele = null;
      compoState.step = 2;
      compoRenderPanel();
    }

    function compoChooseModele(modele) {
      if (!compoState) return;
      compoState.draftModele = modele;
      compoState.step = 3;
      compoRenderPanel();
    }

    function compoChooseMatiere(matiereKey) {
      if (!compoState || compoState.activeSlot === null) return;
      const i = compoState.activeSlot;
      compoState.slots[i] = { type: compoState.draftType, modele: compoState.draftModele, matiere: matiereKey };
      compoCloseSlot();
      compoRenderSlots();
      compoRenderRecap();
    }

    function compoRenderPanel() {
      if (!compoState || compoState.activeSlot === null) return;
      const body = document.getElementById('compo-panel-inner');
      if (!body) return;
      const i = compoState.activeSlot;
      const step = compoState.step;
      let stepLabel = '';
      let cardsHTML = '';

      if (step === 1) {
        stepLabel = 'Type de pièce';
        cardsHTML = `
          <div class="compo-cards">
            <div class="compo-card" onclick="compoChooseType('bague')">
              <div class="compo-card-icon">${COMPO_ICON_BAGUE}</div>
              <span class="compo-card-label">Bague</span>
            </div>
            <div class="compo-card" onclick="compoChooseType('bracelet')">
              <div class="compo-card-icon">${COMPO_ICON_BRACELET}</div>
              <span class="compo-card-label">Bracelet</span>
            </div>
          </div>
        `;
      } else if (step === 2) {
        stepLabel = 'Modèle';
        cardsHTML = `
          <div class="compo-cards">
            ${COMPO_MODELES[compoState.draftType].map(m => `
              <div class="compo-card" onclick="compoChooseModele('${m}')">
                <span class="compo-card-modele">${m}</span>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        stepLabel = 'Matière';
        cardsHTML = `
          <div class="compo-cards">
            ${COMPO_MATIERES.map(m => `
              <div class="compo-card compo-card--matiere" onclick="compoChooseMatiere('${m.key}')">
                <div class="compo-card-swatch" style="background:${m.swatch}"></div>
                <span class="compo-card-label">${m.label}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      body.innerHTML = `
        <span class="compo-panel-eyebrow">${COMPO_SLOT_NAMES[i] || `Emplacement ${i + 1}`}</span>
        <div class="compo-panel-steps">
          <span class="compo-panel-step${step >= 1 ? ' is-active' : ''}">Type</span>
          <span class="compo-panel-step${step >= 2 ? ' is-active' : ''}">Modèle</span>
          <span class="compo-panel-step${step >= 3 ? ' is-active' : ''}">Matière</span>
        </div>
        <h2 class="compo-panel-title">${stepLabel}</h2>
        ${cardsHTML}
        ${step > 1 ? `<span class="compo-panel-back" onclick="compoStepBack()">Revenir</span>` : ''}
      `;
    }

    function compoNarrative(n) {
      if (n <= 2) return "Hérodote racontait que les Perses ne scellaient rien seuls; un serment se prêtait à deux, jamais à un.";
      return `Hérodote racontait que les Perses ne scellaient rien seuls; ce serment s'étend ici à ${n}, gravé d'un même geste pour chacun.`;
    }

    function compoRenderRecap() {
      const el = document.getElementById('compo-recap');
      if (!el || !compoState) return;
      const slots = compoState.slots;
      const allFilled = slots.length > 0 && slots.every(s => s.matiere);
      if (!allFilled) { el.classList.remove('is-visible'); el.innerHTML = ''; return; }

      const n = slots.length;
      el.innerHTML = `
        <div class="compo-recap-divider"></div>
        <span class="compo-recap-eyebrow">Votre édition</span>
        <h2 class="compo-recap-title">${n} pièce${n > 1 ? 's' : ''}</h2>
        <ul class="compo-recap-list">
          ${slots.map((s, i) => `<li><span class="compo-recap-num">${COMPO_SLOT_NAMES[i] || String(i + 1).padStart(2, '0')}</span><span>${s.modele}, ${compoMatiereLabel(s.matiere)}</span></li>`).join('')}
        </ul>
        <p class="compo-recap-narrative">${compoNarrative(n)}</p>
        <span class="xs-lien" onclick="compoRequestAccess()">Demander l'accès<span class="xs-lien-trait"></span></span>
      `;
      el.classList.add('is-visible');
    }

    function compoRequestAccess() {
      if (!compoState) return;
      const lines = compoState.slots.map((s, i) => `${COMPO_SLOT_NAMES[i] || (i + 1)} : ${s.modele}, ${compoMatiereLabel(s.matiere)}`).join('\n');
      window.__compoPrefill = `Je souhaite demander l'accès à l'édition suivante :\n${lines}\n\nMerci de me recontacter.`;
      navigate('contact');
    }

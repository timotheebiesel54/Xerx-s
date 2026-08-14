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
    // Cercle + croix, entierement en traits (fill:none en permanence, voir .compo-add en CSS
    // pour la couleur/hover — currentColor ici pour que la transition CSS sur `color` anime le
    // stroke, cf. le meme procede sur .compo-slot-remove).
    const COMPO_ADD_PLUS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"/><path d="M8 12H16"/><path d="M12 16V8"/></svg>';
    const COMPO_REMOVE_SVG = '<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L10 10M10 4L4 10" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>';

    // Le titre de chaque emplacement ("L'un", "Le troisième"...) est derive uniquement de sa
    // position dans compoState.slots (COMPO_SLOT_NAMES[i]) : retirer un emplacement du milieu
    // decale automatiquement titre et piece des suivants, sans code dedie (voir compoRemoveSlot).
    function compoSlotHTML(slot, i, opts) {
      opts = opts || {};
      const filled = !!slot.matiere;
      const icon = slot.type === 'bracelet' ? COMPO_ICON_BRACELET : COMPO_ICON_BAGUE;
      const name = COMPO_SLOT_NAMES[i] || String(i + 1).padStart(2, '0');
      const removable = i >= 2;
      const removeBtn = removable
        ? `<button type="button" class="compo-slot-remove" onclick="compoRemoveSlot(${i}, event)" aria-label="Retirer cet emplacement">${COMPO_REMOVE_SVG}</button>`
        : '';
      const stateClass = (opts.lone ? ' compo-slot--lone' : '') + (opts.entering ? ' compo-slot--enter' : '');

      if (filled) {
        return `
          <div class="compo-slot is-filled${stateClass}" onclick="compoOpenSlot(${i})">
            <div class="compo-slot-socle">
              ${removeBtn}
              <span class="compo-slot-index">${name}</span>
              <div class="compo-slot-icon">${icon}</div>
              <span class="compo-slot-modele">${slot.modele}</span>
              <span class="compo-slot-matiere">${compoMatiereLabel(slot.matiere)}</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="compo-slot${stateClass}" onclick="compoOpenSlot(${i})">
          <span class="compo-slot-name">${name}</span>
          <div class="compo-slot-socle compo-slot-socle--center">
            ${removeBtn}
            <span class="compo-slot-plus" aria-hidden="true">${COMPO_PLUS_SVG}</span>
          </div>
        </div>
      `;
    }

    function compoAddHTML() {
      return `
        <button type="button" class="compo-add" id="compo-add" onclick="compoExpand()" aria-label="Ajouter une pièce à l'édition">
          <span class="compo-slot-name" aria-hidden="true" style="visibility:hidden">.</span>
          <span class="compo-add-icon">${COMPO_ADD_PLUS_SVG}</span>
        </button>
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
      })).join('') + compoAddHTML();
      compoState.justAdded = null;
      const addBtn = document.getElementById('compo-add');
      if (addBtn) addBtn.style.display = n >= 4 ? 'none' : '';
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
    }

    function compoCloseSlot() {
      const veil = document.getElementById('compo-veil');
      const panel = document.getElementById('compo-panel');
      if (veil) veil.classList.remove('is-open');
      if (panel) panel.classList.remove('is-open');
      if (compoState) compoState.activeSlot = null;
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

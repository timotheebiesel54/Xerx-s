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
      };
      app.innerHTML = `
        <div class="back-arrow" onclick="navigate('home')">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="back-arrow-label">Accueil</span>
        </div>
        <div class="compo-view animate-in">
          <span class="compo-eyebrow">Le rituel de sélection</span>
          <h1 class="compo-title">Composer une édition</h1>
          <p class="compo-intro">Le duo reste le socle du modèle Xerxès; chaque emplacement reçoit une pièce, une matière, un même numéro gravé pour tous.</p>

          <div class="compo-slots" id="compo-slots"></div>

          <div class="compo-expand-wrap" id="compo-expand-wrap">
            <span class="compo-expand-link" id="compo-expand-link" onclick="compoExpand()">Élargir l'édition, jusqu'à quatre pièces</span>
          </div>

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

    function compoSlotHTML(slot, i) {
      const filled = !!slot.matiere;
      const icon = slot.type === 'bracelet' ? COMPO_ICON_BRACELET : COMPO_ICON_BAGUE;
      const portrait = COMPO_SLOT_IMAGES[i];
      const name = COMPO_SLOT_NAMES[i] || String(i + 1).padStart(2, '0');

      if (filled) {
        const filledStyle = portrait
          ? `style="background-image: linear-gradient(180deg, rgba(10,10,10,.2) 0%, rgba(10,10,10,.55) 55%, rgba(10,10,10,.85) 100%), url(${portrait}); background-size: auto, 96%; background-position: center, center; background-repeat: no-repeat, no-repeat;"`
          : '';
        return `
          <div class="compo-slot is-filled" onclick="compoOpenSlot(${i})">
            <div class="compo-slot-socle" ${filledStyle}>
              <span class="compo-slot-index">${name}</span>
              <div class="compo-slot-icon">${icon}</div>
              <span class="compo-slot-modele">${slot.modele}</span>
              <span class="compo-slot-matiere">${compoMatiereLabel(slot.matiere)}</span>
            </div>
          </div>
        `;
      }

      return `
        <div class="compo-slot" onclick="compoOpenSlot(${i})">
          <div class="compo-slot-socle${portrait ? '' : ' compo-slot-socle--center'}">
            <span class="compo-slot-name">${name}</span>
            ${portrait ? `<div class="compo-slot-portrait" style="background-image: url(${portrait})"></div>` : ''}
          </div>
        </div>
      `;
    }

    function compoRenderSlots() {
      const grid = document.getElementById('compo-slots');
      if (!grid) return;
      grid.innerHTML = compoState.slots.map((s, i) => compoSlotHTML(s, i)).join('');
      const link = document.getElementById('compo-expand-link');
      if (link) link.style.display = compoState.slots.length >= 4 ? 'none' : '';
    }

    function compoExpand() {
      if (!compoState || compoState.slots.length >= 4) return;
      const grid = document.getElementById('compo-slots');
      if (!grid) return;
      const existing = Array.from(grid.querySelectorAll('.compo-slot'));
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const firstRects = existing.map(el => el.getBoundingClientRect());

      compoState.slots.push({ type: null, modele: null, matiere: null });
      compoRenderSlots();
      compoRenderRecap();

      if (reduceMotion) return;

      const all = Array.from(grid.querySelectorAll('.compo-slot'));
      all.forEach((el, i) => {
        if (i < firstRects.length) {
          const first = firstRects[i];
          const last = el.getBoundingClientRect();
          gsap.fromTo(el,
            { x: first.left - last.left, y: first.top - last.top, width: first.width, height: first.height },
            {
              x: 0, y: 0, width: last.width, height: last.height,
              duration: 0.7, ease: 'power3.inOut',
              onComplete: () => gsap.set(el, { clearProps: 'x,y,width,height' }),
            }
          );
        } else {
          gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, delay: 0.3, ease: 'power2.out' });
        }
      });
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
        <span class="compo-recap-cta" onclick="compoRequestAccess()">Demander l'accès</span>
      `;
      el.classList.add('is-visible');
    }

    function compoRequestAccess() {
      if (!compoState) return;
      const lines = compoState.slots.map((s, i) => `${COMPO_SLOT_NAMES[i] || (i + 1)} : ${s.modele}, ${compoMatiereLabel(s.matiere)}`).join('\n');
      window.__compoPrefill = `Je souhaite demander l'accès à l'édition suivante :\n${lines}\n\nMerci de me recontacter.`;
      navigate('contact');
    }

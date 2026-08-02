// ─── hero.js ───
// Animation du hero (stores/blinds pilotes au scroll) et barre de
// progression, avec leur etat (xsBlindsSets, xsMaster, xsResizeTimer).

    // ─── HERO : SÉQUENCE SVG MASQUÉE PILOTÉE PAR LE SCROLL (Vertical Blinds) ───
    const XS_BLIND_COUNT = 12;
    const xsSvgNS = 'http://www.w3.org/2000/svg';
    let xsBlindsSets = [];
    let xsMaster;
    let xsResizeTimer;

    function xsCreateBlinds(groupId, isFirstLayer, vbWidth) {
      const g = document.getElementById(groupId);
      if (!g) return null;
      g.innerHTML = '';

      const w = vbWidth / XS_BLIND_COUNT;
      const blinds = [];
      let currentX = 0;

      for (let i = 0; i < XS_BLIND_COUNT; i++) {
        const centerX = currentX + w / 2;
        const rectLeft = document.createElementNS(xsSvgNS, 'rect');
        const rectRight = document.createElementNS(xsSvgNS, 'rect');

        [rectLeft, rectRight].forEach((r) => {
          r.setAttribute('y', '0');
          r.setAttribute('height', '100');
          r.setAttribute('width', isFirstLayer ? w / 2 + 0.1 : '0');
          r.setAttribute('fill', 'white');
          r.setAttribute('shape-rendering', 'crispEdges');
        });

        if (isFirstLayer) {
          rectLeft.setAttribute('x', centerX - w / 2);
          rectRight.setAttribute('x', centerX);
        } else {
          rectLeft.setAttribute('x', centerX);
          rectRight.setAttribute('x', centerX);
        }

        g.appendChild(rectLeft);
        g.appendChild(rectRight);

        blinds.push({ left: rectLeft, right: rectRight, x: centerX, w: w / 2 });
        currentX += w;
      }
      return blinds;
    }

    function xsOpenBlinds(blinds) {
      return gsap.to(
        blinds.flatMap((b) => [b.left, b.right]),
        {
          attr: {
            x: (i) => {
              const b = blinds[Math.floor(i / 2)];
              return i % 2 === 0 ? b.x - b.w : b.x;
            },
            width: (i) => {
              const b = blinds[Math.floor(i / 2)];
              return b.w + 0.05;
            },
          },
          ease: 'none',
          stagger: { each: 0.02, from: 'start' },
        },
      );
    }

    function xsBuildMasterTimeline() {
      if (xsMaster) xsMaster.kill();
      if (!document.querySelector('.xs-stage')) return;

      const texts = gsap.utils.toArray('.xs-txt');

      xsMaster = gsap.timeline({
        scrollTrigger: {
          trigger: '.xs-stage',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 3,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(texts, { clipPath: 'inset(0% 0% 100% 0%)', y: 40, opacity: 0 });
      gsap.set(texts[0], { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1 });

      xsBlindsSets.forEach((blinds, i) => {
        if (i === 0) return;

        if (texts[i - 1]) {
          xsMaster.to(
            texts[i - 1],
            { clipPath: 'inset(0% 0% 100% 0%)', y: -40, opacity: 0, duration: 0.8 },
            '>',
          );
        }

        xsMaster.add(xsOpenBlinds(blinds), '-=0.3');

        if (texts[i]) {
          xsMaster.to(
            texts[i],
            { clipPath: 'inset(0% 0% 0% 0%)', y: 0, opacity: 1, duration: 0.8 },
            '-=0.5',
          );
        }

        xsMaster.to({}, { duration: 1 });
      });
    }

    function xsUpdateLayout() {
      const stage = document.querySelector('.xs-stage');
      if (!stage) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const vbWidth = (width / height) * 100;
      const vbHeight = 100;

      const layers = stage.querySelectorAll('.xs-layer');
      xsBlindsSets = [];

      layers.forEach((svg, i) => {
        svg.setAttribute('viewBox', `0 0 ${vbWidth} ${vbHeight}`);

        const maskRect = svg.querySelector('mask rect');
        if (maskRect) {
          maskRect.setAttribute('width', vbWidth);
          maskRect.setAttribute('height', vbHeight);
        }

        const img = svg.querySelector('image');
        if (img) {
          img.setAttribute('width', vbWidth);
          img.setAttribute('height', vbHeight);
          img.setAttribute('preserveAspectRatio', 'xMidYMid slice');
        }

        const blindElement = svg.querySelector('g[id^="xs-blinds"]');
        if (blindElement) {
          const blinds = xsCreateBlinds(blindElement.id, i === 0, vbWidth);
          if (blinds) xsBlindsSets.push(blinds);
        }
      });

      xsBuildMasterTimeline();
    }

    function xsInitProgressBar() {
      const fills = gsap.utils.toArray('.xs-progress-bar .xs-fill');
      if (!fills.length) return;
      ScrollTrigger.create({
        trigger: '.xs-stage',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalSteps = fills.length;
          fills.forEach((fill, i) => {
            let p = (progress - i / totalSteps) * totalSteps;
            p = Math.max(0, Math.min(1, p));
            fill.style.width = `${p * 100}%`;
          });
        },
      });
    }

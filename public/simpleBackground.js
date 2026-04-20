/**
 * SimpleBackground — v5 (artistic waves + dots + swirl)
 * -----------------------------------------------------------------------------
 * Quiet interactive background. Zero dependencies. SSR-safe. Canvas 2D.
 * Variants: 'dots' | 'lines' | 'crosshairs' | 'waves'
 *
 * v4 notes:
 *  - Waves are drawn as *dots sampled along curves*, not continuous lines.
 *  - Multi-layer depth: several parallel wave fields at different depths;
 *    farther layers are smaller, fainter, and move slower (parallax).
 *  - Noise-perturbed flow so lines feel organic, not sinusoidal wallpaper.
 *  - Per-dot fade at the edges (vignette) for an artistic falloff.
 *  - Cursor creates a soft bulge across all layers.
 *  - Click ripples propagate across layers.
 *
 * Optimizations retained from v2/v3:
 *  - Idle parking (for non-animated variants).
 *  - Batched path fills by alpha bucket.
 *  - Typed-array buffers reused across frames.
 *  - Mobile auto-tuning (lower DPR, bigger spacing, fewer wave layers).
 *  - Passive listeners, visibilitychange + IntersectionObserver pauses.
 *  - Respects prefers-reduced-motion.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else if (typeof root !== 'undefined') root.SimpleBackground = factory();
}(typeof self !== 'undefined' ? self : this, function () {

  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const isMobile = () => isBrowser && (
    window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
    window.innerWidth < 640
  );

  const DEFAULTS = {
    variant: 'waves',                  // 'dots' | 'lines' | 'crosshairs' | 'waves'
    spacing: 24,                       // grid pitch for dots variants
    dotSize: 0.6,
    color: 'rgba(20,20,20,0.55)',
    background: 'transparent',
    influenceRadius: 180,
    warpStrength: 22,
    scaleOnHover: 2.2,
    rippleSpeed: 420,
    rippleWidth: 80,
    rippleDecay: 1.4,
    idleDrift: 0.04,
    maxDpr: 2,
    mobileMaxDpr: 1.5,
    mobileSpacingBoost: 1.25,
    alphaBuckets: 6,
    autoMobile: true,

    // ---- waves variant (artistic) ----
    waveLayers: 1,                     // single layer
    waveLineSpacing: 12,               // vertical gap between lines
    waveDotSpacing: 4,                 // horizontal gap between dots
    waveDotSize: 0.6,                  // dot radius
    waveAmplitude: 18,                 // base amplitude (px)
    waveLength: 640,                   // base wavelength (px)
    waveSpeed: 0.07,                   // cycles/sec
    waveNoiseAmount: 0.45,             // noise displacement
    waveNoiseScale: 260,               // noise spatial scale (px)
    waveHarmonics: 2,                  // stacked sine harmonics (1–3)
    waveCursorPush: 34,                // cursor vertical lift
    waveCursorRadius: 240,             // cursor influence radius
    waveCursorGlow: 2.9,               // brightness multiplier near cursor
    waveDepthFade: 0.75,               // unused with 1 layer
    waveDepthScale: 0.6,               // unused with 1 layer
    waveParallax: 0.55,                // unused with 1 layer
    waveVignette: 0.6,                 // edge fade strength
    waveHueShift: 0,                   // hue rotation (degrees)

    // ---- cursor swirl (organic hover effect) ----
    swirlStrength: 32,                 // max orbital displacement px
    swirlTurns: 0.2,                   // how many rotations across radius
    swirlSpeed: 0.85,                  // rotations/sec
    swirlInward: 0.65,                 // inward pull toward cursor (0–1)
    swirlScatter: 0.75,                // randomness (0 = perfect circles)
    swirlDecay: 3.1,                   // falloff steepness
  };

  const lerp = (a, b, t) => a + (b - a) * t;

  function parseColor(c) {
    if (c[0] === '#') {
      const h = c.slice(1);
      const v = h.length === 3
        ? h.split('').map(x => parseInt(x + x, 16))
        : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      return [v[0], v[1], v[2], 1];
    }
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return [20, 20, 20, 0.55];
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return [p[0] | 0, p[1] | 0, p[2] | 0, p[3] == null ? 1 : p[3]];
  }

  // Fast 2D value-noise (not Perlin, but cheap and smooth enough).
  // Hash → pseudo-random in [0,1). Smoothed with cosine interpolation.
  function hash2(x, y) {
    let h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  }
  function noise2(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = hash2(xi, yi);
    const b = hash2(xi + 1, yi);
    const c = hash2(xi, yi + 1);
    const d = hash2(xi + 1, yi + 1);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  function mount(target, userOpts = {}) {
    if (!isBrowser) return { update() {}, destroy() {}, canvas: null };

    const host = typeof target === 'string' ? document.querySelector(target) : target;
    if (!host) throw new Error('SimpleBackground: target not found');

    const opts = Object.assign({}, DEFAULTS, userOpts);
    const mobile = opts.autoMobile && isMobile();
    // only devices with a real hover pointer (mouse, trackpad, pen) drive the
    // cursor swirl. touch-only devices fire pointermove during scroll, which
    // otherwise makes the background follow the scrolling finger.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (mobile) {
      opts.spacing = Math.round(opts.spacing * opts.mobileSpacingBoost);
      opts.maxDpr = Math.min(opts.maxDpr, opts.mobileMaxDpr);
      if (userOpts.idleDrift == null) opts.idleDrift = 0;
      if (userOpts.influenceRadius == null) opts.influenceRadius *= 0.9;
      // Densify waves on mobile — smaller dots + tighter gaps read as more
      // refined on small screens. Guarded so explicit props still win.
      if (userOpts.waveDotSpacing == null)  opts.waveDotSpacing = Math.max(3, +(opts.waveDotSpacing * 0.75).toFixed(1));
      if (userOpts.waveLineSpacing == null) opts.waveLineSpacing = Math.max(8, Math.round(opts.waveLineSpacing * 0.7));
      if (userOpts.waveDotSize == null)     opts.waveDotSize = +(opts.waveDotSize * 0.8).toFixed(2);
      if (userOpts.waveCursorRadius == null) opts.waveCursorRadius = Math.min(opts.waveCursorRadius, 220);
    }
    // large-viewport density cap (keeps 4K displays bounded)
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    if (vw > 1800 && userOpts.waveDotSpacing == null) {
      opts.waveDotSpacing = Math.round(opts.waveDotSpacing * 1.2);
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      opts.idleDrift = 0;
      opts.waveSpeed = 0;
    }

    const hostStyle = getComputedStyle(host);
    if (hostStyle.position === 'static') host.style.position = 'relative';
    if (!host.style.overflow) host.style.overflow = 'hidden';

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;';
    host.appendChild(canvas);
    // NOTE: `desynchronized: true` was removed. On mobile Chromium (Samsung
    // AMOLED especially) it bypasses the compositor and causes visible flicker
    // that screen capture doesn't record — because screen capture goes through
    // the compositor, but the display doesn't.
    const ctx = canvas.getContext('2d', { alpha: opts.background === 'transparent' });

    let width = 0, height = 0;
    let cols = 0, rows = 0;
    let dpr = Math.min(opts.maxDpr, window.devicePixelRatio || 1);
    let hostRect = null;
    let pointerX = -9999, pointerY = -9999;
    let targetX = -9999, targetY = -9999;
    let pointerInside = false;
    let lastPointerMoveT = 0;
    const ripples = [];
    let rafId = 0;
    let running = false;
    let lastDrawTime = 0;
    let startTime = performance.now();
    let tabVisible = !document.hidden;
    let inViewport = true;
    let [cr, cg, cb, ca] = parseColor(opts.color);

    let resizeRaf = 0;
    let prevW = 0, prevH = 0;
    function resize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        hostRect = host.getBoundingClientRect();
        const w = hostRect.width, h = hostRect.height;
        // mobile browsers resize the viewport as the URL bar hides/shows during
        // scroll. Width stays constant; height wobbles by ~60–120 px. Skip the
        // canvas redraw in that case so the wave pattern doesn't visibly jitter.
        if (mobile && prevW && w === prevW && Math.abs(h - prevH) < 150) return;
        prevW = w; prevH = h;
        width = w;
        height = h;
        dpr = Math.min(opts.maxDpr, window.devicePixelRatio || 1);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cols = Math.ceil(width / opts.spacing) + 2;
        rows = Math.ceil(height / opts.spacing) + 2;
        kick();
      });
    }

    let scrollRaf = 0;
    function onScroll() {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        hostRect = host.getBoundingClientRect();
        scrollRaf = 0;
      });
    }

    function readPointer(e) {
      if (!hostRect) hostRect = host.getBoundingClientRect();
      const cx = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const cy = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : null);
      if (cx == null) return;
      targetX = cx - hostRect.left;
      targetY = cy - hostRect.top;
      pointerInside = true;
      lastPointerMoveT = performance.now();
      kick();
    }
    function onPointerMove(e) { readPointer(e); }
    function onPointerLeave() { pointerInside = false; kick(); }
    function onPress(e) {
      if (!hostRect) hostRect = host.getBoundingClientRect();
      const cx = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const cy = e.clientY != null ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : null);
      if (cx == null) return;
      ripples.push({ x: cx - hostRect.left, y: cy - hostRect.top, born: performance.now() });
      if (ripples.length > 5) ripples.shift();
      // only anchor the swirl on hover-capable devices. On touch, a tap would
      // otherwise leave the swirl permanently stuck at the tap coordinates —
      // there's no pointerleave on touch to release it.
      if (canHover) {
        targetX = cx - hostRect.left; targetY = cy - hostRect.top;
        pointerInside = true;
      }
      kick();
    }

    const passive = { passive: true };
    const hasPointer = 'PointerEvent' in window;
    if (hasPointer) {
      document.addEventListener('pointerdown', onPress, passive);
      if (canHover) {
        document.addEventListener('pointermove', onPointerMove, passive);
        document.addEventListener('pointerleave', onPointerLeave, passive);
      }
    } else {
      document.addEventListener('mousedown', onPress, passive);
      document.addEventListener('touchstart', onPress, passive);
      if (canHover) {
        document.addEventListener('mousemove', onPointerMove, passive);
        document.addEventListener('mouseleave', onPointerLeave, passive);
      }
      // deliberately no touchmove — on mobile it fires during scroll and would
      // make the background follow the scrolling finger.
    }
    window.addEventListener('scroll', onScroll, passive);
    window.addEventListener('resize', resize, passive);
    document.addEventListener('visibilitychange', onVis);

    const ro = 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(host);
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      inViewport = entries[0].isIntersecting;
      if (inViewport) kick();
    }) : null;
    if (io) io.observe(host);

    function onVis() {
      tabVisible = !document.hidden;
      if (tabVisible) { lastDrawTime = 0; kick(); }
      else { stop(); }
    }

    resize();

    function kick() {
      if (running || !tabVisible || !inViewport) return;
      running = true;
      lastDrawTime = performance.now();
      rafId = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    // mobile: cap effective framerate to ~30fps. Halves per-frame dot motion,
    // which in turn halves the work OLED temporal dithering has to do — the
    // biggest driver of the residual "flicker" on Samsung AMOLED screens.
    const minFrameMs = mobile ? 33 : 0;
    let lastRenderT = 0;
    function frame(now) {
      if (!running) return;
      lastDrawTime = now;

      const followRate = pointerInside ? 0.22 : 0.06;
      if (pointerInside) {
        if (pointerX < -1000) { pointerX = targetX; pointerY = targetY; }
        else {
          pointerX = lerp(pointerX, targetX, followRate);
          pointerY = lerp(pointerY, targetY, followRate);
        }
      } else if (pointerX > -1000) {
        pointerX = lerp(pointerX, -9999, followRate);
        pointerY = lerp(pointerY, -9999, followRate);
        if (pointerX < -900) pointerX = -9999;
      }

      if (now - lastRenderT < minFrameMs) {
        rafId = requestAnimationFrame(frame);
        return;
      }
      lastRenderT = now;
      render(now);

      const cursorDim = (pointerX < -900);
      const noRipples = ripples.length === 0;
      const noDrift = opts.idleDrift === 0;
      const isWaves = opts.variant === 'waves';
      if (!isWaves && cursorDim && noRipples && noDrift) {
        stop();
        return;
      }
      rafId = requestAnimationFrame(frame);
    }

    // ---- render dispatch --------------------------------------------------
    const bucketCount = Math.max(2, opts.alphaBuckets | 0);
    let posX = new Float32Array(0);
    let posY = new Float32Array(0);
    let sizeArr = new Float32Array(0);
    let bucketIdx = new Uint8Array(0);
    let alphaArr = new Float32Array(0);
    let capacity = 0;
    function ensureCapacity(n) {
      if (n <= capacity) return;
      capacity = n;
      posX = new Float32Array(n);
      posY = new Float32Array(n);
      sizeArr = new Float32Array(n);
      bucketIdx = new Uint8Array(n);
      alphaArr = new Float32Array(n);
    }

    function render(now) {
      if (opts.background === 'transparent') ctx.clearRect(0, 0, width, height);
      else { ctx.fillStyle = opts.background; ctx.fillRect(0, 0, width, height); }

      if (opts.variant === 'waves') { renderWaves(now); return; }
      renderGrid(now);
    }

    // ---- grid variants (dots / lines / crosshairs) -----------------------
    function renderGrid(now) {
      const spacing = opts.spacing;
      const R = opts.influenceRadius;
      const R2 = R * R;
      const warp = opts.warpStrength;
      const scaleH = opts.scaleOnHover;
      const dotSize = opts.dotSize;
      const hasCursor = pointerX > -900;
      const px0 = pointerX, py0 = pointerY;
      const driftAmp = opts.idleDrift * spacing;
      const driftActive = driftAmp > 0;
      const t = (now - startTime) / 1000;
      const t06 = t * 0.6, t05 = t * 0.5;

      const rips = ripples;
      for (let k = rips.length - 1; k >= 0; k--) {
        if ((now - rips[k].born) / 1000 > opts.rippleDecay) rips.splice(k, 1);
      }
      const rCount = rips.length;

      const total = cols * rows;
      ensureCapacity(total);

      let n = 0;
      for (let j = 0; j < rows; j++) {
        const baseY = j * spacing;
        for (let i = 0; i < cols; i++) {
          const baseX = i * spacing;
          let gx = baseX, gy = baseY;
          if (driftActive) {
            gx += Math.sin(t06 + i * 0.35 + j * 0.12) * driftAmp;
            gy += Math.cos(t05 + j * 0.3  - i * 0.09) * driftAmp;
          }
          let dispX = 0, dispY = 0, emphasis = 0;
          if (hasCursor) {
            const dx = gx - px0, dy = gy - py0;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const d = Math.sqrt(d2);
              const f = 1 - d / R;
              const eased = 3 * f - 3 * f * f + f * f * f;
              emphasis = eased;
              if (d > 0.0001) {
                const inv = 1 / d;
                dispX = -dx * inv * eased * warp;
                dispY = -dy * inv * eased * warp;
              }
            }
          }
          if (rCount) {
            for (let k = 0; k < rCount; k++) {
              const r = rips[k];
              const age = (now - r.born) / 1000;
              if (age > opts.rippleDecay) continue;
              const radius = age * opts.rippleSpeed;
              const dx = gx - r.x, dy = gy - r.y;
              const d = Math.sqrt(dx * dx + dy * dy);
              const band = Math.abs(d - radius);
              if (band < opts.rippleWidth) {
                const bf = 1 - band / opts.rippleWidth;
                const lf = 1 - age / opts.rippleDecay;
                const boost = bf * lf;
                if (boost > emphasis) emphasis = boost;
                if (d > 0.0001) {
                  const inv = 1 / d;
                  dispX += dx * inv * boost * 10;
                  dispY += dy * inv * boost * 10;
                }
              }
            }
          }
          const fx = gx + dispX, fy = gy + dispY;
          if (fx < -4 || fy < -4 || fx > width + 4 || fy > height + 4) continue;
          posX[n] = fx; posY[n] = fy;
          sizeArr[n] = dotSize * (1 + (scaleH - 1) * emphasis);
          let b = (0.35 + emphasis * 0.65) * bucketCount;
          if (b >= bucketCount) b = bucketCount - 1;
          bucketIdx[n] = b | 0;
          n++;
        }
      }

      const variant = opts.variant;
      for (let b = 0; b < bucketCount; b++) {
        const bucketAlpha = ca * ((b + 0.5) / bucketCount);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${bucketAlpha})`;
        ctx.strokeStyle = ctx.fillStyle;
        if (variant === 'lines') {
          ctx.lineWidth = dotSize * 0.9;
          ctx.beginPath();
          for (let k = 0; k < n; k++) {
            if (bucketIdx[k] !== b) continue;
            const s = sizeArr[k];
            const len = dotSize * 3 + (s / dotSize - 1) * spacing * 0.3;
            ctx.moveTo(posX[k], posY[k] - len * 0.5);
            ctx.lineTo(posX[k], posY[k] + len * 0.5);
          }
          ctx.stroke();
        } else if (variant === 'crosshairs') {
          ctx.lineWidth = dotSize * 0.8;
          ctx.beginPath();
          for (let k = 0; k < n; k++) {
            if (bucketIdx[k] !== b) continue;
            const s = sizeArr[k];
            const len = dotSize * 2.2 + (s / dotSize - 1) * spacing * 0.28;
            const x = posX[k], y = posY[k];
            ctx.moveTo(x - len * 0.5, y);
            ctx.lineTo(x + len * 0.5, y);
            ctx.moveTo(x, y - len * 0.5);
            ctx.lineTo(x, y + len * 0.5);
          }
          ctx.stroke();
        } else {
          ctx.beginPath();
          for (let k = 0; k < n; k++) {
            if (bucketIdx[k] !== b) continue;
            const s = sizeArr[k];
            ctx.moveTo(posX[k] + s, posY[k]);
            ctx.arc(posX[k], posY[k], s, 0, Math.PI * 2);
          }
          ctx.fill();
        }
      }
    }

    // ---- waves: dotted + layered + noise-perturbed ------------------------
    function renderWaves(now) {
      const t = (now - startTime) / 1000;
      const layers = Math.max(1, opts.waveLayers | 0);
      const amp = opts.waveAmplitude;
      const wl = opts.waveLength;
      const k = (Math.PI * 2) / wl;
      const stepX = Math.max(3, opts.waveDotSpacing);
      const speedBase = opts.waveSpeed * Math.PI * 2;
      const noiseAmt = opts.waveNoiseAmount;
      const noiseK = 1 / Math.max(40, opts.waveNoiseScale);
      const harmonics = Math.max(1, Math.min(3, opts.waveHarmonics | 0));
      const hasCursor = pointerX > -900;
      const cx = pointerX, cy = pointerY;
      const cR = opts.waveCursorRadius;
      const cR2 = cR * cR;
      const cPush = opts.waveCursorPush;
      const cGlow = Math.max(1, opts.waveCursorGlow);
      const swirlStrength = opts.swirlStrength;
      const swirlTurns = opts.swirlTurns;
      const swirlSpeed = opts.swirlSpeed * Math.PI * 2;
      const swirlInward = opts.swirlInward;
      const swirlScatter = opts.swirlScatter;
      const swirlDecay = Math.max(0.2, opts.swirlDecay);
      const depthFade = opts.waveDepthFade;
      const depthScaleEnd = opts.waveDepthScale;
      const parallax = opts.waveParallax;
      const vignette = opts.waveVignette;
      const hueShift = opts.waveHueShift;

      // count lines for nearest layer; denser layers scale up density
      const nearestLineGap = Math.max(4, opts.waveLineSpacing);

      // ripples snapshot
      const rips = ripples;
      for (let i = rips.length - 1; i >= 0; i--) {
        if ((now - rips[i].born) / 1000 > opts.rippleDecay) rips.splice(i, 1);
      }
      const rCount = rips.length;

      // vignette helpers
      const vxMid = width * 0.5, vyMid = height * 0.5;
      const vMax = Math.sqrt(vxMid * vxMid + vyMid * vyMid);

      // Draw from back to front so nearer layers overlay.
      for (let layer = layers - 1; layer >= 0; layer--) {
        const layerT = layers > 1 ? layer / (layers - 1) : 0; // 0=front, 1=back
        const depthScale = lerp(1, depthScaleEnd, layerT);
        const depthAlpha = lerp(1, depthFade, layerT);
        const layerSpeed = speedBase * lerp(1, 1 - parallax, layerT);
        const layerGap = nearestLineGap * lerp(1, 1.4, layerT);
        const layerAmp = amp * lerp(1, 0.65, layerT);
        const layerDot = opts.waveDotSize * depthScale;

        // per-layer hue tint (optional, in degrees)
        let colR = cr, colG = cg, colB = cb;
        if (hueShift !== 0) {
          // simple hue rotate via HSL detour — done per layer, once
          const [hR, hG, hB] = rotateHue(cr, cg, cb, hueShift * layerT);
          colR = hR; colG = hG; colB = hB;
        }

        // staggered y-offset per layer for depth
        const yJitter = layer * (layerGap * 0.23);
        const lineCount = Math.ceil(height / layerGap) + 3;

        // Collect dots into alpha buckets for batched fill.
        const perLayerCapEstimate = lineCount * (Math.ceil(width / stepX) + 4);
        if (perLayerCapEstimate > capacity) ensureCapacity(perLayerCapEstimate);

        let nDots = 0;

        for (let li = 0; li < lineCount; li++) {
          const y0 = li * layerGap - layerGap + yJitter;
          const phase = li * 0.22 + t * layerSpeed + layer * 1.37;
          const ampL = layerAmp * (0.78 + 0.22 * Math.sin(li * 0.37 + layer));

          for (let x = -stepX; x <= width + stepX; x += stepX) {
            // base harmonics
            let y = y0;
            let dampl = 0;
            for (let h = 1; h <= harmonics; h++) {
              const hk = k * (1 / h);
              const hp = phase / h + h * li * 0.09;
              y += Math.sin(x * hk + hp) * (ampL / h);
              dampl += ampL / h;
            }
            // noise drift
            if (noiseAmt > 0) {
              const n1 = noise2((x + layer * 41) * noiseK,
                                (y + t * 18 + layer * 17) * noiseK);
              y += (n1 - 0.5) * 2 * noiseAmt * ampL;
            }

            // --- cursor swirl: organic orbital displacement --------------
            // Particles within the influence radius orbit the cursor on
            // soft spirals. Displacement has three parts:
            //   1. tangential (perpendicular to radial) => circular motion
            //   2. small radial inward pull              => inhale feeling
            //   3. per-particle phase scatter            => non-mechanical
            let emphasis = 0;
            let swirlDX = 0, swirlDY = 0;
            if (hasCursor) {
              const dx = x - cx, dy = y - cy;
              const d2 = dx * dx + dy * dy;
              if (d2 < cR2) {
                const d = Math.sqrt(d2) + 0.001;
                const f = 1 - d / cR;
                // steeper falloff => tighter swirl near cursor
                const eased = Math.pow(f, swirlDecay);
                emphasis = eased;

                // unit radial
                const rx = dx / d;
                const ry = dy / d;
                // tangent = perpendicular to radial (rotate 90°)
                const tx = -ry;
                const ty = rx;

                // per-particle phase so orbits feel scattered, not uniform
                const seed = noise2((x + layer * 73) * 0.012,
                                    (y + layer * 29) * 0.012);
                const phaseJitter = (seed - 0.5) * swirlScatter * 6.283;

                // angular speed varies with proximity (closer = faster orbit)
                const orbitPhase = t * swirlSpeed * (1 + f * swirlTurns)
                                 + phaseJitter
                                 + layer * 0.6;
                const orbitWobble = 0.5 + 0.5 * Math.sin(orbitPhase);

                // tangential displacement (the orbit)
                const tangMag = swirlStrength * eased * orbitWobble
                              * lerp(1, 0.55, layerT);
                swirlDX += tx * tangMag;
                swirlDY += ty * tangMag;

                // inward pull (soft inhale)
                const pullMag = swirlStrength * eased * swirlInward
                              * lerp(1, 0.5, layerT);
                swirlDX -= rx * pullMag;
                swirlDY -= ry * pullMag;

                // legacy vertical push (kept but much smaller, gives waves
                // a subtle directional lift that reads as 'alive')
                const sign = dy >= 0 ? 1 : -1;
                y += sign * eased * cPush * 0.15 * lerp(1, 0.5, layerT);
              }
            }
            // apply swirl
            const finalX = x + swirlDX;
            y += swirlDY;

            // ripple impact
            if (rCount) {
              for (let ri = 0; ri < rCount; ri++) {
                const r = rips[ri];
                const age = (now - r.born) / 1000;
                if (age > opts.rippleDecay) continue;
                const radius = age * opts.rippleSpeed;
                const dx = x - r.x, dy = y - r.y;
                const d = Math.sqrt(dx * dx + dy * dy);
                const band = Math.abs(d - radius);
                if (band < opts.rippleWidth) {
                  const bf = 1 - band / opts.rippleWidth;
                  const lf = 1 - age / opts.rippleDecay;
                  const boost = bf * lf;
                  const sign = dy >= 0 ? 1 : -1;
                  y += sign * boost * 8 * lerp(1, 0.5, layerT);
                  if (boost > emphasis) emphasis = boost;
                }
              }
            }

            if (y < -4 || y > height + 4) continue;
            // reject swirled-out-of-frame x too
            // (checked after posX assignment via finalX; skip if off)
            // (implicit: we just draw it; culling imperfect is fine)

            // vignette (radial falloff from center)
            let vA = 1;
            if (vignette > 0) {
              const vx = x - vxMid, vy = y - vyMid;
              const vd = Math.sqrt(vx * vx + vy * vy) / vMax; // 0..1
              vA = 1 - vignette * Math.pow(vd, 1.5);
              if (vA < 0) vA = 0;
            }

            // final alpha for this dot
            const glow = 1 + (cGlow - 1) * emphasis;
            const alpha = ca * depthAlpha * vA * glow;
            // dot size (nearer layers + cursor emphasis = larger)
            const size = layerDot * (1 + 0.6 * emphasis);

            posX[nDots] = finalX;
            posY[nDots] = y;
            sizeArr[nDots] = size;
            alphaArr[nDots] = Math.min(alpha, 1);
            // bucket by alpha
            let b = (alphaArr[nDots] / Math.max(0.0001, ca)) * bucketCount;
            if (b >= bucketCount) b = bucketCount - 1;
            if (b < 0) b = 0;
            bucketIdx[nDots] = b | 0;
            nDots++;
          }
        }

        // Batched fills per bucket for this layer
        for (let b = 0; b < bucketCount; b++) {
          // representative alpha = mid of bucket × base alpha
          const bucketAlpha = ca * depthAlpha * ((b + 0.5) / bucketCount);
          ctx.fillStyle = `rgba(${colR},${colG},${colB},${bucketAlpha})`;
          ctx.beginPath();
          let drew = false;
          for (let i = 0; i < nDots; i++) {
            if (bucketIdx[i] !== b) continue;
            const s = sizeArr[i];
            ctx.moveTo(posX[i] + s, posY[i]);
            ctx.arc(posX[i], posY[i], s, 0, Math.PI * 2);
            drew = true;
          }
          if (drew) ctx.fill();
        }
      }
    }

    // ---- tiny hue rotate (rgb → hsl → rgb) --------------------------------
    function rotateHue(r, g, b, deg) {
      // convert to hsl, shift h, convert back
      r /= 255; g /= 255; b /= 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      let h, s, l = (mx + mn) / 2;
      if (mx === mn) { h = 0; s = 0; }
      else {
        const d = mx - mn;
        s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
        switch (mx) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          default: h = (r - g) / d + 4;
        }
        h *= 60;
      }
      h = (h + deg + 360) % 360;
      const hk = h / 360;
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
      let R, G, B;
      if (s === 0) { R = G = B = l; }
      else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        R = hue2rgb(p, q, hk + 1/3);
        G = hue2rgb(p, q, hk);
        B = hue2rgb(p, q, hk - 1/3);
      }
      return [Math.round(R * 255), Math.round(G * 255), Math.round(B * 255)];
    }

    return {
      update(patch = {}) {
        Object.assign(opts, patch);
        if (patch.color) [cr, cg, cb, ca] = parseColor(patch.color);
        resize();
        kick();
      },
      destroy() {
        stop();
        cancelAnimationFrame(resizeRaf);
        cancelAnimationFrame(scrollRaf);
        if (ro) ro.disconnect();
        if (io) io.disconnect();
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', resize);
        document.removeEventListener('visibilitychange', onVis);
        if (hasPointer) {
          document.removeEventListener('pointerdown', onPress);
          if (canHover) {
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerleave', onPointerLeave);
          }
        } else {
          document.removeEventListener('mousedown', onPress);
          document.removeEventListener('touchstart', onPress);
          if (canHover) {
            document.removeEventListener('mousemove', onPointerMove);
            document.removeEventListener('mouseleave', onPointerLeave);
          }
        }
        canvas.remove();
      },
      canvas,
    };
  }

  return { mount, DEFAULTS };
}));

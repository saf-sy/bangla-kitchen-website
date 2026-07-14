/* main.js — scroll engine, snapping, section/card logic, menu.
   The DOM content in index.html is the source of truth; this file only
   adds the "drive" experience on top. If anything here bails out, the
   plain scrollable page remains fully usable. */
(() => {
  'use strict';

  const STOP_IDS = ['hero', 'experience', 'projects', 'skills', 'contact'];

  // ---------- Menu (works in both static and drive mode) ----------
  const menuBtn = document.getElementById('menu-btn');
  const menuOverlay = document.getElementById('menu-overlay');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuOverlay.hidden = !open;
  }
  menuBtn.addEventListener('click', () =>
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
  });

  const prefersReduced =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('city-canvas');
  const ctx = canvas && canvas.getContext && canvas.getContext('2d');

  if (prefersReduced || !ctx || !window.City) {
    // Static fallback: default anchor navigation, close menu on click.
    menuOverlay.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    return;
  }

  // =============================================================
  // Drive mode
  // =============================================================
  const GAP_VH = 2.4;           // viewport-heights of road between stops
  const CAR_SCREEN_FRAC = 0.4;  // car sits at 40% from top (camera leads)
  const SNAP_RANGE_FRAC = 0.55; // snap capture range, in vh
  const CARD_RANGE_FRAC = 0.4;  // card visible range, in vh
  const IDLE_MS = 200;          // input quiet time before snapping

  const view = {
    vw: 0, vh: 0, dpr: 1,
    scrollY: 0, maxScroll: 1,
    progress: 0,            // 0..1 through the day
    carWorldY: 0,
    stops: [],              // {id, el, scrollY, worldY}
    carSpeed: 0,
    t: 0,
  };

  const sections = STOP_IDS.map((id) => document.getElementById(id));
  let spacer = null;
  let rafId = 0;
  let torndown = false;

  function enterDriveMode() {
    document.body.classList.add('drive-mode');
    // The engine drives scroll position frame-by-frame; smooth behavior
    // would re-animate every scrollTo and fight the snap/auto-drive.
    document.documentElement.style.scrollBehavior = 'auto';
    spacer = document.createElement('div');
    spacer.id = 'scroll-spacer';
    spacer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spacer);
    resize();
    window.scrollTo(0, 0);
  }

  function teardownDriveMode() {
    torndown = true;
    cancelAnimationFrame(rafId);
    document.body.classList.remove('drive-mode');
    document.documentElement.style.scrollBehavior = '';
    document.documentElement.removeAttribute('data-tod');
    if (spacer) spacer.remove();
    canvas.style.display = 'none';
  }

  function resize() {
    view.vw = window.innerWidth;
    view.vh = window.innerHeight;
    view.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(view.vw * view.dpr);
    canvas.height = Math.round(view.vh * view.dpr);

    const gap = view.vh * GAP_VH;
    view.stops = sections.map((el, i) => {
      const scrollY = Math.round(i * gap);
      return { id: el.id, el, scrollY, worldY: scrollY + view.vh * CAR_SCREEN_FRAC };
    });
    view.maxScroll = view.stops[view.stops.length - 1].scrollY;
    spacer.style.height = (view.maxScroll + view.vh) + 'px';
    City.layout(view);
    if (window.Ambient && Ambient.layout) Ambient.layout(view);
  }

  // ---------- input tracking (snap must never fight the user) ----------
  let lastInputTime = 0;
  let autoDrive = null; // {from, to, start, dur}

  function noteInput() {
    lastInputTime = performance.now();
    autoDrive = null; // a firm user action breaks auto-drive / snap
  }
  window.addEventListener('wheel', noteInput, { passive: true });
  window.addEventListener('touchmove', noteInput, { passive: true });
  window.addEventListener('keydown', (e) => {
    const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown',
      'Home', 'End', ' '];
    if (scrollKeys.includes(e.key)) noteInput();
  });

  // ---------- menu auto-drive ----------
  menuOverlay.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-stop]');
    if (!a) return;
    e.preventDefault();
    setMenu(false);
    const stop = view.stops.find((s) => s.id === a.dataset.stop);
    if (!stop) return;
    const from = window.scrollY;
    const dist = Math.abs(stop.scrollY - from);
    autoDrive = {
      from,
      to: stop.scrollY,
      start: performance.now(),
      dur: Math.min(2600, Math.max(900, dist * 0.55)),
    };
    history.replaceState(null, '', '#' + stop.id);
  });

  const easeInOutCubic = (x) =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

  // ---------- snap ----------
  function updateSnap(now) {
    if (autoDrive) {
      const k = Math.min(1, (now - autoDrive.start) / autoDrive.dur);
      const y = autoDrive.from + (autoDrive.to - autoDrive.from) * easeInOutCubic(k);
      window.scrollTo(0, y);
      if (k >= 1) autoDrive = null;
      return;
    }
    if (now - lastInputTime < IDLE_MS) return;

    const y = window.scrollY;
    let nearest = null;
    for (const s of view.stops) {
      const d = Math.abs(y - s.scrollY);
      if (!nearest || d < nearest.d) nearest = { s, d };
    }
    const range = view.vh * SNAP_RANGE_FRAC;
    if (nearest && nearest.d > 0.5 && nearest.d < range) {
      // Ease toward the stop; gentle exponential smoothing.
      const next = y + (nearest.s.scrollY - y) * 0.085;
      window.scrollTo(0, Math.abs(next - nearest.s.scrollY) < 0.5
        ? nearest.s.scrollY : next);
    }
  }

  // ---------- cards + time of day ----------
  const TOD_STAGES = ['morning', 'midday', 'golden', 'dusk', 'night'];
  let currentTod = '';

  function updateCards() {
    const cardRange = view.vh * CARD_RANGE_FRAC;
    for (const s of view.stops) {
      s.el.classList.toggle('active',
        Math.abs(view.scrollY - s.scrollY) < cardRange);
    }
    const stage = TOD_STAGES[Math.min(TOD_STAGES.length - 1,
      Math.floor(view.progress * TOD_STAGES.length))];
    if (stage !== currentTod) {
      currentTod = stage;
      document.documentElement.setAttribute('data-tod', stage);
    }
  }

  // ---------- frame loop + performance guard ----------
  const frameTimes = [];
  let perfChecked = false;
  let lastFrame = 0;
  let lastScrollY = 0;

  function frame(now) {
    if (torndown) return;
    rafId = requestAnimationFrame(frame);

    const dt = lastFrame ? Math.min(64, now - lastFrame) : 16;
    lastFrame = now;
    view.t = now;

    updateSnap(now);

    view.scrollY = window.scrollY;
    view.progress = Math.min(1, Math.max(0, view.scrollY / view.maxScroll));
    view.carSpeed = (view.scrollY - lastScrollY) / dt; // px per ms
    lastScrollY = view.scrollY;
    view.carWorldY = view.scrollY + view.vh * CAR_SCREEN_FRAC;

    updateCards();

    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    City.drawWorld(ctx, view);
    if (window.Ambient) {
      Ambient.update(dt, view);
      Ambient.draw(ctx, view);
    }
    City.drawCar(ctx, view);

    // Performance guard: sample the first ~3s of frames; if the device
    // can't hold a reasonable rate, fall back to the static page.
    if (!perfChecked) {
      frameTimes.push(dt);
      if (frameTimes.length >= 150) {
        perfChecked = true;
        const sorted = [...frameTimes].sort((a, b) => a - b);
        const median = sorted[Math.floor(sorted.length / 2)];
        if (median > 26) teardownDriveMode();
      }
    }
  }

  window.addEventListener('resize', () => { if (!torndown) resize(); });

  enterDriveMode();
  rafId = requestAnimationFrame(frame);
})();

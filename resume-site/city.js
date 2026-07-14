/* city.js — city rendering: road, isometric buildings, environment, player
   car. Pure rendering: main.js owns scroll/camera state and passes a `view`
   object each frame. Exposes `world` geometry for ambient.js. */
window.City = (() => {
  'use strict';

  // ---------- palette: 5 keyframes across the day, lerped by progress ----
  const KEYS = [
    { sky0: '#aee3f5', sky1: '#fdeecb', ground: '#cfe0c3', road: '#5d6272', shadow: 0.14, dark: 0.0 },
    { sky0: '#7cc3ee', sky1: '#cfe9f7', ground: '#bcd6ae', road: '#616676', shadow: 0.2, dark: 0.0 },
    { sky0: '#f6a45c', sky1: '#fbd9a0', ground: '#d2c08e', road: '#5b5669', shadow: 0.26, dark: 0.18 },
    { sky0: '#4b4a7c', sky1: '#c96a7e', ground: '#68608a', road: '#3d4058', shadow: 0.18, dark: 0.6 },
    { sky0: '#0d1026', sky1: '#23264a', ground: '#20233c', road: '#2b2e41', shadow: 0.08, dark: 1.0 },
  ];

  function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16)];
  }
  function toRgb(c) { return c[0] === '#' ? hexToRgb(c) : c.match(/\d+/g).map(Number); }
  function mixHex(a, b, k) {
    const A = toRgb(a), B = toRgb(b);
    const c = A.map((v, i) => Math.round(v + (B[i] - v) * k));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }
  const darken = (c, k) => mixHex(c, '#141928', k);
  const lighten = (c, k) => mixHex(c, '#ffffff', k);

  // Memoized: called by city, car and ambient layers every frame with the
  // same progress value.
  let palCacheP = -1, palCache = null;
  function palette(p) {
    if (p === palCacheP) return palCache;
    palCacheP = p;
    palCache = computePalette(p);
    return palCache;
  }

  function computePalette(p) {
    const seg = Math.min(KEYS.length - 2, Math.floor(p * (KEYS.length - 1)));
    const k = p * (KEYS.length - 1) - seg;
    const a = KEYS[seg], b = KEYS[seg + 1];
    return {
      sky0: mixHex(a.sky0, b.sky0, k),
      sky1: mixHex(a.sky1, b.sky1, k),
      ground: mixHex(a.ground, b.ground, k),
      road: mixHex(a.road, b.road, k),
      shadow: a.shadow + (b.shadow - a.shadow) * k,
      dark: a.dark + (b.dark - a.dark) * k, // 0 = day, 1 = full night
    };
  }

  // Deterministic pseudo-random for stable decoration placement.
  function rand(seed) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }

  // ---------- world layout ----------
  const world = {
    roadCX: 0, roadW: 0, laneW: 0, sidewalkW: 0,
    playerLaneX: 0,
    buildings: [],     // {x, y, w, d, h, color, windows, glow}
    trees: [],         // {x, y, r}
    lights: [],        // streetlights {x, y, side}
    crosswalks: [],    // worldY values
    intersections: [], // {y, h} cross streets (h = road width of cross street)
    worldEnd: 0,
  };

  function layout(view) {
    const wide = view.vw > 720;
    world.roadCX = wide ? view.vw * 0.3 : view.vw * 0.5;
    world.roadW = Math.min(Math.max(view.vw * 0.32, 190), 300);
    world.laneW = world.roadW / 4;
    world.sidewalkW = Math.max(26, world.roadW * 0.15);
    world.playerLaneX = world.roadCX + world.laneW * 0.5;
    world.worldEnd = view.maxScroll + view.vh;

    const leftEdge = world.roadCX - world.roadW / 2 - world.sidewalkW;
    const rightEdge = world.roadCX + world.roadW / 2 + world.sidewalkW;

    world.buildings = [];
    world.trees = [];
    world.lights = [];
    world.crosswalks = [];
    world.intersections = [];

    const B = (x, y, w, d, h, color, opt = {}) =>
      world.buildings.push({ x, y, w, d, h, color, windows: opt.windows, glow: opt.glow !== false, awning: opt.awning });

    // --- signature buildings per stop (left of the road) ---
    for (const s of view.stops) {
      const bx = leftEdge - 24; // right edge of building zone
      const y = s.worldY;
      switch (s.id) {
        case 'hero': // small welcome kiosk + green
          B(bx - 110, y - 60, 100, 110, 34, '#d9b8a2', { windows: [3, 2] });
          break;
        case 'experience': // office tower + restaurant storefront
          B(bx - 150, y - 210, 140, 190, 130, '#9fb4cc', { windows: [5, 6] });
          B(bx - 130, y + 30, 120, 100, 30, '#e0a06c', { windows: [4, 1], awning: '#c8544a' });
          break;
        case 'projects': { // row of three distinct small buildings
          B(bx - 128, y - 200, 112, 96, 52, '#c9897b', { windows: [4, 2] });
          B(bx - 140, y - 70, 124, 100, 72, '#8fa98f', { windows: [4, 3] });
          B(bx - 120, y + 66, 104, 92, 40, '#c9b07c', { windows: [3, 2] });
          break;
        }
        case 'skills': // wide workshop/studio
          B(bx - 190, y - 90, 180, 170, 46, '#a3919f', { windows: [6, 2] });
          break;
        case 'contact': // tall glowing tower
          B(bx - 150, y - 170, 136, 230, 150, '#6f7ba1', { windows: [5, 8] });
          break;
      }
      world.crosswalks.push(y - view.vh * 0.28);
    }

    // --- cross streets midway between stops ---
    for (let i = 0; i < view.stops.length - 1; i++) {
      const y = (view.stops[i].worldY + view.stops[i + 1].worldY) / 2;
      world.intersections.push({ y, h: world.laneW * 1.9 });
    }

    // --- filler buildings, trees, streetlights along the route ---
    const step = 260;
    for (let y = -view.vh; y < world.worldEnd + view.vh; y += step) {
      const seed = Math.round(y / step);
      // keep clear of stops and intersections
      const nearStop = view.stops.some((s) => Math.abs(y - s.worldY) < 320);
      const nearX = world.intersections.some((ix) => Math.abs(y - ix.y) < 180);

      if (!nearStop && !nearX && rand(seed) > 0.35) {
        const w = 80 + rand(seed + 1) * 70;
        const d = 90 + rand(seed + 2) * 90;
        const h = 24 + rand(seed + 3) * 60;
        const tones = ['#b5a494', '#a8b0a0', '#b0a0ac', '#9aa8b8', '#c2af92'];
        B(leftEdge - 40 - w - rand(seed + 4) * 60, y, w, d, h,
          tones[seed % tones.length],
          { windows: [Math.max(2, Math.round(w / 34)), Math.max(1, Math.round(h / 26))] });
      }
      // right side of the road: low buildings / green, sparser (cards live here)
      if (!nearX && rand(seed + 5) > 0.55) {
        const w = 60 + rand(seed + 6) * 50;
        B(rightEdge + 30 + rand(seed + 7) * 30, y + 60, w, 70 + rand(seed + 8) * 50,
          16 + rand(seed + 9) * 22, '#b3aa9a',
          { windows: [2, 1] });
      }
      // trees on both sidewalk edges
      if (!nearX && rand(seed + 10) > 0.4) {
        world.trees.push({ x: leftEdge - 12, y: y + rand(seed + 11) * 120, r: 11 + rand(seed + 12) * 5 });
      }
      if (!nearX && rand(seed + 13) > 0.45) {
        world.trees.push({ x: rightEdge + 12, y: y + rand(seed + 14) * 120, r: 10 + rand(seed + 15) * 5 });
      }
      // streetlights alternate sides
      world.lights.push({
        x: seed % 2 ? leftEdge - 6 : rightEdge + 6,
        y: y + 130, side: seed % 2 ? 1 : -1,
      });
    }
    // sort buildings by y so overlaps paint back-to-front
    world.buildings.sort((a, b) => a.y - b.y);
  }

  // ---------- drawing helpers ----------
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  const ISO_KX = -0.32; // extrusion direction (up and slightly left)

  function drawPrism(ctx, b, sy, pal) {
    const { x, w, d, h } = b;
    const dx = ISO_KX * h, dy = -h;

    // ground shadow, cast opposite the extrusion
    ctx.fillStyle = `rgba(20,25,40,${pal.shadow})`;
    ctx.fillRect(x + 8, sy + 8, w, d);

    // front (south) face
    ctx.fillStyle = darken(b.color, 0.22);
    ctx.beginPath();
    ctx.moveTo(x, sy + d); ctx.lineTo(x + w, sy + d);
    ctx.lineTo(x + w + dx, sy + d + dy); ctx.lineTo(x + dx, sy + d + dy);
    ctx.closePath(); ctx.fill();

    // east (right) face — visible since extrusion leans left
    ctx.fillStyle = darken(b.color, 0.38);
    ctx.beginPath();
    ctx.moveTo(x + w, sy); ctx.lineTo(x + w, sy + d);
    ctx.lineTo(x + w + dx, sy + d + dy); ctx.lineTo(x + w + dx, sy + dy);
    ctx.closePath(); ctx.fill();

    // windows on the east face
    if (b.windows) {
      const [cols, rows] = b.windows;
      const lit = pal.dark;
      const off = darken(b.color, 0.55);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // deterministic subset of windows lit at night
          const isLit = lit > 0.25 && b.glow &&
            rand(b.x + c * 7 + r * 13) > 0.35;
          ctx.fillStyle = isLit
            ? mixHex('#ffd98a', '#ffb45e', rand(b.x + c + r))
            : off;
          // small quads following the face slope
          const fy = sy + dy * ((r + 0.75) / rows);
          const fx = x + w + dx * ((r + 0.75) / rows);
          ctx.fillRect(fx - 2, fy + 8 + (d - 16) * c / cols, 5,
            Math.max(4, (h / rows) * 0.45));
        }
      }
    }

    // top face
    ctx.fillStyle = lighten(b.color, 0.12);
    ctx.fillRect(x + dx, sy + dy, w, d);
    ctx.fillStyle = lighten(b.color, 0.25);
    ctx.fillRect(x + dx, sy + dy, w, 8);
    // roof detail: AC unit
    ctx.fillStyle = darken(b.color, 0.15);
    ctx.fillRect(x + dx + w * 0.6, sy + dy + d * 0.25, 14, 14);

    // awning strip for storefronts
    if (b.awning) {
      ctx.fillStyle = b.awning;
      ctx.fillRect(x + w - 4, sy + 6, 8, d - 12);
    }

    // window glow spill at night
    if (pal.dark > 0.5 && b.glow) {
      ctx.fillStyle = `rgba(255,217,138,${(pal.dark - 0.5) * 0.12})`;
      ctx.fillRect(x + w + 2, sy, 26, d);
    }
  }

  function drawTree(ctx, t, sy, pal) {
    ctx.fillStyle = `rgba(20,25,40,${pal.shadow})`;
    ctx.beginPath(); ctx.ellipse(t.x + 5, sy + 5, t.r, t.r * 0.8, 0, 0, 7); ctx.fill();
    ctx.fillStyle = mixHex('#6fa06a', '#2c3a4e', pal.dark * 0.6);
    ctx.beginPath(); ctx.arc(t.x, sy, t.r, 0, 7); ctx.fill();
    ctx.fillStyle = mixHex('#86b478', '#3a4a5e', pal.dark * 0.6);
    ctx.beginPath(); ctx.arc(t.x - t.r * 0.25, sy - t.r * 0.25, t.r * 0.6, 0, 7); ctx.fill();
  }

  function drawStreetlight(ctx, l, sy, pal) {
    ctx.strokeStyle = mixHex('#4a4f5e', '#20233c', pal.dark * 0.5);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(l.x, sy);
    ctx.lineTo(l.x, sy - 26);
    ctx.lineTo(l.x + 14 * l.side, sy - 26);
    ctx.stroke();
    const hx = l.x + 14 * l.side;
    ctx.fillStyle = pal.dark > 0.4 ? '#ffe7b0' : '#c9ccd6';
    ctx.beginPath(); ctx.arc(hx, sy - 26, 3.5, 0, 7); ctx.fill();
    if (pal.dark > 0.4) {
      const a = (pal.dark - 0.4) * 0.35;
      const g = ctx.createRadialGradient(hx, sy - 4, 2, hx, sy - 4, 46);
      g.addColorStop(0, `rgba(255,231,176,${a})`);
      g.addColorStop(1, 'rgba(255,231,176,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(hx, sy - 4, 46, 0, 7); ctx.fill();
    }
  }

  // ---------- world ----------
  function drawWorld(ctx, view) {
    const { vw, vh, scrollY } = view;
    const pal = palette(view.progress);
    const cull = (y, pad) => y < -pad || y > vh + pad;

    // ground
    ctx.fillStyle = pal.ground;
    ctx.fillRect(0, 0, vw, vh);
    // sky-light ambient cast from the top of the frame
    const amb = ctx.createLinearGradient(0, 0, 0, vh);
    amb.addColorStop(0, mixHex(pal.sky0, pal.ground, 0.55));
    amb.addColorStop(0.5, pal.ground);
    ctx.fillStyle = amb;
    ctx.fillRect(0, 0, vw, vh * 0.5);

    const rx = world.roadCX - world.roadW / 2;

    // sidewalks
    ctx.fillStyle = mixHex('#b9bcc7', '#2b2e41', pal.dark * 0.55);
    ctx.fillRect(rx - world.sidewalkW, 0, world.roadW + world.sidewalkW * 2, vh);

    // main road
    ctx.fillStyle = pal.road;
    ctx.fillRect(rx, 0, world.roadW, vh);

    // lane lines (center double + side dashes), world-aligned
    const period = 84, dashLen = 36;
    const startWorld = Math.floor(scrollY / period) * period - period;
    ctx.fillStyle = 'rgba(244,242,236,0.55)';
    for (let wy = startWorld; wy < scrollY + vh + period; wy += period) {
      const sy = wy - scrollY;
      ctx.fillRect(world.roadCX - world.laneW - 2, sy, 4, dashLen);
      ctx.fillRect(world.roadCX + world.laneW - 2, sy, 4, dashLen);
    }
    ctx.fillStyle = 'rgba(250,214,120,0.8)';
    ctx.fillRect(world.roadCX - 3, 0, 2, vh);
    ctx.fillRect(world.roadCX + 1, 0, 2, vh);

    // crosswalks at stops
    ctx.fillStyle = 'rgba(244,242,236,0.7)';
    for (const cy of world.crosswalks) {
      const sy = cy - scrollY;
      if (cull(sy, 40)) continue;
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(rx + 8 + i * (world.roadW - 16) / 8, sy, (world.roadW - 16) / 8 - 6, 26);
      }
    }

    // cross streets (painted after lane markings so they read as breaks)
    for (const ix of world.intersections) {
      const sy = ix.y - scrollY;
      if (cull(sy, ix.h + 60)) continue;
      ctx.fillStyle = mixHex('#b9bcc7', '#2b2e41', pal.dark * 0.55);
      ctx.fillRect(0, sy - ix.h / 2 - world.sidewalkW * 0.7, vw, ix.h + world.sidewalkW * 1.4);
      ctx.fillStyle = pal.road;
      ctx.fillRect(0, sy - ix.h / 2, vw, ix.h);
      // stop lines on the main road (approach side of each direction)
      ctx.fillStyle = 'rgba(244,242,236,0.75)';
      ctx.fillRect(rx + world.roadW / 2, sy + ix.h / 2 + world.sidewalkW * 0.7 + 6, world.roadW / 2, 5);
      ctx.fillRect(rx, sy - ix.h / 2 - world.sidewalkW * 0.7 - 11, world.roadW / 2, 5);
    }

    // buildings
    for (const b of world.buildings) {
      const sy = b.y - scrollY;
      if (sy + b.d < -80 || sy - b.h > vh + 80) continue;
      drawPrism(ctx, b, sy, pal);
    }

    // trees
    for (const t of world.trees) {
      const sy = t.y - scrollY;
      if (cull(sy, 30)) continue;
      drawTree(ctx, t, sy, pal);
    }

    // streetlights
    for (const l of world.lights) {
      const sy = l.y - scrollY;
      if (cull(sy, 60)) continue;
      drawStreetlight(ctx, l, sy, pal);
    }

    // night veil (kept light so glows read warm against it)
    if (pal.dark > 0) {
      ctx.fillStyle = `rgba(10,12,30,${pal.dark * 0.22})`;
      ctx.fillRect(0, 0, vw, vh);
    }
  }

  // ---------- player car ----------
  function drawCar(ctx, view) {
    const pal = palette(view.progress);
    const cx = world.playerLaneX;
    const cy = view.vh * 0.4;
    drawVehicle(ctx, cx, cy, 1, '#e8e6df', pal, true);
  }

  /* Shared vehicle painter (ambient.js reuses it).
     dir: 1 = driving down-screen, -1 = up-screen. */
  function drawVehicle(ctx, cx, cy, dir, color, pal, isPlayer) {
    const w = isPlayer ? 26 : 24, l = isPlayer ? 48 : 44;
    ctx.save();
    ctx.translate(cx, cy);
    if (dir === -1) ctx.rotate(Math.PI);

    if (pal.dark > 0.35) {
      const a = (pal.dark - 0.35) * 0.6;
      ctx.fillStyle = `rgba(255,246,216,${a * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 4, l / 2);
      ctx.lineTo(-w / 2 - 9, l / 2 + 74);
      ctx.lineTo(w / 2 + 9, l / 2 + 74);
      ctx.lineTo(w / 2 - 4, l / 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(20,25,40,0.28)';
    roundRect(ctx, -w / 2 + 3, -l / 2 + 4, w, l, 9);
    ctx.fill();
    ctx.fillStyle = color;
    roundRect(ctx, -w / 2, -l / 2, w, l, 9);
    ctx.fill();
    ctx.fillStyle = mixHex('#8fa3b8', '#1c2333', pal.dark * 0.4);
    roundRect(ctx, -w / 2 + 4, -l / 2 + 13, w - 8, l - 25, 5);
    ctx.fill();
    ctx.fillStyle = pal.dark > 0.35 ? '#ff5a4d' : '#c8544a';
    ctx.fillRect(-w / 2 + 3, -l / 2 + 1, 6, 3);
    ctx.fillRect(w / 2 - 9, -l / 2 + 1, 6, 3);
    ctx.restore();
  }

  return {
    layout, drawWorld, drawCar, drawVehicle,
    palette, world, mixHex, roundRect, rand,
  };
})();

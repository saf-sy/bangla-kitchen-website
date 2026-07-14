/* city.js — city rendering: road, buildings, environment, player car.
   Pure rendering: main.js owns the scroll/camera state and passes a
   `view` object each frame. */
window.City = (() => {
  'use strict';

  // ---------- palette: 5 keyframes across the day, lerped by progress ----
  const KEYS = [
    { sky0: '#aee3f5', sky1: '#fdeecb', ground: '#cfe0c3', road: '#565b6b', shadow: 0.16, dark: 0.0 },
    { sky0: '#7cc3ee', sky1: '#cfe9f7', ground: '#bcd6ae', road: '#5c6172', shadow: 0.22, dark: 0.0 },
    { sky0: '#f6a45c', sky1: '#fbd9a0', ground: '#d6c496', road: '#585469', shadow: 0.26, dark: 0.15 },
    { sky0: '#4b4a7c', sky1: '#c96a7e', ground: '#6d6486', road: '#3c3f56', shadow: 0.2, dark: 0.55 },
    { sky0: '#0d1026', sky1: '#23264a', ground: '#232640', road: '#2c2f42', shadow: 0.1, dark: 1.0 },
  ];

  function hexToRgb(h) {
    return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16)];
  }
  function mixHex(a, b, k) {
    const A = hexToRgb(a), B = hexToRgb(b);
    const c = A.map((v, i) => Math.round(v + (B[i] - v) * k));
    return `rgb(${c[0]},${c[1]},${c[2]})`;
  }

  function palette(p) {
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

  // ---------- world layout ----------
  const world = {
    roadCX: 0,   // road center x
    roadW: 0,
    sidewalkW: 0,
    buildings: [], // {x, y(worldY), w, d, h, color, stop}
  };

  function layout(view) {
    const wide = view.vw > 720;
    world.roadCX = wide ? view.vw * 0.32 : view.vw * 0.5;
    world.roadW = Math.min(Math.max(view.vw * 0.3, 170), 300);
    world.sidewalkW = Math.max(26, world.roadW * 0.16);

    // Placeholder blocky buildings — one block per stop, left of the road.
    world.buildings = view.stops.map((s) => ({
      stop: s.id,
      x: world.roadCX - world.roadW / 2 - world.sidewalkW - 150,
      y: s.worldY - 90,
      w: 130,
      d: 180,
      h: 60,
      color: '#8f96a8',
    }));
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

  function drawBlock(ctx, x, sy, w, d, h, color, pal) {
    // Simple 2.5D extrusion: mass raised by h, with a ground shadow.
    ctx.fillStyle = `rgba(20,25,40,${pal.shadow})`;
    ctx.fillRect(x + 10, sy + 10, w, d);
    ctx.fillStyle = color;
    ctx.fillRect(x, sy - h, w, d);
    ctx.fillStyle = mixHex(color, '#ffffff', 0.25);
    ctx.fillRect(x, sy - h, w, 14);
  }

  function drawWorld(ctx, view) {
    const { vw, vh, scrollY } = view;
    const pal = palette(view.progress);

    // Sky + ground
    const g = ctx.createLinearGradient(0, 0, 0, vh);
    g.addColorStop(0, pal.sky0);
    g.addColorStop(1, pal.sky1);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, vw, vh);
    ctx.fillStyle = pal.ground;
    ctx.fillRect(0, vh * 0.12, vw, vh);

    // Road (vertical, endless) with sidewalks
    const rx = world.roadCX - world.roadW / 2;
    ctx.fillStyle = '#b9bcc7';
    ctx.fillRect(rx - world.sidewalkW, 0, world.roadW + world.sidewalkW * 2, vh);
    ctx.fillStyle = pal.road;
    ctx.fillRect(rx, 0, world.roadW, vh);

    // Center dashes, aligned to world space so they move with scroll.
    ctx.fillStyle = 'rgba(244,242,236,0.8)';
    const dashLen = 34, period = 80;
    const startWorld = Math.floor(scrollY / period) * period;
    for (let wy = startWorld; wy < scrollY + vh + period; wy += period) {
      ctx.fillRect(world.roadCX - 3, wy - scrollY, 6, dashLen);
    }

    // Buildings (culled to the visible band)
    for (const b of world.buildings) {
      const sy = b.y - scrollY;
      if (sy + b.d + b.h < -50 || sy > vh + 50) continue;
      drawBlock(ctx, b.x, sy, b.w, b.d, b.h, b.color, pal);
    }

    // Night dimming veil
    if (pal.dark > 0) {
      ctx.fillStyle = `rgba(10,12,30,${pal.dark * 0.25})`;
      ctx.fillRect(0, 0, vw, vh);
    }
  }

  // ---------- player car ----------
  function drawCar(ctx, view) {
    const pal = palette(view.progress);
    const cx = world.roadCX + world.roadW * 0.22; // right-hand lane
    const cy = view.vh * 0.4;
    const w = 26, l = 48;

    ctx.save();
    ctx.translate(cx, cy);

    // Headlight cones at night (car faces down the road)
    if (pal.dark > 0.35) {
      const a = (pal.dark - 0.35) * 0.5;
      ctx.fillStyle = `rgba(255,246,216,${a * 0.45})`;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 4, l / 2);
      ctx.lineTo(-w / 2 - 8, l / 2 + 70);
      ctx.lineTo(w / 2 + 8, l / 2 + 70);
      ctx.lineTo(w / 2 - 4, l / 2);
      ctx.closePath();
      ctx.fill();
    }

    // Shadow
    ctx.fillStyle = 'rgba(20,25,40,0.25)';
    roundRect(ctx, -w / 2 + 3, -l / 2 + 4, w, l, 9);
    ctx.fill();

    // Body
    ctx.fillStyle = '#e8e6df';
    roundRect(ctx, -w / 2, -l / 2, w, l, 9);
    ctx.fill();
    // Cabin / glass
    ctx.fillStyle = '#8fa3b8';
    roundRect(ctx, -w / 2 + 4, -l / 2 + 14, w - 8, l - 26, 5);
    ctx.fill();
    // Tail lights (top edge = rear; the car drives downward)
    ctx.fillStyle = pal.dark > 0.35 ? '#ff5a4d' : '#c8544a';
    ctx.fillRect(-w / 2 + 3, -l / 2 + 1, 6, 3);
    ctx.fillRect(w / 2 - 9, -l / 2 + 1, 6, 3);

    ctx.restore();
  }

  return { layout, drawWorld, drawCar, palette, world, mixHex, roundRect };
})();

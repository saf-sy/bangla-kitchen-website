/* ambient.js — decorative city life: background traffic, traffic lights,
   pedestrians. Purely additive layer; delete this file (and its <script>
   tag) and the site still works — main.js guards every call. */
window.Ambient = (() => {
  'use strict';

  // Light cycle timing (ms): north-south green, yellow, east-west green, yellow
  const NS_GREEN = 6000, YELLOW = 1200, EW_GREEN = 5000;
  const CYCLE = NS_GREEN + YELLOW + EW_GREEN + YELLOW;

  const CAR_COLORS = ['#c8544a', '#5b83a8', '#c9b07c', '#8fa98f', '#a3919f', '#6f7ba1'];
  const PED_COLORS = ['#c8544a', '#3c6e8f', '#b88a3c', '#6d5a7e', '#4f7a5a'];

  const state = {
    cars: [],   // vertical road: {y, lane, dir, v, cruise, color}
    xcars: [],  // cross streets: {x, ix, laneSide, dir, v, cruise, color}
    peds: [],   // {y, side, dir, v, color, wobble}
    worldH: 1,
  };

  function nsState(ix, t) {
    // per-intersection phase offset so lights aren't synchronized
    const p = (t + ix.y * 3.7) % CYCLE;
    if (p < NS_GREEN) return 'green';
    if (p < NS_GREEN + YELLOW) return 'yellow';
    return 'red';
  }
  function ewState(ix, t) {
    const p = (t + ix.y * 3.7) % CYCLE;
    return p >= NS_GREEN + YELLOW && p < NS_GREEN + YELLOW + EW_GREEN
      ? 'green' : (p >= NS_GREEN + YELLOW + EW_GREEN ? 'yellow' : 'red');
  }

  function layout(view) {
    const W = City.world;
    const R = City.rand;
    state.worldH = view.maxScroll + view.vh * 2;

    // Entity caps scale with viewport but stay modest (mobile-friendly).
    const nCars = Math.min(14, Math.max(6, Math.round(state.worldH / 900)));
    const nPeds = Math.min(18, Math.max(8, Math.round(state.worldH / 700)));

    state.cars = [];
    for (let i = 0; i < nCars; i++) {
      const dir = i % 2 ? 1 : -1; // 1 = down-screen (south), -1 = up
      // southbound ambient cars use the outer right lane (player has inner);
      // northbound use both left lanes.
      const lane = dir === 1 ? 1.5 : (i % 4 < 2 ? -0.5 : -1.5);
      state.cars.push({
        y: R(i * 3 + 1) * state.worldH,
        lane, dir,
        cruise: 100 + R(i * 5 + 2) * 60, // px/s
        v: 60,
        color: CAR_COLORS[i % CAR_COLORS.length],
      });
    }

    state.xcars = [];
    W.intersections.forEach((ix, k) => {
      for (let j = 0; j < 2; j++) {
        const dir = j ? 1 : -1;
        state.xcars.push({
          x: R(k * 7 + j) * view.vw,
          ix, dir,
          laneSide: dir, // keep right: eastbound below center, westbound above
          cruise: 90 + R(k * 11 + j) * 50,
          v: 50,
          color: CAR_COLORS[(k + j + 3) % CAR_COLORS.length],
        });
      }
    });

    state.peds = [];
    for (let i = 0; i < nPeds; i++) {
      state.peds.push({
        y: R(i * 13 + 4) * state.worldH,
        side: i % 2 ? 1 : -1,
        dir: R(i * 17 + 5) > 0.5 ? 1 : -1,
        v: 18 + R(i * 19 + 6) * 16,
        color: PED_COLORS[i % PED_COLORS.length],
        wobble: R(i * 23 + 7) * 6.28,
      });
    }
  }

  // ---------- simulation ----------
  function approachSpeed(target, v, dt) {
    const rate = target > v ? 80 : 240; // brake harder than accelerate
    const dv = rate * (dt / 1000);
    return v < target ? Math.min(target, v + dv) : Math.max(target, v - dv);
  }

  function update(dt, view) {
    const W = City.world;
    const t = view.t;

    // vertical traffic
    for (const c of state.cars) {
      let target = c.cruise;

      // red/yellow light ahead → ease to the stop line
      for (const ix of W.intersections) {
        const line = ix.y - c.dir * (ix.h / 2 + 30); // stop line before box
        const dist = (line - c.y) * c.dir;
        const s = nsState(ix, t);
        if (s !== 'green' && dist > 0 && dist < 160) {
          target = Math.min(target, Math.max(0, (dist - 10) * 1.6));
        }
      }
      // keep distance from the car ahead in the same lane
      for (const o of state.cars) {
        if (o === c || o.lane !== c.lane) continue;
        const gap = (o.y - c.y) * c.dir;
        if (gap > 0 && gap < 70) target = Math.min(target, Math.max(0, (gap - 55) * 3));
      }

      c.v = approachSpeed(target, c.v, dt);
      c.y += c.dir * c.v * (dt / 1000);
      if (c.y > state.worldH + 100) c.y = -100;
      if (c.y < -100) c.y = state.worldH + 100;
    }

    // cross-street traffic
    for (const c of state.xcars) {
      let target = c.cruise;
      const s = ewState(c.ix, t);
      const rx0 = W.roadCX - W.roadW / 2 - W.sidewalkW - 24;
      const rx1 = W.roadCX + W.roadW / 2 + W.sidewalkW + 24;
      const line = c.dir === 1 ? rx0 : rx1;
      const dist = (line - c.x) * c.dir;
      if (s !== 'green' && dist > 0 && dist < 150) {
        target = Math.min(target, Math.max(0, (dist - 10) * 1.6));
      }
      for (const o of state.xcars) {
        if (o === c || o.ix !== c.ix || o.dir !== c.dir) continue;
        const gap = (o.x - c.x) * c.dir;
        if (gap > 0 && gap < 66) target = Math.min(target, Math.max(0, (gap - 52) * 3));
      }
      c.v = approachSpeed(target, c.v, dt);
      c.x += c.dir * c.v * (dt / 1000);
      if (c.x > view.vw + 120) c.x = -120;
      if (c.x < -120) c.x = view.vw + 120;
    }

    // pedestrians
    for (const p of state.peds) {
      p.y += p.dir * p.v * (dt / 1000);
      p.wobble += dt / 260;
      if (p.y > state.worldH + 40) p.y = -40;
      if (p.y < -40) p.y = state.worldH + 40;
    }
  }

  // ---------- drawing ----------
  function drawTrafficLight(ctx, x, sy, s, pal) {
    ctx.fillStyle = `rgb(60,64,78)`;
    ctx.fillRect(x - 2, sy - 22, 4, 22);
    ctx.fillRect(x - 5, sy - 34, 10, 14);
    ctx.fillStyle = s === 'green' ? '#5ad07a' : s === 'yellow' ? '#ffd24d' : '#ff5a4d';
    ctx.beginPath(); ctx.arc(x, sy - 27, 3.2, 0, 7); ctx.fill();
    if (pal.dark > 0.4) {
      ctx.fillStyle = ctx.fillStyle;
      ctx.globalAlpha = 0.35;
      ctx.beginPath(); ctx.arc(x, sy - 27, 7, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function draw(ctx, view) {
    const W = City.world;
    const pal = City.palette(view.progress);
    const { vh, vw, scrollY, t } = view;

    // vertical cars (cull to viewport)
    for (const c of state.cars) {
      const sy = c.y - scrollY;
      if (sy < -90 || sy > vh + 90) continue;
      City.drawVehicle(ctx, W.roadCX + c.lane * W.laneW, sy, c.dir, c.color, pal, false);
    }

    // cross-street cars
    for (const c of state.xcars) {
      const sy = c.ix.y + c.laneSide * c.ix.h * 0.27 - scrollY;
      if (sy < -60 || sy > vh + 60 || c.x < -60 || c.x > vw + 60) continue;
      ctx.save();
      ctx.translate(c.x, sy);
      ctx.rotate(c.dir === 1 ? -Math.PI / 2 : Math.PI / 2);
      City.drawVehicle(ctx, 0, 0, 1, c.color, pal, false);
      ctx.restore();
    }

    // pedestrians on the sidewalks
    const swL = W.roadCX - W.roadW / 2 - W.sidewalkW / 2;
    const swR = W.roadCX + W.roadW / 2 + W.sidewalkW / 2;
    for (const p of state.peds) {
      const sy = p.y - scrollY;
      if (sy < -20 || sy > vh + 20) continue;
      const x = (p.side === 1 ? swR : swL) + Math.sin(p.wobble) * 3;
      ctx.fillStyle = 'rgba(20,25,40,0.2)';
      ctx.beginPath(); ctx.ellipse(x + 2, sy + 2, 4, 3, 0, 0, 7); ctx.fill();
      ctx.fillStyle = City.mixHex(p.color, '#1c2333', pal.dark * 0.45);
      ctx.beginPath(); ctx.arc(x, sy, 4, 0, 7); ctx.fill();
      ctx.fillStyle = City.mixHex('#e8d5c0', '#3a4a5e', pal.dark * 0.5);
      ctx.beginPath(); ctx.arc(x, sy - 1.5, 2.2, 0, 7); ctx.fill();
    }

    // traffic lights on intersection corners (NS light + EW light)
    for (const ix of W.intersections) {
      const sy = ix.y - scrollY;
      if (sy < -80 || sy > vh + 80) continue;
      const rx0 = W.roadCX - W.roadW / 2 - W.sidewalkW;
      const rx1 = W.roadCX + W.roadW / 2 + W.sidewalkW;
      drawTrafficLight(ctx, rx1 + 8, sy - ix.h / 2 - 10, nsState(ix, t), pal);
      drawTrafficLight(ctx, rx0 - 8, sy + ix.h / 2 + 26, nsState(ix, t), pal);
      drawTrafficLight(ctx, rx1 + 8, sy + ix.h / 2 + 26, ewState(ix, t), pal);
      drawTrafficLight(ctx, rx0 - 8, sy - ix.h / 2 - 10, ewState(ix, t), pal);
    }
  }

  return { layout, update, draw };
})();

/**
 * River wave paths shared by RiverDivider and hero food clip-path.
 * viewBox matches RiverDivider: 0 0 1200 60
 */

export const RIVER_DIVIDER_VIEWBOX = '0 0 1200 60'

/** Primary (gold) stroke path — same d as RiverDivider */
export const RIVER_WAVE_GOLD_D =
  'M0 30 Q100 10 200 30 Q300 50 400 30 Q500 10 600 30 Q700 50 800 30 Q900 10 1000 30 Q1100 50 1200 30'

/** Secondary (terracotta) stroke path */
export const RIVER_WAVE_TERRACOTTA_D =
  'M0 35 Q100 18 200 35 Q300 52 400 35 Q500 18 600 35 Q700 52 800 35 Q900 18 1000 35 Q1100 52 1200 35'

/** Alternate section dividers — same language, different rhythm (preserveAspectRatio stretches to width). */
export const RIVER_WAVE_PRESETS = {
  classic: {
    gold: RIVER_WAVE_GOLD_D,
    terracotta: RIVER_WAVE_TERRACOTTA_D,
  },
  swell: {
    gold:
      'M0 31 Q100 5 200 31 Q300 55 400 31 Q500 5 600 31 Q700 55 800 31 Q900 5 1000 31 Q1100 55 1200 31',
    terracotta:
      'M0 36 Q100 12 200 36 Q300 58 400 36 Q500 12 600 36 Q700 58 800 36 Q900 12 1000 36 Q1100 58 1200 36',
  },
  ripple: {
    gold: 'M0 30 Q240 10 480 30 Q720 50 960 30 Q1080 22 1200 30',
    terracotta: 'M0 35 Q240 16 480 35 Q720 54 960 35 Q1080 28 1200 35',
  },
}

const GOLD_SEGMENTS = [
  { x0: 0, y0: 30, cx: 100, cy: 10, x1: 200, y1: 30 },
  { x0: 200, y0: 30, cx: 300, cy: 50, x1: 400, y1: 30 },
  { x0: 400, y0: 30, cx: 500, cy: 10, x1: 600, y1: 30 },
  { x0: 600, y0: 30, cx: 700, cy: 50, x1: 800, y1: 30 },
  { x0: 800, y0: 30, cx: 900, cy: 10, x1: 1000, y1: 30 },
  { x0: 1000, y0: 30, cx: 1100, cy: 50, x1: 1200, y1: 30 },
]

/** {@link RIVER_WAVE_PRESETS.swell.gold} as quadratic segments (same structure as classic). */
const SWELL_GOLD_SEGMENTS = [
  { x0: 0, y0: 31, cx: 100, cy: 5, x1: 200, y1: 31 },
  { x0: 200, y0: 31, cx: 300, cy: 55, x1: 400, y1: 31 },
  { x0: 400, y0: 31, cx: 500, cy: 5, x1: 600, y1: 31 },
  { x0: 600, y0: 31, cx: 700, cy: 55, x1: 800, y1: 31 },
  { x0: 800, y0: 31, cx: 900, cy: 5, x1: 1000, y1: 31 },
  { x0: 1000, y0: 31, cx: 1100, cy: 55, x1: 1200, y1: 31 },
]

/** {@link RIVER_WAVE_PRESETS.ripple.gold} */
const RIPPLE_GOLD_SEGMENTS = [
  { x0: 0, y0: 30, cx: 240, cy: 10, x1: 480, y1: 30 },
  { x0: 480, y0: 30, cx: 720, cy: 50, x1: 960, y1: 30 },
  { x0: 960, y0: 30, cx: 1080, cy: 22, x1: 1200, y1: 30 },
]

function quadYAtX(x, x0, y0, cx, cy, x1, y1) {
  const xt = (t) => (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1
  const yt = (t) => (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y1
  let lo = 0
  let hi = 1
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2
    if (xt(mid) < x) lo = mid
    else hi = mid
  }
  const t = (lo + hi) / 2
  return yt(t)
}

/**
 * Y on the gold wave at x ∈ [0, 1200] (svg user units), for a {@link RIVER_WAVE_PRESETS} variant.
 */
export function riverPresetGoldY(x, variant = 'classic') {
  const xx = Math.min(1200, Math.max(0, x))
  const segs =
    variant === 'swell'
      ? SWELL_GOLD_SEGMENTS
      : variant === 'ripple'
        ? RIPPLE_GOLD_SEGMENTS
        : GOLD_SEGMENTS
  for (const seg of segs) {
    if (xx <= seg.x1 + 1e-9) {
      return quadYAtX(xx, seg.x0, seg.y0, seg.cx, seg.cy, seg.x1, seg.y1)
    }
  }
  const last = segs[segs.length - 1]
  return last.y1
}

/** Y on the classic gold wave (same as {@link riverPresetGoldY}(x, 'classic')). */
export function riverGoldWaveY(x) {
  return riverPresetGoldY(x, 'classic')
}

/**
 * Map divider path Y (10…50 in viewBox) to objectBoundingBox Y for the clip bottom edge.
 * Trough (50) → bottom of box (1); crest (10) → cuts slightly into image.
 */
export function riverWaveYToClipBb(yPath) {
  const yMin = 10
  const yMax = 50
  /** Fraction of box height: crest of wave cuts into image (matches divider stroke amplitude). */
  const depth = 0.072
  const t = (yPath - yMin) / (yMax - yMin)
  return 1 - (1 - t) * depth
}

/**
 * Hero image bottom edge (fraction from top, 0–1): follows RIVER_WAVE_GOLD_D centerline so the
 * mask matches the curved stroke in {@link RIVER_DIVIDER_VIEWBOX} when widths align.
 * Trough (y=50) sits near physical bottom; crest (y=10) cuts upward by ~swing of box height.
 */
export function riverWaveYToHeroGoldEdge(yPath) {
  const yMin = 10
  const yMax = 50
  /** Trough (lowest part of wave) maps to bottom of box so photo fills to the curve. */
  const baseline = 0
  const swing = 0.1
  const t = (yMax - yPath) / (yMax - yMin)
  return 1 - baseline - t * swing
}

/**
 * clip-path polygon() string (percentages) for hero image frame: soft top corners + gold wave bottom.
 * Scales with element width/height.
 */
export function getHeroRiverClipPolygon({ topCornerY = 6.5, topFlat0 = 5, topFlat1 = 95 } = {}) {
  const tc = topCornerY / 100
  const tf0 = topFlat0 / 100
  const tf1 = topFlat1 / 100
  const pts = []

  pts.push([0, tc])
  pts.push([tf0, 0])
  pts.push([tf1, 0])
  pts.push([1, tc])

  const yRight = riverWaveYToHeroGoldEdge(riverGoldWaveY(1200))
  pts.push([1, yRight])

  const steps = 96
  for (let i = steps; i >= 0; i--) {
    const xu = (i / steps) * 1200
    const yn = riverWaveYToHeroGoldEdge(riverGoldWaveY(xu))
    pts.push([xu / 1200, yn])
  }

  pts.push([0, tc])

  return `polygon(${pts.map(([x, y]) => `${(x * 100).toFixed(4)}% ${(y * 100).toFixed(4)}%`).join(',')})`
}

const RIVER_VIEWBOX_H = 60

/**
 * clip-path: flat top, wavy bottom following the gold line for `variant` (matches RiverDivider flush below).
 * `capRem` = SVG height (`h-11` = 2.75rem, `md:h-[3.75rem]`).
 */
export function getSectionBottomClipPolygonRem(capRem = 2.75, variant = 'classic', steps = 96) {
  const yAt = (xu) => {
    const yPath = riverPresetGoldY(xu, variant)
    const factor = 1 - yPath / RIVER_VIEWBOX_H
    return `calc(100% - ${(capRem * factor).toFixed(4)}rem)`
  }
  const parts = ['0% 0%', '100% 0%', `100% ${yAt(1200)}`]
  for (let i = steps - 1; i >= 0; i--) {
    const xu = (i / steps) * 1200
    const xPct = ((xu / 1200) * 100).toFixed(4)
    parts.push(`${xPct}% ${yAt(xu)}`)
  }
  parts.push(`0% ${yAt(0)}`, '0% 0%')
  return `polygon(${parts.join(', ')})`
}

/**
 * clip-path: wavy top (gold line) then square to bottom — for sections pulled under a flush divider with `variant`.
 */
export function getSectionTopWaveClipPolygonRem(capRem, variant = 'classic', steps = 96) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const xu = (i / steps) * 1200
    const yPath = riverPresetGoldY(xu, variant)
    const yRem = (yPath / RIVER_VIEWBOX_H) * capRem
    pts.push(`${((xu / 1200) * 100).toFixed(4)}% ${yRem.toFixed(4)}rem`)
  }
  pts.push('100% 100%', '0% 100%')
  return `polygon(${pts.join(', ')})`
}

/** Alias for {@link getSectionBottomClipPolygonRem}(capRem, 'classic'). */
export function getHeroSectionBottomClipPolygonRem(capRem = 2.75, steps = 96) {
  return getSectionBottomClipPolygonRem(capRem, 'classic', steps)
}

/** Footer / espresso top — classic wave (same as {@link getSectionTopWaveClipPolygonRem}(capRem, 'classic')). */
export function getContactTopWaveClipPolygonRem(capRem, steps = 96) {
  return getSectionTopWaveClipPolygonRem(capRem, 'classic', steps)
}

/**
 * Closed SVG path: region from gold wave down to `floorY60` (viewBox coords), for `variant`.
 * Use behind RiverDivider strokes so nothing bleeds through the transparent band.
 */
export function getRiverWaveFillCapPathDForVariant(variant = 'classic', floorY60 = 60, steps = 96) {
  let d = `M 0 ${riverPresetGoldY(0, variant).toFixed(3)}`
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * 1200
    d += ` L ${x.toFixed(2)} ${riverPresetGoldY(x, variant).toFixed(3)}`
  }
  d += ` L 1200 ${floorY60} L 0 ${floorY60} Z`
  return d
}

/** Classic wave — same as {@link getRiverWaveFillCapPathDForVariant}('classic', …). */
export function getRiverWaveFillCapPathD(floorY60 = 60, steps = 96) {
  return getRiverWaveFillCapPathDForVariant('classic', floorY60, steps)
}

/** Precomputed fill for static SVG (matches viewBox height 60). */
export const RIVER_WAVE_FILL_CAP_D = getRiverWaveFillCapPathD(60, 96)

const HERO_MASK_TOP_CORNER = 6.5 / 100
const HERO_MASK_TOP_FLAT0 = 5 / 100
const HERO_MASK_TOP_FLAT1 = 95 / 100
const HERO_MASK_Y_SCALE = 1000

/**
 * Data-URI SVG for CSS mask-image (luminance): white = visible, same boundary as getHeroRiverClipPolygon().
 * Tall viewBox (1200×1000) avoids subpixel flattening; preserveAspectRatio="none" stretches full width.
 */
export function getHeroRiverMaskSvgDataUri() {
  const tc = HERO_MASK_TOP_CORNER
  const tf0 = HERO_MASK_TOP_FLAT0 * 1200
  const tf1 = HERO_MASK_TOP_FLAT1 * 1200
  const Y = HERO_MASK_Y_SCALE

  let d = `M 0 ${tc * Y} L ${tf0} 0 L ${tf1} 0 L 1200 ${tc * Y}`

  const yRight = riverWaveYToHeroGoldEdge(riverGoldWaveY(1200))
  d += ` L 1200 ${yRight * Y}`

  const steps = 96
  for (let i = steps - 1; i >= 0; i--) {
    const xu = (i / steps) * 1200
    const yn = riverWaveYToHeroGoldEdge(riverGoldWaveY(xu))
    d += ` L ${xu} ${yn * Y}`
  }

  d += ` L 0 ${tc * Y} Z`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 ${Y}" preserveAspectRatio="none"><path fill="white" d="${d}"/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

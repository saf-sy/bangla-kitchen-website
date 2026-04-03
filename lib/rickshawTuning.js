/**
 * Rickshaw (delivery strip) motion + ink outline. Edit here for permanent defaults,
 * or open the site with `?rickshawTune=1` and use the on-page sliders (saved in localStorage).
 */
export const RICKSHAW_TUNING_DEFAULTS = {
  /** Horizontal start of the ride (`translateX`), as % of the moving layer’s own width */
  travelStartPercent: -150,
  /** Horizontal end position (same units) */
  travelEndPercent: 40,
  /** Seconds for one full crossing */
  travelDurationSec: 5.2,
  /**
   * SVG feMorphology dilate radius — controls how thick the dark “ink” outline looks.
   * Try ~0.04–0.28 (very thin → chunky).
   */
  outlineDilateRadius: 0.28,
}

/** Bumped when shipped defaults change so stale slider saves don’t override them. */
export const RICKSHAW_TUNING_STORAGE_KEY = 'bangla-kitchen-rickshaw-tuning-v2'

/** @param {Partial<typeof RICKSHAW_TUNING_DEFAULTS>} patch */
function clamp(n, lo, hi, fallback) {
  const x = typeof n === 'number' ? n : Number(n)
  if (!Number.isFinite(x)) return fallback
  return Math.min(hi, Math.max(lo, x))
}

/** Coerce saved / partial values so bad localStorage can’t break the page. */
export function mergeRickshawTuning(patch = {}) {
  const m = { ...RICKSHAW_TUNING_DEFAULTS, ...patch }
  let travelStartPercent = clamp(
    m.travelStartPercent,
    -250,
    120,
    RICKSHAW_TUNING_DEFAULTS.travelStartPercent,
  )
  let travelEndPercent = clamp(m.travelEndPercent, -120, 250, RICKSHAW_TUNING_DEFAULTS.travelEndPercent)
  if (travelEndPercent <= travelStartPercent) {
    travelStartPercent = RICKSHAW_TUNING_DEFAULTS.travelStartPercent
    travelEndPercent = RICKSHAW_TUNING_DEFAULTS.travelEndPercent
  }
  return {
    travelStartPercent,
    travelEndPercent,
    travelDurationSec: clamp(m.travelDurationSec, 0.5, 30, RICKSHAW_TUNING_DEFAULTS.travelDurationSec),
    outlineDilateRadius: clamp(m.outlineDilateRadius, 0.01, 0.5, RICKSHAW_TUNING_DEFAULTS.outlineDilateRadius),
  }
}

export function readRickshawTuningFromStorage() {
  if (typeof window === 'undefined') return mergeRickshawTuning()
  try {
    const raw = window.localStorage.getItem(RICKSHAW_TUNING_STORAGE_KEY)
    if (!raw) return mergeRickshawTuning()
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return mergeRickshawTuning()
    return mergeRickshawTuning(parsed)
  } catch {
    return mergeRickshawTuning()
  }
}

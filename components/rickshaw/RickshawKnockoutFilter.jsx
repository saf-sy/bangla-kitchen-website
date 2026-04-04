'use client'

/**
 * SVG filter that knocks out the light background from the rickshaw video.
 * Uses a non-linear alpha curve to preserve faint lines while killing background.
 */
export default function RickshawKnockoutFilter({ dilateRadius, filterId = 'rickshaw-knockout-tunable' }) {
  const r = typeof dilateRadius === 'number' && Number.isFinite(dilateRadius) ? dilateRadius : 0.85

  // Build an S-curve alpha table based on the slider value
  // Lower 'r' = stricter (kills more), Higher 'r' = permissive (catches faint lines)
  // The curve kills pure background but ramps up fast for even slightly dark pixels
  const threshold = Math.max(0.02, 0.25 - r * 0.08) // where the ramp starts (lower = catches more)
  
  // Generate 11-point table: values at alpha = 0, 0.1, 0.2, ... 1.0
  const points = []
  for (let i = 0; i <= 10; i++) {
    const a = i / 10 // input alpha
    if (a < threshold) {
      points.push(0) // background: kill it
    } else if (a < threshold + 0.15) {
      // Fast ramp from 0 to ~0.8 in the transition zone
      const t = (a - threshold) / 0.15
      points.push(Math.min(1, t * t * 0.9)) // quadratic ramp
    } else {
      points.push(1) // line art: fully visible
    }
  }
  const tableValues = points.map(v => v.toFixed(3)).join(' ')

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          id={filterId}
          colorInterpolationFilters="sRGB"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
        >
          {/* Step 1: Gentle contrast boost */}
          <feComponentTransfer in="SourceGraphic" result="crushed">
            <feFuncR type="linear" slope="1.2" intercept="-0.05" />
            <feFuncG type="linear" slope="1.2" intercept="-0.05" />
            <feFuncB type="linear" slope="1.2" intercept="-0.05" />
          </feComponentTransfer>

          {/* Step 2: Luminance to alpha */}
          <feColorMatrix
            in="crushed"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.2126 -0.7152 -0.0722 0 1"
            result="knockout"
          />

          {/* Step 3: S-curve alpha — kills flat background, preserves faint lines */}
          <feComponentTransfer in="knockout" result="shaped">
            <feFuncA type="table" tableValues={tableValues} />
          </feComponentTransfer>

          {/* Step 4: Lighter warm brown ink, semi-transparent */}
          <feColorMatrix
            in="shaped"
            type="matrix"
            values="0 0 0 0 0.32  0 0 0 0 0.24  0 0 0 0 0.18  0 0 0 0.6 0"
            result="inked"
          />
        </filter>
      </defs>
    </svg>
  )
}

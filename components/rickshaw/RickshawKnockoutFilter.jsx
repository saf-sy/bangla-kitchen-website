'use client'

/**
 * Inline SVG filter for the rickshaw video outline. Lives next to the video so
 * `outlineDilateRadius` can change without editing root layout.
 */
export default function RickshawKnockoutFilter({ dilateRadius, filterId = 'rickshaw-knockout-tunable' }) {
  const r = typeof dilateRadius === 'number' && Number.isFinite(dilateRadius) ? dilateRadius : 0.1
  /** Two-value form: some engines only apply feMorphology when rx/ry are explicit. */
  const radiusAttr = `${r} ${r}`

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
          x="-8%"
          y="-8%"
          width="116%"
          height="116%"
        >
          <feComponentTransfer in="SourceGraphic" result="crushed">
            <feFuncR type="linear" slope="1.28" intercept="-0.06" />
            <feFuncG type="linear" slope="1.28" intercept="-0.06" />
            <feFuncB type="linear" slope="1.28" intercept="-0.06" />
          </feComponentTransfer>
          <feColorMatrix
            in="crushed"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.2126 -0.7152 -0.0722 0 1"
            result="knockout"
          />
          <feComponentTransfer in="knockout" result="alphaLifted">
            <feFuncA type="linear" slope="2.55" intercept="-0.18" />
          </feComponentTransfer>
          <feMorphology in="alphaLifted" operator="dilate" radius={radiusAttr} result="spread" />
          <feColorMatrix
            in="spread"
            type="matrix"
            values="0.5 0 0 0 0.18  0 0.44 0 0 0.12  0 0 0.38 0 0.1  0 0 0 1 0"
            result="inked"
          />
          <feComponentTransfer in="inked" result="rickshawFinal">
            <feFuncA type="linear" slope="1.04" intercept="-0.02" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  )
}

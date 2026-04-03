'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  RIVER_DIVIDER_VIEWBOX,
  RIVER_WAVE_FILL_CAP_D,
  RIVER_WAVE_PRESETS,
} from '@/lib/riverWave'

const WAVE_GOLD = '#C4A028'
const WAVE_BRICK = '#8B1A1A'

export function FloralMotif({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={`motif-scatter ${className}`} aria-hidden="true">
      <g fill="none" stroke={WAVE_BRICK} strokeWidth="1">
        <ellipse cx="60" cy="60" rx="30" ry="12" />
        <ellipse cx="60" cy="60" rx="30" ry="12" transform="rotate(60 60 60)" />
        <ellipse cx="60" cy="60" rx="30" ry="12" transform="rotate(120 60 60)" />
        <circle cx="60" cy="60" r="6" fill="#D4AF37" fillOpacity="0.3" />
      </g>
    </svg>
  )
}

export function SpiceMotif({ className }) {
  return (
    <svg viewBox="0 0 80 80" className={`motif-scatter ${className}`} aria-hidden="true">
      <g fill="none" stroke="#D4AF37" strokeWidth="0.8">
        <path d="M40 10 Q55 25 40 40 Q25 55 40 70" />
        <path d="M40 10 Q25 25 40 40 Q55 55 40 70" />
        <circle cx="40" cy="40" r="4" fill="#D4AF37" fillOpacity="0.2" />
      </g>
    </svg>
  )
}

export function BengaliWatermark({ text, className = '' }) {
  return (
    <span aria-hidden="true" className={`bengali-watermark bengali-watermark--subtle ${className}`.trim()}>
      {text}
    </span>
  )
}

/**
 * Full-width wave ribbon: parchment fill under the same paths as RiverDivider.
 * Eliminates transparent gaps; use at menu (or section) top with slight negative margin to interlock with content above.
 */
export function RiverWaveTopCap({ className = '' }) {
  const { gold, terracotta } = RIVER_WAVE_PRESETS.classic
  return (
    <svg
      viewBox={RIVER_DIVIDER_VIEWBOX}
      preserveAspectRatio="none"
      overflow="visible"
      className={`block w-full h-11 md:h-[3.75rem] ${className}`.trim()}
      style={{ display: 'block' }}
      aria-hidden="true"
    >
      <path d={RIVER_WAVE_FILL_CAP_D} fill="#FBF7E9" />
      <path d={gold} fill="none" stroke={WAVE_GOLD} strokeWidth="2.35" opacity="0.52" />
      <path d={terracotta} fill="none" stroke={WAVE_BRICK} strokeWidth="1.35" opacity="0.4" />
    </svg>
  )
}

export function RiverDivider({
  className = '',
  flush = false,
  variant = 'classic',
  ...rest
}) {
  const preset = RIVER_WAVE_PRESETS[variant] ?? RIVER_WAVE_PRESETS.classic
  return (
    <div
      className={`relative w-full overflow-visible ${flush ? 'py-0 leading-[0] text-[0]' : 'py-2.5'} ${className}`.trim()}
      {...rest}
    >
      <svg
        viewBox={RIVER_DIVIDER_VIEWBOX}
        preserveAspectRatio="none"
        overflow="visible"
        className="block w-full h-11 md:h-[3.75rem]"
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <path d={preset.gold} fill="none" stroke={WAVE_GOLD} strokeWidth="2.35" opacity="0.52" />
        <path d={preset.terracotta} fill="none" stroke={WAVE_BRICK} strokeWidth="1.35" opacity="0.4" />
      </svg>
    </div>
  )
}

export function JamdaniPattern({ id = 'jamdani' }) {
  return (
    <svg
      className="pointer-events-none absolute left-0 right-0 top-[-10px] bottom-[-10px] z-[2] h-auto w-full overflow-visible opacity-[0.05]"
      aria-hidden="true"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={id} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M40 0 L80 40 L40 80 L0 40Z" fill="none" stroke="#D4AF37" strokeWidth="0.6" />
          <path d="M40 12 L68 40 L40 68 L12 40Z" fill="none" stroke="#D4AF37" strokeWidth="0.4" />
          <circle cx="40" cy="40" r="3" fill="none" stroke="#D4AF37" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

export function VintageStamp() {
  return (
    <svg viewBox="0 0 200 200" className="w-32 h-32 md:w-40 md:h-40 animate-spin-slow" aria-hidden="true">
      <defs>
        <path id="stampCircle" d="M 100,100 m -62,0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0" />
      </defs>
      <circle cx="100" cy="100" r="90" fill="#FBF7E9" fillOpacity="0.85" />
      <circle cx="100" cy="100" r="82" fill="none" stroke={WAVE_BRICK} strokeWidth="2.5" strokeDasharray="5 3" />
      <circle cx="100" cy="100" r="76" fill="none" stroke={WAVE_BRICK} strokeWidth="1" />
      <text fill={WAVE_BRICK} className="text-[9.5px] font-bold tracking-[0.08em] uppercase">
        <textPath xlinkHref="#stampCircle">
          AUTHENTIC DHAKA RECIPES • 100% HALAL • AUTHENTIC DHAKA RECIPES • 100% HALAL •
        </textPath>
      </text>
      <circle cx="100" cy="100" r="31" fill="#f8f0df" fillOpacity="0.9" />
      <circle cx="100" cy="100" r="28" fill="none" stroke={WAVE_BRICK} strokeWidth="1.4" />
      <circle cx="100" cy="100" r="21" fill="none" stroke="#D4AF37" strokeWidth="1" />
      <path
        d="M100 86 L103.2 93.4 L111.2 94 L105 99.4 L107 107 L100 102.8 L93 107 L95 99.4 L88.8 94 L96.8 93.4 Z"
        fill={WAVE_BRICK}
        fillOpacity="0.9"
      />
      <text x="100" y="117" textAnchor="middle" fill={WAVE_BRICK} className="text-[8.5px] font-serif font-bold tracking-[0.14em]">
        BANGLA KITCHEN
      </text>
    </svg>
  )
}

export function RickshawPhoneIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M6 3h8l3 3v12l-3 3H6l-3-3V6l3-3Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h5M9 11h5M9 14h3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function RickshawPinIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 21c4-5 6-7.6 6-10a6 6 0 1 0-12 0c0 2.4 2 5 6 10Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export function RickshawClockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function SmartFoodImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
}) {
  const fallbackSrc =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 900'><rect width='1200' height='900' fill='#fbf7e9'/><text x='600' y='450' text-anchor='middle' fill='#2b1e16' fill-opacity='0.65' font-size='56' font-family='serif'>Bangla Kitchen</text></svg>`
    )
  const [safeSrc, setSafeSrc] = useState(src)

  if (fill) {
    return (
      <Image
        src={safeSrc}
        alt={alt}
        fill
        sizes={sizes ?? '(max-width: 1024px) 100vw, 50vw'}
        className={className}
        priority={priority}
        unoptimized
        onError={() => setSafeSrc(fallbackSrc)}
      />
    )
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setSafeSrc(fallbackSrc)}
    />
  )
}

export function PolaroidPhoto({ src, alt, rotate, caption }) {
  return (
    <div className={`polaroid-photo bg-polaroid p-3 pb-16 rounded-sm shadow-xl shadow-espresso/20 ${rotate} relative cursor-default overflow-hidden`}>
      <span className="polaroid-tape" aria-hidden="true" />
      <div className="overflow-hidden rounded-sm">
        <SmartFoodImage src={src} alt={alt} width={400} height={300} className="w-full h-52 md:h-64 object-cover" />
      </div>
      <p className="absolute bottom-4 left-0 right-0 text-center font-hand text-xl text-espresso/60">{caption}</p>
    </div>
  )
}

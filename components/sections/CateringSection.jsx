'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import {
  BengaliWatermark,
  FloralMotif,
  JamdaniPattern,
  RickshawClockIcon,
  RickshawPhoneIcon,
  RickshawPinIcon,
  RiverDivider,
} from '@/components/art/Decoratives'
import RiverWaveSectionClip from '@/components/art/RiverWaveSectionClip'
import { getRiverWaveFillCapPathDForVariant } from '@/lib/riverWave'
import {
  mergeRickshawTuning,
  readRickshawTuningFromStorage,
  RICKSHAW_TUNING_DEFAULTS,
} from '@/lib/rickshawTuning'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'
import RickshawSprite from '@/components/rickshaw/RickshawSprite'
import RickshawTunerPanel from '@/components/rickshaw/RickshawTunerPanel'
import { contacts, deliveryPlatforms } from '@/app/data/siteContent'

/** Match navbar / former footer: scale logo art inside the circle. */
const FOOTER_LOGO_INNER_SCALE = 1.14

const PARCHMENT_FILL = '#FBF7E9'
const ESPRESSO_FILL = '#2B1E16'

const HERO_MARQUEE_PHRASE =
  'AUTHENTIC BANGLADESHI SOUL FOOD • EST. IN HOUSTON • FAMILY RECIPES • HANDCRAFTED MISHTI • 100% HALAL •'

export function HeroMarqueeStrip() {
  return (
    <>
      <p className="sr-only">
        Authentic Bangladeshi soul food, established in Houston, family recipes, handcrafted mishti, one hundred
        percent halal.
      </p>
      <div
        className="relative z-10 w-screen left-1/2 -translate-x-1/2 overflow-hidden border-y border-gold/15 bg-espresso py-3 md:py-3.5"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <span
              key={dup}
              className="flex shrink-0 items-center px-8 md:px-14 text-parchment/40 text-xs sm:text-sm md:text-base font-bold tracking-[0.22em] uppercase"
            >
              {HERO_MARQUEE_PHRASE}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

/* Brand marks from Simple Icons (MIT) — files in /public/images/ */
function DeliveryPlatformIcon({ icon, name }) {
  const badgeBase =
    'inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-espresso/10'

  if (icon === 'ubereats') {
    return (
      <span className={`${badgeBase} h-11 w-11`} aria-hidden="true">
        <Image
          src="/images/ubereats-icon.svg"
          alt=""
          width={28}
          height={28}
          unoptimized
          className="h-7 w-7 object-contain"
        />
      </span>
    )
  }

  if (icon === 'doordash') {
    return (
      <span className={`${badgeBase} h-11 w-11`} aria-hidden="true">
        <Image
          src="/images/doordash-icon.svg"
          alt=""
          width={28}
          height={28}
          unoptimized
          className="h-7 w-7 object-contain"
        />
      </span>
    )
  }

  return (
    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-espresso/10 px-2 text-[10px] font-bold uppercase tracking-[0.12em] text-espresso/70" aria-hidden="true">
      {name.slice(0, 2)}
    </span>
  )
}


export default function CateringSection() {
  const [footerLogoError, setFooterLogoError] = useState(false)
  const dividerCapRem = useRiverDividerCapRem()
  const capScale = dividerCapRem / 2.75
  const swellWaveFillD = useMemo(() => getRiverWaveFillCapPathDForVariant('swell', 60, 96), [])
  const classicWaveFillD = useMemo(() => getRiverWaveFillCapPathDForVariant('classic', 60, 96), [])
  const [rickshawTuning, setRickshawTuning] = useState(() => mergeRickshawTuning())
  const prefersReducedMotion = useReducedMotion()
  const rickshawRowRef = useRef(null)
  const rickshawSpriteRef = useRef(null)
  const rickshawAnimRef = useRef(null)
  const rickshawX = useMotionValue(`${RICKSHAW_TUNING_DEFAULTS.travelStartPercent}%`)
  const rickshawInView = useInView(rickshawRowRef, { once: true, amount: 0.05 })
  const rickshawTuningRef = useRef(rickshawTuning)
  rickshawTuningRef.current = rickshawTuning

  useEffect(() => {
    const t = readRickshawTuningFromStorage()
    setRickshawTuning(t)
    rickshawX.set(`${t.travelStartPercent}%`)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once on mount; rickshawX is stable
  }, [])

  // No longer scrubbing video tied to MotionValue to ensure smoother framerates

  const {
    travelStartPercent: rsStart,
    travelEndPercent: rsEnd,
    travelDurationSec: rsDuration,
  } = rickshawTuning

  useEffect(() => {
    rickshawAnimRef.current?.stop()
    rickshawAnimRef.current = null

    const startPct = `${rsStart}%`

    if (!rickshawInView) {
      rickshawX.set(startPct)
      return
    }

    if (prefersReducedMotion) {
      rickshawX.set('0%')
      return
    }

    // Calculate end position to center the rickshaw on screen
    const rickshawEl = rickshawSpriteRef.current
    const viewportW = window.innerWidth
    let endPx = `${rsEnd}%` // fallback to default

    if (rickshawEl) {
      const elW = rickshawEl.offsetWidth || 300
      const centerPx = (viewportW - elW) / 2
      endPx = `${centerPx}px`
    }

    rickshawX.set(startPct)

    // Play ring ring sound once
    try {
      const bell = new Audio('https://actions.google.com/sounds/v1/alarms/bicycle_bell.ogg')
      bell.volume = 0.85
      bell.play().catch(() => {})
    } catch {}

    rickshawAnimRef.current = animate(rickshawX, endPx, {
      duration: rsDuration,
      ease: "easeOut",
    })

    return () => {
      rickshawAnimRef.current?.stop()
      rickshawAnimRef.current = null
    }
  }, [rickshawInView, prefersReducedMotion, rickshawX, rsStart, rsEnd, rsDuration])

  return (
    <>
      <RiverWaveSectionClip
        as="section"
        id="delivery"
        edge="top"
        variant="swell"
        capScale={capScale}
        className="relative isolate z-[1] overflow-x-hidden overflow-y-visible bg-parchment py-32 md:py-40 -mt-[calc(2.75rem+2px)] md:-mt-[calc(3.75rem+2px)]"
      >
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-[19] h-11 md:h-[3.75rem] text-[0] leading-[0]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            className="block h-full w-full"
          >
            <path d={swellWaveFillD} fill={PARCHMENT_FILL} />
          </svg>
        </div>
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 text-[0] leading-[0]">
          <RiverDivider variant="swell" flush />
        </div>
        <BengaliWatermark text="ডেলিভারি" className="top-14 right-[4%] -rotate-4" />
        <div className="max-w-5xl mx-auto px-8 md:px-10">
          <div className="section-header-texture inline-block pr-3 mb-4">
            <p className="font-hand text-terracotta text-xl mb-1 -rotate-1">Delivery</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">We&apos;ll Come to You</h2>
          </div>
          <p className="text-espresso/55 max-w-md mb-12 leading-[1.75] tracking-[0.012em]">Can’t make it to us? Order through your favourite delivery app.</p>

          <div className="grid sm:grid-cols-12 gap-6 items-start">
            {deliveryPlatforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block bg-polaroid border border-espresso/8 p-8 md:p-10 shadow-lg shadow-espresso/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out ${platform.className}`}
              >
                <div className="mb-4">
                  <DeliveryPlatformIcon icon={platform.icon} name={platform.name} />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 group-hover:text-terracotta transition-colors duration-300 ease-out tracking-tight">{platform.name}</h3>
                <p className="text-espresso/50 mb-5">{platform.description}</p>
                <span className="inline-flex items-center gap-1.5 text-terracotta font-bold text-sm tracking-wide">Order Now <ExternalLink size={14} /></span>
              </a>
            ))}
          </div>

          <div
            ref={rickshawRowRef}
            className="relative isolate z-[2] mt-8 md:mt-10 h-[10rem] md:h-[14rem] overflow-hidden bg-parchment pb-2 pt-3 md:pt-5 pointer-events-none text-espresso w-[100vw] max-w-[100vw] ml-[calc(50%-50vw)]"
          >
            <div className="absolute inset-x-0 bottom-2 md:bottom-4 border-b border-dashed border-espresso/45" />
            <motion.div
              className="absolute bottom-2 md:bottom-4 left-0 will-change-transform pointer-events-auto cursor-pointer"
              style={{ x: rickshawX }}
              aria-hidden="true"
              onPointerEnter={() => {
                const bell = new Audio('https://actions.google.com/sounds/v1/alarms/bicycle_bell.ogg')
                bell.volume = 0.85
                bell.play().catch(() => {})
              }}
              onClick={() => {
                const bell = new Audio('https://actions.google.com/sounds/v1/alarms/bicycle_bell.ogg')
                bell.volume = 1.0
                bell.play().catch(() => {})
              }}
            >
              <RickshawSprite
                ref={rickshawSpriteRef}
                className="drop-shadow-[0px_0px_0.5px_rgba(43,30,22,0.6)]"
              />
            </motion.div>
          </div>
        </div>
      </RiverWaveSectionClip>

      <HeroMarqueeStrip />

      <section
        id="catering"
        className="relative isolate mb-[-1px] overflow-x-hidden overflow-y-visible py-32 md:py-44"
      >
        <JamdaniPattern id="jamdani-catering" />
        <BengaliWatermark text="আপ্যায়ন" className="top-8 left-[6%] rotate-5" />
        <FloralMotif className="w-28 h-28 bottom-16 right-[6%] rotate-12 hidden lg:block" />
        <div className="max-w-5xl mx-auto px-8 md:px-10 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 md:gap-14 items-start">
            <div className="md:col-span-5">
              <div className="section-header-texture inline-block pr-3 mb-6">
                <p className="font-hand text-terracotta text-xl mb-1 -rotate-1">Private Events</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">Let Us Cook<br />for Your<br />Occasion</h2>
              </div>
              <p className="text-espresso/55 leading-[1.75] tracking-[0.012em] mb-6 max-w-sm">Family dawat, birthday, nikah, or a gathering of old friends — we bring the full Bangla Kitchen experience.</p>
            </div>
            <div className="md:col-span-7 md:mt-8 space-y-5">
              <a href={contacts.cateringPhoneHref} className="block bg-polaroid border border-espresso/8 p-7 md:p-8 shadow-lg shadow-espresso/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-espresso/35 mb-2">Speak with us</p>
                <p className="font-serif text-3xl md:text-4xl font-bold text-espresso group-hover:text-terracotta transition-colors tracking-tight">{contacts.cateringPhone}</p>
              </a>
              <a href={contacts.secondaryPhoneHref} className="block bg-polaroid border border-espresso/8 p-7 md:p-8 shadow-lg shadow-espresso/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-espresso/35 mb-2">Or reach us at</p>
                <p className="font-serif text-3xl md:text-4xl font-bold text-espresso group-hover:text-terracotta transition-colors tracking-tight">{contacts.secondaryPhone}</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <RiverWaveSectionClip
        as="footer"
        id="contact"
        edge="top"
        variant="classic"
        capScale={capScale}
        className="relative isolate overflow-x-hidden overflow-y-visible bg-espresso pb-24 pt-0 text-parchment md:pb-12 -mt-[calc(2.75rem+2px)] md:-mt-[calc(3.75rem+2px)]"
      >
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-[19] h-11 md:h-[3.75rem] text-[0] leading-[0]"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            className="block h-full w-full"
          >
            <path d={classicWaveFillD} fill={ESPRESSO_FILL} />
          </svg>
        </div>
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 text-[0] leading-[0]">
          <RiverDivider flush />
        </div>
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,240,210,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-5xl mx-auto px-8 md:px-10 relative z-10 pt-12 md:pt-16">
          {/* Footer Header */}
          <div className="section-header-texture inline-block pr-2 mb-10">
            <p className="font-hand text-gold text-lg md:text-xl mb-0.5 -rotate-1">Visit Us</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight leading-tight">
              Come Say Hello
            </h2>
          </div>

          {/* 3 Even Columns */}
          <div className="grid md:grid-cols-3 gap-10 md:gap-12 items-start">
            {/* Column 1: Address */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RickshawPinIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                <h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Find Us</h3>
              </div>
              <p className="text-parchment/70 leading-snug tracking-[0.02em] text-sm">{contacts.address}</p>
              <a
                href={contacts.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-gold text-xs font-bold hover:underline transition-colors duration-300 ease-out"
              >
                Get Directions <ExternalLink size={11} />
              </a>
            </div>

            {/* Column 2: Hours */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <RickshawClockIcon className="w-3.5 h-3.5 text-gold" />
                <h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Hours</h3>
              </div>
              <table className="w-full text-sm">
                <tbody>
                  {contacts.hours.map((entry) => {
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === entry.day
                    const isClosed = entry.time === 'Closed'
                    return (
                      <tr key={entry.day} className={`border-b border-parchment/8 last:border-0 ${isToday ? 'text-gold' : ''}`}>
                        <td className={`py-1.5 pr-4 font-semibold text-xs tracking-wide ${isToday ? 'text-gold' : 'text-parchment/60'}`}>
                          {entry.day}
                          {isToday && <span className="ml-1.5 text-[9px] font-bold uppercase text-gold/70">Today</span>}
                        </td>
                        <td className={`py-1.5 text-right text-xs tabular-nums ${isClosed ? 'text-terracotta/70 font-bold' : isToday ? 'text-gold font-semibold' : 'text-parchment/50'}`}>
                          {entry.time}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Column 3: Call Us */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <RickshawPhoneIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                <h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Call Us</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <a
                    href={contacts.restaurantPhoneHref}
                    className="text-parchment/80 hover:text-gold transition-colors duration-300 ease-out text-base font-semibold leading-none"
                  >
                    {contacts.restaurantPhone}
                  </a>
                  <p className="text-parchment/35 text-[10px] mt-0.5">Restaurant</p>
                </div>
                <div>
                  <a
                    href={contacts.cateringPhoneHref}
                    className="text-parchment/80 hover:text-gold transition-colors duration-300 ease-out text-base font-semibold leading-none"
                  >
                    {contacts.cateringPhone}
                  </a>
                  <p className="text-parchment/35 text-[10px] mt-0.5">Catering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-12 pt-8 border-t border-parchment/15">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-3">
                {!footerLogoError ? (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 shadow-md shadow-black/15 sm:h-12 sm:w-12">
                    <Image
                      src="/textures/bangla-kitchen-logo.png"
                      alt="Bangla Kitchen"
                      width={48}
                      height={48}
                      className="h-full w-full object-contain"
                      style={{ transform: `scale(${FOOTER_LOGO_INNER_SCALE})`, transformOrigin: 'center center' }}
                      loading="lazy"
                      onError={() => setFooterLogoError(true)}
                    />
                  </span>
                ) : (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 bg-parchment/10 font-serif font-bold text-sm text-gold sm:h-12 sm:w-12">
                    BK
                  </span>
                )}
                <div>
                  <p className="font-hand text-gold text-lg leading-tight">বাংলাদেশ থেকে ভালোবাসায়</p>
                  <p className="font-serif italic text-parchment/40 text-xs mt-0.5 tracking-[0.02em]">
                    From Bangladesh, with love.
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-parchment/30 tracking-[0.08em]">
                © {new Date().getFullYear()} Bangla Kitchen &amp; Sweets. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </RiverWaveSectionClip>

      <RickshawTunerPanel tuning={rickshawTuning} setTuning={setRickshawTuning} />

      <div className="fixed bottom-0 left-3 right-3 z-[10050] pb-3 md:hidden">
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-espresso/95 backdrop-blur-md border border-gold/30 shadow-xl shadow-espresso/25">
          <a href="#menu" className="text-center py-2.5 font-serif font-bold text-xs tracking-tight text-parchment/90 hover:text-gold transition-colors duration-300">Menu</a>
          <a href={contacts.restaurantPhoneHref} className="text-center py-2.5 font-bold text-xs tracking-wide text-white bg-terracotta shadow-md shadow-terracotta/20">Call</a>
          <a href="#delivery" className="text-center py-2.5 font-serif font-bold text-xs tracking-tight text-parchment/90 hover:text-gold transition-colors duration-300">Order</a>
        </div>
      </div>
    </>
  )
}

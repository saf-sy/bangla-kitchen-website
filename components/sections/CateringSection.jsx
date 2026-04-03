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
import {
  getContactTopWaveClipPolygonRem,
  getRiverWaveFillCapPathDForVariant,
  getSectionBottomClipPolygonRem,
  getSectionTopWaveClipPolygonRem,
} from '@/lib/riverWave'
import {
  mergeRickshawTuning,
  readRickshawTuningFromStorage,
  RICKSHAW_TUNING_DEFAULTS,
} from '@/lib/rickshawTuning'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'
import RickshawKnockoutFilter from '@/components/rickshaw/RickshawKnockoutFilter'
import RickshawTunerPanel from '@/components/rickshaw/RickshawTunerPanel'
import { contacts, deliveryPlatforms } from '@/app/data/siteContent'

/** Match navbar / former footer: scale logo art inside the circle. */
const FOOTER_LOGO_INNER_SCALE = 1.14

const PARCHMENT_FILL = '#FBF7E9'
const ESPRESSO_FILL = '#2B1E16'

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

const RICKSHAW_FILTER_ID = 'rickshaw-knockout-tunable'

function scrubRickshawVideoFromX(video, latest, travelStart, travelEnd) {
  if (!video) return
  const d = video.duration
  if (!Number.isFinite(d) || d <= 0) return
  const n =
    typeof latest === 'number'
      ? latest
      : parseFloat(String(latest).replace('%', ''))
  if (!Number.isFinite(n)) return
  const span = travelEnd - travelStart
  if (span <= 0) return
  const p = Math.min(1, Math.max(0, (n - travelStart) / span))
  video.pause()
  const t = p * d
  if (Math.abs(video.currentTime - t) > 1 / 60) {
    try {
      video.currentTime = t
    } catch {
      /* seek before buffer ready */
    }
  }
}

export default function CateringSection() {
  const [footerLogoError, setFooterLogoError] = useState(false)
  const dividerCapRem = useRiverDividerCapRem()
  const deliveryTopClipPath = useMemo(
    () => getSectionTopWaveClipPolygonRem(dividerCapRem, 'swell'),
    [dividerCapRem],
  )
  const cateringBottomClipPath = useMemo(
    () => getSectionBottomClipPolygonRem(dividerCapRem, 'classic'),
    [dividerCapRem],
  )
  const contactClipPath = useMemo(
    () => getContactTopWaveClipPolygonRem(dividerCapRem),
    [dividerCapRem],
  )
  const swellWaveFillD = useMemo(() => getRiverWaveFillCapPathDForVariant('swell', 60, 96), [])
  const classicWaveFillD = useMemo(() => getRiverWaveFillCapPathDForVariant('classic', 60, 96), [])
  const deliveryClipStyle = useMemo(
    () => ({
      isolation: 'isolate',
      WebkitClipPath: deliveryTopClipPath,
      clipPath: deliveryTopClipPath,
    }),
    [deliveryTopClipPath],
  )
  const cateringClipStyle = useMemo(
    () => ({
      isolation: 'isolate',
      WebkitClipPath: cateringBottomClipPath,
      clipPath: cateringBottomClipPath,
    }),
    [cateringBottomClipPath],
  )
  const contactClipStyle = useMemo(
    () => ({
      isolation: 'isolate',
      WebkitClipPath: contactClipPath,
      clipPath: contactClipPath,
    }),
    [contactClipPath],
  )
  const [rickshawTuning, setRickshawTuning] = useState(() => mergeRickshawTuning())
  const prefersReducedMotion = useReducedMotion()
  const rickshawRowRef = useRef(null)
  const rickshawVideoRef = useRef(null)
  const rickshawAnimRef = useRef(null)
  const rickshawX = useMotionValue(`${RICKSHAW_TUNING_DEFAULTS.travelStartPercent}%`)
  const rickshawInView = useInView(rickshawRowRef, { once: true, amount: 0.22 })
  const rickshawTuningRef = useRef(rickshawTuning)
  rickshawTuningRef.current = rickshawTuning

  useEffect(() => {
    const t = readRickshawTuningFromStorage()
    setRickshawTuning(t)
    rickshawX.set(`${t.travelStartPercent}%`)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once on mount; rickshawX is stable
  }, [])

  useMotionValueEvent(rickshawX, 'change', (latest) => {
    const t = rickshawTuningRef.current
    scrubRickshawVideoFromX(rickshawVideoRef.current, latest, t.travelStartPercent, t.travelEndPercent)
  })

  const {
    travelStartPercent: rsStart,
    travelEndPercent: rsEnd,
    travelDurationSec: rsDuration,
  } = rickshawTuning

  useEffect(() => {
    rickshawAnimRef.current?.stop()
    rickshawAnimRef.current = null

    const startPct = `${rsStart}%`
    const endPct = `${rsEnd}%`

    if (!rickshawInView) {
      rickshawX.set(startPct)
      return
    }

    if (prefersReducedMotion) {
      rickshawX.set('0%')
      return
    }

    rickshawX.set(startPct)
    const v = rickshawVideoRef.current
    if (v && v.readyState >= 1) {
      try {
        v.currentTime = 0
      } catch {
        /* not seekable yet */
      }
    }

    rickshawAnimRef.current = animate(rickshawX, endPct, {
      duration: rsDuration,
      ease: [0, 0, 0.2, 1],
    })

    return () => {
      rickshawAnimRef.current?.stop()
      rickshawAnimRef.current = null
    }
  }, [rickshawInView, prefersReducedMotion, rickshawX, rsStart, rsEnd, rsDuration])

  return (
    <>
      <div className="relative -mt-[calc(2.75rem+2px)] md:-mt-[calc(3.75rem+2px)] z-[1] bg-parchment">
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
        <section
          id="delivery"
          className="bg-parchment py-32 md:py-40 relative overflow-x-clip overflow-y-visible z-[1]"
          style={deliveryClipStyle}
        >
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
                className={`group block bg-polaroid border border-espresso/8 p-8 md:p-10 shadow-lg shadow-espresso/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${platform.className}`}
              >
                <div className="mb-4">
                  <DeliveryPlatformIcon icon={platform.icon} name={platform.name} />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold mb-3 group-hover:text-terracotta transition-colors tracking-tight">{platform.name}</h3>
                <p className="text-espresso/50 mb-5">{platform.description}</p>
                <span className="inline-flex items-center gap-1.5 text-terracotta font-bold text-sm tracking-wide">Order Now <ExternalLink size={14} /></span>
              </a>
            ))}
          </div>

          <div
            ref={rickshawRowRef}
            className="relative isolate z-[2] mt-10 min-h-[11rem] overflow-x-clip overflow-y-visible bg-parchment pb-2 pt-5 md:min-h-[15rem] md:pt-7 pointer-events-none text-espresso"
          >
            <RickshawKnockoutFilter
              key={rickshawTuning.outlineDilateRadius}
              dilateRadius={rickshawTuning.outlineDilateRadius}
              filterId={RICKSHAW_FILTER_ID}
            />
            <div className="absolute inset-x-0 bottom-2 border-b border-dashed border-espresso/45" />
            <motion.div
              className="absolute bottom-0 left-0 will-change-transform"
              style={{ x: rickshawX }}
              aria-hidden="true"
            >
              <div
                className="isolate h-[12.5rem] w-max overflow-hidden md:h-[16.5rem] [clip-path:inset(0_32px_0_20px)] [-webkit-clip-path:inset(0_32px_0_20px)] md:[clip-path:inset(0_40px_0_22px)] md:[-webkit-clip-path:inset(0_40px_0_22px)]"
              >
                <video
                  ref={rickshawVideoRef}
                  className="pointer-events-none h-full w-auto min-w-[280px] max-w-none origin-left scale-[1.04] md:scale-[1.08]"
                  style={{
                    filter: `url(#${RICKSHAW_FILTER_ID}) contrast(1.38) brightness(0.94)`,
                  }}
                  src="/textures/rickshaw-driving-transparent.mp4"
                  width={360}
                  height={160}
                  muted
                  playsInline
                  preload="auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
        </section>
      </div>

      <section
        id="catering"
        className="py-32 md:py-44 relative overflow-x-clip overflow-y-visible mb-[-1px]"
        style={cateringClipStyle}
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

      <div className="relative -mt-[calc(2.75rem+2px)] md:-mt-[calc(3.75rem+2px)] bg-espresso">
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
        <footer
          id="contact"
          className="bg-espresso text-parchment overflow-x-clip overflow-y-visible pt-0 pb-32 md:pb-24 relative"
          style={contactClipStyle}
        >
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,240,210,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-5xl mx-auto px-8 md:px-10 relative z-10 pt-12 md:pt-16">
          <div className="grid md:grid-cols-12 gap-8 md:gap-8 items-start">
            <div className="md:col-span-4">
              <div className="section-header-texture inline-block pr-2 mb-0">
                <p className="font-hand text-gold text-lg md:text-xl mb-0.5 -rotate-1">Visit Us</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-parchment tracking-tight leading-tight">
                  Come Say Hello
                </h2>
              </div>
            </div>
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-2">
                <RickshawPinIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                <h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Find Us</h3>
              </div>
              <p className="text-parchment/70 leading-snug tracking-[0.02em] text-sm">{contacts.address}</p>
              <a
                href={contacts.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-gold text-xs font-bold hover:underline"
              >
                Get Directions <ExternalLink size={11} />
              </a>
            </div>
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-2">
                <RickshawPhoneIcon className="w-3.5 h-3.5 text-gold shrink-0" />
                <h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Call Us</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <a
                    href={contacts.restaurantPhoneHref}
                    className="text-parchment/80 hover:text-gold transition-colors text-base font-semibold leading-none"
                  >
                    {contacts.restaurantPhone}
                  </a>
                  <p className="text-parchment/35 text-[10px] mt-0.5">Restaurant</p>
                </div>
                <div>
                  <a
                    href={contacts.cateringPhoneHref}
                    className="text-parchment/80 hover:text-gold transition-colors text-base font-semibold leading-none"
                  >
                    {contacts.cateringPhone}
                  </a>
                  <p className="text-parchment/35 text-[10px] mt-0.5">Catering</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-parchment/10">
                <div className="flex items-center gap-1.5 mb-1">
                  <RickshawClockIcon className="w-3 h-3 text-gold" />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-parchment/40 font-bold">Hours</span>
                </div>
                <p className="text-parchment/65 text-xs">
                  Daily · <span className="font-semibold text-parchment/85">11 AM — 10 PM</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-12 pt-8 border-t border-parchment/15">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
              <div>
                <p className="font-hand text-gold text-xl md:text-2xl leading-tight">বাংলাদেশ থেকে ভালোবাসায়</p>
                <p className="font-serif italic text-parchment/40 text-sm mt-0.5 tracking-[0.02em]">
                  From Bangladesh, with love.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                <div className="flex items-start gap-3">
                  {!footerLogoError ? (
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gold/40 bg-parchment/10 p-0.5 shadow-md shadow-black/15 sm:h-12 sm:w-12 sm:p-1">
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
                    <p className="font-serif text-base md:text-lg font-bold text-parchment tracking-tight leading-tight">
                      Bangla Kitchen &amp; Sweets
                    </p>
                    <p className="text-parchment/40 text-xs mt-0.5 leading-snug tracking-wide">
                      Home-style Bangladeshi food in Sugar Land, TX.
                    </p>
                  </div>
                </div>
                <nav
                  className="flex flex-wrap gap-x-5 gap-y-1.5 sm:justify-end"
                  aria-label="Quick links"
                >
                  {['Menu', 'Delivery', 'Catering', 'Contact'].map((l) => (
                    <a
                      key={l}
                      href={`#${l.toLowerCase()}`}
                      className="text-parchment/45 hover:text-gold font-semibold transition-colors text-xs"
                    >
                      {l}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
            <p className="mt-6 pt-5 border-t border-parchment/10 text-[10px] text-parchment/30 tracking-[0.08em]">
              © {new Date().getFullYear()} Bangla Kitchen &amp; Sweets. All rights reserved.
            </p>
          </div>
        </div>
        </footer>
      </div>

      <RickshawTunerPanel tuning={rickshawTuning} setTuning={setRickshawTuning} />

      <div className="fixed bottom-0 left-3 right-3 z-[10050] pb-3 md:hidden">
        <div className="grid grid-cols-3 gap-2 p-2 bg-parchment/95 backdrop-blur-md border border-gold/25 rounded-full shadow-xl shadow-espresso/15">
          <a href="#menu" className="text-center py-2.5 rounded-full font-bold text-sm text-espresso bg-white/80">Menu</a>
          <a href={contacts.restaurantPhoneHref} className="text-center py-2.5 rounded-full font-bold text-sm text-white bg-terracotta shadow-md shadow-terracotta/20">Call</a>
          <a href="#delivery" className="text-center py-2.5 rounded-full font-bold text-sm text-espresso bg-white/80">Order</a>
        </div>
      </div>
    </>
  )
}

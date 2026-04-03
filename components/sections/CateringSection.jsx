'use client'

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
import { getContactTopWaveClipPolygonRem } from '@/lib/riverWave'
import { contacts, deliveryPlatforms } from '@/app/data/siteContent'

/* Brand marks from Simple Icons (MIT) — files in /public/images/ */
function DeliveryPlatformIcon({ icon, name }) {
  const badgeBase =
    'inline-flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-espresso/10'

  if (icon === 'ubereats') {
    return (
      <span className={`${badgeBase} h-11 w-11`} aria-hidden="true">
        <img
          src="/images/ubereats-icon.svg"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
          loading="lazy"
          decoding="async"
        />
      </span>
    )
  }

  if (icon === 'doordash') {
    return (
      <span className={`${badgeBase} h-11 w-11`} aria-hidden="true">
        <img
          src="/images/doordash-icon.svg"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
          loading="lazy"
          decoding="async"
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

const RICKSHAW_TRAVEL_S = 5.2
const RICKSHAW_X_START = -115
const RICKSHAW_X_END = 115
const RICKSHAW_X_START_PCT = `${RICKSHAW_X_START}%`
const RICKSHAW_X_END_PCT = `${RICKSHAW_X_END}%`
const RICKSHAW_X_SPAN = RICKSHAW_X_END - RICKSHAW_X_START

function scrubRickshawVideoFromX(video, latest) {
  if (!video) return
  const d = video.duration
  if (!Number.isFinite(d) || d <= 0) return
  const n =
    typeof latest === 'number'
      ? latest
      : parseFloat(String(latest).replace('%', ''))
  if (!Number.isFinite(n)) return
  const p = Math.min(1, Math.max(0, (n - RICKSHAW_X_START) / RICKSHAW_X_SPAN))
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

function useRiverDividerCapRem() {
  const [capRem, setCapRem] = useState(2.75)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => setCapRem(mq.matches ? 3.75 : 2.75)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return capRem
}

export default function CateringSection() {
  const contactClipRem = useRiverDividerCapRem()
  const contactClipPath = useMemo(
    () => getContactTopWaveClipPolygonRem(contactClipRem),
    [contactClipRem]
  )
  const prefersReducedMotion = useReducedMotion()
  const rickshawRowRef = useRef(null)
  const rickshawVideoRef = useRef(null)
  const rickshawAnimRef = useRef(null)
  const rickshawX = useMotionValue(RICKSHAW_X_START_PCT)
  const rickshawInView = useInView(rickshawRowRef, { once: true, amount: 0.22 })

  useMotionValueEvent(rickshawX, 'change', (latest) => {
    scrubRickshawVideoFromX(rickshawVideoRef.current, latest)
  })

  useEffect(() => {
    rickshawAnimRef.current?.stop()
    rickshawAnimRef.current = null

    if (!rickshawInView) {
      rickshawX.set(RICKSHAW_X_START_PCT)
      return
    }

    if (prefersReducedMotion) {
      rickshawX.set('0%')
      return
    }

    rickshawX.set(RICKSHAW_X_START_PCT)
    const v = rickshawVideoRef.current
    if (v && v.readyState >= 1) {
      try {
        v.currentTime = 0
      } catch {
        /* not seekable yet */
      }
    }

    rickshawAnimRef.current = animate(rickshawX, RICKSHAW_X_END_PCT, {
      duration: RICKSHAW_TRAVEL_S,
      ease: [0, 0, 0.2, 1],
    })

    return () => {
      rickshawAnimRef.current?.stop()
      rickshawAnimRef.current = null
    }
  }, [rickshawInView, prefersReducedMotion, rickshawX])

  return (
    <>
      <section id="delivery" className="bg-parchment py-32 md:py-40 relative z-[1] overflow-x-hidden">
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
                rel="noreferrer"
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
            className="relative isolate z-[2] mt-10 min-h-[11rem] overflow-visible bg-parchment pb-2 pt-5 md:min-h-[15rem] md:pt-7 pointer-events-none text-espresso"
          >
            <div className="absolute inset-x-0 bottom-2 border-b-2 border-dashed border-espresso/55" />
            <motion.div
              className="absolute bottom-0 left-0 will-change-transform"
              style={{ x: rickshawX }}
              aria-hidden="true"
            >
              <div
                className="isolate h-[12.5rem] w-max overflow-hidden md:h-[16.5rem] [clip-path:inset(0_28px_0_16px)] [-webkit-clip-path:inset(0_28px_0_16px)] md:[clip-path:inset(0_36px_0_18px)] md:[-webkit-clip-path:inset(0_36px_0_18px)]"
              >
                <video
                  ref={rickshawVideoRef}
                  className="pointer-events-none h-full w-auto min-w-[320px] max-w-none origin-left scale-[1.14] md:scale-[1.18]"
                  style={{
                    filter:
                      'url(#rickshaw-knockout-white) contrast(1.48) brightness(0.92) drop-shadow(0 0 1px rgba(43,30,22,0.42)) drop-shadow(0 0 0.5px rgba(43,30,22,0.35))',
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

      <section id="catering" className="py-32 md:py-44 relative overflow-hidden">
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

      <div className="relative -mt-[calc(2.75rem+1px)] md:-mt-[calc(3.75rem+1px)]">
        <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 text-[0] leading-[0]">
          <RiverDivider flush />
        </div>
        <section
          id="contact"
          className="bg-espresso text-parchment overflow-x-clip overflow-y-visible pt-0 pb-32 md:pb-44 relative"
          style={{
            WebkitClipPath: contactClipPath,
            clipPath: contactClipPath,
          }}
        >
        <div
          className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,240,210,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="max-w-5xl mx-auto px-8 md:px-10 relative z-10 pt-20 md:pt-24">
          <div className="grid md:grid-cols-12 gap-12 md:gap-14 items-start">
            <div className="md:col-span-5">
              <div className="section-header-texture inline-block pr-3 mb-4">
                <p className="font-hand text-gold text-xl mb-1 -rotate-1">Visit Us</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-parchment tracking-tight">Come<br />Say Hello</h2>
              </div>
            </div>
            <div className="md:col-span-7 grid sm:grid-cols-2 gap-8 md:mt-4">
              <div>
                <div className="flex items-center gap-2 mb-3"><RickshawPinIcon className="w-4 h-4 text-gold" /><h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Find Us</h3></div>
                <p className="text-parchment/70 leading-[1.72] tracking-[0.02em] text-sm">{contacts.address}</p>
                <a href={contacts.mapHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-3 text-gold text-sm font-bold hover:underline">Get Directions <ExternalLink size={12} /></a>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3"><RickshawPhoneIcon className="w-4 h-4 text-gold" /><h3 className="font-bold text-[10px] uppercase tracking-[0.18em] text-parchment/50">Call Us</h3></div>
                <a href={contacts.restaurantPhoneHref} className="block text-parchment/75 hover:text-gold transition-colors text-lg font-semibold">{contacts.restaurantPhone}</a>
                <p className="text-parchment/30 text-xs mt-1">Restaurant</p>
                <a href={contacts.cateringPhoneHref} className="block text-parchment/75 hover:text-gold transition-colors text-lg font-semibold mt-3">{contacts.cateringPhone}</a>
                <p className="text-parchment/30 text-xs mt-1">Catering</p>
                <div className="mt-6 pt-4 border-t border-parchment/10">
                  <div className="flex items-center gap-2 mb-2"><RickshawClockIcon className="w-3.5 h-3.5 text-gold" /><span className="text-[10px] uppercase tracking-[0.18em] text-parchment/40 font-bold">Hours</span></div>
                  <p className="text-parchment/70 text-sm">Open Daily · <span className="font-semibold text-parchment/90">11 AM — 10 PM</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </section>
      </div>
    </>
  )
}

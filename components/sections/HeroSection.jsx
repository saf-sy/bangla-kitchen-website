'use client'

import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import { RiverDivider, SmartFoodImage, VintageStamp } from '@/components/art/Decoratives'
import { contacts } from '@/app/data/siteContent'
import { getHeroRiverClipPolygon, getHeroRiverMaskSvgDataUri, getSectionBottomClipPolygonRem } from '@/lib/riverWave'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'

const HERO_MARQUEE_PHRASE =
  'AUTHENTIC BANGLADESHI SOUL FOOD • EST. IN HOUSTON • FAMILY RECIPES • HANDCRAFTED MISHTI • 100% HALAL •'

function HeroMarqueeStrip() {
  return (
    <>
      <p className="sr-only">
        Authentic Bangladeshi soul food, established in Houston, family recipes, handcrafted mishti, one hundred
        percent halal.
      </p>
      <div
        className="relative z-10 mt-10 w-screen left-1/2 -translate-x-1/2 overflow-hidden border-y border-gold/15 bg-espresso py-3 md:py-3.5 lg:mt-14"
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

export default function HeroSection() {
  const dividerCapRem = useRiverDividerCapRem()
  const heroRiverMaskUrl = useMemo(() => getHeroRiverMaskSvgDataUri(), [])
  const heroRiverClip = useMemo(() => getHeroRiverClipPolygon(), [])
  const heroSectionClip = useMemo(
    () => getSectionBottomClipPolygonRem(dividerCapRem, 'classic'),
    [dividerCapRem],
  )

  const heroBtnClass =
    'inline-flex h-14 flex-1 min-w-0 items-center justify-center gap-2 px-4 sm:px-6 text-sm sm:text-base font-bold tracking-wide transition-all duration-300'

  return (
    <section
      className="hero-vintage-map relative pt-40 md:pt-48 pb-0 mb-[-1px]"
      style={{
        isolation: 'isolate',
        overflowX: 'clip',
        overflowY: 'visible',
        WebkitClipPath: heroSectionClip,
        clipPath: heroSectionClip,
      }}
    >
      <span className="hero-dhaka-watermark select-none" aria-hidden="true">
        ঢাকা
      </span>
      <div className="hero-scrapbook-overlay" aria-hidden="true" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 10% 30%, rgba(212,175,55,0.18), transparent 45%), radial-gradient(ellipse at 70% 5%, rgba(139,26,26,0.08), transparent 35%)',
        }}
      />
      <div className="max-w-[90rem] mx-auto px-8 md:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-stretch gap-10 lg:gap-14 xl:gap-16">
          <div className="lg:pr-4 xl:pr-8">
            <p className="font-hand text-terracotta text-2xl md:text-3xl mb-1 -rotate-2 origin-left">A Taste of Dhaka</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-espresso/40 font-semibold mb-5 ml-1">
              সবাইকে স্বাগতম — All Welcome
            </p>
            <h1 className="font-serif text-6xl md:text-7xl lg:text-[5.25rem] xl:text-[6rem] font-black leading-[0.85] tracking-tighter text-espresso mb-8">
              Bangla<br />Kitchen<br /><span className="text-terracotta">&amp; Sweets</span>
            </h1>
            <p className="font-serif text-lg md:text-xl italic text-espresso/60 max-w-md mb-8 leading-relaxed">
              The food we grew up on. Now yours.
            </p>
            <div className="flex flex-row flex-nowrap items-stretch gap-3 sm:gap-4 mb-2 max-w-xl">
              <a
                href="#menu"
                className={`${heroBtnClass} bg-terracotta text-white shadow-lg shadow-terracotta/25 hover:shadow-xl hover:shadow-terracotta/35 hover:-translate-y-0.5`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}
              >
                <span className="truncate sm:whitespace-normal">See the Menu</span>
                <ChevronRight size={18} className="shrink-0" aria-hidden />
              </a>
              <a
                href={contacts.restaurantPhoneHref}
                className={`${heroBtnClass} border-2 border-espresso/15 text-espresso hover:bg-espresso/5`}
              >
                Call Us
              </a>
            </div>
          </div>

          <div className="relative flex flex-col items-center overflow-visible lg:self-stretch lg:items-end lg:justify-end">
            <div className="relative w-full max-w-[min(100%,520px)] lg:max-w-none lg:w-full">
              <div
                className="hero-food-frame hero-food-frame--wave-mask mughal-arch mughal-frame relative shadow-2xl shadow-espresso/25 min-h-[380px] h-[min(52vh,480px)] sm:min-h-[420px] sm:h-[min(58vh,520px)] md:h-[min(64vh,600px)] lg:h-[min(72vh,680px)] xl:h-[min(78vh,760px)]"
                style={{
                  WebkitMaskImage: heroRiverMaskUrl,
                  maskImage: heroRiverMaskUrl,
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitClipPath: heroRiverClip,
                  clipPath: heroRiverClip,
                }}
              >
                <SmartFoodImage
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"
                  alt="Dhakaiya Kacchi Biryani — Bangla Kitchen signature dish"
                  fill
                  sizes="(max-width: 1024px) min(100vw, 520px) 50vw"
                  className="object-cover object-bottom"
                  priority
                />
              </div>
              <div className="absolute z-20 left-[2%] bottom-0 md:left-0 lg:left-2 xl:left-4 drop-shadow-lg">
                <VintageStamp />
              </div>
            </div>
          </div>
        </div>
      </div>

      <HeroMarqueeStrip />

      <div className="text-[0] leading-[0] -mt-px relative z-[2]" aria-hidden="true">
        <RiverDivider flush />
      </div>
    </section>
  )
}

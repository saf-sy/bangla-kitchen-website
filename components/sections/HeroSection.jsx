'use client'

import { ChevronRight } from 'lucide-react'
import { RiverDivider, SmartFoodImage, VintageStamp, FloralMotif, SpiceMotif } from '@/components/art/Decoratives'
import { contacts } from '@/app/data/siteContent'

export default function HeroSection() {
  const heroBtnClass =
    'inline-flex h-14 flex-1 min-w-0 items-center justify-center gap-2 px-4 sm:px-6 text-sm sm:text-base font-bold tracking-wide transition-all duration-300'

  return (
    <section className="hero-vintage-map relative overflow-x-visible overflow-y-visible pt-40 md:pt-48 pb-0 mb-[-1px]">
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
      <div className="relative z-10 mx-auto max-w-[90rem] overflow-x-clip px-8 md:px-10 lg:px-12">
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
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mb-2 max-w-xl">
              <a
                href="#menu"
                className={`${heroBtnClass} bg-terracotta text-white shadow-lg shadow-terracotta/25 hover:shadow-xl hover:shadow-terracotta/35 hover:-translate-y-0.5`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}
              >
                <span>See the Menu</span>
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

          <div className="relative flex flex-col items-center justify-center lg:items-end lg:justify-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-[min(100%,480px)] lg:max-w-[460px] mx-auto lg:mx-0">
              
              {/* Offset Decorative Background Frame */}
              <div 
                className="absolute inset-0 translate-x-3 translate-y-4 md:translate-x-6 md:translate-y-6 rounded-2xl border border-gold/60 bg-parchment/40 backdrop-blur-sm" 
                aria-hidden="true" 
              />
              
              {/* Traditional Motifs */}
              <FloralMotif 
                className="absolute -top-10 -right-8 w-24 h-24 md:w-32 md:h-32 rotate-[15deg] opacity-60 z-0 origin-center text-espresso pointer-events-none" 
              />
              <SpiceMotif 
                className="absolute -bottom-10 -right-4 w-20 h-20 md:w-28 md:h-28 rotate-[-20deg] opacity-40 z-0 origin-center text-terracotta pointer-events-none" 
              />

              {/* The Main Image */}
              <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl shadow-espresso/40 ring-1 ring-espresso/10 aspect-[4/5] w-full">
                <SmartFoodImage
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80"
                  alt="Dhakaiya Kacchi Biryani — Bangla Kitchen signature dish"
                  fill
                  sizes="(max-width: 1024px) min(100vw, 520px) 50vw"
                  className="object-cover object-bottom"
                  priority
                />
              </div>

              {/* The Vintage Badge */}
              <div className="absolute z-20 top-10 -left-6 md:top-16 md:-left-12 drop-shadow-2xl hover:-rotate-6 hover:scale-105 transition-all duration-500 origin-center">
                <VintageStamp />
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}

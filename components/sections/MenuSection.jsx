'use client'

import { useMemo, useState } from 'react'
import {
  BengaliWatermark,
  FloralMotif,
  JamdaniPattern,
  RiverWaveTopCap,
  SpiceMotif,
} from '@/components/art/Decoratives'
import { categories, menuData } from '@/app/data/siteContent'
import { getSectionBottomClipPolygonRem } from '@/lib/riverWave'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('Appetizers')
  const dividerCapRem = useRiverDividerCapRem()
  const menuBottomClip = useMemo(
    () => getSectionBottomClipPolygonRem(dividerCapRem, 'swell'),
    [dividerCapRem],
  )

  return (
    <section
      id="menu"
      className="menu-ledger-bg menu-with-river-cap bg-parchment relative overflow-x-clip overflow-y-visible pb-32 md:pb-44 pt-0 -mt-[calc(2.75rem+2px)] md:-mt-[calc(3.75rem+2px)] mb-[-1px]"
      style={{
        isolation: 'isolate',
        WebkitClipPath: menuBottomClip,
        clipPath: menuBottomClip,
      }}
    >
      <div
        className="relative z-[4] w-full text-[0] leading-[0] pointer-events-none -mb-0.5 md:-mb-[3px]"
        aria-hidden="true"
      >
        <RiverWaveTopCap />
      </div>
      <JamdaniPattern id="jamdani-menu" />
      <BengaliWatermark text="মেনু" className="top-10 right-[8%] rotate-6" />
      <SpiceMotif className="w-32 h-32 top-16 right-[6%] rotate-12 hidden lg:block" />
      <FloralMotif className="w-28 h-28 bottom-28 left-[3%] -rotate-6 hidden md:block" />

      <div className="max-w-5xl mx-auto px-8 md:px-10 relative z-10 pt-20 md:pt-24">
        <div className="section-header-texture inline-block pr-3 mb-4">
          <p className="font-hand text-terracotta text-xl mb-1 -rotate-1 origin-left">The Menu</p>
          <h2 className="font-serif text-5xl md:text-6xl font-bold tracking-tight">What We Serve</h2>
        </div>
        <p className="text-espresso/55 max-w-lg mb-12 leading-[1.75] tracking-[0.015em]">
          Street stalls. Home kitchens. Celebrations. Sweetshops. The food of all Bangladesh, under one roof.
        </p>

        <div className="flex flex-wrap gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`menu-category-tab px-5 py-2.5 text-sm font-bold rounded-[2px] outline-none transition-[color,background-color,border-color] duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta/60 ${
                activeCategory === cat
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'bg-transparent text-espresso/55 hover:border-espresso/30 hover:bg-[rgba(43,30,22,0.05)] hover:text-espresso'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-polaroid border-2 border-espresso/8 p-9 md:p-14 shadow-xl shadow-espresso/5 relative overflow-hidden">
          <div className="absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2 border-gold/40" />
          <div className="absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 border-gold/40" />
          <div className="absolute bottom-3 left-3 w-16 h-16 border-b-2 border-l-2 border-gold/40" />
          <div className="absolute bottom-3 right-3 w-16 h-16 border-b-2 border-r-2 border-gold/40" />

          <h3 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-espresso tracking-tight">{activeCategory}</h3>
          <ul className="space-y-0">
            {menuData[activeCategory].map((item, idx) => (
              <li
                key={item.name}
                className={`menu-row flex items-start py-4 border-b border-dashed border-espresso/12 last:border-0 group ${idx % 2 === 1 ? 'menu-row--alt' : ''}`}
              >
                <div className="basis-[56%] min-w-0 pr-3">
                  <span className="ink-bleed font-semibold text-espresso group-hover:text-terracotta transition-colors">{item.name}</span>
                  {item.desc && <span className="block text-sm text-espresso/40 mt-0.5 italic">{item.desc}</span>}
                  {item.note && <span className="inline-block ml-2 font-hand text-terracotta text-sm">— {item.note}</span>}
                </div>
                <span className="menu-leader mt-2.5" />
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="menu-item-price flex-shrink-0 font-serif font-bold text-terracotta text-lg leading-none">
                    {item.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

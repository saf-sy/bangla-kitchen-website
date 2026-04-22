'use client'

import { useState } from 'react'
import {
  BengaliWatermark,
  FloralMotif,
  JamdaniPattern,
  RiverDivider,
  SpiceMotif,
} from '@/components/art/Decoratives'
import { categories, menuData } from '@/app/data/siteContent'
import RiverWaveSectionClip from '@/components/art/RiverWaveSectionClip'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState('Appetizers')
  const dividerCapRem = useRiverDividerCapRem()
  const capScale = dividerCapRem / 2.75

  return (
    <RiverWaveSectionClip
      as="section"
      id="menu"
      edge="top"
      variant="swell"
      capScale={capScale}
      className="menu-ledger-bg menu-with-river-cap relative isolate mb-[-1px] -mt-[calc(2.75rem+2px)] overflow-x-hidden overflow-y-visible bg-parchment pb-32 md:pb-44 pt-0 md:-mt-[calc(3.75rem+2px)]"
    >
      <div
        className="absolute top-0 left-0 right-0 z-[19] w-full text-[0] leading-[0] pointer-events-none"
        aria-hidden="true"
      >
        <RiverDivider variant="swell" flush />
      </div>
      <JamdaniPattern id="jamdani-menu" />
      <BengaliWatermark text="মেনু" className="top-10 right-[8%] rotate-6" />
      <SpiceMotif className="w-32 h-32 top-16 right-[6%] rotate-12 hidden lg:block" />
      <FloralMotif className="w-28 h-28 bottom-28 left-[3%] -rotate-6 hidden md:block" />

      <div className="max-w-5xl mx-auto px-8 md:px-10 relative z-10 pt-20 md:pt-24">
        <div className="section-header-texture inline-block pr-3 mb-4">
          <p className="font-hand text-terracotta text-xl mb-1 -rotate-1 origin-left">The Menu</p>
          <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">What We Serve</h2>
        </div>
        <p className="text-espresso/55 max-w-lg mb-12 leading-[1.75] tracking-[0.015em]">
          Street stalls. Home kitchens. Celebrations. Sweetshops. The food of all Bangladesh, under one roof.
        </p>

        <div className="flex flex-wrap gap-2 md:gap-3 mb-10 md:mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`menu-category-tab px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold rounded-[2px] outline-none transition-[color,background-color,border-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta/60 ${
                activeCategory === cat
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'bg-transparent text-espresso/55 hover:border-espresso/30 hover:bg-[rgba(43,30,22,0.05)] hover:text-espresso'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-polaroid border-2 border-espresso/8 p-5 md:p-14 shadow-xl shadow-espresso/5 relative overflow-hidden">
          <div className="absolute top-3 left-3 w-16 h-16 border-t-2 border-l-2 border-gold/40" />
          <div className="absolute top-3 right-3 w-16 h-16 border-t-2 border-r-2 border-gold/40" />
          <div className="absolute bottom-3 left-3 w-16 h-16 border-b-2 border-l-2 border-gold/40" />
          <div className="absolute bottom-3 right-3 w-16 h-16 border-b-2 border-r-2 border-gold/40" />

          <h3 className="font-serif text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-espresso tracking-tight">{activeCategory}</h3>
          <ul className="space-y-0">
            {menuData[activeCategory].map((item, idx) => (
              <li
                key={item.name}
                className={`menu-row flex flex-col py-4 px-2 border-b border-dashed border-espresso/12 last:border-0 group ${idx % 2 === 1 ? 'menu-row--alt' : ''}`}
              >
                <div className="menu-item-heading">
                  <div className="menu-item-name-block">
                    <span className="ink-bleed font-semibold text-espresso group-hover:text-terracotta transition-colors duration-300 ease-out text-base md:text-lg tracking-tight">
                      {item.name}
                    </span>
                    {item.note && <span className="inline-block ml-2 font-hand text-terracotta text-sm normal-case font-normal">— {item.note}</span>}
                  </div>
                  
                  <span className="menu-leader" aria-hidden="true" />
                  
                  <span className="menu-item-price font-serif font-bold text-terracotta text-base md:text-xl leading-none">
                    {item.price}
                  </span>
                </div>
                
                {item.desc && (
                  <span className="block text-xs md:text-[0.95rem] text-espresso/60 mt-1 md:mt-1.5 italic pr-4 md:pr-24 leading-relaxed">
                    {item.desc}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RiverWaveSectionClip>
  )
}

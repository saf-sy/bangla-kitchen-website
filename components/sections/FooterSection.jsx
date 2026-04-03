'use client'

import { useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { RiverDivider } from '@/components/art/Decoratives'
import { contacts } from '@/app/data/siteContent'

/** Match navbar: scale logo art inside the circle (circle size unchanged). */
const FOOTER_LOGO_INNER_SCALE = 1.14

export default function FooterSection() {
  const [footerLogoError, setFooterLogoError] = useState(false)

  return (
    <>
      <footer className="bg-parchment border-t border-gold/15">
        <RiverDivider variant="ripple" flush />
        <div className="border-t border-gold/15">
          <div className="max-w-6xl mx-auto px-8 md:px-12 pt-14 md:pt-20 pb-20 md:pb-28">
          <p className="font-hand text-terracotta text-3xl md:text-4xl mb-1">বাংলাদেশ থেকে ভালোবাসায়</p>
          <p className="font-serif italic text-espresso/45 text-lg mb-16 tracking-[0.02em]">From Bangladesh, with love.</p>
          <div className="grid sm:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="sm:col-span-5 flex items-start gap-4">
              {!footerLogoError ? (
                <span className="mt-0.5 flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold/50 bg-parchment p-1 shadow-lg shadow-espresso/12 sm:h-[4.75rem] sm:w-[4.75rem] sm:p-1.5">
                  <img
                    src="/textures/bangla-kitchen-logo.png"
                    alt="Bangla Kitchen"
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                    style={{ transform: `scale(${FOOTER_LOGO_INNER_SCALE})`, transformOrigin: 'center center' }}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFooterLogoError(true)}
                  />
                </span>
              ) : (
                <span className="mt-0.5 grid h-[4.25rem] w-[4.25rem] shrink-0 place-items-center rounded-full border-2 border-gold/50 bg-parchment font-serif font-bold text-terracotta sm:h-[4.75rem] sm:w-[4.75rem]">
                  BK
                </span>
              )}
              <div>
                <p className="font-serif text-2xl md:text-3xl font-bold text-espresso tracking-tight">Bangla Kitchen &amp; Sweets</p>
                <p className="text-espresso/45 text-sm mt-2 leading-relaxed tracking-[0.03em]">Home-style Bangladeshi food in Sugar Land, TX.</p>
              </div>
            </div>
            <div className="sm:col-span-3 flex flex-col gap-3">
              {['Menu', 'Delivery', 'Catering', 'Contact'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-espresso/50 hover:text-terracotta font-semibold transition-colors text-sm">
                  {l}
                </a>
              ))}
            </div>
            <div className="sm:col-span-4 space-y-3 text-sm leading-[1.72] tracking-[0.02em]">
              <a href={contacts.restaurantPhoneHref} className="inline-flex items-center gap-2 text-terracotta font-bold hover:underline">
                <Phone size={14} />
                <span>{contacts.restaurantPhone}</span>
              </a>
              <a href={contacts.mapHref} target="_blank" rel="noreferrer" className="flex items-start gap-2 text-espresso/45 hover:text-espresso transition-colors">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{contacts.address}</span>
              </a>
            </div>
          </div>
          <div className="mt-16 md:mt-20 pt-8 border-t border-espresso/10 text-xs text-espresso/35 tracking-[0.06em]">
            © {new Date().getFullYear()} Bangla Kitchen &amp; Sweets. All rights reserved.
          </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 left-3 right-3 z-40 pb-3 md:hidden">
        <div className="grid grid-cols-3 gap-2 p-2 bg-parchment/95 backdrop-blur-md border border-gold/25 rounded-full shadow-xl shadow-espresso/15">
          <a href="#menu" className="text-center py-2.5 rounded-full font-bold text-sm text-espresso bg-white/80">Menu</a>
          <a href={contacts.restaurantPhoneHref} className="text-center py-2.5 rounded-full font-bold text-sm text-white bg-terracotta shadow-md shadow-terracotta/20">Call</a>
          <a href="#delivery" className="text-center py-2.5 rounded-full font-bold text-sm text-espresso bg-white/80">Order</a>
        </div>
      </div>
    </>
  )
}

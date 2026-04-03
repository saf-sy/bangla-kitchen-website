'use client'

import { useState, useEffect } from 'react'
import { MapPin, Menu, Phone, X } from 'lucide-react'

const navLinks = [
  { href: '#menu', label: 'Menu' },
  { href: '#delivery', label: 'Delivery' },
  { href: '#catering', label: 'Catering' },
  { href: '#contact', label: 'Contact' },
]

/** Logo art inside the circle: `1` = default fit. Raise (e.g. 1.08–1.15) to enlarge; circle ring stays the same. */
const NAV_LOGO_INNER_SCALE = 1.1

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] overflow-x-hidden transition-all duration-500 ${
        scrolled
          ? 'bg-parchment/92 backdrop-blur-md shadow-lg shadow-espresso/5'
          : 'bg-transparent'
      }`}
    >
      {/* Top Strip */}
      <div className="bg-espresso text-parchment/90 text-xs tracking-wide overflow-x-hidden">
        <div className="max-w-6xl mx-auto min-w-0 px-8 md:px-10 py-2 flex items-center justify-between gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <MapPin size={12} className="text-gold/90" />
            <a
              href="https://www.google.com/maps/search/?api=1&query=11102+S+Texas+6+Suite+112,+Sugar+Land,+TX+77498"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
              aria-label="Open Bangla Kitchen address in Google Maps"
            >
              11102 S Texas 6 Suite 112, Sugarland, TX 77498
            </a>
          </span>
          <a
            href="tel:+12815309200"
            className="font-bold tracking-wider hover:text-gold transition-colors inline-flex items-center gap-1.5"
          >
            <Phone size={12} className="text-gold/90" />
            <span>(281) 530-9200</span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="max-w-6xl mx-auto min-w-0 px-6 py-4 flex items-center justify-between gap-3 overflow-x-hidden">
        <a href="#" className="flex min-w-0 shrink items-center gap-3 md:gap-4">
          {!logoError ? (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold/50 bg-parchment p-1 shadow-md shadow-espresso/10 md:h-16 md:w-16 md:p-1.5">
              <img
                src="/textures/bangla-kitchen-logo.png"
                alt="Bangla Kitchen & Sweets"
                width={96}
                height={96}
                className="h-full w-full object-contain"
                style={{ transform: `scale(${NAV_LOGO_INNER_SCALE})`, transformOrigin: 'center center' }}
                loading="eager"
                decoding="async"
                onError={() => setLogoError(true)}
              />
            </span>
          ) : (
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-gold/50 bg-parchment text-sm font-serif font-bold text-terracotta md:h-16 md:w-16 md:text-base">
              BK
            </span>
          )}
          <span className="font-serif text-xl md:text-2xl font-bold text-espresso tracking-tight truncate md:overflow-visible md:whitespace-normal min-w-0">
            Bangla Kitchen &amp; Sweets
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm font-semibold tracking-wide text-espresso/70 hover:text-espresso hover:bg-espresso/5 transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+12815309200"
            className="ml-3 px-5 py-2.5 rounded-full bg-terracotta text-white text-sm font-bold tracking-wide hover:bg-terracotta/90 transition-colors shadow-md shadow-terracotta/20"
          >
            Call Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg hover:bg-espresso/5 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-parchment/98 backdrop-blur-xl border-t border-gold/20 px-8 pb-6 pt-2 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-xl text-center font-semibold tracking-wide hover:bg-espresso/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+12815309200"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 rounded-xl text-center font-bold bg-terracotta text-white shadow-md"
          >
            Call Now
          </a>
        </div>
      )}
    </header>
  )
}

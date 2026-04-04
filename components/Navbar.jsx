'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { MapPin, Menu, Phone, X } from 'lucide-react'

const navLinks = [
  { href: '#menu', label: 'Menu' },
  { href: '#delivery', label: 'Delivery' },
  { href: '#catering', label: 'Catering' },
  { href: '#contact', label: 'Contact' },
]

const NAV_LOGO_INNER_SCALE = 1.2

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastScrollY.current
      const pastThreshold = y > 100

      setScrolled(y > 40)

      // Hide when scrolling down past threshold, show when scrolling up
      if (goingDown && pastThreshold) {
        setHidden(true)
      } else {
        setHidden(false)
      }

      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[10050] w-full max-w-[100vw] overflow-x-hidden transition-all duration-500 ease-out ${
        hidden && !open
          ? '-translate-y-full'
          : 'translate-y-0'
      } ${
        scrolled
          ? 'bg-parchment/95 backdrop-blur-md shadow-lg shadow-espresso/5'
          : 'bg-transparent'
      }`}
    >
      {/* Top Strip — collapses when scrolled */}
      <div className={`text-parchment/90 text-[11px] tracking-[0.06em] overflow-x-hidden transition-all duration-500 ease-out ${
        scrolled ? 'bg-espresso max-h-0 py-0 opacity-0' : 'bg-espresso/90 max-h-16 py-1.5 opacity-100'
      }`}>
        <div className="max-w-6xl mx-auto min-w-0 px-8 md:px-10 flex items-center justify-between gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <MapPin size={11} className="text-gold/80" />
            <a
              href="https://www.google.com/maps/search/?api=1&query=11102+S+Texas+6+Suite+112,+Sugar+Land,+TX+77498"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-300 ease-out"
              aria-label="Open Bangla Kitchen address in Google Maps"
            >
              11102 S Texas 6 Suite 112, Sugarland, TX 77498
            </a>
          </span>
          <a
            href="tel:+12815309200"
            className="font-semibold tracking-wider hover:text-gold transition-colors duration-300 ease-out inline-flex items-center gap-1.5"
          >
            <Phone size={11} className="text-gold/80" />
            <span>(281) 530-9200</span>
          </a>
        </div>
      </div>

      {/* Main Nav — shrinks when scrolled */}
      <nav className={`max-w-6xl mx-auto min-w-0 px-6 md:px-8 flex items-center justify-between gap-3 overflow-x-hidden transition-all duration-500 ease-out ${
        scrolled ? 'py-2' : 'py-3'
      }`}>
        <a href="#top" className="flex min-w-0 shrink items-center gap-3 md:gap-4 group">
          {!logoError ? (
            <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold/50 shadow-md shadow-espresso/10 transition-all duration-500 ease-out group-hover:shadow-lg group-hover:shadow-gold/10 ${
              scrolled ? 'h-10 w-10 md:h-11 md:w-11' : 'h-14 w-14 md:h-16 md:w-16'
            }`}>
              <Image
                src="/textures/bangla-kitchen-logo.png"
                alt="Bangla Kitchen & Sweets"
                width={128}
                height={128}
                sizes="128px"
                priority
                quality={100}
                className="h-full w-full object-contain"
                style={{ transform: `scale(${NAV_LOGO_INNER_SCALE})`, transformOrigin: 'center center' }}
                onError={() => setLogoError(true)}
              />
            </span>
          ) : (
            <span className={`grid shrink-0 place-items-center rounded-full border-2 border-gold/50 bg-parchment font-serif font-bold text-terracotta transition-all duration-500 ease-out ${
              scrolled ? 'h-10 w-10 text-xs' : 'h-14 w-14 md:h-16 md:w-16 text-sm md:text-base'
            }`}>
              BK
            </span>
          )}
          <span className={`font-serif font-bold text-espresso tracking-tight truncate md:overflow-visible md:whitespace-normal min-w-0 transition-all duration-500 ease-out ${
            scrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'
          }`}>
            Bangla Kitchen &amp; Sweets
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-[13px] font-serif font-bold tracking-tight text-espresso/55 hover:text-terracotta transition-colors duration-300 ease-out relative after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-terracotta/60 after:transition-all after:duration-300 hover:after:w-3/4"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+12815309200"
            className="ml-4 px-5 py-2 bg-terracotta text-white text-[13px] font-bold tracking-wide hover:bg-terracotta/85 transition-all duration-300 ease-out shadow-md shadow-terracotta/15 hover:shadow-lg hover:shadow-terracotta/20"
          >
            Call Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-espresso/70 hover:text-terracotta transition-colors duration-300 ease-out"
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {open && (
        <div className="md:hidden bg-parchment/98 backdrop-blur-xl border-t border-gold/20 px-8 pb-6 pt-3 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-center font-serif font-bold tracking-tight text-espresso/70 hover:text-terracotta transition-colors duration-300 ease-out border-b border-espresso/5 last:border-0"
            >
              {link.label}
            </a>
          ))}
          <a
            href="tel:+12815309200"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 mt-2 text-center font-bold bg-terracotta text-white shadow-md shadow-terracotta/15"
          >
            Call Now
          </a>
        </div>
      )}
    </header>
  )
}

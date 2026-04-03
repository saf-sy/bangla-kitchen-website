import { Playfair_Display, Inter, Caveat } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-hand',
  display: 'swap',
})

export const metadata = {
  title: 'Bangla Kitchen & Sweets | Authentic Bangladeshi Food in Houston',
  description:
    'Authentic Bangladeshi restaurant serving home-style Dhaka cooking, handcrafted mishti sweets, and family catering in Sugar Land, TX.',
  openGraph: {
    title: 'Bangla Kitchen & Sweets | Authentic Bangladeshi Food',
    description: 'Home-style Bangladeshi food from Old Dhaka recipes.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${caveat.variable}`}
    >
      <body className="bg-parchment text-espresso font-sans antialiased">
        {/*
          Defs-only SVG: keeps filter IDs in the document without a paintable viewport.
          Mixing these with the full-screen grain layer caused a stray box in some browsers.
        */}
        <svg
          className="defs-sprite pointer-events-none"
          aria-hidden="true"
          width="0"
          height="0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter
              id="rickshaw-knockout-white"
              colorInterpolationFilters="sRGB"
              x="-15%"
              y="-15%"
              width="130%"
              height="130%"
            >
              <feComponentTransfer in="SourceGraphic" result="crushed">
                <feFuncR type="linear" slope="1.28" intercept="-0.06" />
                <feFuncG type="linear" slope="1.28" intercept="-0.06" />
                <feFuncB type="linear" slope="1.28" intercept="-0.06" />
              </feComponentTransfer>
              <feColorMatrix
                in="crushed"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -0.2126 -0.7152 -0.0722 0 1"
                result="knockout"
              />
              <feComponentTransfer in="knockout" result="alphaLifted">
                <feFuncA type="linear" slope="3.45" intercept="-0.24" />
              </feComponentTransfer>
              <feMorphology
                in="alphaLifted"
                operator="dilate"
                radius="0.22"
                result="spread"
              />
              <feColorMatrix
                in="spread"
                type="matrix"
                values="0.5 0 0 0 0.18  0 0.44 0 0 0.12  0 0 0.38 0 0.1  0 0 0 1 0"
                result="inked"
              />
              <feComponentTransfer in="inked" result="rickshawFinal">
                <feFuncA type="linear" slope="1.04" intercept="-0.02" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        <svg
          className="film-grain"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <filter id="grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.75"
                numOctaves="4"
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#grain)" opacity="0.11" />
        </svg>

        {children}
      </body>
    </html>
  )
}

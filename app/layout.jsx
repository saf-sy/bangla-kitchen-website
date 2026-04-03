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

        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  )
}

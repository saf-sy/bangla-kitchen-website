'use client'

import { motion } from 'framer-motion'
import { BengaliWatermark, FloralMotif, JamdaniPattern, PolaroidPhoto, SpiceMotif } from '@/components/art/Decoratives'
import { foodImages } from '@/app/data/siteContent'

export default function StorySection() {
  return (
    <>
      <section className="relative py-32 md:py-44 overflow-hidden">
        <JamdaniPattern id="jamdani-story" />
        <BengaliWatermark text="বাংলা রান্না" className="top-16 right-[4%] rotate-3" />
        <SpiceMotif className="w-36 h-36 top-12 right-[8%] rotate-12 hidden lg:block" />
        <FloralMotif className="w-28 h-28 bottom-20 left-[5%] -rotate-6 hidden md:block" />

        <div className="max-w-6xl mx-auto px-8 md:px-10 relative z-10">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            <motion.blockquote
              className="md:col-span-5 border-l-4 border-gold pl-6 md:pl-8 md:mt-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-espresso/75">
                “By the end of your meal, we hope you will have tasted a little of Bangladesh — its rivers, its kitchens, its celebrations, and its heart.”
              </p>
            </motion.blockquote>
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="section-header-texture inline-block pr-3 mb-4">
                <p className="font-hand text-terracotta text-xl mb-1 -rotate-1 origin-left">Our Story</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">A Mother’s<br />Kitchen</h2>
              </div>
              <p className="text-espresso/60 leading-[1.75] tracking-[0.012em] mb-4 max-w-lg">
                Bangla Kitchen began the way all Bangladeshi kitchens begin — a mother cooking for her family.
              </p>
              <p className="text-espresso/60 leading-[1.75] tracking-[0.012em] mb-6 max-w-lg">
                We opened in Sugar Land to share that food — not a version of it, but the real thing.
              </p>
              <p className="font-hand text-xl text-terracotta -rotate-1">— The Bangla Kitchen Family</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative">
        <BengaliWatermark text="স্বাদ" className="top-20 left-[10%] -rotate-8" />
        <div className="max-w-5xl mx-auto px-8 md:px-10">
          <div className="section-header-texture inline-block pr-3 mb-10">
            <p className="font-hand text-terracotta text-xl mb-1 -rotate-1">From Our Table</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">A Taste of Home</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 md:gap-4 items-start">
            <div className="sm:col-span-5 sm:mt-8">
              <PolaroidPhoto {...foodImages[0]} />
            </div>
            <div className="sm:col-span-4 sm:-mt-4">
              <PolaroidPhoto {...foodImages[1]} />
            </div>
            <div className="sm:col-span-3 sm:mt-14">
              <PolaroidPhoto {...foodImages[2]} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

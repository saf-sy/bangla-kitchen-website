'use client'

import { motion } from 'framer-motion'
import { BengaliWatermark, FloralMotif, JamdaniPattern, PolaroidPhoto, SpiceMotif, RiverDivider } from '@/components/art/Decoratives'
import RiverWaveSectionClip from '@/components/art/RiverWaveSectionClip'
import { foodImages } from '@/app/data/siteContent'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'

export default function StorySection() {
  const dividerCapRem = useRiverDividerCapRem()
  const capScale = dividerCapRem / 2.75

  return (
    <>
      <RiverWaveSectionClip
        as="section"
        edge="top"
        variant="classic"
        className="relative isolate mb-[-1px] -mt-[calc(1.375rem+1px)] overflow-x-hidden overflow-y-visible bg-parchment pb-32 pt-20 md:pb-44 md:pt-28 md:-mt-[calc(1.875rem+1px)]"
      >
        <div
          className="absolute top-0 left-0 right-0 z-[19] w-full text-[0] leading-[0] pointer-events-none"
          aria-hidden="true"
        >
          <RiverDivider variant="classic" flush />
        </div>
        <JamdaniPattern id="jamdani-story" />
        <BengaliWatermark text="বাংলা রান্না" className="top-16 right-[4%] rotate-3" />
        <SpiceMotif className="w-36 h-36 top-12 right-[8%] rotate-12 hidden lg:block" />
        <FloralMotif className="w-28 h-28 bottom-20 left-[5%] -rotate-6 hidden md:block" />

        <div className="max-w-6xl mx-auto px-8 md:px-10 relative z-10">
          <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
            {/* Left column: quote + polaroid */}
            <div className="md:col-span-5 space-y-8 md:space-y-10">
              <motion.blockquote
                className="border-l-4 border-gold pl-6 md:pl-8 md:mt-8"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <p className="font-serif text-2xl md:text-3xl italic leading-relaxed text-espresso/75">
                  "By the end of your meal, we hope you will have tasted a little of Bangladesh — its rivers, its kitchens, its celebrations, and its heart."
                </p>
              </motion.blockquote>
              <motion.div
                initial={{ opacity: 0, rotate: 2 }}
                whileInView={{ opacity: 1, rotate: -2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-polaroid p-3 md:p-4 pb-12 md:pb-14 shadow-xl shadow-espresso/10 rotate-[-2deg] max-w-xs mx-auto md:mx-0 border border-espresso/8">
                  <div className="overflow-hidden">
                    <img
                      src="/textures/grandparents.JPG"
                      alt="The family behind Bangla Kitchen"
                      className="w-full h-auto aspect-[4/5] object-cover object-top"
                      style={{
                        filter: 'grayscale(100%) sepia(25%) contrast(1.1) brightness(0.95)',
                      }}
                      loading="lazy"
                    />
                  </div>
                  <p className="font-hand text-espresso/50 text-center text-sm mt-3 -rotate-1">The heart of Bangla Kitchen</p>
                </div>
              </motion.div>
            </div>

            {/* Right column: story text */}
            <motion.div
              className="md:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="section-header-texture inline-block pr-3 mb-4">
                <p className="font-hand text-terracotta text-xl mb-1 -rotate-1 origin-left">Our Story</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">A Mother's<br />Kitchen</h2>
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

          <BengaliWatermark text="স্বাদ" className="top-[42%] left-[6%] md:top-[48%] -rotate-8" />
          <div className="max-w-5xl mx-auto mt-20 md:mt-28 pt-16 md:pt-20 border-t border-espresso/8">
            <div className="section-header-texture inline-block pr-3 mb-10">
              <p className="font-hand text-terracotta text-2xl md:text-3xl mb-1 sm:mb-2 -rotate-1 origin-left">
                From Our Table
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-balance leading-[1.15]">
                A Taste of Home
              </h2>
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
        </div>
      </RiverWaveSectionClip>
    </>
  )
}

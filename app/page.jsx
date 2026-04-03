'use client'

import Navbar from '@/components/Navbar'
import AudioPlayer from '@/components/AudioPlayer'
import { RiverDivider } from '@/components/art/Decoratives'
import HeroSection from '@/components/sections/HeroSection'
import StorySection from '@/components/sections/StorySection'
import MenuSection from '@/components/sections/MenuSection'
import CateringSection from '@/components/sections/CateringSection'
import FooterSection from '@/components/sections/FooterSection'
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="hand-drawn-frame">
        <main>
          <HeroSection />
          <StorySection />
          <MenuSection />
          <RiverDivider variant="swell" />
          <CateringSection />
        </main>
      </div>
      <FooterSection />
      <AudioPlayer />
    </>
  )
}

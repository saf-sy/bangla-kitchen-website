'use client'

import Navbar from '@/components/Navbar'
import AudioPlayer from '@/components/AudioPlayer'
import HeroSection from '@/components/sections/HeroSection'
import StorySection from '@/components/sections/StorySection'
import MenuSection from '@/components/sections/MenuSection'
import CateringSection from '@/components/sections/CateringSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="hand-drawn-frame" id="top">
        <main>
          <HeroSection />
          <StorySection />
          <MenuSection />
          <CateringSection />
        </main>
      </div>
      <AudioPlayer />
    </>
  )
}

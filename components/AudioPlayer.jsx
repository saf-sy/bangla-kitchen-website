'use client'

import { useState, useRef, useEffect } from 'react'
import { Pause, Music2 } from 'lucide-react'

/** Quiet background level; browsers use 0–1 gain. */
const BG_VOLUME = 0.06

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef(null)
  /** False after user pauses; avoids canplay/retry fighting an intentional pause. */
  const wantsPlaybackRef = useRef(true)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return

    const attemptPlay = () => {
      if (!wantsPlaybackRef.current) return
      el.volume = BG_VOLUME
      const p = el.play()
      if (p !== undefined) {
        p.then(() => setPlaying(true)).catch(() => {
          // Still blocked or not ready; canplay / first pointer may succeed.
        })
      }
    }

    el.volume = BG_VOLUME
    attemptPlay()

    const onCanPlay = () => {
      if (el.paused && wantsPlaybackRef.current) attemptPlay()
    }
    el.addEventListener('canplay', onCanPlay)

    // Browsers often block unmuted autoplay until the user interacts with the page once.
    // Skip the music button so the first click is not eaten by play() then toggle pause().
    const onFirstPointer = (e) => {
      if (e.target?.closest?.('[data-music-toggle]')) return
      if (!wantsPlaybackRef.current) return
      if (el.paused) attemptPlay()
    }
    document.addEventListener('pointerdown', onFirstPointer, { once: true, passive: true })

    return () => {
      el.removeEventListener('canplay', onCanPlay)
      document.removeEventListener('pointerdown', onFirstPointer)
    }
  }, [])

  const toggle = async () => {
    const el = audioRef.current
    if (!el || audioError) return
    el.volume = BG_VOLUME

    if (!el.paused) {
      wantsPlaybackRef.current = false
      el.pause()
      setPlaying(false)
      return
    }

    wantsPlaybackRef.current = true
    try {
      await el.play()
      setPlaying(true)
    } catch {
      setAudioError(true)
      setPlaying(false)
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/flute-instrumental.mp3"
        loop
        preload="auto"
        autoPlay
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setAudioError(true)
          setPlaying(false)
        }}
      />
      <div className="fixed bottom-5 left-5 z-[10050] hidden md:flex items-center">
        <button
          type="button"
          data-music-toggle
          onClick={toggle}
          disabled={audioError}
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-gold/35 bg-parchment/85 backdrop-blur text-espresso/75 shadow-md transition-all duration-200 ${
            playing ? 'audio-pulse text-terracotta border-terracotta/40 bg-parchment' : ''
          } ${audioError ? 'opacity-45 cursor-not-allowed' : 'hover:text-terracotta hover:border-terracotta/35 hover:scale-105'}`}
          aria-label={playing ? 'Pause background music' : 'Play background music'}
          aria-pressed={playing}
          title={audioError ? 'Audio file missing or unsupported' : 'Toggle background music'}
        >
          {playing ? <Pause size={18} strokeWidth={2.25} /> : <Music2 size={18} strokeWidth={2.25} />}
        </button>
      </div>
    </>
  )
}

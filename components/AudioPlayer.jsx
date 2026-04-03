'use client'

import { useState, useRef } from 'react'
import { Play, Pause, Music2 } from 'lucide-react'

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const [audioError, setAudioError] = useState(false)
  const audioRef = useRef(null)

  const toggle = async () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      if (audioError) return
      audioRef.current.volume = 0.2
      try {
        await audioRef.current.play()
        setPlaying(true)
      } catch {
        // Missing/unsupported audio should never crash the page.
        setAudioError(true)
        setPlaying(false)
      }
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/vintage-dhaka.mp3"
        loop
        preload="none"
        onError={() => {
          setAudioError(true)
          setPlaying(false)
        }}
      />
      <div className="fixed bottom-5 left-5 z-50 hidden md:flex items-center gap-2">
        {visible && (
          <button
            onClick={toggle}
            disabled={audioError}
            className={`w-10 h-10 rounded-full flex items-center justify-center bg-terracotta text-white shadow-lg shadow-terracotta/25 transition-transform duration-200 ${
              playing ? 'audio-pulse' : ''
            } ${audioError ? 'opacity-45 cursor-not-allowed' : 'hover:scale-105'}`}
            aria-label={playing ? 'Pause vintage audio' : 'Play vintage audio'}
            title={audioError ? 'Audio file missing or unsupported' : 'Vintage Dhaka instrumental'}
          >
            {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </button>
        )}
        <button
          onClick={() => setVisible((v) => !v)}
          className="h-9 px-3 rounded-full border border-gold/35 bg-parchment/85 backdrop-blur text-espresso/75 hover:text-terracotta transition-colors text-xs font-semibold tracking-wide inline-flex items-center gap-1.5"
          aria-label="Toggle lo-fi player"
          title="Optional lo-fi audio"
        >
          <Music2 size={14} />
          {visible ? 'Hide Audio' : 'Lo-Fi'}
        </button>
      </div>
    </>
  )
}

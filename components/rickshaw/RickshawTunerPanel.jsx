'use client'

import { useCallback, useEffect, useState } from 'react'
import { mergeRickshawTuning, RICKSHAW_TUNING_STORAGE_KEY } from '@/lib/rickshawTuning'

const RICKSHAW_FILTER_ID = 'rickshaw-knockout-tunable'

export default function RickshawTunerPanel({ tuning, setTuning }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const q = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('rickshawTune')
    if (q) setOpen(true)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.altKey && e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(RICKSHAW_TUNING_STORAGE_KEY, JSON.stringify(tuning))
    } catch {
      /* ignore quota */
    }
  }, [tuning])

  const patch = useCallback((partial) => {
    setTuning((prev) => mergeRickshawTuning({ ...prev, ...partial }))
  }, [setTuning])

  const reset = useCallback(() => {
    setTuning(mergeRickshawTuning())
    try {
      window.localStorage.removeItem(RICKSHAW_TUNING_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [setTuning])

  if (!open) return null

  return (
    <div className="fixed bottom-20 left-3 z-[20000] w-[min(100vw-1.5rem,18rem)] rounded-lg border border-espresso/25 bg-espresso/95 p-3 text-parchment shadow-2xl backdrop-blur-md md:bottom-6">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold/90">Rickshaw tune</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-parchment/50 hover:text-parchment"
        >
          Hide
        </button>
      </div>
      <p className="mb-3 text-[10px] leading-snug text-parchment/45">
        URL: add <code className="text-gold/80">?rickshawTune=1</code> · <kbd className="text-parchment/70">Alt+Shift+R</kbd>
      </p>

      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-parchment/55">
        End position ({tuning.travelEndPercent}%)
        <input
          type="range"
          min={-80}
          max={200}
          step={1}
          value={tuning.travelEndPercent}
          onChange={(e) => patch({ travelEndPercent: Number(e.target.value) })}
          className="mt-1 w-full accent-gold"
        />
      </label>

      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-parchment/55">
        Start ({tuning.travelStartPercent}%)
        <input
          type="range"
          min={-200}
          max={80}
          step={1}
          value={tuning.travelStartPercent}
          onChange={(e) => patch({ travelStartPercent: Number(e.target.value) })}
          className="mt-1 w-full accent-gold"
        />
      </label>

      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-parchment/55">
        Line darkness ({tuning.outlineDilateRadius.toFixed(2)})
        <input
          type="range"
          min={0.1}
          max={3.0}
          step={0.05}
          value={tuning.outlineDilateRadius}
          onChange={(e) => patch({ outlineDilateRadius: Number(e.target.value) })}
          className="mt-1 w-full accent-gold"
        />
      </label>

      <label className="mb-3 block text-[10px] font-semibold uppercase tracking-wide text-parchment/55">
        Duration ({tuning.travelDurationSec.toFixed(1)}s)
        <input
          type="range"
          min={2}
          max={12}
          step={0.1}
          value={tuning.travelDurationSec}
          onChange={(e) => patch({ travelDurationSec: Number(e.target.value) })}
          className="mt-1 w-full accent-gold"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-parchment/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide hover:bg-parchment/25"
        >
          Reset defaults
        </button>
      </div>
      <p className="mt-2 text-[9px] leading-snug text-parchment/35">
        Filter id <code className="text-parchment/50">{RICKSHAW_FILTER_ID}</code> · defaults in{' '}
        <code className="text-parchment/50">lib/rickshawTuning.js</code>
      </p>
    </div>
  )
}

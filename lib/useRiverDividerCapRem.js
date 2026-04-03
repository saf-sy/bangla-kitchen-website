'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

const MD_DIVIDER_CAP_REM = 3.75
const DEFAULT_DIVIDER_CAP_REM = 2.75

function subscribe(onChange) {
  if (typeof window === 'undefined') return () => {}
  const mq = window.matchMedia('(min-width: 768px)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot() {
  if (typeof window === 'undefined') return DEFAULT_DIVIDER_CAP_REM
  return window.matchMedia('(min-width: 768px)').matches ? MD_DIVIDER_CAP_REM : DEFAULT_DIVIDER_CAP_REM
}

/**
 * Matches RiverDivider: `h-11` (2.75rem) / `md:h-[3.75rem]`.
 * First paint always 2.75rem (matches server); after mount, follows viewport.
 */
export function useRiverDividerCapRem() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  const fromMq = useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_DIVIDER_CAP_REM)

  return hydrated ? fromMq : DEFAULT_DIVIDER_CAP_REM
}

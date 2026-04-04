'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 64
const FRAME_HEIGHT = 420
const FRAME_WIDTH = 560
const GRID_COLS = 8
const FPS = 12

/**
 * Rickshaw animation using a CSS sprite sheet instead of video.
 * Works on all devices including iOS Safari in low-power mode.
 */
const RickshawSprite = forwardRef(function RickshawSprite({ isMoving = false, className = '', style = {} }, ref) {
  const innerRef = useRef(null)
  const frameRef = useRef(0)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(0)
  const [supportsWebP, setSupportsWebP] = useState(true)

  // Merge forwarded ref and inner ref
  const setRefs = (el) => {
    innerRef.current = el
    if (typeof ref === 'function') ref(el)
    else if (ref) ref.current = el
  }

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const isWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    setSupportsWebP(isWebP)
  }, [])

  useEffect(() => {
    const el = innerRef.current
    if (!el || !isMoving) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    const interval = 1000 / FPS

    const tick = (timestamp) => {
      if (timestamp - lastTimeRef.current >= interval) {
        lastTimeRef.current = timestamp
        frameRef.current = (frameRef.current + 1) % FRAME_COUNT
        
        const col = frameRef.current % GRID_COLS
        const row = Math.floor(frameRef.current / GRID_COLS)
        
        el.style.backgroundPosition = `-${col * FRAME_WIDTH}px -${row * FRAME_HEIGHT}px`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMoving])

  const src = supportsWebP ? '/textures/rickshaw-sprite-grid.webp' : '/textures/rickshaw-sprite-grid.png'

  return (
    <div
      ref={setRefs}
      className={className}
      aria-hidden="true"
      style={{
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${FRAME_WIDTH * GRID_COLS}px ${FRAME_HEIGHT * (FRAME_COUNT / GRID_COLS)}px`,
        backgroundPosition: '0px 0px',
        imageRendering: 'auto',
        ...style,
      }}
    />
  )
})

export default RickshawSprite

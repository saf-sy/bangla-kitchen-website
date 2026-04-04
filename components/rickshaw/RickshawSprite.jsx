'use client'

import { forwardRef, useEffect, useRef, useState } from 'react'

const FRAME_COUNT = 64
const FRAME_HEIGHT = 200
const FRAME_WIDTH = 356
const FPS = 12 // Smooth 12fps for the 64 frames

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
        el.style.backgroundPositionY = `-${frameRef.current * FRAME_HEIGHT}px`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isMoving])

  const src = supportsWebP ? '/textures/rickshaw-sprite-v3.webp' : '/textures/rickshaw-sprite-v3.png'

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
        backgroundSize: `${FRAME_WIDTH}px ${FRAME_COUNT * FRAME_HEIGHT}px`,
        backgroundPositionX: '0px',
        backgroundPositionY: '0px',
        imageRendering: 'auto',
        ...style,
      }}
    />
  )
})

export default RickshawSprite

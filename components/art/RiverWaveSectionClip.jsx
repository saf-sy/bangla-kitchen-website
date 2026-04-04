'use client'

import { useMemo } from 'react'
import {
  getSectionBottomClipPolygonRem,
  getSectionTopWaveClipPolygonRem,
} from '@/lib/riverWave'
import { useRiverDividerCapRem } from '@/lib/useRiverDividerCapRem'

/**
 * Inline SVG clipPath (objectBoundingBox) + CSS clip-path — stable across Chromium / Firefox / Safari.
 * Keep padding and clip on this same element so content (e.g. polaroid shadows) is not clipped away incorrectly.
 */
export default function RiverWaveSectionClip({
  as: Tag = 'section',
  edge = 'bottom',
  variant = 'classic',
  capScale = 1,
  className,
  style,
  children,
  ...rest
}) {
  const dividerCapRem = useRiverDividerCapRem()

  const clipPathString = useMemo(
    () =>
      edge === 'top'
        ? getSectionTopWaveClipPolygonRem(dividerCapRem, variant, 88)
        : getSectionBottomClipPolygonRem(dividerCapRem, variant, 88),
    [edge, variant, dividerCapRem]
  )

  return (
    <Tag
      className={className}
      style={{
        ...style,
        clipPath: clipPathString,
        WebkitClipPath: clipPathString,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

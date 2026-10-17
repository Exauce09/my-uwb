import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import type { AboutMediaShot } from '../../data/aboutMedia'

type Props = {
  images: AboutMediaShot[]
  className?: string
  /** Classes appliquées à chaque image (object-fit, object-position…). */
  imageClassName?: string
  intervalMs?: number
  kenBurns?: boolean
  /** Affiche le crédit de l’image active sous le cadre. */
  showCredit?: boolean
  creditClassName?: string
}

export function ImageCrossfade({
  images,
  className = '',
  imageClassName = 'object-cover object-center',
  intervalMs = 5200,
  kenBurns = true,
  showCredit = false,
  creditClassName = 'mt-3 text-[11px] text-uwb-muted',
}: Props) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced || images.length < 2) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      intervalMs,
    )
    return () => window.clearInterval(id)
  }, [images.length, intervalMs, reduced])

  if (!images.length) return null

  const active = images[index] ?? images[0]

  const frame = (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((shot, i) => (
        <img
          key={shot.src}
          src={shot.src}
          alt={i === index ? shot.alt : ''}
          aria-hidden={i !== index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-[1400ms] ease-in-out ${imageClassName} ${
            i === index ? 'opacity-100' : 'opacity-0'
          } ${kenBurns && !reduced && i === index ? 'ken-burns' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  )

  if (!showCredit) return frame

  return (
    <div>
      {frame}
      <p className={creditClassName}>{active.credit}</p>
    </div>
  )
}

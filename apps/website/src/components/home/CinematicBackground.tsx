import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { uwbMedia } from '../../data/media'

type Props = {
  className?: string
  images?: string[]
  enableVideo?: boolean
}

/**
 * Fond cinématographique : vidéo locale si disponible,
 * sinon crossfade des photos officielles UWB (carrousel).
 */
export function CinematicBackground({
  className = '',
  images = [...uwbMedia.carousel],
  enableVideo = true,
}: Props) {
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [index, setIndex] = useState(0)
  const [videoOk, setVideoOk] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduced || videoOk) return
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      5500,
    )
    return () => window.clearInterval(id)
  }, [images.length, reduced, videoOk])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !enableVideo || reduced || isMobile) return
    video.muted = true
    void video.play().then(() => setVideoOk(true)).catch(() => setVideoOk(false))
  }, [enableVideo, reduced, isMobile])

  const showVideo = enableVideo && videoOk && !reduced && !isMobile

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            !showVideo && i === index ? 'opacity-100' : 'opacity-0'
          } ${reduced ? '' : 'ken-burns'}`}
        />
      ))}

      {enableVideo ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            showVideo ? 'opacity-100' : 'opacity-0'
          }`}
          poster={uwbMedia.heroPoster}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => {
            /* play attempted in effect */
          }}
          onError={() => setVideoOk(false)}
        >
          <source src={uwbMedia.heroVideo} type="video/mp4" />
        </video>
      ) : null}
    </div>
  )
}

import { Play } from 'lucide-react'
import { useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { campusShots } from '../../data/campusLife'
import { homeCopy } from '../../data/homeCopy'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'

export function CampusLifeSection() {
  const copy = homeCopy.campusLife
  const reduced = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function toggle() {
    const video = videoRef.current
    if (!video || reduced) return
    if (video.paused) {
      void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <section id="vie-universitaire" className="bg-uwb-surface py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="font-display text-4xl font-semibold text-uwb-blue md:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-uwb-muted md:text-lg">
              {copy.intro}
            </p>
          </div>
        </Reveal>

        <div className="grid auto-rows-[180px] gap-3 sm:auto-rows-[220px] lg:grid-cols-4 lg:auto-rows-[200px]">
          {campusShots.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05} className={item.span}>
              <figure className="group relative h-full overflow-hidden">
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
                  <span className="text-xs font-semibold tracking-[0.2em] text-white uppercase">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[10px] text-white/60">
                    {item.credit}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="relative mt-8 min-h-[22rem] overflow-hidden bg-uwb-navy lg:min-h-[28rem]">
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              poster={uwbMedia.heroPoster}
              muted
              playsInline
              loop
              preload="metadata"
            >
              <source src={uwbMedia.heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative flex min-h-[22rem] flex-col items-start justify-end p-8 text-white lg:min-h-[28rem] lg:p-12">
              <p className="text-[11px] tracking-[0.3em] uppercase">
                {copy.videoTitle}
              </p>
              <h3 className="mt-3 max-w-lg font-display text-3xl font-semibold md:text-4xl">
                Immersion campus
              </h3>
              <button
                type="button"
                onClick={toggle}
                className="mt-6 inline-flex items-center gap-3 border border-white/40 px-5 py-3 text-sm font-medium tracking-wide transition hover:bg-white hover:text-uwb-blue"
              >
                <Play className="h-4 w-4" />
                {playing ? 'Pause' : 'Lire la visite'}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

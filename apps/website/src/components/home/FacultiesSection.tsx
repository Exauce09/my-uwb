import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getFeaturedFaculties } from '../../data/faculties'
import { homeCopy } from '../../data/homeCopy'
import { Reveal } from '../motion/Reveal'

export function FacultiesSection() {
  const faculties = getFeaturedFaculties()
  const copy = homeCopy.faculties

  return (
    <section id="facultes-home" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-uwb-blue md:text-5xl lg:text-6xl">
              {copy.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/facultes"
              className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-uwb-red transition hover:gap-3"
            >
              Facultés & formations
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-px bg-black/5 sm:grid-cols-2 lg:grid-cols-3">
          {faculties.map((faculty, index) => (
            <Reveal key={faculty.id} delay={Math.min(index * 0.05, 0.35)}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }}>
                <Link
                  to={`/facultes/${faculty.slug}`}
                  className="group relative block aspect-[4/5] overflow-hidden bg-uwb-navy"
                >
                  <img
                    src={faculty.image}
                    alt={`${faculty.kind === 'institut' ? 'Institut' : 'Faculté'} ${faculty.shortName}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] font-semibold tracking-[0.25em] text-white/70 uppercase">
                      {faculty.kind === 'institut' ? 'Institut' : 'Faculté'}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight md:text-3xl">
                      {faculty.shortName}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-sm text-sm text-white/75 opacity-0 transition duration-300 group-hover:opacity-100">
                      {faculty.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-white">
                      Découvrir <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

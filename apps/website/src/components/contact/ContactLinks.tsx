import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { contactCopy, institutionalLinks } from '../../data/contact'
import { Reveal } from '../motion/Reveal'

export function ContactLinks() {
  const { links } = contactCopy

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {links.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {links.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {links.intro}
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {institutionalLinks.map((item, i) => (
            <Reveal key={item.to} delay={Math.min(i * 0.04, 0.24)}>
              <li>
                {item.available ? (
                  <Link
                    to={item.to}
                    className="group flex items-center justify-between border border-black/8 px-5 py-4 transition hover:border-uwb-red/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-uwb-red/40"
                  >
                    <span className="font-display text-lg font-semibold text-uwb-navy">
                      {item.label}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 text-uwb-red transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden
                    />
                  </Link>
                ) : (
                  <span
                    className="flex items-center justify-between border border-dashed border-black/15 px-5 py-4 text-uwb-muted"
                    aria-disabled="true"
                  >
                    <span className="font-display text-lg font-semibold">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase">
                      {item.note ?? 'Bientôt'}
                    </span>
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'
import { homeCopy } from '../../data/homeCopy'
import { Reveal } from '../motion/Reveal'

export function QuickAccessBar() {
  return (
    <section id="acces-rapides" className="border-b border-black/5 bg-white">
      <Reveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
          {homeCopy.quickAccess.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group border-r border-b border-black/5 px-5 py-7 transition hover:bg-uwb-red hover:text-white last:border-r-0 xl:border-b-0"
            >
              <p className="font-display text-xl font-semibold">{item.title}</p>
              <p className="mt-1 text-xs text-uwb-muted transition group-hover:text-white/75">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

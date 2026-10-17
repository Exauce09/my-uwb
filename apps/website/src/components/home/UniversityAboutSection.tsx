import { Link } from 'react-router-dom'
import { presentation } from '../../data/presentation'
import { site } from '../../data/site'
import { uwbMedia } from '../../data/media'
import { Reveal } from '../motion/Reveal'

/** À propos — grande image = Recteur, seconde = Université. */
export function UniversityAboutSection() {
  const rector =
    presentation.management.find(
      (m) => m.status === 'active' && m.role === 'Recteur',
    ) ?? presentation.management[0]

  return (
    <section id="a-propos" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            À propos
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-uwb-blue md:text-5xl lg:text-6xl">
            Une université historique tournée vers l’avenir
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-uwb-muted md:text-lg">
              {presentation.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p>
                Devise : « {site.motto} ». Sept facultés et un institut supérieur
                sous le même encadrement, au cœur de la Gombe à Kinshasa.
              </p>
            </div>
            <Link
              to="/presentation"
              className="mt-8 inline-flex text-sm font-semibold tracking-wide text-uwb-red"
            >
              En savoir plus →
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {/* 1. Recteur (grande) */}
              <figure className="col-span-2">
                <img
                  src={uwbMedia.rector}
                  alt={rector.name}
                  className="aspect-[16/10] w-full object-cover object-[center_20%]"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-[11px] text-uwb-muted">
                  <span className="font-semibold text-uwb-blue">
                    {rector.role}
                  </span>
                  {' — '}
                  {rector.name}
                </figcaption>
              </figure>
              {/* 2. Université */}
              <figure className="col-span-2 sm:col-span-1">
                <img
                  src={uwbMedia.university}
                  alt="Université William Booth"
                  className="aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-[11px] text-uwb-muted">
                  Campus UWB — {uwbMedia.credit}
                </figcaption>
              </figure>
              <figure className="col-span-2 flex flex-col justify-end bg-uwb-surface p-5 sm:col-span-1">
                <p className="font-display text-4xl font-semibold text-uwb-red">
                  1996
                </p>
                <p className="mt-2 text-sm text-uwb-muted">
                  Année de fondation · Jubilé 30 ans en 2026
                </p>
              </figure>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

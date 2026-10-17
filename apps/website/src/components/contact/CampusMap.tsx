import { useState } from 'react'
import { ExternalLink, MapPinned, Navigation } from 'lucide-react'
import { campusMap, contactCopy } from '../../data/contact'
import { Reveal } from '../motion/Reveal'
import { Button } from '../ui/Button'
import { ProvisionalBadge } from '../ui/ProvisionalBadge'

export function CampusMap() {
  const { map } = contactCopy
  const cfg = campusMap
  const [mapFailed, setMapFailed] = useState(false)

  return (
    <section
      id="localisation-campus"
      className="scroll-mt-28 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
              {map.kicker}
            </p>
            <ProvisionalBadge />
          </div>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {cfg.title}
          </h2>
          <p className="mt-3 font-display text-xl text-uwb-navy md:text-2xl">
            {cfg.addressLabel}
          </p>
          <p className="mt-1 text-sm text-uwb-muted">{cfg.zoneLabel}</p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-uwb-muted">
            {cfg.disclaimer}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <div className="relative min-h-[18rem] overflow-hidden border border-black/8 bg-uwb-navy sm:min-h-[22rem] lg:min-h-[28rem]">
            {!mapFailed ? (
              <iframe
                title={`Carte indicative — ${cfg.zoneLabel}`}
                src={cfg.osmEmbedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onError={() => setMapFailed(true)}
              />
            ) : null}

            {mapFailed ? (
              <div className="absolute inset-0">
                <img
                  src={cfg.fallbackImage}
                  alt={cfg.fallbackAlt}
                  className="h-full w-full object-cover opacity-60"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-uwb-navy via-uwb-navy/50 to-transparent p-6 text-white sm:p-8">
                  <MapPinned className="h-8 w-8 text-uwb-gold-soft" aria-hidden />
                  <p className="mt-3 font-display text-2xl font-semibold">
                    {cfg.zoneLabel}
                  </p>
                  <p className="mt-2 max-w-md text-sm text-white/75">
                    La carte interactive n’a pas pu être chargée. Utilisez les
                    boutons ci-dessous pour ouvrir un service de cartographie.
                  </p>
                </div>
              </div>
            ) : (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-uwb-navy/90 to-transparent p-4 sm:p-6">
                <p className="max-w-xl text-xs leading-relaxed text-white/85 sm:text-sm">
                  Vue de zone · OpenStreetMap · Entrée campus non marquée
                </p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.12} className="mt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              href={cfg.osmSearchUrl}
              className="rounded-none"
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir dans OpenStreetMap
              <ExternalLink className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              href={cfg.directionsUrl}
              variant="ghost"
              className="rounded-none"
              target="_blank"
              rel="noreferrer"
            >
              <Navigation className="h-4 w-4" aria-hidden />
              Obtenir un itinéraire
            </Button>
            <Button
              href={cfg.googleSearchUrl}
              variant="ghost"
              className="rounded-none"
              target="_blank"
              rel="noreferrer"
            >
              Rechercher l’adresse
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

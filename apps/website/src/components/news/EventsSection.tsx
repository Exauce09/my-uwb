import { CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDateFr, newsEvents, splitEventsByTime } from '../../data/news'
import {
  newsCopy,
  newsEventKindLabels,
} from '../../data/newsCategories'
import { Reveal } from '../motion/Reveal'

export function EventsSection() {
  const { upcoming, past } = splitEventsByTime(newsEvents)
  const hasAny = upcoming.length + past.length > 0

  return (
    <section className="bg-uwb-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.3em] text-uwb-red uppercase">
            {newsCopy.events.kicker}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-uwb-navy md:text-4xl">
            {newsCopy.events.title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-uwb-muted md:text-base">
            {newsCopy.events.intro}
          </p>
        </Reveal>

        {!hasAny ? (
          <Reveal delay={0.08}>
            <div className="mt-10 border border-dashed border-black/15 bg-white px-6 py-14 text-center">
              <CalendarDays className="mx-auto h-8 w-8 text-uwb-red/70" aria-hidden />
              <p className="mt-4 text-sm text-uwb-muted">{newsCopy.events.empty}</p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <EventColumn
              title={newsCopy.events.upcoming}
              events={upcoming}
              emptyLabel="Aucun événement à venir daté pour le moment."
            />
            <EventColumn
              title={newsCopy.events.past}
              events={past}
              emptyLabel="Aucun événement passé listé."
            />
          </div>
        )}
      </div>
    </section>
  )
}

function EventColumn({
  title,
  events,
  emptyLabel,
}: {
  title: string
  events: typeof newsEvents
  emptyLabel: string
}) {
  return (
    <Reveal>
      <h3 className="border-b border-black/10 pb-3 font-display text-2xl font-semibold text-uwb-navy">
        {title}
      </h3>
      {events.length === 0 ? (
        <p className="mt-6 text-sm text-uwb-muted">{emptyLabel}</p>
      ) : (
        <ul className="mt-2 divide-y divide-black/8">
          {events.map((event) => (
            <li key={event.id} className="flex gap-4 py-5">
              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center border border-uwb-red/25 bg-white text-center">
                <span className="text-[10px] font-semibold tracking-wide text-uwb-red uppercase">
                  {new Date(`${event.date}T12:00:00`).toLocaleDateString(
                    'fr-FR',
                    { month: 'short' },
                  )}
                </span>
                <span className="font-display text-xl font-semibold text-uwb-navy leading-none">
                  {new Date(`${event.date}T12:00:00`).getDate()}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] text-uwb-muted uppercase">
                  {newsEventKindLabels[event.kind]}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-uwb-navy">
                  {event.title}
                </p>
                <time
                  dateTime={event.date}
                  className="mt-1 block text-xs text-uwb-muted"
                >
                  {formatDateFr(event.date)}
                </time>
                {event.summary ? (
                  <p className="mt-2 text-sm text-uwb-muted">{event.summary}</p>
                ) : null}
                {event.relatedArticleSlug ? (
                  <Link
                    to={`/actualites/${event.relatedArticleSlug}`}
                    className="mt-3 inline-block text-sm font-semibold text-uwb-red"
                  >
                    Voir l’article →
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  )
}

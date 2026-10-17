import { Link } from 'react-router-dom'
import { getActiveAnnouncements } from '../../data/announcements'

/** Bande communiqués / inscriptions — toujours sous le header. */
export function AnnouncementBand() {
  const items = getActiveAnnouncements()
  if (items.length === 0) return null

  const item = items[0]

  return (
    <div className="relative z-40 bg-uwb-red text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-sm leading-snug">
          <span className="mr-2 text-[10px] font-semibold tracking-[0.2em] uppercase opacity-80">
            {item.label}
          </span>
          {item.message}
        </p>
        <Link
          to={item.href}
          className="shrink-0 text-xs font-semibold tracking-[0.15em] uppercase underline-offset-4 hover:underline"
        >
          {item.cta} →
        </Link>
      </div>
    </div>
  )
}

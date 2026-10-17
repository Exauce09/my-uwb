import { Link } from 'react-router-dom'
import { footerNav } from '../data/navigation'
import { site } from '../data/site'

export function Footer() {
  const year = new Date().getFullYear()
  /** Contact depuis services ; pas les stubs « bientôt » ni Mentions légales. */
  const contactLink = footerNav.services.find((l) => l.to === '/contact')
  const links = [
    ...footerNav.discover,
    ...footerNav.resources,
    ...(contactLink ? [contactLink] : []),
  ]

  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 overflow-hidden rounded-full ring-1 ring-black/10">
            <img src={site.logoSrc} alt="" className="h-full w-full object-contain p-1" />
          </span>
          <div>
            <p className="font-display text-lg font-semibold">{site.name}</p>
            <p className="text-xs text-uwb-muted">
              {site.contact.address.value} · {site.contact.emails[0].value}
            </p>
          </div>
        </div>
        <nav
          aria-label="Pied de page"
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-uwb-muted"
        >
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-uwb-red">
              {l.label}
            </Link>
          ))}
          <a href={site.officialWebsite} target="_blank" rel="noreferrer" className="hover:text-uwb-red">
            Site officiel
          </a>
        </nav>
      </div>
      <div className="border-t border-black/5">
        <p className="mx-auto max-w-7xl px-5 py-3 text-[11px] text-uwb-muted sm:px-8">
          © {year} {site.name} · Médias uwbcongo.org
        </p>
      </div>
    </footer>
  )
}

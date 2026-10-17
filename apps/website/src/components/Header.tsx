import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Search, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { mainNav, moreNav, primaryNav } from '../data/navigation'
import { site } from '../data/site'
import { useScrolled } from '../hooks/useScrolled'
import { AnnouncementBand } from './home/AnnouncementBand'
import { Button } from './ui/Button'

type HeaderProps = {
  transparentOnHero?: boolean
}

export function Header({ transparentOnHero = false }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  const scrolled = useScrolled(24)
  const location = useLocation()
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const moreRef = useRef<HTMLDivElement>(null)
  const onHome = location.pathname === '/'
  const transparent = transparentOnHero && onHome && !scrolled && !open

  useEffect(() => setMounted(true), [])
  useEffect(() => {
    setOpen(false)
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!moreOpen) return
    function onPointer(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [moreOpen])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/chercher?q=${encodeURIComponent(q)}`)
    setQuery('')
    setOpen(false)
  }

  const primaryLink = ({ isActive }: { isActive: boolean }) =>
    `text-[12px] font-medium tracking-[0.06em] uppercase transition ${
      transparent
        ? isActive
          ? 'text-white'
          : 'text-white/80 hover:text-white'
        : isActive
          ? 'text-uwb-red'
          : 'text-uwb-blue/75 hover:text-uwb-red'
    }`

  const mobileMenu =
    mounted &&
    createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[300] flex flex-col bg-white"
          >
            <div className="flex h-16 items-center justify-between border-b border-black/5 px-5">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-black/10">
                  <img
                    src={site.logoSrc}
                    alt=""
                    className="h-[82%] w-[82%] object-contain"
                  />
                </span>
                <span className="font-display text-lg font-semibold text-uwb-blue">
                  {site.shortName}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-2 text-uwb-blue"
                aria-label="Fermer"
              >
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
                  Fermer
                </span>
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Navigation">
              <form onSubmit={handleSearch} className="mb-8">
                <label
                  htmlFor="mobile-site-search"
                  className="text-[10px] font-semibold tracking-[0.25em] text-uwb-muted uppercase"
                >
                  Recherche
                </label>
                <div className="mt-2 flex items-center gap-2 border-b border-black/20">
                  <Search className="h-5 w-5 shrink-0 text-uwb-muted" />
                  <input
                    id="mobile-site-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Facultés, actualités…"
                    className="w-full bg-transparent py-3 text-base outline-none"
                  />
                </div>
              </form>

              <ul>
                {mainNav.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 + i * 0.03 }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block border-b border-black/6 py-4 font-display text-3xl font-semibold ${
                          isActive ? 'text-uwb-red' : 'text-uwb-blue'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  to="/admissions"
                  className="w-full rounded-none"
                  onClick={() => setOpen(false)}
                >
                  Candidater
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    )

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`transition-all duration-500 ${
            transparent
              ? 'bg-transparent'
              : 'border-b border-black/5 bg-white/95 shadow-sm backdrop-blur-xl'
          }`}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:h-[4.5rem]">
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-black/10 lg:h-11 lg:w-11">
                <img
                  src={site.logoSrc}
                  alt=""
                  className="h-[82%] w-[82%] object-contain"
                />
              </span>
              <span
                className={`font-display text-xl font-semibold tracking-tight lg:text-2xl ${
                  transparent ? 'text-white' : 'text-uwb-blue'
                }`}
              >
                {site.shortName}
              </span>
            </Link>

            <nav
              className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8"
              aria-label="Navigation principale"
            >
              {primaryNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={primaryLink}
                >
                  {item.label}
                </NavLink>
              ))}

              <form
                onSubmit={handleSearch}
                className={`flex max-w-[14rem] items-center gap-2 border-b xl:max-w-[18rem] ${
                  transparent ? 'border-white/40' : 'border-black/15'
                }`}
                role="search"
              >
                <Search
                  className={`h-3.5 w-3.5 shrink-0 ${
                    transparent ? 'text-white/70' : 'text-uwb-muted'
                  }`}
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher…"
                  aria-label="Rechercher sur le site"
                  className={`w-full bg-transparent py-1.5 text-xs outline-none ${
                    transparent
                      ? 'text-white placeholder:text-white/50'
                      : 'text-uwb-blue placeholder:text-uwb-muted'
                  }`}
                />
              </form>

              <div className="relative" ref={moreRef}>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 text-[12px] font-medium tracking-[0.06em] uppercase ${
                    transparent
                      ? 'text-white/80 hover:text-white'
                      : 'text-uwb-blue/75 hover:text-uwb-red'
                  }`}
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((v) => !v)}
                >
                  Menu
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${moreOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {moreOpen ? (
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute top-[calc(100%+0.75rem)] right-0 z-50 min-w-[15rem] border border-black/8 bg-white py-2 shadow-xl"
                    >
                      {moreNav.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setMoreOpen(false)}
                          className={({ isActive }) =>
                            `block px-5 py-2.5 text-sm transition hover:bg-uwb-surface ${
                              isActive ? 'text-uwb-red' : 'text-uwb-blue'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                to="/admissions"
                className={`hidden rounded-none sm:inline-flex ${
                  transparent ? 'bg-white text-uwb-red hover:bg-white/90' : ''
                }`}
              >
                Candidater
              </Button>
              <button
                type="button"
                className={`inline-flex items-center gap-2 lg:hidden ${
                  transparent ? 'text-white' : 'text-uwb-blue'
                }`}
                aria-expanded={open}
                aria-label="Ouvrir le menu"
                onClick={() => setOpen(true)}
              >
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
                  Menu
                </span>
                <span className="flex w-5 flex-col gap-1.5" aria-hidden>
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-3 self-end bg-current" />
                </span>
              </button>
            </div>
          </div>

          <AnnouncementBand />
        </div>
      </header>
      {mobileMenu}
    </>
  )
}

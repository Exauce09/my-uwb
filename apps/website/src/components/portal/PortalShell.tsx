import {
  BookOpen,
  FolderOpen,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { site } from '../../data/site'
import { portalUi } from './portalTheme'

export type PortalRole = 'student' | 'teacher'

type NavItem = {
  to: string
  label: string
  icon: typeof Home
  end?: boolean
}

function navForRole(role: PortalRole, alsoOther: boolean): NavItem[] {
  const items: NavItem[] = [
    {
      to: role === 'student' ? '/espace-etudiant' : '/espace-enseignant',
      label: 'Accueil',
      icon: Home,
      end: true,
    },
  ]
  if (role === 'student') {
    items.push({
      to: '/espace-etudiant/dossier',
      label: 'Dossier',
      icon: FolderOpen,
    })
  }
  items.push({
    to: '/bibliotheque',
    label: 'Bibliothèque',
    icon: BookOpen,
  })
  if (alsoOther) {
    items.push({
      to: role === 'student' ? '/espace-enseignant' : '/espace-etudiant',
      label: role === 'student' ? 'Espace enseignant' : 'Espace étudiant',
      icon: GraduationCap,
    })
  }
  return items
}

export function PortalShell({
  role,
  title,
  children,
}: {
  role: PortalRole
  title: string
  children: ReactNode
}) {
  const { user, logout, isStudent, isTeacher } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const alsoOther =
    (role === 'student' && isTeacher) || (role === 'teacher' && isStudent)
  const nav = navForRole(role, alsoOther)

  const sidebar = (
    <nav className="flex flex-col gap-1 p-3" aria-label="Navigation du portail">
      {nav.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to + item.label}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#FFF1F2] text-[#B91C2B]'
                  : 'text-[#6B7280] hover:bg-[#FFF1F2]/70 hover:text-[#1F2937]'
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </NavLink>
        )
      })}
      {site.officialElearningUrl ? (
        <a
          href={site.officialElearningUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#6B7280] transition hover:bg-[#FFF1F2]/70 hover:text-[#1F2937]"
        >
          <GraduationCap className="h-4 w-4 shrink-0" aria-hidden />
          E-Learning officiel
        </a>
      ) : null}
    </nav>
  )

  return (
    <div className={`${portalUi.page} flex flex-col`}>
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className={`${portalUi.btnGhost} lg:hidden`}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-[#E5E7EB]">
                <img
                  src={site.logoSrc}
                  alt=""
                  className="h-[82%] w-[82%] object-contain"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold tracking-[0.16em] text-[#6B7280] uppercase">
                  {site.shortName}
                </p>
                <p className="truncate text-sm font-semibold text-[#1F2937]">
                  {title}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="truncate text-sm font-medium text-[#1F2937]">
                {user?.full_name || user?.email}
              </p>
              <p className="truncate text-xs text-[#6B7280]">{user?.email}</p>
            </div>
            <button
              type="button"
              className={portalUi.btnSecondary}
              onClick={() => void logout()}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-[#E5E7EB] bg-white lg:block">
          {sidebar}
        </aside>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-30 bg-black/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        ) : null}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-[#E5E7EB] bg-white pt-16 transition-transform lg:hidden ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {sidebar}
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}

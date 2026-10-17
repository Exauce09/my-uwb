import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

/** Fallback local — conserve Header/Footer pendant le chargement d’une page lazy (D7). */
function RouteFallback() {
  return (
    <div
      className="mx-auto max-w-7xl px-5 py-16 text-sm text-uwb-muted sm:px-8"
      role="status"
      aria-live="polite"
    >
      Chargement de la page…
    </div>
  )
}

export function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      <Header transparentOnHero={isHome} />
      <main className={`flex-1 ${isHome ? '' : 'pt-[5.5rem] lg:pt-[6.25rem]'}`}>
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

function PortalFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-white text-sm text-[#6B7280]"
      role="status"
      aria-live="polite"
    >
      Chargement…
    </div>
  )
}

/** Layout minimal pour le portail (hors Header/Footer du site public). */
export function PortalBlankLayout() {
  return (
    <Suspense fallback={<PortalFallback />}>
      <Outlet />
    </Suspense>
  )
}

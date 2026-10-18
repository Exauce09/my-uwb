import type { ReactNode } from 'react'
import { portalUi } from './portalTheme'

export function PortalCard({
  title,
  description,
  children,
  className = '',
}: {
  title?: string
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={`${portalUi.card} p-5 sm:p-6 ${className}`}>
      {title ? (
        <h2 className="text-base font-semibold tracking-tight text-[#1F2937]">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
          {description}
        </p>
      ) : null}
      {children ? (
        <div className={title || description ? 'mt-4' : ''}>{children}</div>
      ) : null}
    </section>
  )
}

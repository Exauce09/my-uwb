import type { ReactNode } from 'react'

type Tone = 'info' | 'success' | 'error'

const tones: Record<Tone, string> = {
  info: 'border-[#E5E7EB] bg-[#FFF1F2] text-[#1F2937]',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-[#B91C2B]/25 bg-[#FFF1F2] text-[#861D27]',
}

export function PortalAlert({
  tone = 'info',
  children,
}: {
  tone?: Tone
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${tones[tone]}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}

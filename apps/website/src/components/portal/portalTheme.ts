/** Charte portail UWB — blanc / rouge (scope portail uniquement). */

export const portal = {
  white: '#FFFFFF',
  red: '#B91C2B',
  redDeep: '#861D27',
  rose: '#FFF1F2',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
} as const

/** Classes Tailwind utilitaires partagées du portail. */
export const portalUi = {
  page: 'min-h-screen bg-white text-[#1F2937]',
  card: 'rounded-xl border border-[#E5E7EB] bg-white shadow-sm',
  input:
    'w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#1F2937] placeholder:text-[#6B7280]/80 outline-none transition focus:border-[#B91C2B] focus:ring-2 focus:ring-[#B91C2B]/20 disabled:cursor-not-allowed disabled:bg-[#FFF1F2]/50 disabled:opacity-70',
  label: 'mb-1.5 block text-sm font-medium text-[#1F2937]',
  errorText: 'mt-1.5 text-sm text-[#B91C2B]',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-lg bg-[#B91C2B] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#861D27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C2B] disabled:cursor-not-allowed disabled:opacity-55',
  btnSecondary:
    'inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#1F2937] transition hover:bg-[#FFF1F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C2B] disabled:cursor-not-allowed disabled:opacity-55',
  btnGhost:
    'inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#6B7280] transition hover:bg-[#FFF1F2] hover:text-[#B91C2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C2B]',
  link: 'font-medium text-[#B91C2B] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B91C2B]',
} as const

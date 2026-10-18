const apiRaw = import.meta.env.VITE_API_BASE_URL as string | undefined
const adminRaw = import.meta.env.VITE_SIGU_ADMIN_URL as string | undefined

/** Base API SIGU sans slash final. */
export const API_BASE_URL = (apiRaw?.trim() || 'http://127.0.0.1:8001').replace(
  /\/$/,
  '',
)

/** Shell administrateur (sigu-web) — hors portail public. */
export const SIGU_ADMIN_URL = (
  adminRaw?.trim() || 'http://127.0.0.1:5175'
).replace(/\/$/, '')

const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;

/** Base API sans slash final — variable publique uniquement. */
export const API_BASE_URL = (raw?.trim() || "http://127.0.0.1:8001").replace(
  /\/$/,
  "",
);

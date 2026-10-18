/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SIGU_ADMIN_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

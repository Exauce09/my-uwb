import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // 5173 = site public ; 5174 parfois déjà pris — shell SIGU sur 5175.
    port: 5175,
    strictPort: true,
  },
});

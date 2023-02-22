import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: /^lit/,
    },
  },
  server: {
    proxy: {
      "/go/api": "http://localhost:8000/",
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // main.tsx-এ virtual module দিয়ে register করা হয়; HTML-এ দ্বিতীয়বার inject নয়।
      injectRegister: false,
      devOptions: {
        // Development server-এর cache যেন পুরোনো build দেখানো না শুরু করে।
        enabled: false,
        type: "module",
      },
      workbox: {
        // sitemap/robots/API request-এ SPA index.html fallback প্রয়োগ হবে না।
        navigateFallbackDenylist: [
          /^\/(?:sitemap\.xml|robots\.txt)(?:\?.*)?$/,
          /^\/api(?:\/|$)/,
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Reliable Krishi Web Platform",
        short_name: "ReliableKrishiApp",
        description: "Reliable Krishi and Gardening Online Platform",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false,
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  css: {
    devSourcemap: false,
  },
});

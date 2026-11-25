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
      injectRegister: false,
      devOptions: {
        enabled: false,
        type: "module",
      },
      workbox: {
        // আপডেট হওয়ার সাথে সাথে নতুন সার্ভিস ওয়ার্কার অ্যাক্টিভ করার জন্য জরুরি
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        navigateFallbackDenylist: [
          /^\/(?:sitemap\.xml|robots\.txt|manifest\.webmanifest)(?:\?.*)?$/,
          /^\/api(?:\/|$)/,
        ],
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg", "pwa-192x192.png", "pwa-512x512.png"],
      manifest: {
        id: "/", // ব্রাউজারকে অ্যাপের ইউনিক আইডেন্টিটি চেনানোর জন্য
        name: "Reliable Krishi Web Platform",
        short_name: "ReliableKrishi",
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
            purpose: "any",
          },
          {
            src: "/pwa-500x500.png", // <--- আপনার ছবিটি যদি ৫০০ সাইজের হয়, তবে এখানে 500x500 দিন
            sizes: "500x500",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-500x500.png", // <--- এখানেও 500x500 দিন
            sizes: "500x500",
            type: "image/png",
            purpose: "maskable",
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


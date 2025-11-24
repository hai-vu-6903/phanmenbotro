import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "img/logo.png"],
      manifest: {
        name: "Phần mềm học tập bổ trợ HSQ-CS",
        short_name: "Phần mềm bổ trợ",
        description: "Phần Mềm Hỗ Trợ Học Tập Cho Hạ Sĩ Quan - Binh Sĩ",
        start_url: "/",
        display: "standalone",
        theme_color: "#1a2e1a",
        background_color: "#1a2e1a",
        icons: [
          {
            src: "./src/assets/img/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./src/assets/img/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./src/assets/img/maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
      },
    }),
  ],
});

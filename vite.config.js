import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        "favicon.ico",
        "robots.txt",
        "img/logo.png",
        "baiHatQuyDinh/**/*",
        "dieuVuSinhHoat/**/*",
        "lyrics/**/*",
        "nhacNghiLe/**/*",
      ],
      devOptions: {
        enabled: true,
        type: 'module',
      },
      strategies: 'generateSW',
      manifest: false, // Sử dụng file manifest tĩnh thay vì tạo tự động
      srcDir: 'src',
      filename: 'sw.js',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          /* ======== AUDIO: baiHatQuyDinh ======== */
          {
            urlPattern: /\/baiHatQuyDinh\/.*\.(?:mp3|wav|ogg)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "baiHatQuyDinh-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },

          /* ======== AUDIO + VIDEO: dieuVu ======== */
          {
            urlPattern: /\/dieuVu\/.*\.(?:mp3|wav|ogg|mp4|webm|avi)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "dieuVu-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },

          /* ======== PDF: lyrics ======== */
          {
            urlPattern: /\/lyrics\/.*\.pdf$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "lyrics-pdf-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },

          /* ======== AUDIO: nhacNghiLe ======== */
          {
            urlPattern: /\/nhacNghiLe\/.*\.(?:mp3|wav|ogg)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "nhacNghiLe-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 60 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          /* ======== CDN JSDELIVR ======== */
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cdn-cache',
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200], // Cả các response không có status code (0) và thành công (200)
              },
            },
          },
        ],
      },
    }), 
  ],
});

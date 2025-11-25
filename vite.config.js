import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: '/',
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
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|webp|avif|ico/i.test(ext)) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (/mp3|wav|ogg|m4a/i.test(ext)) {
            return 'assets/audio/[name].[hash][extname]';
          }
          if (/mp4|webm|ogv/i.test(ext)) {
            return 'assets/video/[name].[hash][extname]';
          }
          if (/pdf|docx?|xlsx?/i.test(ext)) {
            return 'assets/documents/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        }
      }
    }
  }
});

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',

      manifest: {
        name: 'Phần mềm hỗ trợ học tập',
        short_name: 'HocTap',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0d47a1',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        navigateFallback: '/index.html',

        runtimeCaching: [
          {
            // 🔥 BẮT MỌI FILE MP4
            urlPattern: /\.(mp4)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'video-cache',
              rangeRequests: true,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(mp3|wav|aac)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /\.(jpg|jpeg|png|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
    }),
  ],
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // برای توسعه هم PWA را تست کنید (اختیاری)
      devOptions: {
        enabled: true,   // ← می‌توانید بعد از تست دوباره false کنید
      },
      includeAssets: ['icons/icon-192x192.png', 'icons/icon-512x512.png'],
      manifest: {
        name: 'مدیریت داربست',
        short_name: 'داربست',
        description: 'اپلیکیشن مدیریت تسک‌های داربست‌بندی',
        start_url: '/',
        display: 'standalone',
        background_color: '#f9fafb',
        theme_color: '#1e3a8a',
        icons: [
          { src: 'icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png', purpose: 'apple touch icon' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // کش کردن فونت‌های محلی
        runtimeCaching: [
          {
            urlPattern: /^\/fonts\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
});
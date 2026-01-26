module.exports = {
  globDirectory: './',
  globPatterns: [
    '**/*.{html,css,js,json,svg,png,jpg,webp}',
  ],
  globIgnores: [
    'node_modules/**/*',
    'dist/**/*',
    'tests/**/*',
    'IRRELEVANT/**/*',
    'reference_images/**/*',
    'workbox-config.js',
    'playwright.config.js',
    'package*.json',
    'sw.js',
    'sw.js.map',
    'workbox-*.js',
    'workbox-*.js.map',
  ],
  swDest: 'sw.js',
  runtimeCaching: [
    {
      // Cache Adobe Fonts
      urlPattern: /^https:\/\/use\.typekit\.net\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'typekit-fonts',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      // Cache CDN resources (Lottie, Masonry, imagesLoaded)
      urlPattern: /^https:\/\/(cdnjs\.cloudflare\.com|unpkg\.com)\//,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'cdn-cache',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  ],
};

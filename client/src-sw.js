const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst, StaleWhileRevalidate } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");
// added StaleWhileRevalidate to check the cache first for requested information

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

// TODO: Implement asset caching
registerRoute(
  // this callback function checks the CSS and JS for the requests to be cached
  ({ request }) => ["style", "script", "worker"].includes(request.destination),
  new StaleWhileRevalidate({
    // name of cache storage
    cacheName: "asset-cache",
    plugins: [
      // this plugin will cache responses with these headers to a maximum age of 30 days
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

// the below is unnecessary and prevented the successful install prompt
// registerRoute();

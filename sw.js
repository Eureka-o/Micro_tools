const CACHE_NAME = "micro-tools-cache-v20260503-katex-58";
const CACHE_ASSETS = [
  "/",
  "/index.html",
  "/en/",
  "/en/index.html",
  "/favicon.ico",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/style.css",
  "/theme-init.js",
  "/theme-toggle.js",
  "/en/theme-init.js",
  "/en/theme-toggle.js",
  "/sponsor.js",
  "/assets/logo-web.png",
  "/assets/logo.png",
  "/aspect-ratio-calculator.html",
  "/base64-encoder.html",
  "/binary-decimal-converter.html",
  "/bland-altman-plot.html",
  "/bmi-calculator.html",
  "/box-shadow-generator.html",
  "/case-converter.html",
  "/chords-generator.html",
  "/color-converter.html",
  "/cron-generator.html",
  "/css-gradient-generator.html",
  "/csv-to-html-table.html",
  "/fraction-calculator.html",
  "/htaccess-generator.html",
  "/html-entity-encoder.html",
  "/image-compressor.html",
  "/ip-geolocation-lookup.html",
  "/ip-subnet-calculator.html",
  "/json-minify.html",
  "/json-to-csv.html",
  "/jwt-decoder.html",
  "/keycode-info.html",
  "/latex-formula-editor.html",
  "/loan-calculator.html",
  "/lorem-ipsum-generator.html",
  "/margin-padding-generator.html",
  "/markdown-table-generator.html",
  "/md5-hash-generator.html",
  "/meta-tag-generator.html",
  "/morse-code-translator.html",
  "/password-generator.html",
  "/percentage-calculator.html",
  "/pomodoro-timer.html",
  "/qr-code-generator.html",
  "/random-name-generator.html",
  "/regex-tester.html",
  "/roman-numeral-converter.html",
  "/sql-formatter.html",
  "/stopwatch.html",
  "/subnets-calculator.html",
  "/svg-to-base64.html",
  "/text-diff-checker.html",
  "/text-reverser.html",
  "/text-to-binary.html",
  "/text-to-speech-test.html",
  "/unix-timestamp-converter.html",
  "/url-encoder.html",
  "/utm-builder.html",
  "/uuid-v4-generator.html",
  "/word-counter.html",
  "/xml-formatter.html",
  "/en/aspect-ratio-calculator.html",
  "/en/base64-encoder.html",
  "/en/binary-decimal-converter.html",
  "/en/bland-altman-plot.html",
  "/en/bmi-calculator.html",
  "/en/box-shadow-generator.html",
  "/en/case-converter.html",
  "/en/chords-generator.html",
  "/en/color-converter.html",
  "/en/cron-generator.html",
  "/en/css-gradient-generator.html",
  "/en/csv-to-html-table.html",
  "/en/fraction-calculator.html",
  "/en/htaccess-generator.html",
  "/en/html-entity-encoder.html",
  "/en/image-compressor.html",
  "/en/ip-geolocation-lookup.html",
  "/en/ip-subnet-calculator.html",
  "/en/json-minify.html",
  "/en/json-to-csv.html",
  "/en/jwt-decoder.html",
  "/en/keycode-info.html",
  "/en/latex-formula-editor.html",
  "/en/loan-calculator.html",
  "/en/lorem-ipsum-generator.html",
  "/en/margin-padding-generator.html",
  "/en/markdown-table-generator.html",
  "/en/md5-hash-generator.html",
  "/en/meta-tag-generator.html",
  "/en/morse-code-translator.html",
  "/en/password-generator.html",
  "/en/percentage-calculator.html",
  "/en/pomodoro-timer.html",
  "/en/qr-code-generator.html",
  "/en/random-name-generator.html",
  "/en/regex-tester.html",
  "/en/roman-numeral-converter.html",
  "/en/sql-formatter.html",
  "/en/stopwatch.html",
  "/en/subnets-calculator.html",
  "/en/svg-to-base64.html",
  "/en/text-diff-checker.html",
  "/en/text-reverser.html",
  "/en/text-to-binary.html",
  "/en/text-to-speech-test.html",
  "/en/unix-timestamp-converter.html",
  "/en/url-encoder.html",
  "/en/utm-builder.html",
  "/en/uuid-v4-generator.html",
  "/en/word-counter.html",
  "/en/xml-formatter.html"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return cached;
        });

      return cached || network;
    })
  );
});

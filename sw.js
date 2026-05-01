const CACHE_NAME = "micro-tools-cache-v20260502-theme-50";
const CACHE_ASSETS = [
  "/",
  "/index.html",
  "/en/",
  "/en/index.html",
  "/manifest.json",
  "/theme-init.js",
  "/theme-toggle.js",
  "/en/theme-init.js",
  "/en/theme-toggle.js",
  "/assets/logo-web.png",
  "/assets/logo.png",
  "/latex-formula-editor.html",
  "/json-to-csv.html",
  "/base64-encoder.html",
  "/regex-tester.html",
  "/cron-generator.html",
  "/url-encoder.html",
  "/jwt-decoder.html",
  "/color-converter.html",
  "/md5-hash-generator.html",
  "/markdown-table-generator.html",
  "/lorem-ipsum-generator.html",
  "/word-counter.html",
  "/case-converter.html",
  "/password-generator.html",
  "/qr-code-generator.html",
  "/css-gradient-generator.html",
  "/box-shadow-generator.html",
  "/html-entity-encoder.html",
  "/text-diff-checker.html",
  "/unix-timestamp-converter.html",
  "/uuid-v4-generator.html",
  "/sql-formatter.html",
  "/image-compressor.html",
  "/pomodoro-timer.html",
  "/bmi-calculator.html",
  "/percentage-calculator.html",
  "/binary-decimal-converter.html",
  "/json-minify.html",
  "/ip-address-lookup.html",
  "/aspect-ratio-calculator.html",
  "/meta-tag-generator.html",
  "/htaccess-generator.html",
  "/utm-builder.html",
  "/svg-to-base64.html",
  "/text-to-binary.html",
  "/stopwatch.html",
  "/random-name-generator.html",
  "/csv-to-html-table.html",
  "/bland-altman-plot.html",
  "/keycode-info.html",
  "/xml-formatter.html",
  "/morse-code-translator.html",
  "/fraction-calculator.html",
  "/loan-calculator.html",
  "/text-to-speech-test.html",
  "/subnets-calculator.html",
  "/margin-padding-generator.html",
  "/text-reverser.html",
  "/chords-generator.html",
  "/roman-numeral-converter.html",
  "/en/latex-formula-editor.html",
  "/en/json-to-csv.html",
  "/en/base64-encoder.html",
  "/en/regex-tester.html",
  "/en/cron-generator.html",
  "/en/url-encoder.html",
  "/en/jwt-decoder.html",
  "/en/color-converter.html",
  "/en/md5-hash-generator.html",
  "/en/markdown-table-generator.html",
  "/en/lorem-ipsum-generator.html",
  "/en/word-counter.html",
  "/en/case-converter.html",
  "/en/password-generator.html",
  "/en/qr-code-generator.html",
  "/en/css-gradient-generator.html",
  "/en/box-shadow-generator.html",
  "/en/html-entity-encoder.html",
  "/en/text-diff-checker.html",
  "/en/unix-timestamp-converter.html",
  "/en/uuid-v4-generator.html",
  "/en/sql-formatter.html",
  "/en/image-compressor.html",
  "/en/pomodoro-timer.html",
  "/en/bmi-calculator.html",
  "/en/percentage-calculator.html",
  "/en/binary-decimal-converter.html",
  "/en/json-minify.html",
  "/en/ip-address-lookup.html",
  "/en/aspect-ratio-calculator.html",
  "/en/meta-tag-generator.html",
  "/en/htaccess-generator.html",
  "/en/utm-builder.html",
  "/en/svg-to-base64.html",
  "/en/text-to-binary.html",
  "/en/stopwatch.html",
  "/en/random-name-generator.html",
  "/en/csv-to-html-table.html",
  "/en/bland-altman-plot.html",
  "/en/keycode-info.html",
  "/en/xml-formatter.html",
  "/en/morse-code-translator.html",
  "/en/fraction-calculator.html",
  "/en/loan-calculator.html",
  "/en/text-to-speech-test.html",
  "/en/subnets-calculator.html",
  "/en/margin-padding-generator.html",
  "/en/text-reverser.html",
  "/en/chords-generator.html",
  "/en/roman-numeral-converter.html"
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

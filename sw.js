const CACHE_NAME = "micro-tools-cache-v20260505-pomodoro-audio-56";
const CACHE_ASSETS = [
  "/",
  "/apple-touch-icon.png",
  "/ascii-tree-generator.html",
  "/aspect-ratio-calculator.html",
  "/assets/logo-web.png",
  "/assets/images/og-banner.png",
  "/assets/logo.png",
  "/assets/qrcode-generator-2.0.4.js",
  "/assets/favorites.js",
  "/assets/tool-upgrades.js",
  "/assets/vendor/fonts/KaTeX_AMS-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_AMS-Regular.woff",
  "/assets/vendor/fonts/KaTeX_AMS-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Caligraphic-Bold.ttf",
  "/assets/vendor/fonts/KaTeX_Caligraphic-Bold.woff",
  "/assets/vendor/fonts/KaTeX_Caligraphic-Bold.woff2",
  "/assets/vendor/fonts/KaTeX_Caligraphic-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Caligraphic-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Caligraphic-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Fraktur-Bold.ttf",
  "/assets/vendor/fonts/KaTeX_Fraktur-Bold.woff",
  "/assets/vendor/fonts/KaTeX_Fraktur-Bold.woff2",
  "/assets/vendor/fonts/KaTeX_Fraktur-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Fraktur-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Fraktur-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Main-Bold.ttf",
  "/assets/vendor/fonts/KaTeX_Main-Bold.woff",
  "/assets/vendor/fonts/KaTeX_Main-Bold.woff2",
  "/assets/vendor/fonts/KaTeX_Main-BoldItalic.ttf",
  "/assets/vendor/fonts/KaTeX_Main-BoldItalic.woff",
  "/assets/vendor/fonts/KaTeX_Main-BoldItalic.woff2",
  "/assets/vendor/fonts/KaTeX_Main-Italic.ttf",
  "/assets/vendor/fonts/KaTeX_Main-Italic.woff",
  "/assets/vendor/fonts/KaTeX_Main-Italic.woff2",
  "/assets/vendor/fonts/KaTeX_Main-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Main-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Main-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Math-BoldItalic.ttf",
  "/assets/vendor/fonts/KaTeX_Math-BoldItalic.woff",
  "/assets/vendor/fonts/KaTeX_Math-BoldItalic.woff2",
  "/assets/vendor/fonts/KaTeX_Math-Italic.ttf",
  "/assets/vendor/fonts/KaTeX_Math-Italic.woff",
  "/assets/vendor/fonts/KaTeX_Math-Italic.woff2",
  "/assets/vendor/fonts/KaTeX_SansSerif-Bold.ttf",
  "/assets/vendor/fonts/KaTeX_SansSerif-Bold.woff",
  "/assets/vendor/fonts/KaTeX_SansSerif-Bold.woff2",
  "/assets/vendor/fonts/KaTeX_SansSerif-Italic.ttf",
  "/assets/vendor/fonts/KaTeX_SansSerif-Italic.woff",
  "/assets/vendor/fonts/KaTeX_SansSerif-Italic.woff2",
  "/assets/vendor/fonts/KaTeX_SansSerif-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_SansSerif-Regular.woff",
  "/assets/vendor/fonts/KaTeX_SansSerif-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Script-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Script-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Script-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Size1-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Size1-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Size1-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Size2-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Size2-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Size2-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Size3-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Size3-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Size3-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Size4-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Size4-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Size4-Regular.woff2",
  "/assets/vendor/fonts/KaTeX_Typewriter-Regular.ttf",
  "/assets/vendor/fonts/KaTeX_Typewriter-Regular.woff",
  "/assets/vendor/fonts/KaTeX_Typewriter-Regular.woff2",
  "/assets/vendor/html2canvas.min.js",
  "/assets/vendor/js-yaml.min.js",
  "/assets/vendor/katex.min.css",
  "/assets/vendor/katex.min.js",
  "/assets/vendor/skins/default.js",
  "/assets/vendor/wavedrom.min.js",
  "/base64-encoder.html",
  "/binary-decimal-converter.html",
  "/binary-text-converter.html",
  "/bland-altman-plot.html",

  "/box-shadow-generator.html",
  "/case-converter.html",
  "/chords-generator.html",
  "/color-converter.html",
  "/cron-generator.html",
  "/crypto-security-suite.html",
  "/css-gradient-generator.html",
  "/csv-to-html-table.html",
  "/en/",
  "/en/ascii-tree-generator.html",
  "/en/aspect-ratio-calculator.html",
  "/en/base64-encoder.html",
  "/en/binary-decimal-converter.html",
  "/en/binary-text-converter.html",
  "/en/bland-altman-plot.html",

  "/en/box-shadow-generator.html",
  "/en/case-converter.html",
  "/en/chords-generator.html",
  "/en/color-converter.html",
  "/en/cron-generator.html",
  "/en/crypto-security-suite.html",
  "/en/css-gradient-generator.html",
  "/en/csv-to-html-table.html",
  "/en/file-base64-converter.html",
  "/en/fp-quantization-visualizer.html",
  "/en/fraction-calculator.html",
  "/en/hardware-timing-diagram.html",
  "/en/htaccess-generator.html",
  "/en/html-entity-encoder.html",
  "/en/http-message-parser.html",
  "/en/image-compressor.html",
  "/en/index.html",
  "/en/ip-geolocation-lookup.html",
  "/en/ip-subnet-calculator.html",
  "/en/json-minify.html",
  "/en/json-path-extractor.html",
  "/en/json-to-csv.html",
  "/en/jwt-decoder.html",
  "/en/keycode-info.html",
  "/en/latex-formula-editor.html",
  "/en/linux-command-cheatsheet.html",
  "/en/llm-npu-memory-calculator.html",

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

  "/en/regex-tester.html",
  "/en/register-bitfield-debugger.html",

  "/en/sql-formatter.html",


  "/en/svg-to-base64.html",
  "/en/text-diff-checker.html",


  "/en/text-to-speech-test.html",
  "/en/theme-init.js",
  "/en/theme-toggle.js",
  "/en/unix-timestamp-converter.html",
  "/en/url-encoder.html",
  "/en/utm-builder.html",

  "/en/uuid-v4-generator.html",
  "/en/word-counter.html",
  "/en/yaml-json-converter.html",
  "/en/xml-formatter.html",
  "/favicon.ico",
  "/favicon.png",
  "/favicon.svg",
  "/file-base64-converter.html",
  "/fp-quantization-visualizer.html",
  "/fraction-calculator.html",
  "/hardware-timing-diagram.html",
  "/htaccess-generator.html",
  "/html-entity-encoder.html",
  "/http-message-parser.html",
  "/image-compressor.html",
  "/index.html",
  "/js/xlsx.mini.min.js",
  "/en/js/xlsx.mini.min.js",
  "/ip-geolocation-lookup.html",
  "/ip-subnet-calculator.html",
  "/json-minify.html",
  "/json-path-extractor.html",
  "/json-to-csv.html",
  "/jwt-decoder.html",
  "/keycode-info.html",
  "/latex-formula-editor.html",
  "/linux-command-cheatsheet.html",
  "/llm-npu-memory-calculator.html",

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

  "/regex-tester.html",
  "/register-bitfield-debugger.html",

  "/sponsor.js",
  "/storage.js",
  "/sql-formatter.html",

  "/style.css",

  "/svg-to-base64.html",
  "/text-diff-checker.html",


  "/text-to-speech-test.html",
  "/theme-init.js",
  "/theme-toggle.js",
  "/unix-timestamp-converter.html",
  "/url-encoder.html",
  "/utm-builder.html",

  "/uuid-v4-generator.html",
  "/word-counter.html",
  "/yaml-json-converter.html",
  "/xml-formatter.html"
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

function normalizePath(pathname) {
  if (!pathname || pathname[0] !== '/') return '/';
  return pathname.replace(/\/{2,}/g, '/');
}

function cacheCandidatesForUrl(url) {
  const pathname = normalizePath(url.pathname);
  const candidates = [];
  const add = (path) => {
    if (path && !candidates.includes(path)) candidates.push(path);
  };

  add(pathname);
  if (pathname.endsWith('/')) {
    add(pathname + 'index.html');
  } else if (!pathname.split('/').pop().includes('.')) {
    add(pathname + '.html');
    add(pathname + '/index.html');
  }

  if (pathname === '/' || pathname === '/index.html') add('/index.html');
  if (pathname === '/en' || pathname === '/en/' || pathname === '/en/index.html') {
    add('/en/');
    add('/en/index.html');
  }

  return candidates;
}

async function matchCacheCandidates(url) {
  for (const candidate of cacheCandidatesForUrl(url)) {
    const cached = await caches.match(candidate);
    if (cached) return cached;
  }
  return null;
}

async function putSuccessfulResponse(request, response) {
  if (!response || response.status !== 200 || response.type !== 'basic') return;
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
}

function offlineResponse() {
  return new Response('Offline and no cached response is available.', {
    status: 504,
    statusText: 'Gateway Timeout',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    (async () => {
      if (event.request.mode === 'navigate') {
        try {
          const response = await fetch(event.request);
          await putSuccessfulResponse(event.request, response);
          return response;
        } catch (error) {
          const cached = await matchCacheCandidates(requestUrl);
          if (cached) return cached;
          if (requestUrl.pathname.startsWith('/en/')) {
            const enHome = await caches.match('/en/index.html') || await caches.match('/en/');
            if (enHome) return enHome;
          }
          return (await caches.match('/index.html')) || offlineResponse();
        }
      }

      const cached = await matchCacheCandidates(requestUrl);
      if (cached) return cached;

      try {
        const response = await fetch(event.request);
        await putSuccessfulResponse(event.request, response);
        return response;
      } catch (error) {
        return offlineResponse();
      }
    })()
  );
});

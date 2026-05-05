# Micro Tools Matrix

Micro Tools Matrix is a collection of small, fast, browser-based utilities for everyday developer, writing, data, and productivity tasks.

Use it here: [https://mymicrotools.xyz](https://mymicrotools.xyz)

## Update Notices

### 2026-05-05 - Tool Matrix Focus Cleanup

Upgraded several lightweight pages into engineering-oriented local tools:

- Chord Generator is now a Chord Workbench with chord tones, inversions, guitar fretboard highlights, piano keyboard highlights, common progressions, and click-to-play Web Audio preview.
- Refreshed nine older homepage listings and their tool pages so Regex, Hash, QR, SQL, .htaccess, SVG Base64, CSV table, Keycode, and CSS spacing tools use current engineering-oriented names and descriptions.
- Replaced the remaining generic English homepage and tool-page descriptions with specific local-workflow wording across conversion, crypto, text, CSS, and image tools.
- Added QR error-correction controls and rechecked generated QR canvases with a decoder so the output is scannable, not just visually non-empty.
- Clamped Pomodoro Timer navigation controls to the shared 44 px pill height so theme, sponsor, and language buttons stay aligned.
- Converted WaveDrom and js-yaml pages to local lazy loading so heavy vendor scripts load only after render or conversion actions.
- Tightened the Pomodoro Timer layout at tablet and desktop widths, and expanded local Web Audio cues with tone selection, volume control, and mute persistence.
- Pomodoro Timer is now an engineering focus sprint timer with task labels, break cycles, local audio cues, and CSV session export.
- Lorem Ipsum is now a test payload and log fixture generator for JSON, CSV, log lines, and `.env` snippets.
- Morse, TTS, Fraction, Percentage, and Aspect Ratio pages now target signal encoding, browser diagnostics, PLL ratios, ppm/utilization checks, and framebuffer estimates.
- Base Converter now uses a selectable input base and simultaneous binary, octal, decimal, hexadecimal, and custom 2-36 outputs backed by BigInt.
- Meta Tag Generator is now an HTML Head / SEO Tag Auditor with local checks for canonical, Open Graph, Twitter Card, icons, hreflang, JSON-LD, and external-link risk.
- Removed weak, duplicate, or off-position pages that did not fit the hardware/developer utility direction: BMI, loan, stopwatch, random names, text reverse, Roman numerals, duplicate subnet calculator, and text-to-binary.
- Kept front-end decoration helpers, the chords generator, UTM builder, and the upgraded Pomodoro timer as intentional retained tools.
- Added layout clamps for upgraded tools so status blocks, buttons, and generated output panels do not overlap on narrow screens.
- Added shared local tool logic under `assets/tool-upgrades.js` and cached it for offline use.
- Added browser-local favorites across the homepage and individual tool pages, including a favorite-only filter, first-use storage notice, and local add/remove feedback.

### 2026-05-04 - Homepage Sharing And Social Preview

Added a cleaner sharing experience for the homepage:

- Added a homepage share action for quickly sending the site to friends or teammates.
- Added a dedicated social preview image for shared links.
- Kept the homepage layout clean by using the preview image for social cards instead of visible page content.
- Optimized some animation effects.

### 2026-05-04 - Markdown / Excel / CSV Converter Upgrade

Upgraded the Markdown table tool into a browser-local bidirectional workstation:

- Extract Markdown tables from pasted text and export CSV/XLSX.
- Convert local CSV/XLSX files into valid Markdown tables.
- Keep file parsing in browser memory with SheetJS and FileReader.

### 2026-05-04 - YAML/JSON And LLM/NPU Tools

Added two new browser-based tools:

- YAML / JSON Converter for bidirectional YAML and JSON conversion, formatting, minifying, and line-aware validation.
- LLM / NPU Memory Calculator for estimating weight memory, KV Cache, total memory, and approximate prefill compute across FP32, FP16, INT8, and INT4 precision.

### 2026-05-03 - Hardware Developer Tools

Added three browser-based hardware debugging tools:

- FP Quantization Visualizer for FP32, FP16, BFloat16, and INT8 bit inspection.
- Register Bitfield Debugger for 32/64-bit register masks with BigInt-safe state handling.
- Hardware Timing Diagram for WaveDrom-based timing waveform rendering and SVG/PNG export.

### 2026-05-03 - Ultimate Tool Expansion

Added seven new browser-based tools:

- Crypto Security Suite for AES, RC4, and RSA key workflows.
- JSON Path Extractor for JSON path lookup, formatting, and validation.
- HTTP Message Parser for structured request and response inspection.
- File Base64 Converter for file-to-Base64 and Base64-to-file workflows.
- Binary Text Converter for text and binary code conversion.
- ASCII Tree Generator for README-style directory trees.
- Linux Command Cheatsheet with searchable command examples.

### 2026-05-03 - IP Tools Upgrade

Replaced the older IP lookup page with two focused tools:

- IP Subnet Calculator for CIDR, network, broadcast, mask, host count, and usable range calculations.
- IP Geolocation Lookup for public IP detection and browser-direct geolocation lookup with a clear privacy notice.

### 2026-05-03 - LaTeX Formula Editor Upgrade

Improved the LaTeX formula editor with standard KaTeX rendering and added high-resolution image export. Formulas can now be saved as transparent PNG images for documents, slides, and papers.

### 2026-05-03 - Sharing Upgrade

Tool pages now include a share menu with two choices:

- Share Tool Only.
- Share with Data, which can include the current tool state in the shared link when the data size is reasonable.

### 2026-05-03 - Browser Experience Updates

Added site icons for browser tabs and mobile home screens, and improved bilingual page metadata so Chinese and English pages are easier for search engines and shared previews to understand.

## What You Can Do

- Convert, format, encode, decode, and inspect common text or data formats.
- Work with JSON, CSV, Base64, URLs, JWTs, Markdown tables, hashes, timestamps, colors, CSS snippets, and more.
- Use calculators and helpers for percentages, PLL ratios, aspect ratios, subnets, QR codes, UUIDs, focus timing, and other quick engineering jobs.
- Switch between Chinese and English pages where available.
- Use light, dark, or system theme mode.

## Privacy First

Most tools run directly in your browser. Your text, files, or input data are processed locally whenever the page says it is local.

Micro Tools Matrix is designed for quick, low-friction tasks without requiring an account, login, upload workflow, or remote API call for normal tool usage.

## How To Use

1. Open the website.
2. Choose a tool from the home page.
3. Paste or enter your input.
4. Run the action, then copy, download, or reuse the result.

Each tool is a standalone page, so you can bookmark the ones you use often.

## Languages

The site supports Chinese and English tool pages. Language controls are available on tool pages, and English pages are also available under `/en/`.

## Support

If Micro Tools Matrix saves you time, you can support ongoing maintenance from the Sponsor button on the site.

Feedback, bug reports, and suggestions are welcome through the project repository:
[https://github.com/Eureka-o/Micro_tools](https://github.com/Eureka-o/Micro_tools)

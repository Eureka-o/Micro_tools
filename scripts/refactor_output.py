import html as html_lib
import json
import re
import shutil
from datetime import date
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
if (SCRIPT_DIR / "index.html").exists():
    OUTPUT = SCRIPT_DIR
    ROOT = OUTPUT.parent
elif (SCRIPT_DIR.parent / "index.html").exists():
    OUTPUT = SCRIPT_DIR.parent
    ROOT = OUTPUT.parent
else:
    ROOT = SCRIPT_DIR
    OUTPUT = ROOT / "output"

BACKUP = ROOT / "output_backup"
EN_DIR = OUTPUT / "en"
TASKS = ROOT / "tasks.json"
BASE_URL = "https://mymicrotools.xyz"

DEFAULT_TASK_SLUGS = [
    'latex-formula-editor',
    'json-to-csv',
    'base64-encoder',
    'regex-tester',
    'cron-generator',
    'url-encoder',
    'jwt-decoder',
    'color-converter',
    'md5-hash-generator',
    'markdown-table-generator',
    'lorem-ipsum-generator',
    'word-counter',
    'case-converter',
    'password-generator',
    'qr-code-generator',
    'css-gradient-generator',
    'box-shadow-generator',
    'html-entity-encoder',
    'text-diff-checker',
    'unix-timestamp-converter',
    'uuid-v4-generator',
    'sql-formatter',
    'image-compressor',
    'pomodoro-timer',
    'bmi-calculator',
    'percentage-calculator',
    'binary-decimal-converter',
    'json-minify',
    'ip-address-lookup',
    'aspect-ratio-calculator',
    'meta-tag-generator',
    'htaccess-generator',
    'utm-builder',
    'svg-to-base64',
    'text-to-binary',
    'stopwatch',
    'random-name-generator',
    'csv-to-html-table',
    'bland-altman-plot',
    'keycode-info',
    'xml-formatter',
    'morse-code-translator',
    'fraction-calculator',
    'loan-calculator',
    'text-to-speech-test',
    'subnets-calculator',
    'margin-padding-generator',
    'text-reverser',
    'chords-generator',
    'roman-numeral-converter',
]


INDEX_ZH = {
    "title": "免费在线开发者工具箱 | 纯前端工具集合",
    "description": "免费在线开发者工具箱，汇集 JSON、CSV、LaTeX、Base64、正则、时间戳、二维码、颜色转换等纯前端微型工具，隐私友好、无需安装、极速加载。",
    "keywords": "免费在线开发者工具箱, 纯前端工具集合, 在线 JSON 工具, 在线编码转换工具, 生产力工具箱, 微型 Web 工具",
}

INDEX_EN = {
    "title": "Free Online Developer Toolbox | Pure Front-End Tools",
    "description": "A free online developer toolbox with pure front-end tools for JSON, CSV, LaTeX, Base64, regex, timestamps, QR codes, color conversion, and daily productivity.",
    "keywords": "free online developer tools, front-end tools, JSON tools, encoding tools, productivity toolbox, micro web tools",
}


CLASS_MAP = {
    "bg-[#030712]": ["bg-white", "dark:bg-[#030712]"],
    "bg-[#f6f8fb]": ["bg-[#f6f8fb]", "dark:bg-[#030712]"],
    "bg-[#101828]": ["bg-slate-100", "dark:bg-[#101828]"],
    "bg-gray-950": ["bg-white", "dark:bg-gray-950"],
    "bg-gray-900": ["bg-white", "dark:bg-gray-900"],
    "bg-gray-900/90": ["bg-white", "dark:bg-gray-900/90"],
    "bg-gray-800": ["bg-gray-50", "dark:bg-gray-800"],
    "bg-slate-950": ["bg-white", "dark:bg-slate-950"],
    "bg-slate-950/80": ["bg-white", "dark:bg-slate-950/80"],
    "bg-slate-950/60": ["bg-white", "dark:bg-slate-950/60"],
    "bg-slate-900": ["bg-slate-100", "dark:bg-slate-900"],
    "bg-slate-900/80": ["bg-white", "dark:bg-slate-900/80"],
    "bg-slate-900/60": ["bg-white", "dark:bg-slate-900/60"],
    "bg-slate-800": ["bg-slate-50", "dark:bg-slate-800"],
    "bg-white/5": ["bg-white", "dark:bg-white/5"],
    "bg-white/10": ["bg-white", "dark:bg-white/10"],
    "bg-white/[0.035]": ["bg-white", "dark:bg-white/[0.035]"],
    "bg-white/[0.04]": ["bg-white", "dark:bg-white/[0.04]"],
    "bg-white/[0.05]": ["bg-white", "dark:bg-white/[0.05]"],
    "bg-white/[0.06]": ["bg-white", "dark:bg-white/[0.06]"],
    "text-white": ["text-gray-900", "dark:text-white"],
    "text-slate-950": ["text-slate-950", "dark:text-slate-100"],
    "text-slate-900": ["text-slate-900", "dark:text-slate-100"],
    "text-slate-800": ["text-slate-800", "dark:text-slate-200"],
    "text-slate-700": ["text-slate-700", "dark:text-slate-300"],
    "text-slate-600": ["text-slate-600", "dark:text-slate-400"],
    "text-slate-100": ["text-slate-900", "dark:text-slate-100"],
    "text-slate-200": ["text-slate-800", "dark:text-slate-200"],
    "text-slate-300": ["text-slate-700", "dark:text-slate-300"],
    "text-gray-950": ["text-gray-950", "dark:text-gray-100"],
    "text-gray-900": ["text-gray-900", "dark:text-white"],
    "text-gray-800": ["text-gray-800", "dark:text-gray-200"],
    "text-gray-700": ["text-gray-700", "dark:text-gray-300"],
    "text-gray-600": ["text-gray-600", "dark:text-gray-400"],
    "text-gray-300": ["text-gray-700", "dark:text-gray-300"],
    "text-gray-400": ["text-gray-600", "dark:text-gray-400"],
    "border-slate-200": ["border-slate-200", "dark:border-white/10"],
    "border-slate-700/70": ["border-slate-200", "dark:border-slate-700/70"],
    "border-white/10": ["border-gray-200", "dark:border-white/10"],
    "border-white/15": ["border-gray-200", "dark:border-white/15"],
    "border-gray-700": ["border-gray-200", "dark:border-gray-700"],
    "border-gray-800": ["border-gray-200", "dark:border-gray-800"],
}


ATTRS = ("placeholder", "aria-label", "alt", "title")


EXTRA_TRANSLATIONS = {
    "赞赏 / Support": "Support / Sponsor",
    "保持工具免费且无广告 / Keep tools free & ad-free": "Keep tools free & ad-free",
    "微信": "WeChat",
    "支付宝": "Alipay",
    "已复制": "Copied",
    "复制成功": "Copied",
    "复制失败": "Copy failed",
    "复制结果": "Copy result",
    "重置": "Reset",
    "已重置": "Reset",
    "已计算": "Calculated",
    "计算等比高度": "Calculate proportional height",
    "请选择": "Please select",
    "请输入": "Please enter",
    "生成": "Generate",
    "下载": "Download",
    "清空": "Clear",
    "复制": "Copy",
    "中文": "Chinese",
    "文件名：": "File name:",
    "类型：": "Type:",
    "大小：": "Size:",
    "Base64长度：": "Base64 length:",
    " 字符": " characters",
    " 未知": " Unknown",
    "未知": "Unknown",
    "请输入需要编码的文本。": "Please enter the text to encode.",
    "文本已成功编码为 Base64。": "Text successfully encoded as Base64.",
    "编码失败，请检查输入内容。": "Encoding failed. Please check the input.",
    "解码失败，请检查输入内容。": "Decoding failed. Please check the input.",
    "文本输入和输出已清空。": "Text input and output cleared.",
    "输出区为空，无法转入输入区。": "The output area is empty and cannot be moved to the input area.",
    "输出结果已转入输入区。": "Output result moved to the input area.",
    "文本结果已复制到剪贴板。": "Text result copied to clipboard.",
    "没有可下载的文本结果。": "No text result available to download.",
    "TXT 文件已开始下载。": "TXT download has started.",
    "图片已成功还原并预览。": "Image restored and previewed successfully.",
    "图片加载失败，请确认 Base64 内容完整且图片格式受浏览器支持。": "Image loading failed. Please confirm the Base64 content is complete and the image format is supported by the browser.",
    "图片已开始下载。": "Image download has started.",
    "下载图片失败。": "Image download failed.",
    "还原中...": "Restoring...",
    "编码中...": "Encoding...",
    "解码中...": "Decoding...",
    "发生了一个意外错误，但应用仍可继续使用。请检查输入内容后重试。": "An unexpected error occurred, but the app can still continue. Please check the input and try again.",
    "操作未能完成，请稍后重试或检查输入格式。": "The operation could not be completed. Please try again later or check the input format.",
    "请先粘贴Image Base64 字符串或上传图片。": "Please paste an image Base64 string or upload an image first.",
    "Data URL 中的 Base64 数据格式不正确。": "The Base64 data in the Data URL is invalid.",
    "Image Base64 格式不正确，请粘贴 data:image/...;base64,... 或合法的纯 Base64 字符串。": "Invalid image Base64 format. Please paste data:image/...;base64,... or a valid plain Base64 string.",
    "无法识别图片类型。若使用纯 Base64，请确认它来自 PNG、JPG、GIF、WebP 或 SVG 图片。": "Unable to identify the image type. If using plain Base64, confirm it comes from a PNG, JPG, GIF, WebP, or SVG image.",
    "Image Base64 和预览已Clear。": "Image Base64 and preview cleared.",
    "Image Base64 Copied到剪贴板。": "Image Base64 copied to clipboard.",
    "Restore image失败。": "Restore image failed.",
    "Download image失败。": "Image download failed.",
    "Please enter需要编码的文本。": "Please enter the text to encode.",
    "文本已成功Encode as Base64。": "Text successfully encoded as Base64.",
    "Base64 已成功Decode as text。": "Base64 decoded as text successfully.",
    "文本输入和输出已Clear。": "Text input and output cleared.",
    "文本结果Copied到剪贴板。": "Text result copied to clipboard.",
    "没有可Download的文本结果。": "No text result available to download.",
    "TXT 文件已开始Download。": "TXT download has started.",
}


THEME_INIT = """(() => {
  const key = 'microToolsTheme';
  const root = document.documentElement;
  const stored = localStorage.getItem(key);
  const preferred = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = stored || preferred;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
})();
"""


THEME_TOGGLE = """(() => {
  const key = 'microToolsTheme';
  const root = document.documentElement;

  function currentTheme() {
    return root.classList.contains('dark') ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    root.classList.toggle('dark', next === 'dark');
    root.dataset.theme = next;
    localStorage.setItem(key, next);
    document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(next === 'dark'));
      button.setAttribute('title', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme-toggle]');
    if (!button) return;
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTheme(currentTheme()));
  } else {
    applyTheme(currentTheme());
  }
})();
"""


def parse_braced(source, start):
    brace = source.find("{", start)
    if brace < 0:
        return None
    depth = 0
    in_string = None
    escaped = False
    for i in range(brace, len(source)):
        ch = source[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == in_string:
                in_string = None
            continue
        if ch in ("'", '"', "`"):
            in_string = ch
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return source[brace : i + 1]
    return None


def extract_const(source, name):
    marker = f"const {name} ="
    pos = source.find(marker)
    if pos < 0:
        return {}
    raw = parse_braced(source, pos + len(marker))
    if not raw:
        return {}
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {}


def collect_global_translations(files):
    merged = {}
    for path in files:
        source = path.read_text(encoding="utf-8")
        merged.update(extract_const(source, "TRANSLATIONS"))
    return merged


def load_task_slugs():
    if not TASKS.exists():
        return list(DEFAULT_TASK_SLUGS)
    tasks = json.loads(TASKS.read_text(encoding="utf-8"))
    slugs = []
    for task in tasks:
        name = str(task.get("name", "")).strip()
        if name and name not in slugs:
            slugs.append(name)
    return slugs


def remove_i18n(source):
    return re.sub(
        r"\s*<!-- micro-tools-i18n:start -->.*?<!-- micro-tools-i18n:end -->",
        "",
        source,
        flags=re.S,
    )


def apply_raw_translations(source, translations):
    merged = dict(translations)

    def safe_raw_key(value):
        text = str(value or "")
        cjk_count = len(re.findall(r"[\u4e00-\u9fff]", text))
        has_sentence_mark = bool(re.search(r"[，。！？；：（）“”《》、：]", text))
        has_template_or_tag = "${" in text or "<" in text or ">" in text
        return cjk_count >= 4 or has_sentence_mark or has_template_or_tag

    pairs = [
        *[(zh, en) for zh, en in merged.items() if safe_raw_key(zh)],
        *EXTRA_TRANSLATIONS.items(),
    ]
    pairs = sorted(
        pairs,
        key=lambda item: len(item[0]),
        reverse=True,
    )
    for zh, en in pairs:
        if not zh or zh == en:
            continue
        source = source.replace(zh, en)
        source = source.replace(html_lib.escape(zh, quote=True), html_lib.escape(en, quote=True))
        source = source.replace(html_lib.escape(zh, quote=False), html_lib.escape(en, quote=False))
    return source


def translate_exact(value, translations):
    text = str(value or "")
    if not text:
        return text
    if text in translations:
        return translations[text]
    normalized = re.sub(r"\s+", " ", text).strip()
    if normalized in translations:
        return translations[normalized]
    dynamic = [
        (r"^(\d+)\s*个字符$", r"\1 characters"),
        (r"^(\d+)\s*字符$", r"\1 characters"),
        (r"^(\d+)\s*字$", r"\1 characters"),
        (r"^(\d+)\s*行$", r"\1 rows"),
        (r"^(\d+)\s*列$", r"\1 columns"),
        (r"^(\d+)\s*项$", r"\1 items"),
        (r"^(\d+)\s*次$", r"\1 times"),
        (r"^当前显示\s*(\d+)\s*/\s*(\d+)$", r"Showing \1 / \2"),
    ]
    for pattern, repl in dynamic:
        if re.search(pattern, normalized):
            return re.sub(pattern, repl, normalized)
    return text


def translate_text(value, translations):
    leading = re.match(r"^\s*", value).group(0)
    trailing = re.search(r"\s*$", value).group(0)
    core = value[len(leading) : len(value) - len(trailing)]
    if not core.strip():
        return value
    return leading + translate_exact(core, translations) + trailing


def translate_visible_segments(source, translations):
    protected = re.compile(r"(<(?:script|style|textarea|pre|code)\b[^>]*>.*?</(?:script|style|textarea|pre|code)>)", re.I | re.S)
    parts = protected.split(source)

    def translate_segment(segment):
        def text_repl(match):
            return ">" + translate_text(match.group(1), translations) + "<"

        def attr_repl(match):
            quote = match.group(2)
            return f'{match.group(1)}={quote}{html_lib.escape(translate_exact(html_lib.unescape(match.group(3)), translations), quote=True)}{quote}'

        segment = re.sub(r">([^<>]+)<", text_repl, segment)
        segment = re.sub(rf"\b({'|'.join(ATTRS)})=(['\"])(.*?)\2", attr_repl, segment, flags=re.I | re.S)
        return segment

    for i in range(0, len(parts), 2):
        parts[i] = translate_segment(parts[i])
    return "".join(parts)


def transform_class_value(value):
    tokens = value.split()
    existing = set(tokens)
    result = []
    for token in tokens:
        if token in CLASS_MAP and f"dark:{token}" not in existing:
            result.extend(CLASS_MAP[token])
        else:
            result.append(token)
    deduped = []
    seen = set()
    for token in result:
        if token not in seen:
            seen.add(token)
            deduped.append(token)
    return " ".join(deduped)


def inject_theme_classes(source):
    def repl(match):
        return f'{match.group(1)}{transform_class_value(match.group(2))}{match.group(3)}'

    return re.sub(r'(class=")([^"]*)(")', repl, source)


def rewrite_first_article(source, heading, paragraphs):
    match = re.search(r"<article\b[^>]*>.*?</article>", source, flags=re.I | re.S)
    if not match:
        return source
    article = match.group(0)
    class_match = re.search(r'<article\b([^>]*)>', article, flags=re.I | re.S)
    attrs = class_match.group(1) if class_match else ""
    body = [f"<article{attrs}>", f'      <h2 class="mb-4 text-2xl font-bold text-slate-950 dark:text-white">{html_lib.escape(heading)}</h2>']
    for paragraph in paragraphs:
        body.append(f'      <p class="mt-4 leading-8 text-slate-700 dark:text-slate-300">{html_lib.escape(paragraph)}</p>')
    body.append("    </article>")
    return source[: match.start()] + "\n".join(body) + source[match.end() :]


def localize_english_index(source):
    source = re.sub(
        r"<h1\b[^>]*>.*?</h1>",
        '<h1 class="text-[2.35rem] font-black leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl xl:text-7xl"><span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Developer</span> Productivity Toolbox</h1>',
        source,
        count=1,
        flags=re.I | re.S,
    )
    source = re.sub(r'aria-label="页脚链接"', 'aria-label="Footer links"', source)
    source = re.sub(r'(<a id="footerHomeLink"[^>]*>).*?(</a>)', r"\1Home\2", source, count=1, flags=re.I | re.S)
    source = re.sub(r'(<a id="footerSitemapLink"[^>]*>).*?(</a>)', r"\1Sitemap\2", source, count=1, flags=re.I | re.S)
    source = re.sub(
        r'(<p id="footerNote"[^>]*>).*?(</p>)',
        r"\1A pure front-end collection of micro tools for daily development and productivity work. Most inputs are processed locally in your browser; availability and third-party CDN behavior may vary by network environment.\2",
        source,
        count=1,
        flags=re.I | re.S,
    )
    return source


def localize_english_article(source, filename, current_tool):
    if filename == "index.html" or not current_tool:
        return source
    name = current_tool.get("enName") or filename[:-5].replace("-", " ").title()
    description = current_tool.get("enDescription") or f"{name} is a free online browser-based tool."
    heading = f"About {name}"
    paragraphs = [
        f"{description} This page is designed as a lightweight, static, browser-friendly utility that opens quickly and keeps the core workflow focused.",
        f"Use {name} for everyday development, data cleanup, formatting, conversion, validation, or productivity tasks without installing extra desktop software. Whenever the tool processes input, it is intended to run locally in the browser as much as possible, helping reduce unnecessary uploads and keeping the experience fast.",
    ]
    return rewrite_first_article(source, heading, paragraphs)


def enhance_sponsor_hash(source, filename):
    if filename != "index.html" or "window.MicroToolsSponsor = { openModal, closeModal };" not in source:
        return source
    snippet = """if (window.location.hash === '#sponsorModal') {
        window.setTimeout(openModal, 80);
      }

      window.addEventListener('hashchange', () => {
        if (window.location.hash === '#sponsorModal') openModal();
      });

      window.MicroToolsSponsor = { openModal, closeModal };"""
    return source.replace("window.MicroToolsSponsor = { openModal, closeModal };", snippet, 1)


def ensure_tailwind_dark_mode(source):
    if "cdn.tailwindcss.com" not in source or "tailwind.config" in source:
        return source
    return source.replace(
        '<script src="https://cdn.tailwindcss.com"></script>',
        '<script>tailwind.config = { darkMode: "class" };</script>\n  <script src="https://cdn.tailwindcss.com"></script>',
        1,
    )


def set_html_lang(source, lang):
    return re.sub(r"<html\b[^>]*>", f'<html lang="{lang}">', source, count=1, flags=re.I)


def set_title(source, title):
    escaped = html_lib.escape(title, quote=False)
    if re.search(r"<title>.*?</title>", source, flags=re.I | re.S):
        return re.sub(r"<title>.*?</title>", f"<title>{escaped}</title>", source, count=1, flags=re.I | re.S)
    return source.replace("</head>", f"  <title>{escaped}</title>\n</head>", 1)


def set_meta(source, name, content):
    escaped = html_lib.escape(content, quote=True)
    pattern = rf'<meta\s+name="{re.escape(name)}"\s+content="[^"]*"\s*/?>'
    replacement = f'<meta name="{name}" content="{escaped}">'
    if re.search(pattern, source, flags=re.I):
        return re.sub(pattern, replacement, source, count=1, flags=re.I)
    return source.replace("</head>", f"  {replacement}\n</head>", 1)


def xml_escape(value):
    return html_lib.escape(str(value), quote=True)


def generate_sitemap(slugs):
    today = date.today().isoformat()
    xhtml = "http://www.w3.org/1999/xhtml"
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]

    def add_url(loc, zh_href, en_href, changefreq, priority):
        lines.extend(
            [
                "  <url>",
                f"    <loc>{xml_escape(loc)}</loc>",
                f'    <xhtml:link rel="alternate" hreflang="zh-CN" href="{xml_escape(zh_href)}" />',
                f'    <xhtml:link rel="alternate" hreflang="en" href="{xml_escape(en_href)}" />',
                f'    <xhtml:link rel="alternate" hreflang="x-default" href="{xml_escape(zh_href)}" />',
                f"    <lastmod>{today}</lastmod>",
                f"    <changefreq>{changefreq}</changefreq>",
                f"    <priority>{priority}</priority>",
                "  </url>",
            ]
        )

    add_url(f"{BASE_URL}/", f"{BASE_URL}/", f"{BASE_URL}/en/", "weekly", "1.0")
    add_url(f"{BASE_URL}/en/", f"{BASE_URL}/", f"{BASE_URL}/en/", "weekly", "1.0")
    for slug in slugs:
        zh = f"{BASE_URL}/{slug}.html"
        en = f"{BASE_URL}/en/{slug}.html"
        add_url(zh, zh, en, "monthly", "0.8")
        add_url(en, zh, en, "monthly", "0.8")
    lines.append("</urlset>")
    (OUTPUT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def cleanup_publish_artifacts():
    for name in ("playwright", "_verify_shots", "__pycache__"):
        path = OUTPUT / name
        if path.exists() and path.is_dir():
            shutil.rmtree(path)


def page_urls(filename):
    if filename == "index.html":
        return f"{BASE_URL}/", f"{BASE_URL}/en/"
    return f"{BASE_URL}/{filename}", f"{BASE_URL}/en/{filename}"


def clean_head_injections(source):
    source = re.sub(r'\s*<script\s+src="(?:\./|\.\./)?theme-init\.js"></script>', "", source)
    source = re.sub(r'\s*<script\s+src="(?:\./|\.\./)?theme-toggle\.js"\s+defer></script>', "", source)
    source = re.sub(r'\s*<link\s+rel="alternate"\s+hreflang="[^"]+"\s+href="[^"]+"\s*/?>', "", source)
    source = re.sub(r'\s*<link\s+rel="canonical"\s+href="[^"]+"\s*/?>', "", source)
    return source


def script_prefix(lang):
    return "." if lang == "zh" else "."


def inject_head_seo(source, filename, lang):
    zh_url, en_url = page_urls(filename)
    self_url = en_url if lang == "en" else zh_url
    source = clean_head_injections(source)
    tags = [
        f'  <script src="{script_prefix(lang)}/theme-init.js"></script>',
        f'  <link rel="canonical" href="{self_url}">',
        f'  <link rel="alternate" hreflang="zh-CN" href="{zh_url}">',
        f'  <link rel="alternate" hreflang="en" href="{en_url}">',
        f'  <link rel="alternate" hreflang="x-default" href="{zh_url}">',
        f'  <script src="{script_prefix(lang)}/theme-toggle.js" defer></script>',
    ]
    return source.replace("</head>", "\n".join(tags) + "\n</head>", 1)


def static_controls(filename, lang):
    is_index = filename == "index.html"
    if lang == "zh":
        home = "./index.html"
        logo = "./assets/logo-web.png"
        zh_href = "./index.html" if filename == "index.html" else f"./{filename}"
        en_href = "./en/" if filename == "index.html" else f"./en/{filename}"
        sponsor_href = "#sponsorModal" if is_index else "./index.html#sponsorModal"
        sponsor = "赞赏"
        toggle_label = "切换主题"
    else:
        home = "./index.html"
        logo = "../assets/logo-web.png"
        zh_href = "../index.html" if filename == "index.html" else f"../{filename}"
        en_href = "./index.html" if filename == "index.html" else f"./{filename}"
        sponsor_href = "#sponsorModal" if is_index else "./index.html#sponsorModal"
        sponsor = "Sponsor"
        toggle_label = "Toggle theme"
    zh_class = "bg-cyan-400 text-slate-950" if lang == "zh" else "text-slate-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
    en_class = "bg-cyan-400 text-slate-950" if lang == "en" else "text-slate-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-white/10"
    spacer = "" if is_index else '  <div class="h-20" aria-hidden="true"></div>\n'
    return f"""
  <!-- static-controls:start -->
  <nav id="siteControls" class="fixed left-1/2 top-4 z-50 flex w-[92%] max-w-7xl -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-gray-200 bg-white/85 p-1.5 text-sm font-semibold text-gray-900 shadow-2xl shadow-black/10 backdrop-blur-md dark:border-white/10 dark:bg-[#030712]/75 dark:text-white" aria-label="Site controls">
    <a href="{home}" class="flex min-w-0 items-center gap-2 pl-1" aria-label="Micro Tools Matrix">
      <img src="{logo}" alt="Micro Tools Matrix logo" width="40" height="40" class="h-10 w-10 shrink-0 rounded-full bg-white object-contain p-0.5 ring-1 ring-cyan-300/25 dark:bg-white/10">
      <span class="truncate text-xs tracking-wide text-slate-800 dark:text-slate-200 sm:text-sm">Micro Tools</span>
    </a>
    <div class="flex shrink-0 items-center gap-1">
      <a id="openSponsorBtn" href="{sponsor_href}" class="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs text-slate-900 shadow-[0_0_22px_-12px_rgba(34,211,238,0.9)] transition-all hover:border-cyan-400/60 hover:bg-cyan-500 hover:text-black active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-slate-50 sm:text-sm md:px-5"><span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-300 text-lg leading-none text-slate-950 shadow-lg shadow-yellow-400/30 ring-1 ring-yellow-100/80">☕</span><span class="hidden sm:inline">{sponsor}</span><span class="sm:hidden">☕</span></a>
      <div class="flex items-center gap-1">
        <a href="{zh_href}" hreflang="zh-CN" class="min-h-11 rounded-full px-3 py-2 transition active:scale-95 md:min-h-0 md:py-1.5 {zh_class}">中文</a>
        <a href="{en_href}" hreflang="en" class="min-h-11 rounded-full px-3 py-2 transition active:scale-95 md:min-h-0 md:py-1.5 {en_class}">EN</a>
        <button type="button" data-theme-toggle class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-900 transition hover:border-cyan-400/60 hover:bg-cyan-500 hover:text-black active:scale-95 dark:border-white/10 dark:bg-white/10 dark:text-white" aria-label="{toggle_label}" title="{toggle_label}">
          <svg class="h-5 w-5 dark:hidden" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4V2m0 20v-2m8-8h2M2 12h2m14.95-6.95 1.41-1.41M3.64 20.36l1.41-1.41m0-13.9L3.64 3.64m16.72 16.72-1.41-1.41M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          <svg class="hidden h-5 w-5 dark:block" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 14.4A7.8 7.8 0 0 1 9.6 3 8.8 8.8 0 1 0 21 14.4Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  </nav>
{spacer.rstrip()}
  <!-- static-controls:end -->
"""


def inject_controls(source, filename, lang):
    source = re.sub(r"\s*<!-- static-controls:start -->.*?<!-- static-controls:end -->", "", source, flags=re.S)
    match = re.search(r"<body\b[^>]*>", source, flags=re.I)
    if not match:
        return source
    return source[: match.end()] + static_controls(filename, lang) + source[match.end() :]


def adjust_en_paths(source):
    source = source.replace('href="./assets/', 'href="../assets/')
    source = source.replace('src="./assets/', 'src="../assets/')
    source = source.replace('content="./assets/', 'content="../assets/')
    source = source.replace('href="./sitemap.xml"', 'href="../sitemap.xml"')
    return source


def card_html(slug, data, lang):
    title = data.get("enName" if lang == "en" else "zhName", slug)
    desc = data.get("enDescription" if lang == "en" else "zhDescription", "")
    search = f"{slug} {data.get('zhName', '')} {data.get('enName', '')} {data.get('zhDescription', '')} {data.get('enDescription', '')}"
    return (
        f'<a href="./{slug}.html" class="card group flex h-full min-h-48 flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-white/[0.06] hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 md:p-8" data-search="{html_lib.escape(search.lower().replace("-", "").replace("_", "").replace(" ", ""), quote=True)}">'
        f'<h3 class="text-base font-semibold leading-6 text-slate-100 transition-colors group-hover:text-cyan-200 md:text-lg">{html_lib.escape(title)}</h3>'
        f'<p class="mt-4 line-clamp-2 text-sm leading-6 text-slate-400">{html_lib.escape(desc)}</p>'
        "</a>"
    )


def update_index(source, tool_data, lang):
    items = [
        {"name": slug, "displayName": data.get("enName" if lang == "en" else "zhName", slug), "description": data.get("enDescription" if lang == "en" else "zhDescription", "")}
        for slug, data in tool_data.items()
    ]
    source = re.sub(
        r"const tools = \[.*?\];",
        "const tools = " + json.dumps(items, ensure_ascii=False) + ";",
        source,
        count=1,
        flags=re.S,
    )
    source = source.replace("tool.name + ' ' + tool.description", "tool.name + ' ' + (tool.displayName || '') + ' ' + tool.description")
    source = source.replace("title.textContent = tool.name;", "title.textContent = tool.displayName || tool.name;")
    source = re.sub(
        r"totalCountHero\.textContent\s*=\s*['\"]\d+['\"];",
        "totalCountHero.textContent = String(tools.length);",
        source,
        count=1,
    )
    source = re.sub(
        r'(<strong id="totalCountHero"[^>]*>)\d+(</strong>)',
        rf"\g<1>{len(items)}\2",
        source,
        count=1,
        flags=re.I | re.S,
    )
    cards = "\n".join(card_html(item["name"], tool_data[item["name"]], lang) for item in items)
    source = re.sub(
        r'(<section id="toolGrid"[^>]*>).*?(</section>)',
        lambda m: m.group(1) + "\n" + cards + "\n" + m.group(2),
        source,
        count=1,
        flags=re.S,
    )
    if lang == "en":
        source = source.replace('placeholder="搜索工具名称或描述，例如 JSON、Base64、颜色、时间戳..."', 'placeholder="Search tool names or descriptions, such as JSON, Base64, color, timestamp..."')
        source = source.replace("当前显示", "Showing")
        source = source.replace("没有找到匹配的工具，请尝试更短的关键词。", "No matching tools found. Try a shorter keyword.")
    return source


def set_page_meta(source, filename, lang, tool_data, current_tool):
    if filename == "index.html":
        meta = INDEX_EN if lang == "en" else INDEX_ZH
    else:
        data = current_tool or tool_data.get(filename[:-5], {})
        meta = {
            "title": data.get("enTitle" if lang == "en" else "zhTitle", ""),
            "description": data.get("enDescription" if lang == "en" else "zhDescription", ""),
            "keywords": data.get("enKeywords" if lang == "en" else "zhKeywords", ""),
        }
    if meta.get("title"):
        source = set_title(source, meta["title"])
    if meta.get("description"):
        source = set_meta(source, "description", meta["description"])
    if meta.get("keywords"):
        source = set_meta(source, "keywords", meta["keywords"])
    return source


def process_html(source, filename, lang, translations, tool_data, current_tool, allowed_slugs=None):
    if lang == "en":
        source = apply_raw_translations(source, translations)
    source = remove_i18n(source)
    source = ensure_tailwind_dark_mode(source)
    if lang == "en":
        source = translate_visible_segments(source, translations)
        if filename == "index.html":
            source = localize_english_index(source)
        else:
            source = localize_english_article(source, filename, current_tool)
        source = adjust_en_paths(source)
    source = set_html_lang(source, "en" if lang == "en" else "zh-CN")
    source = set_page_meta(source, filename, lang, tool_data, current_tool)
    if filename == "index.html":
        if allowed_slugs:
            tool_data = {slug: tool_data[slug] for slug in allowed_slugs if slug in tool_data}
        source = update_index(source, tool_data, lang)
    source = inject_controls(source, filename, lang)
    source = inject_head_seo(source, filename, lang)
    source = inject_theme_classes(source)
    source = enhance_sponsor_hash(source, filename)
    return source


def main():
    if not OUTPUT.exists():
        raise SystemExit("FAIL: ./output does not exist.")
    backup_status = f"PASS ({BACKUP})"
    if not BACKUP.exists():
        backup_status = "SKIP (output_backup is not present in this publish repository copy)"

    task_slugs = load_task_slugs()
    if task_slugs:
        allowed_names = {"index.html", *(f"{slug}.html" for slug in task_slugs)}
        removed = []
        for path in OUTPUT.glob("*.html"):
            if path.name not in allowed_names:
                path.unlink()
                removed.append(path.name)
        html_files = [OUTPUT / "index.html", *(OUTPUT / f"{slug}.html" for slug in task_slugs if (OUTPUT / f"{slug}.html").exists())]
    else:
        removed = []
        html_files = sorted(path for path in OUTPUT.glob("*.html") if path.is_file())
    global_translations = collect_global_translations(html_files)
    if EN_DIR.exists():
        shutil.rmtree(EN_DIR)
    EN_DIR.mkdir(parents=True)

    (OUTPUT / "theme-init.js").write_text(THEME_INIT, encoding="utf-8", newline="\n")
    (OUTPUT / "theme-toggle.js").write_text(THEME_TOGGLE, encoding="utf-8", newline="\n")
    (EN_DIR / "theme-init.js").write_text(THEME_INIT, encoding="utf-8", newline="\n")
    (EN_DIR / "theme-toggle.js").write_text(THEME_TOGGLE, encoding="utf-8", newline="\n")

    processed = 0
    i18n_pages = 0
    for path in html_files:
        original = path.read_text(encoding="utf-8")
        had_i18n = "micro-tools-i18n:start" in original and "localStorage.getItem(STORAGE_KEY)" in original
        if had_i18n:
            i18n_pages += 1
        translations = dict(global_translations)
        translations.update(extract_const(original, "TRANSLATIONS"))
        tool_data = extract_const(original, "TOOL_DATA")
        current_tool = extract_const(original, "CURRENT_TOOL")

        zh_html = process_html(original, path.name, "zh", translations, tool_data, current_tool, task_slugs)
        en_html = process_html(original, path.name, "en", translations, tool_data, current_tool, task_slugs)
        path.write_text(zh_html, encoding="utf-8", newline="\n")
        (EN_DIR / path.name).write_text(en_html, encoding="utf-8", newline="\n")
        processed += 1

    sitemap_slugs = task_slugs or [path.stem for path in html_files if path.name != "index.html"]
    generate_sitemap(sitemap_slugs)
    cleanup_publish_artifacts()

    print("Audit: runtime i18n blocks using front-end JS/localStorage are SEO-unfriendly for English indexing.")
    print(f"Backup check: {backup_status}")
    print(f"HTML pages processed: {processed}")
    print(f"HTML pages removed because they are not in tasks.json: {len(removed)}")
    if removed:
        print("Removed pages: " + ", ".join(removed))
    print(f"Runtime i18n pages detected and removed: {i18n_pages}")
    print(f"English static pages generated: {len(list(EN_DIR.glob('*.html')))}")
    print("Theme files generated: output/theme-init.js, output/theme-toggle.js")
    print("Sitemap generated: output/sitemap.xml")


if __name__ == "__main__":
    main()

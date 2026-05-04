(() => {
  "use strict";

  const COPY = {
    zh: {
      copied: "结果已复制到剪贴板。",
      copyFailed: "复制失败，请手动选择结果文本复制。",
      downloadEmpty: "当前没有可下载的结果。",
      invalidInput: "请检查输入值，至少需要填写有效的正数。",
      generated: "已在浏览器本地生成结果。",
      noSpeech: "当前浏览器不支持 SpeechSynthesis。",
      noVoices: "当前浏览器尚未返回可用语音，请稍后刷新语音列表。",
      audioBlocked: "浏览器暂时阻止了音频播放，请先点击页面后重试。",
    },
    en: {
      copied: "Result copied to clipboard.",
      copyFailed: "Copy failed. Please select the result manually.",
      downloadEmpty: "There is no result to download yet.",
      invalidInput: "Please check the inputs. Valid positive numbers are required.",
      generated: "Result generated locally in your browser.",
      noSpeech: "This browser does not support SpeechSynthesis.",
      noVoices: "The browser has not returned any voices yet. Refresh the voice list shortly.",
      audioBlocked: "The browser blocked audio playback for now. Click the page and try again.",
    },
  };

  const $ = (id) => document.getElementById(id);
  const lang = () => (document.documentElement.lang || "").toLowerCase().startsWith("zh") ? "zh" : "en";
  const text = (zh, en) => (lang() === "zh" ? zh : en);

  function setStatus(message, tone = "info") {
    const el = $("statusMessage");
    if (!el) return;
    const toneClass = {
      info: "border-cyan-200 bg-cyan-50 text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200",
      ok: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
      warn: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
      danger: "border-red-200 bg-red-50 text-red-800 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
    }[tone] || "";
    el.className = "mt-4 min-h-11 w-full max-w-full overflow-hidden break-words rounded-xl border px-4 py-3 text-sm leading-6 " + toneClass;
    el.textContent = message;
  }

  function injectLayoutClamp() {
    if (document.getElementById("toolUpgradeLayoutClamp")) return;
    const style = document.createElement("style");
    style.id = "toolUpgradeLayoutClamp";
    style.textContent = [
      "#toolApp,#toolApp *{min-width:0}",
      "#toolApp .tool-primary,#toolApp .tool-secondary{max-width:100%;white-space:normal;text-align:center;overflow-wrap:anywhere}",
      "#toolApp #statusMessage{width:100%;max-width:100%;overflow-wrap:anywhere}",
      "#toolApp>section.grid{grid-template-columns:minmax(0,1fr)}",
      "@media (min-width:1024px){#toolApp>section.grid{grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr)!important}}"
    ].join("\n");
    document.head.append(style);
  }

  function alertInvalid(message) {
    alert(message || COPY[lang()].invalidInput);
  }

  function numberValue(id) {
    const node = $(id);
    const value = node ? Number(node.value) : NaN;
    return Number.isFinite(value) ? value : NaN;
  }

  function positiveNumber(id, min = 0, max = Number.POSITIVE_INFINITY) {
    const value = numberValue(id);
    if (!Number.isFinite(value) || value <= min || value > max) throw new Error("Invalid number: " + id);
    return value;
  }

  function intValue(id, min, max) {
    const value = Math.round(positiveNumber(id, min - 1, max));
    return Math.max(min, Math.min(max, value));
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement("textarea");
        area.value = value;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        document.body.append(area);
        area.select();
        document.execCommand("copy");
        area.remove();
      }
      setStatus(COPY[lang()].copied, "ok");
    } catch {
      setStatus(COPY[lang()].copyFailed, "warn");
    }
  }

  function downloadText(filename, value, type = "text/plain;charset=utf-8") {
    if (!value) {
      setStatus(COPY[lang()].downloadEmpty, "warn");
      return;
    }
    const blob = new Blob([value], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function bindResultButtons(defaultName) {
    const output = $("outputText") || $("morseOutput");
    const copyBtn = $("copyOutputBtn");
    const downloadBtn = $("downloadOutputBtn");
    if (copyBtn && output) copyBtn.addEventListener("click", () => copyText(output.value || output.textContent || ""));
    if (downloadBtn && output) downloadBtn.addEventListener("click", () => downloadText(defaultName, output.value || output.textContent || ""));
  }

  function pad2(value) {
    return String(value).padStart(2, "0");
  }

  function initPomodoro() {
    const originalTitle = document.title;
    const labels = {
      zh: { focus: "专注", short: "短休息", long: "长休息", start: "开始", pause: "暂停", ready: "准备开始", done: "阶段完成", exported: "专注记录已生成。" },
      en: { focus: "Focus", short: "Short Break", long: "Long Break", start: "Start", pause: "Pause", ready: "Ready", done: "Phase complete", exported: "Focus log generated." },
    };
    const state = {
      mode: "focus",
      cycle: 1,
      remaining: 25 * 60,
      total: 25 * 60,
      running: false,
      targetAt: 0,
      timer: 0,
      log: [],
    };

    function t(key) {
      return labels[lang()][key];
    }

    function settings() {
      return {
        focus: intValue("focusMinutes", 1, 240),
        short: intValue("shortBreakMinutes", 1, 120),
        long: intValue("longBreakMinutes", 1, 180),
        longEvery: intValue("longBreakEvery", 1, 12),
        task: ($("taskInput")?.value || "").trim(),
      };
    }

    function secondsFor(mode, s = settings()) {
      if (mode === "short") return s.short * 60;
      if (mode === "long") return s.long * 60;
      return s.focus * 60;
    }

    function modeLabel(mode = state.mode) {
      return t(mode);
    }

    function render() {
      const minutes = Math.floor(state.remaining / 60);
      const seconds = state.remaining % 60;
      const display = pad2(minutes) + ":" + pad2(seconds);
      if ($("timerDisplay")) $("timerDisplay").textContent = display;
      if ($("modeText")) $("modeText").textContent = modeLabel();
      if ($("cycleText")) $("cycleText").textContent = String(state.cycle);
      if ($("startPauseBtn")) $("startPauseBtn").textContent = state.running ? t("pause") : t("start");
      if ($("progressBar")) {
        const done = state.total ? Math.max(0, Math.min(100, ((state.total - state.remaining) / state.total) * 100)) : 0;
        $("progressBar").style.width = done.toFixed(2) + "%";
      }
      const task = ($("taskInput")?.value || "").trim();
      const titlePrefix = state.running ? display + " " + modeLabel() : modeLabel();
      document.title = state.running ? titlePrefix + (task ? " - " + task : "") : originalTitle;
    }

    function appendLog(reason) {
      const now = new Date();
      const item = {
        time: now.toISOString(),
        mode: modeLabel(),
        cycle: state.cycle,
        plannedMinutes: Math.round(state.total / 60),
        task: ($("taskInput")?.value || "").trim(),
        reason,
      };
      state.log.push(item);
      if ($("logList")) {
        $("logList").textContent = state.log
          .slice(-8)
          .map((entry) => `${entry.time} | ${entry.mode} | #${entry.cycle} | ${entry.plannedMinutes}m | ${entry.task || "-"} | ${entry.reason}`)
          .join("\n");
      }
    }

    function stopInterval() {
      window.clearInterval(state.timer);
      state.timer = 0;
      state.running = false;
    }

    function startInterval() {
      state.targetAt = Date.now() + state.remaining * 1000;
      state.running = true;
      state.timer = window.setInterval(() => {
        state.remaining = Math.max(0, Math.ceil((state.targetAt - Date.now()) / 1000));
        if (state.remaining <= 0) completePhase("finished");
        render();
      }, 250);
      render();
    }

    function nextMode() {
      const s = settings();
      if (state.mode === "focus") {
        if (state.cycle > 0 && state.cycle % s.longEvery === 0) return "long";
        return "short";
      }
      state.cycle += 1;
      return "focus";
    }

    function resetTo(mode = "focus") {
      stopInterval();
      state.mode = mode;
      state.total = secondsFor(mode);
      state.remaining = state.total;
      render();
    }

    function completePhase(reason) {
      stopInterval();
      appendLog(reason);
      beep();
      state.mode = nextMode();
      state.total = secondsFor(state.mode);
      state.remaining = state.total;
      setStatus(t("done") + ": " + modeLabel(), "ok");
      render();
    }

    function beep() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } catch {
        setStatus(COPY[lang()].audioBlocked, "warn");
      }
    }

    $("startPauseBtn")?.addEventListener("click", () => {
      try {
        settings();
        if (state.running) {
          state.remaining = Math.max(1, Math.ceil((state.targetAt - Date.now()) / 1000));
          stopInterval();
          render();
          return;
        }
        startInterval();
        setStatus(text("计时已开始，所有状态仅保存在当前浏览器内存。", "Timer started. State stays in this browser tab."), "ok");
      } catch {
        alertInvalid();
      }
    });
    $("resetBtn")?.addEventListener("click", () => {
      state.cycle = 1;
      resetTo("focus");
      setStatus(t("ready"), "info");
    });
    $("skipBtn")?.addEventListener("click", () => completePhase("skipped"));
    $("testSoundBtn")?.addEventListener("click", beep);
    $("exportLogBtn")?.addEventListener("click", () => {
      const header = "time,mode,cycle,planned_minutes,task,reason";
      const rows = state.log.map((entry) => [entry.time, entry.mode, entry.cycle, entry.plannedMinutes, entry.task, entry.reason].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","));
      downloadText("focus-session-log.csv", [header].concat(rows).join("\n"), "text/csv;charset=utf-8");
      setStatus(t("exported"), "ok");
    });
    document.querySelectorAll("[data-preset]").forEach((button) => {
      button.addEventListener("click", () => {
        const [focus, short, long] = button.dataset.preset.split(",").map(Number);
        if ($("focusMinutes")) $("focusMinutes").value = String(focus);
        if ($("shortBreakMinutes")) $("shortBreakMinutes").value = String(short);
        if ($("longBreakMinutes")) $("longBreakMinutes").value = String(long);
        resetTo(state.mode);
      });
    });
    ["focusMinutes", "shortBreakMinutes", "longBreakMinutes", "longBreakEvery"].forEach((id) => {
      $(id)?.addEventListener("change", () => resetTo(state.mode));
    });
    resetTo("focus");
  }

  function initPayloadGenerator() {
    const statuses = ["queued", "running", "passed", "failed", "degraded"];
    const regions = ["lab-a", "lab-b", "edge-1", "edge-2", "ci-runner"];
    function record(index, seed, withTime) {
      return {
        id: seed + "-" + pad2(index + 1),
        status: statuses[index % statuses.length],
        region: regions[index % regions.length],
        latency_ms: 8 + ((index * 37) % 240),
        retries: index % 4,
        timestamp: withTime ? new Date(Date.now() + index * 1000).toISOString() : undefined,
        message: "fixture event " + (index + 1),
      };
    }
    function generate() {
      try {
        const count = intValue("recordCount", 1, 500);
        const format = $("payloadFormat")?.value || "json";
        const seed = (($("seedText")?.value || "").trim() || "sample").replace(/\s+/g, "-").toLowerCase();
        const withTime = Boolean($("withTimestamp")?.checked);
        const data = Array.from({ length: count }, (_, index) => record(index, seed, withTime));
        let result = "";
        if (format === "json") {
          result = JSON.stringify(data, null, 2).replace(/,\n    "timestamp": undefined/g, "");
        } else if (format === "csv") {
          const header = ["id", "status", "region", "latency_ms", "retries", "timestamp", "message"];
          result = [header.join(",")]
            .concat(data.map((row) => header.map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`).join(",")))
            .join("\n");
        } else if (format === "log") {
          result = data.map((row) => `${row.timestamp || "-"} level=${row.status === "failed" ? "error" : "info"} region=${row.region} id=${row.id} latency_ms=${row.latency_ms} msg="${row.message}"`).join("\n");
        } else {
          result = data.map((row) => `PAYLOAD_${row.id.toUpperCase().replace(/-/g, "_")}_STATUS=${row.status}\nPAYLOAD_${row.id.toUpperCase().replace(/-/g, "_")}_LATENCY_MS=${row.latency_ms}`).join("\n");
        }
        if ($("outputText")) $("outputText").value = result;
        setStatus(COPY[lang()].generated, "ok");
      } catch {
        alertInvalid();
      }
    }
    $("generatePayloadBtn")?.addEventListener("click", generate);
    bindResultButtons("test-payload.txt");
    generate();
  }

  function initMorse() {
    const map = {
      A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--", N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--..",
      0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----.",
      ".": ".-.-.-", ",": "--..--", "?": "..--..", "/": "-..-.", "-": "-....-", "(": "-.--.", ")": "-.--.-", ":": "---...", "'": ".----.", "=": "-...-",
    };
    const reverse = Object.fromEntries(Object.entries(map).map(([key, value]) => [value, key]));
    let activeContext = null;

    function encode() {
      const input = ($("morseInput")?.value || "").trim();
      if (!input) return alertInvalid(text("请输入要编码的文本。", "Enter text to encode."));
      const result = input.toUpperCase().split("").map((char) => char === " " ? "/" : (map[char] || "?")).join(" ");
      const output = $("morseOutput") || $("outputText");
      if (output) output.value = result;
      setStatus(COPY[lang()].generated, "ok");
    }

    function decode() {
      const input = ($("morseInput")?.value || "").trim();
      if (!input) return alertInvalid(text("请输入摩斯码，字符用空格分隔。", "Enter Morse code separated by spaces."));
      const result = input.split(/\s+/).map((token) => token === "/" ? " " : (reverse[token] || "?")).join("");
      const output = $("morseOutput") || $("outputText");
      if (output) output.value = result;
      setStatus(COPY[lang()].generated, "ok");
    }

    function stopAudio() {
      if (activeContext) {
        activeContext.close().catch(() => {});
        activeContext = null;
      }
    }

    function play() {
      try {
        const code = (($("morseOutput") || $("outputText"))?.value || $("morseInput")?.value || "").trim();
        if (!code) return alertInvalid(text("请先生成或输入摩斯码。", "Generate or enter Morse code first."));
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error("No audio");
        stopAudio();
        activeContext = new AudioContext();
        const wpm = Math.max(5, Math.min(40, numberValue("wpmInput") || 18));
        const hz = Math.max(300, Math.min(1200, numberValue("toneInput") || 650));
        const dot = 1.2 / wpm;
        let cursor = activeContext.currentTime + 0.05;
        const gain = activeContext.createGain();
        gain.gain.value = 0.08;
        gain.connect(activeContext.destination);
        code.split("").forEach((char) => {
          if (char === "." || char === "-") {
            const osc = activeContext.createOscillator();
            osc.type = "sine";
            osc.frequency.value = hz;
            osc.connect(gain);
            const duration = char === "." ? dot : dot * 3;
            osc.start(cursor);
            osc.stop(cursor + duration);
            cursor += duration + dot;
          } else if (char === " ") {
            cursor += dot * 2;
          } else if (char === "/") {
            cursor += dot * 6;
          }
        });
        window.setTimeout(stopAudio, Math.ceil((cursor - activeContext.currentTime + 0.2) * 1000));
        setStatus(text("正在播放本地合成的摩斯音频。", "Playing locally synthesized Morse audio."), "ok");
      } catch {
        setStatus(COPY[lang()].audioBlocked, "warn");
      }
    }

    $("encodeBtn")?.addEventListener("click", encode);
    $("decodeBtn")?.addEventListener("click", decode);
    $("playMorseBtn")?.addEventListener("click", play);
    $("stopMorseBtn")?.addEventListener("click", stopAudio);
    bindResultButtons("morse-code.txt");
  }

  function initTtsDiagnostics() {
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    const voiceSelect = $("voiceSelect");
    function refreshVoices() {
      if (!supported) {
        setStatus(COPY[lang()].noSpeech, "danger");
        return;
      }
      const voices = window.speechSynthesis.getVoices();
      if (voiceSelect) {
        voiceSelect.innerHTML = "";
        voices.forEach((voice, index) => {
          const option = document.createElement("option");
          option.value = String(index);
          option.textContent = `${voice.name} (${voice.lang})${voice.localService ? " local" : ""}`;
          voiceSelect.append(option);
        });
      }
      const diagnostic = [
        "supported=" + supported,
        "voice_count=" + voices.length,
        "user_agent=" + navigator.userAgent,
      ].join("\n");
      if ($("outputText")) $("outputText").value = diagnostic;
      setStatus(voices.length ? COPY[lang()].generated : COPY[lang()].noVoices, voices.length ? "ok" : "warn");
    }
    function speak() {
      if (!supported) return setStatus(COPY[lang()].noSpeech, "danger");
      const value = ($("ttsText")?.value || "").trim();
      if (!value) return alertInvalid(text("请输入要朗读的诊断文本。", "Enter text for the speech diagnostic."));
      const voices = window.speechSynthesis.getVoices();
      const utterance = new SpeechSynthesisUtterance(value);
      const selected = Number(voiceSelect?.value || -1);
      if (voices[selected]) utterance.voice = voices[selected];
      utterance.rate = Math.max(0.1, Math.min(3, numberValue("rateInput") || 1));
      utterance.pitch = Math.max(0, Math.min(2, numberValue("pitchInput") || 1));
      utterance.volume = Math.max(0, Math.min(1, numberValue("volumeInput") || 0.9));
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setStatus(text("已向浏览器原生语音队列提交测试。", "Submitted the test to the browser speech queue."), "ok");
    }
    $("speakBtn")?.addEventListener("click", speak);
    $("stopSpeechBtn")?.addEventListener("click", () => window.speechSynthesis?.cancel());
    $("refreshVoicesBtn")?.addEventListener("click", refreshVoices);
    if (supported) window.speechSynthesis.onvoiceschanged = refreshVoices;
    bindResultButtons("speech-diagnostics.txt");
    refreshVoices();
  }

  function gcdBig(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b) {
      const t = a % b;
      a = b;
      b = t;
    }
    return a || 1n;
  }

  function reduceFraction(n, d) {
    if (d === 0n) throw new Error("Zero denominator");
    if (d < 0n) {
      n = -n;
      d = -d;
    }
    const g = gcdBig(n, d);
    return { n: n / g, d: d / g };
  }

  function parseDecimalFraction(raw) {
    const value = String(raw || "").trim();
    if (!/^-?\d+(\.\d+)?$/.test(value)) throw new Error("Invalid decimal");
    const sign = value.startsWith("-") ? -1n : 1n;
    const clean = value.replace("-", "");
    const parts = clean.split(".");
    const scale = parts[1] ? 10n ** BigInt(parts[1].length) : 1n;
    const numerator = BigInt(parts[0] + (parts[1] || "")) * sign;
    return reduceFraction(numerator, scale);
  }

  function closerToRatio(candidateA, candidateB, targetN, targetD) {
    const diffA = (candidateA.n * targetD - targetN * candidateA.d);
    const diffB = (candidateB.n * targetD - targetN * candidateB.d);
    const absA = diffA < 0n ? -diffA : diffA;
    const absB = diffB < 0n ? -diffB : diffB;
    return absA * candidateB.d <= absB * candidateA.d ? candidateA : candidateB;
  }

  function bestFraction(n, d, maxD) {
    let n0 = n;
    let d0 = d;
    let p0 = 0n, q0 = 1n, p1 = 1n, q1 = 0n;
    const maxDen = BigInt(maxD);
    while (d0 !== 0n) {
      const a = n0 / d0;
      const q2 = q0 + a * q1;
      if (q2 > maxDen) {
        const k = q1 === 0n ? 0n : (maxDen - q0) / q1;
        const bound = { n: p0 + k * p1, d: q0 + k * q1 };
        const best = closerToRatio(bound, { n: p1, d: q1 }, n, d);
        return reduceFraction(best.n, best.d);
      }
      const p2 = p0 + a * p1;
      p0 = p1; q0 = q1; p1 = p2; q1 = q2;
      const next = n0 - a * d0;
      n0 = d0;
      d0 = next;
    }
    return reduceFraction(p1, q1);
  }

  function initPllCalculator() {
    function calculate() {
      try {
        const sourceRaw = $("sourceClock")?.value;
        const targetRaw = $("targetClock")?.value;
        const maxDen = intValue("maxDenominator", 1, 1000000);
        const source = parseDecimalFraction(sourceRaw);
        const target = parseDecimalFraction(targetRaw);
        const exact = reduceFraction(target.n * source.d, target.d * source.n);
        const approx = bestFraction(exact.n, exact.d, maxDen);
        const sourceMHz = Number(source.n) / Number(source.d);
        const targetMHz = Number(target.n) / Number(target.d);
        const achievedMHz = sourceMHz * Number(approx.n) / Number(approx.d);
        const errorPpm = ((achievedMHz - targetMHz) / targetMHz) * 1000000;
        const result = [
          "exact_ratio=" + exact.n + "/" + exact.d,
          "divider_numerator=" + approx.n,
          "divider_denominator=" + approx.d,
          "achieved_mhz=" + achievedMHz.toFixed(9),
          "target_mhz=" + targetMHz.toFixed(9),
          "error_ppm=" + errorPpm.toFixed(6),
        ].join("\n");
        if ($("outputText")) $("outputText").value = result;
        setStatus(COPY[lang()].generated, "ok");
      } catch {
        alertInvalid(text("请输入有效的源时钟、目标时钟和最大分母。", "Enter a valid source clock, target clock, and maximum denominator."));
      }
    }
    $("calculatePllBtn")?.addEventListener("click", calculate);
    bindResultButtons("pll-ratio.txt");
    calculate();
  }

  function initPercentCalculator() {
    function calculate() {
      try {
        const lines = [];
        const nominal = numberValue("nominalValue");
        const measured = numberValue("measuredValue");
        if (Number.isFinite(nominal) && Number.isFinite(measured) && nominal !== 0) {
          const delta = measured - nominal;
          lines.push("delta=" + delta.toPrecision(12));
          lines.push("percent_error=" + (delta / nominal * 100).toFixed(9) + "%");
          lines.push("ppm_error=" + (delta / nominal * 1000000).toFixed(3));
        }
        const part = numberValue("partValue");
        const total = numberValue("totalValue");
        if (Number.isFinite(part) && Number.isFinite(total) && total !== 0) {
          lines.push("utilization=" + (part / total * 100).toFixed(9) + "%");
          lines.push("remaining=" + (total - part).toPrecision(12));
        }
        if (!lines.length) throw new Error("No calculation");
        if ($("outputText")) $("outputText").value = lines.join("\n");
        setStatus(COPY[lang()].generated, "ok");
      } catch {
        alertInvalid(text("请至少填写一组有效输入：标称/实测，或部分/总量。", "Fill at least one valid pair: nominal/measured or part/total."));
      }
    }
    $("calculatePercentBtn")?.addEventListener("click", calculate);
    bindResultButtons("engineering-percent.txt");
    calculate();
  }

  function formatBytes(bytes) {
    const units = ["B", "KiB", "MiB", "GiB", "TiB"];
    let value = Number(bytes);
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit += 1;
    }
    return value.toFixed(unit ? 3 : 0) + " " + units[unit];
  }

  function initFramebufferCalculator() {
    function calculate() {
      try {
        const width = BigInt(intValue("frameWidth", 1, 1000000));
        const height = BigInt(intValue("frameHeight", 1, 1000000));
        const bpp = BigInt(intValue("bitDepth", 1, 256));
        const refresh = positiveNumber("refreshRate", 0, 10000);
        const g = gcdBig(width, height);
        const pixels = width * height;
        const frameBits = pixels * bpp;
        const frameBytes = (frameBits + 7n) / 8n;
        const bandwidthBytes = Number(frameBytes) * refresh;
        const lines = [
          "aspect_ratio=" + (width / g) + ":" + (height / g),
          "pixels=" + pixels,
          "framebuffer=" + formatBytes(frameBytes),
          "refresh_hz=" + refresh,
          "raw_bandwidth=" + (bandwidthBytes / 1024 / 1024).toFixed(3) + " MiB/s",
        ];
        const scaleWidth = numberValue("scaleWidth");
        const scaleHeight = numberValue("scaleHeight");
        if (Number.isFinite(scaleWidth) && scaleWidth > 0) lines.push("scaled_height=" + Math.round(scaleWidth * Number(height) / Number(width)));
        if (Number.isFinite(scaleHeight) && scaleHeight > 0) lines.push("scaled_width=" + Math.round(scaleHeight * Number(width) / Number(height)));
        if ($("outputText")) $("outputText").value = lines.join("\n");
        setStatus(COPY[lang()].generated, "ok");
      } catch {
        alertInvalid(text("请输入有效的宽度、高度、位深和刷新率。", "Enter valid width, height, bit depth, and refresh rate."));
      }
    }
    $("calculateFrameBtn")?.addEventListener("click", calculate);
    bindResultButtons("framebuffer-report.txt");
    calculate();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const app = $("toolApp");
    if (!app) return;
    injectLayoutClamp();
    try {
      const tool = app.dataset.tool;
      if (tool === "pomodoro-timer") initPomodoro();
      if (tool === "lorem-ipsum-generator") initPayloadGenerator();
      if (tool === "morse-code-translator") initMorse();
      if (tool === "text-to-speech-test") initTtsDiagnostics();
      if (tool === "fraction-calculator") initPllCalculator();
      if (tool === "percentage-calculator") initPercentCalculator();
      if (tool === "aspect-ratio-calculator") initFramebufferCalculator();
    } catch (error) {
      console.error(error);
      setStatus(text("初始化失败，请刷新页面后重试。", "Initialization failed. Refresh the page and try again."), "danger");
    }
  });
})();

import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import { useTranslation } from "../context/LanguageContext";

// Preset colors
const COLORS = [
  { name: "Classic Black", value: "#000000" },
  { name: "Google Blue", value: "#1a73e8" },
  { name: "Deep Violet", value: "#6200ee" },
  { name: "Forest Green", value: "#0f9d58" },
  { name: "Ruby Red", value: "#d93025" },
];

// Preset frames
const FRAMES = [
  { id: "none", label: "No Frame" },
  { id: "scan-me-bottom", label: "Scan Me (Bottom)" },
  { id: "badge-frame", label: "Pill Badge Frame" },
  { id: "clean-frame", label: "Clean Border Frame" },
];

// Preset dot styles
const DOT_STYLES = [
  { id: "classic", label: "Classic Square" },
  { id: "dots", label: "Rounded Dots" },
  { id: "smooth", label: "Smooth Rounded" },
];

function isFinderPattern(row, col, size) {
  if (row < 7 && col < 7) return true;
  if (row < 7 && col >= size - 7) return true;
  if (row >= size - 7 && col < 7) return true;
  return false;
}

function isValidUrl(string) {
  const val = (string || "").trim();
  if (!val) return false;
  const testVal = /^https?:\/\//i.test(val) ? val : `https://${val}`;
  try {
    const url = new URL(testVal);
    return url.hostname.includes(".") || url.hostname === "localhost";
  } catch (_) {
    return false;
  }
}

export default function QrGenerator({ onCopied }) {
  const [text, setText] = useState("https://example.com");
  const [dotStyle, setDotStyle] = useState("classic");
  const [color, setColor] = useState("#1a73e8");
  const [frame, setFrame] = useState("none");
  const [customColor, setCustomColor] = useState("#1a73e8");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const { t } = useTranslation();

  const canvasRef = useRef(null);
  const isUrlValid = isValidUrl(text);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate QR matrix
    let qr;
    try {
      qr = QRCode.create(text.trim() || "https://example.com", {
        errorCorrectionLevel: "H",
      });
    } catch (e) {
      console.error(e);
      return;
    }

    const size = qr.modules.size;
    const qrSize = 280;
    const padding = 40;

    let canvasWidth = qrSize + padding * 2;
    let canvasHeight = qrSize + padding * 2;

    if (frame === "scan-me-bottom") {
      canvasHeight += 60;
    } else if (frame === "badge-frame") {
      canvasHeight += 70;
    } else if (frame === "clean-frame") {
      canvasHeight += 45;
    }

    const scale = 4;
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;

    // Scale context to draw in HD quality
    ctx.scale(scale, scale);

    // Draw background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw frames
    if (frame === "scan-me-bottom") {
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, canvasWidth - 16, canvasHeight - 16);

      ctx.fillStyle = color;
      ctx.fillRect(8, canvasHeight - 68, canvasWidth - 16, 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 20px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCAN ME", canvasWidth / 2, canvasHeight - 38);
    } else if (frame === "badge-frame") {
      ctx.strokeStyle = "#dadce0";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, canvasWidth - 20, canvasHeight - 20);

      ctx.fillStyle = color;
      ctx.fillRect(10, 10, canvasWidth - 20, 12);

      const pillW = 120;
      const pillH = 34;
      const pillX = (canvasWidth - pillW) / 2;
      const pillY = canvasHeight - 48;

      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(pillX, pillY, pillW, pillH, 8);
      } else {
        ctx.rect(pillX, pillY, pillW, pillH);
      }
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCAN ME", canvasWidth / 2, pillY + 17);
    } else if (frame === "clean-frame") {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(12, 12, canvasWidth - 24, canvasHeight - 24);

      ctx.fillStyle = color;
      ctx.font = "bold 14px 'Inter', system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GET LINK", canvasWidth / 2, canvasHeight - 28);
    }

    // Draw QR modules
    const cellSize = qrSize / size;
    const startX = padding;
    const startY = padding;

    ctx.fillStyle = color;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isDark = qr.modules.get(r, c);
        if (!isDark) continue;

        const x = startX + c * cellSize;
        const y = startY + r * cellSize;

        if (isFinderPattern(r, c, size)) {
          // Classic solid blocks for finder patterns to keep scans extremely reliable
          ctx.fillRect(x, y, cellSize, cellSize);
        } else {
          // Styled internal dots
          if (dotStyle === "dots") {
            ctx.beginPath();
            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.42, 0, Math.PI * 2);
            ctx.fill();
          } else if (dotStyle === "smooth") {
            ctx.beginPath();
            const rad = cellSize * 0.3;
            if (ctx.roundRect) {
              ctx.roundRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1, rad);
            } else {
              ctx.rect(x, y, cellSize, cellSize);
            }
            ctx.fill();
          } else {
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }
    }
  }, [text, dotStyle, color, frame]);

  const handleColorChange = (val) => {
    setColor(val);
    setCustomColor(val);
  };

  const handleDownload = () => {
    if (!isUrlValid) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (downloadFormat === "pdf") {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
      doc.save(`qrcode_${Date.now()}.pdf`);
    } else {
      const mimeType = downloadFormat === "jpg" ? "image/jpeg" : "image/png";
      const fileExt = downloadFormat;
      const url = canvas.toDataURL(mimeType);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode_${Date.now()}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    onCopied?.(`QR Code downloaded as ${downloadFormat.toUpperCase()}!`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in min-h-[550px] transition-colors duration-200">
      <section className="text-center mb-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          {t("qrTitle")}
        </h1>
        <p className="text-base sm:text-lg text-google-gray dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {t("qrSubtitle")}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Area */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
          {/* Input field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-white">1. Enter URL link</label>
            <div className="relative flex items-center p-2 bg-white dark:bg-slate-900 rounded-xl border border-google-border dark:border-slate-800 focus-within:border-google-blue dark:focus-within:border-blue-500 focus-within:shadow-sm transition-all">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={t("qrInputPlaceholder")}
                className="w-full px-3 py-2.5 text-base text-gray-900 dark:text-white bg-transparent border-0 outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Dot styles */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white block">2. Select a style</label>
            <div className="grid grid-cols-3 gap-3">
              {DOT_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setDotStyle(style.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${dotStyle === style.id
                    ? "bg-google-blue-light/50 dark:bg-blue-950/40 text-google-blue dark:text-blue-400 border-google-blue dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-google-gray dark:text-slate-400 border-google-border dark:border-slate-800 hover:bg-google-gray-light dark:hover:bg-slate-800 hover:text-gray-950 dark:hover:text-white"
                    }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white block">3. Choose your color</label>
            <div className="flex flex-wrap items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleColorChange(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-9 h-9 rounded-full relative transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-google-blue ${color === c.value ? "ring-2 ring-offset-2 ring-google-blue scale-105" : ""
                    }`}
                  title={c.name}
                >
                  {color === c.value && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`w-9 h-9 rounded-full border border-google-border dark:border-slate-700 bg-gradient-to-tr from-red-500 via-green-500 to-blue-600 relative transition-transform hover:scale-105 active:scale-95 ${!COLORS.some((c) => c.value === color) ? "ring-2 ring-offset-2 ring-google-blue scale-105" : ""
                    }`}
                  title="Custom Color"
                >
                  {!COLORS.some((c) => c.value === color) && (
                    <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold">
                      ✓
                    </span>
                  )}
                </button>

                {showColorPicker && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowColorPicker(false)} />
                    <div className="absolute left-0 mt-2 p-3 bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-xl shadow-card z-20 flex flex-col gap-2">
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-16 h-10 cursor-pointer rounded bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-20 px-2 py-1 text-xs font-mono border border-google-border dark:border-slate-800 rounded text-center text-gray-900 dark:text-white bg-transparent"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Frame options */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 dark:text-white block">4. Select a frame</label>
            <div className="grid grid-cols-2 gap-3">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrame(f.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${frame === f.id
                    ? "bg-google-blue-light/50 dark:bg-blue-950/40 text-google-blue dark:text-blue-400 border-google-blue dark:border-blue-700 shadow-sm"
                    : "bg-white dark:bg-slate-900 text-google-gray dark:text-slate-400 border-google-border dark:border-slate-800 hover:bg-google-gray-light dark:hover:bg-slate-800 hover:text-gray-950 dark:hover:text-white"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-6 sm:p-8 flex flex-col items-center justify-center gap-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider pb-2 border-b border-google-border dark:border-slate-800 w-full text-center">
            Live Preview
          </h3>

          <div className="relative border border-google-border dark:border-slate-800 p-3 rounded-2xl bg-white shadow-sm flex items-center justify-center max-w-[310px] max-h-[400px] overflow-hidden">
            <canvas
              ref={canvasRef}
              className={`max-w-full h-auto rounded-lg transition-all duration-300 ${!isUrlValid ? "filter blur-[6px] select-none pointer-events-none opacity-40" : ""
                }`}
            />
            {!isUrlValid && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 dark:bg-slate-900/60 backdrop-blur-[1px] p-4 text-center">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-lg border border-google-border dark:border-slate-800 text-google-red">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="mt-3 text-xs font-semibold text-gray-800 dark:text-slate-200 bg-white/90 dark:bg-slate-900/95 px-3 py-1 rounded-full shadow-sm border border-google-border dark:border-slate-800">
                  Enter a valid URL to unlock
                </span>
              </div>
            )}
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider block text-center">
              Download Format
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-50 dark:bg-slate-800 border border-google-border dark:border-slate-700 rounded-xl">
              {["png", "jpg", "pdf"].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  disabled={!isUrlValid}
                  onClick={() => setDownloadFormat(fmt)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${!isUrlValid
                    ? "text-gray-400 dark:text-slate-600 cursor-not-allowed"
                    : downloadFormat === fmt
                      ? "bg-google-blue text-white shadow-md transform scale-[1.02]"
                      : "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    }`}
                >
                  .{fmt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!isUrlValid}
            className={`w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 shadow-sm ${isUrlValid
              ? "bg-google-blue hover:bg-google-blue-hover active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2"
              : "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed border border-gray-300 dark:border-slate-700"
              }`}
          >
            {isUrlValid ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            {isUrlValid ? `${t("downloadBtn")} (.${downloadFormat.toUpperCase()})` : "Downloads Locked"}
          </button>
        </div>
      </div>
    </div>
  );
}

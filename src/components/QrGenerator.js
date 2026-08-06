import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

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

export default function QrGenerator({ onCopied }) {
  const [text, setText] = useState("https://example.com");
  const [dotStyle, setDotStyle] = useState("classic");
  const [color, setColor] = useState("#1a73e8");
  const [frame, setFrame] = useState("none");
  const [customColor, setCustomColor] = useState("#1a73e8");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");

  const canvasRef = useRef(null);

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

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

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
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <section className="text-center mb-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          QR Code Generator
        </h2>
        <p className="text-base sm:text-lg text-google-gray max-w-md mx-auto leading-relaxed">
          Create high-quality QR codes with custom styling, brand colors, and frames. Download them instantly for print or digital use.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Settings Area */}
        <div className="md:col-span-7 bg-white border border-google-border rounded-2xl shadow-card p-6 sm:p-8 space-y-6">
          {/* Input field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">1. Enter URL link</label>
            <div className="relative flex items-center p-2 bg-white rounded-xl border border-google-border focus-within:border-google-blue focus-within:shadow-sm transition-all">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2.5 text-base text-gray-900 bg-transparent border-0 outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Dot styles */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 block">2. Select a style</label>
            <div className="grid grid-cols-3 gap-3">
              {DOT_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setDotStyle(style.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${dotStyle === style.id
                    ? "bg-google-blue-light text-google-blue border-google-blue shadow-sm"
                    : "bg-white text-google-gray border-google-border hover:bg-google-gray-light hover:text-gray-950"
                    }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 block">3. Choose your color</label>
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
                  className={`w-9 h-9 rounded-full border border-google-border bg-gradient-to-tr from-red-500 via-green-500 to-blue-600 relative transition-transform hover:scale-105 active:scale-95 ${!COLORS.some((c) => c.value === color)
                    ? "ring-2 ring-offset-2 ring-google-blue scale-105"
                    : ""
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
                  <div className="absolute left-0 mt-2 p-3 bg-white border border-google-border rounded-xl shadow-card z-10 flex flex-col gap-2">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-16 h-10 cursor-pointer rounded"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-20 px-2 py-1 text-xs font-mono border border-google-border rounded text-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Frame options */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900 block">4. Select a frame</label>
            <div className="grid grid-cols-2 gap-3">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFrame(f.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold transition-all duration-200 ${frame === f.id
                    ? "bg-google-blue-light text-google-blue border-google-blue shadow-sm"
                    : "bg-white text-google-gray border-google-border hover:bg-google-gray-light hover:text-gray-950"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div className="md:col-span-5 bg-white border border-google-border rounded-2xl shadow-card p-6 sm:p-8 flex flex-col items-center justify-center gap-6">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider pb-2 border-b border-google-border w-full text-center">
            Live Preview
          </h3>

          <div className="relative border border-google-border p-3 rounded-2xl bg-white shadow-sm flex items-center justify-center max-w-[310px] max-h-[400px]">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg" />
          </div>

          <div className="w-full space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-center">
              Download Format
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-50 border border-google-border rounded-xl">
              {["png", "jpg", "pdf"].map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDownloadFormat(fmt)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all duration-200 ${
                    downloadFormat === fmt
                      ? "bg-google-blue text-white shadow-md transform scale-[1.02]"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-google-blue hover:bg-google-blue-hover transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download as {downloadFormat.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

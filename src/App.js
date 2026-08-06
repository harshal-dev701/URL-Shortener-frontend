import { useState, useCallback, useEffect } from "react";
import { shortenUrl, getAnalytics } from "./api/url";
import { addToHistory, getHistory, clearHistory } from "./utils/storage";
import UrlForm from "./components/UrlForm";
import ResultCard from "./components/ResultCard";
import AnalyticsPanel from "./components/AnalyticsPanel";
import HistoryList from "./components/HistoryList";
import ClickCounter from "./components/ClickCounter";
import Unshortener from "./components/Unshortener";
import QrGenerator from "./components/QrGenerator";
import CookieConsent from "./components/CookieConsent";
import Toast from "./components/Toast";
import { LinkIcon } from "./components/icons";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import CookiesPolicy from "./components/CookiesPolicy";

export default function App() {
  const [currentPage, setCurrentPage] = useState("shorten"); // "shorten", "counter", "unshorten", or "qr"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const [analyticsShortId, setAnalyticsShortId] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === "/click-counter") {
        setCurrentPage("counter");
      } else if (path === "/unshorten") {
        setCurrentPage("unshorten");
      } else if (path === "/qr") {
        setCurrentPage("qr");
      } else if (path === "/about") {
        setCurrentPage("about");
      } else if (path === "/privacy-policy") {
        setCurrentPage("privacy");
      } else if (path === "/terms") {
        setCurrentPage("terms");
      } else if (path === "/cookies") {
        setCurrentPage("cookies");
      } else {
        setCurrentPage("shorten");
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateTo = (path, e) => {
    if (e) e.preventDefault();
    window.history.pushState({}, "", path);

    if (path === "/click-counter") {
      setCurrentPage("counter");
    } else if (path === "/unshorten") {
      setCurrentPage("unshorten");
    } else if (path === "/qr") {
      setCurrentPage("qr");
    } else if (path === "/about") {
      setCurrentPage("about");
    } else if (path === "/privacy-policy") {
      setCurrentPage("privacy");
    } else if (path === "/terms") {
      setCurrentPage("terms");
    } else if (path === "/cookies") {
      setCurrentPage("cookies");
    } else {
      setCurrentPage("shorten");
    }
  };

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const handleShorten = async (url) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await shortenUrl(url);
      const entry = { shortId: data.id, originalUrl: url };
      setResult(entry);
      addToHistory(entry);
      setHistory(getHistory());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalytics = async (shortId) => {
    setAnalyticsShortId(shortId);
    setAnalytics(null);
    setAnalyticsError(null);
    setAnalyticsLoading(true);

    try {
      const data = await getAnalytics(shortId);
      setAnalytics(data);
    } catch (err) {
      setAnalyticsError(err.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const closeAnalytics = () => {
    setAnalyticsShortId(null);
    setAnalytics(null);
    setAnalyticsError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-google-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => navigateTo("/", e)}>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-google-blue text-white shadow-md">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                ShortLink
              </h1>
              <p className="text-xs text-google-gray">Simple, fast URL shortening</p>
            </div>
          </div>

          <nav className="flex items-center bg-google-gray-light p-1 rounded-xl border border-google-border">
            <a
              href="/"
              onClick={(e) => navigateTo("/", e)}
              className={`max-sm:text-xs px-2 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${currentPage === "shorten"
                ? "bg-white text-google-blue shadow-sm"
                : "text-google-gray hover:text-gray-900"
                }`}
            >
              Shortener
            </a>
            <a
              href="/click-counter"
              onClick={(e) => navigateTo("/click-counter", e)}
              className={`max-sm:text-xs px-2 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${currentPage === "counter"
                ? "bg-white text-google-blue shadow-sm"
                : "text-google-gray hover:text-gray-900"
                }`}
            >
              Click Counter
            </a>
            <a
              href="/unshorten"
              onClick={(e) => navigateTo("/unshorten", e)}
              className={`max-sm:text-xs px-2 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${currentPage === "unshorten"
                ? "bg-white text-google-blue shadow-sm"
                : "text-google-gray hover:text-gray-900"
                }`}
            >
              Unshorten
            </a>
            <a
              href="/qr"
              onClick={(e) => navigateTo("/qr", e)}
              className={` max-sm:text-xs px-2 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${currentPage === "qr"
                ? "bg-white text-google-blue shadow-sm"
                : "text-google-gray hover:text-gray-900"
                }`}
            >
              QR Code
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16">
        {currentPage === "shorten" && (
          <div className="space-y-10 animate-fade-in">
            <section className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                Shorten your links
              </h2>
              <p className="text-base sm:text-lg text-google-gray max-w-md mx-auto leading-relaxed">
                Paste a long URL below and get a short link you can share anywhere —
                with click analytics built in.
              </p>
            </section>

            <div className="space-y-8">
              <UrlForm onSubmit={handleShorten} isLoading={isLoading} />

              {error && (
                <div
                  role="alert"
                  className="w-full max-w-2xl mx-auto rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-google-red animate-fade-in"
                >
                  {error}
                </div>
              )}

              {result && (
                <ResultCard
                  shortId={result.shortId}
                  originalUrl={result.originalUrl}
                  onViewAnalytics={handleViewAnalytics}
                  onCopied={() => showToast("Link copied to clipboard")}
                />
              )}

              <HistoryList
                items={history}
                onViewAnalytics={handleViewAnalytics}
                onCopied={() => showToast("Link copied to clipboard")}
                onClear={() => {
                  clearHistory();
                  setHistory([]);
                }}
              />
            </div>
          </div>
        )}

        {currentPage === "counter" && (
          <ClickCounter onCopied={() => showToast("Link copied to clipboard")} />
        )}

        {currentPage === "unshorten" && (
          <Unshortener onCopied={() => showToast("Link copied to clipboard")} />
        )}

        {currentPage === "qr" && (
          <QrGenerator onCopied={(msg) => showToast(msg || "Copied to clipboard")} />
        )}

        {currentPage === "about" && (
          <AboutUs />
        )}

        {currentPage === "privacy" && (
          <PrivacyPolicy />
        )}

        {currentPage === "terms" && (
          <Terms />
        )}

        {currentPage === "cookies" && (
          <CookiesPolicy />
        )}
      </main>

      <footer className="border-t border-google-border bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-google-gray">
          <div>
            &copy; {new Date().getFullYear()} ShortLink. Built with care.
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
            <a
              href="/about"
              onClick={(e) => navigateTo("/about", e)}
              className={`hover:text-google-blue hover:underline transition-colors ${currentPage === "about" ? "text-google-blue font-semibold" : ""
                }`}
            >
              About Us
            </a>
            <a
              href="/privacy-policy"
              onClick={(e) => navigateTo("/privacy-policy", e)}
              className={`hover:text-google-blue hover:underline transition-colors ${currentPage === "privacy" ? "text-google-blue font-semibold" : ""
                }`}
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => navigateTo("/terms", e)}
              className={`hover:text-google-blue hover:underline transition-colors ${currentPage === "terms" ? "text-google-blue font-semibold" : ""
                }`}
            >
              Terms & Conditions
            </a>
            <a
              href="/cookies"
              onClick={(e) => navigateTo("/cookies", e)}
              className={`hover:text-google-blue hover:underline transition-colors ${currentPage === "cookies" ? "text-google-blue font-semibold" : ""
                }`}
            >
              Cookies Policy
            </a>
          </div>
        </div>
      </footer>

      {analyticsShortId && (
        <AnalyticsPanel
          shortId={analyticsShortId}
          analytics={analytics}
          isLoading={analyticsLoading}
          error={analyticsError}
          onClose={closeAnalytics}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <CookieConsent />
    </div>
  );
}

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
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import CookiesPolicy from "./components/CookiesPolicy";
import { useTranslation } from "./context/LanguageContext";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SEO from "./components/SEO";

export default function App() {
  const [currentPage, setCurrentPage] = useState("shorten"); // "shorten", "counter", "unshorten", or "qr"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const { language, t } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

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
      } else if (path === "/unshorten-link") {
        setCurrentPage("unshorten");
      } else if (path === "/qrcode-generator") {
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
    } else if (path === "/unshorten-link") {
      setCurrentPage("unshorten");
    } else if (path === "/qrcode-generator") {
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
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-google-gray-light dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <SEO currentPage={currentPage} language={language} />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} navigateTo={navigateTo} setIsLangOpen={setIsLangOpen} isLangOpen={isLangOpen} setIsThemeOpen={setIsThemeOpen} isThemeOpen={isThemeOpen} showToast={showToast} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 ">
        {currentPage === "shorten" && (
          <div className="space-y-10 animate-fade-in min-h-[550px]">
            <section className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                {t("shortenTitle")}
              </h1>
              <p className="text-base sm:text-lg text-google-gray dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {t("shortenSubtitle")}
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

      <Footer navigateTo={navigateTo} currentPage={currentPage} showToast={showToast} />

      {analyticsShortId && (
        <AnalyticsPanel
          shortId={analyticsShortId}
          analytics={analytics}
          isLoading={analyticsLoading}
          error={analyticsError}
          onClose={closeAnalytics}
        />
      )
      }

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <CookieConsent />
    </div >
  );
}

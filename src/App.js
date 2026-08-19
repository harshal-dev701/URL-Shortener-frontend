import { useState, useCallback, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "./context/AuthContext";
import { getUserUrls } from "./api/auth";
import Settings from "./components/Settings";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import FeaturesBanner from "./components/FeaturesBanner";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive currentPage based on location.pathname
  let currentPage = "shorten";
  const path = location.pathname;
  if (path === "/click-counter") {
    currentPage = "counter";
  } else if (path === "/unshorten-link") {
    currentPage = "unshorten";
  } else if (path === "/qrcode-generator") {
    currentPage = "qr";
  } else if (path === "/about") {
    currentPage = "about";
  } else if (path === "/privacy-policy") {
    currentPage = "privacy";
  } else if (path === "/terms") {
    currentPage = "terms";
  } else if (path === "/cookies") {
    currentPage = "cookies";
  } else if (path === "/settings") {
    currentPage = "settings";
  } else if (path === "/dashboard") {
    currentPage = "dashboard";
  } else if (path === "/reset-password" || path.startsWith("/reset-password")) {
    currentPage = "reset-password";
  }

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

  const { isAuthenticated } = useAuth();

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const fetchLinks = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const data = await getUserUrls();
        setHistory(data.urls || []);
      } catch (err) {
        console.error("Failed to load user links:", err);
      }
    } else {
      setHistory(getHistory());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchLinks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Auth guard: redirect to sign up if user tries to view dashboard while unauthenticated
  useEffect(() => {
    if (location.pathname === "/dashboard" && !isAuthenticated) {
      navigate("/");
      window.dispatchEvent(new Event("open-signup-modal"));
      showToast("Please sign up to access your dashboard.");
    }
  }, [location.pathname, isAuthenticated, navigate, showToast]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const navigateTo = (path, e) => {
    if (e) e.preventDefault();
    navigate(path);
  };

  const handleShorten = async (url) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await shortenUrl(url);
      const entry = { shortId: data.id, originalUrl: url };
      setResult(entry);
      if (!isAuthenticated) {
        addToHistory(entry);
      }
      fetchLinks();
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
      <Header currentPage={currentPage} navigateTo={navigateTo} setIsLangOpen={setIsLangOpen} isLangOpen={isLangOpen} setIsThemeOpen={setIsThemeOpen} isThemeOpen={isThemeOpen} showToast={showToast} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 ">
        <Routes>
          <Route path="/" element={
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

                <FeaturesBanner navigateTo={navigateTo} />
              </div>
            </div>
          } />

          <Route path="/click-counter" element={
            <ClickCounter onCopied={() => showToast("Link copied to clipboard")} />
          } />

          <Route path="/unshorten-link" element={
            <Unshortener onCopied={() => showToast("Link copied to clipboard")} />
          } />

          <Route path="/qrcode-generator" element={
            <QrGenerator onCopied={(msg) => showToast(msg || "Copied to clipboard")} />
          } />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiesPolicy />} />

          <Route path="/settings" element={
            <Settings showToast={showToast} />
          } />

          <Route path="/dashboard" element={
            isAuthenticated ? (
              <Dashboard
                links={history}
                onRefresh={fetchLinks}
                onViewAnalytics={handleViewAnalytics}
                onCopied={() => showToast("Link copied to clipboard")}
                showToast={showToast}
              />
            ) : null
          } />

          <Route path="/reset-password" element={
            <ResetPassword onSignInClick={() => {
              navigate("/");
              window.dispatchEvent(new Event("open-signin-modal"));
            }} />
          } />

          {/* Fallback to home */}
          <Route path="*" element={
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

                <FeaturesBanner navigateTo={navigateTo} />
              </div>
            </div>
          } />
        </Routes>
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
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <CookieConsent />
    </div>
  );
}

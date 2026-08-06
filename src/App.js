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
import {
  LinkIcon,
  GlobeIcon,
  SunIcon,
  MoonIcon,
  MonitorIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon
} from "./components/icons";
import AboutUs from "./components/AboutUs";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Terms from "./components/Terms";
import CookiesPolicy from "./components/CookiesPolicy";
import { ADDRESS, BRAND_NAME, EMAIL } from "./config/global";
import { useTheme } from "./context/ThemeContext";
import { useTranslation } from "./context/LanguageContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState("shorten"); // "shorten", "counter", "unshorten", or "qr"
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, languages } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-google-gray-light dark:bg-slate-950 text-gray-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-google-border dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => navigateTo("/", e)}>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-google-blue text-white shadow-md">
                <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                  {BRAND_NAME}
                </h1>
                <p className="text-xs text-google-gray dark:text-slate-400">{t("smartLink")}</p>
              </div>
            </div>
          </div>

          <nav className="flex items-center bg-google-gray-light dark:bg-slate-800 p-1 rounded-xl border border-google-border dark:border-slate-700 max-sm:w-full overflow-x-auto justify-center">
            <a
              href="/"
              onClick={(e) => navigateTo("/", e)}
              className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "shorten"
                ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {t("shortener")}
            </a>
            <a
              href="/click-counter"
              onClick={(e) => navigateTo("/click-counter", e)}
              className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "counter"
                ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {t("clickCounter")}
            </a>
            <a
              href="/unshorten"
              onClick={(e) => navigateTo("/unshorten", e)}
              className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "unshorten"
                ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {t("unshorten")}
            </a>
            <a
              href="/qr"
              onClick={(e) => navigateTo("/qr", e)}
              className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "qr"
                ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                }`}
            >
              {t("qrCode")}
            </a>
          </nav>

          <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto justify-end">
            {/* Language Select */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-google-border dark:border-slate-700 text-google-gray dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-all duration-200 bg-white dark:bg-slate-900"
              >
                <GlobeIcon className="w-4 h-4 text-google-gray dark:text-slate-400" />
                <span className="uppercase">{languages[language].code}</span>
                {isLangOpen ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
              </button>

              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 shadow-lg py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
                    {Object.entries(languages).map(([code, lang]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setLanguage(code);
                          setIsLangOpen(false);
                          showToast(`Language changed to ${lang.name}`);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors ${language === code
                          ? "text-google-blue dark:text-blue-400 font-semibold bg-google-blue-light/30 dark:bg-blue-950/20"
                          : "text-gray-700 dark:text-slate-300"
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {language === code && <CheckIcon className="w-4 h-4 text-google-blue dark:text-blue-400" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Select */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className="flex items-center justify-center p-2 rounded-lg border border-google-border dark:border-slate-700 text-google-gray dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-all duration-200 bg-white dark:bg-slate-900"
                title={theme === "light" ? "Light theme" : theme === "dark" ? "Dark theme" : "System default"}
              >
                {theme === "light" && <SunIcon className="w-5 h-5 text-amber-500" />}
                {theme === "dark" && <MoonIcon className="w-5 h-5 text-blue-400" />}
                {theme === "system" && <MonitorIcon className="w-5 h-5 text-google-gray dark:text-slate-400" />}
              </button>

              {isThemeOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
                  <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 shadow-lg py-1.5 z-50 animate-fade-in">
                    {[
                      { key: "light", label: "Light", icon: SunIcon, iconClass: "text-amber-500" },
                      { key: "dark", label: "Dark", icon: MoonIcon, iconClass: "text-blue-400" },
                      { key: "system", label: "System", icon: MonitorIcon, iconClass: "text-google-gray dark:text-slate-400" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => {
                          setTheme(item.key);
                          setIsThemeOpen(false);
                          showToast(`Theme set to ${item.label}`);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors ${theme === item.key
                          ? "text-google-blue dark:text-blue-400 font-semibold bg-google-blue-light/30 dark:bg-blue-950/20"
                          : "text-gray-700 dark:text-slate-300"
                          }`}
                      >
                        <item.icon className={`w-4 h-4 ${item.iconClass}`} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Authentication UI / Simulated Avatar */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-google-blue rounded-full transition-transform active:scale-95"
                >
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                    alt="User Profile"
                    className="w-9 h-9 rounded-full border border-google-border dark:border-slate-700 shadow-sm object-cover"
                  />
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 shadow-lg py-2.5 z-50 animate-fade-in text-left">
                      <div className="px-4 py-2 border-b border-google-border dark:border-slate-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">Alex Morgan</p>
                        <p className="text-xs text-google-gray dark:text-slate-400 truncate">alex.morgan@example.com</p>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            showToast("Dashboard details opened!");
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-gray-700 dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-base">📊</span>
                          <span>{t("dashboard")}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showToast("Settings settings opened!");
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-gray-700 dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors"
                        >
                          <span className="text-base">⚙️</span>
                          <span>{t("settings")}</span>
                        </button>
                      </div>

                      <div className="border-t border-google-border dark:border-slate-800 mt-1 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAuthenticated(false);
                            setIsUserMenuOpen(false);
                            showToast("Logged out successfully");
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-google-red dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                          <span className="text-base">🚪</span>
                          <span>{t("signOut")}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticated(true);
                    showToast("Signed in as Alex Morgan!");
                  }}
                  className="px-3.5 py-2 text-sm font-semibold rounded-lg text-google-gray dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {t("signIn")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 ">
        {currentPage === "shorten" && (
          <div className="space-y-10 animate-fade-in min-h-[550px]">
            <section className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                {t("shortenTitle")}
              </h2>
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

      <footer className="bg-[#0b1329] dark:bg-slate-950 text-gray-400 border-t border-slate-800 dark:border-slate-900 mt-auto pt-16 pb-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => navigateTo("/", e)}>
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-google-blue text-white shadow-md">
                <LinkIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {BRAND_NAME}
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
              {t("footerText")}
            </p>
          </div>

          {/* Column 2: Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              {t("features")}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/"
                  onClick={(e) => navigateTo("/", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "shorten" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("shortener")}
                </a>
              </li>
              <li>
                <a
                  href="/click-counter"
                  onClick={(e) => navigateTo("/click-counter", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "counter" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("clickCounter")}
                </a>
              </li>
              <li>
                <a
                  href="/unshorten"
                  onClick={(e) => navigateTo("/unshorten", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "unshorten" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("unshorten")}
                </a>
              </li>
              <li>
                <a
                  href="/qr"
                  onClick={(e) => navigateTo("/qr", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "qr" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("qrCode")}
                </a>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => showToast("Custom Domains coming soon!")}
                  className="hover:text-white transition-colors duration-200 text-left"
                >
                  Custom Domains
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Security */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              {t("security")}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Google Safe Browsing
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Virus Total Protection
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Norton Safe Web
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                SSL Encryption
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
              {t("contactLegal")}
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2 text-gray-400">
                <svg className="w-4 h-4 text-google-blue shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <svg className="w-4 h-4 text-google-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${EMAIL}`} className="hover:underline hover:text-white transition-colors duration-200">
                  {EMAIL}
                </a>
              </li>
              <li className="pt-2 border-t border-slate-800/60">
                <a
                  href="/terms"
                  onClick={(e) => navigateTo("/terms", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "terms" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("terms")}
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  onClick={(e) => navigateTo("/privacy-policy", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "privacy" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a
                  href="/cookies"
                  onClick={(e) => navigateTo("/cookies", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "cookies" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("cookies")}
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => navigateTo("/about", e)}
                  className={`hover:text-white transition-colors duration-200 ${currentPage === "about" ? "text-google-blue font-medium" : ""
                    }`}
                >
                  {t("aboutUs")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Operational Indicators */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} <span className="font-semibold text-google-blue">{BRAND_NAME}</span>. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
            <span className="flex items-center gap-2 text-gray-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              {t("sysOperational")}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("responseMetric")}
            </span>
            <span className="flex items-center gap-1.5 text-gray-400">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {t("uptimeMetric")}
            </span>
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
      )
      }

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <CookieConsent />
    </div >
  );
}

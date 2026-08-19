import { useState } from "react";
import { unshortenUrl } from "../api/url";
import CopyButton from "./CopyButton";
import { LinkIcon, SpinnerIcon, ExternalLinkIcon } from "./icons";
import { useTranslation } from "../context/LanguageContext";
import FeaturesBanner from "./FeaturesBanner";

export default function Unshortener({ onCopied }) {
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { t } = useTranslation();

  const trimmed = inputUrl.trim();
  const canSubmit = trimmed && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await unshortenUrl(trimmed);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to unshorten the URL. Please verify and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputUrl("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-5xl animate-fade min-h-[550px] animate-fade-in  transition-colors duration-200">

      <div className="w-full max-w-2xl mx-auto space-y-8">
        <section className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
            {t("unshortenTitle")}
          </h1>
          <p className="text-base sm:text-lg text-google-gray dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {t("unshortenSubtitle")}
          </p>
        </section>

        {!result && (
          <form onSubmit={handleSubmit} className="w-full">
            <div
              className={`relative flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-card border transition-all duration-200 focus-within:shadow-card-hover ${error ? "border-google-red dark:border-red-500" : "border-google-border dark:border-slate-800"
                }`}
            >
              <div className="flex flex-1 items-center gap-3 px-3 min-w-0">
                <LinkIcon className="w-5 h-5 text-google-gray dark:text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={t("unshortenInputPlaceholder")}
                  aria-label="Shortened URL to unshorten"
                  className="flex-1 min-w-0 py-3 text-base text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 bg-transparent border-0 outline-none focus:ring-0"
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-google-blue hover:bg-google-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 shrink-0"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon className="w-4 h-4" />
                    {t("unshorteningBtn")}
                  </>
                ) : (
                  t("unshortenBtn")
                )}
              </button>
            </div>
            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-google-red dark:text-red-400 animate-fade-in"
              >
                {error}
              </div>
            )}
          </form>
        )}

        {result && (
          <div className="bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-6 sm:p-8 space-y-6 animate-slide-up transition-colors duration-200">
            <div className="flex items-center justify-between border-b border-google-border dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("unshortenedResult")}</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${result.isInternal
                      ? "bg-google-blue-light/50 dark:bg-blue-950/30 text-google-blue dark:text-blue-400"
                      : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50"
                    }`}
                >
                  {result.isInternal ? t("internalShortlink") : t("externalRedirect")}
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-google-blue dark:text-blue-400 hover:text-google-blue-hover dark:hover:text-blue-300 transition-colors"
              >
                {t("unshortenAnother")}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-google-gray dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  {t("originalDestLabel")}
                </p>
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-google-gray-light dark:bg-slate-800 border border-google-border dark:border-slate-700">
                  <a
                    href={result.originalURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-google-blue dark:text-blue-400 hover:underline truncate flex items-center gap-1.5"
                    title={result.originalURL}
                  >
                    {result.originalURL}
                    <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0" />
                  </a>
                  <CopyButton
                    text={result.originalURL}
                    onCopied={onCopied}
                    className="px-3.5 py-1.5 shrink-0"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-400">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {t("securityNoteTitle")}
              </div>
              <p className="leading-relaxed text-amber-700 dark:text-amber-300 text-xs">
                {t("securityNoteText")}
              </p>
            </div>
          </div>
        )}
      </div>
      <FeaturesBanner />
    </div>
  );
}

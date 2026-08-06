import { useEffect, useCallback } from "react";
import { SpinnerIcon } from "./icons";
import { useTranslation } from "../context/LanguageContext";

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AnalyticsPanel({
  shortId,
  analytics,
  isLoading,
  error,
  onClose,
}) {
  const { t } = useTranslation();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-45 flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-label="Close analytics"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-card-hover border border-google-border dark:border-slate-800 animate-slide-up max-h-[85vh] flex flex-col transition-colors duration-200 z-50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-google-border dark:border-slate-800">
          <div>
            <h2 id="analytics-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("analyticsResults")}
            </h2>
            <p className="text-sm text-google-gray dark:text-slate-400 mt-0.5 font-mono">{shortId}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-google-gray dark:text-slate-400 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-google-gray dark:text-slate-400">
              <SpinnerIcon className="w-8 h-8 text-google-blue dark:text-blue-400" />
              <p className="text-sm">Loading analytics...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm text-google-red dark:text-red-400">
              {error}
            </div>
          )}

          {analytics && !isLoading && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-google-blue-light/50 dark:bg-blue-950/30 p-4 text-center">
                  <p className="text-3xl font-bold text-google-blue dark:text-blue-400">
                    {analytics.totalClicks}
                  </p>
                  <p className="text-xs font-medium text-google-gray dark:text-slate-400 mt-1 uppercase tracking-wide">
                    {t("totalClicksLabel")}
                  </p>
                </div>
                <div className="rounded-xl bg-google-gray-light dark:bg-slate-800 p-4 text-center border border-google-border dark:border-slate-700">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {analytics.analyticsData?.length ?? 0}
                  </p>
                  <p className="text-xs font-medium text-google-gray dark:text-slate-400 mt-1 uppercase tracking-wide">
                    {t("visitsLoggedLabel")}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-google-gray dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                  Destination
                </p>
                <p
                  className="text-sm text-gray-700 dark:text-slate-300 truncate px-3 py-2 rounded-lg bg-google-gray-light dark:bg-slate-800"
                  title={analytics.originalURL}
                >
                  {analytics.originalURL}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Visit history
                </p>
                {analytics.analyticsData?.length > 0 ? (
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {analytics.analyticsData.map((visit, index) => (
                      <li
                        key={`${visit.timeStamp}-${index}`}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-google-gray-light dark:bg-slate-800 text-sm text-gray-700 dark:text-slate-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-google-blue dark:bg-blue-400 shrink-0" />
                        <span>
                          {formatTimestamp(visit.timeStamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-google-gray dark:text-slate-400 py-6 text-center rounded-xl border border-dashed border-google-border dark:border-slate-800">
                    No clicks yet. Share your link to start tracking!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

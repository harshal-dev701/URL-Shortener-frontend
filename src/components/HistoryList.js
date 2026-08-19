import { getShortUrl } from "../config";
import CopyButton from "./CopyButton";
import { ChartIcon } from "./icons";
import { useTranslation } from "../context/LanguageContext";

export default function HistoryList({ items, onViewAnalytics, onCopied, onClear }) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-2xl mx-auto animate-fade-in" aria-label="Recent links">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-google-gray dark:text-slate-400 uppercase tracking-wider">
          {t("recentLinksTitle")}
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-google-gray dark:text-slate-400 hover:text-google-red dark:hover:text-red-400 transition-colors focus:outline-none focus-visible:underline"
        >
          {t("clearAllBtn")}
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const shortUrl = getShortUrl(item.shortId);
          return (
            <li
              key={item.shortId}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-card border border-google-border dark:border-slate-800 p-4 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-google-blue dark:text-blue-400 hover:underline truncate block"
                  >
                    {shortUrl}
                  </a>
                  <p
                    className="text-xs text-google-gray dark:text-slate-400 truncate mt-0.5"
                    title={item.originalUrl || item.redirectURL}
                  >
                    {item.originalUrl || item.redirectURL}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onViewAnalytics(item.shortId)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-google-gray dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 border border-google-border dark:border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue"
                  >
                    <ChartIcon className="w-3.5 h-3.5" />
                    Stats
                  </button>
                  <CopyButton
                    text={shortUrl}
                    onCopied={onCopied}
                    className="!px-3 !py-2 !text-xs"
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import { getShortUrl } from "../config";
import CopyButton from "./CopyButton";
import { ExternalLinkIcon, ChartIcon } from "./icons";
import { useTranslation } from "../context/LanguageContext";

export default function ResultCard({
  shortId,
  originalUrl,
  onViewAnalytics,
  onCopied,
}) {
  const shortUrl = getShortUrl(shortId);
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-card border border-google-border dark:border-slate-800 overflow-hidden transition-colors duration-200">
        <div className="px-6 py-4 bg-google-blue-light/50 dark:bg-blue-950/20 border-b border-google-border dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-google-blue dark:text-blue-400">
            {t("readyTitle")}
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-google-gray dark:text-slate-400 mb-1.5">
              {t("shortUrlLabel")}
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-google-gray-light dark:bg-slate-800 border border-google-border dark:border-slate-700 text-google-blue dark:text-blue-400 font-medium text-sm hover:underline truncate transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{shortUrl}</span>
              </a>
              <CopyButton text={shortUrl} onCopied={onCopied} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-google-gray dark:text-slate-400 mb-1.5">
              {t("originalUrlLabel")}
            </label>
            <p
              className="px-4 py-3 rounded-xl bg-google-gray-light dark:bg-slate-800 border border-google-border dark:border-slate-700 text-sm text-gray-700 dark:text-slate-300 truncate"
              title={originalUrl}
            >
              {originalUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewAnalytics(shortId)}
            className="inline-flex items-center gap-2 text-sm font-medium text-google-blue dark:text-blue-400 hover:text-google-blue-hover dark:hover:text-blue-300 transition-colors focus:outline-none focus-visible:underline"
          >
            <ChartIcon className="w-4 h-4" />
            {t("viewAnalyticsLink")}
          </button>
        </div>
      </div>
    </div>
  );
}

import { getShortUrl } from "../config";
import CopyButton from "./CopyButton";
import { ChartIcon } from "./icons";

export default function HistoryList({ items, onViewAnalytics, onCopied, onClear }) {
  if (items.length === 0) return null;

  return (
    <section className="w-full max-w-2xl mx-auto animate-fade-in" aria-label="Recent links">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-google-gray uppercase tracking-wider">
          Recent links
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-google-gray hover:text-google-red transition-colors focus:outline-none focus-visible:underline"
        >
          Clear all
        </button>
      </div>

      <ul className="space-y-3">
        {items.map((item) => {
          const shortUrl = getShortUrl(item.shortId);
          return (
            <li
              key={item.shortId}
              className="bg-white rounded-xl shadow-card border border-google-border p-4 hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-google-blue hover:underline truncate block"
                  >
                    {shortUrl}
                  </a>
                  <p
                    className="text-xs text-google-gray truncate mt-0.5"
                    title={item.originalUrl}
                  >
                    {item.originalUrl}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onViewAnalytics(item.shortId)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-google-gray hover:bg-google-gray-light border border-google-border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue"
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

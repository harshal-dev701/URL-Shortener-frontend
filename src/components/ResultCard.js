import { getShortUrl } from "../config";
import CopyButton from "./CopyButton";
import { ExternalLinkIcon, ChartIcon } from "./icons";

export default function ResultCard({
  shortId,
  originalUrl,
  onViewAnalytics,
  onCopied,
}) {
  const shortUrl = getShortUrl(shortId);

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      <div className="bg-white rounded-2xl shadow-card border border-google-border overflow-hidden">
        <div className="px-6 py-4 bg-google-blue-light border-b border-google-border">
          <p className="text-xs font-semibold uppercase tracking-wider text-google-blue">
            Your short link is ready
          </p>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-google-gray mb-1.5">
              Short URL
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-google-gray-light border border-google-border text-google-blue font-medium text-sm hover:underline truncate transition-colors"
              >
                <ExternalLinkIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{shortUrl}</span>
              </a>
              <CopyButton text={shortUrl} onCopied={onCopied} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-google-gray mb-1.5">
              Original URL
            </label>
            <p
              className="px-4 py-3 rounded-xl bg-google-gray-light border border-google-border text-sm text-gray-700 truncate"
              title={originalUrl}
            >
              {originalUrl}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onViewAnalytics(shortId)}
            className="inline-flex items-center gap-2 text-sm font-medium text-google-blue hover:text-google-blue-hover transition-colors focus:outline-none focus-visible:underline"
          >
            <ChartIcon className="w-4 h-4" />
            View click analytics
          </button>
        </div>
      </div>
    </div>
  );
}

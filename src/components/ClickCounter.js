import { useState } from "react";
import { getAnalytics } from "../api/url";
import { getShortUrl } from "../config";
import CopyButton from "./CopyButton";
import { LinkIcon, SpinnerIcon, ChartIcon, ExternalLinkIcon } from "./icons";

function extractShortId(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  // Try to parse as URL
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `http://${trimmed}`);
    const path = url.pathname;
    const parts = path.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  } catch {
    // Fallback split for non-URL strings like '/url/abc' or 'abc'
    const parts = trimmed.split("/").filter(Boolean);
    return parts[parts.length - 1] || trimmed;
  }
}

function formatTimestamp(ts) {
  return new Date(ts).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ClickCounter({ onCopied }) {
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const trimmed = inputUrl.trim();
  const shortIdCandidate = extractShortId(trimmed);
  const canSubmit = shortIdCandidate && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);
    setAnalytics(null);

    try {
      const data = await getAnalytics(shortIdCandidate);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || "Failed to fetch analytics. Please check the URL.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputUrl("");
    setAnalytics(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade-in">
      <section className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          URL Click Counter
        </h2>
        <p className="text-base sm:text-lg text-google-gray max-w-md mx-auto leading-relaxed">
          Enter your shortened URL below to check its total click count and see detailed visitor activity.
        </p>
      </section>

      {!analytics && (
        <form onSubmit={handleSubmit} className="w-full">
          <div
            className={`relative flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-card border transition-shadow duration-200 focus-within:shadow-card-hover ${
              error ? "border-google-red" : "border-google-border"
            }`}
          >
            <div className="flex flex-1 items-center gap-3 px-3 min-w-0">
              <ChartIcon className="w-5 h-5 text-google-gray shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter shortened URL or ID..."
                aria-label="Shortened URL to track"
                className="flex-1 min-w-0 py-3 text-base text-gray-900 placeholder:text-gray-400 bg-transparent border-0 outline-none focus:ring-0"
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
                  Tracking...
                </>
              ) : (
                "Track Clicks"
              )}
            </button>
          </div>
          {error && (
            <div
              role="alert"
              className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-google-red animate-fade-in"
            >
              {error}
            </div>
          )}
        </form>
      )}

      {analytics && (
        <div className="bg-white border border-google-border rounded-2xl shadow-card p-6 sm:p-8 space-y-6 animate-slide-up">
          <div className="flex items-center justify-between border-b border-google-border pb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics Results</h3>
              <p className="text-sm font-mono text-google-gray mt-0.5">{analytics.shortId}</p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold text-google-blue hover:text-google-blue-hover transition-colors"
            >
              Track Another Link
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-google-blue-light p-5 text-center">
              <p className="text-4xl font-extrabold text-google-blue">
                {analytics.totalClicks}
              </p>
              <p className="text-xs font-semibold text-google-gray mt-1 uppercase tracking-wide">
                Total clicks
              </p>
            </div>
            <div className="rounded-xl bg-google-gray-light p-5 text-center border border-google-border">
              <p className="text-4xl font-extrabold text-gray-900">
                {analytics.analyticsData?.length ?? 0}
              </p>
              <p className="text-xs font-semibold text-google-gray mt-1 uppercase tracking-wide">
                Visits logged
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-google-gray mb-1.5 uppercase tracking-wide">
                Short URL
              </p>
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-google-gray-light border border-google-border">
                <a
                  href={getShortUrl(analytics.shortId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-google-blue hover:underline truncate flex items-center gap-1.5"
                >
                  {getShortUrl(analytics.shortId)}
                  <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0" />
                </a>
                <CopyButton
                  text={getShortUrl(analytics.shortId)}
                  onCopied={onCopied}
                  className="px-3.5 py-1.5"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-google-gray mb-1.5 uppercase tracking-wide">
                Original Destination URL
              </p>
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-google-gray-light border border-google-border">
                <a
                  href={analytics.originalURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-700 hover:text-google-blue hover:underline truncate flex items-center gap-1.5"
                  title={analytics.originalURL}
                >
                  {analytics.originalURL}
                  <ExternalLinkIcon className="w-3.5 h-3.5 shrink-0" />
                </a>
                <CopyButton
                  text={analytics.originalURL}
                  onCopied={onCopied}
                  className="px-3.5 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-google-border">
            <p className="text-sm font-semibold text-gray-900 mb-3">Visit history log</p>
            {analytics.analyticsData?.length > 0 ? (
              <div className="max-h-56 overflow-y-auto rounded-xl border border-google-border divide-y divide-google-border">
                {analytics.analyticsData.map((visit, index) => (
                  <div
                    key={`${visit.timeStamp}-${index}`}
                    className="flex items-center gap-3 px-4 py-3 bg-white text-sm"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-google-blue shrink-0 animate-pulse" />
                    <span className="text-gray-700 font-medium">
                      {formatTimestamp(visit.timeStamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-google-gray py-8 text-center rounded-xl border border-dashed border-google-border bg-google-gray-light">
                No clicks logged yet. Share your short URL to collect visit metrics!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

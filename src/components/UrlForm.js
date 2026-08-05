import { useState } from "react";
import { LinkIcon, SpinnerIcon } from "./icons";

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default function UrlForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = url.trim();
  const showError = touched && trimmed && !isValidUrl(trimmed);
  const canSubmit = trimmed && isValidUrl(trimmed) && !isLoading;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={`relative flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-2xl shadow-card border transition-shadow duration-200 focus-within:shadow-card-hover ${
          showError ? "border-google-red" : "border-google-border"
        }`}
      >
        <div className="flex flex-1 items-center gap-3 px-3 min-w-0">
          <LinkIcon className="w-5 h-5 text-google-gray shrink-0" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Paste your long URL here..."
            aria-label="Long URL to shorten"
            aria-invalid={showError}
            aria-describedby={showError ? "url-error" : undefined}
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
              Shortening...
            </>
          ) : (
            "Shorten URL"
          )}
        </button>
      </div>
      {showError && (
        <p id="url-error" role="alert" className="mt-2 text-sm text-google-red px-2">
          Please enter a valid URL starting with http:// or https://
        </p>
      )}
    </form>
  );
}

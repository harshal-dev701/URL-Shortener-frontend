import { useState, useCallback } from "react";
import { CopyIcon, CheckIcon } from "./icons";

export default function CopyButton({ text, onCopied, className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [text, onCopied]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 ${
        copied
          ? "bg-green-50 text-google-green border border-green-200"
          : "bg-google-blue text-white hover:bg-google-blue-hover active:scale-[0.98]"
      } ${className}`}
    >
      {copied ? (
        <>
          <CheckIcon className="w-4 h-4" />
          Copied
        </>
      ) : (
        <>
          <CopyIcon className="w-4 h-4" />
          Copy
        </>
      )}
    </button>
  );
}

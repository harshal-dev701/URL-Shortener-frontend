import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay presentation for 1.2 seconds for a smoother UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed bottom-4 right-4 max-w-sm w-[calc(100%-2rem)] z-50 bg-white border border-google-border rounded-2xl shadow-card-hover p-5 animate-slide-up flex flex-col gap-4"
    >
      <div className="flex gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-google-blue-light text-google-blue shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h4 id="cookie-title" className="text-sm font-semibold text-gray-900 leading-tight">
            We value your privacy
          </h4>
          <p id="cookie-desc" className="text-xs text-google-gray leading-relaxed mt-1">
            We use cookies to improve your URL shortening experience, collect redirection analytics, and analyze site traffic to help us optimize the platform.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          onClick={handleDecline}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-google-gray hover:text-gray-900 border border-google-border hover:bg-google-gray-light transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-google-blue hover:bg-google-blue-hover transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 shadow-sm"
        >
          Accept All
        </button>
      </div>
    </div>
  );
}

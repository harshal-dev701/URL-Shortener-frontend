import React from "react";
import { useAuth } from "../context/AuthContext";
import { ChartIcon, CopyIcon } from "./icons";

export default function FeaturesBanner({ navigateTo }) {
  const { isAuthenticated } = useAuth();
  console.log("isAuthenticated", isAuthenticated)

  if (isAuthenticated) return;

  const handleCtaClick = (mode) => {
    if (isAuthenticated) {
      navigateTo("/dashboard");
    } else {
      if (mode === "signup") {
        window.dispatchEvent(new Event("open-signup-modal"));
      } else {
        window.dispatchEvent(new Event("open-signin-modal"));
      }
    }
  };

  return (
    <section className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-16 space-y-12">
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-blue-50 dark:bg-blue-950/40 text-google-blue dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
          Features Spotlight
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Manage & Track in One Dashboard
        </h2>
        <p className="text-sm sm:text-base text-google-gray dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
          Create an account to unlock advanced settings, real-time visitor analytics, custom QR code templates, and high-performance link organization.
        </p>
      </div>

      {/* Simulated Mini Dashboard Preview Card */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        {/* Mock Top Navigation */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span className="text-xs font-mono text-google-gray dark:text-slate-500 ml-2">dashboard_preview_v2.io</span>
          </div>
          <span className="text-xs font-medium text-google-blue dark:text-blue-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-google-blue animate-pulse"></span>
            Live Updates
          </span>
        </div>

        {/* Mock Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-google-gray dark:text-slate-400 font-semibold uppercase tracking-wider">
                <span>Created Links</span>
                <span>🔗</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mt-1 text-gray-900 dark:text-white">12</h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-google-gray dark:text-slate-400 font-semibold uppercase tracking-wider">
                <span>Total Engagements</span>
                <span className="text-green-500">📈 +18.4%</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mt-1 text-gray-900 dark:text-white">3,842</h4>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-google-gray dark:text-slate-400 font-semibold uppercase tracking-wider">
                <span>Top Country</span>
                <span>🇺🇸</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold mt-1 text-gray-900 dark:text-white">United States</h4>
            </div>
          </div>

          {/* Interactive Link List Item Simulation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-google-gray dark:text-slate-400 uppercase tracking-wider">
              Sample Saved Links
            </p>

            <div className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/20 dark:bg-slate-900/10 hover:border-google-blue/30 dark:hover:border-blue-500/20 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-google-blue dark:text-blue-400 hover:underline cursor-pointer truncate">
                    https://smart.lnk/deepmind-agent
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950">
                    Active
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate max-w-sm">
                  https://github.com/google/deepmind/advanced-agentic-coding-research
                </p>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-google-blue dark:text-blue-400 border border-blue-100 dark:border-blue-950">
                  1,492 clicks
                </span>

                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-google-gray transition-colors" title="Copy Link">
                    <CopyIcon className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-google-gray transition-colors" title="View Stats">
                    <ChartIcon className="w-4 h-4 text-google-blue" />
                  </button>
                  <button className="p-1.5 rounded-lg border border-red-200 dark:border-red-950 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors" title="Delete Link">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Highlighted Core Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-google-blue dark:text-blue-400 flex items-center justify-center text-lg">
            📊
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Detailed Real-Time Analytics</h3>
          <p className="text-xs sm:text-sm text-google-gray dark:text-slate-400 leading-relaxed">
            Trace target referrers (Social, Search, or Direct), visitor operating systems, and location origins in beautiful interactive charts.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 flex items-center justify-center text-lg">
            ⚡
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Active Link Campaigns Control</h3>
          <p className="text-xs sm:text-sm text-google-gray dark:text-slate-400 leading-relaxed">
            Easily rename titles, edit destinations, search tags, or permanently clear expired redirects inside your personal table view.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg">
            📱
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Interactive QR Code Templates</h3>
          <p className="text-xs sm:text-sm text-google-gray dark:text-slate-400 leading-relaxed">
            Generate matching QR graphics for every short URL, customize foreground/background hex values, and download in PNG/JPG/SVG formats.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
            🛡️
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Safe Link Inspection</h3>
          <p className="text-xs sm:text-sm text-google-gray dark:text-slate-400 leading-relaxed">
            Prevent malicious redirection with our integrated Unshortener, which lets you preview raw destinations before executing navigation.
          </p>
        </div>
      </div>

      {/* Sleek CTA Callout Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-google-blue/10 to-indigo-500/10 dark:from-google-blue/5 dark:to-indigo-500/5 border border-google-blue/20 dark:border-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-md">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isAuthenticated ? "Ready to organize your link network?" : "Start optimizing your branding campaign today"}
          </h3>
          <p className="text-xs sm:text-sm text-google-gray dark:text-slate-400 leading-relaxed">
            {isAuthenticated
              ? "Visit your centralized dashboard panel to view live charts and inspect user analytics."
              : "Register a secure free account to save shortened paths permanently and view visitor analysis details."}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <button
              onClick={() => handleCtaClick()}
              className="px-5 py-3 rounded-xl bg-google-blue hover:bg-google-blue-hover text-white text-sm font-semibold shadow-md active:scale-95 transition-all duration-200"
            >
              Open Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => handleCtaClick("signin")}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => handleCtaClick("signup")}
                className="px-5 py-3 rounded-xl bg-google-blue hover:bg-google-blue-hover text-white text-sm font-semibold shadow-md active:scale-95 transition-all duration-200"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

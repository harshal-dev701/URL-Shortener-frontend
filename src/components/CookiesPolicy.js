import React from "react";

export default function CookiesPolicy() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-8 sm:p-10 animate-fade-in space-y-8 transition-colors duration-200">
      <section className="text-center pb-6 border-b border-google-border dark:border-slate-800">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          Cookies Policy
        </h2>
        <p className="text-base text-google-gray dark:text-slate-400 max-w-lg mx-auto">
          Understand how we use cookies and web storage to enhance your experience.
        </p>
      </section>

      <div className="space-y-6 text-gray-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">What are Cookies & Local Storage?</h3>
        <p>
          Cookies and local storage are small text files placed on your computer or mobile device when you browse websites. They enable websites to remember user settings, history, and preferences.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">How ShortLink Uses Cookies & Web Storage</h3>
        <p>
          We use local browser storage and minimal cookies strictly for functional, user-centric purposes:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-google-gray dark:text-slate-400">
          <li><strong className="text-gray-800 dark:text-slate-200">Local History List</strong>: Shortened links you create are stored in your browser's local storage so you can easily review, copy, or view analytics for past links.</li>
          <li><strong className="text-gray-800 dark:text-slate-200">Consent Cookie</strong>: We save a preference cookie once you accept our cookie consent banner, so we do not prompt you repeatedly.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Managing Your Preferences</h3>
        <p>
          You can clear your shortened URL history at any time directly on this website by clicking the "Clear History" button in your history panel, or by deleting your browser cache and local data.
        </p>
      </div>
    </div>
  );
}

import React from "react";
import { BRAND_NAME } from "../config/global";

export default function PrivacyPolicy() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-8 sm:p-10 animate-fade-in space-y-8 transition-colors duration-200">
      <section className="text-center pb-6 border-b border-google-border dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-base text-google-gray dark:text-slate-400 max-w-lg mx-auto">
          Your privacy is important to us. Learn about our clear, minimal data collection processes.
        </p>
      </section>

      <div className="space-y-6 text-gray-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Information We Collect</h3>
        <p>
          We collect minimal metadata to support link shortening and analytics features:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-google-gray dark:text-slate-400">
          <li>The original URL you submit to be shortened.</li>
          <li>Basic usage statistics when visitors click short links (e.g. click counts, timestamps, general geographic region, browser user-agent). We do not record full IP addresses or personally identifiable information (PII).</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Local Storage & History</h3>
        <p>
          We use browser local storage to save your shortened link history locally. This history does not get uploaded to our databases; it remains securely on your individual device and can be cleared by you at any time.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Data Sharing</h3>
        <p>
          {BRAND_NAME} does not share, lease, sell, or distribute your shortened link details or analytics with third-party advertisers or third-party tracking services. All analytics statistics are accessible only to whoever has the shortened link's analytics ID.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">4. Contact Us</h3>
        <p>
          For any questions regarding this Privacy Policy, please contact our team at support@shortlink.com.
        </p>
      </div>
    </div>
  );
}

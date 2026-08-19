import React from "react";
import { BRAND_NAME } from "../config/global";

export default function Terms() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-8 sm:p-10 animate-fade-in space-y-8 transition-colors duration-200">
      <section className="text-center pb-6 border-b border-google-border dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          Terms & Conditions
        </h1>
        <p className="text-base text-google-gray dark:text-slate-400 max-w-lg mx-auto">
          Please review the guidelines for using {BRAND_NAME}.
        </p>
      </section>

      <div className="space-y-6 text-gray-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
        <p>
          By accessing or using {BRAND_NAME}, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use our service.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">2. Acceptable Use</h3>
        <p>
          You are responsible for all content linked via shortened URLs generated on our platform. You agree NOT to use ShortLink to shorten links pointing to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-google-gray dark:text-slate-400">
          <li>Malware, viruses, spyware, or phishing sites.</li>
          <li>Illegal products, services, or dangerous materials.</li>
          <li>Spam or unsolicited commercial communications.</li>
          <li>Content that violates copyright, trademark, or rights of publicity.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">3. Service Limitations & Availability</h3>
        <p>
          We provide ShortLink "as is" and make no warranties regarding uninterrupted availability, reliability, or that shortened links will exist indefinitely. We reserve the right to block, disable, or delete any shortened link that violates our acceptable use policy.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">4. Changes to Terms</h3>
        <p>
          We reserve the right to modify these terms at any time. Changes will be posted here, and your continued use of ShortLink indicates your acceptance of any revisions.
        </p>
      </div>
    </div>
  );
}

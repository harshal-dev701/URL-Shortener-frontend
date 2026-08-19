import React from "react";
import { BRAND_NAME } from "../config/global";

export default function AboutUs() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 rounded-2xl shadow-card p-8 sm:p-10 animate-fade-in space-y-8 transition-colors duration-200">
      <section className="text-center pb-6 border-b border-google-border dark:border-slate-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
          About {BRAND_NAME}
        </h1>
        <p className="text-base text-google-gray dark:text-slate-400 max-w-lg mx-auto">
          We believe sharing links should be simple, clean, transparent, and completely under your control.
        </p>
      </section>

      <div className="space-y-6 text-gray-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Our Mission</h3>
        <p>
          {BRAND_NAME} is built with user privacy and speed in mind. Our platform allows developers, marketers, and daily users to turn complex, long URLs into compact, shareable links, without compromising tracking accuracy or privacy.
        </p>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Key Features</h3>
        <ul className="list-disc pl-5 space-y-2 text-google-gray dark:text-slate-400">
          <li><strong className="text-gray-800 dark:text-slate-200">Ultra-fast redirection</strong>: Our servers redirect users with minimal latency.</li>
          <li><strong className="text-gray-800 dark:text-slate-200">Real-time Analytics</strong>: Discover click statistics, device usage, and referral domains.</li>
          <li><strong className="text-gray-800 dark:text-slate-200">Custom QR Codes</strong>: Download high-quality QR codes in PNG, JPG, and PDF.</li>
          <li><strong className="text-gray-800 dark:text-slate-200">Privacy First</strong>: No intrusive tracking; cookies are only used locally to preserve history.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Open Source & Transparency</h3>
        <p>
          We are committed to maintaining a clean and secure ecosystem. {BRAND_NAME} is continuously optimized using modern web technology stacks to ensure safety and responsive design across all devices.
        </p>
      </div>
    </div>
  );
}

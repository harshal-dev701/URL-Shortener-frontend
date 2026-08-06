import React from "react";

export default function AboutUs() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-google-border rounded-2xl shadow-card p-8 sm:p-10 animate-fade-in space-y-8">
      <section className="text-center pb-6 border-b border-google-border">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
          About ShortLink
        </h2>
        <p className="text-base text-google-gray max-w-lg mx-auto">
          We believe sharing links should be simple, clean, transparent, and completely under your control.
        </p>
      </section>

      <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
        <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
        <p>
          ShortLink is built with user privacy and speed in mind. Our platform allows developers, marketers, and daily users to turn complex, long URLs into compact, shareable links, without compromising tracking accuracy or privacy.
        </p>

        <h3 className="text-lg font-bold text-gray-900">Key Features</h3>
        <ul className="list-disc pl-5 space-y-2 text-google-gray">
          <li><strong className="text-gray-800">Ultra-fast redirection</strong>: Our servers redirect users with minimal latency.</li>
          <li><strong className="text-gray-800">Real-time Analytics</strong>: Discover click statistics, device usage, and referral domains.</li>
          <li><strong className="text-gray-800">Custom QR Codes</strong>: Download high-quality QR codes in PNG, JPG, and PDF.</li>
          <li><strong className="text-gray-800">Privacy First</strong>: No intrusive tracking; cookies are only used locally to preserve history.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900">Open Source & Transparency</h3>
        <p>
          We are committed to maintaining a clean and secure ecosystem. ShortLink is continuously optimized using modern web technology stacks to ensure safety and responsive design across all devices.
        </p>
      </div>
    </div>
  );
}

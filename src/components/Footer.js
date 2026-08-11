import { useTranslation } from "../context/LanguageContext";
import { LinkIcon } from "./icons";
import { ADDRESS, BRAND_NAME, EMAIL } from "../config/global";

export default function Footer({ currentPage, navigateTo, showToast }) {
    const { t } = useTranslation();

    return (
        <footer className="bg-[#0b1329] dark:bg-slate-900 text-gray-400 border-t border-slate-800 dark:border-slate-900 mt-auto pt-16 pb-8 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 *:not-first:items-center">
                {/* Column 1: Brand Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => navigateTo("/", e)}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-google-blue text-white shadow-md">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">
                            {BRAND_NAME}
                        </h2>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-400 max-w-sm">
                        {t("footerText")}
                    </p>
                </div>

                {/* Column 2: Features */}
                <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                        {t("features")}
                    </h3>
                    <ul className="space-y-2 text-xs">
                        <li>
                            <a
                                href="/"
                                onClick={(e) => navigateTo("/", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "shorten" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("shortener")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/click-counter"
                                onClick={(e) => navigateTo("/click-counter", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "counter" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("clickCounter")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/unshorten-link"
                                onClick={(e) => navigateTo("/unshorten-link", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "unshorten" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("unshorten")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/qrcode-generator"
                                onClick={(e) => navigateTo("/qrcode-generator", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "qr" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("qrCode")}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Security */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                        {t("security")}
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                        <li className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Google Safe Browsing
                        </li>
                        <li className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Virus Total Protection
                        </li>
                        <li className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Norton Safe Web
                        </li>
                        <li className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            SSL Encryption
                        </li>
                    </ul>
                </div>

                {/* Column 4: Contact & Legal */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                        {t("contactLegal")}
                    </h3>
                    <ul className="space-y-2.5 text-xs">
                        <li className="flex items-start gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-google-blue shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{ADDRESS}</span>
                        </li>
                        <li className="flex items-center gap-2 text-gray-400">
                            <svg className="w-4 h-4 text-google-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <a href={`mailto:${EMAIL}`} className="hover:underline hover:text-white transition-colors duration-200">
                                {EMAIL}
                            </a>
                        </li>
                        <li className="pt-2 border-t border-slate-800/60">
                            <a
                                href="/terms"
                                onClick={(e) => navigateTo("/terms", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "terms" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("terms")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/privacy-policy"
                                onClick={(e) => navigateTo("/privacy-policy", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "privacy" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("privacy")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/cookies"
                                onClick={(e) => navigateTo("/cookies", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "cookies" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("cookies")}
                            </a>
                        </li>
                        <li>
                            <a
                                href="/about"
                                onClick={(e) => navigateTo("/about", e)}
                                className={`hover:text-white transition-colors duration-200 ${currentPage === "about" ? "text-google-blue font-medium" : ""
                                    }`}
                            >
                                {t("aboutUs")}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar: Copyright & Operational Indicators */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
                <div>
                    &copy; {new Date().getFullYear()} <span className="font-semibold text-google-blue">{BRAND_NAME}</span>. All rights reserved.
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
                    <span className="flex items-center gap-2 text-gray-400 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {t("sysOperational")}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t("responseMetric")}
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-400">
                        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {t("uptimeMetric")}
                    </span>
                </div>
            </div>
        </footer>
    );
}
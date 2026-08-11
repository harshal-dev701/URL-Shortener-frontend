import { BRAND_NAME } from "../config/global";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, GlobeIcon, LinkIcon, MonitorIcon, MoonIcon, SunIcon } from "./icons";
import { useTranslation } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";

const Header = ({ currentPage, navigateTo, setIsLangOpen, isLangOpen, setIsThemeOpen, isThemeOpen, showToast }) => {
    const { t, language, setLanguage, languages } = useTranslation();
    const { theme, setTheme } = useTheme();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


    return (
        <header className="bg-white dark:bg-slate-900 border-b border-google-border dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="w-full lg:w-auto flex items-center justify-between lg:justify-start gap-4">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={(e) => navigateTo("/", e)}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-google-blue text-white shadow-md">
                            <LinkIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                                {BRAND_NAME}
                            </div>
                            <p className="text-xs text-google-gray dark:text-slate-400">{t("smartLink")}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex items-center bg-google-gray-light dark:bg-slate-800 p-1 rounded-xl border border-google-border dark:border-slate-700 max-sm:w-full overflow-x-auto justify-center">
                    <a
                        href="/"
                        onClick={(e) => navigateTo("/", e)}
                        className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "shorten"
                            ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                            : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        {t("shortener")}
                    </a>
                    <a
                        href="/click-counter"
                        onClick={(e) => navigateTo("/click-counter", e)}
                        className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "counter"
                            ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                            : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        {t("clickCounter")}
                    </a>
                    <a
                        href="/unshorten-link"
                        onClick={(e) => navigateTo("/unshorten-link", e)}
                        className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "unshorten"
                            ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                            : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        {t("unshorten")}
                    </a>
                    <a
                        href="/qrcode-generator"
                        onClick={(e) => navigateTo("/qrcode-generator", e)}
                        className={`max-sm:text-xs px-2.5 sm:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shrink-0 ${currentPage === "qr"
                            ? "bg-white dark:bg-slate-900 text-google-blue dark:text-blue-400 shadow-sm"
                            : "text-google-gray dark:text-slate-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        {t("qrCode")}
                    </a>
                </nav>

                <div className="flex items-center gap-3 lg:gap-4 w-full lg:w-auto justify-end">
                    {/* Language Select */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsLangOpen(!isLangOpen)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border border-google-border dark:border-slate-700 text-google-gray dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-all duration-200 bg-white dark:bg-slate-900"
                        >
                            <GlobeIcon className="w-4 h-4 text-google-gray dark:text-slate-400" />
                            <span className="uppercase">{languages[language].code}</span>
                            {isLangOpen ? <ChevronUpIcon className="w-3.5 h-3.5" /> : <ChevronDownIcon className="w-3.5 h-3.5" />}
                        </button>

                        {isLangOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 shadow-lg py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
                                    {Object.entries(languages).map(([code, lang]) => (
                                        <button
                                            key={code}
                                            type="button"
                                            onClick={() => {
                                                setLanguage(code);
                                                setIsLangOpen(false);
                                            }}
                                            className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors ${language === code
                                                ? "text-google-blue dark:text-blue-400 font-semibold bg-google-blue-light/30 dark:bg-blue-950/20"
                                                : "text-gray-700 dark:text-slate-300"
                                                }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="text-base leading-none">{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </span>
                                            {language === code && <CheckIcon className="w-4 h-4 text-google-blue dark:text-blue-400" />}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Theme Select */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsThemeOpen(!isThemeOpen)}
                            className="flex items-center justify-center p-2 rounded-lg border border-google-border dark:border-slate-700 text-google-gray dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-all duration-200 bg-white dark:bg-slate-900"
                            title={theme === "light" ? "Light theme" : theme === "dark" ? "Dark theme" : "System default"}
                        >
                            {theme === "light" && <SunIcon className="w-5 h-5 text-amber-500" />}
                            {theme === "dark" && <MoonIcon className="w-5 h-5 text-blue-400" />}
                            {theme === "system" && <MonitorIcon className="w-5 h-5 text-google-gray dark:text-slate-400" />}
                        </button>

                        {isThemeOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsThemeOpen(false)} />
                                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 shadow-lg py-1.5 z-50 animate-fade-in">
                                    {[
                                        { key: "light", label: "Light", icon: SunIcon, iconClass: "text-amber-500" },
                                        { key: "dark", label: "Dark", icon: MoonIcon, iconClass: "text-blue-400" },
                                        { key: "system", label: "System", icon: MonitorIcon, iconClass: "text-google-gray dark:text-slate-400" },
                                    ].map((item) => (
                                        <button
                                            key={item.key}
                                            type="button"
                                            onClick={() => {
                                                setTheme(item.key);
                                                setIsThemeOpen(false);
                                                showToast(`Theme set to ${item.label}`);
                                            }}
                                            className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors ${theme === item.key
                                                ? "text-google-blue dark:text-blue-400 font-semibold bg-google-blue-light/30 dark:bg-blue-950/20"
                                                : "text-gray-700 dark:text-slate-300"
                                                }`}
                                        >
                                            <item.icon className={`w-4 h-4 ${item.iconClass}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Authentication UI / Simulated Avatar */}
                    {isAuthenticated ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-google-blue rounded-full transition-transform active:scale-95"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                                    alt="User Profile"
                                    className="w-9 h-9 rounded-full border border-google-border dark:border-slate-700 shadow-sm object-cover"
                                />
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-slate-900" />
                            </button>

                            {isUserMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-google-border dark:border-slate-800 shadow-lg py-2.5 z-50 animate-fade-in text-left">
                                        <div className="px-4 py-2 border-b border-google-border dark:border-slate-800">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">Alex Morgan</p>
                                            <p className="text-xs text-google-gray dark:text-slate-400 truncate">alex.morgan@example.com</p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-gray-700 dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="text-base">📊</span>
                                                <span>{t("dashboard")}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-gray-700 dark:text-slate-300 hover:bg-google-gray-light dark:hover:bg-slate-800 transition-colors"
                                            >
                                                <span className="text-base">⚙️</span>
                                                <span>{t("settings")}</span>
                                            </button>
                                        </div>

                                        <div className="border-t border-google-border dark:border-slate-800 mt-1 pt-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsAuthenticated(false);
                                                    setIsUserMenuOpen(false);
                                                    showToast("Logged out successfully");
                                                }}
                                                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left text-google-red dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                            >
                                                <span className="text-base">🚪</span>
                                                <span>{t("signOut")}</span>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAuthenticated(true);
                                }}
                                className="px-3.5 py-2 text-sm font-semibold rounded-lg text-google-gray dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {t("signIn")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
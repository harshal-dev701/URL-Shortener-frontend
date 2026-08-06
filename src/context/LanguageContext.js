import React, { createContext, useContext, useState } from "react";
import { translations } from "../utils/translations";

const LanguageContext = createContext();

export const LANGUAGES = {
  pt: { name: "Português", flag: "🇧🇷", code: "PT" },
  en: { name: "English", flag: "🇺🇸", code: "EN" },
  es: { name: "Español", flag: "🇪🇸", code: "ES" },
  fr: { name: "Français", flag: "🇫🇷", code: "FR" },
  it: { name: "Italiano", flag: "🇮🇹", code: "IT" },
  hi: { name: "हिंदी", flag: "🇮🇳", code: "HI" },
  id: { name: "Bahasa Indonesia", flag: "🇮🇩", code: "ID" },
  de: { name: "Deutsch", flag: "🇩🇪", code: "DE" },
  ja: { name: "日本語", flag: "🇯🇵", code: "JA" },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const setLanguage = (langCode) => {
    if (LANGUAGES[langCode]) {
      setLanguageState(langCode);
      localStorage.setItem("language", langCode);
    }
  };

  const t = (key) => {
    const langDict = translations[language] || translations["en"];
    if (langDict && langDict[key] !== undefined) {
      return langDict[key];
    }
    // Fallback to English
    const enDict = translations["en"];
    if (enDict && enDict[key] !== undefined) {
      return enDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

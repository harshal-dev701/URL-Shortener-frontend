import { useEffect } from "react";
import { seoTranslations } from "../utils/seoTranslations";

export default function SEO({ currentPage, language }) {
  useEffect(() => {
    // 1. Fetch metadata based on page and language
    const langData = seoTranslations[language] || seoTranslations["en"];
    const pageMeta = langData[currentPage] || langData["shorten"];

    // 2. Define path mapping for canonical URLs
    const pathMap = {
      shorten: "/",
      counter: "/click-counter",
      unshorten: "/unshorten-link",
      qr: "/qrcode-generator",
      about: "/about",
      privacy: "/privacy-policy",
      terms: "/terms",
      cookies: "/cookies",
    };
    const canonicalPath = pathMap[currentPage] || "/";
    const canonicalUrl = window.location.origin + canonicalPath;
    const logoUrl = window.location.origin + "/logo512.png";

    // 3. Update document title
    document.title = pageMeta.title;

    // 4. Helper function to update/create meta tags
    const updateMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 5. Helper function to update/create link tags (like canonical)
    const updateLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    // 6. Apply Standard Meta Tags
    updateMetaTag("name", "description", pageMeta.description);
    updateMetaTag("name", "keywords", pageMeta.keywords);
    updateMetaTag("name", "robots", "index, follow");

    // 7. Apply Open Graph (Facebook / LinkedIn) Meta Tags
    updateMetaTag("property", "og:title", pageMeta.title);
    updateMetaTag("property", "og:description", pageMeta.description);
    updateMetaTag("property", "og:url", canonicalUrl);
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:image", logoUrl);
    updateMetaTag("property", "og:site_name", "ShortLink");

    // 8. Apply Twitter Card Meta Tags
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", pageMeta.title);
    updateMetaTag("name", "twitter:description", pageMeta.description);
    updateMetaTag("name", "twitter:image", logoUrl);

    // 9. Apply Canonical Tag
    updateLinkTag("canonical", canonicalUrl);

    // 10. Apply Schema.org JSON-LD Structured Data
    const schema = {
      "@context": "https://schema.org",
      "@type": ["shorten", "counter", "unshorten", "qr"].includes(currentPage)
        ? "WebApplication"
        : "WebPage",
      "name": pageMeta.title,
      "description": pageMeta.description,
      "url": canonicalUrl,
      "inLanguage": language,
      "publisher": {
        "@type": "Organization",
        "name": "ShortLink",
        "logo": {
          "@type": "ImageObject",
          "url": window.location.origin + "/logo192.png",
        },
      },
    };

    if (schema["@type"] === "WebApplication") {
      schema.applicationCategory = "UtilitiesApplication";
      schema.operatingSystem = "All";
      schema.browserRequirements = "Requires JavaScript. Requires HTML5.";
      schema.offers = {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      };
    }

    // Insert or update script tag for JSON-LD
    let scriptTag = document.getElementById("seo-json-ld");
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "seo-json-ld";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(schema);

    // Cleanup function to remove dynamic schema on unmount/re-run
    return () => {
      // We don't necessarily have to remove all meta tags, but we should make sure schema cleans up
      const currentScript = document.getElementById("seo-json-ld");
      if (currentScript) {
        currentScript.innerHTML = "";
      }
    };
  }, [currentPage, language]);

  return null; // This component doesn't render any visible UI
}

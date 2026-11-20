import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { locales } from "../components/VariablePanel/common";

// Translations live in src/locales/<language>/<namespace>.json.
// Each language is a separate file, so editing Spanish never touches any other language.
// Missing keys fall back to English (see fallbackLng).
const languages = locales.map((l) => l.value); // e.g. ['en', 'es', 'zh-CN', 'pl']
export const namespaces = ["common", "home", "about", "team", "resources", "contact", "map", "panel", "data"];

// Bundle every translation file at build time (they are small), so there is no loading flicker.
const context = require.context("../locales", true, /\.json$/);
const resources = {};
context.keys().forEach((path) => {
  const [, lng, ns] = path.match(/\.\/([^/]+)\/([^/]+)\.json$/) || [];
  if (!lng || !languages.includes(lng)) return;
  resources[lng] = resources[lng] || {};
  resources[lng][ns] = context(path);
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: languages, // regional variants match automatically, e.g. "es-MX" -> "es", "zh" -> "zh-CN"
    fallbackLng: "en",
    ns: namespaces,
    defaultNS: "common",
    returnEmptyString: false, // an empty string in a translation file falls back to English
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "chiair.lang",
      caches: ["localStorage"],
    },
  });

const setHtmlLang = (lng) => document.documentElement.setAttribute("lang", lng);
setHtmlLang(i18n.resolvedLanguage || "en");
i18n.on("languageChanged", setHtmlLang);

export default i18n;

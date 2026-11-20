#!/usr/bin/env node
/**
 * Checks src/locales/<lang>/<namespace>.json against English.
 *
 *   yarn i18n:check
 *
 * Reports, per language and namespace:
 *   - missing keys   (present in English, absent here -> the site shows English for these)
 *   - extra keys     (absent in English -> probably a typo or a stale key)
 *   - placeholder/tag differences ({{name}} / <tag> differ from English) -- warnings, since some are
 *     intentional (e.g. Spanish writes "Nuestro AirMap" instead of "{{productName}} Map")
 *
 * The `data` namespace is skipped for missing/extra checks: English for config data lives in
 * src/config/*.json, so en/data.json is intentionally empty.
 *
 * Exits with code 1 if anything is invalid JSON or has extra keys.
 * Missing keys and placeholder differences are warnings only.
 */
const fs = require("fs");
const path = require("path");

const LOCALES_DIR = path.join(__dirname, "..", "src", "locales");
const BASE = "en";
const SKIP_KEY_COMPARE = new Set(["data"]);

const flatten = (obj, prefix = "", out = {}) => {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = v;
  }
  return out;
};

// Plural suffixes differ per language (e.g. Polish has _few/_many), so compare base keys.
const PLURAL = /_(zero|one|two|few|many|other)$/;
const baseKey = (k) => k.replace(PLURAL, "");

const tokens = (s) =>
  typeof s === "string"
    ? [...s.matchAll(/\{\{\s*([\w.]+)[^}]*\}\}|<\/?([\w]+)\s*\/?>/g)].map((m) => m[1] || `<${m[2]}>`).sort()
    : [];

const readJson = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`✗ Invalid JSON: ${path.relative(process.cwd(), file)}\n  ${e.message}`);
    process.exitCode = 1;
    return null;
  }
};

const languages = fs.readdirSync(LOCALES_DIR).filter((d) => fs.statSync(path.join(LOCALES_DIR, d)).isDirectory());
const namespaces = fs.readdirSync(path.join(LOCALES_DIR, BASE)).filter((f) => f.endsWith(".json"));

let errors = 0;
for (const lang of languages.filter((l) => l !== BASE)) {
  console.log(`\n== ${lang} ==`);
  for (const nsFile of namespaces) {
    const ns = nsFile.replace(/\.json$/, "");
    const en = readJson(path.join(LOCALES_DIR, BASE, nsFile));
    const file = path.join(LOCALES_DIR, lang, nsFile);
    if (!fs.existsSync(file)) {
      console.log(`  ${ns}: file missing (all English)`);
      continue;
    }
    const tr = readJson(file);
    if (!en || !tr) { errors++; continue; }
    const enFlat = flatten(en);
    const trFlat = flatten(tr);
    const enKeys = new Set(Object.keys(enFlat).map(baseKey));
    const trKeys = new Set(Object.keys(trFlat).map(baseKey));

    const missing = SKIP_KEY_COMPARE.has(ns) ? [] : [...enKeys].filter((k) => !trKeys.has(k));
    const extra = SKIP_KEY_COMPARE.has(ns) ? [] : [...trKeys].filter((k) => !enKeys.has(k));
    const mismatched = Object.keys(trFlat).filter((k) => {
      const enVal = enFlat[k] ?? enFlat[`${baseKey(k)}_other`] ?? enFlat[baseKey(k)];
      if (enVal === undefined) return false;
      return JSON.stringify(tokens(enVal)) !== JSON.stringify(tokens(trFlat[k]));
    });

    const ok = !missing.length && !extra.length && !mismatched.length;
    console.log(`  ${ok ? "✓" : "!"} ${ns}: ${Object.keys(trFlat).length} keys`);
    missing.forEach((k) => console.log(`      missing (shows English): ${k}`));
    extra.forEach((k) => console.log(`      extra (not in English):  ${k}`));
    mismatched.forEach((k) => console.log(`      check placeholders/tags:  ${k}`));
    errors += extra.length;
  }
}

if (errors) {
  console.error(`\n${errors} problem(s) found.`);
  process.exitCode = 1;
} else {
  console.log("\nAll translation files are consistent.");
}

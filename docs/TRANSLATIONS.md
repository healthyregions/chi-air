# Translations

Our Air is available in English, Spanish (`es`), Simplified Chinese (`zh-CN`) and Polish (`pl`).
Translations are handled with [react-i18next](https://react.i18next.com/). Each language has its own
files, so editing one language never changes any other.

| Language | Source |
| --- | --- |
| English (`en`) | Original site text |
| Spanish (`es`) | Reviewed by native speakers. Corrections from the translation review are applied |
| Chinese (`zh-CN`), Polish (`pl`) | Machine-generated. **Not yet reviewed by native speakers** |

## Where the text lives

```
src/locales/
  en/  es/  zh-CN/  pl/
    common.json     navigation, footer, shared buttons
    home.json       home page and showcase carousel
    about.json      Info & FAQ page
    team.json       Team page
    resources.json  Resources page
    contact.json    Contact page and form
    map.json        map page (map, legend, search box, data panel)
    panel.json      map side panels (area selection, sensor details, charts)
    data.json       translations of text that comes from src/config/*.json (see below)
```

Every file is plain JSON. The **key** (left side) must not change; only the **text** (right side) is translated:

```json
{
  "aqi": {
    "title": "Índice de calidad del aire de PM 2.5 de la EPA",
    "healthConcern": "Nivel de preocupación por la salud"
  }
}
```

## Editing a translation

1. Find the text: search `src/locales/es/` for the current wording, or search `src/locales/en/` for the English text and use the same key in the Spanish file.
2. Change only the text on the right side of the `:`.
3. Keep placeholders and tags exactly as they appear:
   - `{{productName}}`, `{{count}}`: values filled in by the site. Move them anywhere in the sentence, but don't translate or remove them.
   - `<link>…</link>`, `<bold>…</bold>`, `<1>…</1>`: links and formatting. Translate the words between the tags and keep the tags.
4. Run `yarn i18n:check` to catch JSON typos, missing keys, and broken placeholders.

If a key is missing or empty in a language, the site shows the English text instead.

### Config data (`data.json`)

Variable names and descriptions, overlay names, and AQI level labels come from `src/config/*.json`. The
English text stays in those config files. Other languages override it in `src/locales/<lang>/data.json`,
keyed by group, then the config entry's id, then the field name:

```json
{
  "variables": { "CEJI": { "Variable Name": "Índice de Justicia Ambiental de Chicago", "Description": "…" } },
  "overlays":  { "wards": { "displayName": "Distritos electorales" } },
  "aqiLevels": { "Good": { "label": "Bueno" } }
}
```

## For developers

- Wrap user-visible text with `t()` from `useTranslation('<namespace>')`, or use `<Trans>` for sentences with links or formatting. Add the English text to `src/locales/en/<namespace>.json` and the other languages alongside it.
- For text from `src/config`, use `useConfigText()` (`src/i18n/useConfigText.js`).
- Never translate values used as ids, comparisons, or Redux state. Translate only when displaying.
- Leave proper nouns (`productName`, people, organizations) untranslated.
- Setup lives in `src/i18n/index.js`. To add a language, add it to `locales` in `src/components/VariablePanel/common.js` and create `src/locales/<code>/`.
- The language is picked from `?lang=es` in the URL, then the visitor's last choice (localStorage), then their browser language.

import { useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Translate text that comes from the JSON config files in src/config (variables, overlays, AQI levels, ...).
 *
 * English stays in the config file itself (the source of truth); other languages provide overrides
 * in src/locales/<lang>/data.json, keyed as  <group>.<id>.<field>.
 *
 *   const tc = useConfigText();
 *   tc('variables', variable.Column, 'Description', variable.Description)
 *
 * The underlying config values are never changed, so code that compares labels/ids keeps working.
 */
export default function useConfigText() {
  const { t } = useTranslation("data");
  return useCallback(
    (group, id, field, fallback) => {
      if (fallback === null || fallback === undefined || fallback === "") return fallback;
      if (id === null || id === undefined) return fallback;
      return t([group, id, field].join("."), { defaultValue: fallback });
    },
    [t]
  );
}

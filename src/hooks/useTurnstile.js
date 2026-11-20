import { useCallback, useEffect, useRef } from 'react';

const SITE_KEY = process.env.REACT_APP_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let loadPromise = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      loadPromise = null; // allow a retry on the next mount
      script.remove();
      reject(new Error('Failed to load Cloudflare Turnstile'));
    };
    document.head.appendChild(script);
  });
  return loadPromise;
}

/**
 * Renders a Cloudflare Turnstile widget into `containerRef` and returns
 * `getToken()`, which runs the check and resolves to a single-use token for
 * server-side verification.
 *
 * The widget stays hidden unless Cloudflare decides the visitor needs to
 * interact (appearance: 'interaction-only'), and only runs when getToken()
 * is called (execution: 'execute'), so tokens don't expire while the user
 * is still typing.
 */
export default function useTurnstile(containerRef, action) {
  const widgetIdRef = useRef(null);
  const pendingRef = useRef(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (!SITE_KEY) {
      console.warn('REACT_APP_TURNSTILE_SITE_KEY is not set; contact form submissions will be rejected.');
      return;
    }

    const settle = (kind, value) => {
      const pending = pendingRef.current;
      pendingRef.current = null;
      pending?.[kind](value);
    };

    let cancelled = false;
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current) return;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          action,
          execution: 'execute',
          appearance: 'interaction-only',
          retry: 'never',
          callback: (token) => settle('resolve', token),
          'error-callback': (code) => {
            settle('reject', new Error(`Turnstile error ${code}`));
            return true; // handled; stop Turnstile from throwing
          },
          'timeout-callback': () => settle('reject', new Error('Turnstile challenge timed out')),
        });
      })
      .catch((err) => console.error(err));

    return () => {
      cancelled = true;
      settle('reject', new Error('Turnstile widget was removed'));
      if (widgetIdRef.current != null) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      hasRunRef.current = false;
    };
  }, [containerRef, action]);

  return useCallback(
    () =>
      new Promise((resolve, reject) => {
        const turnstile = window.turnstile;
        const widgetId = widgetIdRef.current;
        if (!SITE_KEY || !turnstile || widgetId == null) {
          reject(new Error('Turnstile is not ready'));
          return;
        }
        pendingRef.current?.reject(new Error('Superseded by a newer Turnstile request'));
        pendingRef.current = { resolve, reject };
        // Tokens are single-use: clear the previous one before running again.
        if (hasRunRef.current) turnstile.reset(widgetId);
        hasRunRef.current = true;
        turnstile.execute(widgetId);
      }),
    []
  );
}

// Netlify Function: receives Contact form submissions, verifies the
// Cloudflare Turnstile token, then forwards the message to the Google Sheet
// endpoint and the Slack webhook. Keeping those URLs here (instead of in
// REACT_APP_* vars) keeps them out of the public JS bundle.
//
// Required env vars (set in Netlify site settings):
//   TURNSTILE_SECRET_KEY        - Cloudflare Turnstile secret key
//   CONTACT_SHEET_URL           - Google Apps Script / Sheet submission URL
//   CONTACT_SLACK_WEBHOOK_URL   - Slack webhook URL

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EXPECTED_ACTION = 'contact';

const CATEGORIES = [
  'General',
  'Bug Report or Error',
  'Data Question',
  'Feature Request',
  'Technical or Open Source Questions',
  'Press or Media',
];

const LIMITS = {
  Contact_Name: 200,
  Contact_Email: 320,
  Contact_Phone: 40,
  Message: 5000,
};

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const json = (statusCode, body) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

async function verifyTurnstile(secret, token, remoteip) {
  const body = { secret, response: token };
  if (remoteip) body.remoteip = remoteip;

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Turnstile verify returned ${res.status}`);
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: 'Method Not Allowed' };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  const sheetUrl = process.env.CONTACT_SHEET_URL;
  const slackUrl = process.env.CONTACT_SLACK_WEBHOOK_URL;
  if (!secret || !sheetUrl || !slackUrl) {
    console.error('Contact function is missing TURNSTILE_SECRET_KEY, CONTACT_SHEET_URL or CONTACT_SLACK_WEBHOOK_URL');
    return json(500, { error: 'Contact form is not configured.' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid request body.' });
  }

  // --- Turnstile verification ---
  const token = typeof payload.turnstileToken === 'string' ? payload.turnstileToken : '';
  if (!token || token.length > 2048) return json(400, { error: 'Missing CAPTCHA token.' });

  let verification;
  try {
    verification = await verifyTurnstile(secret, token, event.headers['x-nf-client-connection-ip']);
  } catch (err) {
    console.error('Turnstile verification failed', err);
    return json(502, { error: 'Could not verify CAPTCHA. Please try again.' });
  }

  // Cloudflare's dummy testing keys don't return an action, so only enforce
  // it for real keys.
  const isTestingKey = verification.metadata?.result_with_testing_key === true;
  if (!verification.success || (!isTestingKey && verification.action !== EXPECTED_ACTION)) {
    console.warn('Turnstile rejected submission', {
      success: verification.success,
      action: verification.action,
      hostname: verification.hostname,
      errors: verification['error-codes'],
    });
    return json(403, { error: 'CAPTCHA check failed. Please try again.' });
  }

  // --- Field validation (never trust the client) ---
  const form = {
    Category: CATEGORIES.includes(payload.Category) ? payload.Category : 'General',
    Contact_Name: clean(payload.Contact_Name, LIMITS.Contact_Name),
    Contact_Email: clean(payload.Contact_Email, LIMITS.Contact_Email),
    Contact_Phone: clean(payload.Contact_Phone, LIMITS.Contact_Phone),
    Message: clean(payload.Message, LIMITS.Message),
  };
  if (!form.Contact_Name || !form.Message || !EMAIL_PATTERN.test(form.Contact_Email)) {
    return json(400, { error: 'Please fill in your name, a valid email, and a message.' });
  }

  const pageUrl = clean(payload.pageUrl, 500);

  // --- Forward to Google Sheet ---
  const sheetParams = new URLSearchParams({
    Date: new Date().toISOString().slice(0, 10),
    ...form,
  });
  const sheetSeparator = sheetUrl.includes('?') ? '&' : '?';

  let slackText = `Submission from ${pageUrl || 'contact form'}`;
  slackText += `\n*Name:* ${form.Contact_Name}`;
  slackText += `\n*Email:* ${form.Contact_Email}`;
  slackText += `\n*Phone:* ${form.Contact_Phone || '_'}`;
  slackText += `\n*Message Category:* ${form.Category}`;
  slackText += `\n---\n${form.Message}`;

  const results = await Promise.allSettled([
    fetch(`${sheetUrl}${sheetSeparator}${sheetParams}`, { method: 'GET' }),
    fetch(slackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: slackText }),
    }),
  ]);

  const failures = results
    .map((r, i) => ({ r, target: i === 0 ? 'sheet' : 'slack' }))
    .filter(({ r }) => r.status === 'rejected' || !r.value.ok);
  failures.forEach(({ r, target }) =>
    console.error(`Contact forward to ${target} failed`, r.status === 'rejected' ? r.reason : r.value.status)
  );

  // Only report failure if the message reached neither destination.
  if (failures.length === results.length) {
    return json(502, { error: 'Could not send your message. Please try again later.' });
  }
  return json(200, { ok: true });
};

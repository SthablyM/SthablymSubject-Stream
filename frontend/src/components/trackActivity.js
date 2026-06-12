// src/utils/trackActivity.js
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight activity logger — sends events to a Google Sheet via Sheet.best
// Fire-and-forget: never blocks the UI, never throws to the caller.
// ─────────────────────────────────────────────────────────────────────────────

const SHEET_API = "https://api.sheetbest.com/sheets/5fcc21f1-ff3b-4b94-b639-dea3501c1228";

/**
 * Log an activity event to the tracking sheet.
 *
 * @param {string} event   - e.g. "code_entry", "quiz_completed", "aps_calculated", "report_printed"
 * @param {object} session - the access/session object (code, school, plan etc.) — pass null if unknown
 * @param {object} details - any extra info you want recorded (e.g. { stream: "Science", aps: 32 })
 */
export function trackActivity(event, session = null, details = {}) {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      code:    session?.code   || "",
      school:  session?.school || "",
      plan:    session?.plan   || "",
      event,
      details: JSON.stringify(details),
    };

    fetch(SHEET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {}); // silently ignore network errors — never break the app
  } catch (_) {
    // never let logging crash the app
  }
}
// src/components/trackActivity.js
// ─────────────────────────────────────────────────────────────────────────────
// Sends one row per event to your Google Sheet through a Google Apps Script
// web app.
//
// Sheet tab "Log", row 1 headers, exactly:
//   timestamp | event | userId | userType | school | province | grade | firstName | detail
//
// Usage anywhere in the app:
//   trackActivity("quiz_completed", user, { subject: "Maths", score: 3 });
//   trackActivity("aps_calculated", user, { aps: 34 });
// ─────────────────────────────────────────────────────────────────────────────

const TRACKER_URL = "https://script.google.com/macros/s/AKfycbwOW4iGtiFxP-f8nMJWFY7hEzIbvVsNYvjDkAHG9xm7FsiHP_FUEX7G7Ky0Y-MUK2XF/exec";

export function trackActivity(event, user = {}, detail = null) {
  if (!TRACKER_URL) return;

  const row = {
    event,
    userId:    (user && user.userId)    || "",
    userType:  (user && user.userType)  || "",
    school:    (user && user.school)    || "",
    province:  (user && user.province)  || "",
    grade:     (user && user.grade)     || "",
    firstName: (user && user.firstName) || "",
    detail:    detail ? JSON.stringify(detail) : "",
  };

  try {
    // text/plain + no-cors avoids the browser preflight that Apps Script cannot answer
    fetch(TRACKER_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(row),
      keepalive: true,
    }).catch(() => {});
  } catch (_) {
    // Tracking must never break the app
  }
}
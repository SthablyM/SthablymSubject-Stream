// src/components/accountApi.js
// ─────────────────────────────────────────────────────────────────────────────
// Talks to the same Google Apps Script web app as trackActivity, but reads the
// reply. Only a hash of the PIN ever leaves the device.
//
// Every function resolves to an object like { ok: true, ... } or
// { ok: false, error: "exists" | "not_found" | "wrong_pin" | "locked" |
//                      "network" | "server" | "bad_request" }.
// They never throw, so callers can just check `resul
import { TRACKER_URL } from "./trackActivity";

async function sha256Hex(text) {
  if (!window.crypto || !window.crypto.subtle) throw new Error("no-crypto");
  const bytes  = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// the userId is mixed in so the same PIN gives a different hash for every person
export const hashPin = (pin, userId) => sha256Hex(`${userId}:${pin}`);

async function call(payload) {
  try {
    const res = await fetch(TRACKER_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids a CORS preflight
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: "network" };
    return await res.json();
  } catch (_) {
    return { ok: false, error: "network" };
  }
}

// Create an account. Fails with error "exists" if this userId already has one.
export async function registerAccount(userId, profile, pin) {
  try {
    const pinHash = await hashPin(pin, userId);
    return await call({ action: "register", userId, pinHash, profile });
  } catch (_) {
    return { ok: false, error: "network" };
  }
}

// Check a PIN. On success the reply includes the saved `profile`.
export async function loginAccount(userId, pin) {
  try {
    const pinHash = await hashPin(pin, userId);
    return await call({ action: "login", userId, pinHash });
  } catch (_) {
    return { ok: false, error: "network" };
  }
}
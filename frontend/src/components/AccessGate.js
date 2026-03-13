// src/components/AccessGate.js
// ─────────────────────────────────────────────────────────────────────────────
// ACCESS CODE GATE — sits in front of the entire Stablym app.
// Students and schools cannot access anything without a valid code.
//
// HOW TO ADD / REMOVE CODES:
//   Edit the VALID_CODES object below.
//   Each code has: type, school, plan, students, expiry (YYYY-MM-DD or null)
//
// CODE FORMAT:
//   Schools:  STB-[PROVINCE]-[NUMBER]   e.g. STB-JHB-001
//   Students: STB-STU-[NUMBER]          e.g. STB-STU-1001
//   Pilot:    STB-PILOT-[NUMBER]        e.g. STB-PILOT-01
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import StablymLogo from "./StablymLogoComponent";

// ══ MASTER CODE LIST — edit this to add/remove access ════════════════════════
const VALID_CODES = {

  // ── SCHOOL CODES (Starter — up to 50 students) ─────────────────────────
  "STB-JHB-001": { type: "school", school: "Demo School Johannesburg",  plan: "Starter",  students: 50,  expiry: null },
  "STB-CPT-001": { type: "school", school: "Demo School Cape Town",     plan: "Starter",  students: 50,  expiry: null },
  "STB-DBN-001": { type: "school", school: "Demo School Durban",        plan: "Starter",  students: 50,  expiry: null },

  // ── SCHOOL CODES (Standard — up to 100 students) ───────────────────────
  "STB-JHB-002": { type: "school", school: "Johannesburg High School",  plan: "Standard", students: 100, expiry: null },
  "STB-CPT-002": { type: "school", school: "Cape Town High School",     plan: "Standard", students: 100, expiry: null },

  // ── PILOT CODES (7-day free trial) ─────────────────────────────────────
  "STB-PILOT-01": { type: "pilot",  school: "Pilot School 1",           plan: "Pilot",    students: 30,  expiry: "2026-04-30" },
  "STB-PILOT-02": { type: "pilot",  school: "Pilot School 2",           plan: "Pilot",    students: 30,  expiry: "2026-04-30" },
  "STB-PILOT-03": { type: "pilot",  school: "Pilot School 3",           plan: "Pilot",    students: 30,  expiry: "2026-04-30" },

  // ── STUDENT INDIVIDUAL CODES (R50/month) ───────────────────────────────
  "STB-STU-1001": { type: "student", school: "Individual",              plan: "Student Plus",     students: 1, expiry: null },
  "STB-STU-1002": { type: "student", school: "Individual",              plan: "Student Plus",     students: 1, expiry: null },
  "STB-STU-1003": { type: "student", school: "Individual",              plan: "Student Plus",     students: 1, expiry: null },
  "STB-STU-1004": { type: "student", school: "Individual",              plan: "Student Plus",     students: 1, expiry: null },
  "STB-STU-1005": { type: "student", school: "Individual",              plan: "Student Plus",     students: 1, expiry: null },

  // ── MATRIC BOOSTER CODES (R89/month) ───────────────────────────────────
  "STB-MAT-2001": { type: "student", school: "Individual",              plan: "Matric Booster",   students: 1, expiry: null },
  "STB-MAT-2002": { type: "student", school: "Individual",              plan: "Matric Booster",   students: 1, expiry: null },

  // ── ADMIN / OWNER CODE (full access, never expires) ────────────────────
  "STB-ADMIN-999": { type: "admin", school: "Stablym Admin",            plan: "Admin",    students: 999, expiry: null },
};
// ═════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = "stablym_access";

// Check if a code is valid and not expired
function validateCode(raw) {
  const code = raw.trim().toUpperCase();
  const entry = VALID_CODES[code];
  if (!entry) return { valid: false, reason: "Invalid code" };
  if (entry.expiry) {
    const today = new Date();
    const exp   = new Date(entry.expiry);
    if (today > exp) return { valid: false, reason: "This code has expired" };
  }
  return { valid: true, code, ...entry };
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function AccessGate({ children }) {
  const [access,   setAccess]   = useState(null);   // null = checking, false = locked, object = granted
  const [input,    setInput]    = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Re-validate in case code was revoked or expired
        const result = validateCode(parsed.code);
        if (result.valid) {
          setAccess(result);
          return;
        }
      }
    } catch (_) {}
    setAccess(false);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) { setError("Please enter your access code"); return; }
    setLoading(true);
    setError("");

    // Small delay to feel like it's checking
    setTimeout(() => {
      const result = validateCode(input);
      if (result.valid) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        setAccess(result);
      } else {
        setError(result.reason === "This code has expired"
          ? "⏰ This code has expired. WhatsApp 068 543 8227 to renew."
          : "❌ Invalid code. Check your code and try again, or WhatsApp 068 543 8227."
        );
      }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAccess(false);
    setInput("");
    setError("");
  };

  // ── Still checking localStorage ──
  if (access === null) return (
    <div style={s.loadWrap}>
      <div style={s.spinner} />
    </div>
  );

  // ── Access granted — render the app ──
  if (access) return (
    <>
      {/* Small top banner showing school/plan */}
      <div style={s.accessBanner}>
        <span style={s.bannerLeft}>
          <span style={s.bannerDot} />
          {access.type === "admin"   ? "👑 Admin Access" :
           access.type === "pilot"   ? "🚀 Pilot Access — " + access.school :
           access.type === "school"  ? "🏫 " + access.school + " — " + access.plan :
                                       "⭐ " + access.plan}
        </span>
        <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
      {children}
    </>
  );

  // ── Access denied — show gate ──
  return (
    <div style={s.wrap}>
      {/* Background grid */}
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />

      <div style={s.card}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <StablymLogo variant="dark" size="md" />
        </div>

        <h2 style={s.title}>Enter Your Access Code</h2>
        <p style={s.subtitle}>
          Your school or subscription code is required to access Stablym.
          No code? See options below.
        </p>

        {/* Input */}
        <div style={s.inputWrap}>
          <input
            style={{ ...s.codeInput, borderColor: error ? "#ef4444" : input ? "#0ea5e9" : "rgba(255,255,255,.15)" }}
            type="text"
            placeholder="e.g. STB-JHB-001"
            value={input}
            onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoComplete="off"
            spellCheck="false"
          />
          <button
            style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Checking..." : "Enter App →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={s.errorBox}>
            {error}
          </div>
        )}

        {/* Divider */}
        <div style={s.divider}><span style={s.dividerText}>Don't have a code?</span></div>

        {/* Options */}
        <div style={s.options}>
          <a href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20need%20an%20access%20code%20please." target="_blank" rel="noreferrer" style={s.optionBtn}>
            <span style={{ fontSize: 18 }}>💬</span>
            <div>
              <div style={s.optionTitle}>WhatsApp for a Code</div>
              <div style={s.optionSub}>068 543 8227 · Get your code immediately</div>
            </div>
          </a>
          <a href="mailto:mmathapelosebela@gmail.com?subject=Stablym Access Code Request" style={s.optionBtn}>
            <span style={{ fontSize: 18 }}>📧</span>
            <div>
              <div style={s.optionTitle}>Email Us</div>
              <div style={s.optionSub}>mmathapelosebela@gmail.com</div>
            </div>
          </a>
        </div>

        {/* Help toggle */}
        <button style={s.helpToggle} onClick={() => setShowHelp(v => !v)}>
          {showHelp ? "Hide" : "How does the access code work? ▾"}
        </button>

        {showHelp && (
          <div style={s.helpBox}>
            <div style={s.helpRow}><span style={s.helpDot("blue")} /><div><strong>School code</strong> — e.g. STB-JHB-001 · Shared by your teacher with your whole class</div></div>
            <div style={s.helpRow}><span style={s.helpDot("green")} /><div><strong>Student code</strong> — e.g. STB-STU-1001 · For individual R50/month subscribers</div></div>
            <div style={s.helpRow}><span style={s.helpDot("amber")} /><div><strong>Pilot code</strong> — e.g. STB-PILOT-01 · Free 7-day trial for schools</div></div>
            <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,.35)", lineHeight: 1.6 }}>
              Codes are case-insensitive. Your code is saved so you only need to enter it once per device.
            </div>
          </div>
        )}

        <div style={s.footer}>
          Not a school yet? <a href="/stablym-website.html" style={{ color: "#0ea5e9" }}>View plans & pricing →</a>
        </div>
      </div>
    </div>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const s = {
  loadWrap:    { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e1a" },
  spinner:     { width: 36, height: 36, border: "3px solid rgba(255,255,255,.1)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  wrap:        { minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', sans-serif" },
  bgGrid:      { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 },
  bgGlow:      { position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(14,165,233,.12) 0%, transparent 70%)", zIndex: 0 },
  card:        { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, padding: "44px 40px", maxWidth: 480, width: "100%", position: "relative", zIndex: 2, backdropFilter: "blur(12px)" },
  title:       { fontFamily: "'Segoe UI', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 10, letterSpacing: -1 },
  subtitle:    { fontSize: 14, color: "rgba(255,255,255,.5)", textAlign: "center", lineHeight: 1.7, marginBottom: 28 },
  inputWrap:   { display: "flex", flexDirection: "column", gap: 10 },
  codeInput:   { width: "100%", padding: "14px 18px", background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", borderRadius: 12, fontSize: 18, fontWeight: 700, color: "#fff", outline: "none", textAlign: "center", letterSpacing: 3, fontFamily: "'DM Mono', 'Courier New', monospace", transition: "border-color .2s" },
  submitBtn:   { width: "100%", padding: "14px", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "all .2s" },
  errorBox:    { marginTop: 12, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fca5a5", lineHeight: 1.6 },
  divider:     { position: "relative", textAlign: "center", margin: "28px 0 20px", borderTop: "1px solid rgba(255,255,255,.08)" },
  dividerText: { position: "relative", top: -10, background: "rgba(255,255,255,.04)", padding: "0 14px", fontSize: 12, color: "rgba(255,255,255,.3)", fontWeight: 600 },
  options:     { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn:   { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, textDecoration: "none", transition: "all .2s", cursor: "pointer" },
  optionTitle: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 },
  optionSub:   { fontSize: 12, color: "rgba(255,255,255,.4)" },
  helpToggle:  { display: "block", width: "100%", marginTop: 20, background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 12, cursor: "pointer", textAlign: "center", fontFamily: "'Segoe UI', sans-serif", transition: "color .2s" },
  helpBox:     { marginTop: 14, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 },
  helpRow:     { display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.6 },
  helpDot:     (c) => ({ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 6, background: c === "blue" ? "#0ea5e9" : c === "green" ? "#16a34a" : "#f59e0b" }),
  footer:      { marginTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.25)" },
  // Access banner (shown when logged in)
  accessBanner:{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Segoe UI', sans-serif" },
  bannerLeft:  { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 },
  bannerDot:   { width: 7, height: 7, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px #16a34a" },
  logoutBtn:   { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.45)", fontSize: 12, padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "all .2s" },
};

// Inject spinner keyframes
const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } } .optionBtn:hover { background: rgba(255,255,255,.08) !important; border-color: rgba(14,165,233,.3) !important; }`;
document.head.appendChild(styleTag);
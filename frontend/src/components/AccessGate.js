// src/components/AccessGate.js
// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION GATE — shows plans first, then code entry for existing subscribers
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import StablymLogo from "./StablymLogoComponent";

const VALID_CODES = {
  "STB-JHB-001":  { type: "school",  school: "Demo School Johannesburg", plan: "Starter",       students: 50,  expiry: null },
  "STB-CPT-001":  { type: "school",  school: "Demo School Cape Town",    plan: "Starter",       students: 50,  expiry: null },
  "STB-DBN-001":  { type: "school",  school: "Demo School Durban",       plan: "Starter",       students: 50,  expiry: null },
  "STB-JHB-002":  { type: "school",  school: "Johannesburg High School", plan: "Standard",      students: 100, expiry: null },
  "STB-CPT-002":  { type: "school",  school: "Cape Town High School",    plan: "Standard",      students: 100, expiry: null },
  "STB-PILOT-01": { type: "pilot",   school: "Pilot School 1",           plan: "Pilot",         students: 30,  expiry: "2026-04-30" },
  "STB-PILOT-02": { type: "pilot",   school: "Pilot School 2",           plan: "Pilot",         students: 30,  expiry: "2026-04-30" },
  "STB-PILOT-03": { type: "pilot",   school: "Pilot School 3",           plan: "Pilot",         students: 30,  expiry: "2026-04-30" },
  "STB-STU-1001": { type: "student", school: "Individual",               plan: "Student Plus",  students: 1,   expiry: null },
  "STB-STU-1002": { type: "student", school: "Individual",               plan: "Student Plus",  students: 1,   expiry: null },
  "STB-STU-1003": { type: "student", school: "Individual",               plan: "Student Plus",  students: 1,   expiry: null },
  "STB-STU-1004": { type: "student", school: "Individual",               plan: "Student Plus",  students: 1,   expiry: null },
  "STB-STU-1005": { type: "student", school: "Individual",               plan: "Student Plus",  students: 1,   expiry: null },
  "STB-MAT-2001": { type: "student", school: "Individual",               plan: "Matric Booster",students: 1,   expiry: null },
  "STB-MAT-2002": { type: "student", school: "Individual",               plan: "Matric Booster",students: 1,   expiry: null },
  "STB-ADMIN-999":{ type: "admin",   school: "Stablym Admin",            plan: "Admin",         students: 999, expiry: null },
};

const STORAGE_KEY = "stablym_access";

function validateCode(raw) {
  const code  = raw.trim().toUpperCase();
  const entry = VALID_CODES[code];
  if (!entry) return { valid: false, reason: "Invalid code" };
  if (entry.expiry) {
    if (new Date() > new Date(entry.expiry))
      return { valid: false, reason: "This code has expired" };
  }
  return { valid: true, code, ...entry };
}

export default function AccessGate({ children }) {
  const [access,      setAccess]      = useState(null);
  const [input,       setInput]       = useState("");
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const result = validateCode(parsed.code);
        if (result.valid) { setAccess(result); return; }
      }
    } catch (_) {}
    setAccess(false);
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) { setError("Please enter your access code"); return; }
    setLoading(true);
    setError("");
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
    setShowCodeBox(false);
  };

  // ── Loading ──
  if (access === null) return (
    <div style={s.loadWrap}><div style={s.spinner} /></div>
  );

  // ── Granted ──
  if (access) return (
    <>
      <div style={s.accessBanner}>
        <span style={s.bannerLeft}>
          <span style={s.bannerDot} />
          {access.type === "admin"  ? "👑 Admin Access" :
           access.type === "pilot"  ? "🚀 Pilot — " + access.school :
           access.type === "school" ? "🏫 " + access.school + " · " + access.plan :
                                      "⭐ " + access.plan}
        </span>
        <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
      {children}
    </>
  );

  // ── Subscription gate ──
  return (
    <div style={s.wrap}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />

      <div style={s.card}>
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <StablymLogo variant="dark" size="md" />
        </div>

        <h2 style={s.title}>Choose Your Plan</h2>
        <p style={s.subtitle}>
          Get instant access. Schools and individual students welcome.
        </p>

        {/* Plan cards */}
        <div style={s.plans}>
          {/* Student Plus */}
          <div style={{ ...s.planCard, borderColor: "rgba(14,165,233,.35)" }}>
            <div>
              <div style={{ ...s.planName, color: "#0ea5e9" }}>Student Plus</div>
              <div style={s.planDesc}>Individual · All subjects</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={s.planPrice}>R49<span style={s.planPer}>/mo</span></div>
              <a
                href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20want%20the%20Student%20Plus%20plan%20(R50/mo)%20please."
                target="_blank" rel="noreferrer"
                style={{ ...s.planBadge, background: "rgba(14,165,233,.18)", color: "#0ea5e9" }}
              >
                Subscribe →
              </a>
            </div>
          </div>

          {/* Matric Booster */}
          <div style={{ ...s.planCard, borderColor: "rgba(245,158,11,.3)" }}>
            <div>
              <div style={{ ...s.planName, color: "#f59e0b" }}>Matric Booster</div>
              <div style={s.planDesc}>Grade 12 · Exam prep</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={s.planPrice}>R69<span style={s.planPer}>/mo</span></div>
              <a
                href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20want%20the%20Matric%20Booster%20plan%20(R89/mo)%20please."
                target="_blank" rel="noreferrer"
                style={{ ...s.planBadge, background: "rgba(245,158,11,.15)", color: "#f59e0b" }}
              >
                Subscribe →
              </a>
            </div>
          </div>

          {/* School */}
          <div style={{ ...s.planCard, borderColor: "rgba(255,255,255,.1)" }}>
            <div>
              <div style={{ ...s.planName, color: "rgba(255,255,255,.7)" }}>School Plan</div>
              <div style={s.planDesc}>Starter · up to 50 students</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...s.planPrice, fontSize: 14, color: "rgba(255,255,255,.7)" }}>Contact us</div>
              <a
                href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20want%20a%20school%20plan%20please."
                target="_blank" rel="noreferrer"
                style={{ ...s.planBadge, background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.5)" }}
              >
                WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Contact options */}
        <div style={s.options}>
          <a href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20need%20an%20access%20code%20please." target="_blank" rel="noreferrer" style={s.optionBtn}>
            <span style={{ fontSize: 16 }}>💬</span>
            <div>
              <div style={s.optionTitle}>Subscribe via WhatsApp</div>
              <div style={s.optionSub}>068 543 8227 · Get your code immediately</div>
            </div>
          </a>
          <a href="mailto:mmathapelosebela@gmail.com?subject=Stablym Subscription Request" style={s.optionBtn}>
            <span style={{ fontSize: 16 }}>📧</span>
            <div>
              <div style={s.optionTitle}>Email Us</div>
              <div style={s.optionSub}>mmathapelosebela@gmail.com</div>
            </div>
          </a>
        </div>

        {/* Already have a code? */}
        <div style={s.codeSection}>
          <button style={s.helpToggle} onClick={() => setShowCodeBox(v => !v)}>
            {showCodeBox ? "Hide ▴" : "Already have a code? ▾"}
          </button>

          {showCodeBox && (
            <div style={{ marginTop: 12 }}>
              <div style={s.inputWrap}>
                <input
                  style={{ ...s.codeInput, borderColor: error ? "#ef4444" : input ? "#0ea5e9" : "rgba(255,255,255,.15)" }}
                  type="text"
                  placeholder="Enter your access code"
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
              {error && <div style={s.errorBox}>{error}</div>}
            </div>
          )}
        </div>

        <div style={s.footer}>
          Want to try first?{" "}
          <a href="/stablym-website.html" style={{ color: "#0ea5e9" }}>View plans &amp; demo →</a>
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
  subtitle:    { fontSize: 14, color: "rgba(255,255,255,.5)", textAlign: "center", lineHeight: 1.7, marginBottom: 24 },

  plans:       { display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 },
  planCard:    { background: "rgba(255,255,255,.05)", border: "1px solid", borderRadius: 14, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  planName:    { fontSize: 13, fontWeight: 700, marginBottom: 2, textTransform: "uppercase", letterSpacing: .5 },
  planDesc:    { fontSize: 13, color: "rgba(255,255,255,.5)" },
  planPrice:   { fontSize: 22, fontWeight: 800, color: "#fff" },
  planPer:     { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,.4)" },
  planBadge:   { display: "inline-block", fontSize: 10, padding: "3px 10px", borderRadius: 20, marginTop: 5, textDecoration: "none", fontWeight: 700 },

  options:     { display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 },
  optionBtn:   { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, textDecoration: "none" },
  optionTitle: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 },
  optionSub:   { fontSize: 12, color: "rgba(255,255,255,.4)" },

  codeSection: { marginTop: 16 },
  helpToggle:  { display: "block", width: "100%", background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 12, cursor: "pointer", textAlign: "center", fontFamily: "'Segoe UI', sans-serif" },
  inputWrap:   { display: "flex", flexDirection: "column", gap: 10 },
  codeInput:   { width: "100%", padding: "14px 18px", background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", borderRadius: 12, fontSize: 18, fontWeight: 700, color: "#fff", outline: "none", textAlign: "center", letterSpacing: 3, fontFamily: "'DM Mono','Courier New',monospace", transition: "border-color .2s", boxSizing: "border-box" },
  submitBtn:   { width: "100%", padding: "14px", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  errorBox:    { marginTop: 12, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fca5a5", lineHeight: 1.6 },

  footer:      { marginTop: 24, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.25)" },
  accessBanner:{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Segoe UI', sans-serif" },
  bannerLeft:  { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 },
  bannerDot:   { width: 7, height: 7, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px #16a34a" },
  logoutBtn:   { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.45)", fontSize: 12, padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag)
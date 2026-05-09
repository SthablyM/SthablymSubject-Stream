// src/components/AccessGate.js
// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION GATE — landing/about page → plans → code entry
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import StablymLogo from "./StablymLogoComponent";

const API_BASE = "https://sthablymsubject-stream.onrender.com";

// ─────────────────────────────────────────────────────────────────────────────
const VALID_CODES = {
  "STB-JHB-001":  { type: "school",  school: "Demo School Johannesburg", plan: "Starter",        students: 50,  expiry: null },
  "STB-CPT-001":  { type: "school",  school: "Demo School Cape Town",    plan: "Starter",        students: 50,  expiry: null },
  "STB-DBN-001":  { type: "school",  school: "Demo School Durban",       plan: "Starter",        students: 50,  expiry: null },
  "STB-JHB-002":  { type: "school",  school: "Johannesburg High School", plan: "Standard",       students: 100, expiry: null },
  "STB-CPT-002":  { type: "school",  school: "Cape Town High School",    plan: "Standard",       students: 100, expiry: null },
  "STB-PILOT-01": { type: "pilot",   school: "Pilot School 1",           plan: "Pilot",          students: 30,  expiry: "2026-07-31" },
  "STB-PILOT-02": { type: "pilot",   school: "Pilot School 2",           plan: "Pilot",          students: 30,  expiry: "2026-07-31" },
  "STB-PILOT-03": { type: "pilot",   school: "Pilot School 3",           plan: "Pilot",          students: 30,  expiry: "2026-07-31" },
  "STB-STU-1001": { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1002": { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1003": { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1004": { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1005": { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-MAT-2001": { type: "student", school: "Individual",               plan: "Matric Booster", students: 1,   expiry: null },
  "STB-MAT-2002": { type: "student", school: "Individual",               plan: "Matric Booster", students: 1,   expiry: null },
  "STB-ADMIN-999":{ type: "admin",   school: "Stablym Admin",            plan: "Admin",          students: 999, expiry: null },
};

const STORAGE_KEY = "stablym_access";

function validateCode(raw) {
  const code  = raw.trim().toUpperCase();
  const entry = VALID_CODES[code];
  if (!entry) return { valid: false, reason: "Invalid code" };
  if (entry.expiry && new Date() > new Date(entry.expiry)) {
    return { valid: false, reason: "This code has expired" };
  }
  return { valid: true, code, ...entry };
}

// ─── FEATURES DATA ────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: "🔬", title: "Stream Selector Quiz",    desc: "Discover whether you belong in Science, Commerce, Humanities, or Engineering — built for Grade 8 & 9 learners." },
  { icon: "📊", title: "Live APS Calculator",     desc: "Watch your APS update in real time. Best 6 subjects, LO excluded — exactly per DBE rules." },
  { icon: "🎓", title: "University Matcher",      desc: "55+ programmes across UCT, Wits, UP, UKZN and more. See what you qualify for right now." },
  { icon: "💰", title: "Bursary Finder",          desc: "NSFAS, Sasol, Anglo American and sector-specific bursaries matched to your stream and APS score." },
  { icon: "📝", title: "Past Papers Quiz",        desc: "510+ NSC-style questions across 15 subjects for Grades 8–12. Timed, with explanations after each question." },
  { icon: "🔒", title: "Teacher Invigilation Log",desc: "Record exam dates, venues, and sign-off declarations. Prevents cheating disputes. Prints to the APS report." },
  { icon: "🖨️", title: "Printable APS Reports",  desc: "Full student reports with marks, symbols, APS, university eligibility, exam records, and signature blocks." },
  { icon: "🏫", title: "School Dashboard",        desc: "Manage your whole class. See every student's APS at a glance, track exam records, and export reports." },
  { icon: "🇿🇦", title: "Built for SA",           desc: "NSC symbols (A–G), South African universities, NSFAS, all 9 provinces. Made for your school, not retrofitted." },
];

const STREAMS = [
  { color: "#2563eb", bg: "rgba(37,99,235,.12)", border: "rgba(37,99,235,.25)", emoji: "🔬", name: "Science",     careers: "Medicine · Engineering · Pharmacy · Biotechnology" },
  { color: "#16a34a", bg: "rgba(22,163,74,.12)",  border: "rgba(22,163,74,.25)",  emoji: "📊", name: "Commerce",    careers: "Accounting · Finance · Economics · Business Management" },
  { color: "#9333ea", bg: "rgba(147,51,234,.12)", border: "rgba(147,51,234,.25)", emoji: "🎭", name: "Humanities",  careers: "Law · Education · Journalism · Social Work · Arts" },
  { color: "#ea580c", bg: "rgba(234,88,12,.12)",  border: "rgba(234,88,12,.25)",  emoji: "⚙️", name: "Engineering", careers: "Civil Tech · Electrical · Mechanical · EGD · IT" },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function AccessGate({ children }) {
  const [access,      setAccess]      = useState(null);
  const [input,       setInput]       = useState("");
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [view,        setView]        = useState("about"); // "about" | "plans"

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const result = validateCode(parsed.code);
        if (result.valid) { setAccess(result); return; }
      }
    } catch (_) {}

    const params  = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const email   = params.get("email");

    if (payment === "success" && email) {
      window.history.replaceState({}, "", window.location.pathname);
      verifySubscriptionByEmail(email);
      return;
    }
    if (payment === "cancelled") {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setAccess(false);
  }, []);

  async function verifySubscriptionByEmail(email) {
    try {
      const res  = await fetch(`${API_BASE}/api/check-subscription?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.active) {
        const session = { code: `PAID-${email}`, type: "student", school: "Individual", plan: "Paid", students: 1, expiry: null, email };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        setAccess(session);
      } else {
        setTimeout(async () => {
          const res2  = await fetch(`${API_BASE}/api/check-subscription?email=${encodeURIComponent(email)}`);
          const data2 = await res2.json();
          if (data2.active) {
            const session = { code: `PAID-${email}`, type: "student", school: "Individual", plan: "Paid", students: 1, expiry: null, email };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
            setAccess(session);
          } else {
            setError("⚠️ Payment received but not confirmed yet. Please wait a moment and refresh, or contact support via WhatsApp.");
            setAccess(false);
          }
        }, 3000);
      }
    } catch (e) {
      console.error("Subscription check failed:", e);
      setAccess(false);
    }
  }

  const handleSubscribe = (plan, userEmail = "") => {
    window.location.href = `${API_BASE}/api/subscribe?plan=${plan}&email=${encodeURIComponent(userEmail)}`;
  };

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
        setError(
          result.reason === "This code has expired"
            ? "⏰ This code has expired. Please renew your subscription."
            : "❌ Invalid code. Please check your code or subscribe to continue."
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
    setView("about");
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (access === null) return (
    <div style={s.loadWrap}><div style={s.spinner} /></div>
  );

  // ── Granted ──────────────────────────────────────────────────────────────────
  if (access) return (
    <>
      <div style={s.accessBanner}>
        <span style={s.bannerLeft}>
          <span style={s.bannerDot} />
          {access.type === "admin"  ? "👑 Admin Access" :
           access.type === "pilot"  ? "🚀 Pilot — " + access.school :
           access.type === "school" ? "🏫 " + access.school + " · " + access.plan :
           access.email             ? "⭐ Active Subscription · " + access.email :
                                      "⭐ " + access.plan}
        </span>
        <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
      {children}
    </>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // ABOUT / LANDING VIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (view === "about") {
    return (
      <div style={s.wrap}>
        <div style={s.bgGrid} />
        <div style={s.bgGlow} />

        <div style={{ ...s.pageWrap, position: "relative", zIndex: 2 }}>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div style={s.hero}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
              <StablymLogo variant="dark" size="md" />
            </div>

            <div style={s.heroBadge}>🇿🇦 Built exclusively for South African learners</div>

            <h1 style={s.heroTitle}>
              Find where<br />
              <span style={{ color: "#38bdf8" }}>you belong.</span>
            </h1>

            <p style={s.heroSub}>
              South African schools offer four main subject streams. Stablym helps every learner
              discover which path aligns with their strengths, interests, and career goals.
            </p>

            <div style={s.heroCtas}>
              <button onClick={() => setView("plans")} style={s.ctaPrimary}>
                Get Started — from R29/mo →
              </button>
              <a
                href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%27m%20a%20school%20and%20would%20like%20to%20find%20out%20more."
                target="_blank" rel="noreferrer"
                style={s.ctaSecondary}
              >
                🏫 School enquiry
              </a>
            </div>

            <div style={s.heroStats}>
              <div style={s.statItem}><span style={s.statNum}>510+</span><span style={s.statLabel}>Practice questions</span></div>
              <div style={s.statDiv} />
              <div style={s.statItem}><span style={s.statNum}>55+</span><span style={s.statLabel}>University programmes</span></div>
              <div style={s.statDiv} />
              <div style={s.statItem}><span style={s.statNum}>9</span><span style={s.statLabel}>Provinces covered</span></div>
            </div>
          </div>

          {/* ── Streams ──────────────────────────────────────────────────── */}
          <div style={s.section}>
            <p style={s.sectionEyebrow}>Choose your stream</p>
            <h2 style={s.sectionTitle}>Find where you belong</h2>
            <p style={s.sectionSub}>
              Each stream opens specific university doors. Choosing correctly in Grade 9
              is one of the most important decisions a learner makes.
            </p>

            <div style={s.streamsGrid}>
              {STREAMS.map((st) => (
                <div key={st.name} style={{ ...s.streamCard, background: st.bg, borderColor: st.border }}>
                  <span style={{ fontSize: 28, display: "block", marginBottom: 10 }}>{st.emoji}</span>
                  <div style={{ fontSize: 16, fontWeight: 700, color: st.color, marginBottom: 6 }}>{st.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.6 }}>{st.careers}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Features ─────────────────────────────────────────────────── */}
          <div style={s.section}>
            <p style={s.sectionEyebrow}>Everything in one place</p>
            <h2 style={s.sectionTitle}>Every tool your school needs</h2>

            <div style={s.featuresGrid}>
              {FEATURES.map((f) => (
                <div key={f.title} style={s.featureCard}>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 10 }}>{f.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Social proof / quote ──────────────────────────────────────── */}
          <div style={s.quoteBlock}>
            <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>"</div>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.75)", lineHeight: 1.8, margin: "0 0 16px", fontStyle: "italic" }}>
              Choosing the wrong subjects in Grade 9 costs learners years. Stablym gives
              them the information they need before it's too late — in plain language, instantly.
            </p>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.35)", fontWeight: 600, letterSpacing: .5 }}>
              — Stablym · Made in South Africa
            </div>
          </div>

          {/* ── CTA footer ───────────────────────────────────────────────── */}
          <div style={s.ctaFooter}>
            <h2 style={{ ...s.sectionTitle, marginBottom: 8 }}>Ready to start?</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", marginBottom: 28 }}>
              Join learners and schools across all 9 provinces.
            </p>
            <div style={s.heroCtas}>
              <button onClick={() => setView("plans")} style={s.ctaPrimary}>
                View Plans & Subscribe →
              </button>
              <a
                href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20am%20a%20school%20and%20would%20like%20to%20find%20out%20more%20about%20the%20school%20plan."
                target="_blank" rel="noreferrer"
                style={s.ctaSecondary}
              >
                🏫 School enquiry
              </a>
            </div>
            <button
              style={{ marginTop: 20, background: "none", border: "none", color: "rgba(255,255,255,.25)", fontSize: 12, cursor: "pointer", fontFamily: "'Segoe UI',sans-serif" }}
              onClick={() => setView("plans")}
            >
              Already have a code? Enter it here →
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PLANS / CODE ENTRY VIEW
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={s.wrap}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />

      <div style={{ ...s.card, position: "relative", zIndex: 2 }}>
        {/* Back link */}
        <button
          onClick={() => { setView("about"); setError(""); }}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,.35)", fontSize: 12, cursor: "pointer", marginBottom: 20, padding: 0, fontFamily: "'Segoe UI',sans-serif" }}
        >
          ← Back to overview
        </button>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <StablymLogo variant="dark" size="md" />
        </div>

        <h2 style={s.title}>Choose Your Plan</h2>
        <p style={s.subtitle}>
          Get instant access. Schools and individual students welcome.
        </p>

        {error && !showCodeBox && (
          <div style={s.errorBox}>{error}</div>
        )}

        {/* Plan cards */}
        <div style={s.plans}>
          <div style={{ ...s.planCard, borderColor: "rgba(14,165,233,.35)" }}>
            <div>
              <div style={{ ...s.planName, color: "#0ea5e9" }}>Student Plus</div>
              <div style={s.planDesc}>Individual · All subjects</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={s.planPrice}>R29<span style={s.planPer}>/mo</span></div>
              <button
                onClick={() => handleSubscribe("student_plus")}
                style={{ ...s.planBadge, background: "rgba(14,165,233,.18)", color: "#0ea5e9", border: "none", cursor: "pointer" }}
              >
                Subscribe →
              </button>
            </div>
          </div>

          <div style={{ ...s.planCard, borderColor: "rgba(245,158,11,.3)" }}>
            <div>
              <div style={{ ...s.planName, color: "#f59e0b" }}>Matric Booster</div>
              <div style={s.planDesc}>Grade 12 · Exam prep</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={s.planPrice}>R69<span style={s.planPer}>/mo</span></div>
              <button
                onClick={() => handleSubscribe("matric_booster")}
                style={{ ...s.planBadge, background: "rgba(245,158,11,.18)", color: "#f59e0b", border: "none", cursor: "pointer" }}
              >
                Subscribe →
              </button>
            </div>
          </div>

          <a
            href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20am%20a%20school%20and%20would%20like%20to%20find%20out%20more%20about%20the%20school%20plan."
            target="_blank" rel="noreferrer"
            style={{ ...s.planCard, borderColor: "rgba(22,163,74,.3)", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <div style={{ ...s.planName, color: "#4ade80" }}>🏫 School Plan</div>
              <div style={s.planDesc}>50–500 students · Full dashboard</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.3)", marginTop: 4 }}>Invigilation log · APS reports · Class view</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", marginBottom: 6 }}>Custom pricing</div>
              <div style={{ background: "rgba(22,163,74,.18)", color: "#4ade80", border: "1px solid rgba(22,163,74,.35)", fontSize: 11, padding: "5px 12px", borderRadius: 20, fontWeight: 700, whiteSpace: "nowrap" }}>
                Contact us →
              </div>
            </div>
          </a>
        </div>

        {/* Quick subscribe buttons */}
        <div style={s.options}>
          <button onClick={() => handleSubscribe("student_plus")} style={s.optionBtn}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <div>
              <div style={s.optionTitle}>Start Student Subscription</div>
              <div style={s.optionSub}>Instant access after secure payment</div>
            </div>
          </button>
          <a
            href="https://wa.me/27685438227?text=Hi%20Stablym!%20I%20am%20a%20school%20and%20would%20like%20to%20find%20out%20more%20about%20the%20school%20plan."
            target="_blank" rel="noreferrer"
            style={{ ...s.optionBtn, textDecoration: "none" }}
          >
            <span style={{ fontSize: 16 }}>🏫</span>
            <div>
              <div style={s.optionTitle}>School? Contact Us</div>
              <div style={s.optionSub}>WhatsApp us for pricing & setup</div>
            </div>
          </a>
        </div>

        {/* Code entry */}
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
  // shared
  loadWrap:     { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0e1a" },
  spinner:      { width: 36, height: 36, border: "3px solid rgba(255,255,255,.1)", borderTop: "3px solid #0ea5e9", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  wrap:         { minHeight: "100vh", background: "#0a0e1a", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px 80px", position: "relative", overflow: "hidden", fontFamily: "'Segoe UI', sans-serif" },
  bgGrid:       { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 0 },
  bgGlow:       { position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(14,165,233,.10) 0%, transparent 70%)", zIndex: 0 },

  // about page layout
  pageWrap:     { maxWidth: 700, width: "100%", display: "flex", flexDirection: "column", gap: 0 },

  // hero
  hero:         { textAlign: "center", padding: "20px 24px 60px" },
  heroBadge:    { display: "inline-block", background: "rgba(56,189,248,.12)", border: "1px solid rgba(56,189,248,.25)", color: "#38bdf8", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 24, letterSpacing: .4 },
  heroTitle:    { fontSize: 48, fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: -1.5 },
  heroSub:      { fontSize: 15, color: "rgba(255,255,255,.5)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto 32px" },
  heroCtas:     { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 },
  ctaPrimary:   { padding: "14px 28px", background: "linear-gradient(135deg,#0ea5e9,#2563eb)", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Segoe UI',sans-serif" },
  ctaSecondary: { padding: "14px 20px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.7)", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 },
  heroStats:    { display: "inline-flex", alignItems: "center", gap: 24, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "16px 28px", flexWrap: "wrap", justifyContent: "center" },
  statItem:     { display: "flex", flexDirection: "column", alignItems: "center", gap: 3 },
  statNum:      { fontSize: 22, fontWeight: 800, color: "#38bdf8" },
  statLabel:    { fontSize: 11, color: "rgba(255,255,255,.4)", fontWeight: 500 },
  statDiv:      { width: 1, height: 32, background: "rgba(255,255,255,.08)" },

  // sections
  section:      { padding: "48px 24px" },
  sectionEyebrow:{ fontSize: 11, fontWeight: 700, color: "#38bdf8", letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", marginBottom: 10 },
  sectionTitle: { fontSize: 28, fontWeight: 800, color: "#fff", textAlign: "center", margin: "0 0 12px", letterSpacing: -.5 },
  sectionSub:   { fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 36px" },

  // streams
  streamsGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 },
  streamCard:   { borderRadius: 16, border: "1px solid", padding: "20px 16px", textAlign: "center" },

  // features
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 },
  featureCard:  { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "20px 16px" },

  // quote
  quoteBlock:   { margin: "0 24px", background: "rgba(56,189,248,.06)", border: "1px solid rgba(56,189,248,.15)", borderRadius: 20, padding: "36px 40px", textAlign: "center" },

  // cta footer
  ctaFooter:    { textAlign: "center", padding: "60px 24px 0" },

  // plans card (reused from original)
  card:         { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, padding: "40px 40px 44px", maxWidth: 480, width: "100%", backdropFilter: "blur(12px)" },
  title:        { fontSize: 24, fontWeight: 800, color: "#fff", textAlign: "center", marginBottom: 8, letterSpacing: -0.5 },
  subtitle:     { fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", lineHeight: 1.7, marginBottom: 24 },
  plans:        { display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 },
  planCard:     { background: "rgba(255,255,255,.05)", border: "1px solid", borderRadius: 14, padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  planName:     { fontSize: 13, fontWeight: 700, marginBottom: 2, textTransform: "uppercase", letterSpacing: .5 },
  planDesc:     { fontSize: 13, color: "rgba(255,255,255,.45)" },
  planPrice:    { fontSize: 22, fontWeight: 800, color: "#fff" },
  planPer:      { fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,.4)" },
  planBadge:    { display: "inline-block", fontSize: 10, padding: "3px 10px", borderRadius: 20, marginTop: 5, textDecoration: "none", fontWeight: 700 },
  options:      { display: "flex", flexDirection: "column", gap: 10, marginBottom: 4 },
  optionBtn:    { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, cursor: "pointer", textAlign: "left" },
  optionTitle:  { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 2 },
  optionSub:    { fontSize: 12, color: "rgba(255,255,255,.4)" },
  codeSection:  { marginTop: 16 },
  helpToggle:   { display: "block", width: "100%", background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 12, cursor: "pointer", textAlign: "center", fontFamily: "'Segoe UI', sans-serif" },
  inputWrap:    { display: "flex", flexDirection: "column", gap: 10 },
  codeInput:    { width: "100%", padding: "14px 18px", background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", borderRadius: 12, fontSize: 18, fontWeight: 700, color: "#fff", outline: "none", textAlign: "center", letterSpacing: 3, fontFamily: "'DM Mono','Courier New',monospace", transition: "border-color .2s", boxSizing: "border-box" },
  submitBtn:    { width: "100%", padding: "14px", background: "linear-gradient(135deg, #0ea5e9, #2563eb)", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
  errorBox:     { marginTop: 12, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fca5a5", lineHeight: 1.6 },
  footer:       { marginTop: 20, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,.22)" },

  // access banner (shown when logged in)
  accessBanner: { background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'Segoe UI', sans-serif" },
  bannerLeft:   { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 },
  bannerDot:    { width: 7, height: 7, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 6px #16a34a" },
  logoutBtn:    { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.45)", fontSize: 12, padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" },
};

const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);
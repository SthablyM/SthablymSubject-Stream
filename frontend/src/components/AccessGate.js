// src/components/AccessGate.js
// ─────────────────────────────────────────────────────────────────────────────
// SUBSCRIPTION GATE — mission-first landing → schools → code entry
// Matches the new Sthablym HTML site direction:
//   • Disadvantaged schools = free access — lead message
//   • Other schools = simple subscription plans
//   • Individual subscriptions = soft option, not the hero
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import StablymLogo from "./StablymLogoComponent";
import { trackActivity } from "./trackActivity";

const API_BASE = "https://sthablymsubject-stream.onrender.com";

// ─── VALID CODES ─────────────────────────────────────────────────────────────
const VALID_CODES = {
  "STB-JHB-001":   { type: "school",  school: "Demo School Johannesburg", plan: "Starter",        students: 50,  expiry: null },
  "STB-CPT-001":   { type: "school",  school: "Demo School Cape Town",    plan: "Starter",        students: 50,  expiry: null },
  "STB-DBN-001":   { type: "school",  school: "Demo School Durban",       plan: "Starter",        students: 50,  expiry: null },
  "STB-JHB-002":   { type: "school",  school: "Johannesburg High School", plan: "Standard",       students: 100, expiry: null },
  "STB-CPT-002":   { type: "school",  school: "Cape Town High School",    plan: "Standard",       students: 100, expiry: null },
  "STB-PILOT-01":  { type: "pilot",   school: "Pilot School 1",           plan: "Pilot",          students: 30,  expiry: "2026-07-31" },
  "STB-PILOT-02":  { type: "pilot",   school: "Pilot School 2",           plan: "Pilot",          students: 30,  expiry: "2026-07-31" },
  "STB-PILOT-03":  { type: "pilot",   school: "Pilot School 3",           plan: "Pilot",          students: 30,  expiry: "2026-07-31" },
  "STB-STU-1001":  { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1002":  { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1003":  { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1004":  { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-STU-1005":  { type: "student", school: "Individual",               plan: "Student Plus",   students: 1,   expiry: null },
  "STB-MAT-2001":  { type: "student", school: "Individual",               plan: "Matric Booster", students: 1,   expiry: null },
  "STB-MAT-2002":  { type: "student", school: "Individual",               plan: "Matric Booster", students: 1,   expiry: null },
  "STB-ADMIN-999": { type: "admin",   school: "Stablym Admin",            plan: "Admin",          students: 999, expiry: null },
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

// ─── CONTENT DATA ─────────────────────────────────────────────────────────────
const STATS = [
  { num: "67%",  label: "of Grade 12 learners wish they chose different subjects" },
  { num: "3×",   label: "better university placement with early stream guidance"  },
  { num: "55+",  label: "university programmes mapped across SA"                  },
  { num: "Free", label: "for disadvantaged schools — every learner included"      },
];

const HOW_STEPS = [
  { num: "1", color: "#1a7fe0", bg: "rgba(26,127,224,.12)", title: "School Registers",    desc: "Any school can register for access. We set everything up within 24 hours." },
  { num: "2", color: "#5cb85c", bg: "rgba(92,184,92,.12)",  title: "Learners Get Access", desc: "Teacher shares codes with Grade 9 learners. Opens in any browser — no app download." },
  { num: "3", color: "#e8930a", bg: "rgba(232,147,10,.12)", title: "Stream Quiz + APS",   desc: "5-minute quiz + marks entry gives each learner a personalised stream recommendation." },
  { num: "4", color: "#9333ea", bg: "rgba(147,51,234,.12)", title: "Guided Decision",     desc: "Printable report shows stream, APS, university eligibility — before the choice is made." },
];

const FEATURES = [
  { icon: "🔬", title: "Stream Selector Quiz",     desc: "Grade 9 learners discover their ideal stream in 5 minutes — Science, Commerce, Humanities, or Engineering." },
  { icon: "📊", title: "Live APS Calculator",      desc: "Enter marks, get APS instantly. Best 6 subjects, LO excluded — exactly per DBE rules." },
  { icon: "🎓", title: "University Matcher",       desc: "55+ programmes across UCT, Wits, UP, UKZN and more. See what the learner qualifies for right now." },
  { icon: "💰", title: "Bursary Finder",           desc: "NSFAS, Sasol, Anglo American and sector bursaries matched to the learner's stream and APS score." },
  { icon: "📝", title: "NSC Practice Questions",   desc: "510+ past paper-style questions across 15 subjects for Grades 8–12. Timed, with explanations." },
  { icon: "🖨️", title: "Teacher Dashboard",        desc: "See every learner's APS and stream in one place. Print reports for parent evenings." },
];

// ─────────────────────────────────────────────────────────────────────────────
export default function AccessGate({ children }) {
  const [access,      setAccess]      = useState(null);   // null=loading, false=gate, obj=granted
  const [input,       setInput]       = useState("");
  const [error,       setError]       = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [showCode,    setShowCode]    = useState(false);
  // view: "home" | "schools" | "subscribe"
  const [view,        setView]        = useState("home");

  // ── Restore session ──────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const result = validateCode(parsed.code);
        if (result.valid) { setAccess(result); trackActivity("session_resumed", result); return; }
      }
    } catch (_) {}

    const params  = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const email   = params.get("email");

    if (payment === "success" && email) {
      window.history.replaceState({}, "", window.location.pathname);
      verifyByEmail(email);
      return;
    }
    if (payment === "cancelled") {
      window.history.replaceState({}, "", window.location.pathname);
    }
    setAccess(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function verifyByEmail(email) {
    try {
      const res  = await fetch(`${API_BASE}/api/check-subscription?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.active) { grantPaid(email); return; }
      setTimeout(async () => {
        const r2 = await fetch(`${API_BASE}/api/check-subscription?email=${encodeURIComponent(email)}`);
        const d2 = await r2.json();
        if (d2.active) { grantPaid(email); }
        else { setError("⚠️ Payment received but not confirmed yet. Please wait a moment and refresh, or WhatsApp 068 543 8227."); setAccess(false); }
      }, 3000);
    } catch (e) { setAccess(false); }
  }

  function grantPaid(email) {
    const session = { code: `PAID-${email}`, type: "student", school: "Individual", plan: "Paid", students: 1, expiry: null, email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setAccess(session);
    trackActivity("subscription_activated", session);
  }

  const handleSubscribe = (plan, email = "") =>
    (window.location.href = `${API_BASE}/api/subscribe?plan=${plan}&email=${encodeURIComponent(email)}`);

  const handleCodeSubmit = () => {
    if (!input.trim()) { setError("Please enter your access code."); return; }
    setCodeLoading(true); setError("");
    setTimeout(() => {
      const result = validateCode(input);
      if (result.valid) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
        setAccess(result);
        trackActivity("code_entry", result);
      }
      else setError(result.reason === "This code has expired"
        ? "⏰ This code has expired. Please renew — WhatsApp 068 543 8227."
        : "❌ Invalid code. Please check or WhatsApp 068 543 8227 for help.");
      setCodeLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    trackActivity("sign_out", access);
    localStorage.removeItem(STORAGE_KEY);
    setAccess(false); setInput(""); setError(""); setShowCode(false); setView("home");
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (access === null) return (
    <div style={s.centreWrap}>
      <div style={s.spinner} />
    </div>
  );

  // ── Granted ──────────────────────────────────────────────────────────────
  if (access) return (
    <>
      <div style={s.accessBanner}>
        <span style={s.bannerLeft}>
          <span style={s.bannerDot} />
          {access.type === "admin"  ? "👑 Admin"
          : access.type === "pilot" ? `🚀 Pilot — ${access.school}`
          : access.type === "school"? `🏫 ${access.school} · ${access.plan}`
          : access.email            ? `⭐ Active Subscription · ${access.email}`
          :                           `⭐ ${access.plan}`}
        </span>
        <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </div>
      {children}
    </>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // GATE VIEWS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Shared shell ─────────────────────────────────────────────────────────
  const Shell = ({ children: inner }) => (
    <div style={s.wrap}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />
      <div style={s.flagStripe} />
      {/* Nav */}
      <div style={s.topNav}>
        <div style={s.navBrand} onClick={() => setView("home")}>
          <StablymLogo variant="dark" size="sm" />
        </div>
        <div style={s.navLinks}>
          <button style={{ ...s.navLink, ...(view === "schools"  ? s.navLinkActive : {}) }} onClick={() => setView("schools")}>Schools</button>
          <button style={s.navCta} onClick={() => { setView("subscribe"); setShowCode(false); }}>Enter App →</button>
        </div>
      </div>
      <div style={s.pageContent}>{inner}</div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // HOME VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (view === "home") return (
    <Shell>
      {/* Hero */}
      <div style={s.hero}>
        <div style={s.eyebrow}>🇿🇦 Built for South African Schools</div>
        <h1 style={s.heroTitle}>
          Helping Grade 9 Learners<br />
          Choose the <span style={{ color: "#7db8f5" }}>Right Path</span>
        </h1>
        <p style={s.heroSub}>
          Every year, thousands of Grade 9 learners across South Africa choose the wrong subjects
          and only discover the consequences in Grade 12. Sthablym gives schools the tools
          to change that.{" "}
          <strong style={{ color: "rgba(255,255,255,.85)" }}>
            Free for disadvantaged schools. Affordable for everyone else.
          </strong>
        </p>
        <div style={s.heroCtas}>
          <button style={s.btnPrimary} onClick={() => setView("schools")}>
            🏫 Register Your School
          </button>
          <button style={s.btnGhost} onClick={() => { setView("subscribe"); setShowCode(true); }}>
            Have an Access Code? →
          </button>
        </div>
        {/* Proof strip */}
        <div style={s.proofStrip}>
          {["9 Provinces", "55+ Uni Programmes", "510+ Questions", "Free for Disadvantaged Schools"].map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div style={s.proofDiv} />}
              <div style={s.proofItem}>
                <span style={s.proofNum}>{label.split(" ")[0]}</span>
                <span style={s.proofLabel}>{label.split(" ").slice(1).join(" ")}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* The problem */}
      <div style={s.section}>
        <div style={s.sectionEyebrow}>The Problem We're Solving</div>
        <h2 style={s.sectionTitle}>A Grade 9 Decision That Shapes a Life</h2>
        <p style={s.sectionSub}>
          In many schools, learners choose subjects based on what friends pick — not what
          opens doors to their dream career. By Grade 12 it's too late to change.
        </p>
        <div style={s.statsGrid}>
          {STATS.map((st) => (
            <div key={st.num} style={s.statCard}>
              <div style={s.statBigNum}>{st.num}</div>
              <div style={s.statCardLabel}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ ...s.section, background: "rgba(255,255,255,.02)", borderRadius: 20, padding: "40px 32px", margin: "0 0 8px" }}>
        <div style={s.sectionEyebrow}>How It Works</div>
        <h2 style={s.sectionTitle}>Simple for Schools. Transformative for Learners.</h2>
        <div style={s.stepsGrid}>
          {HOW_STEPS.map((step) => (
            <div key={step.num} style={s.stepCard}>
              <div style={{ ...s.stepNum, background: step.bg, color: step.color }}>{step.num}</div>
              <div style={s.stepTitle}>{step.title}</div>
              <div style={s.stepDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={s.section}>
        <div style={s.sectionEyebrow}>What's in the Platform</div>
        <h2 style={s.sectionTitle}>Built Specifically for South African Schools</h2>
        <div style={s.featGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={s.featCard}>
              <span style={{ fontSize: 26, display: "block", marginBottom: 10 }}>{f.icon}</span>
              <div style={s.featTitle}>{f.title}</div>
              <div style={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div style={s.ctaRow}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#7db8f5", marginBottom: 6 }}>For Schools</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>Register your school</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.65, marginBottom: 16 }}>Disadvantaged schools get full access at no cost. Other schools can subscribe to an affordable plan.</div>
          <button style={s.btnPrimary} onClick={() => setView("schools")}>Register Now →</button>
        </div>
      </div>

      {/* Soft subscribe */}
      <div style={s.softSubscribe}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,.6)", marginBottom: 4 }}>Not registering through a school?</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 16, lineHeight: 1.6 }}>Individual learners can still access the full platform for R29/month.</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={s.softBtn} onClick={() => handleSubscribe("student_basic")}>Student Plan — R29/mo</button>
          <button style={{ ...s.softBtn, background: "rgba(255,255,255,.04)", borderColor: "rgba(255,255,255,.1)" }} onClick={() => { setView("subscribe"); setShowCode(true); }}>
            Have a code? Enter it →
          </button>
        </div>
      </div>
    </Shell>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SCHOOLS VIEW
  // ─────────────────────────────────────────────────────────────────────────
  if (view === "schools") return (
    <Shell>
      <div style={s.innerHero}>
        <div style={{ ...s.eyebrow, color: "#8dd68d", background: "rgba(92,184,92,.12)", border: "1px solid rgba(92,184,92,.25)" }}>🏫 For Schools</div>
        <h1 style={s.heroTitle}>Give Your Grade 9 Learners<br /><span style={{ color: "#8dd68d" }}>a Guided Subject Choice</span></h1>
        <p style={s.heroSub}>Any school can register for Sthablym. Disadvantaged schools get full access at no cost. Register in 5 minutes, go live within 24 hours.</p>
      </div>

      {/* School options */}
      <div style={s.section}>
        <div style={s.schoolCards}>
          {/* Free card */}
          <div style={{ ...s.schoolCard, borderColor: "#1a7fe0", background: "linear-gradient(135deg,rgba(26,127,224,.08),rgba(26,127,224,.03))" }}>
            <div style={s.freeBadge}>✅ FREE — Disadvantaged Schools</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#7db8f5", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>For Disadvantaged Schools</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: -0.5 }}>Full Platform Access</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 20 }}>
              Schools that can't afford a subscription qualify for full free access. No payment, no credit card, no catch.
            </div>
            {["Unlimited Grade 9 stream quizzes","Live APS calculator for all learners","University and bursary matching","510+ NSC practice questions (Gr 8–12)","Teacher dashboard + invigilation logs","Printable learner APS reports","WhatsApp support included"].map((f) => (
              <div key={f} style={s.schoolFeat}><span style={{ color: "#5cb85c", fontWeight: 800 }}>✓</span>{f}</div>
            ))}
            <a
              href={`mailto:mmathapelosebela@gmail.com?subject=${encodeURIComponent("School Registration — Free Access")}&body=${encodeURIComponent("School name:\nContact person:\nProvince:\nGrade 9 learner count:\nPhone/WhatsApp:")}`}
              style={s.schoolBtn}
            >
              📧 Register via Email →
            </a>
            <a href="https://wa.me/27685438227?text=Hi%20Sthablym!%20We%27d%20like%20to%20register%20our%20school%20for%20free%20access." target="_blank" rel="noreferrer" style={{ ...s.schoolBtn, background: "rgba(37,211,102,.15)", borderColor: "rgba(37,211,102,.3)", color: "#5dd85d", marginTop: 8 }}>
              💬 Register via WhatsApp →
            </a>
          </div>

          {/* Paid card */}
          <div style={{ ...s.schoolCard, borderColor: "rgba(92,184,92,.3)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#8dd68d", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>For All Other Schools</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: -0.5 }}>School Subscription Plans</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 20 }}>
              Schools that can afford to subscribe do so directly. Plans are designed to be affordable for any school.
            </div>
            {[
              "Starter: up to 50 students — R500/month",
              "Standard: up to 200 students — R1,000/month",
              "Pro: up to 500 students — R2,000/month",
              "All plans include full platform access",
              "7-day free pilot available on request",
              "Not sure which option fits your school? Just ask us.",
            ].map((f) => (
              <div key={f} style={s.schoolFeat}><span style={{ color: "#5cb85c", fontWeight: 800 }}>✓</span>{f}</div>
            ))}
            <a
              href="https://wa.me/27685438227?text=Hi%20Sthablym!%20We%27d%20like%20to%20request%20a%207-day%20free%20pilot%20for%20our%20school."
              target="_blank" rel="noreferrer"
              style={{ ...s.schoolBtn, background: "rgba(92,184,92,.15)", borderColor: "rgba(92,184,92,.3)", color: "#8dd68d" }}
            >
              Request a Free 7-Day Pilot →
            </a>
          </div>
        </div>
      </div>

      {/* Already have a code */}
      <div style={s.softSubscribe}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.4)", marginBottom: 12 }}>Already received your school access code?</div>
        <button style={s.softBtn} onClick={() => { setView("subscribe"); setShowCode(true); }}>Enter Your Code →</button>
      </div>
    </Shell>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SUBSCRIBE / CODE ENTRY VIEW
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div style={s.subscribeCard}>
        <button style={s.backBtn} onClick={() => { setView("home"); setError(""); }}>← Back</button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <StablymLogo variant="dark" size="md" />
        </div>

        <h2 style={{ ...s.heroTitle, fontSize: 26, marginBottom: 8 }}>Get Access</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", marginBottom: 28, lineHeight: 1.7 }}>
          Individual learners can subscribe below. Schools receive access codes after registering.
        </p>

        {error && <div style={{ ...s.errorBox, marginBottom: 16 }}>{error}</div>}

        {/* Plans */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          <div style={{ ...s.planRow, borderColor: "rgba(26,127,224,.35)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#7db8f5", marginBottom: 2 }}>Student Plan</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>APS calc · university matcher · bursary finder · 510+ questions</div>
            </div>
            <button style={{ ...s.planChip, background: "rgba(26,127,224,.18)", color: "#7db8f5" }} onClick={() => handleSubscribe("student_basic")}>
              R29/mo →
            </button>
          </div>
          <div style={{ ...s.planRow, borderColor: "rgba(156,107,224,.35)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#c4a2f5", marginBottom: 2 }}>Premium Plan</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>Everything in Student + personalised counselling + gap analysis</div>
            </div>
            <button style={{ ...s.planChip, background: "rgba(156,107,224,.18)", color: "#c4a2f5" }} onClick={() => handleSubscribe("student_premium")}>
              R99/mo →
            </button>
          </div>
          <a
            href="https://wa.me/27685438227?text=Hi%20Sthablym!%20We%27re%20a%20school%20and%20would%20like%20to%20register."
            target="_blank" rel="noreferrer"
            style={{ ...s.planRow, borderColor: "rgba(92,184,92,.3)", textDecoration: "none" }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#8dd68d", marginBottom: 2 }}>🏫 School Plan</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>Disadvantaged schools free · Others from R500/mo</div>
            </div>
            <div style={{ ...s.planChip, background: "rgba(92,184,92,.15)", color: "#8dd68d", display: "inline-flex", alignItems: "center" }}>Contact →</div>
          </a>
        </div>

        {/* Code entry */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 20 }}>
          <button style={s.codeToggle} onClick={() => setShowCode(v => !v)}>
            {showCode ? "Hide code entry ▴" : "Already have an access code? ▾"}
          </button>
          {showCode && (
            <div style={{ marginTop: 14 }}>
              <input
                style={{ ...s.codeInput, borderColor: error ? "#ef4444" : input ? "#1a7fe0" : "rgba(255,255,255,.15)", caretColor: "#fff" }}
                type="text"
                placeholder="e.g. STB-JHB-001"
                value={input}
                onChange={e => { setInput(e.target.value.toUpperCase()); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleCodeSubmit()}
                autoComplete="off"
                autoFocus
                spellCheck="false"
              />
              <button
                style={{ ...s.btnPrimary, width: "100%", marginTop: 10, opacity: codeLoading ? 0.7 : 1 }}
                onClick={handleCodeSubmit}
                disabled={codeLoading}
              >
                {codeLoading ? "Checking…" : "Enter App →"}
              </button>
              {error && <div style={{ ...s.errorBox, marginTop: 10 }}>{error}</div>}
              <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,.25)", textAlign: "center", lineHeight: 1.65 }}>
                Schools receive codes by email and WhatsApp after registering.<br />
                Need help? <a href="https://wa.me/27685438227" style={{ color: "#5dd85d" }}>WhatsApp 068 543 8227</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const INK   = "#0c1220";
const SKY   = "#1a7fe0";
const LIME  = "#5cb85c";

const s = {
  // Layout
  centreWrap:  { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: INK },
  spinner:     { width: 36, height: 36, border: "3px solid rgba(255,255,255,.1)", borderTop: `3px solid ${SKY}`, borderRadius: "50%", animation: "spin .8s linear infinite" },
  wrap:        { minHeight: "100vh", background: INK, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", fontFamily: "'DM Sans','Segoe UI',sans-serif" },
  bgGrid:      { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 0, pointerEvents: "none" },
  bgGlow:      { position: "fixed", inset: 0, background: `radial-gradient(ellipse 70% 50% at 60% 40%,rgba(26,127,224,.14) 0%,transparent 65%)`, zIndex: 0, pointerEvents: "none" },
  // SA flag stripe at bottom of hero — signature element
  flagStripe:  { position: "fixed", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#007A4D 0%,#007A4D 33%,#FFB612 33%,#FFB612 38%,#fff 38%,#fff 41%,#DE3831 41%,#DE3831 58%,#002395 58%,#002395 100%)", zIndex: 999, pointerEvents: "none" },
  pageContent: { flex: 1, overflowY: "auto", padding: "0 20px 80px", maxWidth: 760, width: "100%", margin: "0 auto", position: "relative", zIndex: 2 },

  // Top nav
  topNav:      { position: "sticky", top: 0, zIndex: 50, background: "rgba(12,18,32,.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" },
  navBrand:    { cursor: "pointer" },
  navLinks:    { display: "flex", gap: 4, alignItems: "center" },
  navLink:     { background: "none", border: "none", color: "rgba(255,255,255,.55)", fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", transition: "color .2s" },
  navLinkActive:{ color: "#fff", background: "rgba(255,255,255,.07)" },
  navCta:      { background: SKY, color: "#fff", fontSize: 13, fontWeight: 700, padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" },

  // Hero
  hero:        { paddingTop: 56, paddingBottom: 48, textAlign: "center" },
  innerHero:   { paddingTop: 52, paddingBottom: 36, textAlign: "center" },
  eyebrow:     { display: "inline-block", background: "rgba(26,127,224,.14)", border: "1px solid rgba(26,127,224,.3)", color: "#7db8f5", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 20, letterSpacing: 1, textTransform: "uppercase" },
  heroTitle:   { fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 18px", letterSpacing: -1.2 },
  heroSub:     { fontSize: 15, color: "rgba(255,255,255,.55)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 28px" },
  heroCtas:    { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 36 },
  btnPrimary:  { padding: "13px 26px", background: `linear-gradient(135deg,${SKY},#1368bf)`, color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnGhost:    { padding: "13px 22px", background: "rgba(255,255,255,.07)", border: "1.5px solid rgba(255,255,255,.18)", color: "#fff", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },

  // Proof strip
  proofStrip:  { display: "inline-flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 24px", flexWrap: "wrap", justifyContent: "center" },
  proofDiv:    { width: 1, height: 28, background: "rgba(255,255,255,.08)" },
  proofItem:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  proofNum:    { fontSize: 20, fontWeight: 800, color: "#7db8f5" },
  proofLabel:  { fontSize: 11, color: "rgba(255,255,255,.35)", fontWeight: 500 },

  // Sections
  section:     { padding: "44px 0" },
  sectionEyebrow:{ fontSize: 11, fontWeight: 700, color: SKY, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", marginBottom: 8 },
  sectionTitle:{ fontSize: 26, fontWeight: 800, color: "#fff", textAlign: "center", margin: "0 0 10px", letterSpacing: -.5 },
  sectionSub:  { fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 32px" },

  // Stats
  statsGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 },
  statCard:    { borderRadius: 14, padding: "20px 16px", textAlign: "center", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" },
  statBigNum:  { fontFamily: "inherit", fontSize: 32, fontWeight: 800, color: "#7db8f5", lineHeight: 1, marginBottom: 8 },
  statCardLabel:{ fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.55 },

  // Steps
  stepsGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 },
  stepCard:    { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "22px 16px", textAlign: "center" },
  stepNum:     { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", fontSize: 18, fontWeight: 800, margin: "0 auto 12px" },
  stepTitle:   { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 },
  stepDesc:    { fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.65 },

  // Features
  featGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 },
  featCard:    { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "20px 16px" },
  featTitle:   { fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 },
  featDesc:    { fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.65 },

  // CTA row
  ctaRow:      { display: "flex", gap: 28, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "32px 28px", flexWrap: "wrap", marginBottom: 8 },
  ctaDivider:  { width: 1, background: "rgba(255,255,255,.08)", alignSelf: "stretch", flexShrink: 0 },

  // Soft subscribe
  softSubscribe:{ textAlign: "center", padding: "36px 0 8px" },
  softBtn:     { padding: "11px 20px", background: "rgba(26,127,224,.15)", border: "1px solid rgba(26,127,224,.3)", color: "#7db8f5", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", textDecoration: "none", display: "inline-block" },

  // School cards
  schoolCards: { display: "flex", flexDirection: "column", gap: 16 },
  schoolCard:  { border: "1.5px solid", borderRadius: 18, padding: "28px 24px", background: "rgba(255,255,255,.03)" },
  freeBadge:   { display: "inline-block", background: `rgba(26,127,224,.15)`, border: `1px solid rgba(26,127,224,.3)`, color: "#7db8f5", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 99, marginBottom: 14, letterSpacing: .5 },
  schoolFeat:  { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 7, lineHeight: 1.5 },
  schoolBtn:   { display: "block", marginTop: 20, padding: "13px 20px", background: `rgba(26,127,224,.18)`, border: `1px solid rgba(26,127,224,.35)`, color: "#7db8f5", borderRadius: 11, fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", fontFamily: "inherit", cursor: "pointer" },

  // Subscribe card
  subscribeCard:{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: "36px 32px 40px", maxWidth: 480, margin: "40px auto 0", backdropFilter: "blur(12px)", position: "relative", zIndex: 2 },
  backBtn:     { background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 12, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "inherit" },
  planRow:     { background: "rgba(255,255,255,.04)", border: "1px solid", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, textDecoration: "none" },
  planChip:    { padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 800, border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" },
  codeToggle:  { display: "block", width: "100%", background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 12, cursor: "pointer", textAlign: "center", fontFamily: "inherit", padding: 0 },
  codeInput:   { width: "100%", padding: "13px 16px", background: "rgba(255,255,255,.06)", border: "2px solid rgba(255,255,255,.15)", borderRadius: 11, fontSize: 16, fontWeight: 700, color: "#fff", outline: "none", textAlign: "center", letterSpacing: 2, fontFamily: "'DM Mono','Courier New',monospace", transition: "border-color .2s", boxSizing: "border-box" },
  errorBox:    { background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.28)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fca5a5", lineHeight: 1.6 },

  // Access banner (when logged in)
  accessBanner:{ background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", position: "sticky", top: 0, zIndex: 100 },
  bannerLeft:  { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 },
  bannerDot:   { width: 7, height: 7, borderRadius: "50%", background: LIME, boxShadow: `0 0 6px ${LIME}` },
  logoutBtn:   { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.45)", fontSize: 12, padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" },
};

// Inject spin keyframe
const _styleTag = document.createElement("style");
_styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(_styleTag);
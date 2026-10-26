// src/components/AccessGate.js
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import StablymLogo from "./StablymLogoComponent";
import { trackActivity } from "./trackActivity";
import { registerAccount, loginAccount } from "./accountApi";
import EnhancedResults from "./EnhancedResults";

const STORAGE_KEY   = "sthablym_user";       // profile, kept after sign out
const SIGNED_IN_KEY = "sthablym_signed_in";  // "1" while signed in
const KNOWN_IDS_KEY = "sthablym_known_ids";  // ids already registered / logged in on this device
const RESUMED_KEY   = "sthablym_resumed";    // sessionStorage: log resume once per tab session
const OLD_KEYS      = ["stablym_access"];    // from the paid/code version — cleared on load

const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo",
  "Mpumalanga", "North West", "Free State", "Northern Cape",
];

const USER_TYPES = {
  learner:    "Learner (through my school)",
  teacher:    "Teacher",
  gapyear:    "Gap year (finished matric)",
  individual: "Individual (not through a school)",
};

const WHATSAPP_RESET =
  "https://wa.me/27685438227?text=Hi%20Sthablym!%20I%20forgot%20my%20PIN.%20Please%20help%20me%20reset%20it.";

// ─── ID + FORM HELPERS ───────────────────────────────────────────────────────
// small, fast, synchronous string hash
const hashStr = (str) => {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

// same person (name + school + province) => same id, always
const makeUserId = (firstName, school, province) =>
  "u-" +
  hashStr(
    [firstName, school, province]
      .map((v) => String(v).trim().toLowerCase().replace(/\s+/g, " "))
      .join("|")
  );

// learners and individuals pick a grade; teachers and gap year learners don't
const needsGradeFor = (userType) => userType === "learner" || userType === "individual";

// only learners and teachers belong to a school
const isSchoolType = (userType) => userType === "learner" || userType === "teacher";

const readJSON = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v === null || v === undefined ? fallback : v;
  } catch (_) {
    return fallback;
  }
};

const isValidPin = (pin) => /^\d{4}$/.test(pin);
const digitsOnly = (v) => v.replace(/\D/g, "").slice(0, 4);

const loginErrorText = (r) => {
  switch (r.error) {
    case "not_found": return "We couldn't find an account with those details. Check the spelling of your name and school (use exactly what you registered with), or create a new account.";
    case "wrong_pin": return `That PIN is not right. ${r.attemptsLeft} ${r.attemptsLeft === 1 ? "try" : "tries"} left.`;
    case "locked":    return `Too many wrong PINs. Please try again in ${r.minutes} minute${r.minutes === 1 ? "" : "s"}.`;
    case "network":   return "We couldn't reach the server. Check your internet connection and try again.";
    default:          return "Something went wrong. Please try again.";
  }
};

// ─── CONTENT DATA ─────────────────────────────────────────────────────────────
const STATS = [
  { num: "67%",  label: "of Grade 12 learners wish they chose different subjects" },
  { num: "3×",   label: "better university placement with early stream guidance"  },
  { num: "55+",  label: "university programmes mapped across SA"                  },
  { num: "Free", label: "for every school and every learner"                      },
];

const HOW_STEPS = [
  { num: "1", color: "#1a7fe0", bg: "rgba(26,127,224,.12)", title: "Register Free",       desc: "Learners, teachers and individuals sign up in under a minute. No payment, no code." },
  { num: "2", color: "#5cb85c", bg: "rgba(92,184,92,.12)",  title: "Open in Any Browser", desc: "No app download. Works on any phone, tablet or computer." },
  { num: "3", color: "#e8930a", bg: "rgba(232,147,10,.12)", title: "Stream Quiz + APS",   desc: "5-minute quiz + marks entry gives each learner a personalised stream recommendation." },
  { num: "4", color: "#9333ea", bg: "rgba(147,51,234,.12)", title: "Guided Decision",     desc: "Printable report shows stream, APS, university eligibility — before the choice is made." },
];

const FEATURES = [
  { icon: "🔬", title: "Stream Selector Quiz",   desc: "Grade 9 learners discover their ideal stream in 5 minutes — Science, Commerce, Humanities, or Engineering." },
  { icon: "📊", title: "Live APS Calculator",    desc: "Enter marks, get APS instantly. Best 6 subjects, LO excluded — exactly per DBE rules." },
  { icon: "🎓", title: "University Matcher",     desc: "55+ programmes across UCT, Wits, UP, UKZN and more. See what the learner qualifies for right now." },
  { icon: "💰", title: "Bursary Finder",         desc: "NSFAS, Sasol, Anglo American and sector bursaries matched to the learner's stream and APS score." },
  { icon: "📝", title: "NSC Practice Questions", desc: "510+ past paper-style questions across 15 subjects for Grades 8–12. Timed, with explanations." },
  { icon: "🖨️", title: "Teacher Dashboard",      desc: "See every learner's APS and stream in one place. Print reports for parent evenings." },
];

// ─── WELCOME BACK (shown when a profile is remembered on this device) ────────
function WelcomeBack({ savedUser, onContinue, onForget }) {
  if (!savedUser) return null;
  return (
    <div style={s.welcomeBox}>
      <button style={s.btnPrimary} onClick={onContinue}>
        Continue as {savedUser.firstName} →
      </button>
      <div style={{ marginTop: 8 }}>
        <button style={s.backBtn} onClick={onForget}>
          Not you? Use a different account
        </button>
      </div>
    </div>
  );
}

// ─── SHELL (top-level so inputs keep focus while typing) ─────────────────────
function Shell({ view, setView, children }) {
  return (
    <div style={s.wrap}>
      <div style={s.bgGrid} />
      <div style={s.bgGlow} />
      <div style={s.flagStripe} />
      <div style={s.topNav}>
        <div style={s.navBrand} onClick={() => setView("home")}>
          <StablymLogo variant="dark" size="sm" />
        </div>
        <div style={s.navLinks}>
          <button
            style={{ ...s.navLink, ...(view === "schools" ? s.navLinkActive : {}) }}
            onClick={() => setView("schools")}
          >
            Schools
          </button>
          <button
            style={{ ...s.navLink, ...(view === "login" ? s.navLinkActive : {}) }}
            onClick={() => setView("login")}
          >
            Log in
          </button>
          <button style={s.navCta} onClick={() => setView("register")}>Get Started →</button>
        </div>
      </div>
      <div style={s.pageContent}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AccessGate({ children }) {
  const [access,    setAccess]    = useState(null);   // null = loading, false = gate, object = signed in
  const [savedUser, setSavedUser] = useState(null);   // remembered profile on this device
  const [view,      setViewRaw]   = useState("home"); // "home" | "schools" | "register" | "login"
  const [error,     setError]     = useState("");
  const [notice,    setNotice]    = useState("");
  const [busy,      setBusy]      = useState(false);
  const [form,      setForm]      = useState({
    userType: "learner",
    firstName: "",
    school: "",
    province: "",
    grade: "",
    pin: "",
    pin2: "",
    consent: false,
  });

  // "Add a PIN" popup (for people who registered before PINs existed)
  const [pinModal, setPinModal] = useState(false);
  const [pinForm,  setPinForm]  = useState({ pin: "", pin2: "" });
  const [pinError, setPinError] = useState("");

  const setView = (v) => {
    setViewRaw(v);
    setError("");
    setNotice("");
  };

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setError("");
  };

  // ── Restore session ──────────────────────────────────────────────────────
  useEffect(() => {
    try { OLD_KEYS.forEach((k) => localStorage.removeItem(k)); } catch (_) {}

    const saved = readJSON(STORAGE_KEY, null);
    if (saved && saved.userId) {
      setSavedUser(saved);

      let signedIn = false;
      try { signedIn = localStorage.getItem(SIGNED_IN_KEY) === "1"; } catch (_) {}

      if (signedIn) {
        setAccess(saved);
        // log "resumed" once per tab session, not on every reload / StrictMode double-run
        try {
          if (!sessionStorage.getItem(RESUMED_KEY)) {
            sessionStorage.setItem(RESUMED_KEY, "1");
            trackActivity("session_resumed", saved);
          }
        } catch (_) {}
        return;
      }
    }
    setAccess(false);
  }, []);

  // ── Save the user on this device and sign in ─────────────────────────────
  function finishSignIn(user, event) {
    const known = readJSON(KNOWN_IDS_KEY, []);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(SIGNED_IN_KEY, "1");
      if (!known.includes(user.userId)) {
        localStorage.setItem(KNOWN_IDS_KEY, JSON.stringify([...known, user.userId]));
      }
    } catch (_) {}
    setSavedUser(user);
    setAccess(user);
    setForm((f) => ({ ...f, pin: "", pin2: "" }));
    trackActivity(event, user);
  }

  // ── Register (first time only) ───────────────────────────────────────────
  async function handleRegister() {
    const schoolUser = isSchoolType(form.userType);

    if (!form.firstName.trim())                         return setError("Please enter your first name.");
    if (schoolUser && !form.school.trim())              return setError("Please enter your school name.");
    if (!form.province)                                 return setError("Please select your province.");
    if (needsGradeFor(form.userType) && !form.grade)    return setError("Please select your grade.");
    if (!isValidPin(form.pin))                          return setError("Please choose a 4-digit PIN (numbers only).");
    if (form.pin !== form.pin2)                         return setError("The two PINs don't match.");
    if (!form.consent)                                  return setError("Please tick the box to agree before continuing.");

    const school = schoolUser ? form.school.trim() : "Individual";
    const userId = makeUserId(form.firstName, school, form.province);

    const user = {
      userId,
      userType:     form.userType,
      firstName:    form.firstName.trim(),
      school,
      province:     form.province,
      grade:        form.userType === "teacher" ? "" : form.userType === "gapyear" ? "Gap year" : form.grade,
      registeredAt: new Date().toISOString(),
    };

    setBusy(true);
    setError("");
    const { userId: _omit, ...profile } = user; // the id is stored separately
    const result = await registerAccount(userId, profile, form.pin);
    setBusy(false);

    // Someone with these exact details already has an account → send them to log in
    if (result.error === "exists") {
      setViewRaw("login");
      setNotice("An account with these details already exists. Enter your PIN to log in.");
      setForm((f) => ({ ...f, pin: "", pin2: "" }));
      return;
    }

    // ok            → account saved online, PIN works on any device
    // network/other → let them in anyway; the "Add PIN" button appears so they can retry later
    finishSignIn({ ...user, hasPin: !!result.ok }, "registration");
  }

  // ── Log in (any device) ──────────────────────────────────────────────────
  async function handleLogin() {
    const schoolUser = isSchoolType(form.userType);

    if (!form.firstName.trim())            return setError("Please enter your first name.");
    if (schoolUser && !form.school.trim()) return setError("Please enter your school name.");
    if (!form.province)                    return setError("Please select your province.");
    if (!isValidPin(form.pin))             return setError("Please enter your 4-digit PIN.");

    const school = schoolUser ? form.school.trim() : "Individual";
    const userId = makeUserId(form.firstName, school, form.province);

    setBusy(true);
    setError("");
    const result = await loginAccount(userId, form.pin);
    setBusy(false);

    if (!result.ok) return setError(loginErrorText(result));

    finishSignIn({ ...result.profile, userId, hasPin: true }, "sign_in");
  }

  // ── Continue as the remembered user (no PIN needed on their own device) ──
  function continueAsSaved() {
    if (!savedUser) return;
    try { localStorage.setItem(SIGNED_IN_KEY, "1"); } catch (_) {}
    setAccess(savedUser);
    trackActivity("sign_in", savedUser);
  }

  // ── Sign out: ends the session but keeps the profile on this device ──────
  const handleLogout = () => {
    trackActivity("sign_out", access);
    try {
      localStorage.removeItem(SIGNED_IN_KEY);
      sessionStorage.removeItem(RESUMED_KEY);
    } catch (_) {}
    setAccess(false);
    setView("home");
  };

  // ── "Not you?" — someone else is using this device ───────────────────────
  const forgetDevice = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SIGNED_IN_KEY);
    } catch (_) {}
    setSavedUser(null);
  };

  // ── Add a PIN to an existing local-only account ──────────────────────────
  async function handleAddPin() {
    if (!isValidPin(pinForm.pin))     return setPinError("Please choose a 4-digit PIN (numbers only).");
    if (pinForm.pin !== pinForm.pin2) return setPinError("The two PINs don't match.");

    setBusy(true);
    setPinError("");
    const { userId, hasPin: _h, ...profile } = access;
    const result = await registerAccount(userId, profile, pinForm.pin);
    setBusy(false);

    if (result.error === "exists") {
      return setPinError("An account with your details already exists online. Sign out, then choose Log in and use that PIN.");
    }
    if (!result.ok) return setPinError(loginErrorText(result));

    const updated = { ...access, hasPin: true };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch (_) {}
    setAccess(updated);
    setSavedUser(updated);
    setPinModal(false);
    setPinForm({ pin: "", pin2: "" });
    trackActivity("pin_added", updated);
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (access === null) {
    return (
      <div style={s.centreWrap}>
        <div style={s.spinner} />
      </div>
    );
  }

  // ── Signed in: show the app ──────────────────────────────────────────────
  if (access) {
    const label =
      access.userType === "teacher"      ? `👩‍🏫 ${access.firstName} · ${access.school}`
      : access.userType === "gapyear"    ? `🌍 ${access.firstName} · Gap year`
      : access.userType === "individual" ? `⭐ ${access.firstName} · Individual`
      :                                    `🎓 ${access.firstName} · ${access.school}`;
    return (
      <>
        <div style={s.accessBanner}>
          <span style={s.bannerLeft}>
            <span style={s.bannerDot} />
            {label}{access.province ? ` · ${access.province}` : ""}
          </span>
          <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {!access.hasPin && (
              <button style={s.pinBtn} onClick={() => { setPinError(""); setPinModal(true); }}>
                🔒 Add PIN
              </button>
            )}
            <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
          </span>
        </div>

        {/* Gap year learners skip the grade picker, profile/marks page and quiz */}
        {access.userType === "gapyear" ? (
          <EnhancedResults
            student={{
              name:     access.firstName,
              surname:  "",
              school:   access.school,
              province: access.province,
              grade:    "Gap year",
              userType: "gapyear",
              userId:   access.userId,
              marks:    {},
            }}
          />
        ) : (
          children
        )}

        {pinModal && (
          <div style={s.modalBackdrop}>
            <div style={s.modal}>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#fff" }}>Add a PIN to your account</h3>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "rgba(255,255,255,.55)", lineHeight: 1.65 }}>
                With a PIN you can log in on any phone or computer and find your account. Choose 4 numbers you will remember.
              </p>

              <label style={s.fieldLabel} htmlFor="addpin-1">Choose a 4-digit PIN</label>
              <input
                id="addpin-1"
                style={s.field}
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                maxLength={4}
                value={pinForm.pin}
                onChange={(e) => { setPinForm((f) => ({ ...f, pin: digitsOnly(e.target.value) })); setPinError(""); }}
              />

              <label style={s.fieldLabel} htmlFor="addpin-2">Confirm PIN</label>
              <input
                id="addpin-2"
                style={s.field}
                type="password"
                inputMode="numeric"
                autoComplete="new-password"
                maxLength={4}
                value={pinForm.pin2}
                onChange={(e) => { setPinForm((f) => ({ ...f, pin2: digitsOnly(e.target.value) })); setPinError(""); }}
              />

              {pinError && <div style={{ ...s.errorBox, marginTop: 14 }}>{pinError}</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button style={{ ...s.btnPrimary, flex: 1, opacity: busy ? 0.7 : 1 }} disabled={busy} onClick={handleAddPin}>
                  {busy ? "Please wait…" : "Save PIN"}
                </button>
                <button style={{ ...s.btnGhost, padding: "13px 18px" }} onClick={() => setPinModal(false)}>
                  Later
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GATE VIEWS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── HOME ─────────────────────────────────────────────────────────────────
  if (view === "home") {
    return (
      <Shell view={view} setView={setView}>
        <div style={s.hero}>
          <WelcomeBack savedUser={savedUser} onContinue={continueAsSaved} onForget={forgetDevice} />

          <div style={s.eyebrow}>🇿🇦 Built for South African Schools</div>
          <h1 style={s.heroTitle}>
            Helping Grade 9 Learners<br />
            Choose the <span style={{ color: "#7db8f5" }}>Right Path</span>
          </h1>
          <p style={s.heroSub}>
            Every year, thousands of Grade 9 learners across South Africa choose the wrong subjects
            and only discover the consequences in Grade 12. Sthablym gives every learner the tools
            to change that.{" "}
            <strong style={{ color: "rgba(255,255,255,.85)" }}>
              Completely free — for every school and every learner.
            </strong>
          </p>
          <div style={s.heroCtas}>
            <button style={s.btnPrimary} onClick={() => setView("register")}>
              Start Free →
            </button>
            <button style={s.btnGhost} onClick={() => setView("schools")}>
              🏫 For Schools
            </button>
          </div>
          <div style={{ marginBottom: 28, fontSize: 13, color: "rgba(255,255,255,.5)" }}>
            Already have an account?{" "}
            <button style={s.linkBtn} onClick={() => setView("login")}>Log in</button>
          </div>
          <div style={s.proofStrip}>
            {[
              ["9", "Provinces"],
              ["55+", "Uni Programmes"],
              ["510+", "Questions"],
              ["100%", "Free"],
            ].map(([num, label], i) => (
              <React.Fragment key={label}>
                {i > 0 && <div style={s.proofDiv} />}
                <div style={s.proofItem}>
                  <span style={s.proofNum}>{num}</span>
                  <span style={s.proofLabel}>{label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

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

        <div style={s.ctaRow}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>
              Ready to find the right stream?
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.65, marginBottom: 16 }}>
              Free for every learner and every school. Register once and log in from any device.
            </div>
            <button style={s.btnPrimary} onClick={() => setView("register")}>Start Free →</button>
          </div>
        </div>
      </Shell>
    );
  }

  // ── SCHOOLS ──────────────────────────────────────────────────────────────
  if (view === "schools") {
    return (
      <Shell view={view} setView={setView}>
        <div style={s.innerHero}>
          <div style={{ ...s.eyebrow, color: "#8dd68d", background: "rgba(92,184,92,.12)", border: "1px solid rgba(92,184,92,.25)" }}>
            🏫 For Schools
          </div>
          <h1 style={s.heroTitle}>
            Give Your Grade 9 Learners<br />
            <span style={{ color: "#8dd68d" }}>a Guided Subject Choice</span>
          </h1>
          <p style={s.heroSub}>
            Sthablym is free for every school. Teachers and learners each register with the school's
            name and province, so you can see how your school is using it.
          </p>
        </div>

        <div style={s.section}>
          <div style={{ ...s.schoolCard, borderColor: "#1a7fe0", background: "linear-gradient(135deg,rgba(26,127,224,.08),rgba(26,127,224,.03))" }}>
            <div style={s.freeBadge}>✅ FREE — All Schools</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10, letterSpacing: -0.5 }}>
              Full Platform Access
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 20 }}>
              No payment, no credit card, no access codes. Share the link with your learners and
              ask each one to register using the exact same school name.
            </div>
            {[
              "Unlimited Grade 9 stream quizzes",
              "Live APS calculator for all learners",
              "University and bursary matching",
              "510+ NSC practice questions (Gr 8–12)",
              "Teacher dashboard + invigilation logs",
              "Printable learner APS reports",
              "WhatsApp support included",
            ].map((f) => (
              <div key={f} style={s.schoolFeat}>
                <span style={{ color: "#5cb85c", fontWeight: 800 }}>✓</span>{f}
              </div>
            ))}
            <button style={{ ...s.schoolBtn, width: "100%", border: "1px solid rgba(26,127,224,.35)" }} onClick={() => setView("register")}>
              Register as a Teacher or Learner →
            </button>
            <a
              href="https://wa.me/27685438227?text=Hi%20Sthablym!%20Our%20school%20would%20like%20help%20getting%20started."
              target="_blank"
              rel="noreferrer"
              style={{ ...s.schoolBtn, background: "rgba(37,211,102,.15)", borderColor: "rgba(37,211,102,.3)", color: "#5dd85d", marginTop: 8 }}
            >
              💬 Need help? WhatsApp us →
            </a>
          </div>
        </div>
      </Shell>
    );
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────
  if (view === "login") {
    const schoolUser = isSchoolType(form.userType);

    return (
      <Shell view={view} setView={setView}>
        <div style={s.subscribeCard}>
          <button style={s.backBtn} onClick={() => setView("home")}>← Back</button>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <StablymLogo variant="dark" size="md" />
          </div>

          <WelcomeBack savedUser={savedUser} onContinue={continueAsSaved} onForget={forgetDevice} />

          <h2 style={{ ...s.heroTitle, fontSize: 26, marginBottom: 8 }}>Log in</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", marginBottom: 12, lineHeight: 1.7 }}>
            Use the same details you registered with, on any phone or computer.
          </p>

          {notice && <div style={s.noticeBox}>{notice}</div>}

          <label style={s.fieldLabel} htmlFor="log-type">I am a</label>
          <select id="log-type" style={s.field} value={form.userType} onChange={(e) => setField("userType", e.target.value)}>
            {Object.entries(USER_TYPES).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <label style={s.fieldLabel} htmlFor="log-name">First name</label>
          <input
            id="log-name"
            style={s.field}
            type="text"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
          />

          {schoolUser && (
            <>
              <label style={s.fieldLabel} htmlFor="log-school">School name</label>
              <input
                id="log-school"
                style={s.field}
                type="text"
                placeholder="Exactly as you registered it"
                value={form.school}
                onChange={(e) => setField("school", e.target.value)}
              />
            </>
          )}

          <label style={s.fieldLabel} htmlFor="log-province">Province</label>
          <select id="log-province" style={s.field} value={form.province} onChange={(e) => setField("province", e.target.value)}>
            <option value="">Select your province…</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          <label style={s.fieldLabel} htmlFor="log-pin">4-digit PIN</label>
          <input
            id="log-pin"
            style={s.field}
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            maxLength={4}
            value={form.pin}
            onChange={(e) => setField("pin", digitsOnly(e.target.value))}
            onKeyDown={(e) => { if (e.key === "Enter" && !busy) handleLogin(); }}
          />

          {error && <div style={{ ...s.errorBox, marginTop: 14 }}>{error}</div>}

          <button
            style={{ ...s.btnPrimary, width: "100%", marginTop: 16, opacity: busy ? 0.7 : 1 }}
            disabled={busy}
            onClick={handleLogin}
          >
            {busy ? "Please wait…" : "Log in →"}
          </button>

          <div style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,.5)", textAlign: "center", lineHeight: 1.8 }}>
            New here?{" "}
            <button style={s.linkBtn} onClick={() => setView("register")}>Create a free account</button>
            <br />
            Forgot your PIN?{" "}
            <a href={WHATSAPP_RESET} target="_blank" rel="noreferrer" style={{ color: "#5dd85d" }}>WhatsApp us to reset it</a>
          </div>
        </div>
      </Shell>
    );
  }

  // ── REGISTER ─────────────────────────────────────────────────────────────
  const schoolUser = isSchoolType(form.userType);
  const needsGrade = needsGradeFor(form.userType);

  return (
    <Shell view={view} setView={setView}>
      <div style={s.subscribeCard}>
        <button style={s.backBtn} onClick={() => setView("home")}>← Back</button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <StablymLogo variant="dark" size="md" />
        </div>

        <WelcomeBack savedUser={savedUser} onContinue={continueAsSaved} onForget={forgetDevice} />

        <h2 style={{ ...s.heroTitle, fontSize: 26, marginBottom: 8 }}>Get Started — Free</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", marginBottom: 12, lineHeight: 1.7 }}>
          Register once, then log in from any phone or computer with your PIN.
        </p>

        {notice && <div style={s.noticeBox}>{notice}</div>}

        <label style={s.fieldLabel} htmlFor="reg-type">I am a</label>
        <select id="reg-type" style={s.field} value={form.userType} onChange={(e) => setField("userType", e.target.value)}>
          {Object.entries(USER_TYPES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <label style={s.fieldLabel} htmlFor="reg-name">First name</label>
        <input
          id="reg-name"
          style={s.field}
          type="text"
          autoComplete="given-name"
          value={form.firstName}
          onChange={(e) => setField("firstName", e.target.value)}
        />

        {schoolUser && (
          <>
            <label style={s.fieldLabel} htmlFor="reg-school">School name</label>
            <input
              id="reg-school"
              style={s.field}
              type="text"
              placeholder="e.g. Soweto High School"
              value={form.school}
              onChange={(e) => setField("school", e.target.value)}
            />
          </>
        )}

        <label style={s.fieldLabel} htmlFor="reg-province">Province</label>
        <select id="reg-province" style={s.field} value={form.province} onChange={(e) => setField("province", e.target.value)}>
          <option value="">Select your province…</option>
          {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {needsGrade && (
          <>
            <label style={s.fieldLabel} htmlFor="reg-grade">Grade</label>
            <select id="reg-grade" style={s.field} value={form.grade} onChange={(e) => setField("grade", e.target.value)}>
              <option value="">Select your grade…</option>
              {[8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
            </select>
          </>
        )}

        <label style={s.fieldLabel} htmlFor="reg-pin">Choose a 4-digit PIN</label>
        <input
          id="reg-pin"
          style={s.field}
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={4}
          placeholder="4 numbers you will remember"
          value={form.pin}
          onChange={(e) => setField("pin", digitsOnly(e.target.value))}
        />

        <label style={s.fieldLabel} htmlFor="reg-pin2">Confirm PIN</label>
        <input
          id="reg-pin2"
          style={s.field}
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          maxLength={4}
          value={form.pin2}
          onChange={(e) => setField("pin2", digitsOnly(e.target.value))}
        />

        <label style={s.consentRow}>
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => setField("consent", e.target.checked)}
            style={{ marginTop: 3, flexShrink: 0 }}
          />
          <span>
            I agree that Sthablym may record my first name, school, province, grade and how I use the app,
            and keep my account (with a protected PIN) so I can log in again on any device.
            If I am under 18, a parent, guardian or teacher knows I am registering.
          </span>
        </label>

        {error && <div style={{ ...s.errorBox, marginTop: 14 }}>{error}</div>}

        <button
          style={{ ...s.btnPrimary, width: "100%", marginTop: 16, opacity: busy ? 0.7 : 1 }}
          disabled={busy}
          onClick={handleRegister}
        >
          {busy ? "Please wait…" : "Enter the App →"}
        </button>

        <div style={{ marginTop: 14, fontSize: 13, color: "rgba(255,255,255,.5)", textAlign: "center", lineHeight: 1.8 }}>
          Already registered?{" "}
          <button style={s.linkBtn} onClick={() => setView("login")}>Log in</button>
        </div>

        <div style={{ marginTop: 6, fontSize: 12, color: "rgba(255,255,255,.3)", textAlign: "center", lineHeight: 1.65 }}>
          Need help? <a href="https://wa.me/27685438227" target="_blank" rel="noreferrer" style={{ color: "#5dd85d" }}>WhatsApp 068 543 8227</a>
        </div>
      </div>
    </Shell>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const INK  = "#0c1220";
const SKY  = "#1a7fe0";
const LIME = "#5cb85c";

const s = {
  // Layout
  centreWrap:  { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: INK },
  spinner:     { width: 36, height: 36, border: "3px solid rgba(255,255,255,.1)", borderTop: `3px solid ${SKY}`, borderRadius: "50%", animation: "spin .8s linear infinite" },
  wrap:        { minHeight: "100vh", background: INK, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", fontFamily: "'DM Sans','Segoe UI',sans-serif" },
  bgGrid:      { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "60px 60px", zIndex: 0, pointerEvents: "none" },
  bgGlow:      { position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 50% at 60% 40%,rgba(26,127,224,.14) 0%,transparent 65%)", zIndex: 0, pointerEvents: "none" },
  flagStripe:  { position: "fixed", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg,#007A4D 0%,#007A4D 33%,#FFB612 33%,#FFB612 38%,#fff 38%,#fff 41%,#DE3831 41%,#DE3831 58%,#002395 58%,#002395 100%)", zIndex: 999, pointerEvents: "none" },
  pageContent: { flex: 1, overflowY: "auto", padding: "0 20px 80px", maxWidth: 760, width: "100%", margin: "0 auto", position: "relative", zIndex: 2, boxSizing: "border-box" },

  // Top nav
  topNav:       { position: "sticky", top: 0, zIndex: 50, background: "rgba(12,18,32,.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" },
  navBrand:     { cursor: "pointer" },
  navLinks:     { display: "flex", gap: 4, alignItems: "center" },
  navLink:      { background: "none", border: "none", color: "rgba(255,255,255,.55)", fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" },
  navLinkActive:{ color: "#fff", background: "rgba(255,255,255,.07)" },
  navCta:       { background: SKY, color: "#fff", fontSize: 13, fontWeight: 700, padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "inherit" },

  // Hero
  hero:        { paddingTop: 56, paddingBottom: 48, textAlign: "center" },
  innerHero:   { paddingTop: 52, paddingBottom: 36, textAlign: "center" },
  eyebrow:     { display: "inline-block", background: "rgba(26,127,224,.14)", border: "1px solid rgba(26,127,224,.3)", color: "#7db8f5", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 20, letterSpacing: 1, textTransform: "uppercase" },
  heroTitle:   { fontSize: 38, fontWeight: 800, color: "#fff", lineHeight: 1.1, margin: "0 0 18px", letterSpacing: -1.2, textAlign: "center" },
  heroSub:     { fontSize: 15, color: "rgba(255,255,255,.55)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 28px" },
  heroCtas:    { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 },
  btnPrimary:  { padding: "13px 26px", background: `linear-gradient(135deg,${SKY},#1368bf)`, color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  btnGhost:    { padding: "13px 22px", background: "rgba(255,255,255,.07)", border: "1.5px solid rgba(255,255,255,.18)", color: "#fff", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },
  linkBtn:     { background: "none", border: "none", color: "#7db8f5", fontSize: "inherit", fontWeight: 700, cursor: "pointer", padding: 0, fontFamily: "inherit", textDecoration: "underline" },

  // Welcome back
  welcomeBox:  { marginBottom: 24, textAlign: "center" },

  // Proof strip
  proofStrip:  { display: "inline-flex", alignItems: "center", gap: 20, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "14px 24px", flexWrap: "wrap", justifyContent: "center" },
  proofDiv:    { width: 1, height: 28, background: "rgba(255,255,255,.08)" },
  proofItem:   { display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  proofNum:    { fontSize: 20, fontWeight: 800, color: "#7db8f5" },
  proofLabel:  { fontSize: 11, color: "rgba(255,255,255,.35)", fontWeight: 500 },

  // Sections
  section:        { padding: "44px 0" },
  sectionEyebrow: { fontSize: 11, fontWeight: 700, color: SKY, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", marginBottom: 8 },
  sectionTitle:   { fontSize: 26, fontWeight: 800, color: "#fff", textAlign: "center", margin: "0 0 10px", letterSpacing: -0.5 },
  sectionSub:     { fontSize: 14, color: "rgba(255,255,255,.45)", textAlign: "center", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 32px" },

  // Stats
  statsGrid:     { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 },
  statCard:      { borderRadius: 14, padding: "20px 16px", textAlign: "center", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" },
  statBigNum:    { fontSize: 32, fontWeight: 800, color: "#7db8f5", lineHeight: 1, marginBottom: 8 },
  statCardLabel: { fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.55 },

  // Steps
  stepsGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14 },
  stepCard:    { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "22px 16px", textAlign: "center" },
  stepNum:     { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, margin: "0 auto 12px" },
  stepTitle:   { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 },
  stepDesc:    { fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.65 },

  // Features
  featGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 },
  featCard:    { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "20px 16px" },
  featTitle:   { fontSize: 13, fontWeight: 700, color: "#fff", marginBottom: 6 },
  featDesc:    { fontSize: 12, color: "rgba(255,255,255,.45)", lineHeight: 1.65 },

  // CTA row
  ctaRow:      { display: "flex", gap: 28, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: "32px 28px", flexWrap: "wrap", marginBottom: 8 },

  // School card
  schoolCard:  { border: "1.5px solid", borderRadius: 18, padding: "28px 24px", background: "rgba(255,255,255,.03)" },
  freeBadge:   { display: "inline-block", background: "rgba(26,127,224,.15)", border: "1px solid rgba(26,127,224,.3)", color: "#7db8f5", fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 99, marginBottom: 14, letterSpacing: 0.5 },
  schoolFeat:  { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,.65)", marginBottom: 7, lineHeight: 1.5 },
  schoolBtn:   { display: "block", marginTop: 20, padding: "13px 20px", background: "rgba(26,127,224,.18)", border: "1px solid rgba(26,127,224,.35)", color: "#7db8f5", borderRadius: 11, fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", fontFamily: "inherit", cursor: "pointer", boxSizing: "border-box" },

  // Register / login card
  subscribeCard: { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: "36px 32px 40px", maxWidth: 480, margin: "40px auto 0", backdropFilter: "blur(12px)", position: "relative", zIndex: 2 },
  backBtn:       { background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 12, cursor: "pointer", padding: 0, marginBottom: 20, fontFamily: "inherit" },
  fieldLabel:    { display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: 1, margin: "16px 0 6px" },
  field:         { width: "100%", padding: "12px 14px", background: "#1e293b", border: "2px solid rgba(255,255,255,.15)", borderRadius: 10, color: "#fff", fontSize: 15, fontFamily: "inherit", outline: "none", boxSizing: "border-box", caretColor: "#fff" },
  consentRow:    { display: "flex", gap: 10, alignItems: "flex-start", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.6, cursor: "pointer" },
  errorBox:      { background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.28)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#fca5a5", lineHeight: 1.6 },
  noticeBox:     { background: "rgba(26,127,224,.12)", border: "1px solid rgba(26,127,224,.3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#9ccbf7", lineHeight: 1.6, marginTop: 8 },

  // Access banner (when signed in)
  accessBanner: { background: "#0f172a", borderBottom: "1px solid rgba(255,255,255,.07)", padding: "8px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", position: "sticky", top: 0, zIndex: 100 },
  bannerLeft:   { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 500 },
  bannerDot:    { width: 7, height: 7, borderRadius: "50%", background: LIME, boxShadow: `0 0 6px ${LIME}` },
  logoutBtn:    { background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.45)", fontSize: 12, padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" },
  pinBtn:       { background: "rgba(232,147,10,.15)", border: "1px solid rgba(232,147,10,.4)", color: "#f6b84a", fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" },

  // Add-PIN modal
  modalBackdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modal:         { background: "#111a2e", border: "1px solid rgba(255,255,255,.12)", borderRadius: 18, padding: "28px 24px", width: "100%", maxWidth: 400, fontFamily: "'DM Sans','Segoe UI',sans-serif", boxSizing: "border-box" },
};

// Inject spin keyframe once
if (typeof document !== "undefined" && !document.getElementById("sthablym-spin-style")) {
  const tag = document.createElement("style");
  tag.id = "sthablym-spin-style";
  tag.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(tag);
}
// src/components/GapYearPage.js
// ─────────────────────────────────────────────────────────────────────────────
// GAP YEAR PAGE — for learners who have finished matric and are taking a year
// out before studying or working.
//
// Props (all optional):
//   user        – the signed-in user object (from AccessGate), used for tracking
//   embedded    – true when shown inside another page (drops the full-screen height)
//   onBack      – function; shows a "← Back" button when provided
//   onOpenAPS   – function; shows an "Open APS Calculator" button when provided
//
// Usage:
//   <GapYearPage user={user} onBack={() => setPage("home")} onOpenAPS={() => setPage("aps")} />
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import { trackActivity } from "./trackActivity";

const INK  = "#0c1220";
const SKY  = "#1a7fe0";
const LIME = "#5cb85c";

// ─── CONTENT ─────────────────────────────────────────────────────────────────
const GOALS = [
  {
    id: "marks",
    icon: "📈",
    color: "#e8930a",
    title: "Improve my marks",
    blurb: "Your APS didn't open the door you wanted. Use the year to raise it.",
    options: [
      { tag: "Rewrite", title: "Rewrite subjects", desc: "Rewrite the subjects that held your APS back through the supplementary exams or a Second Chance programme. Ask your school or district office what is available for you." },
      { tag: "Bridging", title: "Bridging or foundation programmes", desc: "Some universities run bridging or extended programmes for learners who just missed the entry requirements. Check each university's website." },
      { tag: "Practice", title: "Practise past-paper questions", desc: "Use the NSC practice questions on Sthablym to find your weak topics and drill them under timed conditions." },
    ],
    tasks: [
      "List your final matric marks and work out your APS",
      "Find the programme you want and its minimum APS and subject requirements",
      "Identify the 1–2 subjects with the biggest gap to the requirement",
      "Find out how and when you can rewrite those subjects",
      "Set a weekly study timetable and stick to it",
    ],
  },
  {
    id: "study",
    icon: "🎓",
    color: SKY,
    title: "Study something now",
    blurb: "You qualify for a course and want to start building a qualification.",
    options: [
      { tag: "TVET", title: "TVET colleges", desc: "Practical, job-focused qualifications. Many learners qualify for NSFAS funding at TVET colleges." },
      { tag: "Distance", title: "Distance learning", desc: "Study part-time with a distance university while you work, and save towards full-time study." },
      { tag: "Short course", title: "Short courses and certificates", desc: "Short accredited courses can build skills and strengthen a later application." },
    ],
    tasks: [
      "Shortlist 3 courses and check their entry requirements",
      "Check the closing date for each application",
      "Collect your certified ID and matric results",
      "Apply for NSFAS or another funder if you need one",
      "Submit every application before its closing date",
    ],
  },
  {
    id: "work",
    icon: "💼",
    color: "#9333ea",
    title: "Work and earn",
    blurb: "You need income, or you want experience before you study.",
    options: [
      { tag: "Programme", title: "Youth employment programmes", desc: "Programmes such as the Youth Employment Service (YES) place young people in paid work experience." },
      { tag: "Learnership", title: "Learnerships and internships", desc: "SETAs and companies offer learnerships that combine work with a recognised qualification." },
      { tag: "Entry level", title: "Entry-level jobs", desc: "A job in the field you are interested in gives you experience and a reference." },
    ],
    tasks: [
      "Write a one-page CV with your matric results",
      "Get certified copies of your ID and certificate",
      "Create a profile on a youth job platform",
      "Apply to at least 5 opportunities each week",
      "Ask one employer or supervisor for a reference letter",
    ],
  },
  {
    id: "explore",
    icon: "🧭",
    color: "#14b8a6",
    title: "Explore careers",
    blurb: "You're not sure what to study yet, and that's okay.",
    options: [
      { tag: "Shadowing", title: "Job shadowing", desc: "Ask family, community members or local businesses if you can spend a few days watching their work." },
      { tag: "Volunteer", title: "Volunteering", desc: "Volunteer at a clinic, school, NGO or community project to try out a field." },
      { tag: "Quiz", title: "Stream and career quiz", desc: "Retake the Sthablym stream quiz now that you have your results and a clearer view of your strengths." },
    ],
    tasks: [
      "Write down 3 careers that interest you",
      "Find one person working in each and ask for a short chat",
      "Spend at least a week shadowing or volunteering",
      "Compare what you learned and shortlist 1–2 careers",
      "Look up the subjects and APS each career needs",
    ],
  },
  {
    id: "fund",
    icon: "💰",
    color: LIME,
    title: "Get funding",
    blurb: "Studying is the plan, but you need a bursary or loan to do it.",
    options: [
      { tag: "NSFAS", title: "NSFAS", desc: "Government funding for eligible learners at public universities and TVET colleges. Check the criteria and dates on the NSFAS website." },
      { tag: "Bursaries", title: "Company and sector bursaries", desc: "Companies and sector bodies offer bursaries linked to specific fields. Use the Sthablym Bursary Finder to match yours." },
      { tag: "Save", title: "Save while you work", desc: "A year of part-time work can build a deposit or cover registration fees." },
    ],
    tasks: [
      "Collect your parents' or guardians' ID and income documents",
      "Open the NSFAS website and check the application window",
      "List 5 bursaries that match your field and APS",
      "Note each bursary's closing date and requirements",
      "Submit applications early and keep proof of submission",
    ],
  },
];

const TIMELINE = [
  { when: "Months 1–2", title: "Decide your direction", desc: "Check your results, work out your APS and choose your main goal for the year." },
  { when: "Months 3–5", title: "Build",                desc: "Rewrite, study, work or volunteer. Whatever your goal, this is the stretch where you do the work." },
  { when: "Months 6–9", title: "Apply",                desc: "Many institutions open applications in the first half of the year. Check each closing date and apply early." },
  { when: "Months 10–12", title: "Prepare to start",   desc: "Sort registration, accommodation and funding so you can start the following year ready." },
];

const LINKS = [
  { label: "NSFAS",                     url: "https://www.nsfas.org.za",   note: "Funding applications and criteria" },
  { label: "Youth Employment Service",  url: "https://www.yes4youth.co.za", note: "Paid work experience for young people" },
  { label: "SA Youth",                  url: "https://sayouth.mobi",        note: "Free youth opportunities platform" },
];

const readSavedUser = () => {
  try { return JSON.parse(localStorage.getItem("sthablym_user")); } catch (_) { return null; }
};

// ─────────────────────────────────────────────────────────────────────────────
export default function GapYearPage({ user: userProp, onBack, onOpenAPS, embedded }) {
  // Use the registered user (has a userId) so progress and tracking stay per person
  const user = userProp && userProp.userId ? userProp : readSavedUser() || userProp;

  const [goalId,  setGoalId]  = useState(null);
  const [checked, setChecked] = useState({});

  const storeKey = `sthablym_gapyear_${(user && user.userId) || "guest"}`;

  // Restore saved goal + checklist progress
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey));
      if (saved) {
        setGoalId(saved.goalId || null);
        setChecked(saved.checked || {});
      }
    } catch (_) {}
    trackActivity("gapyear_page_viewed", user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (nextGoal, nextChecked) => {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ goalId: nextGoal, checked: nextChecked }));
    } catch (_) {}
  };

  const pickGoal = (id) => {
    setGoalId(id);
    save(id, checked);
    trackActivity("gapyear_goal_selected", user, { goal: id });
  };

  const toggleTask = (key) => {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    save(goalId, next);
    if (next[key]) trackActivity("gapyear_task_done", user, { task: key });
  };

  const goal = GOALS.find((g) => g.id === goalId);
  const done = goal ? goal.tasks.filter((_, i) => checked[`${goal.id}:${i}`]).length : 0;
  const pct  = goal ? Math.round((done / goal.tasks.length) * 100) : 0;

  return (
    <div style={embedded ? { ...s.wrap, minHeight: "auto", borderRadius: 18 } : s.wrap}>
      <div style={s.inner}>
        {onBack && <button style={s.backBtn} onClick={onBack}>← Back</button>}

        {/* Hero */}
        <div style={s.hero}>
          <div style={s.eyebrow}>🌍 Gap Year</div>
          <h1 style={s.title}>
            Make Your Gap Year <span style={{ color: "#7db8f5" }}>Count</span>
          </h1>
          <p style={s.sub}>
            A year out can be the best decision you make, if it has a plan. Pick what you want from
            the year and we'll give you options, a checklist and a timeline.
          </p>
          {onOpenAPS && (
            <button style={s.btnPrimary} onClick={onOpenAPS}>📊 Check my APS first →</button>
          )}
        </div>

        {/* Goals */}
        <div style={s.sectionEyebrow}>Step 1</div>
        <h2 style={s.sectionTitle}>What do you want from this year?</h2>
        <div style={s.goalGrid}>
          {GOALS.map((g) => {
            const active = g.id === goalId;
            return (
              <button
                key={g.id}
                onClick={() => pickGoal(g.id)}
                style={{
                  ...s.goalCard,
                  borderColor: active ? g.color : "rgba(255,255,255,.08)",
                  background:  active ? "rgba(255,255,255,.08)" : "rgba(255,255,255,.04)",
                }}
              >
                <span style={{ fontSize: 26, display: "block", marginBottom: 8 }}>{g.icon}</span>
                <div style={s.goalTitle}>{g.title}</div>
                <div style={s.goalBlurb}>{g.blurb}</div>
              </button>
            );
          })}
        </div>

        {/* Selected goal */}
        {goal && (
          <>
            <div style={{ ...s.sectionEyebrow, marginTop: 40 }}>Step 2</div>
            <h2 style={s.sectionTitle}>Your options</h2>
            <div style={s.optGrid}>
              {goal.options.map((o) => (
                <div key={o.title} style={s.optCard}>
                  <span style={{ ...s.tag, color: goal.color, borderColor: goal.color }}>{o.tag}</span>
                  <div style={s.optTitle}>{o.title}</div>
                  <div style={s.optDesc}>{o.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ ...s.sectionEyebrow, marginTop: 40 }}>Step 3</div>
            <h2 style={s.sectionTitle}>Your checklist</h2>
            <div style={s.checkCard}>
              <div style={s.progressRow}>
                <span style={s.progressText}>{done} of {goal.tasks.length} done</span>
                <span style={s.progressText}>{pct}%</span>
              </div>
              <div style={s.progressTrack}>
                <div style={{ ...s.progressFill, width: `${pct}%`, background: goal.color }} />
              </div>
              {goal.tasks.map((t, i) => {
                const key = `${goal.id}:${i}`;
                const on  = !!checked[key];
                return (
                  <label key={key} style={s.taskRow}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleTask(key)}
                      style={{ marginTop: 3, flexShrink: 0 }}
                    />
                    <span style={{ ...s.taskText, ...(on ? s.taskDone : {}) }}>{t}</span>
                  </label>
                );
              })}
            </div>
          </>
        )}

        {/* Timeline */}
        <div style={{ ...s.sectionEyebrow, marginTop: 48 }}>The Year</div>
        <h2 style={s.sectionTitle}>A simple 12-month plan</h2>
        <div style={s.timeline}>
          {TIMELINE.map((t) => (
            <div key={t.when} style={s.timeRow}>
              <div style={s.timeWhen}>{t.when}</div>
              <div>
                <div style={s.timeTitle}>{t.title}</div>
                <div style={s.timeDesc}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div style={{ ...s.sectionEyebrow, marginTop: 48 }}>Useful Links</div>
        <h2 style={s.sectionTitle}>Where to apply</h2>
        <div style={s.linkList}>
          {LINKS.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              style={s.linkCard}
              onClick={() => trackActivity("gapyear_link_clicked", user, { link: l.label })}
            >
              <div style={s.linkLabel}>{l.label} ↗</div>
              <div style={s.linkNote}>{l.note}</div>
            </a>
          ))}
        </div>

        <p style={s.disclaimer}>
          Programmes, requirements and closing dates change every year. Always confirm them on the
          official website or with the institution before you apply.
        </p>
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  wrap:  { minHeight: "100vh", background: INK, fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#fff" },
  inner: { maxWidth: 760, margin: "0 auto", padding: "24px 20px 80px", boxSizing: "border-box" },

  backBtn: { background: "none", border: "none", color: "rgba(255,255,255,.4)", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 12, fontFamily: "inherit" },

  hero:    { textAlign: "center", padding: "32px 0 40px" },
  eyebrow: { display: "inline-block", background: "rgba(26,127,224,.14)", border: "1px solid rgba(26,127,224,.3)", color: "#7db8f5", fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 99, marginBottom: 18, letterSpacing: 1, textTransform: "uppercase" },
  title:   { fontSize: 36, fontWeight: 800, lineHeight: 1.1, margin: "0 0 16px", letterSpacing: -1 },
  sub:     { fontSize: 15, color: "rgba(255,255,255,.55)", lineHeight: 1.8, maxWidth: 540, margin: "0 auto 24px" },
  btnPrimary: { padding: "13px 26px", background: `linear-gradient(135deg,${SKY},#1368bf)`, color: "#fff", border: "none", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" },

  sectionEyebrow: { fontSize: 11, fontWeight: 700, color: SKY, letterSpacing: 1.5, textTransform: "uppercase", textAlign: "center", marginBottom: 8 },
  sectionTitle:   { fontSize: 24, fontWeight: 800, textAlign: "center", margin: "0 0 20px", letterSpacing: -0.5 },

  goalGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 },
  goalCard:  { textAlign: "left", border: "1.5px solid", borderRadius: 14, padding: "18px 16px", cursor: "pointer", fontFamily: "inherit", color: "#fff" },
  goalTitle: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
  goalBlurb: { fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.6 },

  optGrid:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 },
  optCard:  { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "18px 16px" },
  tag:      { display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase", border: "1px solid", borderRadius: 99, padding: "3px 10px", marginBottom: 10 },
  optTitle: { fontSize: 14, fontWeight: 700, marginBottom: 6 },
  optDesc:  { fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.65 },

  checkCard:     { background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: "20px 20px 8px" },
  progressRow:   { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  progressText:  { fontSize: 12, color: "rgba(255,255,255,.5)", fontWeight: 600 },
  progressTrack: { height: 6, background: "rgba(255,255,255,.08)", borderRadius: 99, overflow: "hidden", marginBottom: 14 },
  progressFill:  { height: "100%", borderRadius: 99, transition: "width .3s ease" },
  taskRow:       { display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: "1px solid rgba(255,255,255,.06)", cursor: "pointer" },
  taskText:      { fontSize: 14, color: "rgba(255,255,255,.8)", lineHeight: 1.55 },
  taskDone:      { textDecoration: "line-through", color: "rgba(255,255,255,.35)" },

  timeline:  { display: "flex", flexDirection: "column", gap: 10 },
  timeRow:   { display: "flex", gap: 16, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px 18px", alignItems: "flex-start" },
  timeWhen:  { minWidth: 92, fontSize: 12, fontWeight: 800, color: "#7db8f5", paddingTop: 2 },
  timeTitle: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  timeDesc:  { fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.65 },

  linkList:  { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 },
  linkCard:  { display: "block", textDecoration: "none", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "16px", color: "#fff" },
  linkLabel: { fontSize: 14, fontWeight: 700, color: "#7db8f5", marginBottom: 4 },
  linkNote:  { fontSize: 12, color: "rgba(255,255,255,.5)", lineHeight: 1.55 },

  disclaimer: { fontSize: 12, color: "rgba(255,255,255,.3)", textAlign: "center", lineHeight: 1.7, marginTop: 36 },
};
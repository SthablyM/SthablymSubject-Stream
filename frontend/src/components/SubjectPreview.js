// src/components/SubjectPreview.js
// Full-screen subject stream explorer shown to Grade 9 & 10 students
// before they proceed to fill in their profile form.
//
// Props:
//   grade      {string}   "9" or "10"
//   onBack     {function} go back to grade selection
//   onContinue {function} proceed to the profile form

import React, { useState } from "react";

// ─── STREAM DATA ──────────────────────────────────────────────────────────────
const STREAMS = [
  {
    id: "science",
    name: "Science Stream",
    icon: "🔬",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    tagBg: "#dbeafe",
    tagText: "#1e40af",
    description: "The foundation for medicine, engineering, pharmacy, and the natural sciences. Heavy on mathematics and experimentation.",
    subjects: [
      { name: "Pure Mathematics",    detail: "Calculus, algebra, trigonometry, statistics" },
      { name: "Physical Sciences",   detail: "Physics (forces, electricity) + Chemistry (atoms, reactions)" },
      { name: "Life Sciences",       detail: "Biology — cells, genetics, ecosystems, human body" },
      { name: "Geography",           detail: "Climate, geomorphology, map work, population" },
    ],
    careers: [
      { name: "Medical Doctor",        aps: "36+", icon: "🩺" },
      { name: "Pharmacist",            aps: "32+", icon: "💊" },
      { name: "Civil / Mechanical Engineer", aps: "32+", icon: "🏗️" },
      { name: "Environmental Scientist", aps: "28+", icon: "🌿" },
      { name: "Veterinarian",          aps: "32+", icon: "🐾" },
      { name: "Biotechnologist",       aps: "30+", icon: "🧬" },
    ],
    universities: "UCT, Wits, UP, UKZN, Stellenbosch",
    apsRange: "28 – 36",
    tip: "If you enjoy experiments, problem-solving, and understanding how nature works — this stream is for you.",
  },
  {
    id: "commerce",
    name: "Commerce Stream",
    icon: "📊",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    tagBg: "#dcfce7",
    tagText: "#14532d",
    description: "Built for future accountants, entrepreneurs, and financial professionals. You'll learn to analyse money and run businesses.",
    subjects: [
      { name: "Pure Mathematics",  detail: "Essential for accounting and financial analysis" },
      { name: "Accounting",        detail: "Journals, ledgers, financial statements, VAT" },
      { name: "Business Studies",  detail: "Forms of ownership, marketing mix, SWOT analysis" },
      { name: "Economics",         detail: "Supply & demand, market structures, GDP, inflation" },
    ],
    careers: [
      { name: "Chartered Accountant (CA)", aps: "32+", icon: "📒" },
      { name: "Financial Analyst",         aps: "28+", icon: "📈" },
      { name: "Entrepreneur",              aps: "24+", icon: "💡" },
      { name: "Economist",                 aps: "28+", icon: "🏛️" },
      { name: "Auditor",                   aps: "28+", icon: "🔍" },
      { name: "Investment Banker",         aps: "32+", icon: "💰" },
    ],
    universities: "Wits, UCT, UP, UJ, UNISA",
    apsRange: "24 – 32",
    tip: "If you enjoy numbers, strategy, and the idea of running your own business — commerce is the right fit.",
  },
  {
    id: "humanities",
    name: "Humanities Stream",
    icon: "🎭",
    color: "#9333ea",
    bg: "#faf5ff",
    border: "#e9d5ff",
    tagBg: "#f3e8ff",
    tagText: "#581c87",
    description: "Language, society, law, psychology, and culture. Excellent for communicators, creatives, and those who want to help people.",
    subjects: [
      { name: "Mathematical Literacy", detail: "Everyday maths — finance, measurement, data" },
      { name: "History",               detail: "SA history, World Wars, Cold War, apartheid era" },
      { name: "Geography",             detail: "Climate, development, urbanisation, maps" },
      { name: "Tourism / Drama / Arts", detail: "Practical and creative electives" },
    ],
    careers: [
      { name: "Lawyer (LLB)",         aps: "30+", icon: "⚖️" },
      { name: "Journalist",           aps: "26+", icon: "📰" },
      { name: "Social Worker",        aps: "22+", icon: "🤝" },
      { name: "Teacher (BEd)",        aps: "24+", icon: "📚" },
      { name: "Psychologist",         aps: "28+", icon: "🧠" },
      { name: "Tourism Manager",      aps: "22+", icon: "✈️" },
    ],
    universities: "Rhodes, UJ, UNISA, Wits, UWC, UCT",
    apsRange: "20 – 30",
    tip: "If you love reading, writing, debating, or working with people — the humanities stream opens many doors.",
  },
  {
    id: "engineering",
    name: "Engineering & Technical Stream",
    icon: "⚙️",
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    tagBg: "#ffedd5",
    tagText: "#7c2d12",
    description: "Hands-on technical knowledge for builders, electricians, designers, and technologists. Strong job demand across South Africa.",
    subjects: [
      { name: "Technical Mathematics",   detail: "Applied maths — calculations, measurement, ratios" },
      { name: "Technical Sciences",      detail: "Applied physics — forces, circuits, hydraulics" },
      { name: "Civil / Electrical Technology", detail: "Construction, wiring, structures" },
      { name: "Engineering Graphics & Design (EGD)", detail: "Technical drawing, CAD, design principles" },
    ],
    careers: [
      { name: "Civil Engineer",              aps: "28+", icon: "🏗️" },
      { name: "Electrician / Technician",    aps: "20+", icon: "⚡" },
      { name: "Mechanical Technician",       aps: "22+", icon: "🔧" },
      { name: "IT Technician",               aps: "22+", icon: "💻" },
      { name: "Draughtsperson (EGD)",        aps: "22+", icon: "📐" },
      { name: "Construction Manager",        aps: "26+", icon: "🔨" },
    ],
    universities: "TUT, CPUT, DUT, UJ, UP, Wits — also TVET Colleges",
    apsRange: "18 – 28",
    tip: "If you like building things, fixing machines, drawing plans, or working with electricity — this stream suits you.",
  },
];

// ─── SUBJECT TOPIC DATA (Grade 10 topics per stream) ─────────────────────────
const GRADE10_TOPICS = {
  science: [
    { subject: "Pure Mathematics",  topics: ["Algebra & exponents","Number patterns","Functions & graphs","Finance & growth","Trigonometry","Euclidean geometry","Statistics & probability"] },
    { subject: "Physical Sciences", topics: ["Mechanics — Newton's Laws","Electricity & circuits","Matter & atomic structure","Chemical bonding","Periodic table","Energy transformations"] },
    { subject: "Life Sciences",     topics: ["Cell biology","Cell division","Photosynthesis","Nutrition & digestion","Circulatory system","Biodiversity & ecology"] },
  ],
  commerce: [
    { subject: "Accounting",       topics: ["Accounting equation","Journals (CRJ, CPJ)","Ledger & trial balance","Financial statements","VAT basics","Debtors & creditors"] },
    { subject: "Business Studies", topics: ["Forms of business ownership","Business functions","Marketing mix (4 P's)","Entrepreneurship","PESTLE & SWOT analysis"] },
    { subject: "Economics",        topics: ["Scarcity & opportunity cost","Types of economies","Supply & demand","Market structures","GDP basics"] },
  ],
  humanities: [
    { subject: "History",    topics: ["The Cold War","Civil Rights Movement","Angola & the South African Border War","Source analysis skills","Cause and effect in history"] },
    { subject: "Geography",  topics: ["Atmosphere & climate","Geomorphology (rivers & slopes)","Population & migration","Development indicators (HDI, GINI)","Map reading & cartography"] },
    { subject: "Maths Lit",  topics: ["Finance & budgets","Measurement & conversions","Data & graphs","Maps & scale","Probability in everyday life"] },
  ],
  engineering: [
    { subject: "Technical Mathematics", topics: ["Algebra & equations","Geometry (area, perimeter, volume)","Trigonometry for right triangles","Finance calculations","Number patterns"] },
    { subject: "Technical Sciences",    topics: ["Forces & equilibrium","Electricity & Ohm's Law","Magnetism","Pressure & hydraulics","Matter & materials"] },
    { subject: "Civil Technology",      topics: ["Construction materials (concrete, brick, steel)","Technical drawing & floor plans","Foundations","Walls & floors","Safety (OHSA, PPE)"] },
  ],
};

// ─── QUIZ: what stream suits you ─────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: "Which activity sounds most exciting to you?",
    options: [
      { text: "Conducting an experiment in a lab",   stream: "science" },
      { text: "Managing a school tuck shop budget",  stream: "commerce" },
      { text: "Writing a story or debating a topic", stream: "humanities" },
      { text: "Building or fixing something",        stream: "engineering" },
    ],
  },
  {
    q: "Which subject do you enjoy the most right now?",
    options: [
      { text: "Mathematics or Natural Sciences",     stream: "science" },
      { text: "Economic & Management Sciences (EMS)",stream: "commerce" },
      { text: "History, English, or Creative Arts",  stream: "humanities" },
      { text: "Technology or Design",                stream: "engineering" },
    ],
  },
  {
    q: "Where do you see yourself working one day?",
    options: [
      { text: "A hospital, lab, or research centre",   stream: "science" },
      { text: "An office, bank, or running a business", stream: "commerce" },
      { text: "A school, court, newsroom, or NGO",     stream: "humanities" },
      { text: "A factory, construction site, or data centre", stream: "engineering" },
    ],
  },
  {
    q: "How do you prefer to solve problems?",
    options: [
      { text: "Using formulas and scientific methods", stream: "science" },
      { text: "Analysing data and financial figures",  stream: "commerce" },
      { text: "Researching, reading, and discussing",  stream: "humanities" },
      { text: "Using tools, drawings, or technology",  stream: "engineering" },
    ],
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function SubjectPreview({ grade, onBack, onContinue }) {
  const gradeNum    = parseInt(grade);
  const isGrade9    = gradeNum === 9;

  // tabs: "explore" | "quiz" | "topics"
  const [tab,            setTab]           = useState("explore");
  const [openStream,     setOpenStream]    = useState(null);   // id of expanded stream card
  const [detailStream,   setDetailStream]  = useState(null);   // stream shown in detail modal
  const [quizAnswers,    setQuizAnswers]   = useState({});     // { qIndex: streamId }
  const [quizDone,       setQuizDone]      = useState(false);
  const [topicsStream,   setTopicsStream]  = useState("science");

  // ── Quiz result ────────────────────────────────────────────────────────────
  const quizResult = () => {
    const counts = { science: 0, commerce: 0, humanities: 0, engineering: 0 };
    Object.values(quizAnswers).forEach((s) => { counts[s]++; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleQuizAnswer = (qIdx, streamId) => {
    const next = { ...quizAnswers, [qIdx]: streamId };
    setQuizAnswers(next);
    if (Object.keys(next).length === QUIZ_QUESTIONS.length) setQuizDone(true);
  };

  const resultStream = quizDone ? STREAMS.find((s) => s.id === quizResult()) : null;

  // ── Detail modal ───────────────────────────────────────────────────────────
  const DetailModal = ({ stream }) => (
    <div
      onClick={() => setDetailStream(null)}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 20, maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.25)" }}
      >
        {/* Modal header */}
        <div style={{ background: stream.bg, borderBottom: `2px solid ${stream.border}`, padding: "20px 24px", borderRadius: "20px 20px 0 0", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 32 }}>{stream.icon}</span>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: stream.color, margin: 0 }}>{stream.name}</h2>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>APS Range: {stream.apsRange} · {stream.universities}</p>
          </div>
          <button onClick={() => setDetailStream(null)} style={{ marginLeft: "auto", background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94a3b8" }}>✕</button>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* Description */}
          <div style={{ background: stream.bg, border: `1px solid ${stream.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 18 }}>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.7 }}>{stream.description}</p>
          </div>

          {/* Subjects */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>📚 Subjects You Will Take</h3>
          {stream.subjects.map((sub, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: stream.color, marginTop: 5, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: stream.color, margin: 0 }}>{sub.name}</p>
                <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>{sub.detail}</p>
              </div>
            </div>
          ))}

          {/* Careers */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 10, marginTop: 18 }}>🎓 Career Paths</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {stream.careers.map((c, i) => (
              <div key={i} style={{ background: stream.bg, border: `1px solid ${stream.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: stream.color, margin: 0 }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>APS {c.aps}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 14px", marginTop: 18 }}>
            <p style={{ fontSize: 13, color: "#713f12", margin: 0, lineHeight: 1.6 }}>
              💡 <b>Is this stream for you?</b> {stream.tip}
            </p>
          </div>

          <button
            onClick={() => { setDetailStream(null); onContinue(); }}
            style={{ width: "100%", padding: 14, background: stream.color, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 18 }}
          >
            This looks right for me — fill in my profile →
          </button>
        </div>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif", background: "#e0f2fe", minHeight: "100vh", paddingBottom: 60 }}>

      {/* Detail modal */}
      {detailStream && <DetailModal stream={detailStream} />}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg, #0c4a7a 0%, #1e40af 100%)", padding: "24px 20px 0" }}>
        <button
          onClick={onBack}
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", marginBottom: 18, display: "block" }}
        >
          ← Back
        </button>

        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 99, padding: "3px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            Grade {grade}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
            {isGrade9 ? "Understand Your Subject Choices" : "Your Subject Streams"}
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 20px", lineHeight: 1.7, maxWidth: 560 }}>
            {isGrade9
              ? "Before taking the quiz, explore what each stream involves and where it leads. Tap any stream to learn more, then take the mini-quiz to find your best match."
              : "Explore your current stream's subjects and topics. See what careers your stream opens up and how your APS stacks up against university requirements."}
          </p>

          {/* Tab row */}
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { id: "explore", label: "🗺️ Explore Streams" },
              ...(isGrade9 ? [{ id: "quiz", label: "🎯 Quick Match Quiz" }] : []),
              { id: "topics",  label: "📖 Topics by Stream" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "10px 16px", fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer", borderRadius: "8px 8px 0 0",
                  background: tab === t.id ? "#e0f2fe" : "rgba(255,255,255,0.1)",
                  color: tab === t.id ? "#1e293b" : "rgba(255,255,255,0.75)",
                  transition: "all .15s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px" }}>

        {/* ════ EXPLORE tab ════ */}
        {tab === "explore" && (
          <div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16, lineHeight: 1.6 }}>
              South Africa has <b>4 main subject streams</b>. Each stream is a package of related subjects that prepares you for a specific group of careers. Tap any stream card to expand it, or click <b>Full Detail</b> for a deeper look.
            </p>

            {STREAMS.map((stream) => {
              const isOpen = openStream === stream.id;
              return (
                <div
                  key={stream.id}
                  style={{ border: `1.5px solid ${isOpen ? stream.color : stream.border}`, borderRadius: 16, marginBottom: 12, overflow: "hidden", boxShadow: isOpen ? `0 4px 20px ${stream.color}22` : "0 1px 4px rgba(0,0,0,0.05)", transition: "all .2s" }}
                >
                  {/* Card header */}
                  <button
                    onClick={() => setOpenStream(isOpen ? null : stream.id)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", border: "none", cursor: "pointer", background: isOpen ? stream.bg : "#fff", textAlign: "left", transition: "background .2s" }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${stream.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                      {stream.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isOpen ? stream.color : "#1e293b", marginBottom: 3 }}>{stream.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>APS {stream.apsRange} · {stream.subjects.length} core subjects · {stream.careers.length} career paths</div>
                    </div>
                    <span style={{ fontSize: 20, color: stream.color, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s", display: "inline-block" }}>▾</span>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div style={{ background: stream.bg, borderTop: `1px solid ${stream.border}`, padding: "16px 18px" }}>
                      <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: "0 0 14px" }}>{stream.description}</p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                        {/* Subjects column */}
                        <div style={{ background: "#fff", border: `1px solid ${stream.border}`, borderRadius: 12, padding: "12px 14px" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: stream.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subjects</p>
                          {stream.subjects.map((sub, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: stream.color, marginTop: 4, flexShrink: 0 }} />
                              <div>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{sub.name}</span>
                                <span style={{ fontSize: 11, color: "#6b7280", display: "block" }}>{sub.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Careers column */}
                        <div style={{ background: "#fff", border: `1px solid ${stream.border}`, borderRadius: 12, padding: "12px 14px" }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: stream.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Careers</p>
                          {stream.careers.map((c, i) => (
                            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 14 }}>{c.icon}</span>
                              <div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{c.name}</span>
                                <span style={{ fontSize: 11, color: stream.color, display: "block", fontWeight: 700 }}>APS {c.aps}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tip */}
                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
                        <p style={{ fontSize: 12, color: "#713f12", margin: 0, lineHeight: 1.6 }}>💡 {stream.tip}</p>
                      </div>

                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setDetailStream(stream)}
                          style={{ flex: 1, padding: "11px 0", background: stream.color, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        >
                          📋 Full detail
                        </button>
                        <button
                          onClick={onContinue}
                          style={{ flex: 1, padding: "11px 0", background: "#fff", color: stream.color, border: `2px solid ${stream.color}`, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        >
                          {isGrade9 ? "This is my stream →" : "Continue →"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════ QUIZ tab ════ */}
        {tab === "quiz" && (
          <div>
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
              <span style={{ fontSize: 18 }}>🎯</span>
              <p style={{ fontSize: 13, color: "#1e40af", margin: 0, lineHeight: 1.6 }}>
                Answer these 4 quick questions to get a <b>personalised stream suggestion</b>. There are no wrong answers — just be honest about what interests you!
              </p>
            </div>

            {!quizDone ? (
              QUIZ_QUESTIONS.map((q, qIdx) => (
                <div key={qIdx} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "18px 20px", marginBottom: 12, opacity: quizAnswers[qIdx] !== undefined || Object.keys(quizAnswers).length === qIdx ? 1 : 0.5 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "0 0 12px" }}>
                    <span style={{ display: "inline-block", width: 24, height: 24, borderRadius: "50%", background: "#2563eb", color: "#fff", textAlign: "center", lineHeight: "24px", fontSize: 12, fontWeight: 800, marginRight: 8 }}>{qIdx + 1}</span>
                    {q.q}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {q.options.map((opt, oIdx) => {
                      const stream = STREAMS.find((s) => s.id === opt.stream);
                      const selected = quizAnswers[qIdx] === opt.stream;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleQuizAnswer(qIdx, opt.stream)}
                          style={{
                            padding: "11px 14px", border: selected ? `2px solid ${stream.color}` : "1.5px solid #e2e8f0",
                            borderRadius: 10, background: selected ? stream.bg : "#f0f9ff",
                            color: selected ? stream.color : "#374151", fontSize: 13, fontWeight: selected ? 700 : 500,
                            cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, transition: "all .15s",
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{stream.icon}</span>
                          {opt.text}
                          {selected && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              /* Quiz result */
              <div>
                <div style={{ background: resultStream.bg, border: `2px solid ${resultStream.color}`, borderRadius: 20, padding: "24px 24px", marginBottom: 16, textAlign: "center" }}>
                  <span style={{ fontSize: 48, display: "block", marginBottom: 8 }}>{resultStream.icon}</span>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: resultStream.color, margin: "0 0 8px" }}>Your Match: {resultStream.name}</h2>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: "0 0 16px" }}>{resultStream.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 16 }}>
                    {resultStream.careers.slice(0, 4).map((c, i) => (
                      <span key={i} style={{ background: "#fff", border: `1px solid ${resultStream.border}`, borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: resultStream.color }}>
                        {c.icon} {c.name}
                      </span>
                    ))}
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
                    💡 This is a suggestion based on your answers. You can explore other streams too before deciding.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { setQuizAnswers({}); setQuizDone(false); }}
                    style={{ flex: 1, padding: 12, background: "#f0f9ff", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
                  >
                    🔄 Retake quiz
                  </button>
                  <button
                    onClick={onContinue}
                    style={{ flex: 2, padding: 12, background: resultStream.color, color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >
                    Fill in my profile & take the full quiz →
                  </button>
                </div>
              </div>
            )}

            {/* Progress bar */}
            {!quizDone && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>Progress</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{Object.keys(quizAnswers).length} / {QUIZ_QUESTIONS.length}</span>
                </div>
                <div style={{ height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: "#2563eb", borderRadius: 99, width: `${(Object.keys(quizAnswers).length / QUIZ_QUESTIONS.length) * 100}%`, transition: "width .4s" }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ TOPICS tab ════ */}
        {tab === "topics" && (
          <div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14, lineHeight: 1.6 }}>
              See exactly what topics are covered in <b>Grade 10</b> for each stream's core subjects. This gives you a real taste of what you'll be studying.
            </p>

            {/* Stream selector */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {STREAMS.map((stream) => (
                <button
                  key={stream.id}
                  onClick={() => setTopicsStream(stream.id)}
                  style={{
                    padding: "7px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1.5px solid",
                    borderColor: topicsStream === stream.id ? stream.color : "#e2e8f0",
                    background: topicsStream === stream.id ? stream.bg : "#fff",
                    color: topicsStream === stream.id ? stream.color : "#6b7280",
                    transition: "all .15s",
                  }}
                >
                  {stream.icon} {stream.name.replace(" Stream", "").replace(" & Technical", "")}
                </button>
              ))}
            </div>

            {/* Topics content */}
            {(() => {
              const activeStream = STREAMS.find((s) => s.id === topicsStream);
              const topics = GRADE10_TOPICS[topicsStream] || [];
              return (
                <div>
                  <div style={{ background: activeStream.bg, border: `1px solid ${activeStream.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 14, display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 24 }}>{activeStream.icon}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: activeStream.color, margin: 0 }}>{activeStream.name}</p>
                      <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>Grade 10 core subject topics</p>
                    </div>
                  </div>

                  {topics.map((subj, si) => (
                    <div key={si} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, marginBottom: 12, overflow: "hidden" }}>
                      <div style={{ background: activeStream.bg, borderBottom: `1px solid ${activeStream.border}`, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: activeStream.color }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: activeStream.color }}>{subj.subject}</span>
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{subj.topics.length} topics</span>
                      </div>
                      <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {subj.topics.map((t, ti) => (
                          <div key={ti} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: activeStream.color, marginTop: 5, flexShrink: 0 }} />
                            <span style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Continue CTA ─────────────────────────────────────────────── */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 20px", marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" }}>
            {isGrade9 ? "Ready to find your stream?" : "Ready to see your university options?"}
          </p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.6 }}>
            {isGrade9
              ? "Fill in your profile and take the full quiz to get your personalised stream recommendation, APS calculation, and university options."
              : "Fill in your Grade 10 marks to calculate your APS and see which university programmes you already qualify for."}
          </p>
          <button
            onClick={onContinue}
            style={{ padding: "14px 40px", background: "linear-gradient(135deg,#6366f1,#2563eb)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer", width: "100%" }}
          >
            {isGrade9 ? "Fill in my profile & take the quiz →" : "Fill in my profile →"}
          </button>
          <button
            onClick={onBack}
            style={{ marginTop: 10, background: "none", border: "none", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}
          >
            ← Back to grade selection
          </button>
        </div>
      </div>
    </div>
  );
}
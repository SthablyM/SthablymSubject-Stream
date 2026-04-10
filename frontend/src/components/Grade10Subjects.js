// src/components/Grade10Subjects.js
// Subject explorer for Grade 10+ students.
// Used both as a standalone reference inside EnhancedResults
// AND as the "subject preview" step inside the StudentProfile flow.
//
// Props:
//   student      {object}   { grade, name, ... }
//   onStartQuiz  {function} called with subject name when "Practice" button clicked
//   onBack       {function} called when "← Back" is pressed
//   onContinue   {function} (optional) called from a global CTA — used in profile flow

import React, { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT DATA
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "📐",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    description: "Pure mathematics — algebra, calculus, geometry and more.",
    topics: [
      { label: "Algebra",                 detail: "Simplifying expressions, factorising, solving equations" },
      { label: "Exponents & Surds",       detail: "Laws of exponents, simplifying surd expressions" },
      { label: "Number Patterns",         detail: "Arithmetic sequences, formulae for the nth term" },
      { label: "Finance",                 detail: "Simple & compound interest, hire purchase" },
      { label: "Functions & Graphs",      detail: "Linear, quadratic, hyperbola — gradient & intercepts" },
      { label: "Trigonometry",            detail: "SOH-CAH-TOA, special angles, 2D problems" },
      { label: "Geometry",                detail: "Properties of 2D shapes, area and perimeter" },
      { label: "Statistics & Probability",detail: "Mean, median, mode, range, basic probability" },
    ],
  },
  {
    id: "technical-mathematics",
    name: "Technical Mathematics",
    icon: "🔧",
    color: "#0369a1",
    bg: "#e0f2fe",
    border: "#bae6fd",
    description: "Applied mathematics for technical and vocational pathways.",
    topics: [
      { label: "Algebra",         detail: "Equations, expressions, substitution in real contexts" },
      { label: "Exponents",       detail: "Laws of exponents applied to technical problems" },
      { label: "Geometry",        detail: "Areas, perimeters, volumes — circles, prisms, cones" },
      { label: "Trigonometry",    detail: "Sine, cosine, tangent — solving right triangles" },
      { label: "Finance",         detail: "Simple/compound interest, depreciation, hire purchase" },
      { label: "Statistics",      detail: "Frequency tables, ogives, mean, median, mode" },
      { label: "Measurement",     detail: "Unit conversions — length, area, volume, speed" },
      { label: "Number Patterns", detail: "Linear and geometric sequences in technical settings" },
    ],
  },
  {
    id: "mathematical-literacy",
    name: "Mathematical Literacy",
    icon: "💡",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
    description: "Everyday maths — finance, measurement, data and real-life problem solving.",
    topics: [
      { label: "Numbers & Calculations", detail: "Percentages, fractions, decimals, ratios, rounding" },
      { label: "Finance",                detail: "Budgets, tax, VAT, interest, salary slips, exchange rates" },
      { label: "Measurement",            detail: "Length, area, volume, mass, time, temperature, speed" },
      { label: "Maps & Plans",           detail: "Scale, map reading, floor plans, compass bearings" },
      { label: "Data Handling",          detail: "Bar graphs, pie charts, line graphs, mean, median, mode" },
      { label: "Probability",            detail: "Likelihood of everyday events, simple probability" },
    ],
  },
  {
    id: "physical-sciences",
    name: "Physical Sciences",
    icon: "⚗️",
    color: "#6d28d9",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    description: "Physics and chemistry — laws of nature, matter and energy.",
    topics: [
      { label: "Mechanics",              detail: "Forces, motion, Newton's Laws, energy and work" },
      { label: "Electricity",            detail: "Ohm's Law, series and parallel circuits, power" },
      { label: "Waves & Sound",          detail: "Frequency, amplitude, wavelength, the Doppler effect" },
      { label: "Matter & Classification",detail: "Pure substances, mixtures, atomic structure" },
      { label: "Chemical Bonding",       detail: "Ionic and covalent bonds, molecular formulae" },
      { label: "Periodic Table",         detail: "Groups, periods, valence electrons, reactivity" },
      { label: "Energy Transformations", detail: "KE, PE, conservation of energy, efficiency" },
    ],
  },
  {
    id: "technical-sciences",
    name: "Technical Sciences",
    icon: "🔬",
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#99f6e4",
    description: "Applied sciences for technical fields — forces, electricity, materials and more.",
    topics: [
      { label: "Forces & Equilibrium",     detail: "Contact forces, torque, moments, Newton's Laws" },
      { label: "Electricity",              detail: "Ohm's Law, series/parallel circuits, power, safety" },
      { label: "Magnetism",               detail: "Magnetic fields, electromagnets, electromagnetic induction" },
      { label: "Pressure & Hydraulics",   detail: "Pascal's Law, pressure calculations, hydraulic systems" },
      { label: "Heat & Thermodynamics",   detail: "Conduction, convection, radiation, Boyle's/Charles' Law" },
      { label: "Matter & Materials",      detail: "Conductors, insulators, density, tensile strength, hardness" },
      { label: "Waves & Optics",          detail: "Wave speed, frequency, wavelength, EM spectrum" },
    ],
  },
  {
    id: "life-sciences",
    name: "Life Sciences",
    icon: "🧬",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    description: "Biology — cells, living systems, genetics and ecology.",
    topics: [
      { label: "Cell Biology",       detail: "Cell structure, organelles, osmosis, active transport" },
      { label: "Cell Division",      detail: "Mitosis (growth/repair) vs meiosis (sex cells)" },
      { label: "Nutrition",          detail: "Photosynthesis, cellular respiration, enzymes" },
      { label: "Transport Systems",  detail: "Blood, circulatory system, haemoglobin, heart" },
      { label: "Gaseous Exchange",   detail: "Stomata in plants, lungs and breathing in humans" },
      { label: "Support & Movement", detail: "Skeleton, tendons, ligaments, muscles" },
      { label: "Biodiversity",       detail: "Classification, biomes, food webs, food chains" },
      { label: "Reproduction",       detail: "Fertilisation, the reproductive system, embryo development" },
    ],
  },
  {
    id: "accounting",
    name: "Accounting",
    icon: "📒",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fde68a",
    description: "Financial record-keeping and reporting for businesses.",
    topics: [
      { label: "Accounting Equation",      detail: "Assets = Liabilities + Owner's Equity" },
      { label: "Double-Entry Bookkeeping", detail: "Debits and credits, DEAD CLIC rule" },
      { label: "Journals",                 detail: "CRJ, CPJ, Sales Journal, Purchases Journal" },
      { label: "Ledger & Trial Balance",   detail: "Posting to ledger accounts, balancing the TB" },
      { label: "Financial Statements",     detail: "Income Statement, Balance Sheet, Gross/Net Profit" },
      { label: "VAT",                      detail: "15% standard rate, input VAT, output VAT" },
      { label: "Debtors & Creditors",      detail: "Credit sales/purchases, control accounts" },
      { label: "Bank Reconciliation",      detail: "Cashbook vs bank statement, unpresented cheques" },
    ],
  },
  {
    id: "english",
    name: "English",
    icon: "📖",
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
    description: "Language, literature, comprehension and writing skills.",
    topics: [
      { label: "Grammar",          detail: "Tenses, parts of speech, sentence structure, punctuation" },
      { label: "Figures of Speech",detail: "Simile, metaphor, personification, hyperbole, alliteration" },
      { label: "Comprehension",    detail: "Topic sentences, inferential reading, summarising" },
      { label: "Literature",       detail: "Protagonist, antagonist, plot structure, themes" },
      { label: "Writing Skills",   detail: "Essays, formal letters, persuasive writing, register" },
    ],
  },
  {
    id: "business-studies",
    name: "Business Studies",
    icon: "💼",
    color: "#059669",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    description: "How businesses work — ownership, functions, marketing and law.",
    topics: [
      { label: "Forms of Ownership",   detail: "Sole trader, partnership, (Pty) Ltd — pros and cons" },
      { label: "Business Functions",   detail: "HR, Marketing, Finance, Production / Operations" },
      { label: "Entrepreneurship",     detail: "Starting a business, risk-taking, innovation" },
      { label: "Marketing Mix",        detail: "4 P's — Product, Price, Place, Promotion" },
      { label: "Business Environment", detail: "PESTLE analysis, SWOT analysis" },
    ],
  },
  {
    id: "economics",
    name: "Economics",
    icon: "📈",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    description: "How economies work — scarcity, markets, supply and demand.",
    topics: [
      { label: "Basic Economic Concepts", detail: "Scarcity, opportunity cost, factors of production" },
      { label: "Types of Economies",      detail: "Market, command, mixed economies" },
      { label: "Supply & Demand",         detail: "Law of demand/supply, equilibrium, elasticity" },
      { label: "Market Structures",       detail: "Perfect competition, monopoly, oligopoly" },
    ],
  },
  {
    id: "history",
    name: "History",
    icon: "🏛️",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#fde68a",
    description: "South African and world history — causes, events and their impact.",
    topics: [
      { label: "South African History",    detail: "Anglo-Boer War, Great Trek, ANC formation" },
      { label: "World Wars",               detail: "Causes, key events, and consequences of WWI and WWII" },
      { label: "Apartheid & Democracy",    detail: "Rise of apartheid, resistance movements, 1994 elections" },
      { label: "Cold War",                 detail: "USA vs USSR — ideology, proxy wars, the Berlin Wall" },
      { label: "Historical Skills",        detail: "Source analysis, chronology, cause and effect" },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    icon: "🌍",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
    description: "Physical and human geography — maps, climate, environment and people.",
    topics: [
      { label: "Map Work",               detail: "Contour lines, scale, topographic maps, direction" },
      { label: "Atmosphere & Climate",   detail: "Layers of atmosphere, greenhouse effect, biomes" },
      { label: "Geomorphology",          detail: "Weathering, rivers, slopes, coastal processes" },
      { label: "Population",             detail: "Population pyramids, urbanisation, migration" },
      { label: "Development",            detail: "HDI, GINI coefficient, globalisation" },
    ],
  },
  {
    id: "civil-technology",
    name: "Civil Technology",
    icon: "🏗️",
    color: "#b45309",
    bg: "#fef3c7",
    border: "#fcd34d",
    description: "Construction — materials, plans, foundations, structures and safety.",
    topics: [
      { label: "Construction Materials",  detail: "Concrete, mortar, brick, steel rebar, aggregate" },
      { label: "Technical Drawing & Plans",detail: "Floor plans, elevations, sections, scales, symbols" },
      { label: "Foundations",             detail: "Strip, raft, pile foundations — bearing capacity" },
      { label: "Walls & Floors",          detail: "Cavity walls, DPC, screeds, suspended floors" },
      { label: "Roofing",                 detail: "Gable, hip roofs — trusses, IBR sheeting, sarking" },
      { label: "Plumbing & Electrical",   detail: "Drainage, P-traps, DB boards, SANS 10142" },
      { label: "Health & Safety",         detail: "OHSA, PPE, risk assessments, site safety" },
    ],
  },
  {
    id: "electrical-technology",
    name: "Electrical Technology",
    icon: "⚡",
    color: "#ca8a04",
    bg: "#fefce8",
    border: "#fde047",
    description: "Electrical circuits, components, wiring and control systems.",
    topics: [
      { label: "Basic Electricity",    detail: "Ohm's Law, series/parallel circuits, power, energy" },
      { label: "Electrical Components",detail: "Resistors, capacitors, LEDs, diodes, transistors" },
      { label: "AC Theory",            detail: "Frequency, RMS voltage, reactance, power factor, impedance" },
      { label: "Transformers",         detail: "Step-up/step-down, turns ratio, core losses" },
      { label: "Motors & Generators",  detail: "DC motors, AC induction motors, back EMF, slip" },
      { label: "Wiring & Safety",      detail: "SANS 10142, cable sizing, DB boards, isolation" },
      { label: "Electronic Control",   detail: "PLCs, ladder logic, thyristors, VFDs" },
    ],
  },
  {
    id: "mechanical-technology",
    name: "Mechanical Technology",
    icon: "⚙️",
    color: "#475569",
    bg: "#f0f9ff",
    border: "#cbd5e1",
    description: "Machines, materials, drives and manufacturing processes.",
    topics: [
      { label: "Fitting & Machining",      detail: "Vernier callipers, micrometers, lathe, milling, CNC" },
      { label: "Materials & Heat Treatment",detail: "Steel types, hardening, tempering, annealing" },
      { label: "Tools & Fasteners",        detail: "Taps, dies, bolts, nuts, washers, fits and tolerances" },
      { label: "Drives",                   detail: "Belt/pulley, gears, chains, sprockets — speed and torque ratios" },
      { label: "Welding",                  detail: "MIG, TIG, arc, oxy-acetylene — distortion and defects" },
      { label: "Bearings & Lubrication",   detail: "Ball bearings, thrust bearings, grease vs oil" },
      { label: "Hydraulics & Pneumatics",  detail: "Pascal's Law, pumps, cylinders, control valves" },
      { label: "Maintenance",              detail: "Preventive, predictive, condition-based maintenance" },
    ],
  },
];

const CAT_MAP = {
  "Mathematics":           "core",
  "Technical Mathematics": "technical",
  "Mathematical Literacy": "core",
  "Physical Sciences":     "core",
  "Technical Sciences":    "technical",
  "Life Sciences":         "core",
  "Accounting":            "core",
  "English":               "core",
  "Business Studies":      "humanities",
  "Economics":             "humanities",
  "History":               "humanities",
  "Geography":             "humanities",
  "Civil Technology":      "technical",
  "Electrical Technology": "technical",
  "Mechanical Technology": "technical",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Grade10Subjects({ student, onStartQuiz, onBack, onContinue }) {
  const grade = parseInt(student?.grade) || 10;
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const CATEGORIES = { all: "All", core: "Core", technical: "Technical", humanities: "Humanities" };

  const gradeColors = { 10: "#2563eb", 11: "#7c3aed", 12: "#16a34a" };
  const gc = gradeColors[grade] || "#2563eb";

  const visible = SUBJECTS.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || CAT_MAP[s.name] === filter;
    return matchSearch && matchFilter;
  });

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div style={S.page}>
      {/* ── Hero ── */}
      <div style={{ ...S.hero, background: `linear-gradient(135deg, ${gc} 0%, ${gc}bb 100%)` }}>
        {onBack && (
          <button style={S.backBtn} onClick={onBack}>← Back</button>
        )}
        <div style={S.heroRow}>
          <div style={S.heroLeft}>
            <span style={S.gradePill}>Grade {grade}</span>
            <h1 style={S.heroTitle}>Understanding Your Subjects</h1>
            <p style={S.heroSub}>
              Explore what you'll study this year. Tap any subject to reveal its topics, then practice with past paper questions.
            </p>
          </div>
          <div style={S.heroStats}>
            <div style={S.statBox}>
              <span style={S.statNum}>{SUBJECTS.length}</span>
              <span style={S.statLabel}>Subjects</span>
            </div>
            <div style={S.statBox}>
              <span style={S.statNum}>{SUBJECTS.reduce((a, s) => a + s.topics.length, 0)}</span>
              <span style={S.statLabel}>Topics</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={S.toolbar}>
        <div style={S.searchWrap}>
          <span style={{ fontSize: 14, marginRight: 8 }}>🔍</span>
          <input
            style={S.searchInput}
            placeholder="Search subjects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={S.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <div style={S.filterRow}>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              style={{ ...S.chip, ...(filter === key ? { background: gc, borderColor: gc, color: "#fff" } : {}) }}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── List ── */}
      <div style={S.body}>
        {visible.length === 0 && (
          <div style={S.empty}>No subjects match your search.</div>
        )}

        {visible.map((subject) => {
          const open = openId === subject.id;
          return (
            <div
              key={subject.id}
              style={{
                ...S.card,
                borderColor: open ? subject.color : subject.border,
                boxShadow: open ? `0 4px 20px ${subject.color}28` : "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              {/* Header row */}
              <button
                style={{ ...S.cardHeader, background: open ? subject.bg : "#fff" }}
                onClick={() => toggle(subject.id)}
                aria-expanded={open}
              >
                <div style={{ ...S.iconBox, background: `${subject.color}14`, color: subject.color }}>
                  {subject.icon}
                </div>
                <div style={S.headerMid}>
                  <div style={S.nameRow}>
                    <span style={{ ...S.subjectName, color: open ? subject.color : "#1e293b" }}>
                      {subject.name}
                    </span>
                    <span style={{ ...S.catPill, background: `${subject.color}14`, color: subject.color }}>
                      {CAT_MAP[subject.name]}
                    </span>
                  </div>
                  <span style={S.subjectDesc}>{subject.description}</span>
                </div>
                <div style={S.headerRight}>
                  <span style={{ ...S.countLabel, color: subject.color }}>{subject.topics.length} topics</span>
                  <span style={{ ...S.chevron, color: subject.color, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </div>
              </button>

              {/* Expanded panel */}
              {open && (
                <div style={{ ...S.panel, background: subject.bg }}>
                  <div style={S.topicGrid}>
                    {subject.topics.map((t, i) => (
                      <div key={i} style={{ ...S.topicCard, borderColor: `${subject.color}30` }}>
                        <div style={{ ...S.dot, background: subject.color }} />
                        <div>
                          <p style={{ ...S.topicLabel, color: subject.color }}>{t.label}</p>
                          <p style={S.topicDetail}>{t.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {onStartQuiz && (
                    <button
                      style={{ ...S.practiceBtn, background: subject.color }}
                      onClick={() => onStartQuiz(subject.name)}
                    >
                      📝 Practice {subject.name} Questions →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Global CTA for profile flow ── */}
      {onContinue && (
        <div style={{ maxWidth: 780, margin: "24px auto 0", padding: "0 16px" }}>
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "20px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 6px" }}>
              Ready to discover your best stream?
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.6 }}>
              Now that you've seen what each subject involves, fill in your profile and take the quiz to get your personalised recommendation.
            </p>
            <button
              onClick={onContinue}
              style={{ padding: "14px 40px", background: "linear-gradient(135deg,#6366f1,#2563eb)", color: "#fff", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: "pointer" }}
            >
              Fill in my profile & take the quiz →
            </button>
          </div>
        </div>
      )}

      <p style={S.tip}>
        💡 Tap a subject to see what you will learn — then hit <b>Practice Questions</b> to quiz yourself!
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  page:        { fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#e0f2fe", minHeight: "100vh", paddingBottom: 48 },
  hero:        { padding: "20px 20px 28px" },
  backBtn:     { background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", marginBottom: 16, display: "block" },
  heroRow:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" },
  heroLeft:    { flex: 1, minWidth: 200 },
  gradePill:   { display: "inline-block", background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 99, padding: "3px 14px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 },
  heroTitle:   { fontSize: 23, fontWeight: 900, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 },
  heroSub:     { fontSize: 13, color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.6 },
  heroStats:   { display: "flex", gap: 12, alignSelf: "center" },
  statBox:     { background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "10px 18px", textAlign: "center", display: "flex", flexDirection: "column", gap: 2 },
  statNum:     { fontSize: 22, fontWeight: 900, color: "#fff" },
  statLabel:   { fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 },
  toolbar:     { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 16px", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  searchWrap:  { display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: 10, padding: "0 12px", marginBottom: 10, border: "1px solid #e2e8f0" },
  searchInput: { flex: 1, border: "none", background: "transparent", padding: "10px 0", fontSize: 14, color: "#1e293b", outline: "none" },
  clearBtn:    { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, padding: "0 4px" },
  filterRow:   { display: "flex", gap: 8, flexWrap: "wrap" },
  chip:        { border: "1.5px solid #e2e8f0", background: "#e0f2fe", borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#475569", transition: "all 0.15s" },
  body:        { padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10, maxWidth: 780, margin: "0 auto" },
  empty:       { textAlign: "center", color: "#94a3b8", padding: "40px 0", fontSize: 14 },
  card:        { border: "1.5px solid", borderRadius: 14, overflow: "hidden", transition: "all 0.2s ease" },
  cardHeader:  { width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s" },
  iconBox:     { width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
  headerMid:   { flex: 1, display: "flex", flexDirection: "column", gap: 3, minWidth: 0 },
  nameRow:     { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  subjectName: { fontSize: 15, fontWeight: 800, letterSpacing: "-0.2px", transition: "color 0.15s" },
  catPill:     { borderRadius: 99, padding: "1px 8px", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
  subjectDesc: { fontSize: 12, color: "#64748b", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  headerRight: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  countLabel:  { fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
  chevron:     { fontSize: 20, transition: "transform 0.22s ease", display: "inline-block" },
  panel:       { padding: "4px 16px 16px", borderTop: "1px solid rgba(0,0,0,0.06)" },
  topicGrid:   { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 8, paddingTop: 12, paddingBottom: 14 },
  topicCard:   { background: "#fff", border: "1px solid", borderRadius: 10, padding: "10px 12px", display: "flex", gap: 10, alignItems: "flex-start" },
  dot:         { width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5 },
  topicLabel:  { fontSize: 13, fontWeight: 700, margin: "0 0 3px" },
  topicDetail: { fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.4 },
  practiceBtn: { width: "100%", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer", textAlign: "center" },
  tip:         { textAlign: "center", fontSize: 13, color: "#94a3b8", padding: "20px 20px 0", maxWidth: 780, margin: "0 auto" },
};
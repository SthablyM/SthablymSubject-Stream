// src/components/StudentProfile.js
import React, { useState } from "react";
import StablymLogo from "./StablymLogoComponent";

// ─── APS CONVERSION ───────────────────────────────────────────────────────────
const markToAPS = (mark) => {
  if (mark >= 80) return 7;
  if (mark >= 70) return 6;
  if (mark >= 60) return 5;
  if (mark >= 50) return 4;
  if (mark >= 40) return 3;
  if (mark >= 30) return 2;
  return 1;
};

const symbolLabel = (mark) => {
  if (mark >= 80) return "A";
  if (mark >= 70) return "B";
  if (mark >= 60) return "C";
  if (mark >= 50) return "D";
  if (mark >= 40) return "E";
  if (mark >= 30) return "F";
  return "G";
};

// ─── ALL NSC SUBJECTS GROUPED BY STREAM ──────────────────────────────────────
// Each subject has: id, label, stream tag, Lo (Life Orientation = capped at 4 APS)
const SUBJECT_GROUPS = [
  {
    group: "📋 Compulsory for All",
    color: "#1e293b",
    subjects: [
      { id: "english",   label: "English Home Language / First Additional Language", required: true,  lo: false },
      { id: "lifeorien", label: "Life Orientation",                                   required: true,  lo: true  },
    ]
  },
  {
    group: "📐 Mathematics (choose ONE)",
    color: "#2563eb",
    note: "You can only do ONE of these. Select N/A for the ones you don't take.",
    subjects: [
      { id: "puremaths",  label: "Pure Mathematics",          required: false, lo: false, stream: "Science / Commerce" },
      { id: "techmaths",  label: "Technical Mathematics",     required: false, lo: false, stream: "Engineering / Technical" },
      { id: "mathslit",   label: "Mathematical Literacy",     required: false, lo: false, stream: "Humanities" },
    ]
  },
  {
    group: "🔬 Science Stream Subjects",
    color: "#2563eb",
    subjects: [
      { id: "physscience", label: "Physical Sciences",              required: false, lo: false, stream: "Science" },
      { id: "lifescience", label: "Life Sciences (Biology)",        required: false, lo: false, stream: "Science" },
      { id: "geography",   label: "Geography",                      required: false, lo: false, stream: "Science / Humanities" },
      { id: "agroscience", label: "Agricultural Sciences",          required: false, lo: false, stream: "Science" },
    ]
  },
  {
    group: "📊 Commerce Stream Subjects",
    color: "#16a34a",
    subjects: [
      { id: "accounting",  label: "Accounting",                     required: false, lo: false, stream: "Commerce" },
      { id: "business",    label: "Business Studies",               required: false, lo: false, stream: "Commerce" },
      { id: "economics",   label: "Economics",                      required: false, lo: false, stream: "Commerce" },
    ]
  },
  {
    group: "🎭 Humanities Stream Subjects",
    color: "#9333ea",
    subjects: [
      { id: "history",     label: "History",                        required: false, lo: false, stream: "Humanities" },
      { id: "tourism",     label: "Tourism",                        required: false, lo: false, stream: "Humanities" },
      { id: "consumer",    label: "Consumer Studies",               required: false, lo: false, stream: "Humanities" },
      { id: "xhosa",       label: "isiXhosa / Zulu / Sotho (2nd Language)", required: false, lo: false, stream: "Humanities" },
      { id: "religion",    label: "Religion Studies",               required: false, lo: false, stream: "Humanities" },
      { id: "drama",       label: "Dramatic Arts",                  required: false, lo: false, stream: "Humanities" },
      { id: "visualarts",  label: "Visual Arts",                    required: false, lo: false, stream: "Humanities" },
    ]
  },
  {
    group: "⚙️ Engineering / Technical Stream Subjects",
    color: "#ea580c",
    subjects: [
      { id: "techscience",  label: "Technical Sciences",                     required: false, lo: false, stream: "Engineering" },
      { id: "civiltech",    label: "Civil Technology",                       required: false, lo: false, stream: "Engineering" },
      { id: "electricaltech",label: "Electrical Technology",                 required: false, lo: false, stream: "Engineering" },
      { id: "mechanicaltech",label: "Mechanical Technology",                 required: false, lo: false, stream: "Engineering" },
      { id: "egd",          label: "Engineering Graphics and Design (EGD)",  required: false, lo: false, stream: "Engineering" },
      { id: "itcs",         label: "Information Technology (IT) / Computer Applications Technology (CAT)", required: false, lo: false, stream: "Engineering" },
    ]
  },
];

// Flat list for APS calc
const ALL_SUBJECTS = SUBJECT_GROUPS.flatMap(g => g.subjects);

// APS career guide
const APS_GUIDE = [
  { career: "Medicine (MBChB)",          aps: 36, university: "UCT, Wits, UP, SMU"          },
  { career: "Dentistry (BChD)",          aps: 35, university: "Wits, UP, UWC"               },
  { career: "Engineering (BSc Eng)",     aps: 32, university: "Wits, UCT, UP, UJ, TUT"      },
  { career: "Pharmacy (BPharm)",         aps: 32, university: "UP, UKZN, NWU, UWC"          },
  { career: "Law (LLB)",                 aps: 30, university: "UCT, Wits, UP, UWC"          },
  { career: "Accounting (BCom CA)",      aps: 28, university: "Wits, UCT, UP, UJ, UNISA"    },
  { career: "IT / Computer Science",     aps: 28, university: "Wits, UCT, UNISA, CPUT"      },
  { career: "Architecture (BArch)",      aps: 28, university: "Wits, UCT, UKZN, TUT"        },
  { career: "Journalism / Media (BA)",   aps: 26, university: "Rhodes, UJ, Wits, CPUT"      },
  { career: "Teaching (BEd)",            aps: 24, university: "UNISA, UJ, UKZN, NWU"        },
  { career: "Social Work (BSW)",         aps: 22, university: "UNISA, UWC, UKZN"            },
  { career: "N-Diploma (TVET College)",  aps: 18, university: "Any TVET College"             },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function StudentProfile({ onComplete }) {
  const [form, setForm] = useState({ name: "", surname: "", school: "", grade: "9", province: "" });

  // marks: { subjectId: number | "na" }
  // "na" means student doesn't take this subject
  const [marks,  setMarks]  = useState({});
  const [errors, setErrors] = useState({});
  const [showAPS, setShowAPS] = useState(false);
  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(SUBJECT_GROUPS.map(g => [g.group, true]))
  );

  const provinces = ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"];

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const setMark = (id, val) => setMarks(m => ({ ...m, [id]: val }));

  const toggleNA = (id) => {
    setMarks(m => {
      const current = m[id];
      if (current === "na") {
        // Un-mark N/A → go back to empty
        const next = { ...m };
        delete next[id];
        return next;
      }
      return { ...m, [id]: "na" };
    });
  };

  const updateMark = (id, val) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setMarks(m => ({ ...m, [id]: num }));
  };

  const toggleGroup = (group) => setOpenGroups(o => ({ ...o, [group]: !o[group] }));

  // ── APS Calculator ─────────────────────────────────────────────────────────
  // Rules: Best 6 subjects (excluding LO) + LO capped at APS 4
  const calcAPS = () => {
    const loMark = marks["lifeorien"];
    const loAPS  = (loMark && loMark !== "na" && loMark > 0) ? Math.min(markToAPS(loMark), 4) : 0;

    const scorable = ALL_SUBJECTS
      .filter(s => !s.lo && s.id !== "lifeorien")
      .filter(s => marks[s.id] && marks[s.id] !== "na" && marks[s.id] > 0)
      .map(s => ({ id: s.id, aps: markToAPS(marks[s.id]) }));

    scorable.sort((a, b) => b.aps - a.aps);
    const top6total = scorable.slice(0, 6).reduce((sum, x) => sum + x.aps, 0);
    return top6total + loAPS;
  };

  const aps = calcAPS();

  // Detect which maths the student is doing
  const mathsLevel = () => {
    if (marks["puremaths"] && marks["puremaths"] !== "na") return "Pure Mathematics";
    if (marks["techmaths"] && marks["techmaths"] !== "na") return "Technical Mathematics";
    if (marks["mathslit"]  && marks["mathslit"]  !== "na") return "Mathematical Literacy";
    return "Not specified";
  };

  // ── Validate ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name     = "First name is required";
    if (!form.surname.trim()) e.surname  = "Surname is required";
    if (!form.school.trim())  e.school   = "School name is required";
    if (!form.province)       e.province = "Please select a province";
    if (!marks["english"] || marks["english"] === "na")
      e.english = "English mark is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // Strip "na" values — pass only real marks to quiz
    const cleanMarks = {};
    Object.entries(marks).forEach(([k, v]) => { if (v !== "na" && v > 0) cleanMarks[k] = v; });
    onComplete({ ...form, marks: cleanMarks, aps, mathsLevel: mathsLevel() });
  };

  // ── Render a single subject row ────────────────────────────────────────────
  const SubjectRow = ({ sub, groupColor }) => {
    const val   = marks[sub.id];
    const isNA  = val === "na";
    const numVal = (!isNA && val > 0) ? val : null;
    const apsVal = numVal ? markToAPS(numVal) : null;
    const apsColor = apsVal >= 5 ? { bg:"#d1fae5", fg:"#065f46" }
                   : apsVal >= 3 ? { bg:"#fef9c3", fg:"#713f12" }
                   : apsVal      ? { bg:"#fee2e2", fg:"#991b1b" }
                   : null;

    return (
      <div style={{ ...s.subjectRow, opacity: isNA ? 0.45 : 1 }}>
        {/* Stream colour dot */}
        <div style={{ ...s.streamDot, background: groupColor }} />

        {/* Label */}
        <div style={s.subjectLabel}>
          <span style={{ fontSize: 13, fontWeight: sub.required ? 700 : 500, color: "#1e293b" }}>
            {sub.label}
          </span>
          {sub.required && <span style={{ color:"#dc2626", fontSize:11 }}> *required</span>}
          {sub.stream && <span style={s.streamTag}>{sub.stream}</span>}
        </div>

        {/* Input area */}
        <div style={s.subjectInputArea}>
          {!isNA && (
            <>
              <input
                style={{ ...s.markInput, borderColor: errors[sub.id] ? "#fca5a5" : "#e2e8f0" }}
                type="number" min="0" max="100"
                value={numVal || ""}
                onChange={e => updateMark(sub.id, e.target.value)}
                placeholder="%"
              />
              {apsVal && (
                <div style={{ ...s.apsPill, background: apsColor.bg, color: apsColor.fg }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{symbolLabel(numVal)}</span>
                  <span style={{ fontSize: 10 }}> · APS {apsVal}</span>
                </div>
              )}
            </>
          )}

          {/* N/A toggle */}
          {!sub.required && (
            <button
              style={{ ...s.naBtn, ...(isNA ? s.naBtnActive : {}) }}
              onClick={() => toggleNA(sub.id)}
              title={isNA ? "Click to enter mark" : "Click if you don't take this subject"}
            >
              {isNA ? "✓ N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={s.wrap}>
      <div style={s.topBar} />
      <div style={s.card}>

        {/* Header */}
        <div style={s.cardHeader}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <StablymLogo variant="dark" size="md" />
          </div>
          <h2 style={s.cardTitle}>Student Profile</h2>
          <p style={s.cardSub}>Fill in your details and current marks to personalise your stream recommendation</p>
        </div>

        {/* ── Personal Details ── */}
        <div style={s.section}>
          <h3 style={s.sectionLabel}>📋 Personal Details</h3>
          <div style={s.row2}>
            <Field label="First Name *" error={errors.name}>
              <input style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
                value={form.name} onChange={e => update("name", e.target.value)} placeholder="e.g. Thabo" />
            </Field>
            <Field label="Surname *" error={errors.surname}>
              <input style={{ ...s.input, ...(errors.surname ? s.inputErr : {}) }}
                value={form.surname} onChange={e => update("surname", e.target.value)} placeholder="e.g. Nkosi" />
            </Field>
          </div>
          <div style={s.row2}>
            <Field label="School Name *" error={errors.school}>
              <input style={{ ...s.input, ...(errors.school ? s.inputErr : {}) }}
                value={form.school} onChange={e => update("school", e.target.value)} placeholder="e.g. Soweto High School" />
            </Field>
            <Field label="Current Grade">
              <select style={s.input} value={form.grade} onChange={e => update("grade", e.target.value)}>
                {["8","9","10","11","12"].map(g => <option key={g}>{g}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Province *" error={errors.province}>
            <select style={{ ...s.input, ...(errors.province ? s.inputErr : {}) }}
              value={form.province} onChange={e => update("province", e.target.value)}>
              <option value="">Select your province...</option>
              {provinces.map(p => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {/* ── Subject Marks ── */}
        <div style={s.section}>
          <h3 style={s.sectionLabel}>📝 Subject Marks</h3>
          <div style={s.hintBox}>
            <span style={{ fontSize: 16 }}>💡</span>
            <div>
              <b>How to fill this in:</b> Enter your latest mark (0–100) for subjects you take.
              Click <b>N/A</b> for subjects you don't take. APS and symbol are calculated automatically.
            </div>
          </div>

          {SUBJECT_GROUPS.map(group => (
            <div key={group.group} style={s.groupWrap}>
              {/* Group header — collapsible */}
              <button style={{ ...s.groupHeader, borderLeft: `4px solid ${group.color}` }}
                onClick={() => toggleGroup(group.group)}>
                <span style={{ fontWeight: 700, color: group.color }}>{group.group}</span>
                {group.note && <span style={s.groupNote}>{group.note}</span>}
                <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 18 }}>
                  {openGroups[group.group] ? "▲" : "▼"}
                </span>
              </button>

              {openGroups[group.group] && (
                <div style={s.groupBody}>
                  {group.subjects.map(sub => (
                    <SubjectRow key={sub.id} sub={sub} groupColor={group.color} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── APS Summary ── */}
        {aps > 0 && (
          <div style={s.apsBox}>
            <div>
              <p style={s.apsLabel}>Your Estimated APS Score</p>
              <div style={s.apsScore}>
                {aps}
                <span style={s.apsMax}> / 42</span>
              </div>
              <p style={s.apsNote}>
                Best 6 subjects + Life Orientation (capped at 4) · Maths: {mathsLevel()}
              </p>
            </div>

            {/* Mini APS bar */}
            <div style={s.apsBarWrap}>
              <div style={s.apsBarTrack}>
                <div style={{ ...s.apsBarFill,
                  width: `${Math.min(100,(aps/42)*100)}%`,
                  background: aps >= 30 ? "#16a34a" : aps >= 22 ? "#d97706" : "#dc2626"
                }} />
              </div>
              <p style={{ fontSize: 12, color: "#64748b", margin: "4px 0 0" }}>
                {aps >= 30 ? "🟢 Strong — most universities open to you"
                 : aps >= 22 ? "🟡 Good — many programmes available"
                 : "🔴 Needs improvement — focus on key subjects"}
              </p>
            </div>

            <button style={s.apsGuideBtn} onClick={() => setShowAPS(v => !v)}>
              {showAPS ? "Hide Guide ▲" : "Career APS Guide ▼"}
            </button>
          </div>
        )}

        {/* APS Career Guide */}
        {showAPS && (
          <div style={s.apsGuide}>
            <h4 style={{ margin: "0 0 12px", color: "#1e293b", fontSize: 14 }}>
              📊 APS Requirements for Popular SA Careers
            </h4>
            {APS_GUIDE.map((row, i) => {
              const reachable = aps >= row.aps;
              return (
                <div key={i} style={{ ...s.apsRow, background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                  <span style={s.apsCareer}>{row.career}</span>
                  <span style={{
                    ...s.apsBadge,
                    background: reachable ? "#d1fae5" : "#fee2e2",
                    color: reachable ? "#065f46" : "#991b1b"
                  }}>
                    {reachable ? "✓" : "✗"} APS {row.aps}+
                  </span>
                  <span style={s.apsUni}>{row.university}</span>
                </div>
              );
            })}
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
              ✓ Green = within reach with your current APS · ✗ Red = needs improvement
            </p>
          </div>
        )}

        {/* ── Submit ── */}
        {errors.english && (
          <p style={{ color:"#dc2626", fontSize:13, textAlign:"center", margin:"8px 40px 0" }}>
            ⚠️ {errors.english}
          </p>
        )}
        <button style={s.submitBtn} onClick={handleSubmit}>
          Continue to Quiz →
        </button>
      </div>
    </div>
  );
}

// Small helper wrapper
function Field({ label, error, children }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:16 }}>
      <label style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize:12, color:"#dc2626" }}>{error}</span>}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  wrap:           { minHeight:"100vh", background:"#f0f4ff", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"40px 16px 60px", fontFamily:"'Segoe UI',sans-serif" },
  topBar:         { position:"fixed", top:0, left:0, right:0, height:5, background:"linear-gradient(90deg,#6366f1,#2563eb,#0ea5e9)", zIndex:100 },
  card:           { background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,.10)", maxWidth:740, width:"100%", overflow:"hidden" },
  cardHeader:     { background:"linear-gradient(135deg,#1e293b,#334155)", padding:"32px 40px", textAlign:"center" },
  cardTitle:      { fontSize:26, fontWeight:800, color:"#fff", margin:0 },
  cardSub:        { color:"rgba(255,255,255,.65)", fontSize:14, marginTop:6 },
  section:        { padding:"24px 32px", borderBottom:"1px solid #f1f5f9" },
  sectionLabel:   { fontSize:15, fontWeight:700, color:"#1e293b", margin:"0 0 16px" },
  row2:           { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  input:          { padding:"11px 14px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:14, outline:"none", background:"#f8fafc", color:"#1e293b", width:"100%", boxSizing:"border-box" },
  inputErr:       { borderColor:"#fca5a5", background:"#fff5f5" },
  hintBox:        { display:"flex", gap:10, background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"12px 14px", marginBottom:20, fontSize:13, color:"#713f12", lineHeight:1.6 },
  groupWrap:      { marginBottom:12 },
  groupHeader:    { width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#f8fafc", border:"none", borderRadius:10, cursor:"pointer", textAlign:"left", flexWrap:"wrap" },
  groupNote:      { fontSize:11, color:"#6b7280", fontStyle:"italic" },
  groupBody:      { padding:"4px 0 4px 10px" },
  subjectRow:     { display:"flex", alignItems:"center", gap:10, padding:"9px 8px", borderBottom:"1px solid #f1f5f9", transition:"opacity .2s" },
  streamDot:      { width:8, height:8, borderRadius:"50%", flexShrink:0 },
  subjectLabel:   { flex:1, display:"flex", flexWrap:"wrap", alignItems:"center", gap:6 },
  streamTag:      { fontSize:10, background:"#f1f5f9", color:"#6b7280", borderRadius:99, padding:"1px 7px", fontWeight:600 },
  subjectInputArea:{ display:"flex", alignItems:"center", gap:8, flexShrink:0 },
  markInput:      { width:70, padding:"7px 10px", border:"2px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none", textAlign:"center" },
  apsPill:        { borderRadius:8, padding:"3px 8px", fontSize:12, fontWeight:700, whiteSpace:"nowrap" },
  naBtn:          { padding:"5px 10px", border:"2px solid #e2e8f0", borderRadius:8, background:"#f8fafc", fontSize:11, fontWeight:700, color:"#6b7280", cursor:"pointer", whiteSpace:"nowrap" },
  naBtnActive:    { background:"#f1f5f9", borderColor:"#94a3b8", color:"#374151" },
  apsBox:         { margin:"24px 32px 0", padding:"20px 24px", background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", borderRadius:16, border:"1px solid #bfdbfe", display:"flex", flexWrap:"wrap", gap:16, alignItems:"flex-start" },
  apsLabel:       { fontSize:13, color:"#1e40af", fontWeight:600, margin:0 },
  apsScore:       { fontSize:44, fontWeight:900, color:"#1e293b", lineHeight:1.1, margin:"4px 0" },
  apsMax:         { fontSize:20, color:"#94a3b8", fontWeight:400 },
  apsNote:        { fontSize:11, color:"#64748b", margin:0 },
  apsBarWrap:     { flex:1, minWidth:160 },
  apsBarTrack:    { height:10, background:"#e2e8f0", borderRadius:99, overflow:"hidden" },
  apsBarFill:     { height:"100%", borderRadius:99, transition:"width .5s ease" },
  apsGuideBtn:    { padding:"10px 18px", background:"#2563eb", color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", alignSelf:"flex-start" },
  apsGuide:       { margin:"0 32px 24px", padding:"16px 20px", background:"#f8fafc", borderRadius:14, border:"1px solid #e2e8f0" },
  apsRow:         { display:"flex", alignItems:"center", gap:10, padding:"8px 10px", flexWrap:"wrap" },
  apsCareer:      { flex:1, fontSize:13, fontWeight:600, color:"#1e293b", minWidth:140 },
  apsBadge:       { borderRadius:99, padding:"2px 10px", fontSize:12, fontWeight:700, flexShrink:0 },
  apsUni:         { fontSize:11, color:"#6b7280", flexShrink:0 },
  submitBtn:      { display:"block", width:"calc(100% - 64px)", margin:"20px 32px 32px", padding:"16px", background:"linear-gradient(135deg,#6366f1,#2563eb)", color:"#fff", border:"none", borderRadius:14, fontSize:16, fontWeight:800, cursor:"pointer" },
};
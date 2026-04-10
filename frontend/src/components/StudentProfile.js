// src/components/StudentProfile.js
import React, { useState } from "react";
import StablymLogo from "./StablymLogoComponent";
import SubjectPreview from "./SubjectPreview";

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
const SUBJECT_GROUPS = [
  {
    group: "📋 Compulsory for All",
    color: "#1e293b",
    subjects: [
      { id: "english",   label: "English Home Language / First Additional Language", required: true,  lo: false },
      { id: "lifeorien", label: "Life Orientation",                                   required: true,  lo: true  },
      { id: "xhosa",     label: "isiXhosa / Zulu / Sepedi (2nd Language)",           required: false, lo: false },
    ],
  },
  {
    group: "📐 Mathematics (choose ONE)",
    color: "#2563eb",
    note: "You can only do ONE of these. Select N/A for the ones you don't take.",
    subjects: [
      { id: "puremaths", label: "Pure Mathematics",      required: false, lo: false, stream: "Science / Commerce",   mathsGroup: true },
      { id: "techmaths", label: "Technical Mathematics", required: false, lo: false, stream: "Engineering / Technical", mathsGroup: true },
      { id: "mathslit",  label: "Mathematical Literacy", required: false, lo: false, stream: "Humanities",            mathsGroup: true },
    ],
  },
  {
    group: "🔬 Science Stream Subjects",
    color: "#2563eb",
    subjects: [
      { id: "physscience", label: "Physical Sciences",        required: false, lo: false, stream: "Science" },
      { id: "lifescience", label: "Life Sciences (Biology)",  required: false, lo: false, stream: "Science" },
      { id: "geography",   label: "Geography",               required: false, lo: false, stream: "Science / Humanities" },
      { id: "agroscience", label: "Agricultural Sciences",   required: false, lo: false, stream: "Science" },
    ],
  },
  {
    group: "📊 Commerce Stream Subjects",
    color: "#16a34a",
    subjects: [
      { id: "accounting", label: "Accounting",        required: false, lo: false, stream: "Commerce" },
      { id: "business",   label: "Business Studies",  required: false, lo: false, stream: "Commerce" },
      { id: "economics",  label: "Economics",         required: false, lo: false, stream: "Commerce" },
    ],
  },
  {
    group: "🎭 Humanities Stream Subjects",
    color: "#9333ea",
    subjects: [
      { id: "history",    label: "History",                              required: false, lo: false, stream: "Humanities" },
      { id: "tourism",    label: "Tourism",                             required: false, lo: false, stream: "Humanities" },
      { id: "consumer",   label: "Consumer Studies",                    required: false, lo: false, stream: "Humanities" },
      { id: "religion",   label: "Religion Studies",                    required: false, lo: false, stream: "Humanities" },
      { id: "drama",      label: "Dramatic Arts",                       required: false, lo: false, stream: "Humanities" },
      { id: "visualarts", label: "Visual Arts",                         required: false, lo: false, stream: "Humanities" },
    ],
  },
  {
    group: "⚙️ Engineering / Technical Stream Subjects",
    color: "#ea580c",
    subjects: [
      { id: "techscience",    label: "Technical Sciences",                                    required: false, lo: false, stream: "Engineering" },
      { id: "civiltech",      label: "Civil Technology",                                      required: false, lo: false, stream: "Engineering" },
      { id: "electricaltech", label: "Electrical Technology",                                 required: false, lo: false, stream: "Engineering" },
      { id: "mechanicaltech", label: "Mechanical Technology",                                 required: false, lo: false, stream: "Engineering" },
      { id: "egd",            label: "Engineering Graphics and Design (EGD)",                 required: false, lo: false, stream: "Engineering" },
      { id: "itcs",           label: "Information Technology (IT) / Computer Applications Technology (CAT)", required: false, lo: false, stream: "Engineering" },
    ],
  },
];

const ALL_SUBJECTS = SUBJECT_GROUPS.flatMap((g) => g.subjects);

const APS_GUIDE = [
  { career: "Medicine (MBChB)",        aps: 36, university: "UCT, Wits, UP, SMU"       },
  { career: "Dentistry (BChD)",        aps: 35, university: "Wits, UP, UWC"            },
  { career: "Engineering (BSc Eng)",   aps: 32, university: "Wits, UCT, UP, UJ, TUT"  },
  { career: "Pharmacy (BPharm)",       aps: 32, university: "UP, UKZN, NWU, UWC"      },
  { career: "Law (LLB)",               aps: 30, university: "UCT, Wits, UP, UWC"      },
  { career: "Accounting (BCom CA)",    aps: 28, university: "Wits, UCT, UP, UJ, UNISA"},
  { career: "IT / Computer Science",   aps: 28, university: "Wits, UCT, UNISA, CPUT"  },
  { career: "Architecture (BArch)",    aps: 28, university: "Wits, UCT, UKZN, TUT"    },
  { career: "Journalism / Media (BA)", aps: 26, university: "Rhodes, UJ, Wits, CPUT"  },
  { career: "Teaching (BEd)",          aps: 24, university: "UNISA, UJ, UKZN, NWU"    },
  { career: "Social Work (BSW)",       aps: 22, university: "UNISA, UWC, UKZN"        },
  { career: "N-Diploma (TVET College)",aps: 18, university: "Any TVET College"         },
];

// ─── STEP CONSTANTS ───────────────────────────────────────────────────────────
const STEP_GRADE   = "grade";
const STEP_PREVIEW = "preview";   // Grade 9 & 10 only — subject stream explorer
const STEP_FORM    = "form";      // Full profile + marks form

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function StudentProfile({ onComplete }) {
  const [step, setStep]   = useState(STEP_GRADE);
  const [form, setForm]   = useState({ name: "", surname: "", school: "", grade: "", province: "" });
  const [marks, setMarks] = useState({ puremaths: "na", techmaths: "na", mathslit: "na" });
  const [errors, setErrors]     = useState({});
  const [openGroups, setOpenGroups] = useState(
    Object.fromEntries(SUBJECT_GROUPS.map((g) => [g.group, true]))
  );

  const provinces = ["Gauteng","Western Cape","KwaZulu-Natal","Eastern Cape","Limpopo","Mpumalanga","North West","Free State","Northern Cape"];

  const update     = (field, val) => setForm((f) => ({ ...f, [field]: val }));
  const gradeNum   = parseInt(form.grade) || 0;
  const showPreview = gradeNum === 9 || gradeNum === 10;

  // ── Mark helpers ─────────────────────────────────────────────────────────
  const updateMark = (id, val) => {
    if (val === "" || val === null || val === undefined) {
      setMarks((m) => { const n = { ...m }; delete n[id]; return n; });
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setMarks((m) => ({ ...m, [id]: Math.min(100, Math.max(0, num)) }));
    }
  };

  const toggleNA = (id) => {
    setMarks((m) => {
      const next = { ...m };
      if (next[id] === "na") delete next[id];
      else next[id] = "na";
      return next;
    });
  };

  const toggleGroup = (group) => setOpenGroups((o) => ({ ...o, [group]: !o[group] }));

  const selectMaths = (id) => {
    setMarks((m) => {
      const next = { ...m };
      ["puremaths", "techmaths", "mathslit"].forEach((mid) => {
        if (mid === id) delete next[mid];
        else next[mid] = "na";
      });
      return next;
    });
  };

  // ── APS ──────────────────────────────────────────────────────────────────
  const calcAPS = () => {
    const scorable = ALL_SUBJECTS
      .filter((s) => s.id !== "lifeorien")
      .filter((s) => typeof marks[s.id] === "number" && marks[s.id] > 0)
      .map((s) => ({ id: s.id, aps: markToAPS(marks[s.id]) }));
    scorable.sort((a, b) => b.aps - a.aps);
    return scorable.slice(0, 6).reduce((sum, x) => sum + x.aps, 0);
  };

  const aps = calcAPS();

  const mathsLevel = () => {
    if (typeof marks["puremaths"] === "number") return "Pure Mathematics";
    if (typeof marks["techmaths"] === "number") return "Technical Mathematics";
    if (typeof marks["mathslit"]  === "number") return "Mathematical Literacy";
    return "Not specified";
  };

  const apsColorHex = (a) =>
    a >= 6 ? "#16a34a" : a >= 5 ? "#22c55e" : a >= 4 ? "#d97706" : a >= 3 ? "#f97316" : a >= 2 ? "#dc2626" : "#94a3b8";

  // ── Grade confirm → decide next step ─────────────────────────────────────
  const handleGradeConfirm = () => {
    if (!form.grade) return;
    if (showPreview) {
      setStep(STEP_PREVIEW);
    } else {
      setStep(STEP_FORM);
    }
  };

  // ── Final submit ─────────────────────────────────────────────────────────
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
    const cleanMarks = {};
    Object.entries(marks).forEach(([k, v]) => { if (typeof v === "number" && v > 0) cleanMarks[k] = v; });
    onComplete({
      ...form,
      marks: cleanMarks,
      aps,
      mathsLevel: mathsLevel(),
      skipQuiz: gradeNum >= 10,
    });
  };

  // ── Subject row ───────────────────────────────────────────────────────────
  const SubjectRow = ({ sub, groupColor }) => {
    const val    = marks[sub.id];
    const isNA   = val === "na";
    const numVal = typeof val === "number" && val >= 0 ? val : null;
    const apsVal = numVal !== null && !sub.lo ? markToAPS(numVal) : null;
    const sym    = numVal !== null ? symbolLabel(numVal) : null;
    const ac     = apsVal ? apsColorHex(apsVal) : "#e2e8f0";

    return (
      <div style={{
        display: "flex", alignItems: "center", padding: "10px 14px",
        borderBottom: "1px solid #f1f5f9",
        background: isNA ? "#fafafa" : "#fff",
        opacity: isNA ? 0.55 : 1,
        transition: "opacity .2s",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isNA ? "#d1d5db" : groupColor, flexShrink: 0, marginRight: 10 }} />
        <div style={{ flex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: sub.required ? 700 : 500, color: "#1e293b" }}>{sub.label}</span>
          {sub.required    && <span style={{ fontSize: 9,  color: "#dc2626", fontWeight: 800 }}>★ required</span>}
          {sub.lo          && <span style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>not counted in APS</span>}
          {sub.mathsGroup  && <span style={{ fontSize: 10, background: "#ede9fe", color: "#6d28d9", padding: "1px 7px", borderRadius: 99, fontWeight: 700 }}>choose 1</span>}
          {sub.stream && !sub.mathsGroup && <span style={{ fontSize: 10, background: "#f1f5f9", color: "#6b7280", borderRadius: 99, padding: "1px 7px", fontWeight: 600 }}>{sub.stream}</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {!isNA && (
            <input
              type="number" min="0" max="100" placeholder="%"
              value={numVal ?? ""}
              onChange={(e) => updateMark(sub.id, e.target.value)}
              style={{
                width: 68, padding: "7px 8px",
                border: `2px solid ${numVal !== null ? ac : "#e2e8f0"}`,
                borderRadius: 8, fontSize: 14, textAlign: "center", outline: "none",
                fontWeight: 700, background: "#f0f9ff", color: "#1e293b",
                transition: "border-color .2s",
              }}
            />
          )}
          {apsVal !== null && numVal !== null && (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: ac + "18", border: `1.5px solid ${ac}`, borderRadius: 8,
              padding: "4px 10px", minWidth: 76,
            }}>
              <span style={{ fontSize: 15, fontWeight: 900, color: ac }}>{sym}</span>
              <span style={{ fontSize: 11, color: ac, fontWeight: 700 }}>APS {apsVal}</span>
            </div>
          )}
          {sub.lo && numVal !== null && (
            <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 76, textAlign: "center" }}>LO ✓</span>
          )}
          {sub.mathsGroup && (
            <button
              onClick={() => isNA && selectMaths(sub.id)}
              style={{
                padding: "5px 12px", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: isNA ? "pointer" : "default",
                ...(isNA
                  ? { background: "#eff6ff", color: "#2563eb", border: "1.5px solid #93c5fd" }
                  : { background: "#d1fae5", color: "#065f46", border: "1.5px solid #6ee7b7" }),
              }}
            >
              {isNA ? "Select" : "✓ Chosen"}
            </button>
          )}
          {!sub.required && !sub.mathsGroup && (
            <button
              onClick={() => toggleNA(sub.id)}
              style={{
                padding: "5px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                ...(isNA
                  ? { background: "#f1f5f9", color: "#374151", border: "1.5px solid #94a3b8" }
                  : { background: "#f0f9ff", color: "#6b7280", border: "1.5px solid #e2e8f0" }),
              }}
            >
              {isNA ? "✓ N/A" : "N/A"}
            </button>
          )}
        </div>
      </div>
    );
  };

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 1 — GRADE SELECTION
  // ════════════════════════════════════════════════════════════════════════════
  if (step === STEP_GRADE) {
    return (
      <div style={s.wrap}>
        <div style={s.topBar} />
        <div style={{ ...s.card, maxWidth: 520 }}>
          <div style={s.cardHeader}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <StablymLogo variant="dark" size="md" />
            </div>
            <h2 style={s.cardTitle}>Welcome to Stablym</h2>
            <p style={s.cardSub}>South Africa's free subject stream & university guide</p>
          </div>

          <div style={{ padding: "32px 32px 40px" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>
              What grade are you currently in?
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20, lineHeight: 1.6 }}>
              This helps us show you the right tools and advice for your stage of schooling.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              {["8", "9", "10", "11", "12"].map((g) => (
                <button
                  key={g}
                  onClick={() => update("grade", g)}
                  style={{
                    padding: "18px 12px",
                    border: form.grade === g ? "2.5px solid #2563eb" : "1.5px solid #e2e8f0",
                    borderRadius: 14,
                    background: form.grade === g ? "#dbeafe" : "#f0f9ff",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all .15s",
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>
                    {g === "8" ? "🌱" : g === "9" ? "🌿" : g === "10" ? "📚" : g === "11" ? "🎯" : "🏆"}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: form.grade === g ? "#2563eb" : "#1e293b" }}>
                    Grade {g}
                  </div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                    {g === "8"  ? "Exploring options" :
                     g === "9"  ? "Choose Grade 10 subjects" :
                     g === "10" ? "In your stream" :
                     g === "11" ? "Building your future" :
                                  "Final year — apply now"}
                  </div>
                </button>
              ))}
            </div>

            {/* Grade-specific info banners */}
            {form.grade === "9" && (
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <b style={{ color: "#14532d", fontSize: 13 }}>Perfect! You're in Grade 9.</b>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#14532d", lineHeight: 1.6 }}>
                    We'll first show you <b>what each subject stream involves</b> and what careers they lead to — then you'll take the quiz to find your best match.
                  </p>
                </div>
              </div>
            )}
            {form.grade === "10" && (
              <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>📖</span>
                <div>
                  <b style={{ color: "#1e40af", fontSize: 13 }}>You're in Grade 10.</b>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#1e40af", lineHeight: 1.6 }}>
                    We'll show you a full breakdown of your subjects and topics, then help you calculate your APS and find university programmes you can aim for.
                  </p>
                </div>
              </div>
            )}
            {(form.grade === "11" || form.grade === "12") && (
              <div style={{ background: "#fef3c7", border: "1.5px solid #fcd34d", borderRadius: 12, padding: "14px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20 }}>🎓</span>
                <div>
                  <b style={{ color: "#92400e", fontSize: 13 }}>You're in Grade {form.grade}.</b>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
                    Enter your marks to calculate your APS, see which university programmes you qualify for, and find bursaries before deadlines close.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handleGradeConfirm}
              disabled={!form.grade}
              style={{
                ...s.submitBtn,
                width: "100%", margin: 0,
                opacity: form.grade ? 1 : 0.4,
                cursor: form.grade ? "pointer" : "not-allowed",
              }}
            >
              {form.grade === "9"
                ? "Explore subject streams first →"
                : form.grade === "10"
                ? "See my subjects →"
                : "Continue to my profile →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 2 — SUBJECT STREAM PREVIEW (Grade 9 & 10)
  // ════════════════════════════════════════════════════════════════════════════
  if (step === STEP_PREVIEW) {
    return (
      <SubjectPreview
        grade={form.grade}
        onBack={() => setStep(STEP_GRADE)}
        onContinue={() => setStep(STEP_FORM)}
      />
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STEP 3 — FULL PROFILE + MARKS FORM
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={s.wrap}>
      <div style={s.topBar} />
      <div style={s.card}>

        {/* Header */}
        <div style={s.cardHeader}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <StablymLogo variant="dark" size="md" />
          </div>
          <h2 style={s.cardTitle}>Student Profile</h2>
          <p style={s.cardSub}>Fill in your details and current marks to personalise your recommendation</p>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {[
              { n: 1, label: "Grade", done: true },
              ...(showPreview ? [{ n: 2, label: "Subjects", done: true }] : []),
              { n: showPreview ? 3 : 2, label: "Profile", done: false, active: true },
            ].map((item) => (
              <React.Fragment key={item.n}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700,
                    background: item.done ? "rgba(255,255,255,0.9)" : item.active ? "#fff" : "rgba(255,255,255,0.3)",
                    color: item.done ? "#2563eb" : item.active ? "#1e293b" : "rgba(255,255,255,0.7)",
                  }}>
                    {item.done ? "✓" : item.n}
                  </div>
                  <span style={{ fontSize: 10, color: item.active ? "#fff" : "rgba(255,255,255,0.65)", fontWeight: item.active ? 700 : 400 }}>
                    {item.label}
                  </span>
                </div>
                {item.n < (showPreview ? 3 : 2) && (
                  <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.3)", marginBottom: 14 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Back to preview for Gr 9/10 */}
        {showPreview && (
          <div style={{ padding: "12px 32px 0" }}>
            <button
              onClick={() => setStep(STEP_PREVIEW)}
              style={{ background: "none", border: "none", color: "#2563eb", fontSize: 13, cursor: "pointer", fontWeight: 600, padding: 0 }}
            >
              ← Back to subject explorer
            </button>
          </div>
        )}

        {/* Grade 10+ info */}
        {gradeNum >= 10 && (
          <div style={{ ...s.gradeWarning, margin: "16px 32px 0" }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>🎓</span>
            <div>
              <h3 style={{ margin: "0 0 6px", color: "#92400e", fontSize: 14 }}>
                You're in Grade {form.grade}
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: "#78350f", lineHeight: 1.6 }}>
                Enter your current marks below to calculate your APS and see which university programmes you qualify for. The quiz is optional but helps refine your stream recommendation.
              </p>
            </div>
          </div>
        )}

        {/* Grade 9 info */}
        {gradeNum === 9 && (
          <div style={{ ...s.grade9Banner, margin: "16px 32px 0" }}>
            <span style={{ fontSize: 24, flexShrink: 0 }}>✅</span>
            <div>
              <b style={{ fontSize: 13, color: "#14532d" }}>Grade 9 — complete your profile then take the quiz!</b>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: "#14532d", lineHeight: 1.6 }}>
                Enter your Grade 9 marks below. These help calculate your preliminary APS. The quiz will then find your ideal Grade 10 subject stream.
              </p>
            </div>
          </div>
        )}

        {/* Personal Details */}
        <div style={s.section}>
          <h3 style={s.sectionLabel}>📋 Personal Details</h3>
          <div style={s.row2}>
            <Field label="First Name *" error={errors.name}>
              <input
                style={{ ...s.input, ...(errors.name ? s.inputErr : {}) }}
                value={form.name} onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Thabo"
              />
            </Field>
            <Field label="Surname *" error={errors.surname}>
              <input
                style={{ ...s.input, ...(errors.surname ? s.inputErr : {}) }}
                value={form.surname} onChange={(e) => update("surname", e.target.value)}
                placeholder="e.g. Nkadimeng"
              />
            </Field>
          </div>
          <div style={s.row2}>
            <Field label="School Name *" error={errors.school}>
              <input
                style={{ ...s.input, ...(errors.school ? s.inputErr : {}) }}
                value={form.school} onChange={(e) => update("school", e.target.value)}
                placeholder="e.g. Mphahlele High School"
              />
            </Field>
            <Field label="Current Grade">
              <div style={{ ...s.input, display: "flex", alignItems: "center", background: "#f1f5f9", color: "#374151" }}>
                Grade {form.grade}
                <button
                  onClick={() => setStep(STEP_GRADE)}
                  style={{ marginLeft: "auto", background: "none", border: "none", color: "#2563eb", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                >
                  Change
                </button>
              </div>
            </Field>
          </div>
          <Field label="Province *" error={errors.province}>
            <select
              style={{ ...s.input, ...(errors.province ? s.inputErr : {}) }}
              value={form.province} onChange={(e) => update("province", e.target.value)}
            >
              <option value="">Select your province...</option>
              {provinces.map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>

        {/* Subject Marks */}
        <div style={s.section}>
          <h3 style={s.sectionLabel}>📝 Subject Marks</h3>
          <div style={s.hintBox}>
            <span style={{ fontSize: 16 }}>💡</span>
            <div>
              <b>How to fill this in:</b> Type your latest mark (0–100) for each subject you take.
              Hit <b>N/A</b> for subjects you don't do. Your <b>APS updates live</b> as you type.
            </div>
          </div>

          {/* Live APS bar */}
          {aps > 0 && (
            <div style={{ background: "linear-gradient(135deg,#eff6ff,#f0fdf4)", border: "1px solid #bfdbfe", borderRadius: 14, padding: "16px 20px", marginBottom: 16, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", letterSpacing: "1px", textTransform: "uppercase" }}>Live APS</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>
                  {aps}<span style={{ fontSize: 18, color: "#94a3b8", fontWeight: 400 }}>/42</span>
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Best 6 · LO excluded · {mathsLevel()}</div>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ height: 10, background: "#e2e8f0", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", borderRadius: 99, transition: "width .5s", width: `${Math.min(100, (aps / 42) * 100)}%`, background: aps >= 30 ? "#16a34a" : aps >= 22 ? "#f59e0b" : "#dc2626" }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: aps >= 30 ? "#16a34a" : aps >= 22 ? "#d97706" : "#dc2626" }}>
                  {aps >= 30 ? "🟢 Strong — most universities open" : aps >= 22 ? "🟡 Good — many programmes available" : "🔴 Needs improvement"}
                </div>
              </div>
            </div>
          )}

          {/* NSC Symbol key */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {[[80,"A",7],[70,"B",6],[60,"C",5],[50,"D",4],[40,"E",3],[30,"F",2],[0,"G",1]].map(([pct,sym,apsP]) => {
              const col = apsP>=6?"#16a34a":apsP>=5?"#22c55e":apsP>=4?"#d97706":apsP>=3?"#f97316":apsP>=2?"#dc2626":"#94a3b8";
              return (
                <div key={sym} style={{ textAlign: "center", background: "#fff", border: `1.5px solid ${col}`, borderRadius: 8, padding: "4px 10px", minWidth: 48 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: col }}>{sym}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8" }}>{pct}%+</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: col }}>APS {apsP}</div>
                </div>
              );
            })}
          </div>

          {SUBJECT_GROUPS.map((group) => (
            <div key={group.group} style={{ marginBottom: 12, borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.06)", border: "1px solid #f1f5f9" }}>
              <button
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "#f0f9ff", border: "none", borderLeft: `4px solid ${group.color}`, cursor: "pointer", textAlign: "left", flexWrap: "wrap" }}
                onClick={() => toggleGroup(group.group)}
              >
                <span style={{ fontWeight: 700, color: group.color, fontSize: 13 }}>{group.group}</span>
                {group.note && <span style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>{group.note}</span>}
                <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 16 }}>{openGroups[group.group] ? "▲" : "▼"}</span>
              </button>
              {openGroups[group.group] && (
                <div style={{ background: "#fff" }}>
                  {group.subjects.map((sub) => (
                    <SubjectRow key={sub.id} sub={sub} groupColor={group.color} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* APS Career Guide */}
        {aps > 0 && (
          <div style={{ margin: "0 32px 8px", padding: "16px 20px", background: "#f0f9ff", borderRadius: 14, border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 12px", color: "#1e293b", fontSize: 14, fontWeight: 700 }}>
              🎓 Career APS Requirements — Your Score: <span style={{ color: "#2563eb" }}>{aps}/42</span>
            </h4>
            {APS_GUIDE.map((row, i) => {
              const reachable = aps >= row.aps;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", background: i % 2 === 0 ? "#f0f9ff" : "#fff", flexWrap: "wrap", borderRadius: 6 }}>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "#1e293b", minWidth: 140 }}>{row.career}</span>
                  <span style={{ borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 700, flexShrink: 0, background: reachable ? "#d1fae5" : "#fee2e2", color: reachable ? "#065f46" : "#991b1b" }}>
                    {reachable ? "✓" : "✗"} APS {row.aps}+
                  </span>
                  <span style={{ fontSize: 11, color: "#6b7280", flexShrink: 0 }}>{row.university}</span>
                </div>
              );
            })}
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>✓ Green = within reach · ✗ Red = needs improvement</p>
          </div>
        )}

        {/* Error + Submit */}
        {errors.english && (
          <p style={{ color: "#dc2626", fontSize: 13, textAlign: "center", margin: "8px 40px 0" }}>⚠️ {errors.english}</p>
        )}
        <button style={s.submitBtn} onClick={handleSubmit}>
          {gradeNum >= 10 ? "View My University Options →" : "Begin Stream Quiz →"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: "#dc2626" }}>{error}</span>}
    </div>
  );
}

const s = {
  wrap:        { minHeight: "100vh", background: "#e0f2fe", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "40px 16px 60px", fontFamily: "'Segoe UI',sans-serif" },
  topBar:      { position: "fixed", top: 0, left: 0, right: 0, height: 5, background: "linear-gradient(90deg,#0ea5e9,#2563eb,#0284c7)", zIndex: 100 },
  card:        { background: "#fff", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,.10)", maxWidth: 740, width: "100%", overflow: "hidden" },
  cardHeader:  { background: "linear-gradient(135deg,#0c4a7a,#1e40af)", padding: "32px 40px", textAlign: "center" },
  cardTitle:   { fontSize: 26, fontWeight: 800, color: "#fff", margin: 0 },
  cardSub:     { color: "rgba(255,255,255,.65)", fontSize: 14, marginTop: 6 },
  section:     { padding: "24px 32px", borderBottom: "1px solid #f1f5f9" },
  sectionLabel:{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 16px" },
  row2:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  input:       { padding: "11px 14px", border: "2px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", background: "#f0f9ff", color: "#1e293b", width: "100%", boxSizing: "border-box" },
  inputErr:    { borderColor: "#fca5a5", background: "#fff5f5" },
  hintBox:     { display: "flex", gap: 10, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "#713f12", lineHeight: 1.6 },
  submitBtn:   { display: "block", width: "calc(100% - 64px)", margin: "20px 32px 32px", padding: "16px", background: "linear-gradient(135deg,#0ea5e9,#1d4ed8)", color: "#fff", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: "pointer" },
  gradeWarning:{ display: "flex", gap: 14, background: "#fffbeb", border: "2px solid #fcd34d", borderRadius: 14, padding: "16px 18px", alignItems: "flex-start" },
  grade9Banner:{ display: "flex", gap: 12, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: 14, padding: "14px 18px", alignItems: "flex-start" },
};
// src/components/TeacherPortal.js
// ─────────────────────────────────────────────────────────────────────────────
// Drop-in replacement for the TeacherPortal stub in EnhancedResults.js.
//
// Usage inside EnhancedResults.js:
//   import TeacherPortal from "./TeacherPortal";
//
// Then replace the stub:
//   {activeSection === "teacher" && isHighSchool && (
//     <TeacherPortal
//       student={{ ...student, marks: activeMarks, aps: displayAPS }}
//       streamColor={info.color}
//       stream={topStream}
//     />
//   )}
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from "react";
import { markToAPS, markToSymbol, calcAPS, mathsLabel, NSC_SUBJECTS } from "./APSCalculator";

// ── Constants ────────────────────────────────────────────────────────────────

const SUB_LABELS = {
  english:       "English",
  afrikaans:     "Afrikaans",
  isizulu:       "isiZulu / Sesotho / Xhosa",
  puremaths:     "Mathematics (Pure)",
  techmaths:     "Technical Mathematics",
  mathslit:      "Mathematical Literacy",
  physscience:   "Physical Sciences",
  techscience:   "Technical Sciences",
  lifescience:   "Life Sciences",
  accounting:    "Accounting",
  business:      "Business Studies",
  economics:     "Economics",
  history:       "History",
  geography:     "Geography",
  tourism:       "Tourism",
  agroscience:   "Agricultural Sciences",
  egd:           "Engineering Graphics & Design",
  itcs:          "IT / Computer Science",
  civiltech:     "Civil Technology",
  electricaltech:"Electrical Technology",
  drama:         "Dramatic Arts",
  arts:          "Visual Arts",
  consumer:      "Consumer Studies",
  lifeorien:     "Life Orientation",
};

const GRADE_INTERVENTIONS = {
  G: { label: "Urgent intervention", color: "#dc2626", bg: "#fef2f2", icon: "🔴" },
  F: { label: "Immediate support",   color: "#ea580c", bg: "#fff7ed", icon: "🟠" },
  E: { label: "At risk",             color: "#d97706", bg: "#fffbeb", icon: "🟡" },
  D: { label: "Developing",          color: "#ca8a04", bg: "#fefce8", icon: "🟡" },
  C: { label: "On track",            color: "#16a34a", bg: "#f0fdf4", icon: "🟢" },
  B: { label: "Above average",       color: "#2563eb", bg: "#eff6ff", icon: "🔵" },
  A: { label: "Excellent",           color: "#7c3aed", bg: "#faf5ff", icon: "⭐" },
};

const STREAM_TIPS = {
  "Science Stream": [
    "Ensure this learner attends Science practical sessions — hands-on work reinforces theory significantly.",
    "Pure Mathematics is a gateway subject: if the mark is below 50%, intervention is critical.",
    "Consider recommending Olympiad participation — it builds problem-solving skills beyond the syllabus.",
  ],
  "Commerce Stream": [
    "Accounting requires daily practice. Recommend consistent homework completion over last-minute study.",
    "A strong English mark is essential for Accounting and Business Studies essay components.",
    "Business Studies case studies should be practised under timed conditions.",
  ],
  "Humanities Stream": [
    "Reading widely improves essay writing across all Humanities subjects.",
    "History and Geography essays must use source-based evidence — this is a frequent exam failure point.",
    "Encourage debate club or public speaking to build critical thinking and expression.",
  ],
  "Engineering / Technical Stream": [
    "EGD is highly visual — physical drawing practice cannot be replaced by theory alone.",
    "Technical Mathematics should be reinforced with real-world measurement and construction tasks.",
    "Encourage visits to TVET colleges and engineering firms for career exposure.",
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const getInitials = (name = "", surname = "") =>
  `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase() || "S";

const getMarkColour = (mark) =>
  mark >= 70 ? { bg: "#d1fae5", color: "#065f46" }
  : mark >= 60 ? { bg: "#bfdbfe", color: "#1e40af" }
  : mark >= 50 ? { bg: "#fde68a", color: "#92400e" }
  : mark >= 40 ? { bg: "#fed7aa", color: "#9a3412" }
  : { bg: "#fee2e2", color: "#991b1b" };

const generateNotes = (student, stream, aps) => {
  const name = student?.name || "This learner";
  const grade = student?.grade || "10";
  const marks = student?.marks || {};
  const subjects = Object.entries(marks)
    .filter(([, v]) => typeof v === "number" && v > 0)
    .sort(([, a], [, b]) => b - a);

  const strongest = subjects.slice(0, 2).map(([id]) => SUB_LABELS[id] || id);
  const weakest   = subjects.slice(-2).filter(([, v]) => v < 50).map(([id]) => SUB_LABELS[id] || id);

  const lines = [
    `${name} is a Grade ${grade} learner in the ${stream || "undetermined stream"}.`,
    aps > 0 ? `Current APS score: ${aps}/42 — ${aps >= 30 ? "qualifies for most university programmes." : aps >= 22 ? "qualifies for many diploma and degree programmes." : "may need additional support to reach university entry requirements."}` : "",
    strongest.length > 0 ? `Strongest subjects: ${strongest.join(" and ")}.` : "",
    weakest.length > 0 ? `Subjects requiring support: ${weakest.join(" and ")} (below 50%).` : "All subjects are currently passing.",
    "",
    "Recommended actions:",
    weakest.length > 0 ? `• Schedule additional support sessions in ${weakest.join(" and ")}.` : "• Maintain current performance levels.",
    `• Review ${stream || "subject"}-specific study techniques with the learner.`,
    "• Parent/guardian communication recommended to reinforce home study habits.",
  ].filter(Boolean);

  return lines.join("\n");
};

// ── Main Component ───────────────────────────────────────────────────────────

export default function TeacherPortal({ student, streamColor = "#2563eb", stream = "Science Stream" }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [notesText, setNotesText] = useState(() => generateNotes(student, stream, student?.aps));
  const [notesSaved, setNotesSaved] = useState(false);
  const [copyDone, setCopyDone]   = useState(false);
  const [printDone, setPrintDone] = useState(false);

  const marks  = student?.marks  || {};
  const aps    = student?.aps    || calcAPS(marks);
  const name   = student?.name   || "Student";
  const surname= student?.surname|| "";
  const grade  = student?.grade  || "—";
  const school = student?.school || "—";
  const province = student?.province || "—";

  // Build subject rows from marks
  const subjectRows = useMemo(() => {
    return NSC_SUBJECTS
      .filter((s) => typeof marks[s.id] === "number" && marks[s.id] >= 0)
      .map((s) => {
        const mark = marks[s.id];
        const sym  = markToSymbol(mark);
        const pts  = s.lo ? null : markToAPS(mark);
        const intervention = GRADE_INTERVENTIONS[sym] || GRADE_INTERVENTIONS.G;
        return { id: s.id, label: SUB_LABELS[s.id] || s.label, mark, sym, pts, lo: s.lo, intervention };
      })
      .sort((a, b) => b.mark - a.mark);
  }, [marks]);

  // Subjects that need immediate attention (below 40%)
  const atRisk = subjectRows.filter((r) => !r.lo && r.mark < 40);

  // APS progress context
  const apsStatus =
    aps >= 30 ? { label: "University entry likely", color: "#16a34a", pct: Math.round((aps / 42) * 100) }
    : aps >= 22 ? { label: "Diploma / degree possible", color: "#d97706", pct: Math.round((aps / 42) * 100) }
    : { label: "Below university threshold", color: "#dc2626", pct: Math.round((aps / 42) * 100) };

  const streamTips = STREAM_TIPS[stream] || STREAM_TIPS["Science Stream"];

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleSaveNotes = () => {
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  const handleCopyNotes = () => {
    navigator.clipboard?.writeText(notesText).then(() => {
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    });
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Teacher Report — ${name} ${surname}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 32px; color: #1e293b; max-width: 750px; margin: 0 auto; }
            h1 { font-size: 22px; font-weight: 800; margin: 0 0 4px; color: #0f172a; }
            h2 { font-size: 15px; font-weight: 700; margin: 24px 0 8px; color: #374151; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
            .meta { font-size: 13px; color: #6b7280; margin: 0 0 20px; }
            .meta span { margin-right: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f1f5f9; text-align: left; padding: 8px 10px; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: .5px; }
            td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
            .aps-row { display: flex; align-items: center; gap: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin: 8px 0 20px; }
            .aps-score { font-size: 36px; font-weight: 900; color: ${apsStatus.color}; }
            .notes { white-space: pre-wrap; font-size: 13px; color: #374151; line-height: 1.7; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; }
            .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          </style>
        </head>
        <body>
          <h1>${name} ${surname} — Teacher Report</h1>
          <div class="meta">
            <span>Grade ${grade}</span>
            <span>${school}</span>
            <span>${province}</span>
            <span>Stream: ${stream}</span>
            <span>Generated: ${new Date().toLocaleDateString("en-ZA", { day:"2-digit", month:"long", year:"numeric" })}</span>
          </div>
          <h2>APS Score</h2>
          <div class="aps-row">
            <div class="aps-score">${aps}<span style="font-size:18px;font-weight:400;color:#94a3b8">/42</span></div>
            <div>
              <div style="font-weight:700;color:${apsStatus.color}">${apsStatus.label}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px">Mathematics level: ${mathsLabel(marks)}</div>
            </div>
          </div>
          <h2>Subject Performance</h2>
          <table>
            <tr><th>Subject</th><th>Mark %</th><th>Symbol</th><th>APS pts</th><th>Status</th></tr>
            ${subjectRows.map((r) => `
              <tr>
                <td>${r.label}${r.lo ? " <em style='color:#94a3b8;font-size:11px'>(LO)</em>" : ""}</td>
                <td style="font-weight:700">${r.mark}%</td>
                <td>${r.sym}</td>
                <td>${r.lo ? "—" : r.pts}</td>
                <td style="color:${r.intervention.color}">${r.intervention.label}</td>
              </tr>
            `).join("")}
          </table>
          <h2>Teacher Notes</h2>
          <div class="notes">${notesText.replace(/\n/g, "<br>")}</div>
          <div class="footer">STABLYM · Subject Stream Selector · stablym.co.za</div>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
    setPrintDone(true);
    setTimeout(() => setPrintDone(false), 2000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const TABS = [
    { id: "overview",  label: "Overview"      },
    { id: "subjects",  label: "Subject Marks" },
    { id: "notes",     label: "Teacher Notes" },
    { id: "tips",      label: "Intervention"  },
  ];

  return (
    <div style={tp.wrap}>

      {/* ── Header card ── */}
      <div style={{ ...tp.headerCard, borderTop: `4px solid ${streamColor}` }}>
        <div style={tp.headerTop}>

          {/* Avatar */}
          <div style={{ ...tp.avatar, background: streamColor }}>
            {getInitials(name, surname)}
          </div>

          {/* Identity */}
          <div style={{ flex: 1 }}>
            <div style={tp.portalBadge}>🎓 Teacher Portal</div>
            <h2 style={tp.studentName}>{name} {surname}</h2>
            <div style={tp.metaRow}>
              <span style={tp.metaPill}>Grade {grade}</span>
              <span style={tp.metaPill}>{school}</span>
              {province !== "—" && <span style={tp.metaPill}>{province}</span>}
              <span style={{ ...tp.metaPill, background: `${streamColor}18`, color: streamColor }}>{stream}</span>
            </div>
          </div>

          {/* APS badge */}
          <div style={{ ...tp.apsBadge, borderColor: apsStatus.color }}>
            <div style={{ ...tp.apsNum, color: apsStatus.color }}>{aps}<span style={tp.apsOf}>/42</span></div>
            <div style={tp.apsLabel}>APS</div>
            <div style={{ fontSize: 11, color: apsStatus.color, fontWeight: 600, marginTop: 2 }}>{apsStatus.label}</div>
          </div>
        </div>

        {/* APS progress bar */}
        <div style={tp.progressWrap}>
          <div style={tp.progressTrack}>
            <div style={{ ...tp.progressFill, width: `${apsStatus.pct}%`, background: apsStatus.color }}/>
          </div>
          <span style={{ ...tp.progressPct, color: apsStatus.color }}>{apsStatus.pct}%</span>
        </div>
        <div style={tp.progressMeta}>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>0</span>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>APS progress towards 42</span>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>42</span>
        </div>

        {/* Action buttons */}
        <div style={tp.actionRow}>
          <button style={tp.actionBtn} onClick={handlePrint}>
            {printDone ? "✅ Sent to printer" : "🖨️ Print report"}
          </button>
          <button style={tp.actionBtn} onClick={handleCopyNotes}>
            {copyDone ? "✅ Copied!" : "📋 Copy notes"}
          </button>
        </div>

        {atRisk.length > 0 && (
          <div style={tp.atRiskBanner}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span>
              <b style={{ color: "#991b1b" }}>Urgent: </b>
              {atRisk.map((r) => r.label).join(", ")} — below 40%. Immediate intervention recommended.
            </span>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div style={tp.tabs}>
        {TABS.map((t) => (
          <button
            key={t.id}
            style={{
              ...tp.tab,
              ...(activeTab === t.id
                ? { borderBottomColor: streamColor, color: streamColor, fontWeight: 700 }
                : {}),
            }}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ══ TAB: OVERVIEW ══ */}
      {activeTab === "overview" && (
        <div style={tp.tabContent}>

          {/* Maths level */}
          <div style={tp.infoCard}>
            <div style={tp.infoCardTitle}>Mathematics Level</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginTop: 4 }}>
              {mathsLabel(marks)}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, lineHeight: 1.5 }}>
              {mathsLabel(marks) === "Pure Mathematics" && "Enables access to BSc, BEng, and most quantitative degree programmes."}
              {mathsLabel(marks) === "Technical Mathematics" && "Suits Engineering and Technical programmes. May limit some BSc options."}
              {mathsLabel(marks) === "Mathematical Literacy" && "Limits access to most STEM programmes. Suitable for Humanities and Social Sciences."}
              {mathsLabel(marks) === "—" && "No mathematics subject recorded yet."}
            </div>
          </div>

          {/* Quick mark summary */}
          <div style={tp.sectionTitle}>Subject overview</div>
          <div style={tp.chipGrid}>
            {subjectRows.map((r) => {
              const mc = getMarkColour(r.mark);
              return (
                <div key={r.id} style={{ ...tp.markChip, background: mc.bg }}>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: mc.color }}>{r.mark}%</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: mc.color }}>
                    {r.sym} {!r.lo && `· ${r.pts} pts`}
                  </div>
                </div>
              );
            })}
          </div>

          {subjectRows.length === 0 && (
            <div style={tp.emptyState}>No subject marks recorded for this learner yet.</div>
          )}
        </div>
      )}

      {/* ══ TAB: SUBJECT MARKS ══ */}
      {activeTab === "subjects" && (
        <div style={tp.tabContent}>
          <div style={tp.tableWrap}>
            <div style={tp.tableHead}>
              <span style={tp.th}>Subject</span>
              <span style={{ ...tp.th, textAlign: "center" }}>Mark %</span>
              <span style={{ ...tp.th, textAlign: "center" }}>Symbol</span>
              <span style={{ ...tp.th, textAlign: "center" }}>APS pts</span>
              <span style={{ ...tp.th }}>Status</span>
            </div>

            {subjectRows.length === 0 && (
              <div style={tp.emptyState}>No subject marks recorded.</div>
            )}

            {subjectRows.map((r, i) => {
              const mc = getMarkColour(r.mark);
              return (
                <div
                  key={r.id}
                  style={{
                    ...tp.tableRow,
                    background: i % 2 === 0 ? "#fff" : "#fafbfc",
                  }}
                >
                  <div style={tp.subjectCell}>
                    {r.label}
                    {r.lo && <span style={tp.loTag}>not in APS</span>}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ ...tp.markBadge, background: mc.bg, color: mc.color }}>
                      {r.mark}%
                    </span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span style={{ ...tp.symBadge, background: mc.bg, color: mc.color }}>
                      {r.sym}
                    </span>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: r.lo ? "#94a3b8" : mc.color }}>
                    {r.lo ? "—" : r.pts}
                  </div>
                  <div>
                    <span style={{ ...tp.interventionBadge, background: r.intervention.bg, color: r.intervention.color }}>
                      {r.intervention.icon} {r.intervention.label}
                    </span>
                  </div>
                </div>
              );
            })}

            {aps > 0 && (
              <div style={tp.apsSummaryRow}>
                <span style={{ fontWeight: 700, color: "#1e293b", fontSize: 13 }}>Best 6 APS total (LO excluded)</span>
                <span/>
                <span/>
                <span style={{ textAlign: "center", fontSize: 20, fontWeight: 900, color: apsStatus.color }}>{aps}</span>
                <span style={{ fontSize: 12, color: apsStatus.color, fontWeight: 600 }}>/ 42 — {apsStatus.label}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ TAB: TEACHER NOTES ══ */}
      {activeTab === "notes" && (
        <div style={tp.tabContent}>
          <p style={tp.notesHint}>
            These notes are auto-generated from the learner's results. Edit freely — they are only visible to you and are never shared with the learner.
          </p>
          <textarea
            style={tp.notesArea}
            value={notesText}
            onChange={(e) => { setNotesText(e.target.value); setNotesSaved(false); }}
            rows={16}
            spellCheck
          />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button
              style={{ ...tp.saveBtn, background: notesSaved ? "#16a34a" : streamColor }}
              onClick={handleSaveNotes}
            >
              {notesSaved ? "✅ Notes saved" : "💾 Save notes"}
            </button>
            <button style={tp.outlineBtn} onClick={handleCopyNotes}>
              {copyDone ? "✅ Copied!" : "📋 Copy to clipboard"}
            </button>
            <button
              style={tp.outlineBtn}
              onClick={() => {
                setNotesText(generateNotes(student, stream, aps));
                setNotesSaved(false);
              }}
            >
              🔄 Regenerate
            </button>
          </div>
        </div>
      )}

      {/* ══ TAB: INTERVENTION ══ */}
      {activeTab === "tips" && (
        <div style={tp.tabContent}>

          {atRisk.length > 0 && (
            <div style={tp.urgentSection}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15, color: "#991b1b" }}>🔴 Urgent — subjects below 40%</h3>
              {atRisk.map((r) => (
                <div key={r.id} style={tp.urgentRow}>
                  <div style={tp.urgentSubject}>{r.label}</div>
                  <div style={{ ...tp.markBadge, background: "#fee2e2", color: "#991b1b" }}>{r.mark}%</div>
                  <div style={{ fontSize: 13, color: "#6b7280", flex: 1 }}>
                    Failing — contact parent/guardian and schedule dedicated extra classes.
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={tp.sectionTitle}>Stream-specific teaching tips</div>
          {streamTips.map((tip, i) => (
            <div key={i} style={tp.tipCard}>
              <span style={{ ...tp.tipNum, background: streamColor }}>{i + 1}</span>
              <p style={tp.tipText}>{tip}</p>
            </div>
          ))}

          <div style={tp.sectionTitle}>General recommendations</div>
          {[
            { icon: "📞", text: "Contact parent/guardian if any subject mark is below 50% going into the next term." },
            { icon: "📋", text: "Print this report and attach it to the learner's file as a term progress record." },
            { icon: "🗓️", text: "Schedule a 15-minute one-on-one check-in before the next test cycle." },
            { icon: "📚", text: "Share free past paper resources: www.education.gov.za/Curriculum/NationalSeniorCertificate" },
            { icon: "🤝", text: "Recommend peer study groups — especially for subjects scoring below 60%." },
          ].map((r, i) => (
            <div key={i} style={tp.recRow}>
              <span style={{ fontSize: 20 }}>{r.icon}</span>
              <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{r.text}</span>
            </div>
          ))}

          {/* DBE resource links */}
          <div style={{ ...tp.infoCard, marginTop: 16 }}>
            <div style={tp.infoCardTitle}>Useful Resources for Teachers</div>
            {[
              ["DBE CAPS documents",              "https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements.aspx"],
              ["NSC past papers (DBE)",            "https://www.education.gov.za/Curriculum/NationalSeniorCertificate.aspx"],
              ["NSFAS teacher information",        "https://nsfas.org.za"],
              ["SA National Tutoring Programme",   "https://www.education.gov.za"],
            ].map(([label, url]) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={tp.resourceLink}
              >
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const tp = {
  wrap:             { fontFamily: "'Segoe UI', sans-serif", display: "flex", flexDirection: "column", gap: 0 },

  // Header
  headerCard:       { background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 0, boxShadow: "0 2px 12px rgba(0,0,0,.06)", border: "1px solid #e2e8f0" },
  headerTop:        { display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 16 },
  avatar:           { width: 52, height: 52, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#fff", flexShrink: 0 },
  portalBadge:      { fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  studentName:      { fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" },
  metaRow:          { display: "flex", gap: 6, flexWrap: "wrap" },
  metaPill:         { fontSize: 12, background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 99, fontWeight: 600 },
  apsBadge:         { border: "2px solid", borderRadius: 14, padding: "10px 18px", textAlign: "center", minWidth: 100, flexShrink: 0 },
  apsNum:           { fontSize: 32, fontWeight: 900, lineHeight: 1 },
  apsOf:            { fontSize: 14, fontWeight: 400, color: "#94a3b8" },
  apsLabel:         { fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginTop: 2 },
  progressWrap:     { display: "flex", alignItems: "center", gap: 10, marginBottom: 4 },
  progressTrack:    { flex: 1, height: 8, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" },
  progressFill:     { height: "100%", borderRadius: 99, transition: "width .5s ease" },
  progressPct:      { fontSize: 12, fontWeight: 700, minWidth: 36, textAlign: "right" },
  progressMeta:     { display: "flex", justifyContent: "space-between", marginBottom: 12 },
  actionRow:        { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 },
  actionBtn:        { padding: "9px 18px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" },
  atRiskBanner:     { display: "flex", gap: 10, alignItems: "flex-start", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginTop: 12, fontSize: 13, color: "#7f1d1d", lineHeight: 1.6 },

  // Tabs
  tabs:             { display: "flex", background: "#fff", borderBottom: "1px solid #e2e8f0", marginTop: 12, borderRadius: "0", overflowX: "auto" },
  tab:              { padding: "13px 18px", border: "none", borderBottom: "3px solid transparent", background: "transparent", fontSize: 13, fontWeight: 500, color: "#6b7280", cursor: "pointer", whiteSpace: "nowrap" },
  tabContent:       { background: "#fff", borderRadius: "0 0 16px 16px", padding: "20px 24px", border: "1px solid #e2e8f0", borderTop: "none" },

  // Overview
  infoCard:         { background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: "1px solid #e2e8f0" },
  infoCardTitle:    { fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  sectionTitle:     { fontSize: 13, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  chipGrid:         { display: "flex", flexWrap: "wrap", gap: 10 },
  markChip:         { borderRadius: 12, padding: "10px 14px", display: "flex", flexDirection: "column", alignItems: "center", minWidth: 96 },
  emptyState:       { fontSize: 14, color: "#94a3b8", textAlign: "center", padding: "32px 0" },

  // Subject table
  tableWrap:        { borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" },
  tableHead:        { display: "grid", gridTemplateColumns: "2fr 80px 70px 70px 1fr", gap: 8, padding: "8px 16px", background: "#f1f5f9" },
  th:               { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: ".5px" },
  tableRow:         { display: "grid", gridTemplateColumns: "2fr 80px 70px 70px 1fr", gap: 8, padding: "10px 16px", alignItems: "center", borderBottom: "1px solid #f8fafc" },
  subjectCell:      { fontSize: 13, fontWeight: 500, color: "#1e293b", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  loTag:            { fontSize: 10, color: "#94a3b8", fontStyle: "italic", fontWeight: 400 },
  markBadge:        { fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 8, display: "inline-block" },
  symBadge:         { fontSize: 13, fontWeight: 700, padding: "3px 10px", borderRadius: 8, display: "inline-block" },
  interventionBadge:{ fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap" },
  apsSummaryRow:    { display: "grid", gridTemplateColumns: "2fr 80px 70px 70px 1fr", gap: 8, padding: "12px 16px", alignItems: "center", background: "#f0f9ff", borderTop: "2px solid #bfdbfe" },

  // Notes
  notesHint:        { fontSize: 12, color: "#6b7280", marginBottom: 10, lineHeight: 1.6 },
  notesArea:        { width: "100%", padding: "14px 16px", border: "1.5px solid #e2e8f0", borderRadius: 12, fontSize: 13, fontFamily: "'Segoe UI', sans-serif", color: "#1e293b", background: "#f8fafc", lineHeight: 1.7, resize: "vertical", outline: "none", boxSizing: "border-box" },
  saveBtn:          { padding: "10px 22px", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" },
  outlineBtn:       { padding: "10px 18px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" },

  // Intervention tips
  urgentSection:    { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "16px", marginBottom: 16 },
  urgentRow:        { display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #fecaca", flexWrap: "wrap" },
  urgentSubject:    { fontSize: 13, fontWeight: 700, color: "#991b1b", minWidth: 160 },
  tipCard:          { display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 0", borderBottom: "1px solid #f1f5f9" },
  tipNum:           { width: 28, height: 28, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 },
  tipText:          { fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0, paddingTop: 4 },
  recRow:           { display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: "1px solid #f1f5f9" },
  resourceLink:     { display: "block", fontSize: 13, color: "#2563eb", fontWeight: 600, padding: "5px 0", textDecoration: "none" },
};
// src/components/EnhancedResults.js
// Drop-in replacement for the inline Results component in Quiz.js
// Usage: import EnhancedResults from "./EnhancedResults"
//        <EnhancedResults streamScores={...} mathResults={...} student={...} />

import React, { useState } from "react";
import UniversityFinder from "./UniversityFinder";
import StablymLogo from "./StablymLogoComponent";

const SA_STREAMS = {
  "Science Stream":                 { subjects:["Mathematics","Physical Sciences","Life Sciences","Geography / Agricultural Sciences"],    careers:["Doctor","Engineer","Pharmacist","Environmental Scientist","Veterinarian","Biotechnologist"],                        color:"#2563eb", icon:"🔬", bg:"#eff6ff" },
  "Commerce Stream":                { subjects:["Mathematics","Accounting","Business Studies","Economics"],                                 careers:["Accountant","Financial Analyst","Entrepreneur","Economist","Auditor","Investment Banker"],                        color:"#16a34a", icon:"📊", bg:"#f0fdf4" },
  "Humanities Stream":              { subjects:["Mathematical Literacy","History","Tourism","Geography","Consumer Studies"],                careers:["Journalist","Social Worker","Teacher","Tourism Manager","Historian","Psychologist"],                             color:"#9333ea", icon:"🎭", bg:"#faf5ff" },
  "Engineering / Technical Stream": { subjects:["Technical Mathematics","Technical Sciences","Civil Technology / Electrical Technology","Engineering Graphics and Design"], careers:["Civil Engineer","Electrician","Draughtsperson","Mechanical Technician","Construction Manager","IT Technician"], color:"#ea580c", icon:"⚙️", bg:"#fff7ed" },
};

const DIFF_COLOR = { easy:"#16a34a", medium:"#d97706", hard:"#dc2626" };

export default function EnhancedResults({ streamScores, mathResults, student }) {
  const [activeSection, setActiveSection] = useState("results");
  const [downloading,   setDownloading]   = useState(false);
  const [dlError,       setDlError]       = useState("");

  // Guard: if streamScores is missing or empty, show a fallback
  if (!streamScores || Object.keys(streamScores).length === 0) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", background:"#f0f4ff" }}>
        <div style={{ background:"#fff", borderRadius:20, padding:"40px", maxWidth:480, textAlign:"center", boxShadow:"0 8px 40px rgba(0,0,0,.1)" }}>
          <p style={{ fontSize:48, margin:"0 0 16px" }}>⚠️</p>
          <h2 style={{ color:"#1e293b", margin:"0 0 12px" }}>No results yet</h2>
          <p style={{ color:"#6b7280", marginBottom:24 }}>It looks like the quiz didn't complete properly. Please retake the quiz and answer all questions.</p>
          <button onClick={() => window.location.reload()} style={{ padding:"14px 32px", background:"#2563eb", color:"#fff", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer" }}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const sorted    = Object.entries(streamScores).sort((a, b) => b[1] - a[1]);
  const topStream = sorted[0][0];
  const topScore  = sorted[0][1];
  const second    = sorted[1];
  const info      = SA_STREAMS[topStream];
  const isLow     = topScore < 45;
  const isClose   = second && (topScore - second[1]) < 10;

  const mathPct   = mathResults ? Math.round((mathResults.correct / mathResults.total) * 100) : null;
  const mathLabel = mathPct == null ? null
    : mathPct >= 70 ? "✅ Strong — Pure Mathematics recommended."
    : mathPct >= 40 ? "⚡ Moderate — Technical Mathematics may suit you."
    :                 "📘 Consider Mathematical Literacy to build your foundation.";

  // ── CLIENT-SIDE PDF — no backend needed ──────────────────────────────────────
  const downloadPDF = async () => {
    setDownloading(true);
    setDlError("");
    try {
      // Dynamically load jsPDF from CDN
      if (!window.jspdf) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
          s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const W = 210; // A4 width mm
      const STREAM_COLORS_HEX = {
        "Science Stream":                 [37,99,235],
        "Commerce Stream":                [22,163,74],
        "Humanities Stream":              [147,51,234],
        "Engineering / Technical Stream": [234,88,12],
      };
      const SUBJECT_LABELS = {
        english:"English HL/FAL", puremaths:"Pure Mathematics", techmaths:"Technical Mathematics",
        mathslit:"Maths Literacy", physscience:"Physical Sciences", lifescience:"Life Sciences",
        geography:"Geography", agroscience:"Agricultural Sciences", accounting:"Accounting",
        business:"Business Studies", economics:"Economics", history:"History",
        tourism:"Tourism", consumer:"Consumer Studies", techscience:"Technical Sciences",
        civiltech:"Civil Technology", electricaltech:"Electrical Technology",
        mechanicaltech:"Mechanical Technology", egd:"EGD", itcs:"IT / CAT",
        lifeorien:"Life Orientation",
      };
      const markToAPS = m => m>=80?7:m>=70?6:m>=60?5:m>=50?4:m>=40?3:m>=30?2:1;
      const symbolFor = m => m>=80?"A":m>=70?"B":m>=60?"C":m>=50?"D":m>=40?"E":m>=30?"F":"G";

      let y = 0;

      // ── HEADER BANNER ──
      const [r,g,b] = STREAM_COLORS_HEX[topStream] || [37,99,235];
      doc.setFillColor(15,23,42);
      doc.roundedRect(0, 0, W, 36, 0, 0, "F");
      // Accent stripe
      doc.setFillColor(r,g,b);
      doc.rect(0, 33, W, 3, "F");
      // STABLYM
      doc.setTextColor(255,255,255);
      doc.setFont("helvetica","bold");
      doc.setFontSize(22);
      doc.text("STABLYM", 14, 16);
      // Tagline
      doc.setFontSize(7);
      doc.setTextColor(148,163,184);
      doc.text("SUBJECT STREAM SELECTOR", 14, 23);
      // Date
      doc.setFontSize(8);
      doc.setTextColor(100,116,139);
      const now = new Date().toLocaleDateString("en-ZA",{day:"2-digit",month:"long",year:"numeric"});
      doc.text(`Report generated: ${now}`, W-14, 16, { align:"right" });
      doc.text("South Africa", W-14, 23, { align:"right" });
      y = 44;

      // ── STUDENT INFO ──
      doc.setFillColor(248,250,252);
      doc.roundedRect(10, y, W-20, 28, 3, 3, "F");
      doc.setDrawColor(226,232,240);
      doc.roundedRect(10, y, W-20, 28, 3, 3, "S");
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(100,116,139);
      const infoItems = [
        ["Name", `${student?.name||""} ${student?.surname||""}`],
        ["School", student?.school||"—"],
        ["Grade", `Grade ${student?.grade||"—"}`],
        ["Province", student?.province||"—"],
        ["APS Score", student?.aps ? `${student.aps} / 42` : "—"],
        ["Maths Level", student?.mathsLevel||"—"],
      ];
      infoItems.forEach(([label, val], i) => {
        const col = i < 3 ? 14 : 115;
        const row = i < 3 ? y+7+(i*7) : y+7+((i-3)*7);
        doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(148,163,184);
        doc.text(label.toUpperCase(), col, row);
        doc.setFont("helvetica","normal"); doc.setTextColor(30,41,59);
        doc.text(String(val), col+30, row);
      });
      y += 36;

      // ── RECOMMENDED STREAM BANNER ──
      doc.setFillColor(r,g,b);
      doc.roundedRect(10, y, W-20, 20, 4, 4, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(255,255,255);
      doc.text(topStream, W/2, y+9, { align:"center" });
      doc.setFont("helvetica","normal"); doc.setFontSize(8);
      doc.text("Your recommended subject stream based on quiz results", W/2, y+16, { align:"center" });
      y += 28;

      // ── STREAM SCORES ──
      doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(30,41,59);
      doc.text("Stream Compatibility Scores", 14, y); y += 6;
      doc.setDrawColor(226,232,240); doc.line(14, y, W-14, y); y += 5;
      const sortedStreams = Object.entries(streamScores).sort((a,b)=>b[1]-a[1]);
      sortedStreams.forEach(([stream, pct]) => {
        const [sr,sg,sb] = STREAM_COLORS_HEX[stream] || [100,116,139];
        doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(55,65,81);
        doc.text(stream, 14, y+3.5);
        doc.setFillColor(241,245,249);
        doc.roundedRect(100, y, 80, 5, 2, 2, "F");
        doc.setFillColor(sr,sg,sb);
        doc.roundedRect(100, y, Math.max(3, 80*(pct/100)), 5, 2, 2, "F");
        doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(30,41,59);
        doc.text(`${pct}%`, 185, y+3.8, { align:"right" });
        y += 9;
      });
      y += 4;

      // ── SUBJECTS & CAREERS (2 col) ──
      const streamInfo = SA_STREAMS[topStream];
      doc.setFillColor(r,g,b);
      doc.roundedRect(10, y, (W-24)/2, 6, 2, 2, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(255,255,255);
      doc.text("Subjects You Will Take", 14, y+4.2);
      doc.setFillColor(r,g,b);
      doc.roundedRect(10+(W-24)/2+4, y, (W-24)/2, 6, 2, 2, "F");
      doc.text("Possible Career Paths", 14+(W-24)/2+4, y+4.2);
      y += 10;
      const maxRows = Math.max(streamInfo.subjects.length, streamInfo.careers.length);
      for(let i=0; i<maxRows; i++){
        doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(55,65,81);
        if(streamInfo.subjects[i]) doc.text(`• ${streamInfo.subjects[i]}`, 14, y);
        if(streamInfo.careers[i])  doc.text(`• ${streamInfo.careers[i]}`, 14+(W-24)/2+4, y);
        y += 7;
      }
      y += 4;

      // ── SUBJECT MARKS (if available) ──
      const marks = student?.marks || {};
      const markEntries = Object.entries(marks).filter(([,v])=>v>0);
      if(markEntries.length > 0){
        doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(30,41,59);
        doc.text("Subject Marks & APS Breakdown", 14, y); y+=6;
        doc.setDrawColor(226,232,240); doc.line(14,y,W-14,y); y+=4;

        // Table header
        doc.setFillColor(30,41,59);
        doc.rect(14, y, W-28, 7, "F");
        doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
        doc.text("Subject", 17, y+4.8);
        doc.text("Mark", 120, y+4.8);
        doc.text("Symbol", 145, y+4.8);
        doc.text("APS", 175, y+4.8);
        y += 9;

        markEntries.forEach(([id, mark], i) => {
          const bg = i%2===0 ? [255,255,255] : [248,250,252];
          doc.setFillColor(...bg); doc.rect(14, y, W-28, 7, "F");
          doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(55,65,81);
          doc.text(SUBJECT_LABELS[id]||id, 17, y+4.8);
          doc.setFont("helvetica","bold");
          const apsV = markToAPS(mark);
          const symV = symbolFor(mark);
          const markColor = mark>=60?[5,150,105]:mark>=40?[180,83,9]:[185,28,28];
          doc.setTextColor(...markColor);
          doc.text(`${mark}%`, 120, y+4.8);
          doc.text(symV, 145, y+4.8);
          doc.text(String(apsV), 175, y+4.8);
          y += 7;
        });

        // APS total
        if(student?.aps){
          doc.setFillColor(r,g,b);
          doc.rect(14, y, W-28, 8, "F");
          doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(255,255,255);
          doc.text("Estimated APS Total", 17, y+5.5);
          doc.text(`${student.aps} / 42`, W-16, y+5.5, {align:"right"});
          y += 12;
        }
      }

      // ── MATH RESULTS ──
      if(mathResults){
        doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(30,41,59);
        doc.text("Math Challenge Results", 14, y); y+=6;
        doc.setDrawColor(226,232,240); doc.line(14,y,W-14,y); y+=5;
        doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(55,65,81);
        doc.text(`Score: ${mathResults.correct} / ${mathResults.total}  (${mathPct}%)`, 14, y); y+=6;
        doc.setTextColor(100,116,139);
        const ml = mathPct>=70?"Pure Mathematics recommended":mathPct>=40?"Technical Mathematics may suit you":"Consider Mathematical Literacy";
        doc.text(ml, 14, y); y+=10;
      }

      // ── ADVICE ──
      if(y > 240){ doc.addPage(); y = 20; }
      doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(30,41,59);
      doc.text("Personalised Advice", 14, y); y+=6;
      doc.setDrawColor(226,232,240); doc.line(14,y,W-14,y); y+=5;
      const advice = [
        student?.aps>=30 ? `Your APS of ${student.aps} is strong — keep it up!` : student?.aps>0 ? `Work on improving your APS of ${student.aps} before applying.` : null,
        topStream==="Science Stream" ? "Focus on achieving 60%+ in Mathematics and Physical Sciences." : null,
        topStream==="Commerce Stream" ? "Aim for 60%+ in Accounting and Mathematics for BCom programmes." : null,
        topStream==="Humanities Stream" ? "Develop strong writing and communication skills." : null,
        topStream==="Engineering / Technical Stream" ? "Excel in Technical Maths, Technical Sciences, and EGD." : null,
        "Apply for NSFAS bursary at nsfas.org.za before January each year.",
        "Visit your school counsellor and attend university open days in Grade 11.",
      ].filter(Boolean);
      doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(55,65,81);
      advice.forEach(tip => {
        const lines = doc.splitTextToSize(`• ${tip}`, W-28);
        doc.text(lines, 14, y); y += lines.length * 6;
      });

      // ── FOOTER ──
      const totalPages = doc.internal.getNumberOfPages();
      for(let p=1;p<=totalPages;p++){
        doc.setPage(p);
        doc.setFillColor(15,23,42);
        doc.rect(0, 285, W, 12, "F");
        doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(100,116,139);
        doc.text("STABLYM · Subject Stream Selector · South Africa", 14, 292);
        doc.text(`Page ${p} of ${totalPages}`, W-14, 292, {align:"right"});
      }

      // ── SAVE ──
      const fname = `Stablym_Report_${student?.name||"Student"}_${student?.surname||""}.pdf`;
      doc.save(fname);
    } catch(err) {
      console.error(err);
      setDlError("Could not generate PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const NAV = [
    { id:"results",      label:"📊 Results"      },
    { id:"universities", label:"🏫 Universities"  },
    { id:"bursaries",    label:"💰 Bursaries"     },
    { id:"advice",       label:"💡 Advice"        },
  ];

  return (
    <div style={s.page}>
      {/* ── TOP BANNER ── */}
      <div style={{ ...s.banner, background: info.color }}>
        <div style={s.bannerInner}>
          <div style={s.bannerLeft}>
            <span style={s.bannerIcon}>{info.icon}</span>
            <div>
              <div style={{ marginBottom:4 }}><StablymLogo variant="dark" size="xs" /></div>
              <p style={s.bannerLabel}>
                {student?.name ? `${student.name}'s Recommended Stream` : "Your Recommended Stream"}
              </p>
              <h1 style={s.bannerStream}>{topStream}</h1>
              {student?.aps > 0 && (
                <p style={s.bannerAps}>APS Score: <b>{student.aps} / 42</b></p>
              )}
            </div>
          </div>
          <button
            style={{ ...s.pdfBtn, opacity: downloading ? 0.7 : 1 }}
            onClick={downloadPDF}
            disabled={downloading}
          >
            {downloading ? "⏳ Generating..." : "⬇️ Download PDF Report"}
          </button>
        </div>
        {dlError && <p style={s.dlError}>{dlError}</p>}
      </div>

      {/* ── NAV TABS ── */}
      <div style={s.nav}>
        {NAV.map(n => (
          <button key={n.id}
            style={{ ...s.navBtn, ...(activeSection === n.id ? { ...s.navActive, borderBottomColor: info.color, color: info.color } : {}) }}
            onClick={() => setActiveSection(n.id)}
          >{n.label}</button>
        ))}
      </div>

      <div style={s.content}>

        {/* ══ RESULTS TAB ══════════════════════════════════════════════════════ */}
        {activeSection === "results" && (
          <div>
            {isLow   && <div style={s.warningBox}>⚠️ Your scores are spread across streams. Consider speaking to a school counsellor before deciding.</div>}
            {isClose && !isLow && <div style={s.infoBox}>💡 You also show strong interest in <b>{second[0]}</b>. Talk to a teacher about both options.</div>}

            {/* Score bars */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>Stream Compatibility</h3>
              {sorted.map(([stream, pct]) => (
                <div key={stream} style={s.barRow}>
                  <span style={s.barLabel}>{SA_STREAMS[stream].icon} {stream}</span>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width:`${pct}%`, background: SA_STREAMS[stream].color }} />
                  </div>
                  <span style={s.barPct}>{pct}%</span>
                </div>
              ))}
            </div>

            {/* Subjects + Careers */}
            <div style={s.twoCol}>
              <div style={{ ...s.card, flex:1 }}>
                <h3 style={{ ...s.cardTitle, color: info.color }}>📚 Subjects You Will Take</h3>
                {info.subjects.map(sub => (
                  <div key={sub} style={s.listItem}>
                    <span style={{ ...s.dot, background: info.color }} />
                    {sub}
                  </div>
                ))}
              </div>
              <div style={{ ...s.card, flex:1 }}>
                <h3 style={{ ...s.cardTitle, color: info.color }}>🎓 Career Paths</h3>
                {info.careers.map(c => (
                  <div key={c} style={s.listItem}>
                    <span style={{ ...s.dot, background: info.color }} />
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Math challenge review */}
            {mathResults && (
              <div style={s.card}>
                <h3 style={s.cardTitle}>🧮 Math Challenge Review</h3>
                <div style={s.mathScoreRow}>
                  <div style={{ ...s.mathScoreBig, color: mathPct >= 60 ? "#16a34a" : "#dc2626" }}>
                    {mathResults.correct}/{mathResults.total}
                  </div>
                  <div>
                    <p style={{ fontWeight:700, margin:"0 0 4px", fontSize:16 }}>{mathPct}%</p>
                    <p style={{ color:"#6b7280", fontSize:13, margin:0 }}>{mathLabel}</p>
                  </div>
                </div>
                <div style={s.mathGrid}>
                  {mathResults.questions.map((q, i) => (
                    <div key={i} style={{ ...s.mathCard, borderLeft:`4px solid ${mathResults.wasCorrect[i] ? "#16a34a" : "#dc2626"}` }}>
                      <div style={{ display:"flex", gap:6, marginBottom:4 }}>
                        <span style={{ ...s.diffBadge, background: DIFF_COLOR[q.difficulty] }}>{q.difficulty}</span>
                        <span style={s.topicTag}>{q.topic}</span>
                        {mathResults.timedOut?.[i] && <span style={{ ...s.diffBadge, background:"#6b7280" }}>⏱ timed out</span>}
                      </div>
                      <p style={{ margin:"0 0 4px", fontSize:13, fontWeight:600 }}>{q.question}</p>
                      <p style={{ margin:0, fontSize:12, color: mathResults.wasCorrect[i] ? "#16a34a" : "#dc2626" }}>
                        {mathResults.wasCorrect[i] ? "✔ Correct" : `✘ Answer: ${q.answer}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject grades summary */}
            {student?.marks && Object.keys(student.marks).length > 0 && (
              <div style={s.card}>
                <h3 style={s.cardTitle}>📝 Your Subject Grades</h3>
                <div style={s.gradesGrid}>
                  {Object.entries(student.marks).filter(([,v]) => v > 0).map(([id, mark]) => {
                    const labels = { english:"English", maths:"Mathematics", mathslit:"Maths Literacy", science:"Physical Sciences", life:"Life Sciences", accounting:"Accounting", business:"Business Studies", economics:"Economics", history:"History", geography:"Geography", lifeorien:"Life Orientation", technical:"Technical Subject" };
                    const col = mark >= 70 ? "#d1fae5" : mark >= 50 ? "#fef9c3" : "#fee2e2";
                    const tc  = mark >= 70 ? "#065f46" : mark >= 50 ? "#713f12" : "#991b1b";
                    return (
                      <div key={id} style={{ ...s.gradeChip, background: col }}>
                        <span style={{ fontSize:11, color:"#6b7280" }}>{labels[id] || id}</span>
                        <span style={{ fontSize:18, fontWeight:900, color: tc }}>{mark}%</span>
                      </div>
                    );
                  })}
                </div>
                {student.aps > 0 && (
                  <div style={s.apsTotal}>
                    <span>Estimated APS</span>
                    <span style={s.apsBig}>{student.aps}<span style={{ fontSize:18, fontWeight:400, color:"#94a3b8" }}>/42</span></span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══ UNIVERSITIES TAB ═════════════════════════════════════════════════ */}
        {activeSection === "universities" && (
          <UniversityFinder stream={topStream} aps={student?.aps || 0} />
        )}

        {/* ══ BURSARIES TAB ════════════════════════════════════════════════════ */}
        {activeSection === "bursaries" && (
          <div>
            <div style={s.nsfasCard}>
              <span style={{ fontSize:32 }}>🎯</span>
              <div>
                <h3 style={{ margin:"0 0 4px", color:"#713f12" }}>Apply for NSFAS First!</h3>
                <p style={{ margin:0, fontSize:13, color:"#713f12", lineHeight:1.6 }}>
                  NSFAS (National Student Financial Aid Scheme) covers <b>full tuition, accommodation, and meals</b> for qualifying students at public universities and TVET colleges. Apply at <b>nsfas.org.za</b> before January each year.
                </p>
              </div>
            </div>

            <UniversityFinder stream={topStream} aps={student?.aps || 0} />

            <div style={{ ...s.card, marginTop:16 }}>
              <h3 style={s.cardTitle}>📋 Bursary Application Tips</h3>
              {[
                "Apply in Grade 11 — most bursaries open in August/September, before matric.",
                "Keep your marks above 60% in relevant subjects — this is the minimum for most bursaries.",
                "Write a strong motivational letter explaining your dreams and why you need financial support.",
                "Ask a teacher or school counsellor to proofread your application before submitting.",
                "Apply to multiple bursaries at the same time — don't put all your eggs in one basket.",
                "Keep certified copies of your ID, school report, and parent's income documents ready.",
              ].map((tip, i) => (
                <div key={i} style={s.tipRow}>
                  <span style={s.tipNum}>{i + 1}</span>
                  <span style={s.tipText}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ADVICE TAB ═══════════════════════════════════════════════════════ */}
        {activeSection === "advice" && (
          <div>
            {/* APS feedback */}
            {student?.aps > 0 && (
              <div style={{ ...s.card, borderLeft:`4px solid ${student.aps >= 30 ? "#16a34a" : student.aps >= 22 ? "#d97706" : "#dc2626"}` }}>
                <h3 style={s.cardTitle}>📊 Your APS: {student.aps}/42</h3>
                <p style={{ fontSize:13, color:"#374151", margin:0 }}>
                  {student.aps >= 30
                    ? "🟢 Strong APS! You qualify for most university programmes. Keep working hard to maintain this."
                    : student.aps >= 22
                    ? "🟡 Good APS. You qualify for many programmes. Focus on improving your weakest subjects."
                    : "🔴 Your APS needs improvement. Speak to your teacher about a study plan before Grade 10."}
                </p>
              </div>
            )}

            {/* Stream-specific roadmap */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>🗺️ Your Roadmap for {topStream}</h3>
              <div style={s.roadmap}>
                {getRoadmap(topStream).map((step, i) => (
                  <div key={i} style={s.roadmapStep}>
                    <div style={{ ...s.roadmapNum, background: info.color }}>{i + 1}</div>
                    <div style={s.roadmapContent}>
                      <p style={s.roadmapTitle}>{step.title}</p>
                      <p style={s.roadmapDesc}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study tips */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>📚 Study Tips for Your Stream</h3>
              {getStudyTips(topStream, student).map((tip, i) => (
                <div key={i} style={s.tipRow}>
                  <span style={{ fontSize:18 }}>{tip.emoji}</span>
                  <span style={s.tipText}>{tip.text}</span>
                </div>
              ))}
            </div>

            {/* Motivation */}
            <div style={{ ...s.card, background:`linear-gradient(135deg,${info.bg},#fff)`, border:`1px solid ${info.color}40` }}>
              <p style={{ fontSize:18, textAlign:"center", margin:0, lineHeight:1.8, color:"#1e293b" }}>
                ✨ <em>"The path to success starts with knowing yourself.<br/>
                You've taken that first step today."</em>
              </p>
              <p style={{ textAlign:"center", color:info.color, fontWeight:700, marginTop:8, fontSize:13 }}>— Stablym</p>
            </div>
          </div>
        )}

        {/* Retake button */}
        <button style={s.retakeBtn} onClick={() => window.location.reload()}>
          🔄 Retake Quiz (New Questions)
        </button>
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function getRoadmap(stream) {
  const maps = {
    "Science Stream": [
      { title:"Grade 9–10", desc:"Focus on Mathematics (60%+), Physical Sciences, and Life Sciences. Join science clubs." },
      { title:"Grade 11",   desc:"Apply for NRF, Sasol, or NSFAS bursaries. Begin researching universities." },
      { title:"Grade 12",   desc:"Achieve a strong NSC pass. Apply to UCT, Wits, UP, or UKZN for BSc programmes." },
      { title:"University", desc:"Complete a 3–4 year BSc degree. Consider Honours, Masters, or Medical school." },
      { title:"Career",     desc:"Work as a doctor, scientist, engineer, pharmacist, or researcher." },
    ],
    "Commerce Stream": [
      { title:"Grade 9–10", desc:"Build strong Accounting and Mathematics foundations. Aim for 60%+ in both." },
      { title:"Grade 11",   desc:"Apply for SAICA, Deloitte, Standard Bank bursaries. Research BCom programmes." },
      { title:"Grade 12",   desc:"Achieve a solid NSC pass. Apply for BCom Accounting, Finance, or Economics." },
      { title:"University", desc:"Complete a 3-year BCom. Consider SAICA articles for the CA(SA) designation." },
      { title:"Career",     desc:"Work as an accountant, financial analyst, entrepreneur, or economist." },
    ],
    "Humanities Stream": [
      { title:"Grade 9–10", desc:"Develop your language, writing, and communication skills. Read widely." },
      { title:"Grade 11",   desc:"Apply for NSFAS and Department of Social Development bursaries." },
      { title:"Grade 12",   desc:"Apply for BA, BJourn, BSW, or BEd programmes at your chosen university." },
      { title:"University", desc:"Complete your 3–4 year degree. Get practical experience through internships." },
      { title:"Career",     desc:"Work as a journalist, teacher, social worker, lawyer, or psychologist." },
    ],
    "Engineering / Technical Stream": [
      { title:"Grade 9–10", desc:"Excel in Technical Maths, Technical Sciences, and EGD. Join robotics or electronics clubs." },
      { title:"Grade 11",   desc:"Apply for Eskom, Transnet, ECSA, and NSFAS bursaries." },
      { title:"Grade 12",   desc:"Apply for BSc Engineering at Wits/UP or ND Engineering at TUT/CPUT/DUT." },
      { title:"University / TVET", desc:"Complete your degree or N1–N6 TVET qualification. Do workplace experience." },
      { title:"Career",     desc:"Work as a civil, electrical, or mechanical engineer, IT technician, or technologist." },
    ],
  };
  return maps[stream] || [];
}

function getStudyTips(stream, student) {
  const base = [
    { emoji:"📅", text:"Create a weekly study timetable and stick to it — consistency beats cramming." },
    { emoji:"🙋", text:"Ask your teacher for help as soon as you don't understand something. Don't wait." },
    { emoji:"📱", text:"Use free apps like Khan Academy, Maths Genie, and YouTube for extra explanations." },
    { emoji:"👥", text:"Form a study group with classmates — teaching others is one of the best ways to learn." },
  ];
  const extra = {
    "Science Stream":                 [{ emoji:"🔬", text:"Do past papers for Maths and Science from Grade 10 onwards — patterns repeat." }],
    "Commerce Stream":                [{ emoji:"💹", text:"Follow the news about business and finance — real world context makes Accounting click." }],
    "Humanities Stream":              [{ emoji:"✍️", text:"Write practice essays regularly. Ask your teacher to mark them for feedback." }],
    "Engineering / Technical Stream": [{ emoji:"🔧", text:"Build things! Even small hobby projects with electronics or wood teach you more than textbooks." }],
  };
  return [...base, ...(extra[stream] || [])];
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const s = {
  page:          { minHeight:"100vh", background:"#f0f4ff", fontFamily:"'Segoe UI',sans-serif", paddingBottom:40 },
  banner:        { padding:"0 0 0" },
  bannerInner:   { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"28px 32px", flexWrap:"wrap", gap:16 },
  bannerLeft:    { display:"flex", alignItems:"center", gap:16 },
  bannerIcon:    { fontSize:52 },
  bannerLabel:   { fontSize:13, color:"rgba(255,255,255,.8)", margin:"0 0 4px" },
  bannerStream:  { fontSize:28, fontWeight:900, color:"#fff", margin:0 },
  bannerAps:     { fontSize:13, color:"rgba(255,255,255,.8)", margin:"4px 0 0" },
  pdfBtn:        { padding:"12px 24px", background:"rgba(255,255,255,.15)", border:"2px solid rgba(255,255,255,.6)", color:"#fff", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", backdropFilter:"blur(4px)" },
  dlError:       { color:"rgba(255,255,255,.9)", fontSize:13, padding:"0 32px 16px", background:"rgba(0,0,0,.2)", margin:0 },
  nav:           { display:"flex", background:"#fff", borderBottom:"1px solid #e2e8f0", overflowX:"auto" },
  navBtn:        { padding:"14px 20px", border:"none", borderBottom:"3px solid transparent", background:"transparent", fontSize:14, fontWeight:600, color:"#6b7280", cursor:"pointer", whiteSpace:"nowrap" },
  navActive:     { background:"#fff", borderBottomWidth:3, borderBottomStyle:"solid" },
  content:       { maxWidth:780, margin:"0 auto", padding:"24px 16px" },
  card:          { background:"#fff", borderRadius:16, padding:"20px 24px", marginBottom:16, boxShadow:"0 2px 12px rgba(0,0,0,.06)" },
  cardTitle:     { fontSize:15, fontWeight:700, color:"#1e293b", margin:"0 0 14px" },
  warningBox:    { background:"#fff7ed", border:"1px solid #fdba74", borderRadius:10, padding:"12px 16px", marginBottom:16, color:"#9a3412", fontSize:14 },
  infoBox:       { background:"#eff6ff", border:"1px solid #93c5fd", borderRadius:10, padding:"12px 16px", marginBottom:16, color:"#1e40af", fontSize:14 },
  barRow:        { display:"flex", alignItems:"center", gap:10, marginBottom:10 },
  barLabel:      { width:240, fontSize:13, color:"#374151", fontWeight:500, flexShrink:0 },
  barTrack:      { flex:1, height:10, background:"#f1f5f9", borderRadius:99, overflow:"hidden" },
  barFill:       { height:"100%", borderRadius:99, transition:"width .6s ease" },
  barPct:        { width:36, fontSize:13, color:"#64748b", textAlign:"right", flexShrink:0 },
  twoCol:        { display:"flex", gap:16, flexWrap:"wrap" },
  listItem:      { display:"flex", alignItems:"center", gap:8, padding:"7px 0", borderBottom:"1px solid #f1f5f9", fontSize:14, color:"#374151" },
  dot:           { width:8, height:8, borderRadius:"50%", flexShrink:0 },
  mathScoreRow:  { display:"flex", alignItems:"center", gap:20, marginBottom:16 },
  mathScoreBig:  { fontSize:48, fontWeight:900, lineHeight:1 },
  mathGrid:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  mathCard:      { background:"#f8fafc", borderRadius:10, padding:"10px 12px" },
  diffBadge:     { color:"#fff", borderRadius:99, padding:"2px 8px", fontSize:11, fontWeight:700 },
  topicTag:      { background:"#f1f5f9", color:"#475569", borderRadius:99, padding:"2px 8px", fontSize:11, fontWeight:600 },
  gradesGrid:    { display:"flex", flexWrap:"wrap", gap:10, marginBottom:14 },
  gradeChip:     { borderRadius:12, padding:"8px 14px", display:"flex", flexDirection:"column", alignItems:"center", minWidth:80 },
  apsTotal:      { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", background:"#f0f4ff", borderRadius:12, border:"1px solid #bfdbfe" },
  apsBig:        { fontSize:32, fontWeight:900, color:"#1e293b" },
  nsfasCard:     { display:"flex", gap:16, background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:16, padding:"20px", marginBottom:16, alignItems:"flex-start" },
  tipRow:        { display:"flex", alignItems:"flex-start", gap:12, padding:"10px 0", borderBottom:"1px solid #f1f5f9" },
  tipNum:        { width:26, height:26, borderRadius:"50%", background:"#6366f1", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 },
  tipText:       { fontSize:13, color:"#374151", lineHeight:1.6 },
  roadmap:       { display:"flex", flexDirection:"column", gap:0 },
  roadmapStep:   { display:"flex", gap:16, paddingBottom:16 },
  roadmapNum:    { width:32, height:32, borderRadius:"50%", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, flexShrink:0 },
  roadmapContent:{ paddingBottom:16, borderLeft:"2px dashed #e2e8f0", paddingLeft:16, flex:1 },
  roadmapTitle:  { fontWeight:700, fontSize:14, color:"#1e293b", margin:"4px 0 2px" },
  roadmapDesc:   { fontSize:13, color:"#6b7280", margin:0, lineHeight:1.6 },
  retakeBtn:     { display:"block", margin:"24px auto 0", padding:"14px 40px", background:"#1e293b", color:"#fff", border:"none", borderRadius:14, fontWeight:700, fontSize:15, cursor:"pointer" },
};
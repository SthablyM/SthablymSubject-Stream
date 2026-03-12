// src/components/EnhancedResults.js
// Drop-in replacement for the inline Results component in Quiz.js
// Usage: import EnhancedResults from "./EnhancedResults"
//        <EnhancedResults streamScores={...} mathResults={...} student={...} />

import React, { useState } from "react";
import UniversityFinder from "./UniversityFinder";
import StablymLogo from "./StablymLogoComponent";
import PastPapersQuiz from "./PastPapersQuiz";

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

  const isHighSchool = parseInt(student?.grade) >= 10;

  const NAV = [
    { id:"results",      label:"📊 Results"           },
    { id:"universities", label:"🏫 What Can I Study?" },
    { id:"bursaries",    label:"💰 Bursaries"          },
    { id:"advice",       label:"💡 Advice"             },
    ...(isHighSchool ? [{ id:"pastpapers", label:"📝 Past Papers Quiz" }] : []),
    { id:"teacher",      label:"🎓 Teacher Portal"    },
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
                {parseInt(student?.grade) >= 10
                  ? `Grade ${student.grade} — Your Subject Stream`
                  : student?.name ? `${student.name}'s Recommended Stream` : "Your Recommended Stream"}
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

      <div style={{ ...s.content, maxWidth: activeSection === "teacher" ? 1100 : 780 }}>

        {/* ══ RESULTS TAB ══════════════════════════════════════════════════════ */}
        {activeSection === "results" && (
          <div>
            {parseInt(student?.grade) >= 10 && (
              <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ fontSize:22, flexShrink:0 }}>ℹ️</span>
                <div>
                  <b style={{ fontSize:14, color:"#1e40af" }}>Grade {student.grade} Student</b>
                  <p style={{ margin:"4px 0 0", fontSize:13, color:"#1e40af", lineHeight:1.6 }}>
                    Your stream was identified from your subject marks. The <b>"What Can I Study?"</b> tab shows all university programmes you currently qualify for based on your APS of <b>{student.aps}/42</b>.
                  </p>
                </div>
              </div>
            )}
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
          <UniversityFinder stream={topStream} aps={student?.aps || 0} marks={student?.marks || {}} />
        )}

        {/* ══ BURSARIES TAB ════════════════════════════════════════════════════ */}
        {activeSection === "bursaries" && (
          <div>
            <div style={s.nsfasCard}>
              <span style={{ fontSize:32 }}>🎯</span>
              <div>
                <h3 style={{ margin:"0 0 4px", color:"#713f12" }}>Apply for NSFAS First!</h3>
                <p style={{ margin:0, fontSize:13, color:"#713f12", lineHeight:1.6 }}>
                  NSFAS (National Student Financial Aid Scheme) covers <b>full tuition, accommodation, and meals</b> for qualifying students at public universities and TVET colleges. Apply at <a href="https://nsfas.org.za" target="_blank" rel="noopener noreferrer" style={{color:"#92400e",fontWeight:700}}>nsfas.org.za ↗</a> before January each year.
                </p>
              </div>
            </div>

            <UniversityFinder stream={topStream} aps={student?.aps || 0} marks={student?.marks || {}} />

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

        {/* ══ PAST PAPERS TAB ══════════════════════════════════════════════════ */}
        {activeSection === "pastpapers" && isHighSchool && (
          <PastPapersQuiz student={student} onBack={() => setActiveSection("results")} />
        )}

        {/* ══ TEACHER PORTAL TAB ═══════════════════════════════════════════════ */}
        {activeSection === "teacher" && (
          <TeacherPortal student={student} streamColor={info.color} />
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

// ─── TEACHER PORTAL COMPONENT ────────────────────────────────────────────────
// Self-contained — no imports needed. Embedded directly in EnhancedResults.

const TP_SUBJECTS = [
  { id:"english",        label:"English HL / FAL",             required:true  },
  { id:"puremaths",      label:"Mathematics",                  group:"maths"  },
  { id:"techmaths",      label:"Technical Mathematics",        group:"maths"  },
  { id:"mathslit",       label:"Mathematical Literacy",        group:"maths"  },
  { id:"lifeorien",      label:"Life Orientation",             lo:true        },
  { id:"physscience",    label:"Physical Sciences"                            },
  { id:"lifescience",    label:"Life Sciences"                                },
  { id:"accounting",     label:"Accounting"                                   },
  { id:"business",       label:"Business Studies"                             },
  { id:"economics",      label:"Economics"                                    },
  { id:"history",        label:"History"                                      },
  { id:"geography",      label:"Geography"                                    },
  { id:"tourism",        label:"Tourism"                                      },
  { id:"techscience",    label:"Technical Sciences"                           },
  { id:"civiltech",      label:"Civil Technology"                             },
  { id:"electricaltech", label:"Electrical Technology"                        },
  { id:"mechanicaltech", label:"Mechanical Technology"                        },
  { id:"egd",            label:"Engineering Graphics & Design"                },
  { id:"itcs",           label:"IT / Computer Science"                        },
];

const TP_APS_CAREERS = [
  { career:"Medicine (MBChB)",         aps:36, unis:"UCT, Wits, UP, SMU"        },
  { career:"Engineering (BSc Eng)",    aps:32, unis:"Wits, UCT, UP, UJ, TUT"    },
  { career:"Pharmacy (BPharm)",        aps:32, unis:"UP, UKZN, NWU, UWC"        },
  { career:"Law (LLB)",                aps:30, unis:"UCT, Wits, UP, UWC"        },
  { career:"Accounting (BCom CA)",     aps:28, unis:"Wits, UCT, UP, UJ, UNISA"  },
  { career:"IT / Computer Science",    aps:28, unis:"Wits, UCT, UNISA, CPUT"    },
  { career:"Education (BEd)",          aps:24, unis:"UNISA, UJ, UKZN, NWU"      },
  { career:"Social Work (BSW)",        aps:22, unis:"UNISA, UWC, UKZN"          },
  { career:"N-Diploma (TVET)",         aps:18, unis:"Any TVET College"           },
];

const tp_markToAPS   = m => m>=80?7:m>=70?6:m>=60?5:m>=50?4:m>=40?3:m>=30?2:1;
const tp_symbolLabel = m => m>=80?"A":m>=70?"B":m>=60?"C":m>=50?"D":m>=40?"E":m>=30?"F":"G";
const tp_apsColor    = a => a>=6?"#16a34a":a>=5?"#22c55e":a>=4?"#d97706":a>=3?"#f97316":a>=2?"#dc2626":"#94a3b8";
const tp_apsLabel    = a => a>=6?"Excellent":a>=4?"Satisfactory":a>=2?"Not yet achieved":"–";

const tp_calcAPS = marks => {
  const pts = TP_SUBJECTS
    .filter(s => !s.lo && typeof marks[s.id]==="number" && marks[s.id]>0)
    .map(s => tp_markToAPS(marks[s.id]));
  pts.sort((a,b)=>b-a);
  return pts.slice(0,6).reduce((t,x)=>t+x,0);
};

const tp_mathsLabel = marks =>
  typeof marks.puremaths==="number" ? "Pure Mathematics" :
  typeof marks.techmaths==="number" ? "Technical Mathematics" :
  typeof marks.mathslit==="number"  ? "Mathematical Literacy" : "–";

const TP_INITIAL_STUDENTS = [
  { id:1, name:"Student 1", grade:9,  marks:{}, examRecords:[] },
  { id:2, name:"Student 2", grade:10, marks:{}, examRecords:[] },
  { id:3, name:"Student 3", grade:11, marks:{}, examRecords:[] },
];

function TeacherPortal({ student: quizStudent, streamColor }) {
  const [students, setStudents] = React.useState(() => {
    // Pre-populate with the current quiz student if they have a name
    if (quizStudent?.name) {
      return [{
        id: 1,
        name: quizStudent.name,
        grade: parseInt(quizStudent.grade) || 9,
        marks: quizStudent.marks || {},
        examRecords: [],
        stream: null,
      }, ...TP_INITIAL_STUDENTS.slice(1)];
    }
    return TP_INITIAL_STUDENTS;
  });

  const [selected,  setSelected]  = React.useState(null);
  const [tab,       setTab]       = React.useState("marks");
  const [newName,   setNewName]   = React.useState("");
  const [newGrade,  setNewGrade]  = React.useState("9");
  const [adding,    setAdding]    = React.useState(false);

  const student = students.find(s => s.id === selected);

  const updateStudent = (id, fn) =>
    setStudents(ss => ss.map(s => s.id===id ? fn(s) : s));

  const setMark = (id, subId, val) => updateStudent(id, s => ({
    ...s, marks: { ...s.marks,
      [subId]: val===undefined ? undefined : Math.min(100, Math.max(0, parseInt(val)||0)) }
  }));

  const addExamRecord = (id, rec) => updateStudent(id, s => ({
    ...s, examRecords: [...(s.examRecords||[]), rec]
  }));

  const addStudent = () => {
    if (!newName.trim()) return;
    setStudents(ss => [...ss, {
      id: Date.now(), name: newName.trim(), grade: parseInt(newGrade), marks:{}, examRecords:[]
    }]);
    setNewName(""); setAdding(false);
  };

  const openStudent = id => { setSelected(id); setTab("marks"); };

  const color = streamColor || "#2563eb";

  // ── Styles (scoped with tp_ prefix to avoid collisions) ──
  const tpCard  = { background:"#fff", borderRadius:14, padding:"18px 22px", marginBottom:14, boxShadow:"0 1px 6px rgba(0,0,0,.07)", border:"1px solid #f1f5f9" };
  const tpInp   = { padding:"9px 12px", border:"2px solid #e2e8f0", borderRadius:8, fontSize:13, outline:"none", fontFamily:"inherit", background:"#f8fafc", width:"100%", color:"#1e293b" };
  const tpInpE  = { ...tpInp, borderColor:"#fca5a5", background:"#fff5f5" };
  const tpBtn   = (bg, col="#fff") => ({ padding:"9px 20px", background:bg, color:col, border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" });

  return (
    <div style={{ fontFamily:"'Segoe UI',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background:"linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius:16, padding:"22px 28px", marginBottom:22, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:900, color:"#38bdf8", letterSpacing:"-1px" }}>Teacher Portal</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginTop:3 }}>Enter student marks · Record exams · Print APS reports</div>
        </div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          {[
            { label:"Students",       value:students.length,                                                                     color:"#38bdf8" },
            { label:"Marks Entered",  value:students.filter(s=>Object.values(s.marks).some(v=>typeof v==="number")).length,      color:"#4ade80" },
            { label:"Exams Recorded", value:students.filter(s=>s.examRecords?.length>0).length,                                  color:"#a78bfa" },
          ].map(({label,value,color:c}) => (
            <div key={label} style={{ background:"rgba(255,255,255,.08)", borderRadius:10, padding:"10px 18px", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:900, color:c }}>{value}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ROSTER VIEW ── */}
      {!selected && (
        <div>
          {/* Add student row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:700, color:"#1e293b" }}>Class Roster ({students.length} students)</span>
            <button style={tpBtn(color)} onClick={()=>setAdding(v=>!v)}>
              {adding ? "✕ Cancel" : "+ Add Student"}
            </button>
          </div>

          {adding && (
            <div style={{ display:"flex", gap:10, marginBottom:14, background:"#fff", padding:"14px", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>
              <input style={{ ...tpInp, flex:1 }} placeholder="Student full name"
                value={newName} onChange={e=>setNewName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addStudent()} />
              <select style={{ ...tpInp, width:120 }} value={newGrade} onChange={e=>setNewGrade(e.target.value)}>
                {[8,9,10,11,12].map(g=><option key={g} value={g}>Grade {g}</option>)}
              </select>
              <button style={tpBtn("#16a34a")} onClick={addStudent}>Save</button>
            </div>
          )}

          {/* Roster table */}
          <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,.07)", border:"1px solid #f1f5f9" }}>
            <div style={{ display:"grid", gridTemplateColumns:"2fr .7fr 1.2fr 1fr 1.2fr .8fr", padding:"10px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
              {["Student","Grade","Marks","APS","Exam Records",""].map(h => (
                <span key={h} style={{ fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".5px" }}>{h}</span>
              ))}
            </div>
            {students.map((st, i) => {
              const aps     = tp_calcAPS(st.marks);
              const entered = Object.values(st.marks).filter(v=>typeof v==="number"&&v>=0).length;
              const apsCol  = aps>=30?"#16a34a":aps>=22?"#d97706":aps>0?"#dc2626":null;
              return (
                <div key={st.id} style={{ display:"grid", gridTemplateColumns:"2fr .7fr 1.2fr 1fr 1.2fr .8fr",
                  padding:"12px 18px", borderBottom:i<students.length-1?"1px solid #f8fafc":"none",
                  alignItems:"center", background:i%2===0?"#fff":"#fafbfc" }}>
                  <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{st.name}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:color, background:color+"15", padding:"2px 9px", borderRadius:99, display:"inline-block" }}>Gr {st.grade}</span>
                  <span style={{ fontSize:13, color:entered>0?"#16a34a":"#94a3b8", fontWeight:600 }}>{entered>0?`${entered} subjects`:"—"}</span>
                  <span>
                    {aps>0
                      ? <span style={{ background:apsCol+"15", color:apsCol, fontWeight:800, padding:"3px 10px", borderRadius:99, fontSize:13, border:`1px solid ${apsCol}30` }}>{aps}/42</span>
                      : <span style={{ color:"#94a3b8",fontSize:13 }}>—</span>}
                  </span>
                  <span style={{ fontSize:13, color:st.examRecords?.length>0?"#7c3aed":"#94a3b8", fontWeight:600 }}>
                    {st.examRecords?.length>0?`✓ ${st.examRecords.length} recorded`:"None yet"}
                  </span>
                  <button onClick={()=>openStudent(st.id)}
                    style={{ padding:"6px 12px", background:"#eff6ff", color:color, border:`1.5px solid ${color}40`, borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                    Open →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STUDENT DETAIL VIEW ── */}
      {selected && student && (
        <div>
          {/* Back + student header */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
            <button onClick={()=>setSelected(null)} style={{ padding:"7px 14px", background:"#f1f5f9", color:"#334155", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>← Back</button>
            <div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#0f172a", margin:0 }}>{student.name}</h3>
              <span style={{ fontSize:13, color:"#64748b" }}>Grade {student.grade} · APS: <b style={{ color }}>{tp_calcAPS(student.marks)||"–"}/42</b></span>
            </div>
          </div>

          {/* Sub-tabs */}
          <div style={{ display:"flex", gap:3, background:"#f1f5f9", padding:3, borderRadius:11, marginBottom:22, width:"fit-content" }}>
            {[
              {t:"marks",  label:"📝 Enter Marks"  },
              {t:"exam",   label:"🔒 Exam Records" },
              {t:"report", label:"📄 Print Report" },
            ].map(({t,label}) => (
              <button key={t} onClick={()=>setTab(t)}
                style={{ padding:"9px 18px", border:"none", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer",
                  background:tab===t?"#fff":"transparent", color:tab===t?"#0f172a":"#64748b",
                  boxShadow:tab===t?"0 1px 4px rgba(0,0,0,.1)":"none" }}>
                {label}
              </button>
            ))}
          </div>

          {tab==="marks"  && <TP_MarksPanel  student={student} onSetMark={(sub,val)=>setMark(student.id,sub,val)} color={color} tpCard={tpCard} tpInp={tpInp} />}
          {tab==="exam"   && <TP_ExamPanel   student={student} onAdd={rec=>addExamRecord(student.id,rec)} color={color} tpCard={tpCard} tpInp={tpInp} tpInpE={tpInpE} />}
          {tab==="report" && <TP_ReportPanel student={student} color={color} />}
        </div>
      )}
    </div>
  );
}

// ── Marks Panel ───────────────────────────────────────────────────────────────
function TP_MarksPanel({ student, onSetMark, color, tpCard }) {
  const { marks } = student;
  const aps = tp_calcAPS(marks);
  const pct = Math.min(100, Math.round((aps/42)*100));
  const barCol = aps>=30?"#16a34a":aps>=22?"#f59e0b":"#dc2626";

  return (
    <div>
      {aps > 0 && (
        <div style={{ ...tpCard, background:"linear-gradient(135deg,#eff6ff,#f0fdf4)", border:"1px solid #bfdbfe", marginBottom:16 }}>
          <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:"#1e40af", letterSpacing:"1px", textTransform:"uppercase" }}>Live APS Score</div>
              <div style={{ fontSize:52, fontWeight:900, color:"#0f172a", lineHeight:1.1 }}>
                {aps}<span style={{ fontSize:18, color:"#94a3b8", fontWeight:400 }}>/42</span>
              </div>
              <div style={{ fontSize:12, color:"#64748b" }}>Best 6 · LO excluded · {tp_mathsLabel(marks)}</div>
            </div>
            <div style={{ flex:1, minWidth:160 }}>
              <div style={{ height:10, background:"#e2e8f0", borderRadius:99, overflow:"hidden", marginBottom:6 }}>
                <div style={{ height:"100%", width:`${pct}%`, background:barCol, borderRadius:99, transition:"width .5s" }}/>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:barCol }}>
                {aps>=30?"🟢 Strong — most universities open":aps>=22?"🟡 Good — many programmes available":"🔴 Needs improvement"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:"0 1px 6px rgba(0,0,0,.07)", border:"1px solid #f1f5f9" }}>
        {TP_SUBJECTS.map((sub, i) => {
          const val    = marks[sub.id];
          const numVal = typeof val==="number" && val>=0 ? val : null;
          const apsVal = numVal!==null && !sub.lo ? tp_markToAPS(numVal) : null;
          const sym    = numVal!==null ? tp_symbolLabel(numVal) : null;
          const ac     = apsVal ? tp_apsColor(apsVal) : "#e2e8f0";

          return (
            <div key={sub.id} style={{ display:"flex", alignItems:"center", padding:"9px 16px",
              borderBottom:i<TP_SUBJECTS.length-1?"1px solid #f8fafc":"none",
              background:i%2===0?"#fff":"#fafbfc", opacity:sub.lo?.65:1 }}>
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{sub.label}</span>
                {sub.required && <span style={{ fontSize:9, color:"#dc2626", fontWeight:800 }}>★</span>}
                {sub.lo && <span style={{ fontSize:10, color:"#94a3b8", fontStyle:"italic" }}>not in APS</span>}
                {sub.group==="maths" && <span style={{ fontSize:10, background:"#ede9fe", color:"#6d28d9", padding:"1px 7px", borderRadius:99, fontWeight:700 }}>choose 1</span>}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                <input type="number" min="0" max="100" placeholder="%" value={numVal??""} 
                  onChange={e=>{
                    const v=e.target.value;
                    onSetMark(sub.id, v===""?undefined:Math.min(100,Math.max(0,parseInt(v)||0)));
                  }}
                  style={{ width:64, padding:"6px 8px", border:`2px solid ${numVal!==null?ac:"#e2e8f0"}`,
                    borderRadius:8, fontSize:14, textAlign:"center", outline:"none",
                    fontWeight:700, background:"#f8fafc", transition:"border-color .2s" }}
                />
                {apsVal!==null && numVal!==null && (
                  <div style={{ background:ac+"15", border:`1.5px solid ${ac}`, borderRadius:8,
                    padding:"3px 9px", display:"flex", alignItems:"center", gap:5, minWidth:70 }}>
                    <span style={{ fontSize:15, fontWeight:900, color:ac }}>{sym}</span>
                    <span style={{ fontSize:11, color:ac, fontWeight:700 }}>APS {apsVal}</span>
                  </div>
                )}
                {sub.lo && numVal!==null && <span style={{ fontSize:11, color:"#94a3b8", minWidth:70 }}>LO ✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Symbol key */}
      <div style={{ marginTop:16, background:"#f8fafc", borderRadius:12, padding:"14px 18px", border:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#475569", marginBottom:10, textTransform:"uppercase", letterSpacing:".5px" }}>NSC Symbol Scale</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[[80,"A",7],[70,"B",6],[60,"C",5],[50,"D",4],[40,"E",3],[30,"F",2],[0,"G",1]].map(([p,sy,a]) => (
            <div key={sy} style={{ textAlign:"center", background:"#fff", border:`1.5px solid ${tp_apsColor(a)}`,
              borderRadius:10, padding:"6px 12px", minWidth:56 }}>
              <div style={{ fontSize:17, fontWeight:900, color:tp_apsColor(a) }}>{sy}</div>
              <div style={{ fontSize:10, color:"#94a3b8" }}>{p}%+</div>
              <div style={{ fontSize:10, fontWeight:700, color:tp_apsColor(a) }}>APS {a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Exam Records Panel ────────────────────────────────────────────────────────
function TP_ExamPanel({ student, onAdd, color, tpCard, tpInp, tpInpE }) {
  const blank = { date:"", subject:"", paper:"1", venue:"", duration:"3 hours", invigilator:"", confirmed:false, incidents:"" };
  const [form,     setForm]     = React.useState(blank);
  const [showForm, setShowForm] = React.useState(false);
  const [errors,   setErrors]   = React.useState({});

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e={};
    if(!form.date)               e.date="Required";
    if(!form.subject)            e.subject="Required";
    if(!form.venue.trim())       e.venue="Required";
    if(!form.invigilator.trim()) e.invigilator="Required";
    if(!form.confirmed)          e.confirmed="You must tick the declaration to submit";
    setErrors(e); return Object.keys(e).length===0;
  };

  const save = () => {
    if(!validate()) return;
    onAdd({ ...form, id:Date.now(), recordedAt:new Date().toLocaleString("en-ZA",{dateStyle:"medium",timeStyle:"short"}) });
    setForm(blank); setShowForm(false); setErrors({});
  };

  const recs = student.examRecords || [];

  return (
    <div>
      <div style={{ marginBottom:16 }}>
        <h4 style={{ fontSize:16, fontWeight:800, color:"#1e293b", margin:"0 0 4px" }}>🔒 Exam Invigilation Records</h4>
        <p style={{ fontSize:13, color:"#64748b", margin:0 }}>
          Each record is timestamped and signed off by the invigilator — preventing mark disputes and confirming the student wrote the exam fairly.
        </p>
      </div>

      <div style={{ background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:20 }}>🛡️</span>
        <div style={{ fontSize:13, color:"#92400e" }}>
          <b>Anti-Cheat System:</b> Each record creates a permanent, timestamped log confirming the student was present, wrote independently, and no irregularities occurred. These records support mark validation and dispute resolution.
        </div>
      </div>

      {recs.length===0 && (
        <div style={{ background:"#f8fafc", border:"2px dashed #e2e8f0", borderRadius:14, padding:"36px 20px", textAlign:"center", marginBottom:14 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📋</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#64748b" }}>No exam records yet</div>
          <div style={{ fontSize:13, color:"#94a3b8" }}>Add a record each time this student writes an exam</div>
        </div>
      )}

      {recs.map((rec, i) => (
        <div key={rec.id} style={{ ...tpCard, marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div>
              <span style={{ fontWeight:800, fontSize:14, color:"#1e293b" }}>{rec.subject} — Paper {rec.paper}</span>
              <span style={{ marginLeft:10, fontSize:12, color:"#64748b" }}>📅 {rec.date}</span>
            </div>
            <span style={{ background:"#d1fae5", color:"#065f46", fontWeight:700, fontSize:11, padding:"3px 10px", borderRadius:99 }}>✓ Verified</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 16px", fontSize:13, marginBottom:8 }}>
            {[["Venue",rec.venue],["Duration",rec.duration],["Invigilator",rec.invigilator],["Recorded",rec.recordedAt]].map(([k,v])=>(
              <div key={k}><span style={{ color:"#94a3b8" }}>{k}: </span><b style={{ color:"#1e293b" }}>{v}</b></div>
            ))}
          </div>
          {rec.incidents && (
            <div style={{ background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#92400e", marginBottom:8 }}>⚠️ <b>Incident:</b> {rec.incidents}</div>
          )}
          <div style={{ fontSize:11, color:"#94a3b8", fontStyle:"italic", borderTop:"1px solid #f1f5f9", paddingTop:8 }}>
            "{rec.invigilator} confirmed {student.name} was present and wrote this exam under supervision with no irregularities{rec.incidents?" (see incident above)":""}."
          </div>
        </div>
      ))}

      {!showForm && (
        <button onClick={()=>setShowForm(true)}
          style={{ padding:"11px 22px", background:"#7c3aed", color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", marginTop:4 }}>
          + Record New Exam
        </button>
      )}

      {showForm && (
        <div style={{ ...tpCard, border:"1.5px solid #e2e8f0", marginTop:14 }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#1e293b", marginBottom:18 }}>📝 New Invigilation Record — {student.name}</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            {[
              { label:"Exam Date *",        err:errors.date,         el:<input style={errors.date?tpInpE:tpInp} type="date" value={form.date} onChange={e=>set("date",e.target.value)} /> },
              { label:"Subject *",          err:errors.subject,      el:<select style={errors.subject?tpInpE:tpInp} value={form.subject} onChange={e=>set("subject",e.target.value)}>
                  <option value="">Select subject...</option>
                  {TP_SUBJECTS.map(s=><option key={s.id} value={s.label}>{s.label}</option>)}
                </select> },
              { label:"Paper",              err:null,                el:<select style={tpInp} value={form.paper} onChange={e=>set("paper",e.target.value)}>
                  {["1","2","3","Practical","SBA / Portfolio"].map(p=><option key={p} value={p}>Paper {p}</option>)}
                </select> },
              { label:"Duration",           err:null,                el:<select style={tpInp} value={form.duration} onChange={e=>set("duration",e.target.value)}>
                  {["1 hour","1.5 hours","2 hours","2.5 hours","3 hours","3.5 hours"].map(d=><option key={d}>{d}</option>)}
                </select> },
              { label:"Exam Venue *",       err:errors.venue,        el:<input style={errors.venue?tpInpE:tpInp} placeholder="e.g. Hall B, Room 14" value={form.venue} onChange={e=>set("venue",e.target.value)} /> },
              { label:"Invigilator Name *", err:errors.invigilator,  el:<input style={errors.invigilator?tpInpE:tpInp} placeholder="Full name of teacher on duty" value={form.invigilator} onChange={e=>set("invigilator",e.target.value)} /> },
            ].map(({label,err,el}) => (
              <div key={label} style={{ display:"flex", flexDirection:"column", gap:5 }}>
                <label style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".5px" }}>{label}</label>
                {el}
                {err && <span style={{ fontSize:11, color:"#dc2626" }}>⚠ {err}</span>}
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".5px" }}>Incidents / Irregularities</label>
            <textarea style={{ ...tpInp, height:72, resize:"vertical" }}
              placeholder="Leave blank if exam ran normally. Note any incidents here."
              value={form.incidents} onChange={e=>set("incidents",e.target.value)} />
          </div>

          {/* Declaration */}
          <div style={{ background:errors.confirmed?"#fff5f5":"#f0fdf4", border:`2px solid ${errors.confirmed?"#fca5a5":"#bbf7d0"}`, borderRadius:12, padding:"16px", marginBottom:14 }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <input type="checkbox" id="tp_decl" checked={form.confirmed} onChange={e=>set("confirmed",e.target.checked)}
                style={{ width:18, height:18, marginTop:2, accentColor:"#16a34a", flexShrink:0, cursor:"pointer" }} />
              <label htmlFor="tp_decl" style={{ fontSize:13, color:"#1e293b", cursor:"pointer", lineHeight:1.7 }}>
                <b>📋 Invigilator Declaration:</b> I, <b style={{ color:"#1e40af" }}>{form.invigilator||"[invigilator]"}</b>, confirm that{" "}
                <b>{student.name}</b> was present and wrote <b>{form.subject||"[subject]"}</b> (Paper {form.paper}) on{" "}
                <b>{form.date||"[date]"}</b> at <b>{form.venue||"[venue]"}</b> for <b>{form.duration}</b>.
                The exam was conducted under my supervision. The student's work is their own.
                No irregularities occurred{form.incidents?" (except as noted)":""}.
                <b style={{ color:"#dc2626" }}> This declaration will be attached to the student's record.</b>
              </label>
            </div>
            {errors.confirmed && <div style={{ fontSize:12, color:"#dc2626", marginTop:8, paddingLeft:30 }}>⚠ {errors.confirmed}</div>}
          </div>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={save} style={{ padding:"10px 22px", background:"#16a34a", color:"#fff", border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>✓ Save Record</button>
            <button onClick={()=>{setShowForm(false);setErrors({});setForm(blank);}} style={{ padding:"10px 18px", background:"#f1f5f9", color:"#334155", border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Report Panel ──────────────────────────────────────────────────────────────
function TP_ReportPanel({ student, color }) {
  const { marks, examRecords } = student;
  const aps  = tp_calcAPS(marks);
  const date = new Date().toLocaleDateString("en-ZA",{year:"numeric",month:"long",day:"numeric"});
  const entered = TP_SUBJECTS.filter(s => typeof marks[s.id]==="number" && marks[s.id]>=0);

  return (
    <div>
      <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:20 }}>
        <button onClick={()=>window.print()}
          style={{ padding:"12px 22px", background:"#0f172a", color:"#fff", border:"none", borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          🖨️ Print / Save as PDF
        </button>
        <span style={{ fontSize:13, color:"#64748b" }}>Use your browser print dialog → choose "Save as PDF"</span>
      </div>

      {/* ── Printable Report ── */}
      <div style={{ background:"#fff", borderRadius:16, padding:"36px", maxWidth:820, boxShadow:"0 4px 24px rgba(0,0,0,.09)", border:"1px solid #e2e8f0" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#0f172a,#1e3a5f)", borderRadius:12, padding:"26px 30px", marginBottom:26 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:"#38bdf8", letterSpacing:"-1px" }}>STABLYM</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.45)", letterSpacing:"3px", textTransform:"uppercase" }}>Student Academic Report</div>
            </div>
            <div style={{ textAlign:"right", fontSize:12, color:"rgba(255,255,255,.55)" }}>
              <div>{date}</div><div style={{ marginTop:3 }}>Confidential · School Use Only</div>
            </div>
          </div>
          <div style={{ marginTop:18, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.1)" }}>
            <div style={{ fontSize:22, fontWeight:800, color:"#fff" }}>{student.name}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginTop:4 }}>
              Grade {student.grade} · {tp_mathsLabel(marks)} · {examRecords?.length||0} exam records on file
            </div>
          </div>
        </div>

        {/* APS block */}
        <div style={{ display:"flex", gap:22, background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:12, padding:"20px 24px", marginBottom:24, flexWrap:"wrap" }}>
          <div style={{ flex:2, minWidth:180 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#1e40af", textTransform:"uppercase", letterSpacing:"1px" }}>Estimated APS Score</div>
            <div style={{ fontSize:58, fontWeight:900, color:"#0f172a", lineHeight:1, margin:"6px 0" }}>
              {aps>0?aps:"—"}<span style={{ fontSize:22, color:"#94a3b8", fontWeight:400 }}>/42</span>
            </div>
            <div style={{ fontSize:12, color:"#64748b" }}>Best 6 subjects · LO excluded · {tp_mathsLabel(marks)}</div>
            {aps>0 && (
              <div style={{ marginTop:10, display:"inline-block", fontWeight:700, fontSize:13, padding:"5px 14px", borderRadius:8,
                background:aps>=30?"#d1fae5":aps>=22?"#fef3c7":"#fee2e2",
                color:aps>=30?"#065f46":aps>=22?"#92400e":"#991b1b" }}>
                {aps>=30?"🟢 Strong":"🟡 Good" /* simplified */}
              </div>
            )}
          </div>
          <div style={{ flex:1, minWidth:148, borderLeft:"1px solid #e2e8f0", paddingLeft:22 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:8, textTransform:"uppercase" }}>APS Scale</div>
            {[[7,"A","80%+"],[6,"B","70–79%"],[5,"C","60–69%"],[4,"D","50–59%"],[3,"E","40–49%"],[2,"F","30–39%"],[1,"G","0–29%"]].map(([a,sy,rng])=>(
              <div key={a} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                <span style={{ width:20, height:20, borderRadius:5, background:tp_apsColor(a)+"20", border:`1.5px solid ${tp_apsColor(a)}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:tp_apsColor(a), flexShrink:0 }}>{sy}</span>
                <span style={{ fontSize:11, color:"#64748b", flex:1 }}>{rng}</span>
                <span style={{ fontSize:11, fontWeight:700, color:tp_apsColor(a) }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject marks */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:12, paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>📝 Subject Results</div>
          {entered.length===0
            ? <div style={{ color:"#94a3b8", fontSize:13 }}>No marks entered yet.</div>
            : (
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#f1f5f9" }}>
                    {["Subject","Mark (%)","Symbol","APS Points","Status"].map(h=>(
                      <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", border:"1px solid #e2e8f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entered.map((sub,i)=>{
                    const m=marks[sub.id]; const a=sub.lo?null:tp_markToAPS(m); const c=a?tp_apsColor(a):"#94a3b8";
                    return (
                      <tr key={sub.id} style={{ background:i%2===0?"#f8fafc":"#fff" }}>
                        <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", fontWeight:600 }}>{sub.label}</td>
                        <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"center", fontWeight:800 }}>{m}%</td>
                        <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                          <span style={{ background:c+"18", color:c, fontWeight:800, padding:"2px 9px", borderRadius:6, fontSize:13 }}>{tp_symbolLabel(m)}</span>
                        </td>
                        <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"center", fontWeight:800, color:sub.lo?"#94a3b8":c }}>{sub.lo?"—":a}</td>
                        <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", fontSize:12, color:sub.lo?"#94a3b8":c }}>{sub.lo?"Compulsory (not in APS)":tp_apsLabel(a)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          }
        </div>

        {/* University eligibility */}
        {aps>0 && (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:8, paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>🎓 University Programme Eligibility</div>
            <div style={{ fontSize:12, color:"#64748b", marginBottom:10 }}>Based on APS of {aps}/42.</div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f1f5f9" }}>
                  {["Programme","Min APS","Universities","Status"].map(h=>(
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", border:"1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TP_APS_CAREERS.map((c,i)=>{
                  const ok=aps>=c.aps;
                  return (
                    <tr key={c.career} style={{ background:i%2===0?"#f8fafc":"#fff" }}>
                      <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", fontWeight:600 }}>{c.career}</td>
                      <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", textAlign:"center", fontWeight:700 }}>{c.aps}+</td>
                      <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", fontSize:12, color:"#64748b" }}>{c.unis}</td>
                      <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                        <span style={{ background:ok?"#d1fae5":"#fee2e2", color:ok?"#065f46":"#991b1b", fontWeight:700, padding:"2px 9px", borderRadius:6, fontSize:11 }}>
                          {ok?"✓ Qualifies":"✗ Below req."}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Exam records */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:12, paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>🔒 Exam Invigilation Records</div>
          {(!examRecords||examRecords.length===0)
            ? <div style={{ color:"#94a3b8", fontSize:13 }}>No exam records on file.</div>
            : (
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#f1f5f9" }}>
                    {["Date","Subject","Paper","Venue","Invigilator","Incidents","Verified"].map(h=>(
                      <th key={h} style={{ padding:"7px 10px", textAlign:"left", fontSize:10, fontWeight:700, color:"#64748b", textTransform:"uppercase", border:"1px solid #e2e8f0" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {examRecords.map((r,i)=>(
                    <tr key={r.id} style={{ background:i%2===0?"#f8fafc":"#fff" }}>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0" }}>{r.date}</td>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0", fontWeight:600 }}>{r.subject}</td>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0", textAlign:"center" }}>P{r.paper}</td>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0" }}>{r.venue}</td>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0", fontWeight:600 }}>{r.invigilator}</td>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0", color:r.incidents?"#92400e":"#16a34a", fontSize:11 }}>{r.incidents||"None"}</td>
                      <td style={{ padding:"7px 10px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                        <span style={{ background:"#d1fae5", color:"#065f46", fontWeight:700, padding:"2px 8px", borderRadius:6, fontSize:10 }}>✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>

        {/* Signatures */}
        <div style={{ marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:16, paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>✍️ Authorisation Signatures</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
            {["Class Teacher","Principal / HOD","Parent / Guardian"].map(r=>(
              <div key={r}>
                <div style={{ borderBottom:"2px solid #1e293b", height:42, marginBottom:6 }}></div>
                <div style={{ fontSize:12, fontWeight:700, color:"#1e293b" }}>{r}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Signature &amp; Date</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop:"1px solid #e2e8f0", marginTop:20, paddingTop:12, display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8", flexWrap:"wrap", gap:8 }}>
          <span>Stablym Teacher Portal · stablym.co.za</span>
          <span>Confidential — school use only</span>
          <span>{date}</span>
        </div>
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
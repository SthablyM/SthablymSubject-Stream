// src/components/APSCalculator.js
import React, { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// All 24 NSC subjects. Life Orientation (lo:true) is excluded from APS.
// ─────────────────────────────────────────────────────────────────────────────
export const NSC_SUBJECTS = [
  { id:"english",       label:"English HL / FAL",             lo:false, required:true  },
  { id:"afrikaans",     label:"Afrikaans HL / FAL",            lo:false                },
  { id:"isizulu",       label:"isiZulu / Sesotho / Xhosa HL",  lo:false                },
  { id:"puremaths",     label:"Mathematics (Pure)",             lo:false, group:"maths" },
  { id:"techmaths",     label:"Technical Mathematics",          lo:false, group:"maths" },
  { id:"mathslit",      label:"Mathematical Literacy",          lo:false, group:"maths" },
  { id:"physscience",   label:"Physical Sciences",              lo:false                },
  { id:"techscience",   label:"Technical Sciences",             lo:false                },
  { id:"lifescience",   label:"Life Sciences",                  lo:false                },
  { id:"accounting",    label:"Accounting",                     lo:false                },
  { id:"business",      label:"Business Studies",               lo:false                },
  { id:"economics",     label:"Economics",                      lo:false                },
  { id:"history",       label:"History",                        lo:false                },
  { id:"geography",     label:"Geography",                      lo:false                },
  { id:"tourism",       label:"Tourism",                        lo:false                },
  { id:"agroscience",   label:"Agricultural Sciences",          lo:false                },
  { id:"egd",           label:"Engineering Graphics & Design",  lo:false                },
  { id:"itcs",          label:"IT / Computer Science",          lo:false                },
  { id:"civiltech",     label:"Civil Technology",               lo:false                },
  { id:"electricaltech",label:"Electrical Technology",          lo:false                },
  { id:"drama",         label:"Dramatic Arts",                  lo:false                },
  { id:"arts",          label:"Visual Arts",                    lo:false                },
  { id:"consumer",      label:"Consumer Studies",               lo:false                },
  { id:"lifeorien",     label:"Life Orientation",               lo:true                 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers — exported so other components can import them
// ─────────────────────────────────────────────────────────────────────────────
export const markToAPS    = m => { m=Number(m); return m>=80?7:m>=70?6:m>=60?5:m>=50?4:m>=40?3:m>=30?2:1; };
export const markToSymbol = m => { m=Number(m); return m>=80?"A":m>=70?"B":m>=60?"C":m>=50?"D":m>=40?"E":m>=30?"F":"G"; };

export const calcAPS = (marks={}) => {
  const pts = NSC_SUBJECTS
    .filter(s => !s.lo && typeof marks[s.id]==="number" && marks[s.id] >= 0)
    .map(s => markToAPS(marks[s.id]));
  pts.sort((a,b)=>b-a);
  return pts.slice(0,6).reduce((t,x)=>t+x, 0);
};

export const mathsLabel = (marks={}) =>
  typeof marks.puremaths==="number"  ? "Pure Mathematics"     :
  typeof marks.techmaths==="number"  ? "Technical Mathematics" :
  typeof marks.mathslit==="number"   ? "Mathematical Literacy" : "—";

// ─────────────────────────────────────────────────────────────────────────────
// Symbol colour helpers
// ─────────────────────────────────────────────────────────────────────────────
const SYM_STYLES = {
  A:{ bg:"#d1fae5", color:"#065f46" },
  B:{ bg:"#bfdbfe", color:"#1e40af" },
  C:{ bg:"#fde68a", color:"#92400e" },
  D:{ bg:"#fed7aa", color:"#9a3412" },
  E:{ bg:"#fecaca", color:"#991b1b" },
  F:{ bg:"#fecaca", color:"#7f1d1d" },
  G:{ bg:"#f1f5f9", color:"#475569" },
};

const APS_BORDER = a => a>=6?"#16a34a":a>=4?"#d97706":"#dc2626";
const APS_TEXT   = a => a>=6?"#16a34a":a>=4?"#d97706":"#dc2626";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function APSCalculator({ onChange }) {
  const [marks, setMarks] = useState({});

  const setMark = (id, val) => {
    const cleaned = val==="" || isNaN(Number(val)) ? undefined : Math.min(100, Math.max(0, parseInt(val)));
    const next = { ...marks };
    if (cleaned===undefined) delete next[id]; else next[id]=cleaned;
    setMarks(next);
    onChange && onChange(next);
  };

  const aps  = useMemo(()=>calcAPS(marks), [marks]);
  const pct  = Math.round((aps/42)*100);
  const hasAny = Object.keys(marks).length>0;

  const statusLabel = !hasAny?"Enter your marks below":aps>=30?"🟢 Strong — most programmes open":aps>=22?"🟡 Good — many programmes available":"🔴 Needs improvement — focus on key subjects";
  const barColor    = aps>=30?"#16a34a":aps>=22?"#d97706":"#dc2626";

  return (
    <div style={s.wrap}>

      {/* ── HEADER ── */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <h2 style={s.title}>APS Calculator</h2>
          <p style={s.subtitle}>Best 6 subjects · LO excluded · DBE-official rules</p>
        </div>
        <div style={s.scoreBlock}>
          <div style={{ ...s.scoreBig, color: hasAny?barColor:"#94a3b8" }}>
            {aps}<span style={s.scoreMax}>/42</span>
          </div>
          <div style={{ fontSize:11, color:"#6b7280", textTransform:"uppercase", letterSpacing:1 }}>APS score</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={s.barTrack}>
        <div style={{ ...s.barFill, width:`${pct}%`, background:barColor, transition:"width .4s ease" }}/>
      </div>

      {/* Status */}
      <div style={{ ...s.statusBanner, borderColor:hasAny?barColor:"#e2e8f0" }}>
        {statusLabel}
      </div>

      {/* ── Symbol reference ── */}
      <div style={s.symRef}>
        {Object.entries(SYM_STYLES).map(([sym, st])=>(
          <span key={sym} style={{ ...s.symChip, background:st.bg, color:st.color }}>
            {sym} = {{"A":7,"B":6,"C":5,"D":4,"E":3,"F":2,"G":1}[sym]}
          </span>
        ))}
        <span style={s.symNote}>Mark range: A(80%+) B(70) C(60) D(50) E(40) F(30) G(&lt;30)</span>
      </div>

      {/* ── Subject table ── */}
      <div style={s.tableHead}>
        <span style={s.thCell}>Subject</span>
        <span style={{ ...s.thCell, textAlign:"center" }}>Mark %</span>
        <span style={{ ...s.thCell, textAlign:"center" }}>Symbol</span>
        <span style={{ ...s.thCell, textAlign:"right"  }}>APS</span>
      </div>

      {NSC_SUBJECTS.map((sub, i) => {
        const m   = marks[sub.id];
        const has = typeof m === "number";
        const sym = has ? markToSymbol(m) : null;
        const pts = has && !sub.lo ? markToAPS(m) : null;
        const st  = sym ? SYM_STYLES[sym] : null;

        return (
          <div key={sub.id} style={{ ...s.subRow, background:i%2===0?"#fff":"#fafbfc", opacity:sub.lo?.7:1 }}>

            <div style={s.subName}>
              {sub.label}
              {sub.lo && <span style={s.loTag}>not in APS</span>}
              {sub.group==="maths" && <span style={s.mathsTag}>choose 1</span>}
            </div>

            <input
              type="number" min="0" max="100" placeholder="%"
              value={has?m:""}
              onChange={e=>setMark(sub.id, e.target.value)}
              style={{
                ...s.markInp,
                borderColor: has ? APS_BORDER(pts||1) : "#e2e8f0",
              }}
            />

            <span style={{
              ...s.symCell,
              background: st?.bg || "#f1f5f9",
              color:       st?.color || "#94a3b8",
            }}>
              {sym||"—"}
            </span>

            <span style={{ ...s.apsCell, color: pts ? APS_TEXT(pts) : "#94a3b8" }}>
              {sub.lo ? (has?"LO":"—") : (pts||"—")}
            </span>
          </div>
        );
      })}

      {/* ── Best-6 summary ── */}
      {hasAny && (
        <div style={s.summary}>
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Subjects entered</span>
            <span style={s.summaryVal}>{Object.keys(marks).length}</span>
          </div>
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Best 6 APS total</span>
            <span style={{ ...s.summaryVal, fontSize:22, color:barColor }}>{aps} / 42</span>
          </div>
          <div style={s.summaryRow}>
            <span style={s.summaryLabel}>Mathematics level</span>
            <span style={s.summaryVal}>{mathsLabel(marks)}</span>
          </div>
          <div style={{ ...s.summaryRow, borderBottom:"none" }}>
            <span style={s.summaryLabel}>Access level</span>
            <span style={{ ...s.summaryVal, color:barColor }}>
              {aps>=30?"Strong (most universities)":aps>=22?"Good (many programmes)":aps>=18?"Basic (TVET & diplomas)":"Developing"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = {
  wrap:          { fontFamily:"'Segoe UI',sans-serif", border:"1px solid #e2e8f0", borderRadius:16, overflow:"hidden", background:"#fff" },
  header:        { background:"linear-gradient(135deg,#2563eb,#0ea5e9)", padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 },
  headerLeft:    { flex:1 },
  title:         { fontSize:20, fontWeight:800, color:"#fff", margin:0, fontFamily:"'Syne',sans-serif" },
  subtitle:      { fontSize:12, color:"rgba(255,255,255,.75)", margin:"4px 0 0" },
  scoreBlock:    { textAlign:"center", background:"rgba(255,255,255,.15)", borderRadius:12, padding:"10px 20px" },
  scoreBig:      { fontSize:38, fontWeight:900, lineHeight:1, fontFamily:"'Syne',sans-serif" },
  scoreMax:      { fontSize:16, fontWeight:400, color:"rgba(255,255,255,.6)" },
  barTrack:      { height:6, background:"#e2e8f0" },
  barFill:       { height:"100%", borderRadius:0 },
  statusBanner:  { padding:"10px 24px", fontSize:13, color:"#374151", borderLeft:"4px solid", background:"#f8fafc", fontWeight:500 },
  symRef:        { display:"flex", gap:6, flexWrap:"wrap", padding:"12px 20px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9", alignItems:"center" },
  symChip:       { fontSize:11, fontWeight:700, padding:"3px 8px", borderRadius:6 },
  symNote:       { fontSize:11, color:"#94a3b8", marginLeft:4 },
  tableHead:     { display:"grid", gridTemplateColumns:"1fr 80px 60px 40px", gap:8, padding:"8px 20px", background:"#f1f5f9", borderBottom:"1px solid #e2e8f0" },
  thCell:        { fontSize:11, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:".5px" },
  subRow:        { display:"grid", gridTemplateColumns:"1fr 80px 60px 40px", gap:8, padding:"9px 20px", alignItems:"center", borderBottom:"1px solid #f8fafc" },
  subName:       { fontSize:13, fontWeight:500, color:"#1e293b", display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" },
  loTag:         { fontSize:10, color:"#94a3b8", fontStyle:"italic", fontWeight:400 },
  mathsTag:      { fontSize:10, background:"#ede9fe", color:"#6d28d9", padding:"1px 7px", borderRadius:99, fontWeight:700 },
  markInp:       { width:"100%", padding:"7px 6px", border:"1.5px solid", borderRadius:8, fontSize:13, textAlign:"center", outline:"none", fontFamily:"inherit", background:"#f8fafc", color:"#1e293b", transition:"border-color .2s" },
  symCell:       { textAlign:"center", fontSize:12, fontWeight:700, padding:"3px 4px", borderRadius:6, display:"block" },
  apsCell:       { textAlign:"right", fontSize:13, fontWeight:700 },
  summary:       { margin:16, background:"#f8fafc", borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" },
  summaryRow:    { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 16px", borderBottom:"1px solid #f1f5f9", fontSize:13 },
  summaryLabel:  { color:"#6b7280" },
  summaryVal:    { fontWeight:700, color:"#1e293b" },
};
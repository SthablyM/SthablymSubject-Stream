import { useState, useRef } from "react";

// ─── APS helpers ──────────────────────────────────────────────────────────────
const markToAPS   = m => m>=80?7:m>=70?6:m>=60?5:m>=50?4:m>=40?3:m>=30?2:1;
const symbolLabel = m => m>=80?"A":m>=70?"B":m>=60?"C":m>=50?"D":m>=40?"E":m>=30?"F":"G";
const apsColor    = a => a>=6?"#16a34a":a>=5?"#22c55e":a>=4?"#d97706":a>=3?"#f97316":a>=2?"#dc2626":"#94a3b8";
const apsLabel    = a => a>=6?"Excellent":a>=4?"Satisfactory":a>=2?"Not yet achieved":"–";

const SUBJECTS = [
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

const calcAPS = marks => {
  const pts = SUBJECTS
    .filter(s => !s.lo && typeof marks[s.id]==="number" && marks[s.id]>0)
    .map(s => markToAPS(marks[s.id]));
  pts.sort((a,b)=>b-a);
  return pts.slice(0,6).reduce((t,x)=>t+x,0);
};

const mathsLabel = marks =>
  typeof marks.puremaths==="number" ? "Pure Mathematics" :
  typeof marks.techmaths==="number" ? "Technical Mathematics" :
  typeof marks.mathslit==="number"  ? "Mathematical Literacy" : "–";

const INITIAL_STUDENTS = [
  { id:1, name:"Thabo Nkosi",    grade:9,  marks:{}, examRecords:[] },
  { id:2, name:"Lerato Dlamini", grade:10, marks:{}, examRecords:[] },
  { id:3, name:"Sipho Mahlangu", grade:11, marks:{}, examRecords:[] },
  { id:4, name:"Nomsa Sithole",  grade:12, marks:{}, examRecords:[] },
  { id:5, name:"Kagiso Modise",  grade:9,  marks:{}, examRecords:[] },
];

const APS_CAREERS = [
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

// ─── GRADE PILL ──────────────────────────────────────────────────────────────
const GradePill = ({ g }) => {
  const col = g<=9?"#2563eb":g===10?"#7c3aed":g===11?"#16a34a":"#ea580c";
  return (
    <span style={{ background:col+"1a", color:col, fontWeight:700, fontSize:11,
      padding:"2px 9px", borderRadius:99, border:`1px solid ${col}33` }}>Gr {g}</span>
  );
};

// ─── FORM FIELD ──────────────────────────────────────────────────────────────
const Field = ({ label, error, children, half }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5, gridColumn: half?"span 1":"span 1" }}>
    <label style={{ fontSize:12, fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:".5px" }}>{label}</label>
    {children}
    {error && <span style={{ fontSize:11, color:"#dc2626" }}>⚠ {error}</span>}
  </div>
);

const inp = { padding:"9px 12px", border:"2px solid #e2e8f0", borderRadius:8, fontSize:13,
  outline:"none", fontFamily:"inherit", background:"#f8fafc", width:"100%", color:"#1e293b" };
const inpErr = { ...inp, borderColor:"#fca5a5", background:"#fff5f5" };

// ─────────────────────────────────────────────────────────────────────────────
// MARKS PANEL
// ─────────────────────────────────────────────────────────────────────────────
function MarksPanel({ student, onSetMark }) {
  const { marks } = student;
  const aps = calcAPS(marks);
  const pct = Math.min(100, Math.round((aps / 42) * 100));
  const barCol = aps>=30?"#16a34a":aps>=22?"#f59e0b":"#dc2626";

  return (
    <div>
      {/* Live APS bar */}
      {aps > 0 && (
        <div style={{ background:"linear-gradient(135deg,#eff6ff 0%,#f0fdf4 100%)",
          border:"1px solid #bfdbfe", borderRadius:16, padding:"20px 24px", marginBottom:24,
          display:"flex", gap:24, flexWrap:"wrap", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:"#1e40af", letterSpacing:"1px", textTransform:"uppercase" }}>Live APS Score</div>
            <div style={{ fontSize:56, fontWeight:900, color:"#0f172a", lineHeight:1.1, marginTop:4 }}>
              {aps}
              <span style={{ fontSize:20, color:"#94a3b8", fontWeight:400 }}>/42</span>
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>Best 6 · LO excluded · {mathsLabel(marks)}</div>
          </div>
          <div style={{ flex:1, minWidth:180 }}>
            <div style={{ height:12, background:"#e2e8f0", borderRadius:99, overflow:"hidden", marginBottom:8 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:barCol, borderRadius:99, transition:"width .5s ease" }}/>
            </div>
            <div style={{ fontSize:13, fontWeight:600, color:barCol }}>
              {aps>=30?"🟢 Strong — most universities open":
               aps>=22?"🟡 Good — many programmes available":
               "🔴 Needs improvement — encourage student"}
            </div>
          </div>
        </div>
      )}

      {/* Subject mark rows */}
      <div style={{ background:"#fff", borderRadius:14, overflow:"hidden",
        boxShadow:"0 1px 4px rgba(0,0,0,.06)", border:"1px solid #f1f5f9" }}>
        {SUBJECTS.map((sub, i) => {
          const val    = marks[sub.id];
          const numVal = typeof val==="number" && val>=0 ? val : null;
          const apsVal = numVal!==null && !sub.lo ? markToAPS(numVal) : null;
          const sym    = numVal!==null ? symbolLabel(numVal) : null;
          const col    = apsVal ? apsColor(apsVal) : "#e2e8f0";

          return (
            <div key={sub.id} style={{ display:"flex", alignItems:"center", padding:"9px 18px",
              borderBottom: i<SUBJECTS.length-1?"1px solid #f8fafc":"none",
              background: i%2===0?"#fff":"#fafbfc",
              opacity: sub.lo ? .65 : 1 }}>

              <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#1e293b" }}>{sub.label}</span>
                {sub.required && <span style={{ fontSize:9, color:"#dc2626", fontWeight:800 }}>★ REQUIRED</span>}
                {sub.lo && <span style={{ fontSize:10, color:"#94a3b8", fontStyle:"italic" }}>not counted in APS</span>}
                {sub.group==="maths" && (
                  <span style={{ fontSize:10, background:"#ede9fe", color:"#6d28d9", padding:"1px 7px", borderRadius:99, fontWeight:700 }}>choose 1</span>
                )}
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                <input
                  type="number" min="0" max="100" placeholder="  %"
                  value={numVal??""} 
                  onChange={e => {
                    const v = e.target.value;
                    onSetMark(sub.id, v==="" ? undefined : Math.min(100, Math.max(0, parseInt(v)||0)));
                  }}
                  style={{ width:68, padding:"6px 8px", border:`2px solid ${numVal!==null?col:"#e2e8f0"}`,
                    borderRadius:8, fontSize:14, textAlign:"center", outline:"none",
                    fontWeight:700, fontFamily:"'Courier New',monospace", background:"#f8fafc",
                    transition:"border-color .2s" }}
                />
                {apsVal !== null && numVal !== null && (
                  <div style={{ display:"flex", alignItems:"center", gap:5,
                    background:col+"15", border:`1.5px solid ${col}`, borderRadius:8,
                    padding:"4px 10px", minWidth:76 }}>
                    <span style={{ fontSize:16, fontWeight:800, color:col }}>{sym}</span>
                    <span style={{ fontSize:11, color:col, fontWeight:700 }}>APS {apsVal}</span>
                  </div>
                )}
                {sub.lo && numVal!==null && (
                  <div style={{ fontSize:11, color:"#94a3b8", fontStyle:"italic", minWidth:76 }}>LO recorded</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Symbol key */}
      <div style={{ marginTop:20, background:"#f8fafc", borderRadius:12, padding:"16px 20px", border:"1px solid #e2e8f0" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#475569", marginBottom:10, textTransform:"uppercase", letterSpacing:".5px" }}>NSC Symbol Scale</div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {[[80,"A",7],[70,"B",6],[60,"C",5],[50,"D",4],[40,"E",3],[30,"F",2],[0,"G",1]].map(([pct,sym,apsP]) => (
            <div key={sym} style={{ textAlign:"center", background:"#fff", border:`1.5px solid ${apsColor(apsP)}`,
              borderRadius:10, padding:"6px 12px", minWidth:58 }}>
              <div style={{ fontSize:18, fontWeight:900, color:apsColor(apsP) }}>{sym}</div>
              <div style={{ fontSize:10, color:"#94a3b8" }}>{pct}%+</div>
              <div style={{ fontSize:10, fontWeight:700, color:apsColor(apsP) }}>APS {apsP}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAM RECORDS PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ExamPanel({ student, onAdd }) {
  const blank = { date:"", subject:"", paper:"1", venue:"", duration:"3 hours",
    invigilator:"", confirmed:false, incidents:"" };
  const [form,     setForm]     = useState(blank);
  const [showForm, setShowForm] = useState(false);
  const [errors,   setErrors]   = useState({});

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate = () => {
    const e={};
    if(!form.date)                 e.date="Required";
    if(!form.subject)              e.subject="Required";
    if(!form.venue.trim())         e.venue="Required";
    if(!form.invigilator.trim())   e.invigilator="Required";
    if(!form.confirmed)            e.confirmed="You must tick this box to submit the record";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save = () => {
    if(!validate()) return;
    onAdd({ ...form, id:Date.now(),
      recordedAt: new Date().toLocaleString("en-ZA",{dateStyle:"medium",timeStyle:"short"}) });
    setForm(blank); setShowForm(false); setErrors({});
  };

  const recs = student.examRecords || [];

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h3 style={{ fontSize:17, fontWeight:800, color:"#1e293b" }}>🔒 Exam Invigilation Records</h3>
        <p style={{ fontSize:13, color:"#64748b", marginTop:4 }}>
          Each record locks in that the student wrote the exam under supervision. Records are date-stamped
          and signed off by the invigilator — preventing mark disputes and deterring cheating.
        </p>
      </div>

      {/* Anti-cheat info strip */}
      <div style={{ background:"#fef3c7", border:"1px solid #fcd34d", borderRadius:12, padding:"12px 16px",
        marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{ fontSize:20 }}>🛡️</span>
        <div style={{ fontSize:13, color:"#92400e" }}>
          <b>Anti-Cheat System:</b> Each record creates a permanent, timestamped log that the named invigilator
          confirms the student was present, wrote the exam independently, and no irregularities occurred.
          These records support mark validation and can be presented if a student disputes their results.
        </div>
      </div>

      {/* Existing records */}
      {recs.length === 0 && (
        <div style={{ background:"#f8fafc", border:"2px dashed #e2e8f0", borderRadius:14,
          padding:"40px 20px", textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>📋</div>
          <div style={{ fontSize:14, fontWeight:700, color:"#64748b" }}>No exam records yet</div>
          <div style={{ fontSize:13, color:"#94a3b8" }}>Add a record each time this student writes an exam</div>
        </div>
      )}

      {recs.map((rec, i) => (
        <div key={rec.id} style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:14,
          padding:"16px 20px", marginBottom:12, boxShadow:"0 1px 3px rgba(0,0,0,.05)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
            <div>
              <span style={{ fontWeight:800, fontSize:15, color:"#1e293b" }}>{rec.subject} — Paper {rec.paper}</span>
              <span style={{ marginLeft:10, fontSize:12, color:"#64748b" }}>📅 {rec.date}</span>
            </div>
            <span style={{ background:"#d1fae5", color:"#065f46", fontWeight:700, fontSize:11,
              padding:"3px 10px", borderRadius:99 }}>✓ Verified</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px 20px", fontSize:13 }}>
            {[["Venue",rec.venue],["Duration",rec.duration],
              ["Invigilator",rec.invigilator],["Recorded",rec.recordedAt]].map(([k,v])=>(
              <div key={k}><span style={{ color:"#94a3b8" }}>{k}: </span><b style={{ color:"#1e293b" }}>{v}</b></div>
            ))}
          </div>
          {rec.incidents && (
            <div style={{ marginTop:10, background:"#fef3c7", border:"1px solid #fcd34d",
              borderRadius:8, padding:"8px 12px", fontSize:12, color:"#92400e" }}>
              ⚠️ <b>Incident noted:</b> {rec.incidents}
            </div>
          )}
          <div style={{ marginTop:10, fontSize:11, color:"#94a3b8", fontStyle:"italic",
            borderTop:"1px solid #f1f5f9", paddingTop:8 }}>
            "{rec.invigilator} confirmed: {student.name} was present and wrote this exam under supervision with no irregularities{rec.incidents?" (see incident note)":""}."
          </div>
        </div>
      ))}

      {/* Add record button */}
      {!showForm && (
        <button onClick={()=>setShowForm(true)}
          style={{ padding:"11px 22px", background:"#7c3aed", color:"#fff", border:"none",
            borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer", marginTop:4 }}>
          + Record New Exam
        </button>
      )}

      {/* Record form */}
      {showForm && (
        <div style={{ background:"#fff", border:"1.5px solid #e2e8f0", borderRadius:16,
          padding:"24px", marginTop:12, boxShadow:"0 2px 12px rgba(0,0,0,.07)" }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#1e293b", marginBottom:20 }}>
            📝 New Invigilation Record — {student.name}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
            <Field label="Exam Date *" error={errors.date}>
              <input style={errors.date?inpErr:inp} type="date" value={form.date} onChange={e=>set("date",e.target.value)} />
            </Field>
            <Field label="Subject *" error={errors.subject}>
              <select style={errors.subject?inpErr:inp} value={form.subject} onChange={e=>set("subject",e.target.value)}>
                <option value="">Select subject...</option>
                {SUBJECTS.map(s=><option key={s.id} value={s.label}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Paper">
              <select style={inp} value={form.paper} onChange={e=>set("paper",e.target.value)}>
                {["1","2","3","Practical","SBA / Portfolio"].map(p=><option key={p} value={p}>Paper {p}</option>)}
              </select>
            </Field>
            <Field label="Duration">
              <select style={inp} value={form.duration} onChange={e=>set("duration",e.target.value)}>
                {["1 hour","1.5 hours","2 hours","2.5 hours","3 hours","3.5 hours"].map(d=><option key={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Exam Venue *" error={errors.venue}>
              <input style={errors.venue?inpErr:inp} placeholder="e.g. Hall B, Room 14" value={form.venue} onChange={e=>set("venue",e.target.value)} />
            </Field>
            <Field label="Invigilator Name *" error={errors.invigilator}>
              <input style={errors.invigilator?inpErr:inp} placeholder="Full name of teacher on duty" value={form.invigilator} onChange={e=>set("invigilator",e.target.value)} />
            </Field>
          </div>

          <Field label="Incidents / Irregularities">
            <textarea style={{ ...inp, height:72, resize:"vertical" }}
              placeholder="Leave blank if exam ran normally. Describe any incidents: late arrival, phone found, disturbance, illness, etc."
              value={form.incidents} onChange={e=>set("incidents",e.target.value)} />
          </Field>

          {/* Declaration checkbox */}
          <div style={{ marginTop:16, background:errors.confirmed?"#fff5f5":"#f0fdf4",
            border:`2px solid ${errors.confirmed?"#fca5a5":"#bbf7d0"}`, borderRadius:12, padding:"16px" }}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <input type="checkbox" id="decl" checked={form.confirmed}
                onChange={e=>set("confirmed",e.target.checked)}
                style={{ width:18, height:18, marginTop:2, accentColor:"#16a34a", flexShrink:0, cursor:"pointer" }} />
              <label htmlFor="decl" style={{ fontSize:13, color:"#1e293b", cursor:"pointer", lineHeight:1.7 }}>
                <b>📋 Invigilator Declaration:</b> I, <b style={{ color:"#1e40af" }}>{form.invigilator||"[your name]"}</b>,
                hereby confirm that <b>{student.name}</b> was physically present and wrote
                <b> {form.subject||"[subject]"}</b> (Paper {form.paper}) on <b>{form.date||"[date]"}</b> at <b>{form.venue||"[venue]"}</b>
                {" "}for <b>{form.duration}</b>. The examination was conducted under my supervision in accordance with
                school rules. The student's work is their own. No irregularities occurred
                {form.incidents?" (except as noted above)":""}.
                <b style={{ color:"#dc2626" }}> This declaration is legally binding and will be attached to the student's official record.</b>
              </label>
            </div>
            {errors.confirmed && <div style={{ fontSize:12, color:"#dc2626", marginTop:8, paddingLeft:30 }}>⚠ {errors.confirmed}</div>}
          </div>

          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button onClick={save}
              style={{ padding:"10px 22px", background:"#16a34a", color:"#fff", border:"none",
                borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
              ✓ Save Record
            </button>
            <button onClick={()=>{ setShowForm(false); setErrors({}); setForm(blank); }}
              style={{ padding:"10px 18px", background:"#f1f5f9", color:"#334155",
                border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT PANEL
// ─────────────────────────────────────────────────────────────────────────────
function ReportPanel({ student }) {
  const { marks, examRecords } = student;
  const aps  = calcAPS(marks);
  const date = new Date().toLocaleDateString("en-ZA",{year:"numeric",month:"long",day:"numeric"});
  const entered = SUBJECTS.filter(s => typeof marks[s.id]==="number" && marks[s.id]>=0);

  return (
    <div>
      <div style={{ display:"flex", gap:12, marginBottom:24, alignItems:"center" }}>
        <button onClick={()=>window.print()}
          style={{ padding:"12px 22px", background:"#0f172a", color:"#fff", border:"none",
            borderRadius:10, fontSize:13, fontWeight:700, cursor:"pointer" }}>
          🖨️ Print / Save as PDF
        </button>
        <span style={{ fontSize:13, color:"#64748b" }}>
          Use your browser's print dialog → "Save as PDF"
        </span>
      </div>

      {/* ── PRINTABLE REPORT ── */}
      <div style={{ background:"#fff", borderRadius:16, padding:"36px", maxWidth:860,
        boxShadow:"0 4px 24px rgba(0,0,0,.09)", border:"1px solid #e2e8f0" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)",
          borderRadius:12, padding:"28px 32px", marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:30, fontWeight:900, color:"#38bdf8", letterSpacing:"-1px" }}>STABLYM</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.5)", letterSpacing:"3px",textTransform:"uppercase" }}>Student Academic Report</div>
            </div>
            <div style={{ textAlign:"right", fontSize:12, color:"rgba(255,255,255,.6)" }}>
              <div>Generated: {date}</div>
              <div style={{ marginTop:4 }}>Confidential · School Use Only</div>
            </div>
          </div>
          <div style={{ marginTop:20, paddingTop:18, borderTop:"1px solid rgba(255,255,255,.12)" }}>
            <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>{student.name}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.65)", marginTop:4 }}>
              Grade {student.grade} &nbsp;·&nbsp; {mathsLabel(marks)} &nbsp;·&nbsp; {examRecords?.length||0} exam records on file
            </div>
          </div>
        </div>

        {/* APS Block */}
        <div style={{ display:"flex", gap:24, background:"#f8fafc", border:"1px solid #e2e8f0",
          borderRadius:12, padding:"22px 28px", marginBottom:28, flexWrap:"wrap" }}>
          <div style={{ flex:2, minWidth:200 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#1e40af", textTransform:"uppercase", letterSpacing:"1px" }}>Estimated APS Score</div>
            <div style={{ fontSize:64, fontWeight:900, color:"#0f172a", lineHeight:1, marginTop:6 }}>
              {aps>0?aps:"—"}<span style={{ fontSize:24, color:"#94a3b8", fontWeight:400 }}>/42</span>
            </div>
            <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>Best 6 subjects · LO excluded · {mathsLabel(marks)}</div>
            {aps>0 && (
              <div style={{ marginTop:12, display:"inline-block", fontWeight:700, fontSize:13, padding:"6px 14px", borderRadius:8,
                background:aps>=30?"#d1fae5":aps>=22?"#fef3c7":"#fee2e2",
                color:aps>=30?"#065f46":aps>=22?"#92400e":"#991b1b" }}>
                {aps>=30?"🟢 Strong · Most universities open":aps>=22?"🟡 Good · Many programmes available":"🔴 Needs improvement"}
              </div>
            )}
          </div>
          <div style={{ flex:1, minWidth:160, borderLeft:"1px solid #e2e8f0", paddingLeft:24 }}>
            <div style={{ fontSize:11, fontWeight:700, color:"#475569", marginBottom:8, textTransform:"uppercase" }}>APS Scale</div>
            {[[7,"A","80%+"],[6,"B","70–79%"],[5,"C","60–69%"],[4,"D","50–59%"],
              [3,"E","40–49%"],[2,"F","30–39%"],[1,"G","0–29%"]].map(([a,sym,rng])=>(
              <div key={a} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                <span style={{ width:22, height:22, borderRadius:6, background:apsColor(a)+"22",
                  border:`1.5px solid ${apsColor(a)}`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:12, fontWeight:800, color:apsColor(a), flexShrink:0 }}>{sym}</span>
                <span style={{ fontSize:11, color:"#64748b", flex:1 }}>{rng}</span>
                <span style={{ fontSize:11, fontWeight:700, color:apsColor(a) }}>APS {a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Marks Table */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:14,
            paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>📝 Subject Results</div>
          {entered.length===0 ? (
            <div style={{ color:"#94a3b8", fontSize:13 }}>No marks entered yet.</div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f1f5f9" }}>
                  {["Subject","Mark (%)","Symbol","APS Points","Note"].map(h=>(
                    <th key={h} style={{ padding:"9px 12px", textAlign:"left", fontSize:11,
                      fontWeight:700, color:"#64748b", textTransform:"uppercase", border:"1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entered.map((sub,i) => {
                  const m   = marks[sub.id];
                  const a   = sub.lo ? null : markToAPS(m);
                  const col = a ? apsColor(a) : "#94a3b8";
                  return (
                    <tr key={sub.id} style={{ background:i%2===0?"#f8fafc":"#fff" }}>
                      <td style={{ padding:"9px 12px", border:"1px solid #e2e8f0", fontWeight:600 }}>{sub.label}</td>
                      <td style={{ padding:"9px 12px", border:"1px solid #e2e8f0", textAlign:"center", fontWeight:800 }}>{m}%</td>
                      <td style={{ padding:"9px 12px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                        <span style={{ background:col+"1a", color:col, fontWeight:800,
                          padding:"2px 10px", borderRadius:6, fontSize:14 }}>{symbolLabel(m)}</span>
                      </td>
                      <td style={{ padding:"9px 12px", border:"1px solid #e2e8f0", textAlign:"center",
                        fontWeight:800, color:sub.lo?"#94a3b8":col }}>{sub.lo?"—":a}</td>
                      <td style={{ padding:"9px 12px", border:"1px solid #e2e8f0", fontSize:12,
                        color:sub.lo?"#94a3b8":col }}>{sub.lo?"Compulsory (not in APS)":apsLabel(a)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* University eligibility */}
        {aps>0 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:6,
              paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>🎓 University Programme Eligibility</div>
            <div style={{ fontSize:12, color:"#64748b", marginBottom:12 }}>
              Based on APS of {aps}/42. Subject-specific entry requirements may still apply.
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr style={{ background:"#f1f5f9" }}>
                  {["Programme","Min APS","Universities","Status"].map(h=>(
                    <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11,
                      fontWeight:700, color:"#64748b", textTransform:"uppercase", border:"1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {APS_CAREERS.map((c,i)=>{
                  const ok = aps >= c.aps;
                  return (
                    <tr key={c.career} style={{ background:i%2===0?"#f8fafc":"#fff" }}>
                      <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", fontWeight:600 }}>{c.career}</td>
                      <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"center", fontWeight:700 }}>{c.aps}+</td>
                      <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", fontSize:12, color:"#64748b" }}>{c.unis}</td>
                      <td style={{ padding:"8px 12px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                        <span style={{ background:ok?"#d1fae5":"#fee2e2", color:ok?"#065f46":"#991b1b",
                          fontWeight:700, padding:"2px 10px", borderRadius:6, fontSize:11 }}>
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

        {/* Exam Records */}
        <div style={{ marginBottom:28 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:14,
            paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>🔒 Exam Invigilation Records</div>
          {(!examRecords||examRecords.length===0) ? (
            <div style={{ color:"#94a3b8", fontSize:13 }}>No exam records on file.</div>
          ) : (
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
              <thead>
                <tr style={{ background:"#f1f5f9" }}>
                  {["Date","Subject","Paper","Venue","Invigilator","Incidents","Verified"].map(h=>(
                    <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:10,
                      fontWeight:700, color:"#64748b", textTransform:"uppercase", border:"1px solid #e2e8f0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {examRecords.map((r,i)=>(
                  <tr key={r.id} style={{ background:i%2===0?"#f8fafc":"#fff" }}>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0" }}>{r.date}</td>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", fontWeight:600 }}>{r.subject}</td>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", textAlign:"center" }}>P{r.paper}</td>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0" }}>{r.venue}</td>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", fontWeight:600 }}>{r.invigilator}</td>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0",
                      color:r.incidents?"#92400e":"#16a34a", fontSize:11 }}>{r.incidents||"None"}</td>
                    <td style={{ padding:"8px 10px", border:"1px solid #e2e8f0", textAlign:"center" }}>
                      <span style={{ background:"#d1fae5", color:"#065f46", fontWeight:700,
                        padding:"2px 8px", borderRadius:6, fontSize:10 }}>✓ Yes</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Signature block */}
        <div style={{ marginBottom:8 }}>
          <div style={{ fontSize:14, fontWeight:800, color:"#1e293b", marginBottom:16,
            paddingBottom:8, borderBottom:"2px solid #f1f5f9" }}>✍️ Authorisation Signatures</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
            {["Class Teacher","Principal / HOD","Parent / Guardian"].map(r=>(
              <div key={r}>
                <div style={{ borderBottom:"2px solid #1e293b", height:44, marginBottom:6 }}></div>
                <div style={{ fontSize:12, fontWeight:700, color:"#1e293b" }}>{r}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>Signature &amp; Date</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop:"1px solid #e2e8f0", marginTop:24, paddingTop:14,
          display:"flex", justifyContent:"space-between", fontSize:11, color:"#94a3b8" }}>
          <span>Stablym Teacher Portal · stablym.co.za</span>
          <span>Confidential — school use only</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selected, setSelected] = useState(null);
  const [tab,      setTab]      = useState("marks");
  const [newName,  setNewName]  = useState("");
  const [newGrade, setNewGrade] = useState("9");
  const [adding,   setAdding]   = useState(false);

  const student = students.find(s => s.id===selected);

  const updateStudent = (id, fn) =>
    setStudents(ss => ss.map(s => s.id===id ? fn(s) : s));

  const setMark = (id, subId, val) => updateStudent(id, s => ({
    ...s, marks:{ ...s.marks,
      [subId]: val===undefined ? undefined : Math.min(100,Math.max(0,parseInt(val)||0)) }
  }));

  const addExamRecord = (id, rec) => updateStudent(id, s => ({
    ...s, examRecords:[...(s.examRecords||[]), rec]
  }));

  const addStudent = () => {
    if(!newName.trim()) return;
    setStudents(ss => [...ss, {
      id:Date.now(), name:newName.trim(), grade:parseInt(newGrade), marks:{}, examRecords:[]
    }]);
    setNewName(""); setAdding(false);
  };

  const openStudent = id => { setSelected(id); setTab("marks"); };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f0f4f8",
      fontFamily:"system-ui,-apple-system,sans-serif" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width:220, background:"#0f172a", display:"flex", flexDirection:"column",
        position:"fixed", top:0, left:0, bottom:0, zIndex:50, overflowY:"auto" }}>
        <div style={{ padding:"22px 16px 16px" }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#38bdf8", letterSpacing:"-1px" }}>Stablym</div>
          <div style={{ fontSize:10, color:"#334155", fontWeight:700, letterSpacing:"2px",
            textTransform:"uppercase", marginTop:2 }}>Teacher Portal</div>
        </div>
        <div style={{ borderTop:"1px solid #1e293b", padding:"8px 8px" }}>
          <button onClick={()=>{ setSelected(null); }}
            style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 10px",
              border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
              background: !selected?"#1e3a5f":"transparent", color: !selected?"#e2e8f0":"#64748b",
              textAlign:"left" }}>
            <span>👥</span> Class Roster
          </button>
        </div>
        {student && (
          <div style={{ padding:"0 8px" }}>
            <div style={{ fontSize:9, color:"#334155", fontWeight:700, letterSpacing:"2px",
              textTransform:"uppercase", padding:"10px 10px 4px" }}>
              {student.name.split(" ")[0]}
            </div>
            {[
              { icon:"📝", label:"Enter Marks",   t:"marks"  },
              { icon:"🔒", label:"Exam Records",  t:"exam"   },
              { icon:"📄", label:"Print Report",  t:"report" },
            ].map(({icon,label,t}) => (
              <button key={t} onClick={()=>setTab(t)}
                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"10px 10px",
                  border:"none", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
                  background: tab===t?"#1e3a5f":"transparent",
                  color: tab===t?"#e2e8f0":"#64748b", textAlign:"left", marginBottom:2 }}>
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        )}
        <div style={{ marginTop:"auto", padding:"14px 16px", borderTop:"1px solid #1e293b",
          fontSize:12, color:"#334155" }}>
          <b style={{ color:"#64748b" }}>{students.length}</b> students enrolled
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft:220, flex:1, padding:"32px 36px 80px", overflowY:"auto" }}>

        {/* ══ ROSTER ══ */}
        {!selected && (
          <div>
            <div style={{ marginBottom:24 }}>
              <h1 style={{ fontSize:24, fontWeight:800, color:"#0f172a" }}>Class Roster</h1>
              <p style={{ fontSize:14, color:"#64748b", marginTop:4 }}>
                Click a student to enter marks, record exams, or print their APS report.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
              {[
                { label:"Total Students", value:students.length, color:"#2563eb" },
                { label:"Marks Entered",  value:students.filter(s=>Object.values(s.marks).some(v=>typeof v==="number")).length, color:"#16a34a" },
                { label:"Exams Recorded", value:students.filter(s=>s.examRecords?.length>0).length, color:"#7c3aed" },
                { label:"Reports Ready",  value:students.filter(s=>calcAPS(s.marks)>0).length, color:"#ea580c" },
              ].map(({label,value,color})=>(
                <div key={label} style={{ background:"#fff", borderRadius:12, padding:"14px 18px",
                  borderTop:`3px solid ${color}`, boxShadow:"0 1px 4px rgba(0,0,0,.06)",
                  display:"flex", flexDirection:"column" }}>
                  <span style={{ fontSize:30, fontWeight:900, color }}>{value}</span>
                  <span style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Add student */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#1e293b" }}>Students ({students.length})</span>
              <button onClick={()=>setAdding(v=>!v)}
                style={{ padding:"8px 16px", background:"#2563eb", color:"#fff", border:"none",
                  borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>
                {adding?"✕ Cancel":"+ Add Student"}
              </button>
            </div>

            {adding && (
              <div style={{ display:"flex", gap:10, marginBottom:14, background:"#fff",
                padding:"14px", borderRadius:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
                <input style={{ flex:1, ...inp }} placeholder="Student full name"
                  value={newName} onChange={e=>setNewName(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addStudent()} />
                <select style={{ ...inp, width:120 }} value={newGrade} onChange={e=>setNewGrade(e.target.value)}>
                  {[8,9,10,11,12].map(g=><option key={g} value={g}>Grade {g}</option>)}
                </select>
                <button onClick={addStudent}
                  style={{ padding:"9px 18px", background:"#16a34a", color:"#fff", border:"none",
                    borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer" }}>Save</button>
              </div>
            )}

            {/* Student table */}
            <div style={{ background:"#fff", borderRadius:14, overflow:"hidden",
              boxShadow:"0 1px 4px rgba(0,0,0,.06)", border:"1px solid #f1f5f9" }}>
              <div style={{ display:"grid", gridTemplateColumns:"2fr .8fr 1.2fr 1fr 1.3fr .8fr",
                padding:"10px 18px", background:"#f8fafc", borderBottom:"1px solid #f1f5f9" }}>
                {["Student","Grade","Marks","APS","Exam Records",""].map(h=>(
                  <span key={h} style={{ fontSize:11, fontWeight:700, color:"#64748b",
                    textTransform:"uppercase", letterSpacing:".5px" }}>{h}</span>
                ))}
              </div>
              {students.map((st,i) => {
                const aps = calcAPS(st.marks);
                const entered = Object.values(st.marks).filter(v=>typeof v==="number"&&v>=0).length;
                const col = aps>=30?"#16a34a":aps>=22?"#d97706":aps>0?"#dc2626":null;
                return (
                  <div key={st.id} style={{ display:"grid", gridTemplateColumns:"2fr .8fr 1.2fr 1fr 1.3fr .8fr",
                    padding:"12px 18px", borderBottom: i<students.length-1?"1px solid #f8fafc":"none",
                    alignItems:"center", background: i%2===0?"#fff":"#fafbfc" }}>
                    <span style={{ fontWeight:700, fontSize:14, color:"#0f172a" }}>{st.name}</span>
                    <span><GradePill g={st.grade}/></span>
                    <span style={{ fontSize:13, color: entered>0?"#16a34a":"#94a3b8", fontWeight:600 }}>
                      {entered>0?`${entered} subjects`:"—"}
                    </span>
                    <span>{aps>0
                      ? <span style={{ background:col+"1a", color:col, fontWeight:800,
                          padding:"3px 10px", borderRadius:99, fontSize:13, border:`1px solid ${col}33` }}>{aps}/42</span>
                      : <span style={{ color:"#94a3b8",fontSize:13 }}>—</span>}
                    </span>
                    <span style={{ fontSize:13, color: st.examRecords?.length>0?"#7c3aed":"#94a3b8", fontWeight:600 }}>
                      {st.examRecords?.length>0?`✓ ${st.examRecords.length} recorded`:"None yet"}
                    </span>
                    <span>
                      <button onClick={()=>openStudent(st.id)}
                        style={{ padding:"6px 12px", background:"#eff6ff", color:"#2563eb",
                          border:"1.5px solid #bfdbfe", borderRadius:8, fontSize:12,
                          fontWeight:700, cursor:"pointer" }}>Open →</button>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ STUDENT DETAIL ══ */}
        {selected && student && (
          <div>
            {/* Back + header */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
              <button onClick={()=>setSelected(null)}
                style={{ padding:"7px 14px", background:"#f1f5f9", color:"#334155",
                  border:"1.5px solid #e2e8f0", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer" }}>
                ← Back
              </button>
              <div>
                <h2 style={{ fontSize:22, fontWeight:800, color:"#0f172a" }}>{student.name}</h2>
                <span style={{ fontSize:13, color:"#64748b" }}>
                  Grade {student.grade} · APS: <b style={{ color:"#2563eb" }}>{calcAPS(student.marks)||"–"}/42</b>
                </span>
              </div>
            </div>

            {/* Tab bar */}
            <div style={{ display:"flex", gap:3, background:"#f1f5f9", padding:3,
              borderRadius:11, marginBottom:26, width:"fit-content" }}>
              {[
                {t:"marks", label:"📝 Enter Marks"},
                {t:"exam",  label:"🔒 Exam Records"},
                {t:"report",label:"📄 Print Report"},
              ].map(({t,label})=>(
                <button key={t} onClick={()=>setTab(t)}
                  style={{ padding:"9px 18px", border:"none", borderRadius:8, fontSize:13,
                    fontWeight:600, cursor:"pointer", transition:"all .15s",
                    background: tab===t?"#fff":"transparent",
                    color: tab===t?"#0f172a":"#64748b",
                    boxShadow: tab===t?"0 1px 4px rgba(0,0,0,.1)":"none" }}>
                  {label}
                </button>
              ))}
            </div>

            {tab==="marks"  && <MarksPanel student={student} onSetMark={(sub,val)=>setMark(student.id,sub,val)} />}
            {tab==="exam"   && <ExamPanel  student={student} onAdd={rec=>addExamRecord(student.id,rec)} />}
            {tab==="report" && <ReportPanel student={student} />}
          </div>
        )}
      </main>
    </div>
  );
}
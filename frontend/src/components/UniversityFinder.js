// src/components/UniversityFinder.js
import React, { useState } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STREAM_DATA = {
  "Science Stream": {
    color: "#2563eb",
    icon: "🔬",
    universities: [
      { name: "University of Cape Town (UCT)",           programs: ["BSc Medical Sciences","BSc Biological Sciences","BSc Chemistry"], minAPS: 36, location: "Cape Town" },
      { name: "University of the Witwatersrand (Wits)",  programs: ["BSc Life & Earth Sciences","BSc Molecular Sciences","BSc Health Sciences"], minAPS: 34, location: "Johannesburg" },
      { name: "University of Pretoria (UP)",              programs: ["BSc Biological Sciences","BSc Chemistry","BSc Zoology"], minAPS: 30, location: "Pretoria" },
      { name: "Stellenbosch University (SU)",             programs: ["BSc Molecular Biology","BSc Biochemistry","BSc Agriculture"], minAPS: 30, location: "Stellenbosch" },
      { name: "University of KwaZulu-Natal (UKZN)",       programs: ["BSc Life Sciences","BSc Chemistry","BSc Medical Sciences"], minAPS: 28, location: "Durban" },
      { name: "University of Johannesburg (UJ)",          programs: ["BSc Biochemistry","BSc Environmental Sciences"], minAPS: 26, location: "Johannesburg" },
      { name: "UNISA",                                    programs: ["BSc (various Science majors) - distance learning"], minAPS: 22, location: "National (Online)" },
    ],
    bursaries: [
      { name: "National Research Foundation (NRF)",   field: "Science & Research",   amount: "Up to R150 000/yr",   link: "nrf.ac.za" },
      { name: "South African Medical Research Council",field: "Medical Sciences",     amount: "Up to R120 000/yr",   link: "samrc.ac.za" },
      { name: "DAFF Bursary",                         field: "Agricultural Sciences", amount: "Up to R80 000/yr",    link: "dalrrd.gov.za" },
      { name: "NSFAS",                                field: "All Science degrees",   amount: "Full cost of study",  link: "nsfas.org.za" },
      { name: "Sasol Bursary",                        field: "Sciences & Engineering",amount: "Up to R200 000/yr",   link: "sasol.com" },
    ],
    tvet: false,
  },

  "Commerce Stream": {
    color: "#16a34a",
    icon: "📊",
    universities: [
      { name: "University of Cape Town (UCT)",           programs: ["BCom Accounting","BCom Economics","BCom Finance"], minAPS: 36, location: "Cape Town" },
      { name: "University of the Witwatersrand (Wits)",  programs: ["BCom Accounting","BCom Finance","BCom Economics"], minAPS: 33, location: "Johannesburg" },
      { name: "University of Pretoria (UP)",              programs: ["BCom Accounting Sciences","BCom Economics","BComHons"], minAPS: 30, location: "Pretoria" },
      { name: "Stellenbosch University (SU)",             programs: ["BCom Accounting","BCom Financial Management"], minAPS: 30, location: "Stellenbosch" },
      { name: "University of Johannesburg (UJ)",          programs: ["BCom Accounting","BCom Business Management"], minAPS: 28, location: "Johannesburg" },
      { name: "Nelson Mandela University (NMU)",          programs: ["BCom Economics","BCom Accounting"], minAPS: 25, location: "Gqeberha (PE)" },
      { name: "UNISA",                                    programs: ["BCom Accounting","BCom Economics - distance"], minAPS: 22, location: "National (Online)" },
    ],
    bursaries: [
      { name: "SAICA Training Bursary",         field: "Chartered Accountancy",   amount: "Full tuition + stipend", link: "saica.co.za" },
      { name: "Deloitte Bursary",               field: "Accounting / Finance",     amount: "Up to R120 000/yr",     link: "deloitte.com/za" },
      { name: "Standard Bank Bursary",          field: "Finance & Commerce",       amount: "Up to R100 000/yr",     link: "standardbank.co.za" },
      { name: "ABSA Bursary Programme",         field: "Commerce & Economics",     amount: "Up to R90 000/yr",      link: "absa.co.za" },
      { name: "NSFAS",                          field: "All Commerce degrees",     amount: "Full cost of study",    link: "nsfas.org.za" },
    ],
    tvet: false,
  },

  "Humanities Stream": {
    color: "#9333ea",
    icon: "🎭",
    universities: [
      { name: "University of Cape Town (UCT)",           programs: ["BA Humanities","BA Law","BA Social Work"], minAPS: 32, location: "Cape Town" },
      { name: "Rhodes University",                       programs: ["BA Journalism","BA Media Studies","BA Education"], minAPS: 28, location: "Makhanda (Grahamstown)" },
      { name: "University of the Witwatersrand (Wits)",  programs: ["BA Political Studies","BA History","BA Social Anthropology"], minAPS: 30, location: "Johannesburg" },
      { name: "University of Johannesburg (UJ)",          programs: ["BA Communication","BA Tourism","BA Human Resources"], minAPS: 25, location: "Johannesburg" },
      { name: "North-West University (NWU)",              programs: ["BA Tourism","BA Journalism","BA Social Work"], minAPS: 22, location: "Potchefstroom/Mafikeng" },
      { name: "University of Limpopo (UL)",               programs: ["BA Social Work","BA Education","BA Communication"], minAPS: 20, location: "Limpopo" },
      { name: "UNISA",                                    programs: ["BA Psychology","BA Social Work","BEd - distance"], minAPS: 18, location: "National (Online)" },
    ],
    bursaries: [
      { name: "NSFAS",                                  field: "All Humanities degrees", amount: "Full cost of study",  link: "nsfas.org.za" },
      { name: "Oppenheimer Memorial Trust",             field: "Social Sciences & Arts",  amount: "Up to R80 000/yr",   link: "omtrust.org.za" },
      { name: "Department of Social Development",       field: "Social Work",             amount: "Full tuition",        link: "dsd.gov.za" },
      { name: "SETA Bursaries (various sectors)",       field: "Humanities & Services",   amount: "Varies by SETA",      link: "qcto.org.za" },
      { name: "Sasol Foundation Bursary",               field: "Education & Teaching",    amount: "Up to R60 000/yr",    link: "sasol.com/foundation" },
    ],
    tvet: false,
  },

  "Engineering / Technical Stream": {
    color: "#ea580c",
    icon: "⚙️",
    universities: [
      { name: "University of the Witwatersrand (Wits)",  programs: ["BSc Eng Civil","BSc Eng Electrical","BSc Eng Mechanical"], minAPS: 34, location: "Johannesburg" },
      { name: "University of Pretoria (UP)",              programs: ["BEng Civil","BEng Electrical","BEng Mechanical"], minAPS: 32, location: "Pretoria" },
      { name: "Cape Peninsula University of Technology (CPUT)", programs: ["BTech Civil Eng","BTech Electrical Eng","ND Mechanical Eng"], minAPS: 26, location: "Cape Town" },
      { name: "Tshwane University of Technology (TUT)",   programs: ["ND Civil Eng","ND Electrical Eng","ND Mechanical Eng"], minAPS: 24, location: "Pretoria" },
      { name: "University of Johannesburg (UJ)",          programs: ["BTech Mechanical Eng","BTech Electrical Eng"], minAPS: 26, location: "Johannesburg" },
      { name: "Durban University of Technology (DUT)",    programs: ["ND Civil Eng","ND Electrical Eng","ND Information Technology"], minAPS: 22, location: "Durban" },
      { name: "UNISA",                                    programs: ["BSc Computer Science","BSc IT - distance"], minAPS: 20, location: "National (Online)" },
    ],
    bursaries: [
      { name: "ECSA Bursary",                           field: "Engineering (all disciplines)", amount: "Up to R120 000/yr", link: "ecsa.co.za" },
      { name: "Eskom Bursary",                          field: "Electrical / Mechanical Eng",   amount: "Up to R150 000/yr", link: "eskom.co.za" },
      { name: "Transnet Bursary",                       field: "Civil / Mechanical Eng",        amount: "Up to R100 000/yr", link: "transnet.net" },
      { name: "Anglo American Bursary",                 field: "Mining & Engineering",          amount: "Up to R200 000/yr", link: "angloamerican.com" },
      { name: "NSFAS",                                  field: "All Engineering degrees",       amount: "Full cost of study", link: "nsfas.org.za" },
    ],
    tvet: {
      title: "TVET College Options",
      description: "TVET colleges offer National Certificates (NC(V)) and N-Diplomas in technical fields. These are excellent, affordable pathways into engineering careers.",
      colleges: [
        "Ekurhuleni East TVET College",
        "Tshwane North TVET College",
        "South West Gauteng TVET College",
        "False Bay TVET College (Cape Town)",
        "Coastal KZN TVET College (Durban)",
      ],
      programs: ["N1–N6 Engineering Studies","NC(V) Engineering & Related Design","NC(V) Information Technology"],
    }
  }
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function UniversityFinder({ stream, aps = 0 }) {
  const [activeTab, setActiveTab] = useState("universities");
  const data = STREAM_DATA[stream];
  if (!data) return null;

  const reachable = data.universities.filter(u => aps === 0 || u.minAPS <= aps + 3);
  const stretch   = data.universities.filter(u => aps > 0  && u.minAPS > aps + 3);

  return (
    <div style={s.wrap}>
      <div style={{ ...s.header, background: data.color }}>
        <span style={s.headerIcon}>{data.icon}</span>
        <div>
          <h2 style={s.headerTitle}>{stream}</h2>
          <p style={s.headerSub}>Universities, Bursaries & Pathways</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {["universities","bursaries", ...(data.tvet ? ["tvet"] : [])].map(tab => (
          <button
            key={tab}
            style={{ ...s.tab, ...(activeTab === tab ? { ...s.tabActive, color: data.color, borderColor: data.color } : {}) }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "universities" ? "🏫 Universities" : tab === "bursaries" ? "💰 Bursaries" : "🔧 TVET Options"}
          </button>
        ))}
      </div>

      <div style={s.content}>
        {/* ── UNIVERSITIES ── */}
        {activeTab === "universities" && (
          <div>
            {aps > 0 && <p style={s.apsNote}>Showing options based on your APS of <b>{aps}</b>. Green = within reach.</p>}

            {reachable.length > 0 && (
              <>
                {aps > 0 && <div style={s.groupLabel}>✅ Within Reach</div>}
                {reachable.map((u, i) => <UniversityCard key={i} u={u} aps={aps} color={data.color} />)}
              </>
            )}

            {stretch.length > 0 && (
              <>
                <div style={{ ...s.groupLabel, color:"#d97706", background:"#fffbeb" }}>🚀 Stretch Goals (study hard!)</div>
                {stretch.map((u, i) => <UniversityCard key={i} u={u} aps={aps} color="#d97706" />)}
              </>
            )}
          </div>
        )}

        {/* ── BURSARIES ── */}
        {activeTab === "bursaries" && (
          <div>
            <div style={s.nsfasHighlight}>
              <span style={s.nsfasIcon}>💡</span>
              <div>
                <b>Apply for NSFAS first!</b> The National Student Financial Aid Scheme covers tuition, accommodation and meals for qualifying students. Apply at <b>nsfas.org.za</b> before January each year.
              </div>
            </div>
            {data.bursaries.map((b, i) => (
              <div key={i} style={s.bursaryCard}>
                <div style={s.bursaryTop}>
                  <span style={s.bursaryName}>{b.name}</span>
                  <span style={{ ...s.amountBadge, background: data.color }}>{b.amount}</span>
                </div>
                <p style={s.bursaryField}>📚 {b.field}</p>
                <p style={s.bursaryLink}>🌐 {b.link}</p>
              </div>
            ))}
            <div style={s.tipBox}>
              <b>💡 Tips for bursary applications:</b>
              <ul style={{ margin:"8px 0 0", paddingLeft:18, fontSize:13, color:"#374151", lineHeight:1.8 }}>
                <li>Apply in Grade 11 — most bursaries open in August/September</li>
                <li>Keep your marks above 60% in relevant subjects</li>
                <li>Write a strong motivational letter explaining your goals</li>
                <li>Ask a teacher or school counsellor to review your application</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── TVET ── */}
        {activeTab === "tvet" && data.tvet && (
          <div>
            <div style={s.tvetIntro}>
              <h3 style={{ margin:"0 0 8px", color:"#ea580c" }}>🔧 {data.tvet.title}</h3>
              <p style={{ fontSize:14, color:"#374151", margin:0 }}>{data.tvet.description}</p>
            </div>
            <div style={s.tvetPrograms}>
              <h4 style={{ margin:"0 0 10px", color:"#1e293b" }}>Popular Programs</h4>
              {data.tvet.programs.map((p, i) => (
                <div key={i} style={s.tvetProgram}>⚙️ {p}</div>
              ))}
            </div>
            <div style={s.tvetColleges}>
              <h4 style={{ margin:"0 0 10px", color:"#1e293b" }}>TVET Colleges</h4>
              {data.tvet.colleges.map((c, i) => (
                <div key={i} style={s.tvetCollege}>🏫 {c}</div>
              ))}
            </div>
            <div style={s.tipBox}>
              <b>📌 TVET Pathway:</b> After completing N3, you can apply for the N4–N6 programme. After 18 months of workplace experience, you receive an N6 certificate which can lead to a National Diploma.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function UniversityCard({ u, aps, color }) {
  const inReach = aps === 0 || u.minAPS <= aps;
  return (
    <div style={{ ...s.uniCard, borderLeft:`4px solid ${inReach ? color : "#d97706"}` }}>
      <div style={s.uniTop}>
        <div>
          <p style={s.uniName}>{u.name}</p>
          <p style={s.uniLocation}>📍 {u.location}</p>
        </div>
        <span style={{ ...s.apsRequired, background: inReach ? "#d1fae5" : "#fef9c3", color: inReach ? "#065f46" : "#713f12" }}>
          Min APS: {u.minAPS}
        </span>
      </div>
      <div style={s.programs}>
        {u.programs.map((p, i) => <span key={i} style={s.programTag}>{p}</span>)}
      </div>
    </div>
  );
}

const s = {
  wrap:            { borderRadius:16, overflow:"hidden", border:"1px solid #e2e8f0", marginTop:24 },
  header:          { display:"flex", alignItems:"center", gap:16, padding:"20px 24px" },
  headerIcon:      { fontSize:36 },
  headerTitle:     { fontSize:20, fontWeight:800, color:"#fff", margin:0 },
  headerSub:       { fontSize:13, color:"rgba(255,255,255,.75)", margin:0 },
  tabs:            { display:"flex", borderBottom:"1px solid #e2e8f0", background:"#f8fafc" },
  tab:             { flex:1, padding:"12px", border:"none", borderBottom:"3px solid transparent", background:"transparent", fontSize:13, fontWeight:600, color:"#6b7280", cursor:"pointer" },
  tabActive:       { background:"#fff", borderBottomWidth:3, borderBottomStyle:"solid" },
  content:         { padding:"20px 24px" },
  apsNote:         { fontSize:13, color:"#6b7280", marginBottom:16, padding:"10px 14px", background:"#eff6ff", borderRadius:8 },
  groupLabel:      { fontSize:12, fontWeight:700, color:"#166534", background:"#f0fdf4", borderRadius:8, padding:"6px 12px", marginBottom:12, display:"inline-block" },
  uniCard:         { background:"#fff", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #e2e8f0" },
  uniTop:          { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8, gap:8 },
  uniName:         { fontSize:14, fontWeight:700, color:"#1e293b", margin:"0 0 2px" },
  uniLocation:     { fontSize:12, color:"#6b7280", margin:0 },
  apsRequired:     { borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:700, flexShrink:0 },
  programs:        { display:"flex", flexWrap:"wrap", gap:6 },
  programTag:      { background:"#f1f5f9", color:"#475569", borderRadius:99, padding:"3px 10px", fontSize:12 },
  nsfasHighlight:  { display:"flex", gap:12, background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:12, padding:"14px", marginBottom:16, fontSize:13, color:"#713f12", lineHeight:1.6 },
  nsfasIcon:       { fontSize:24, flexShrink:0 },
  bursaryCard:     { background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #e2e8f0" },
  bursaryTop:      { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6, gap:8, flexWrap:"wrap" },
  bursaryName:     { fontSize:14, fontWeight:700, color:"#1e293b" },
  amountBadge:     { color:"#fff", borderRadius:99, padding:"3px 12px", fontSize:12, fontWeight:700 },
  bursaryField:    { fontSize:13, color:"#374151", margin:"0 0 4px" },
  bursaryLink:     { fontSize:12, color:"#6366f1", margin:0 },
  tipBox:          { background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:12, padding:"14px 16px", marginTop:16, fontSize:13, color:"#1e40af", lineHeight:1.6 },
  tvetIntro:       { background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:12, padding:"16px", marginBottom:16 },
  tvetPrograms:    { marginBottom:16 },
  tvetProgram:     { background:"#f8fafc", borderRadius:8, padding:"8px 12px", marginBottom:6, fontSize:13, color:"#374151", border:"1px solid #e2e8f0" },
  tvetColleges:    { marginBottom:16 },
  tvetCollege:     { background:"#f8fafc", borderRadius:8, padding:"8px 12px", marginBottom:6, fontSize:13, color:"#374151", border:"1px solid #e2e8f0" },
};
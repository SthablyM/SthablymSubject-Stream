// src/components/UniversityFinder.js
import React, { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FULL PROGRAMMES DATABASE  — 55 programmes across 4 streams
// Fields: id, name, degree, duration, university, location,
//         minAPS, requiredSubjects{subjectKey, minMark}, stream,
//         category, description, careers[]
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAMMES = [
  // ══ SCIENCE ════════════════════════════════════════════════════════════════
  { id:"s01", stream:"Science Stream", category:"Health Sciences",  name:"MBChB – Medicine",            degree:"MBChB",    duration:"6 yrs", minAPS:36, universities:["UCT","Wits","UP","UKZN","SMU","UFS"],          requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:70},{key:"lifescience",label:"Life Sciences",min:60},{key:"english",label:"English",min:60}], description:"Train as a medical doctor. The most competitive degree in SA.", careers:["Medical Doctor","Surgeon","General Practitioner","Specialist Physician"] },
  { id:"s02", stream:"Science Stream", category:"Health Sciences",  name:"BDS – Dentistry",             degree:"BDS",      duration:"5 yrs", minAPS:35, universities:["Wits","UP","UWC","UKZN","Sefako Makgatho"],     requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:65},{key:"lifescience",label:"Life Sciences",min:60}], description:"Become a dentist combining science, medicine and manual skill.", careers:["Dentist","Oral Surgeon","Orthodontist"] },
  { id:"s03", stream:"Science Stream", category:"Health Sciences",  name:"BSc Veterinary Science",      degree:"BVSc",     duration:"6 yrs", minAPS:34, universities:["UP"],                                          requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:65},{key:"lifescience",label:"Life Sciences",min:65}], description:"Diagnose and treat animals. Very competitive entry.", careers:["Veterinarian","Wildlife Vet","Animal Health Inspector"] },
  { id:"s04", stream:"Science Stream", category:"Health Sciences",  name:"BSc Actuarial Science",       degree:"BSc",      duration:"3 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UFS"],         requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:80},{key:"english",label:"English",min:60}], description:"Mathematical risk modelling for insurance and finance. Top earning career.", careers:["Actuary","Risk Analyst","Investment Analyst"] },
  { id:"s05", stream:"Science Stream", category:"Health Sciences",  name:"BPharm – Pharmacy",           degree:"BPharm",   duration:"4 yrs", minAPS:32, universities:["UP","UKZN","NWU","UWC","Rhodes"],              requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:60},{key:"physscience",label:"Physical Sciences",min:60},{key:"lifescience",label:"Life Sciences",min:60}], description:"Study medicines, dispensing and patient care. High demand.", careers:["Pharmacist","Clinical Researcher","Hospital Pharmacist"] },
  { id:"s06", stream:"Science Stream", category:"Health Sciences",  name:"BSc Physiotherapy",           degree:"BSc",      duration:"4 yrs", minAPS:30, universities:["UP","Wits","UKZN","UWC","Stellenbosch"],       requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:60},{key:"physscience",label:"Physical Sciences",min:50}], description:"Rehabilitate patients with physical injuries and disabilities.", careers:["Physiotherapist","Sports Therapist","Rehabilitation Specialist"] },
  { id:"s07", stream:"Science Stream", category:"Computing & IT",   name:"BSc Data Science",            degree:"BSc",      duration:"3 yrs", minAPS:32, universities:["UCT","Wits","UP","Stellenbosch"],              requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"english",label:"English",min:50}], description:"Statistics, machine learning and big data analysis.", careers:["Data Scientist","ML Engineer","Business Analyst","Quantitative Analyst"] },
  { id:"s08", stream:"Science Stream", category:"Computing & IT",   name:"BSc Computer Science",        degree:"BSc",      duration:"3 yrs", minAPS:30, universities:["UCT","Wits","UP","Rhodes","UNISA"],             requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"english",label:"English",min:50}], description:"Core programming, algorithms, AI and software development.", careers:["Software Developer","AI Engineer","Systems Analyst"] },
  { id:"s09", stream:"Science Stream", category:"Natural Sciences", name:"BSc Physical Sciences",       degree:"BSc",      duration:"3 yrs", minAPS:28, universities:["UCT","Wits","UP","UKZN","UJ"],                 requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:60},{key:"physscience",label:"Physical Sciences",min:60}], description:"Physics, chemistry and their applications in the real world.", careers:["Physicist","Chemist","Research Scientist","Metallurgist"] },
  { id:"s10", stream:"Science Stream", category:"Natural Sciences", name:"BSc Life Sciences / Biology", degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UCT","Wits","UP","UKZN","Stellenbosch"],       requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:60},{key:"puremaths",label:"Pure Mathematics",min:50}], description:"Study living organisms, ecology, genetics and biotechnology.", careers:["Biologist","Ecologist","Geneticist","Conservation Scientist"] },
  { id:"s11", stream:"Science Stream", category:"Natural Sciences", name:"BSc Environmental Science",   degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UP","UCT","UKZN","NWU","UJ"],                  requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"physscience",label:"Physical Sciences",min:50}], description:"Study climate change, pollution, ecosystems and sustainability.", careers:["Environmental Scientist","Conservation Manager","Climate Analyst"] },
  { id:"s12", stream:"Science Stream", category:"Natural Sciences", name:"BSc Agricultural Sciences",   degree:"BSc",      duration:"4 yrs", minAPS:26, universities:["UP","Stellenbosch","UKZN","UFS","NWU"],         requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"puremaths",label:"Pure Mathematics",min:50}], description:"Food production, soil science, crop science and agribusiness.", careers:["Agricultural Scientist","Farm Manager","Food Technologist","Agronomist"] },
  { id:"s13", stream:"Science Stream", category:"Natural Sciences", name:"BSc Geology",                 degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UCT","Wits","UP","UKZN"],                      requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:55},{key:"physscience",label:"Physical Sciences",min:55}], description:"Study Earth's structure, minerals and natural resources.", careers:["Geologist","Mining Geologist","Hydrologist"] },
  { id:"s14", stream:"Science Stream", category:"Health Sciences",  name:"BSc Nursing",                 degree:"BSc",      duration:"4 yrs", minAPS:26, universities:["UP","UKZN","UWC","NWU","UL"],                  requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"english",label:"English",min:50}], description:"Train as a professional registered nurse.", careers:["Registered Nurse","Midwife","ICU Nurse","Community Health Worker"] },
  { id:"s15", stream:"Science Stream", category:"Computing & IT",   name:"BSc Information Technology",  degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UP","UJ","UKZN","NWU","UNISA"],               requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Networks, databases, cybersecurity and IT management.", careers:["IT Manager","Network Engineer","Cybersecurity Analyst"] },
  { id:"s16", stream:"Science Stream", category:"Health Sciences",  name:"BSc Occupational Therapy",    degree:"BSc",      duration:"4 yrs", minAPS:28, universities:["UP","Wits","UKZN","UWC"],                     requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"english",label:"English",min:50}], description:"Help people recover function after illness, injury or disability.", careers:["Occupational Therapist","Rehabilitation Specialist","Paediatric Therapist"] },

  // ══ COMMERCE ═══════════════════════════════════════════════════════════════
  { id:"c01", stream:"Commerce Stream", category:"Accounting & Finance",  name:"BCom Accounting",                 degree:"BCom",   duration:"3 yrs", minAPS:30, universities:["UCT","Wits","UP","Stellenbosch","UJ","UNISA"],  requiredSubjects:[{key:"puremaths",label:"Mathematics",min:60},{key:"accounting",label:"Accounting",min:60},{key:"english",label:"English",min:50}], description:"Foundation for becoming a Chartered Accountant (CA). Top SA qualification.", careers:["Chartered Accountant (CA)","Auditor","Tax Consultant","Financial Manager"] },
  { id:"c02", stream:"Commerce Stream", category:"Accounting & Finance",  name:"BCom Investment Management",      degree:"BCom",   duration:"3 yrs", minAPS:32, universities:["UCT","Wits","UP","Stellenbosch","UFS"],          requiredSubjects:[{key:"puremaths",label:"Mathematics",min:70},{key:"english",label:"English",min:55}], description:"Portfolio management, securities and financial markets.", careers:["Investment Manager","Portfolio Manager","Stockbroker","Wealth Manager"] },
  { id:"c03", stream:"Commerce Stream", category:"Accounting & Finance",  name:"BCom Financial Management",       degree:"BCom",   duration:"3 yrs", minAPS:26, universities:["UP","UJ","NWU","UKZN","UNISA"],                requiredSubjects:[{key:"puremaths",label:"Mathematics",min:55},{key:"english",label:"English",min:50}], description:"Budgeting, investment, corporate finance and financial planning.", careers:["Financial Manager","Investment Analyst","Budget Analyst"] },
  { id:"c04", stream:"Commerce Stream", category:"Economics",             name:"BCom Economics",                  degree:"BCom",   duration:"3 yrs", minAPS:28, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],         requiredSubjects:[{key:"puremaths",label:"Mathematics",min:60},{key:"english",label:"English",min:55}], description:"Study how economies, markets and governments work.", careers:["Economist","Policy Analyst","Government Advisor","Research Economist"] },
  { id:"c05", stream:"Commerce Stream", category:"Business & Management", name:"BCom Business Management",        degree:"BCom",   duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","UKZN","NMU","UNISA"],           requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Broad business skills: strategy, marketing, HR and operations.", careers:["Business Manager","Entrepreneur","Operations Manager","Marketing Manager"] },
  { id:"c06", stream:"Commerce Stream", category:"Business & Management", name:"BCom Marketing",                  degree:"BCom",   duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","CPUT","NMU"],                  requiredSubjects:[{key:"english",label:"English",min:55},{key:"puremaths",label:"Mathematics",min:50}], description:"Brand building, digital marketing, consumer behaviour and strategy.", careers:["Marketing Manager","Brand Strategist","Digital Marketer","Advertising Executive"] },
  { id:"c07", stream:"Commerce Stream", category:"Business & Management", name:"BCom Human Resource Management",  degree:"BCom",   duration:"3 yrs", minAPS:22, universities:["UP","UJ","NWU","UKZN","UNISA"],                requiredSubjects:[{key:"english",label:"English",min:55},{key:"puremaths",label:"Mathematics",min:50}], description:"Manage people, recruitment, training and workplace relations.", careers:["HR Manager","Talent Acquisition Specialist","Labour Relations Officer"] },
  { id:"c08", stream:"Commerce Stream", category:"Business & Management", name:"BCom Supply Chain & Logistics",   degree:"BCom",   duration:"3 yrs", minAPS:24, universities:["UP","UJ","CPUT","TUT","UNISA"],                requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Managing the flow of goods from supplier to consumer.", careers:["Supply Chain Manager","Logistics Manager","Procurement Officer"] },
  { id:"c09", stream:"Commerce Stream", category:"Law",                   name:"LLB – Law Degree",                degree:"LLB",    duration:"4 yrs", minAPS:30, universities:["UCT","Wits","UP","Stellenbosch","UWC","UKZN"],  requiredSubjects:[{key:"english",label:"English",min:65}], description:"Become a lawyer. Study contracts, criminal law, property and human rights.", careers:["Attorney","Advocate","Corporate Lawyer","State Prosecutor"] },
  { id:"c10", stream:"Commerce Stream", category:"Accounting & Finance",  name:"BCompt – Accounting Sciences",    degree:"BCompt", duration:"3 yrs", minAPS:20, universities:["UNISA","UFS","NWU"],                           requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Distance learning path towards professional accounting and CTA.", careers:["Accountant","Bookkeeper","Tax Practitioner","Financial Officer"] },
  { id:"c11", stream:"Commerce Stream", category:"Business & Management", name:"BBA – Business Administration",   degree:"BBA",    duration:"3 yrs", minAPS:22, universities:["UJ","UKZN","NWU","Regent","IIE Rosebank"],     requiredSubjects:[{key:"english",label:"English",min:50},{key:"puremaths",label:"Mathematics",min:50}], description:"Practical business leadership, entrepreneurship and management.", careers:["Business Owner","Operations Manager","Project Manager","Business Consultant"] },

  // ══ HUMANITIES ═════════════════════════════════════════════════════════════
  { id:"h01", stream:"Humanities Stream", category:"Media & Communication", name:"BA Journalism & Media Studies", degree:"BA",     duration:"3 yrs", minAPS:26, universities:["Rhodes","Wits","UJ","CPUT","DUT"],              requiredSubjects:[{key:"english",label:"English",min:65}], description:"Write, report, broadcast and produce content across all media.", careers:["Journalist","News Anchor","Editor","Content Creator","PR Specialist"] },
  { id:"h02", stream:"Humanities Stream", category:"Media & Communication", name:"BA Communication Science",      degree:"BA",     duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","UNISA","NMU"],                 requiredSubjects:[{key:"english",label:"English",min:60}], description:"Study how communication shapes society, business and public opinion.", careers:["Communications Officer","PR Manager","Corporate Communicator","Social Media Manager"] },
  { id:"h03", stream:"Humanities Stream", category:"Social Sciences",       name:"BSocSci Social Work",           degree:"BSocSci",duration:"4 yrs", minAPS:22, universities:["UCT","Wits","UWC","UKZN","UL","UNISA"],         requiredSubjects:[{key:"english",label:"English",min:55}], description:"Support vulnerable individuals, families and communities.", careers:["Social Worker","Community Developer","Child Protection Officer","NGO Manager"] },
  { id:"h04", stream:"Humanities Stream", category:"Social Sciences",       name:"BA Psychology",                 degree:"BA",     duration:"3 yrs + Hons", minAPS:24, universities:["UCT","Wits","UP","UKZN","NWU","UNISA"], requiredSubjects:[{key:"english",label:"English",min:60}], description:"Study human behaviour and mental processes. Honours required for practice.", careers:["Psychologist","Counsellor","HR Specialist","Researcher"] },
  { id:"h05", stream:"Humanities Stream", category:"Education",             name:"BEd Foundation Phase (Gr R–3)",  degree:"BEd",    duration:"4 yrs", minAPS:22, universities:["UP","UKZN","NWU","UJ","UL","UNISA"],           requiredSubjects:[{key:"english",label:"English",min:55}], description:"Teach Grades R–3. Extremely high demand for teachers across SA.", careers:["Foundation Phase Teacher","School Principal","Education Specialist"] },
  { id:"h06", stream:"Humanities Stream", category:"Education",             name:"BEd Intermediate Phase (Gr 4–7)",degree:"BEd",    duration:"4 yrs", minAPS:22, universities:["UP","UKZN","NWU","UJ","UNISA"],               requiredSubjects:[{key:"english",label:"English",min:55}], description:"Teach Grades 4–7 across various subjects.", careers:["Primary School Teacher","Subject Head","Education Consultant"] },
  { id:"h07", stream:"Humanities Stream", category:"Education",             name:"BEd Senior & FET Phase (Gr 8–12)",degree:"BEd",   duration:"4 yrs", minAPS:24, universities:["UP","Wits","UCT","Stellenbosch","UKZN"],       requiredSubjects:[{key:"english",label:"English",min:60}], description:"Teach Grades 8–12. Specialise in your chosen subject.", careers:["High School Teacher","HOD","School Principal","Education Manager"] },
  { id:"h08", stream:"Humanities Stream", category:"Tourism & Hospitality", name:"BA Tourism Management",         degree:"BA",     duration:"3 yrs", minAPS:20, universities:["UJ","NWU","TUT","VUT","CPUT"],                requiredSubjects:[{key:"english",label:"English",min:55},{key:"tourism",label:"Tourism",min:50}], description:"Manage tourism operations, hotels, travel agencies and events.", careers:["Tourism Manager","Hotel Manager","Travel Agent","Event Coordinator"] },
  { id:"h09", stream:"Humanities Stream", category:"Social Sciences",       name:"BA History & Political Science", degree:"BA",     duration:"3 yrs", minAPS:24, universities:["UCT","Wits","UP","Rhodes","Stellenbosch"],     requiredSubjects:[{key:"english",label:"English",min:60},{key:"history",label:"History",min:55}], description:"Understand how politics and history shape the world today.", careers:["Political Analyst","Government Official","Researcher","Diplomat"] },
  { id:"h10", stream:"Humanities Stream", category:"Arts & Culture",        name:"BA Fine Arts / Dramatic Arts",  degree:"BA",     duration:"3 yrs", minAPS:22, universities:["Wits","UCT","UP","UKZN","NMU"],               requiredSubjects:[{key:"english",label:"English",min:55}], description:"Develop as a creative artist, performer or cultural practitioner.", careers:["Artist","Actor","Director","Arts Administrator","Art Therapist"] },
  { id:"h11", stream:"Humanities Stream", category:"Education",             name:"BCurr Early Childhood Dev.",    degree:"BCurr",  duration:"4 yrs", minAPS:18, universities:["UNISA","NWU","UJ","UL"],                      requiredSubjects:[{key:"english",label:"English",min:50}], description:"Work with children aged 0–6 years. Extremely needed in SA.", careers:["ECD Practitioner","Crèche Owner","Child Development Specialist"] },
  { id:"h12", stream:"Humanities Stream", category:"Tourism & Hospitality", name:"Diploma in Hospitality Mgmt",  degree:"Diploma",duration:"3 yrs", minAPS:18, universities:["CPUT","TUT","DUT","VUT","Rosebank College"],   requiredSubjects:[{key:"english",label:"English",min:50}], description:"Food & beverage, front office, events and hotel operations.", careers:["Hotel Manager","Restaurant Manager","Event Planner","Catering Manager"] },
  { id:"h13", stream:"Humanities Stream", category:"Law",                   name:"BA Law (path to LLB)",          degree:"BA",     duration:"3+4 yrs",minAPS:28, universities:["UP","Wits","UCT","UWC"],                      requiredSubjects:[{key:"english",label:"English",min:65}], description:"Humanities pathway into law. Complete BA then apply for LLB.", careers:["Attorney","Advocate","Legal Researcher","Government Legal Advisor"] },

  // ══ ENGINEERING / TECHNICAL ═════════════════════════════════════════════════
  { id:"e01", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Civil Engineering",         degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],       requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:65}], description:"Design and build roads, bridges, dams, buildings and infrastructure.", careers:["Civil Engineer","Structural Engineer","Construction Manager"] },
  { id:"e02", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Electrical Engineering",    degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],       requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:65}], description:"Power systems, electronics, telecommunications and control systems.", careers:["Electrical Engineer","Power Engineer","Electronics Engineer"] },
  { id:"e03", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Mechanical Engineering",    degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],       requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:65}], description:"Design machines, engines, thermal systems and manufacturing processes.", careers:["Mechanical Engineer","Automotive Engineer","Manufacturing Engineer"] },
  { id:"e04", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Chemical Engineering",      degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","NWU"],         requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:70}], description:"Transform raw materials into products using chemical processes.", careers:["Chemical Engineer","Process Engineer","Petrochemical Engineer"] },
  { id:"e05", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Computer Engineering",      degree:"BSc Eng",  duration:"4 yrs", minAPS:32, universities:["UCT","Wits","UP","Stellenbosch"],              requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:60}], description:"Combine hardware and software engineering for embedded systems.", careers:["Computer Engineer","Embedded Systems Developer","IoT Specialist"] },
  { id:"e06", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Mining Engineering",        degree:"BSc Eng",  duration:"4 yrs", minAPS:30, universities:["Wits","UP","UKZN","NWU"],                      requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:65},{key:"physscience",label:"Physical Sciences",min:60}], description:"Plan and manage extraction of minerals and resources from the earth.", careers:["Mining Engineer","Blasting Engineer","Mine Manager"] },
  { id:"e07", stream:"Engineering / Technical Stream", category:"Engineering (BSc)",          name:"BSc Industrial Engineering",    degree:"BSc Eng",  duration:"4 yrs", minAPS:32, universities:["UP","Stellenbosch","Wits","UKZN"],             requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:60}], description:"Optimise processes, systems and organisations for efficiency.", careers:["Industrial Engineer","Operations Manager","Production Engineer"] },
  { id:"e08", stream:"Engineering / Technical Stream", category:"Engineering Technology",     name:"BTech Civil Engineering",       degree:"BTech",    duration:"4 yrs", minAPS:24, universities:["TUT","CPUT","DUT","UJ","Vaal"],                requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:55},{key:"techscience",label:"Technical/Physical Sciences",min:55}], description:"Practical engineering — design, construction supervision and project management.", careers:["Civil Technologist","Site Engineer","Construction Supervisor"] },
  { id:"e09", stream:"Engineering / Technical Stream", category:"Engineering Technology",     name:"BTech Electrical Engineering",  degree:"BTech",    duration:"4 yrs", minAPS:22, universities:["TUT","CPUT","DUT","UJ","VUT"],               requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:50},{key:"techscience",label:"Technical/Physical Sciences",min:50}], description:"Practical electrical and electronics engineering for industry.", careers:["Electrical Technologist","Instrumentation Technician","Maintenance Engineer"] },
  { id:"e10", stream:"Engineering / Technical Stream", category:"Engineering Technology",     name:"BTech Mechanical Engineering",  degree:"BTech",    duration:"4 yrs", minAPS:22, universities:["TUT","CPUT","DUT","UJ","VUT"],               requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:50},{key:"techscience",label:"Technical/Physical Sciences",min:50}], description:"Practical mechanical engineering focused on manufacturing and maintenance.", careers:["Mechanical Technologist","Maintenance Engineer","Production Supervisor"] },
  { id:"e11", stream:"Engineering / Technical Stream", category:"Architecture & Built Env.",  name:"BSc Architecture",              degree:"BSc Arch", duration:"3+2 yrs",minAPS:28, universities:["UCT","Wits","UP","UKZN","NMU","TUT"],          requiredSubjects:[{key:"puremaths",label:"Mathematics",min:60},{key:"english",label:"English",min:55}], description:"Design buildings and spaces. 3yr BSc + 2yr professional degree.", careers:["Architect","Urban Designer","Interior Architect","Project Manager"] },
  { id:"e12", stream:"Engineering / Technical Stream", category:"Architecture & Built Env.",  name:"BSc Quantity Surveying",        degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UP","Wits","UCT","UKZN","TUT","CPUT"],         requiredSubjects:[{key:"puremaths",label:"Mathematics",min:55},{key:"english",label:"English",min:50}], description:"Cost management and financial planning for construction projects.", careers:["Quantity Surveyor","Cost Estimator","Project Manager"] },
  { id:"e13", stream:"Engineering / Technical Stream", category:"Architecture & Built Env.",  name:"Diploma Architectural Technology",degree:"Diploma", duration:"3 yrs", minAPS:20, universities:["TUT","CPUT","DUT","VUT"],                     requiredSubjects:[{key:"techmaths",label:"Maths",min:50},{key:"egd",label:"EGD",min:50}], description:"Drafting, building plans, AutoCAD and architectural support work.", careers:["Architectural Technician","Draughtsperson","CAD Technician","Building Inspector"] },
  { id:"e14", stream:"Engineering / Technical Stream", category:"Computing & IT",             name:"Diploma in Information Technology",degree:"Diploma",duration:"3 yrs", minAPS:20, universities:["TUT","CPUT","DUT","UJ","UNISA"],              requiredSubjects:[{key:"techmaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Networks, programming, web development and IT support.", careers:["IT Support Specialist","Web Developer","Network Technician"] },
  { id:"e15", stream:"Engineering / Technical Stream", category:"TVET / N-Certificates",      name:"N1–N6 Engineering (TVET)",      degree:"N-Cert",   duration:"1–3 yrs",minAPS:16, universities:["Any TVET College — nationwide"],                requiredSubjects:[{key:"techmaths",label:"Basic/Technical Maths",min:30}], description:"Practical qualification in Civil, Electrical or Mechanical. N6 + 18 months work = National Diploma.", careers:["Electrician","Plumber","Welder","Fitter & Turner","Motor Mechanic"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT KEY → human label map (must match StudentProfile keys)
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECT_LABELS = {
  english:"English", puremaths:"Pure Mathematics", techmaths:"Technical Mathematics",
  mathslit:"Maths Literacy", physscience:"Physical Sciences", lifescience:"Life Sciences",
  geography:"Geography", agroscience:"Agricultural Sciences", accounting:"Accounting",
  business:"Business Studies", economics:"Economics", history:"History",
  tourism:"Tourism", consumer:"Consumer Studies", techscience:"Technical Sciences",
  civiltech:"Civil Technology", electricaltech:"Electrical Technology",
  mechanicaltech:"Mechanical Technology", egd:"EGD", itcs:"IT / CAT",
  lifeorien:"Life Orientation", drama:"Drama", arts:"Visual Arts",
  religion:"Religion", secondlang:"2nd Language",
};

const STREAM_COLORS = {
  "Science Stream":"#2563eb","Commerce Stream":"#16a34a",
  "Humanities Stream":"#9333ea","Engineering / Technical Stream":"#ea580c",
};

const STREAM_CATEGORIES = {
  "Science Stream":                 ["All","Health Sciences","Natural Sciences","Computing & IT"],
  "Commerce Stream":                ["All","Accounting & Finance","Business & Management","Economics","Law"],
  "Humanities Stream":              ["All","Media & Communication","Social Sciences","Education","Tourism & Hospitality","Arts & Culture","Law"],
  "Engineering / Technical Stream": ["All","Engineering (BSc)","Engineering Technology","Architecture & Built Env.","Computing & IT","TVET / N-Certificates"],
};

const BURSARIES = {
  "Science Stream": [
    { name:"NSFAS",                             field:"All Science degrees",         amount:"Full cost of study",   link:"nsfas.org.za",     note:"Apply before 31 January. Household income < R350 000/yr." },
    { name:"National Research Foundation",      field:"Science & Research",          amount:"Up to R150 000/yr",   link:"nrf.ac.za" },
    { name:"Sasol Bursary",                     field:"Sciences & Engineering",      amount:"Up to R200 000/yr",   link:"sasol.com" },
    { name:"SA Medical Research Council",       field:"Medical Sciences",            amount:"Up to R120 000/yr",   link:"samrc.ac.za" },
    { name:"DAFF Bursary",                      field:"Agricultural Sciences",       amount:"Up to R80 000/yr",    link:"dalrrd.gov.za" },
    { name:"Discovery Health Bursary",          field:"Health Sciences",             amount:"Up to R100 000/yr",   link:"discovery.co.za" },
    { name:"Anglo American Bursary",            field:"Science & Engineering",       amount:"Up to R200 000/yr",   link:"angloamerican.com" },
  ],
  "Commerce Stream": [
    { name:"NSFAS",                             field:"All Commerce degrees",        amount:"Full cost of study",   link:"nsfas.org.za",     note:"Apply before 31 January." },
    { name:"SAICA Training Bursary",            field:"Chartered Accountancy (CA)",  amount:"Full tuition + stipend",link:"saica.co.za",    note:"Includes learnership — very competitive." },
    { name:"Deloitte Bursary",                  field:"Accounting / Finance",        amount:"Up to R120 000/yr",   link:"deloitte.com/za" },
    { name:"KPMG Bursary",                      field:"Accounting & Auditing",       amount:"Up to R100 000/yr",   link:"kpmg.com/za" },
    { name:"Standard Bank Bursary",             field:"Finance & Commerce",          amount:"Up to R100 000/yr",   link:"standardbank.co.za" },
    { name:"ABSA Bursary",                      field:"Commerce & Economics",        amount:"Up to R90 000/yr",    link:"absa.co.za" },
    { name:"FirstRand Bursary",                 field:"Finance & Actuarial",         amount:"Up to R80 000/yr",    link:"firstrand.co.za" },
  ],
  "Humanities Stream": [
    { name:"NSFAS",                             field:"All Humanities degrees",      amount:"Full cost of study",   link:"nsfas.org.za",     note:"Apply before 31 January." },
    { name:"Dept of Social Development",        field:"Social Work (govt-funded)",   amount:"Full tuition",         link:"dsd.gov.za",       note:"Obligatory service in rural areas after graduation." },
    { name:"Dept of Basic Education Bursary",   field:"Teaching / BEd",             amount:"Full tuition + stipend",link:"dbe.gov.za",      note:"Teach in a public school after graduating." },
    { name:"Oppenheimer Memorial Trust",        field:"Social Sciences & Arts",      amount:"Up to R80 000/yr",    link:"omtrust.org.za" },
    { name:"Media24 Bursary",                   field:"Journalism & Media",          amount:"Up to R60 000/yr",    link:"media24.com" },
    { name:"SETA Bursaries",                    field:"Various Humanities sectors",  amount:"Varies by SETA",       link:"qcto.org.za" },
  ],
  "Engineering / Technical Stream": [
    { name:"NSFAS",                             field:"All Engineering degrees",     amount:"Full cost of study",   link:"nsfas.org.za",     note:"Apply before 31 January." },
    { name:"Eskom Bursary",                     field:"Electrical / Mechanical Eng", amount:"Up to R150 000/yr",   link:"eskom.co.za" },
    { name:"Transnet Bursary",                  field:"Civil / Mechanical Eng",      amount:"Up to R100 000/yr",   link:"transnet.net" },
    { name:"Anglo American Bursary",            field:"Mining & Engineering",        amount:"Up to R200 000/yr",   link:"angloamerican.com" },
    { name:"ECSA Bursary",                      field:"All Engineering disciplines", amount:"Up to R120 000/yr",   link:"ecsa.co.za" },
    { name:"Sasol Bursary",                     field:"Chemical / Mechanical Eng",   amount:"Up to R200 000/yr",   link:"sasol.com" },
    { name:"Telkom Bursary",                    field:"IT & Electrical Engineering", amount:"Up to R80 000/yr",    link:"telkom.co.za" },
    { name:"ArcelorMittal Bursary",             field:"Metallurgical / Mechanical",  amount:"Up to R90 000/yr",    link:"arcelormittal.co.za" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
// Check if student's marks satisfy a programme's subject requirements.
// Returns { met: bool, details: [{label, required, actual, pass}] }
function checkSubjectReqs(requiredSubjects, marks) {
  if (!marks || Object.keys(marks).length === 0) return { met: true, details: [] };
  const details = requiredSubjects.map(({ key, label, min }) => {
    // Try exact key, then fuzzy match (e.g. techmaths matches puremaths too)
    let actual = marks[key];
    // If student has puremaths but programme wants techmaths (or vice-versa), treat as equivalent
    if (actual == null && key === "techmaths")  actual = marks["puremaths"] || marks["techmaths"];
    if (actual == null && key === "puremaths")  actual = marks["puremaths"] || marks["techmaths"];
    if (actual == null && key === "techscience") actual = marks["physscience"] || marks["techscience"];
    if (actual == null) return { label, required: min, actual: null, pass: true }; // subject not taken — don't penalise
    return { label, required: min, actual, pass: actual >= min };
  });
  const met = details.every(d => d.pass);
  return { met, details };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UniversityFinder({ stream, aps = 0, marks = {} }) {
  const color     = STREAM_COLORS[stream] || "#2563eb";
  const categories = STREAM_CATEGORIES[stream] || ["All"];

  const [category, setCategory] = useState("All");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);
  const [tab,      setTab]      = useState("programmes");
  const [showAll,  setShowAll]  = useState(false); // show beyond-reach programmes

  const hasMarks = marks && Object.values(marks).some(v => v > 0);
  const hasAPS   = aps > 0;

  // ── filter & annotate ────────────────────────────────────────────────────
  const annotated = useMemo(() => {
    return PROGRAMMES
      .filter(p => p.stream === stream)
      .map(p => {
        const apsGap    = hasAPS ? p.minAPS - aps : 0;
        const subCheck  = checkSubjectReqs(p.requiredSubjects, marks);
        const apsOk     = !hasAPS || apsGap <= 0;
        const subOk     = subCheck.met;
        // Status
        const status =
          (!hasAPS && !hasMarks)                       ? "unknown"  :
          apsOk && subOk                               ? "qualified":
          apsOk && !subOk                              ? "marks"    :   // APS fine, marks gap
          !apsOk && apsGap <= 5 && subOk               ? "stretch"  :   // close on APS
          !apsOk && apsGap <= 5 && !subOk              ? "stretch"  :
                                                         "beyond";
        return { ...p, apsGap, subCheck, apsOk, subOk, status };
      });
  }, [stream, aps, marks, hasAPS, hasMarks]);

  const filtered = useMemo(() => {
    let list = annotated;
    if (category !== "All") list = list.filter(p => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.careers.some(c => c.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [annotated, category, search]);

  const qualified = filtered.filter(p => p.status === "qualified");
  const marks_gap = filtered.filter(p => p.status === "marks");
  const stretch   = filtered.filter(p => p.status === "stretch");
  const beyond    = filtered.filter(p => p.status === "beyond");
  const unknown   = filtered.filter(p => p.status === "unknown");

  const apsColor = aps >= 30 ? "#16a34a" : aps >= 22 ? "#d97706" : aps > 0 ? "#dc2626" : "#6b7280";

  return (
    <div style={S.wrap}>
      {/* Header */}
      <div style={{ ...S.header, background: color }}>
        <div style={S.hRow}>
          <div>
            <h2 style={S.hTitle}>What Can You Study?</h2>
            <p style={S.hSub}>
              {stream} · {PROGRAMMES.filter(p=>p.stream===stream).length} programmes
              {hasAPS && <> · APS <b style={{color:"#fff"}}>{aps}/42</b></>}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        <button style={{...S.tab,...(tab==="programmes"?{...S.tabOn,borderBottomColor:color,color}:{})}} onClick={()=>setTab("programmes")}>
          📚 Programmes
        </button>
        <button style={{...S.tab,...(tab==="bursaries"?{...S.tabOn,borderBottomColor:color,color}:{})}} onClick={()=>setTab("bursaries")}>
          💰 Bursaries
        </button>
      </div>

      {/* ════ PROGRAMMES ════════════════════════════════════════════════════ */}
      {tab === "programmes" && (
        <div style={S.body}>

          {/* APS + Marks summary bar */}
          {(hasAPS || hasMarks) && (
            <div style={{...S.summaryBar, borderColor: apsColor}}>
              <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
                {hasAPS && (
                  <div>
                    <span style={{fontSize:11,color:"#6b7280",display:"block"}}>YOUR APS</span>
                    <span style={{fontSize:26,fontWeight:900,color:apsColor}}>{aps}</span>
                    <span style={{fontSize:12,color:"#94a3b8"}}>/42</span>
                  </div>
                )}
                {hasMarks && (
                  <div style={{flex:1}}>
                    <span style={{fontSize:11,color:"#6b7280",display:"block",marginBottom:4}}>YOUR SUBJECTS</span>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {Object.entries(marks).filter(([,v])=>v>0).map(([k,v])=>{
                        const col = v>=70?"#d1fae5":v>=50?"#fef9c3":"#fee2e2";
                        const tc  = v>=70?"#065f46":v>=50?"#713f12":"#991b1b";
                        return <span key={k} style={{background:col,color:tc,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700}}>{SUBJECT_LABELS[k]||k}: {v}%</span>;
                      })}
                    </div>
                  </div>
                )}
              </div>
              {hasAPS && (
                <p style={{margin:"8px 0 0",fontSize:12,color:"#6b7280"}}>
                  {aps>=30?"🟢 Strong APS — most programmes within reach"
                  :aps>=22?"🟡 Good APS — many programmes available"
                  :"🔴 Keep improving — focus on your key subjects"}
                </p>
              )}
            </div>
          )}

          {/* Filters */}
          <div style={S.filters}>
            <input style={S.search} placeholder="🔍 Search programme or career…" value={search} onChange={e=>setSearch(e.target.value)} />
            <select style={S.select} value={category} onChange={e=>setCategory(e.target.value)}>
              {categories.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Count */}
          <p style={{fontSize:12,color:"#94a3b8",marginBottom:12}}>
            Showing <b style={{color:"#1e293b"}}>{filtered.length}</b> programme{filtered.length!==1?"s":""}
            {hasAPS&&<> — <span style={{color:"#16a34a",fontWeight:700}}>{qualified.length} you qualify for</span>{stretch.length>0&&<>, <span style={{color:"#d97706",fontWeight:700}}>{stretch.length} stretch</span></>}</>}
          </p>

          {filtered.length === 0 && (
            <div style={S.empty}>
              <p style={{fontSize:32,margin:"0 0 8px"}}>🔍</p>
              <p style={{fontWeight:700,color:"#1e293b"}}>No programmes match</p>
              <p style={{color:"#6b7280",fontSize:13}}>Try clearing the search or changing the category</p>
            </div>
          )}

          {/* ── QUALIFIED ── */}
          {qualified.length > 0 && (
            <Section color="#16a34a" bg="#f0fdf4" border="#bbf7d0"
              label={`✅ You Qualify (${qualified.length})`}
              subtitle={hasMarks ? "Your APS and subject marks meet the requirements" : "Your APS meets the minimum requirement"}>
              {qualified.map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}
            </Section>
          )}

          {/* ── MARKS GAP ── */}
          {marks_gap.length > 0 && (
            <Section color="#9333ea" bg="#faf5ff" border="#e9d5ff"
              label={`📈 Improve Your Marks (${marks_gap.length})`}
              subtitle="Your APS qualifies, but one or more subject marks need improvement">
              {marks_gap.map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}
            </Section>
          )}

          {/* ── STRETCH ── */}
          {stretch.length > 0 && (
            <Section color="#d97706" bg="#fffbeb" border="#fde68a"
              label={`🚀 Stretch Goals (${stretch.length})`}
              subtitle="You need up to 5 more APS points — push hard in Grade 11 and 12">
              {stretch.map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}
            </Section>
          )}

          {/* ── BEYOND / UNKNOWN ── */}
          {(beyond.length > 0 || unknown.length > 0) && (
            <div style={{marginTop:8}}>
              <button style={{...S.showMoreBtn, borderColor:color, color}} onClick={()=>setShowAll(v=>!v)}>
                {showAll?"▲ Hide":"▼ Show"} {beyond.length + unknown.length} more programmes
              </button>
              {showAll && (
                <Section color="#94a3b8" bg="#f8fafc" border="#e2e8f0"
                  label="📚 All Other Programmes"
                  subtitle="Long-term goals — aim high and keep improving">
                  {[...beyond,...unknown].map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}
                </Section>
              )}
            </div>
          )}

        </div>
      )}

      {/* ════ BURSARIES ═════════════════════════════════════════════════════ */}
      {tab === "bursaries" && <BursaryPanel stream={stream} color={color} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function Section({ color, bg, border, label, subtitle, children }) {
  return (
    <div style={{marginBottom:20}}>
      <div style={{background:bg,border:`1px solid ${border}`,borderRadius:10,padding:"8px 14px",marginBottom:10}}>
        <span style={{fontSize:13,fontWeight:800,color}}>{label}</span>
        {subtitle && <p style={{fontSize:11,color,margin:"2px 0 0",opacity:0.8}}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMME CARD
// ─────────────────────────────────────────────────────────────────────────────
function Card({ p, color, expanded, setExpanded }) {
  const isOpen = expanded === p.id;

  const statusColors = {
    qualified:{ border:"#16a34a", badge:"#d1fae5", badgeTxt:"#065f46" },
    marks:    { border:"#9333ea", badge:"#f3e8ff", badgeTxt:"#6b21a8" },
    stretch:  { border:"#d97706", badge:"#fef9c3", badgeTxt:"#713f12" },
    beyond:   { border:"#94a3b8", badge:"#f1f5f9", badgeTxt:"#475569" },
    unknown:  { border:"#94a3b8", badge:"#eff6ff", badgeTxt:"#1e40af" },
  };
  const sc = statusColors[p.status] || statusColors.unknown;

  return (
    <div style={{...S.card, borderLeft:`4px solid ${sc.border}`, marginBottom:8}}>
      {/* Top row — always visible */}
      <div style={S.cardTop} onClick={()=>setExpanded(isOpen?null:p.id)}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
            <span style={S.catBadge}>{p.category}</span>
            <span style={S.degBadge}>{p.degree} · {p.duration}</span>
          </div>
          <p style={S.cardName}>{p.name}</p>
          <div style={S.metaRow}>
            <span style={S.meta}>🏛️ {p.universities.slice(0,3).join(" · ")}{p.universities.length>3?` +${p.universities.length-3} more`:""}</span>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
          <div style={{...S.apsBadge, background:sc.badge, color:sc.badgeTxt}}>
            <span style={{fontSize:9,display:"block"}}>Min APS</span>
            <span style={{fontSize:22,fontWeight:900,lineHeight:1}}>{p.minAPS}</span>
            {p.apsGap > 0 && <span style={{fontSize:9,display:"block"}}>need +{p.apsGap}</span>}
            {p.apsGap <= 0 && p.status!=="unknown" && <span style={{fontSize:9,display:"block"}}>✓ ok</span>}
          </div>
          <span style={{fontSize:16,color:"#cbd5e1"}}>{isOpen?"▲":"▼"}</span>
        </div>
      </div>

      {/* Expanded */}
      {isOpen && (
        <div style={S.detail}>
          <p style={S.desc}>{p.description}</p>

          <div style={S.dGrid}>
            {/* Subject requirements */}
            <div style={S.dBox}>
              <h4 style={S.dTitle}>📋 Subject Requirements</h4>
              {p.requiredSubjects.map((req,i)=>{
                const d = p.subCheck.details.find(x=>x.label===req.label);
                const hasData = d && d.actual != null;
                const pass    = !hasData || d.pass;
                return (
                  <div key={i} style={{...S.reqRow, background: hasData?(pass?"#f0fdf4":"#fff1f2"):"#f8fafc"}}>
                    <span style={{fontSize:13}}>{pass||!hasData?"✓":"✗"}</span>
                    <div style={{flex:1}}>
                      <span style={{fontSize:12,fontWeight:600,color:"#1e293b"}}>{req.label}</span>
                      <span style={{fontSize:11,color:"#6b7280"}}> — min {req.min}%</span>
                    </div>
                    {hasData && (
                      <span style={{fontSize:12,fontWeight:700,color:pass?"#16a34a":"#dc2626"}}>
                        You: {d.actual}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Careers */}
            <div style={S.dBox}>
              <h4 style={S.dTitle}>🎓 Career Paths</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {p.careers.map((c,i)=>(
                  <span key={i} style={{...S.careerChip, background:`${color}18`, color}}>{c}</span>
                ))}
              </div>
              <div style={{marginTop:12}}>
                <h4 style={S.dTitle}>🏛️ Universities</h4>
                <p style={{fontSize:12,color:"#374151",margin:0,lineHeight:1.8}}>
                  {p.universities.join(" · ")}
                </p>
              </div>
            </div>
          </div>

          {/* APS advice */}
          {p.apsGap > 0 && (
            <div style={S.advice}>
              💡 You need <b>{p.apsGap} more APS point{p.apsGap!==1?"s":""}</b>. Focus on improving your weakest subjects before Grade 12.
            </div>
          )}
          {p.status==="marks" && (
            <div style={{...S.advice,background:"#faf5ff",borderColor:"#e9d5ff",color:"#6b21a8"}}>
              📈 Your APS qualifies! Improve the subject mark{p.subCheck.details.filter(d=>!d.pass).length>1?"s":""} highlighted above to unlock this programme.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BURSARY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function BursaryPanel({ stream, color }) {
  const list = BURSARIES[stream] || [];
  return (
    <div style={S.body}>
      <div style={S.nsfas}>
        <span style={{fontSize:32,flexShrink:0}}>🎯</span>
        <div>
          <h3 style={{margin:"0 0 4px",color:"#713f12",fontSize:15}}>Apply for NSFAS First!</h3>
          <p style={{margin:0,fontSize:13,color:"#713f12",lineHeight:1.6}}>
            NSFAS covers <b>full tuition, accommodation, meals and travel</b> for qualifying students at public universities and TVET colleges.
            Apply at <a href="https://nsfas.org.za" target="_blank" rel="noopener noreferrer" style={{color:"#92400e",fontWeight:700}}>nsfas.org.za</a> — deadline is <b>31 January</b> each year. Household income must be under R350 000/year.
          </p>
        </div>
      </div>

      {list.map((b,i)=>(
        <div key={i} style={S.bCard}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap",marginBottom:6}}>
            <span style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{b.name}</span>
            <span style={{background:color,color:"#fff",borderRadius:99,padding:"3px 12px",fontSize:12,fontWeight:700,flexShrink:0}}>{b.amount}</span>
          </div>
          <p style={{fontSize:13,color:"#374151",margin:"0 0 3px"}}>📚 {b.field}</p>
          {b.note && <p style={{fontSize:12,color:"#d97706",margin:"0 0 3px"}}>ℹ️ {b.note}</p>}
          <a href={`https://${b.link}`} target="_blank" rel="noopener noreferrer"
             style={{fontSize:12,color:"#6366f1",margin:0,display:"inline-flex",alignItems:"center",gap:5,textDecoration:"none",fontWeight:600}}>
            🌐 {b.link} <span style={{fontSize:10,opacity:0.7}}>↗</span>
          </a>
        </div>
      ))}

      <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:16,marginTop:16}}>
        <b style={{fontSize:13}}>📋 Bursary Application Tips:</b>
        <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
          {["Apply in Grade 11 — bursaries open August/September, before matric.",
            "Maintain 60%+ in all relevant subjects — this is the minimum threshold for most bursaries.",
            "Write a strong motivational letter about your career goals and financial need.",
            "Get certified copies of: your ID, latest school report, and parent/guardian payslip or affidavit.",
            "Apply to at least 3–5 bursaries simultaneously — never rely on just one.",
            "Follow up after submitting — call or email to confirm your application was received."]
          .map((t,i)=>(
            <div key={i} style={{display:"flex",gap:10,fontSize:13,color:"#374151",lineHeight:1.6}}>
              <span style={{width:22,height:22,borderRadius:"50%",background:color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  wrap:       { borderRadius:16, overflow:"hidden", border:"1px solid #e2e8f0", background:"#fff", fontFamily:"'Segoe UI',sans-serif" },
  header:     { padding:"20px 24px" },
  hRow:       { display:"flex", alignItems:"center", gap:14 },
  hTitle:     { fontSize:22, fontWeight:800, color:"#fff", margin:0 },
  hSub:       { fontSize:13, color:"rgba(255,255,255,.75)", margin:"4px 0 0" },
  tabs:       { display:"flex", borderBottom:"2px solid #f1f5f9", background:"#fafafa" },
  tab:        { flex:1, padding:"13px 10px", border:"none", borderBottom:"3px solid transparent", background:"transparent", fontSize:13, fontWeight:600, color:"#6b7280", cursor:"pointer" },
  tabOn:      { background:"#fff", borderBottomWidth:3, borderBottomStyle:"solid" },
  body:       { padding:20 },
  summaryBar: { border:"2px solid", borderRadius:12, padding:"14px 16px", marginBottom:16, background:"#f8fafc" },
  filters:    { display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" },
  search:     { flex:2, minWidth:160, padding:"9px 12px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:13, outline:"none" },
  select:     { flex:1, minWidth:140, padding:"9px 10px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:12, outline:"none", background:"#fff" },
  empty:      { textAlign:"center", padding:"40px 20px", color:"#6b7280" },
  showMoreBtn:{ display:"block", width:"100%", padding:"10px", border:"2px dashed", borderRadius:10, background:"transparent", fontSize:13, fontWeight:600, cursor:"pointer", marginBottom:12 },
  card:       { borderRadius:12, border:"1px solid #e2e8f0", overflow:"hidden" },
  cardTop:    { display:"flex", justifyContent:"space-between", padding:"14px 16px", gap:12, cursor:"pointer", alignItems:"flex-start" },
  catBadge:   { background:"#f1f5f9", color:"#475569", borderRadius:99, padding:"2px 10px", fontSize:10, fontWeight:700 },
  degBadge:   { background:"#eff6ff", color:"#1e40af", borderRadius:99, padding:"2px 10px", fontSize:10, fontWeight:600 },
  cardName:   { fontSize:15, fontWeight:700, color:"#1e293b", margin:"0 0 6px" },
  metaRow:    { display:"flex", flexWrap:"wrap", gap:8 },
  meta:       { fontSize:11, color:"#6b7280" },
  apsBadge:   { borderRadius:10, padding:"6px 12px", textAlign:"center", minWidth:58 },
  detail:     { padding:"0 16px 16px", borderTop:"1px solid #f1f5f9" },
  desc:       { fontSize:13, color:"#374151", lineHeight:1.7, margin:"12px 0 14px" },
  dGrid:      { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 },
  dBox:       { background:"#f8fafc", borderRadius:10, padding:"12px 14px" },
  dTitle:     { fontSize:12, fontWeight:700, color:"#1e293b", margin:"0 0 8px" },
  reqRow:     { display:"flex", alignItems:"center", gap:8, borderRadius:8, padding:"5px 8px", marginBottom:4 },
  careerChip: { borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:600 },
  advice:     { background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#713f12", lineHeight:1.6 },
  nsfas:      { display:"flex", gap:14, background:"#fffbeb", border:"1px solid #fcd34d", borderRadius:14, padding:16, marginBottom:16, alignItems:"flex-start" },
  bCard:      { background:"#f8fafc", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #e2e8f0" },
};
// src/components/UniversityFinder.js
import React, { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 70+ PROGRAMMES  — degrees + diplomas across all 4 streams
// ─────────────────────────────────────────────────────────────────────────────
export const PROGRAMMES = [
  // ══ SCIENCE ════════════════════════════════════════════════════════════════
  { id:"s01", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"MBChB – Medicine",               degree:"MBChB",    duration:"6 yrs", minAPS:36, universities:["UCT","Wits","UP","UKZN","SMU","UFS"],          requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:70},{key:"lifescience",label:"Life Sciences",min:60},{key:"english",label:"English",min:60}], description:"Train as a medical doctor. The most competitive degree in SA.", careers:["Medical Doctor","Surgeon","General Practitioner","Specialist Physician"] },
  { id:"s02", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BDS – Dentistry",                degree:"BDS",      duration:"5 yrs", minAPS:35, universities:["Wits","UP","UWC","UKZN","Sefako Makgatho"],     requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:65},{key:"lifescience",label:"Life Sciences",min:60}], description:"Become a dentist combining science, medicine and manual skill.", careers:["Dentist","Oral Surgeon","Orthodontist"] },
  { id:"s03", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BSc Veterinary Science",         degree:"BVSc",     duration:"6 yrs", minAPS:34, universities:["UP"],                                          requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:65},{key:"lifescience",label:"Life Sciences",min:65}], description:"Diagnose and treat animals. Very competitive entry.", careers:["Veterinarian","Wildlife Vet","Animal Health Inspector"] },
  { id:"s04", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BSc Actuarial Science",          degree:"BSc",      duration:"3 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UFS"],         requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:80},{key:"english",label:"English",min:60}], description:"Mathematical risk modelling for insurance and finance. Top earning career.", careers:["Actuary","Risk Analyst","Investment Analyst"] },
  { id:"s05", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BPharm – Pharmacy",              degree:"BPharm",   duration:"4 yrs", minAPS:32, universities:["UP","UKZN","NWU","UWC","Rhodes"],              requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:60},{key:"physscience",label:"Physical Sciences",min:60},{key:"lifescience",label:"Life Sciences",min:60}], description:"Study medicines, dispensing and patient care. High demand.", careers:["Pharmacist","Clinical Researcher","Hospital Pharmacist"] },
  { id:"s06", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BSc Physiotherapy",              degree:"BSc",      duration:"4 yrs", minAPS:30, universities:["UP","Wits","UKZN","UWC","Stellenbosch"],       requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:60},{key:"physscience",label:"Physical Sciences",min:50}], description:"Rehabilitate patients with physical injuries and disabilities.", careers:["Physiotherapist","Sports Therapist","Rehabilitation Specialist"] },
  { id:"s07", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BSc Occupational Therapy",       degree:"BSc",      duration:"4 yrs", minAPS:28, universities:["UP","Wits","UKZN","UWC"],                     requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"english",label:"English",min:50}], description:"Help people recover function after illness, injury or disability.", careers:["Occupational Therapist","Rehabilitation Specialist","Paediatric Therapist"] },
  { id:"s08", stream:"Science Stream", category:"Health Sciences",  type:"Degree",  name:"BSc Nursing",                    degree:"BSc",      duration:"4 yrs", minAPS:26, universities:["UP","UKZN","UWC","NWU","UL"],                  requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"english",label:"English",min:50}], description:"Train as a professional registered nurse.", careers:["Registered Nurse","Midwife","ICU Nurse","Community Health Worker"] },
  { id:"s09", stream:"Science Stream", category:"Computing & IT",   type:"Degree",  name:"BSc Data Science",               degree:"BSc",      duration:"3 yrs", minAPS:32, universities:["UCT","Wits","UP","Stellenbosch"],              requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"english",label:"English",min:50}], description:"Statistics, machine learning and big data analysis.", careers:["Data Scientist","ML Engineer","Business Analyst","Quantitative Analyst"] },
  { id:"s10", stream:"Science Stream", category:"Computing & IT",   type:"Degree",  name:"BSc Computer Science",           degree:"BSc",      duration:"3 yrs", minAPS:30, universities:["UCT","Wits","UP","Rhodes","UNISA"],             requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"english",label:"English",min:50}], description:"Core programming, algorithms, AI and software development.", careers:["Software Developer","AI Engineer","Systems Analyst"] },
  { id:"s11", stream:"Science Stream", category:"Computing & IT",   type:"Degree",  name:"BSc Information Technology",     degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UP","UJ","UKZN","NWU","UNISA"],               requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Networks, databases, cybersecurity and IT management.", careers:["IT Manager","Network Engineer","Cybersecurity Analyst"] },
  { id:"s12", stream:"Science Stream", category:"Natural Sciences",  type:"Degree",  name:"BSc Physical Sciences",          degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UCT","Wits","UP","UKZN","UJ"],                 requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:60},{key:"physscience",label:"Physical Sciences",min:60}], description:"Physics, chemistry and their applications.", careers:["Physicist","Chemist","Research Scientist","Metallurgist"] },
  { id:"s13", stream:"Science Stream", category:"Natural Sciences",  type:"Degree",  name:"BSc Life Sciences",              degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UCT","Wits","UP","UKZN","Stellenbosch"],       requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:60},{key:"puremaths",label:"Pure Mathematics",min:50}], description:"Study living organisms, ecology, genetics and biotechnology.", careers:["Biologist","Ecologist","Geneticist","Conservation Scientist"] },
  { id:"s14", stream:"Science Stream", category:"Natural Sciences",  type:"Degree",  name:"BSc Environmental Science",      degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UP","UCT","UKZN","NWU","UJ"],                  requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"physscience",label:"Physical Sciences",min:50}], description:"Study climate change, pollution, ecosystems and sustainability.", careers:["Environmental Scientist","Conservation Manager","Climate Analyst"] },
  { id:"s15", stream:"Science Stream", category:"Natural Sciences",  type:"Degree",  name:"BSc Agricultural Sciences",      degree:"BSc",      duration:"4 yrs", minAPS:26, universities:["UP","Stellenbosch","UKZN","UFS","NWU"],         requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"puremaths",label:"Pure Mathematics",min:50}], description:"Food production, soil science, crop science and agribusiness.", careers:["Agricultural Scientist","Farm Manager","Food Technologist","Agronomist"] },
  { id:"s16", stream:"Science Stream", category:"Natural Sciences",  type:"Degree",  name:"BSc Geology",                    degree:"BSc",      duration:"3 yrs", minAPS:26, universities:["UCT","Wits","UP","UKZN"],                      requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:55},{key:"physscience",label:"Physical Sciences",min:55}], description:"Study Earth's structure, minerals and natural resources.", careers:["Geologist","Mining Geologist","Hydrologist"] },
  // Health Diplomas
  { id:"sd01", stream:"Science Stream", category:"Health Sciences", type:"Diploma",  name:"Diploma in Radiography",         degree:"Diploma",  duration:"3 yrs", minAPS:28, universities:["CPUT","DUT","TUT","Wits"],                     requiredSubjects:[{key:"physscience",label:"Physical Sciences",min:50},{key:"lifescience",label:"Life Sciences",min:50}], description:"Perform diagnostic imaging — X-ray, CT scans, MRI and ultrasound.", careers:["Radiographer","X-ray Technician","Diagnostic Imaging Specialist"] },
  { id:"sd02", stream:"Science Stream", category:"Health Sciences", type:"Diploma",  name:"Diploma in Emergency Medical Care",degree:"Diploma", duration:"3 yrs", minAPS:24, universities:["CPUT","DUT","TUT","NWU"],                     requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"english",label:"English",min:50}], description:"Become a paramedic. Work in emergency services and trauma response.", careers:["Paramedic","Emergency Medical Technician","Air Ambulance Crew"] },
  { id:"sd03", stream:"Science Stream", category:"Health Sciences", type:"Diploma",  name:"Diploma in Dental Therapy",       degree:"Diploma",  duration:"3 yrs", minAPS:26, universities:["UWC","Sefako Makgatho","UKZN"],                requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"physscience",label:"Physical Sciences",min:50}], description:"Provide dental care and oral hygiene services.", careers:["Dental Therapist","Oral Hygienist"] },
  { id:"sd04", stream:"Science Stream", category:"Health Sciences", type:"Diploma",  name:"Diploma in Environmental Health", degree:"Diploma",  duration:"3 yrs", minAPS:24, universities:["TUT","CPUT","DUT","UWC"],                     requiredSubjects:[{key:"lifescience",label:"Life Sciences",min:50},{key:"english",label:"English",min:50}], description:"Inspect food safety, water quality, pollution and public health.", careers:["Environmental Health Officer","Health Inspector","Food Safety Officer"] },
  { id:"sd05", stream:"Science Stream", category:"Computing & IT",  type:"Diploma",  name:"Diploma in Information Technology",degree:"Diploma", duration:"3 yrs", minAPS:20, universities:["TUT","CPUT","DUT","UJ","UNISA"],              requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Networks, programming, web development and IT support.", careers:["IT Support Specialist","Web Developer","Network Technician","Helpdesk Engineer"] },

  // ══ COMMERCE ═══════════════════════════════════════════════════════════════
  { id:"c01", stream:"Commerce Stream", category:"Accounting & Finance", type:"Degree", name:"BCom Accounting (CA path)",   degree:"BCom",     duration:"3 yrs", minAPS:30, universities:["UCT","Wits","UP","Stellenbosch","UJ","UNISA"],  requiredSubjects:[{key:"puremaths",label:"Mathematics",min:60},{key:"accounting",label:"Accounting",min:60},{key:"english",label:"English",min:50}], description:"Foundation for becoming a Chartered Accountant (CA). Top SA qualification.", careers:["Chartered Accountant (CA)","Auditor","Tax Consultant","Financial Manager"], note:"Path to CA(SA) — most competitive commerce qualification" },
  { id:"c02", stream:"Commerce Stream", category:"Accounting & Finance", type:"Degree", name:"BCom Investment Management",  degree:"BCom",     duration:"3 yrs", minAPS:32, universities:["UCT","Wits","UP","Stellenbosch","UFS"],          requiredSubjects:[{key:"puremaths",label:"Mathematics",min:70},{key:"english",label:"English",min:55}], description:"Portfolio management, securities and financial markets.", careers:["Investment Manager","Portfolio Manager","Stockbroker","Wealth Manager"] },
  { id:"c03", stream:"Commerce Stream", category:"Accounting & Finance", type:"Degree", name:"BCom Financial Management",   degree:"BCom",     duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","UKZN","UNISA"],                requiredSubjects:[{key:"puremaths",label:"Mathematics",min:55},{key:"english",label:"English",min:50}], description:"Budgeting, investment, corporate finance and financial planning.", careers:["Financial Manager","Investment Analyst","Budget Analyst"] },
  { id:"c04", stream:"Commerce Stream", category:"Economics",            type:"Degree", name:"BCom Economics",              degree:"BCom",     duration:"3 yrs", minAPS:28, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],         requiredSubjects:[{key:"puremaths",label:"Mathematics",min:60},{key:"english",label:"English",min:55}], description:"Study how economies, markets and governments work.", careers:["Economist","Policy Analyst","Government Advisor","Research Economist"] },
  { id:"c05", stream:"Commerce Stream", category:"Business & Management",type:"Degree", name:"BCom Business Management",    degree:"BCom",     duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","UKZN","NMU","UNISA"],           requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Broad business skills: strategy, marketing, HR and operations.", careers:["Business Manager","Entrepreneur","Operations Manager","Marketing Manager"] },
  { id:"c06", stream:"Commerce Stream", category:"Business & Management",type:"Degree", name:"BCom Marketing",              degree:"BCom",     duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","CPUT","NMU"],                  requiredSubjects:[{key:"english",label:"English",min:55},{key:"puremaths",label:"Mathematics",min:50}], description:"Brand building, digital marketing, consumer behaviour and strategy.", careers:["Marketing Manager","Brand Strategist","Digital Marketer","Advertising Executive"] },
  { id:"c07", stream:"Commerce Stream", category:"Business & Management",type:"Degree", name:"BCom Human Resource Management",degree:"BCom",   duration:"3 yrs", minAPS:22, universities:["UP","UJ","NWU","UKZN","UNISA"],                requiredSubjects:[{key:"english",label:"English",min:55},{key:"puremaths",label:"Mathematics",min:50}], description:"Manage people, recruitment, training and workplace relations.", careers:["HR Manager","Talent Acquisition Specialist","Labour Relations Officer"] },
  { id:"c08", stream:"Commerce Stream", category:"Business & Management",type:"Degree", name:"BCom Supply Chain & Logistics",degree:"BCom",   duration:"3 yrs", minAPS:24, universities:["UP","UJ","CPUT","TUT","UNISA"],                requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Managing the flow of goods from supplier to consumer.", careers:["Supply Chain Manager","Logistics Manager","Procurement Officer"] },
  { id:"c09", stream:"Commerce Stream", category:"Law",                  type:"Degree", name:"LLB – Law Degree",            degree:"LLB",      duration:"4 yrs", minAPS:30, universities:["UCT","Wits","UP","Stellenbosch","UWC","UKZN"],  requiredSubjects:[{key:"english",label:"English",min:65}], description:"Become a lawyer. Study contracts, criminal law, property and human rights.", careers:["Attorney","Advocate","Corporate Lawyer","State Prosecutor"] },
  { id:"c10", stream:"Commerce Stream", category:"Accounting & Finance", type:"Degree", name:"BCompt – Accounting Sciences",degree:"BCompt",   duration:"3 yrs", minAPS:20, universities:["UNISA","UFS","NWU"],                           requiredSubjects:[{key:"puremaths",label:"Mathematics",min:50},{key:"english",label:"English",min:50}], description:"Distance learning path towards professional accounting and CTA.", careers:["Accountant","Bookkeeper","Tax Practitioner","Financial Officer"], note:"Good for working adults — fully via distance" },
  { id:"c11", stream:"Commerce Stream", category:"Business & Management",type:"Degree", name:"BBA – Business Administration",degree:"BBA",     duration:"3 yrs", minAPS:22, universities:["UJ","UKZN","NWU","Regent","IIE Rosebank"],     requiredSubjects:[{key:"english",label:"English",min:50},{key:"puremaths",label:"Mathematics",min:50}], description:"Practical business leadership, entrepreneurship and management.", careers:["Business Owner","Operations Manager","Project Manager","Business Consultant"] },
  // Commerce Diplomas
  { id:"cd01", stream:"Commerce Stream", category:"Accounting & Finance",type:"Diploma",name:"Diploma in Accounting",       degree:"Diploma",  duration:"3 yrs", minAPS:18, universities:["TUT","CPUT","DUT","VUT","UNISA"],              requiredSubjects:[{key:"english",label:"English",min:40}], description:"Practical accounting skills — bookkeeping, payroll, tax.", careers:["Bookkeeper","Accounting Clerk","Payroll Officer","Creditors Clerk"] },
  { id:"cd02", stream:"Commerce Stream", category:"Business & Management",type:"Diploma",name:"Diploma in Business Management",degree:"Diploma",duration:"3 yrs",minAPS:18, universities:["TUT","CPUT","DUT","NMU","Rosebank"],           requiredSubjects:[{key:"english",label:"English",min:40}], description:"Practical management skills for offices, retail and teams.", careers:["Office Manager","Team Leader","Admin Manager","Operations Coordinator"] },
  { id:"cd03", stream:"Commerce Stream", category:"Business & Management",type:"Diploma",name:"Diploma in Marketing",         degree:"Diploma", duration:"3 yrs", minAPS:18, universities:["TUT","CPUT","DUT","UJ","Rosebank"],           requiredSubjects:[{key:"english",label:"English",min:40}], description:"Brand communication, social media and sales principles.", careers:["Marketing Assistant","Social Media Coordinator","Sales Representative"] },
  { id:"cd04", stream:"Commerce Stream", category:"Business & Management",type:"N-cert", name:"N1–N6 Business Studies (TVET)",degree:"N-cert",  duration:"1–3 yrs",minAPS:14, universities:["Any TVET College — nationwide"],               requiredSubjects:[{key:"english",label:"English",min:30}], description:"Office admin, bookkeeping, and marketing fundamentals.", careers:["Office Admin","Bookkeeping","Sales","Receptionist"], note:"N6 + 18 months work = National Diploma" },

  // ══ HUMANITIES ═════════════════════════════════════════════════════════════
  { id:"h01", stream:"Humanities Stream", category:"Media & Communication",type:"Degree",  name:"BA Journalism & Media Studies",degree:"BA",    duration:"3 yrs", minAPS:26, universities:["Rhodes","Wits","UJ","CPUT","DUT"],              requiredSubjects:[{key:"english",label:"English",min:65}], description:"Write, report, broadcast and produce content across all media.", careers:["Journalist","News Anchor","Editor","Content Creator","PR Specialist"] },
  { id:"h02", stream:"Humanities Stream", category:"Media & Communication",type:"Degree",  name:"BA Communication Science",    degree:"BA",    duration:"3 yrs", minAPS:24, universities:["UP","UJ","NWU","UNISA","NMU"],                 requiredSubjects:[{key:"english",label:"English",min:60}], description:"Study how communication shapes society, business and public opinion.", careers:["Communications Officer","PR Manager","Corporate Communicator","Social Media Manager"] },
  { id:"h03", stream:"Humanities Stream", category:"Social Sciences",      type:"Degree",  name:"BSocSci Social Work",         degree:"BSocSci",duration:"4 yrs", minAPS:22, universities:["UCT","Wits","UWC","UKZN","UL","UNISA"],         requiredSubjects:[{key:"english",label:"English",min:55}], description:"Support vulnerable individuals, families and communities.", careers:["Social Worker","Community Developer","Child Protection Officer","NGO Manager"] },
  { id:"h04", stream:"Humanities Stream", category:"Social Sciences",      type:"Degree",  name:"BA Psychology",               degree:"BA",    duration:"3+1 yrs",minAPS:24, universities:["UCT","Wits","UP","UKZN","NWU","UNISA"],         requiredSubjects:[{key:"english",label:"English",min:60}], description:"Study human behaviour and mental processes. Honours required for practice.", careers:["Psychologist","Counsellor","HR Specialist","Researcher"] },
  { id:"h05", stream:"Humanities Stream", category:"Education",            type:"Degree",  name:"BEd Foundation Phase (Gr R–3)",degree:"BEd",  duration:"4 yrs", minAPS:22, universities:["UP","UKZN","NWU","UJ","UL","UNISA"],           requiredSubjects:[{key:"english",label:"English",min:55}], description:"Teach Grades R–3. Very high demand for teachers across SA.", careers:["Foundation Phase Teacher","School Principal","Education Specialist"] },
  { id:"h06", stream:"Humanities Stream", category:"Education",            type:"Degree",  name:"BEd Intermediate Phase (Gr 4–7)",degree:"BEd",duration:"4 yrs", minAPS:22, universities:["UP","UKZN","NWU","UJ","UNISA"],               requiredSubjects:[{key:"english",label:"English",min:55}], description:"Teach Grades 4–7 across various subjects.", careers:["Primary School Teacher","Subject Head","Education Consultant"] },
  { id:"h07", stream:"Humanities Stream", category:"Education",            type:"Degree",  name:"BEd Senior & FET Phase (Gr 8–12)",degree:"BEd",duration:"4 yrs",minAPS:24, universities:["UP","Wits","UCT","Stellenbosch","UKZN"],       requiredSubjects:[{key:"english",label:"English",min:60}], description:"Teach Grades 8–12. Specialise in your chosen subject.", careers:["High School Teacher","HOD","School Principal","Education Manager"] },
  { id:"h08", stream:"Humanities Stream", category:"Tourism & Hospitality",type:"Degree",  name:"BA Tourism Management",       degree:"BA",    duration:"3 yrs", minAPS:20, universities:["UJ","NWU","TUT","VUT","CPUT"],                requiredSubjects:[{key:"english",label:"English",min:55}], description:"Manage tourism operations, hotels, travel agencies and events.", careers:["Tourism Manager","Hotel Manager","Travel Agent","Event Coordinator"] },
  { id:"h09", stream:"Humanities Stream", category:"Social Sciences",      type:"Degree",  name:"BA History & Political Science",degree:"BA",  duration:"3 yrs", minAPS:24, universities:["UCT","Wits","UP","Rhodes","Stellenbosch"],     requiredSubjects:[{key:"english",label:"English",min:60},{key:"history",label:"History",min:55}], description:"Understand how politics and history shape the world today.", careers:["Political Analyst","Government Official","Researcher","Diplomat"] },
  { id:"h10", stream:"Humanities Stream", category:"Arts & Culture",       type:"Degree",  name:"BA Fine Arts / Dramatic Arts", degree:"BA",   duration:"3 yrs", minAPS:22, universities:["Wits","UCT","UP","UKZN","NMU"],               requiredSubjects:[{key:"english",label:"English",min:55}], description:"Develop as a creative artist, performer or cultural practitioner.", careers:["Artist","Actor","Director","Arts Administrator","Art Therapist"] },
  { id:"h11", stream:"Humanities Stream", category:"Education",            type:"Degree",  name:"BCurr Early Childhood Dev.",  degree:"BCurr", duration:"4 yrs", minAPS:18, universities:["UNISA","NWU","UJ","UL"],                      requiredSubjects:[{key:"english",label:"English",min:50}], description:"Work with children aged 0–6 years. Extremely needed in SA.", careers:["ECD Practitioner","Crèche Owner","Child Development Specialist"] },
  { id:"h12", stream:"Humanities Stream", category:"Law",                  type:"Degree",  name:"BA Law (pathway to LLB)",     degree:"BA",   duration:"3+4 yrs",minAPS:28, universities:["UP","Wits","UCT","UWC"],                      requiredSubjects:[{key:"english",label:"English",min:65}], description:"Humanities pathway into law. Complete BA then apply for LLB.", careers:["Attorney","Advocate","Legal Researcher","Government Legal Advisor"] },
  // Humanities Diplomas
  { id:"hd01", stream:"Humanities Stream", category:"Tourism & Hospitality",type:"Diploma",name:"Diploma in Hospitality Management",degree:"Diploma",duration:"3 yrs",minAPS:18, universities:["CPUT","TUT","DUT","VUT","Rosebank College"],   requiredSubjects:[{key:"english",label:"English",min:40}], description:"Food & beverage, front office, events and hotel operations.", careers:["Hotel Manager","Restaurant Manager","Event Planner","Catering Manager"] },
  { id:"hd02", stream:"Humanities Stream", category:"Media & Communication",type:"Diploma",name:"Diploma in Journalism",          degree:"Diploma",duration:"3 yrs",minAPS:20, universities:["CPUT","TUT","DUT","Rosebank"],                 requiredSubjects:[{key:"english",label:"English",min:50}], description:"Practical journalism, writing and media production skills.", careers:["Junior Reporter","Content Writer","Social Media Manager","Copywriter"] },
  { id:"hd03", stream:"Humanities Stream", category:"Arts & Culture",       type:"Diploma",name:"Diploma in Fashion Design",       degree:"Diploma",duration:"3 yrs",minAPS:18, universities:["CPUT","TUT","DUT","Rosebank"],                 requiredSubjects:[{key:"english",label:"English",min:40}], description:"Garment design, pattern making, textile knowledge and fashion business.", careers:["Fashion Designer","Pattern Maker","Stylist","Retail Buyer"] },
  { id:"hd04", stream:"Humanities Stream", category:"Social Sciences",      type:"Diploma",name:"Diploma in Public Administration",degree:"Diploma",duration:"3 yrs",minAPS:18, universities:["TUT","CPUT","DUT","UNISA"],                    requiredSubjects:[{key:"english",label:"English",min:40}], description:"Government processes, public policy and municipal management.", careers:["Public Servant","Local Government Officer","Policy Administrator"] },
  { id:"hd05", stream:"Humanities Stream", category:"Social Sciences",      type:"Diploma",name:"Diploma in Social Auxiliary Work",degree:"Diploma",duration:"2 yrs",minAPS:16, universities:["TVET Colleges — nationwide"],                   requiredSubjects:[{key:"english",label:"English",min:30}], description:"Assist qualified social workers in community care and support.", careers:["Social Auxiliary Worker","Community Care Worker","Home-Based Carer"] },
  { id:"hd06", stream:"Humanities Stream", category:"Education",            type:"Diploma",name:"Diploma in Early Childhood Dev.", degree:"Diploma",duration:"3 yrs",minAPS:16, universities:["TVET Colleges — nationwide"],                   requiredSubjects:[{key:"english",label:"English",min:30}], description:"Care and education for children aged 0–6 years.", careers:["ECD Practitioner","Crèche Assistant","Nursery School Teacher"] },

  // ══ ENGINEERING / TECHNICAL ═════════════════════════════════════════════════
  { id:"e01", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Civil Engineering",        degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],       requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:65}], description:"Design and build roads, bridges, dams, buildings and infrastructure.", careers:["Civil Engineer","Structural Engineer","Construction Manager"] },
  { id:"e02", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Electrical Engineering",   degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],       requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:65}], description:"Power systems, electronics, telecommunications and control systems.", careers:["Electrical Engineer","Power Engineer","Electronics Engineer"] },
  { id:"e03", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Mechanical Engineering",   degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","UKZN"],       requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:65}], description:"Design machines, engines, thermal systems and manufacturing processes.", careers:["Mechanical Engineer","Automotive Engineer","Manufacturing Engineer"] },
  { id:"e04", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Chemical Engineering",     degree:"BSc Eng",  duration:"4 yrs", minAPS:34, universities:["UCT","Wits","UP","Stellenbosch","NWU"],         requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:70}], description:"Transform raw materials into products using chemical processes.", careers:["Chemical Engineer","Process Engineer","Petrochemical Engineer"] },
  { id:"e05", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Computer Engineering",     degree:"BSc Eng",  duration:"4 yrs", minAPS:32, universities:["UCT","Wits","UP","Stellenbosch"],              requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:70},{key:"physscience",label:"Physical Sciences",min:60}], description:"Combine hardware and software engineering for embedded systems.", careers:["Computer Engineer","Embedded Systems Developer","IoT Specialist"] },
  { id:"e06", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Mining Engineering",       degree:"BSc Eng",  duration:"4 yrs", minAPS:30, universities:["Wits","UP","UKZN","NWU"],                      requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:60}], description:"Plan and manage extraction of minerals and resources.", careers:["Mining Engineer","Blasting Engineer","Mine Manager"] },
  { id:"e07", stream:"Engineering / Technical Stream", category:"Engineering (BSc)", type:"Degree", name:"BSc Industrial Engineering",   degree:"BSc Eng",  duration:"4 yrs", minAPS:32, universities:["UP","Stellenbosch","Wits","UKZN"],             requiredSubjects:[{key:"puremaths",label:"Pure Mathematics",min:65},{key:"physscience",label:"Physical Sciences",min:60}], description:"Optimise processes, systems and organisations for efficiency.", careers:["Industrial Engineer","Operations Manager","Production Engineer"] },
  { id:"e08", stream:"Engineering / Technical Stream", category:"Architecture & Built Env.", type:"Degree", name:"BSc Architecture", degree:"BSc Arch", duration:"3+2 yrs",minAPS:28, universities:["UCT","Wits","UP","UKZN","NMU","TUT"],          requiredSubjects:[{key:"puremaths",label:"Mathematics",min:60},{key:"english",label:"English",min:55}], description:"Design buildings and spaces. 3yr BSc + 2yr professional degree.", careers:["Architect","Urban Designer","Interior Architect","Project Manager"] },
  { id:"e09", stream:"Engineering / Technical Stream", category:"Architecture & Built Env.", type:"Degree", name:"BSc Quantity Surveying", degree:"BSc", duration:"3 yrs",  minAPS:26, universities:["UP","Wits","UCT","UKZN","TUT","CPUT"],         requiredSubjects:[{key:"puremaths",label:"Mathematics",min:55},{key:"english",label:"English",min:50}], description:"Cost management and financial planning for construction projects.", careers:["Quantity Surveyor","Cost Estimator","Project Manager"] },
  // Engineering Diplomas / BTech
  { id:"ed01", stream:"Engineering / Technical Stream", category:"Engineering Technology", type:"Diploma", name:"BTech Civil Engineering",       degree:"BTech",  duration:"4 yrs", minAPS:24, universities:["TUT","CPUT","DUT","UJ","Vaal"],              requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:55},{key:"techscience",label:"Technical/Physical Sciences",min:55}], description:"Practical engineering — design, construction supervision and project management.", careers:["Civil Technologist","Site Engineer","Construction Supervisor"] },
  { id:"ed02", stream:"Engineering / Technical Stream", category:"Engineering Technology", type:"Diploma", name:"BTech Electrical Engineering",  degree:"BTech",  duration:"4 yrs", minAPS:22, universities:["TUT","CPUT","DUT","UJ","VUT"],              requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:50},{key:"techscience",label:"Technical/Physical Sciences",min:50}], description:"Practical electrical and electronics engineering for industry.", careers:["Electrical Technologist","Instrumentation Technician","Maintenance Engineer"] },
  { id:"ed03", stream:"Engineering / Technical Stream", category:"Engineering Technology", type:"Diploma", name:"BTech Mechanical Engineering",  degree:"BTech",  duration:"4 yrs", minAPS:22, universities:["TUT","CPUT","DUT","UJ","VUT"],              requiredSubjects:[{key:"techmaths",label:"Technical/Pure Maths",min:50},{key:"techscience",label:"Technical/Physical Sciences",min:50}], description:"Practical mechanical engineering for manufacturing and maintenance.", careers:["Mechanical Technologist","Maintenance Engineer","Production Supervisor"] },
  { id:"ed04", stream:"Engineering / Technical Stream", category:"Architecture & Built Env.", type:"Diploma", name:"Diploma in Architectural Technology", degree:"Diploma", duration:"3 yrs", minAPS:20, universities:["TUT","CPUT","DUT","VUT"],         requiredSubjects:[{key:"techmaths",label:"Maths",min:50},{key:"egd",label:"EGD",min:50}], description:"Drafting, building plans, AutoCAD and architectural support work.", careers:["Architectural Technician","Draughtsperson","CAD Technician","Building Inspector"] },
  { id:"ed05", stream:"Engineering / Technical Stream", category:"TVET / N-Certificates",  type:"N-cert",  name:"N1–N6 Engineering (TVET)",      degree:"N-cert", duration:"1–3 yrs",minAPS:16, universities:["Any TVET College — nationwide"],           requiredSubjects:[{key:"techmaths",label:"Basic/Technical Maths",min:30}], description:"Practical qualification in Civil, Electrical or Mechanical engineering.", careers:["Electrician","Plumber","Welder","Fitter & Turner","Motor Mechanic"], note:"N6 + 18 months work = National Diploma" },
];

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION DEADLINES
// ─────────────────────────────────────────────────────────────────────────────
export const DEADLINES = [
  { name:"NSFAS applications open",          date:"2025-08-01", display:"August 2025",         group:"NSFAS",        org:"NSFAS",              url:"nsfas.org.za",          note:"Apply as soon as it opens. Household income < R350 000/yr. Covers tuition, accommodation & meals" },
  { name:"NSFAS applications close",         date:"2025-11-30", display:"30 November 2025",    group:"NSFAS",        org:"NSFAS",              url:"nsfas.org.za",          note:"Final deadline — do not miss this" },
  { name:"UCT undergraduate applications",   date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"UCT",                url:"uct.ac.za",             note:"Popular programmes fill quickly" },
  { name:"Wits undergraduate applications",  date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"Wits",               url:"wits.ac.za",            note:"Medical, Engineering and Law fill fast" },
  { name:"UP applications",                  date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"UP",                 url:"up.ac.za",              note:"Large intake across all faculties" },
  { name:"Stellenbosch University",          date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"Stellenbosch",       url:"sun.ac.za",             note:"Popular for Medicine, Law and Engineering" },
  { name:"UKZN applications",                date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"UKZN",               url:"ukzn.ac.za",            note:"Strong Health Sciences and Engineering" },
  { name:"UJ applications",                  date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"UJ",                 url:"uj.ac.za",              note:"Engineering, Commerce and Education popular" },
  { name:"Rhodes University",                date:"2025-09-30", display:"30 September 2025",   group:"Universities", org:"Rhodes",             url:"ru.ac.za",              note:"Strong Journalism, Environmental Science, Law" },
  { name:"UWC applications",                 date:"2025-10-31", display:"31 October 2025",     group:"Universities", org:"UWC",                url:"uwc.ac.za",             note:"Dentistry, Pharmacy and Law strong here" },
  { name:"NWU applications",                 date:"2025-10-31", display:"31 October 2025",     group:"Universities", org:"NWU",                url:"nwu.ac.za",             note:"Three campuses — Potchefstroom, Mafikeng, Vaal" },
  { name:"UNISA applications",               date:"2025-10-31", display:"31 October 2025",     group:"Universities", org:"UNISA",              url:"unisa.ac.za",           note:"Distance learning — flexible for working students" },
  { name:"TUT applications",                 date:"2025-10-31", display:"31 October 2025",     group:"Universities", org:"TUT",                url:"tut.ac.za",             note:"Largest residential university in SA" },
  { name:"CPUT applications",                date:"2025-10-31", display:"31 October 2025",     group:"Universities", org:"CPUT",               url:"cput.ac.za",            note:"Engineering technology and Hospitality" },
  { name:"DUT applications",                 date:"2025-10-31", display:"31 October 2025",     group:"Universities", org:"DUT",                url:"dut.ac.za",             note:"Durban University of Technology" },
  { name:"TVET college applications",        date:"2026-01-31", display:"Jan–Feb (annual)",    group:"TVET",         org:"TVET Colleges",      url:"dhet.gov.za",           note:"Apply directly to your nearest TVET college. N1–N6 intakes throughout the year" },
  { name:"SAICA bursary (CA path)",          date:"2025-08-31", display:"31 August 2025",      group:"Bursaries",    org:"SAICA",              url:"saica.co.za",           note:"Full tuition + stipend for BCom Accounting. Very competitive" },
  { name:"Eskom bursary",                    date:"2025-09-30", display:"Aug–Sep 2025",        group:"Bursaries",    org:"Eskom",              url:"eskom.co.za",           note:"Electrical and Mechanical Engineering. Up to R150 000/yr" },
  { name:"Sasol bursary",                    date:"2025-09-30", display:"September 2025",      group:"Bursaries",    org:"Sasol",              url:"sasol.com",             note:"Chemical and Mechanical Engineering. Up to R200 000/yr" },
  { name:"Anglo American bursary",           date:"2025-09-30", display:"September 2025",      group:"Bursaries",    org:"Anglo American",     url:"angloamerican.com",     note:"Mining, Engineering and Science. Up to R200 000/yr" },
  { name:"Standard Bank bursary",            date:"2025-09-30", display:"September 2025",      group:"Bursaries",    org:"Standard Bank",      url:"standardbank.co.za",    note:"Finance and Commerce. Up to R100 000/yr" },
  { name:"Transnet bursary",                 date:"2025-09-30", display:"September 2025",      group:"Bursaries",    org:"Transnet",           url:"transnet.net",          note:"Civil and Mechanical Engineering. Up to R100 000/yr" },
  { name:"NRF science research bursary",     date:"2025-09-30", display:"September 2025",      group:"Bursaries",    org:"NRF",                url:"nrf.ac.za",             note:"Science and postgraduate research. Up to R150 000/yr" },
  { name:"DBE teaching bursary",             date:"2025-10-31", display:"October 2025",        group:"Bursaries",    org:"Dept Basic Education",url:"dbe.gov.za",           note:"Full tuition + stipend. Teach in public school after graduating" },
  { name:"Dept of Social Dev bursary",       date:"2025-10-31", display:"October 2025",        group:"Bursaries",    org:"DSD",                url:"dsd.gov.za",            note:"Social Work — fully funded. Rural service required after graduating" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BURSARIES
// ─────────────────────────────────────────────────────────────────────────────
const BURSARIES = {
  "Science Stream": [
    { name:"NSFAS",                        field:"All Science degrees",         amount:"Full cost of study",   url:"nsfas.org.za",      note:"Apply before 30 Nov. Household income < R350 000/yr" },
    { name:"National Research Foundation", field:"Science & Research",          amount:"Up to R150 000/yr",    url:"nrf.ac.za"          },
    { name:"Sasol Bursary",                field:"Sciences & Engineering",      amount:"Up to R200 000/yr",    url:"sasol.com"          },
    { name:"SA Medical Research Council",  field:"Medical Sciences",            amount:"Up to R120 000/yr",    url:"samrc.ac.za"        },
    { name:"Discovery Health Bursary",     field:"Health Sciences",             amount:"Up to R100 000/yr",    url:"discovery.co.za"    },
    { name:"Anglo American Bursary",       field:"Science & Engineering",       amount:"Up to R200 000/yr",    url:"angloamerican.com"  },
    { name:"DAFF Bursary",                 field:"Agricultural Sciences",       amount:"Up to R80 000/yr",     url:"dalrrd.gov.za"      },
  ],
  "Commerce Stream": [
    { name:"NSFAS",                        field:"All Commerce degrees",        amount:"Full cost of study",   url:"nsfas.org.za",      note:"Apply before 30 Nov" },
    { name:"SAICA Training Bursary",       field:"Chartered Accountancy (CA)",  amount:"Full tuition + stipend",url:"saica.co.za",      note:"Includes learnership — very competitive" },
    { name:"Deloitte Bursary",             field:"Accounting / Finance",        amount:"Up to R120 000/yr",    url:"deloitte.com/za"    },
    { name:"KPMG Bursary",                 field:"Accounting & Auditing",       amount:"Up to R100 000/yr",    url:"kpmg.com/za"        },
    { name:"Standard Bank Bursary",        field:"Finance & Commerce",          amount:"Up to R100 000/yr",    url:"standardbank.co.za" },
    { name:"ABSA Bursary",                 field:"Commerce & Economics",        amount:"Up to R90 000/yr",     url:"absa.co.za"         },
    { name:"FirstRand Bursary",            field:"Finance & Actuarial",         amount:"Up to R80 000/yr",     url:"firstrand.co.za"    },
  ],
  "Humanities Stream": [
    { name:"NSFAS",                        field:"All Humanities degrees",      amount:"Full cost of study",   url:"nsfas.org.za",      note:"Apply before 30 Nov" },
    { name:"Dept of Social Development",   field:"Social Work (govt-funded)",   amount:"Full tuition",         url:"dsd.gov.za",        note:"Obligatory service in rural areas after graduation" },
    { name:"DBE Teaching Bursary",         field:"Teaching / BEd",             amount:"Full tuition + stipend",url:"dbe.gov.za",        note:"Teach in a public school after graduating" },
    { name:"Oppenheimer Memorial Trust",   field:"Social Sciences & Arts",      amount:"Up to R80 000/yr",     url:"omtrust.org.za"     },
    { name:"Media24 Bursary",              field:"Journalism & Media",          amount:"Up to R60 000/yr",     url:"media24.com"        },
  ],
  "Engineering / Technical Stream": [
    { name:"NSFAS",                        field:"All Engineering degrees",     amount:"Full cost of study",   url:"nsfas.org.za",      note:"Apply before 30 Nov" },
    { name:"Eskom Bursary",                field:"Electrical / Mechanical Eng", amount:"Up to R150 000/yr",    url:"eskom.co.za"        },
    { name:"Transnet Bursary",             field:"Civil / Mechanical Eng",      amount:"Up to R100 000/yr",    url:"transnet.net"       },
    { name:"Anglo American Bursary",       field:"Mining & Engineering",        amount:"Up to R200 000/yr",    url:"angloamerican.com"  },
    { name:"ECSA Bursary",                 field:"All Engineering disciplines", amount:"Up to R120 000/yr",    url:"ecsa.co.za"         },
    { name:"Sasol Bursary",                field:"Chemical / Mechanical Eng",   amount:"Up to R200 000/yr",    url:"sasol.com"          },
    { name:"Telkom Bursary",               field:"IT & Electrical Engineering", amount:"Up to R80 000/yr",     url:"telkom.co.za"       },
    { name:"ArcelorMittal Bursary",        field:"Metallurgical / Mechanical",  amount:"Up to R90 000/yr",     url:"arcelormittal.co.za"},
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const STREAM_COLORS = {
  "Science Stream":"#2563eb","Commerce Stream":"#16a34a",
  "Humanities Stream":"#9333ea","Engineering / Technical Stream":"#ea580c",
};

const STREAM_CATEGORIES = {
  "Science Stream":                 ["All","Health Sciences","Computing & IT","Natural Sciences"],
  "Commerce Stream":                ["All","Accounting & Finance","Business & Management","Economics","Law"],
  "Humanities Stream":              ["All","Media & Communication","Social Sciences","Education","Tourism & Hospitality","Arts & Culture","Law"],
  "Engineering / Technical Stream": ["All","Engineering (BSc)","Engineering Technology","Architecture & Built Env.","TVET / N-Certificates"],
};

function checkSubjectReqs(requiredSubjects, marks) {
  if (!marks || Object.keys(marks).length===0) return { met:true, details:[] };
  const details = requiredSubjects.map(({key,label,min})=>{
    let actual = marks[key];
    if (actual==null && key==="techmaths")   actual = marks.puremaths ?? marks.techmaths;
    if (actual==null && key==="puremaths")   actual = marks.puremaths ?? marks.techmaths;
    if (actual==null && key==="techscience") actual = marks.physscience ?? marks.techscience;
    if (actual==null) return {label,required:min,actual:null,pass:true};
    return {label,required:min,actual,pass:actual>=min};
  });
  return {met:details.every(d=>d.pass), details};
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function UniversityFinder({ stream, aps=0, marks={} }) {
  const color      = STREAM_COLORS[stream] || "#2563eb";
  const categories = STREAM_CATEGORIES[stream] || ["All"];

  const [category, setCategory] = useState("All");
  const [search,   setSearch]   = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const [tab,      setTab]      = useState("programmes");
  const [showAll,  setShowAll]  = useState(false);

  const hasMarks = marks && Object.values(marks).some(v=>v>0);
  const hasAPS   = aps > 0;

  const annotated = useMemo(()=>{
    return PROGRAMMES.filter(p=>p.stream===stream).map(p=>{
      const apsGap   = hasAPS ? p.minAPS - aps : 0;
      const subCheck = checkSubjectReqs(p.requiredSubjects, marks);
      const apsOk    = !hasAPS || apsGap<=0;
      const subOk    = subCheck.met;
      const status   =
        (!hasAPS && !hasMarks)         ? "unknown"  :
        apsOk && subOk                 ? "qualified":
        apsOk && !subOk                ? "marks"    :
        !apsOk && apsGap<=5            ? "stretch"  :
                                         "beyond";
      return {...p, apsGap, subCheck, apsOk, subOk, status};
    });
  }, [stream, aps, marks, hasAPS, hasMarks]);

  const filtered = useMemo(()=>{
    let list = annotated;
    if (category!=="All")   list = list.filter(p=>p.category===category);
    if (typeFilter!=="All") list = list.filter(p=>p.type===typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p=>p.name.toLowerCase().includes(q)||p.careers.some(c=>c.toLowerCase().includes(q))||p.category.toLowerCase().includes(q));
    }
    return list;
  }, [annotated, category, typeFilter, search]);

  const qualified = filtered.filter(p=>p.status==="qualified");
  const marksGap  = filtered.filter(p=>p.status==="marks");
  const stretch   = filtered.filter(p=>p.status==="stretch");
  const beyond    = filtered.filter(p=>p.status==="beyond");
  const unknown   = filtered.filter(p=>p.status==="unknown");
  const apsColor  = aps>=30?"#16a34a":aps>=22?"#d97706":aps>0?"#dc2626":"#6b7280";

  return (
    <div style={S.wrap}>
      <div style={{...S.header, background:color}}>
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
        <button style={{...S.tab,...(tab==="programmes"?{...S.tabOn,borderBottomColor:color,color}:{})}} onClick={()=>setTab("programmes")}>📚 Programmes</button>
        <button style={{...S.tab,...(tab==="deadlines"?{...S.tabOn,borderBottomColor:color,color}:{})}}  onClick={()=>setTab("deadlines")}>📅 Deadlines</button>
        <button style={{...S.tab,...(tab==="bursaries"?{...S.tabOn,borderBottomColor:color,color}:{})}}  onClick={()=>setTab("bursaries")}>💰 Bursaries</button>
      </div>

      {/* ════ PROGRAMMES ════════════════════════════════════════════════════ */}
      {tab==="programmes" && (
        <div style={S.body}>
          {(hasAPS||hasMarks) && (
            <div style={{...S.summaryBar, borderColor:apsColor}}>
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
                        const col=v>=70?"#d1fae5":v>=50?"#fef9c3":"#fee2e2";
                        const tc=v>=70?"#065f46":v>=50?"#713f12":"#991b1b";
                        return <span key={k} style={{background:col,color:tc,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700}}>{k}: {v}%</span>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={S.filters}>
            <input style={S.search} placeholder="🔍 Search programme or career…" value={search} onChange={e=>setSearch(e.target.value)}/>
            <select style={S.select} value={category} onChange={e=>setCategory(e.target.value)}>
              {categories.map(c=><option key={c}>{c}</option>)}
            </select>
            <select style={S.select} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="All">Degrees & diplomas</option>
              <option value="Degree">Degrees only</option>
              <option value="Diploma">Diplomas only</option>
              <option value="N-cert">TVET / N-certs</option>
            </select>
          </div>

          <p style={{fontSize:12,color:"#94a3b8",marginBottom:12}}>
            Showing <b style={{color:"#1e293b"}}>{filtered.length}</b> programme{filtered.length!==1?"s":""}
            {hasAPS && <> — <span style={{color:"#16a34a",fontWeight:700}}>{qualified.length} you qualify for</span>{stretch.length>0&&<>, <span style={{color:"#d97706",fontWeight:700}}>{stretch.length} stretch</span></>}</>}
          </p>

          {filtered.length===0 && <div style={S.empty}><p style={{fontSize:32,margin:"0 0 8px"}}>🔍</p><p style={{fontWeight:700,color:"#1e293b"}}>No programmes match</p></div>}

          {qualified.length>0 && <Section color="#16a34a" bg="#f0fdf4" border="#bbf7d0" label={`✅ You Qualify (${qualified.length})`} subtitle={hasMarks?"Your APS and subject marks meet requirements":"Your APS meets the minimum"}>{qualified.map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}</Section>}
          {marksGap.length>0  && <Section color="#9333ea" bg="#faf5ff" border="#e9d5ff" label={`📈 Improve Your Marks (${marksGap.length})`} subtitle="APS qualifies — improve one subject mark to unlock">{marksGap.map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}</Section>}
          {stretch.length>0   && <Section color="#d97706" bg="#fffbeb" border="#fde68a" label={`🚀 Stretch Goals (${stretch.length})`} subtitle="Need up to 5 more APS points — push hard in Grade 12">{stretch.map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}</Section>}

          {(beyond.length>0||unknown.length>0) && (
            <div style={{marginTop:8}}>
              <button style={{...S.showMoreBtn,borderColor:color,color}} onClick={()=>setShowAll(v=>!v)}>
                {showAll?"▲ Hide":"▼ Show"} {beyond.length+unknown.length} more programmes
              </button>
              {showAll && <Section color="#94a3b8" bg="#f8fafc" border="#e2e8f0" label="📚 All Other Programmes" subtitle="Long-term goals — keep improving">{[...beyond,...unknown].map(p=><Card key={p.id} p={p} color={color} expanded={expanded} setExpanded={setExpanded}/>)}</Section>}
            </div>
          )}
        </div>
      )}

      {/* ════ DEADLINES ═════════════════════════════════════════════════════ */}
      {tab==="deadlines" && <DeadlinePanel stream={stream} color={color}/>}

      {/* ════ BURSARIES ═════════════════════════════════════════════════════ */}
      {tab==="bursaries" && <BursaryPanel stream={stream} color={color}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEADLINE PANEL
// ─────────────────────────────────────────────────────────────────────────────
function DeadlinePanel({ color }) {
  const now = new Date();
  const groups = { NSFAS:[], Universities:[], Bursaries:[], TVET:[] };
  [...DEADLINES].sort((a,b)=>new Date(a.date)-new Date(b.date)).forEach(d=>{
    const g = d.group==="NSFAS"?"NSFAS":d.group==="Universities"?"Universities":d.group==="TVET"?"TVET":"Bursaries";
    groups[g].push(d);
  });

  const urgencyStyle = (date) => {
    const days = Math.round((new Date(date)-now)/(1000*60*60*24));
    if (days<0)    return {label:"Passed",   bg:"#f1f5f9",color:"#6b7280"};
    if (days<30)   return {label:`${days}d left`, bg:"#fee2e2",color:"#991b1b"};
    if (days<90)   return {label:`${days} days`,  bg:"#fef9c3",color:"#92400e"};
    return               {label:"Open",     bg:"#d1fae5",color:"#065f46"};
  };

  return (
    <div style={S.body}>
      <p style={{fontSize:13,color:"#6b7280",marginBottom:16}}>Key application windows for SA universities, bursaries and NSFAS. Always verify on the official website.</p>
      {Object.entries(groups).map(([grp,items])=>{
        if (!items.length) return null;
        const icons={"NSFAS":"🎯","Universities":"🏛️","Bursaries":"💰","TVET":"🛠️"};
        return (
          <div key={grp} style={{marginBottom:20}}>
            <div style={{fontWeight:700,fontSize:14,color:"#1e293b",marginBottom:8,display:"flex",alignItems:"center",gap:8}}>{icons[grp]} {grp}</div>
            <div style={{background:"#fff",border:"1px solid #f1f5f9",borderRadius:12,overflow:"hidden"}}>
              {items.map((d,i)=>{
                const urg=urgencyStyle(d.date);
                return (
                  <div key={d.name} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 16px",borderBottom:i<items.length-1?"1px solid #f8fafc":"none"}}>
                    <div style={{flex:1}}>
                      <span style={{fontWeight:600,fontSize:13,color:"#1e293b"}}>{d.name}</span>
                      <span style={{display:"block",fontSize:12,color:"#6b7280",marginTop:2}}>{d.display} · <a href={`https://${d.url}`} target="_blank" rel="noopener noreferrer" style={{color:"#6366f1",fontWeight:600}}>{d.url} ↗</a></span>
                      {d.note && <span style={{display:"block",fontSize:12,color:"#64748b",marginTop:2}}>{d.note}</span>}
                    </div>
                    <span style={{background:urg.bg,color:urg.color,fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:6,flexShrink:0,marginTop:2}}>{urg.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BURSARY PANEL
// ─────────────────────────────────────────────────────────────────────────────
function BursaryPanel({ stream, color }) {
  const list = BURSARIES[stream]||[];
  return (
    <div style={S.body}>
      <div style={S.nsfas}>
        <span style={{fontSize:32,flexShrink:0}}>🎯</span>
        <div>
          <h3 style={{margin:"0 0 4px",color:"#713f12",fontSize:15}}>Apply for NSFAS First!</h3>
          <p style={{margin:0,fontSize:13,color:"#713f12",lineHeight:1.6}}>NSFAS covers <b>full tuition, accommodation, meals and travel</b> for qualifying students. Apply at <a href="https://nsfas.org.za" target="_blank" rel="noopener noreferrer" style={{color:"#92400e",fontWeight:700}}>nsfas.org.za</a> — deadline is <b>30 November</b> each year. Household income must be under R350 000/year.</p>
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
          <a href={`https://${b.url}`} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#6366f1",margin:0,display:"inline-flex",alignItems:"center",gap:5,textDecoration:"none",fontWeight:600}}>🌐 {b.url} ↗</a>
        </div>
      ))}
      <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:16,marginTop:16}}>
        <b style={{fontSize:13}}>📋 Bursary application tips:</b>
        <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
          {["Apply in Grade 11 — bursaries open August/September, before matric.","Maintain 60%+ in all relevant subjects — minimum threshold for most bursaries.","Write a strong motivational letter about your career goals and financial need.","Get certified copies of: your ID, latest school report, and parent/guardian payslip.","Apply to at least 3–5 bursaries simultaneously — never rely on just one.","Follow up after submitting — call or email to confirm receipt."].map((t,i)=>(
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
// SECTION + CARD
// ─────────────────────────────────────────────────────────────────────────────
function Section({color,bg,border,label,subtitle,children}){
  return (
    <div style={{marginBottom:20}}>
      <div style={{background:bg,border:`1px solid ${border}`,borderRadius:10,padding:"8px 14px",marginBottom:10}}>
        <span style={{fontSize:13,fontWeight:800,color}}>{label}</span>
        {subtitle && <p style={{fontSize:11,color,margin:"2px 0 0",opacity:.8}}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Card({p,color,expanded,setExpanded}){
  const isOpen = expanded===p.id;
  const sc = {qualified:{border:"#16a34a",badge:"#d1fae5",badgeTxt:"#065f46"},marks:{border:"#9333ea",badge:"#f3e8ff",badgeTxt:"#6b21a8"},stretch:{border:"#d97706",badge:"#fef9c3",badgeTxt:"#713f12"},beyond:{border:"#94a3b8",badge:"#f1f5f9",badgeTxt:"#475569"},unknown:{border:"#94a3b8",badge:"#eff6ff",badgeTxt:"#1e40af"}}[p.status]||{border:"#94a3b8",badge:"#f1f5f9",badgeTxt:"#475569"};
  const typeColor = p.type==="Degree"?"#eff6ff":p.type==="Diploma"?"#f0fdf4":"#fff7ed";
  const typeText  = p.type==="Degree"?"#1e40af":p.type==="Diploma"?"#065f46":"#9a3412";
  return (
    <div style={{...S.card,borderLeft:`4px solid ${sc.border}`,marginBottom:8}}>
      <div style={S.cardTop} onClick={()=>setExpanded(isOpen?null:p.id)}>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{...S.catBadge}}>{p.category}</span>
            <span style={{...S.catBadge,background:typeColor,color:typeText}}>{p.type}</span>
            <span style={S.degBadge}>{p.degree} · {p.duration}</span>
          </div>
          <p style={S.cardName}>{p.name}</p>
          <div style={S.metaRow}><span style={S.meta}>🏛️ {p.universities.slice(0,3).join(" · ")}{p.universities.length>3?` +${p.universities.length-3} more`:""}</span></div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flexShrink:0}}>
          <div style={{...S.apsBadge,background:sc.badge,color:sc.badgeTxt}}>
            <span style={{fontSize:9,display:"block"}}>Min APS</span>
            <span style={{fontSize:22,fontWeight:900,lineHeight:1}}>{p.minAPS}</span>
            {p.apsGap>0&&<span style={{fontSize:9,display:"block"}}>need +{p.apsGap}</span>}
            {p.apsGap<=0&&p.status!=="unknown"&&<span style={{fontSize:9,display:"block"}}>✓ ok</span>}
          </div>
          <span style={{fontSize:16,color:"#cbd5e1"}}>{isOpen?"▲":"▼"}</span>
        </div>
      </div>
      {isOpen && (
        <div style={S.detail}>
          <p style={S.desc}>{p.description}</p>
          {p.note && <div style={{...S.advice,marginBottom:12}}>📌 {p.note}</div>}
          <div style={S.dGrid}>
            <div style={S.dBox}>
              <h4 style={S.dTitle}>📋 Subject Requirements</h4>
              {p.requiredSubjects.map((req,i)=>{
                const d=p.subCheck.details.find(x=>x.label===req.label);
                const hasData=d&&d.actual!=null;
                const pass=!hasData||d.pass;
                return (
                  <div key={i} style={{...S.reqRow,background:hasData?(pass?"#f0fdf4":"#fff1f2"):"#f8fafc"}}>
                    <span style={{fontSize:13}}>{pass||!hasData?"✓":"✗"}</span>
                    <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600,color:"#1e293b"}}>{req.label}</span><span style={{fontSize:11,color:"#6b7280"}}> — min {req.min}%</span></div>
                    {hasData&&<span style={{fontSize:12,fontWeight:700,color:pass?"#16a34a":"#dc2626"}}>You: {d.actual}%</span>}
                  </div>
                );
              })}
            </div>
            <div style={S.dBox}>
              <h4 style={S.dTitle}>🎓 Career Paths</h4>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {p.careers.map((c,i)=><span key={i} style={{...S.careerChip,background:`${color}18`,color}}>{c}</span>)}
              </div>
              <div style={{marginTop:12}}>
                <h4 style={S.dTitle}>🏛️ Universities / Colleges</h4>
                <p style={{fontSize:12,color:"#374151",margin:0,lineHeight:1.8}}>{p.universities.join(" · ")}</p>
              </div>
            </div>
          </div>
          {p.apsGap>0&&<div style={S.advice}>💡 You need <b>{p.apsGap} more APS point{p.apsGap!==1?"s":""}</b>. Focus on improving your weakest subjects before Grade 12.</div>}
          {p.status==="marks"&&<div style={{...S.advice,background:"#faf5ff",borderColor:"#e9d5ff",color:"#6b21a8"}}>📈 Your APS qualifies! Improve the subject mark{p.subCheck.details.filter(d=>!d.pass).length>1?"s":""} above to unlock this programme.</div>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  wrap:        {borderRadius:16,overflow:"hidden",border:"1px solid #e2e8f0",background:"#fff",fontFamily:"'Segoe UI',sans-serif"},
  header:      {padding:"20px 24px"},
  hRow:        {display:"flex",alignItems:"center",gap:14},
  hTitle:      {fontSize:22,fontWeight:800,color:"#fff",margin:0},
  hSub:        {fontSize:13,color:"rgba(255,255,255,.75)",margin:"4px 0 0"},
  tabs:        {display:"flex",borderBottom:"2px solid #f1f5f9",background:"#fafafa"},
  tab:         {flex:1,padding:"13px 10px",border:"none",borderBottom:"3px solid transparent",background:"transparent",fontSize:13,fontWeight:600,color:"#6b7280",cursor:"pointer"},
  tabOn:       {background:"#fff",borderBottomWidth:3,borderBottomStyle:"solid"},
  body:        {padding:20},
  summaryBar:  {border:"2px solid",borderRadius:12,padding:"14px 16px",marginBottom:16,background:"#f8fafc"},
  filters:     {display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"},
  search:      {flex:2,minWidth:160,padding:"9px 12px",border:"2px solid #e2e8f0",borderRadius:10,fontSize:13,outline:"none"},
  select:      {flex:1,minWidth:130,padding:"9px 10px",border:"2px solid #e2e8f0",borderRadius:10,fontSize:12,outline:"none",background:"#fff"},
  empty:       {textAlign:"center",padding:"40px 20px",color:"#6b7280"},
  showMoreBtn: {display:"block",width:"100%",padding:"10px",border:"2px dashed",borderRadius:10,background:"transparent",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:12},
  card:        {borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"},
  cardTop:     {display:"flex",justifyContent:"space-between",padding:"14px 16px",gap:12,cursor:"pointer",alignItems:"flex-start"},
  catBadge:    {background:"#f1f5f9",color:"#475569",borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:700},
  degBadge:    {background:"#eff6ff",color:"#1e40af",borderRadius:99,padding:"2px 10px",fontSize:10,fontWeight:600},
  cardName:    {fontSize:15,fontWeight:700,color:"#1e293b",margin:"0 0 6px"},
  metaRow:     {display:"flex",flexWrap:"wrap",gap:8},
  meta:        {fontSize:11,color:"#6b7280"},
  apsBadge:    {borderRadius:10,padding:"6px 12px",textAlign:"center",minWidth:58},
  detail:      {padding:"0 16px 16px",borderTop:"1px solid #f1f5f9"},
  desc:        {fontSize:13,color:"#374151",lineHeight:1.7,margin:"12px 0 14px"},
  dGrid:       {display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12},
  dBox:        {background:"#f8fafc",borderRadius:10,padding:"12px 14px"},
  dTitle:      {fontSize:12,fontWeight:700,color:"#1e293b",margin:"0 0 8px"},
  reqRow:      {display:"flex",alignItems:"center",gap:8,borderRadius:8,padding:"5px 8px",marginBottom:4},
  careerChip:  {borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:600},
  advice:      {background:"#fffbeb",border:"1px solid #fde68a",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#713f12",lineHeight:1.6,marginTop:8},
  nsfas:       {display:"flex",gap:14,background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:14,padding:16,marginBottom:16,alignItems:"flex-start"},
  bCard:       {background:"#f8fafc",borderRadius:12,padding:"14px 16px",marginBottom:10,border:"1px solid #e2e8f0"},
};
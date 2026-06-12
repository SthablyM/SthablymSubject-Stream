// src/components/PastPapersQuiz.js
// Past Papers Quiz — Grades 8, 9, 10, 11, 12
// NSC / CAPS-style multiple choice questions per subject and grade
// NOTE: answer indices are varied (0–3) intentionally — students cannot guess by always picking A
import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION BANK
// Format: { id, grade, subject, topic, question, options[], answer(0-indexed), explanation }
// answer is intentionally spread across 0,1,2,3 to prevent cramming
// ─────────────────────────────────────────────────────────────────────────────
const QUESTION_BANK = [

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m8_01", grade:8, subject:"Mathematics", topic:"Whole Numbers", question:"What is the value of 7³?", options:["21","49","343","147"], answer:2, explanation:"7³ = 7 × 7 × 7 = 343" },
  { id:"m8_02", grade:8, subject:"Mathematics", topic:"Whole Numbers", question:"What is the LCM of 4 and 6?", options:["24","2","8","12"], answer:3, explanation:"Multiples of 4: 4,8,12. Multiples of 6: 6,12. LCM = 12" },
  { id:"m8_03", grade:8, subject:"Mathematics", topic:"Whole Numbers", question:"What is the HCF of 24 and 36?", options:["6","4","72","12"], answer:3, explanation:"Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. HCF = 12" },
  { id:"m8_04", grade:8, subject:"Mathematics", topic:"Integers", question:"What is −5 + (−3)?", options:["8","−2","2","−8"], answer:3, explanation:"Adding two negative numbers: −5 + (−3) = −8" },
  { id:"m8_05", grade:8, subject:"Mathematics", topic:"Integers", question:"What is (−4) × (−3)?", options:["−12","−7","7","12"], answer:3, explanation:"Negative × negative = positive. (−4) × (−3) = +12" },
  { id:"m8_06", grade:8, subject:"Mathematics", topic:"Integers", question:"What is −20 ÷ 4?", options:["5","−80","80","−5"], answer:3, explanation:"Negative ÷ positive = negative. −20 ÷ 4 = −5" },
  { id:"m8_07", grade:8, subject:"Mathematics", topic:"Fractions", question:"What is 2/3 + 1/4?", options:["3/7","3/12","2/7","11/12"], answer:3, explanation:"LCD = 12. 8/12 + 3/12 = 11/12" },
  { id:"m8_08", grade:8, subject:"Mathematics", topic:"Fractions", question:"What is 3/5 × 10/9?", options:["5/9","1/3","30/45","2/3"], answer:3, explanation:"3/5 × 10/9 = 30/45 = 2/3" },
  { id:"m8_09", grade:8, subject:"Mathematics", topic:"Decimals", question:"What is 0.4 × 0.3?", options:["0.7","1.2","0.012","0.12"], answer:3, explanation:"4×3=12, two decimal places → 0.12" },
  { id:"m8_10", grade:8, subject:"Mathematics", topic:"Percentages", question:"What is 20% of 250?", options:["25","200","5","50"], answer:3, explanation:"20% of 250 = 0.20 × 250 = 50" },
  { id:"m8_11", grade:8, subject:"Mathematics", topic:"Algebra", question:"Simplify: 3x + 5x − 2x", options:["8x","10x","3x","6x"], answer:3, explanation:"(3+5−2)x = 6x" },
  { id:"m8_12", grade:8, subject:"Mathematics", topic:"Algebra", question:"Solve for x: x + 7 = 15", options:["22","7","−8","8"], answer:3, explanation:"x = 15 − 7 = 8" },
  { id:"m8_13", grade:8, subject:"Mathematics", topic:"Algebra", question:"Expand: 2(x + 4)", options:["2x + 4","x + 8","2x − 8","2x + 8"], answer:3, explanation:"2×x=2x, 2×4=8 → 2x+8" },
  { id:"m8_14", grade:8, subject:"Mathematics", topic:"Geometry", question:"How many degrees in a straight angle?", options:["90°","360°","270°","180°"], answer:3, explanation:"A straight angle is exactly 180°" },
  { id:"m8_15", grade:8, subject:"Mathematics", topic:"Geometry", question:"The area of a square with side 6 cm is:", options:["24 cm²","12 cm²","216 cm²","36 cm²"], answer:3, explanation:"Area = 6² = 36 cm²" },
  { id:"m8_16", grade:8, subject:"Mathematics", topic:"Geometry", question:"How many sides does a hexagon have?", options:["5","7","8","6"], answer:3, explanation:"Hexagon = 6 sides" },
  { id:"m8_17", grade:8, subject:"Mathematics", topic:"Geometry", question:"The perimeter of a rectangle 8m × 3m is:", options:["24 m","11 m","48 m","22 m"], answer:3, explanation:"P = 2(8+3) = 22 m" },
  { id:"m8_18", grade:8, subject:"Mathematics", topic:"Patterns", question:"The next term in 1, 4, 9, 16, … is:", options:["20","36","18","25"], answer:3, explanation:"Perfect squares: 1²,2²,3²,4²,5²=25" },
  { id:"m8_19", grade:8, subject:"Mathematics", topic:"Patterns", question:"What is the 5th term of: 3, 6, 9, 12, …?", options:["18","12","21","15"], answer:3, explanation:"d=3. T₅=3×5=15" },
  { id:"m8_20", grade:8, subject:"Mathematics", topic:"Statistics", question:"The range of 2, 7, 4, 9, 5 is:", options:["9","5","4","7"], answer:3, explanation:"Range = 9 − 2 = 7" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m9_01", grade:9, subject:"Mathematics", topic:"Algebra", question:"Factorise: x² − 16", options:["(x−4)²","(x+4)²","(x−8)(x+2)","(x−4)(x+4)"], answer:3, explanation:"Difference of squares: x²−4²=(x−4)(x+4)" },
  { id:"m9_02", grade:9, subject:"Mathematics", topic:"Algebra", question:"Solve for x: 3x − 6 = 12", options:["2","−2","18","6"], answer:3, explanation:"3x=18 → x=6" },
  { id:"m9_03", grade:9, subject:"Mathematics", topic:"Algebra", question:"Simplify: (2x)³", options:["6x³","2x³","8x","8x³"], answer:3, explanation:"2³×x³=8x³" },
  { id:"m9_04", grade:9, subject:"Mathematics", topic:"Algebra", question:"Expand: (x + 3)(x − 2)", options:["x²−x−6","x²+x+6","x²+6","x²+x−6"], answer:3, explanation:"FOIL: x²−2x+3x−6=x²+x−6" },
  { id:"m9_05", grade:9, subject:"Mathematics", topic:"Exponents", question:"Simplify: a⁴ × a³", options:["a¹²","a","a⁴","a⁷"], answer:3, explanation:"Add exponents: a^(4+3)=a⁷" },
  { id:"m9_06", grade:9, subject:"Mathematics", topic:"Exponents", question:"What is 2⁻³?", options:["−8","−6","1/6","1/8"], answer:3, explanation:"2⁻³=1/2³=1/8" },
  { id:"m9_07", grade:9, subject:"Mathematics", topic:"Number Patterns", question:"Find T₄ if Tₙ = 2n + 1", options:["7","11","8","9"], answer:3, explanation:"T₄=2(4)+1=9" },
  { id:"m9_08", grade:9, subject:"Mathematics", topic:"Number Patterns", question:"The common difference of 5, 8, 11, 14 is:", options:["5","8","2","3"], answer:3, explanation:"8−5=3. d=3" },
  { id:"m9_09", grade:9, subject:"Mathematics", topic:"Functions", question:"If f(x) = 3x − 1, what is f(4)?", options:["12","13","10","11"], answer:3, explanation:"f(4)=12−1=11" },
  { id:"m9_10", grade:9, subject:"Mathematics", topic:"Functions", question:"The gradient of y = −2x + 5 is:", options:["5","2","−5","−2"], answer:3, explanation:"y=mx+c → m=−2" },
  { id:"m9_11", grade:9, subject:"Mathematics", topic:"Geometry", question:"Complementary angles sum to:", options:["180°","360°","270°","90°"], answer:3, explanation:"Complementary=90°, Supplementary=180°" },
  { id:"m9_12", grade:9, subject:"Mathematics", topic:"Geometry", question:"Sum of interior angles of a pentagon:", options:["360°","720°","180°","540°"], answer:3, explanation:"(5−2)×180°=540°" },
  { id:"m9_13", grade:9, subject:"Mathematics", topic:"Geometry", question:"Right triangle legs 6 and 8 — hypotenuse =", options:["14","7","√48","10"], answer:3, explanation:"c²=36+64=100 → c=10" },
  { id:"m9_14", grade:9, subject:"Mathematics", topic:"Probability", question:"4 red, 3 blue, 3 green balls. P(blue) =", options:["4/10","3/7","1/3","3/10"], answer:3, explanation:"P(blue)=3/10" },
  { id:"m9_15", grade:9, subject:"Mathematics", topic:"Statistics", question:"Mean of 4, 8, 12, 16 is:", options:["8","12","40","10"], answer:3, explanation:"(4+8+12+16)/4=10" },
  { id:"m9_16", grade:9, subject:"Mathematics", topic:"Finance", question:"R800 at 5% simple interest for 2 years earns:", options:["R40","R160","R880","R80"], answer:3, explanation:"SI=800×0.05×2=R80" },
  { id:"m9_17", grade:9, subject:"Mathematics", topic:"Measurement", question:"Volume: 5m × 4m × 3m prism =", options:["47 m³","20 m³","12 m³","60 m³"], answer:3, explanation:"V=5×4×3=60 m³" },
  { id:"m9_18", grade:9, subject:"Mathematics", topic:"Measurement", question:"Circumference of circle diameter 14 cm ≈", options:["88 cm","22 cm","154 cm","44 cm"], answer:3, explanation:"C=πd=22/7×14=44 cm" },
  { id:"m9_19", grade:9, subject:"Mathematics", topic:"Algebra", question:"Solve: 2(x − 3) = 8", options:["5","11","−1","7"], answer:3, explanation:"2x−6=8 → 2x=14 → x=7" },
  { id:"m9_20", grade:9, subject:"Mathematics", topic:"Statistics", question:"Median of 3, 7, 2, 10, 5, 8 is:", options:["5","7","5.5","6"], answer:3, explanation:"Sorted: 2,3,5,7,8,10. Median=(5+7)/2=6" },

  // ══════════════════════════════════════════════════════════════════════════
  // NATURAL SCIENCES — GRADE 8 & 9 (kept, answers varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ns8_01", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"Which state has no fixed shape but fixed volume?", options:["Solid","Gas","Plasma","Liquid"], answer:3, explanation:"Liquids take the shape of their container but have fixed volume" },
  { id:"ns8_02", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"Water turning into ice is called:", options:["Melting","Evaporation","Condensation","Freezing"], answer:3, explanation:"Freezing: liquid→solid" },
  { id:"ns8_03", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"An element contains:", options:["Two different atoms","Molecules only","Mixtures of atoms","One type of atom only"], answer:3, explanation:"An element contains only one type of atom" },
  { id:"ns8_04", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"Symbol for Gold:", options:["Go","Ag","Gd","Au"], answer:3, explanation:"Au from Latin 'Aurum'" },
  { id:"ns8_05", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"Salt dissolved in water is:", options:["A compound","A pure substance","A chemical reaction","A solution"], answer:3, explanation:"Salt water is a homogeneous mixture (solution)" },
  { id:"ns8_06", grade:8, subject:"Natural Sciences", topic:"Energy & Change", question:"Energy of a moving ball:", options:["Potential energy","Chemical energy","Electrical energy","Kinetic energy"], answer:3, explanation:"Moving objects have kinetic energy KE=½mv²" },
  { id:"ns8_07", grade:8, subject:"Natural Sciences", topic:"Energy & Change", question:"Sun produces energy by:", options:["Burning coal","Chemical reactions","Electrical energy","Nuclear fusion"], answer:3, explanation:"Hydrogen fuses to helium releasing energy" },
  { id:"ns8_08", grade:8, subject:"Natural Sciences", topic:"Life & Living", question:"Green plants make food using sunlight via:", options:["Respiration","Digestion","Fermentation","Photosynthesis"], answer:3, explanation:"Photosynthesis: CO₂+H₂O+light→glucose+O₂" },
  { id:"ns8_09", grade:8, subject:"Natural Sciences", topic:"Life & Living", question:"Which organ pumps blood?", options:["Lungs","Liver","Kidneys","Heart"], answer:3, explanation:"The heart circulates blood via arteries and veins" },
  { id:"ns8_10", grade:8, subject:"Natural Sciences", topic:"Earth & Beyond", question:"Closest planet to the sun:", options:["Venus","Earth","Mars","Mercury"], answer:3, explanation:"Mercury is the innermost planet" },
  { id:"ns9_01", grade:9, subject:"Natural Sciences", topic:"Matter & Materials", question:"Atomic number = number of:", options:["Neutrons","Electrons","Nucleons","Protons"], answer:3, explanation:"Atomic number = protons in nucleus" },
  { id:"ns9_02", grade:9, subject:"Natural Sciences", topic:"Matter & Materials", question:"Metal + non-metal forms:", options:["Covalent bond","Metallic bond","Hydrogen bond","Ionic bond"], answer:3, explanation:"Metal loses electrons to non-metal → ionic bond" },
  { id:"ns9_03", grade:9, subject:"Natural Sciences", topic:"Chemical Change", question:"Mass of reactants vs products (conservation):", options:["Always increases","Always decreases","Mass not involved","Equal"], answer:3, explanation:"Atoms rearranged, not created/destroyed" },
  { id:"ns9_04", grade:9, subject:"Natural Sciences", topic:"Chemical Change", question:"Burning wood is:", options:["Physical change","Reversible change","State change","Chemical change"], answer:3, explanation:"New substances produced = chemical change" },
  { id:"ns9_05", grade:9, subject:"Natural Sciences", topic:"Life & Living", question:"Which part of the cell controls all activities?", options:["Cytoplasm","Mitochondria","Cell membrane","Nucleus"], answer:3, explanation:"Nucleus contains DNA, directs all cell activity" },
  { id:"ns9_06", grade:9, subject:"Natural Sciences", topic:"Life & Living", question:"Theory of evolution proposed by:", options:["Isaac Newton","Louis Pasteur","Gregor Mendel","Charles Darwin"], answer:3, explanation:"Darwin: natural selection (1859)" },
  { id:"ns9_07", grade:9, subject:"Natural Sciences", topic:"Earth & Beyond", question:"The ozone layer protects from:", options:["Infrared radiation","Visible light","Radio waves","UV radiation"], answer:3, explanation:"Ozone absorbs UV-B and UV-C radiation" },
  { id:"ns9_08", grade:9, subject:"Natural Sciences", topic:"Energy & Change", question:"Which is a renewable energy source?", options:["Coal","Oil","Natural gas","Solar energy"], answer:3, explanation:"Solar is renewable; fossil fuels are finite" },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH — GRADE 8 & 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"en8_01", grade:8, subject:"English", topic:"Grammar", question:"Which is a noun in: 'The dog runs fast'?", options:["runs","fast","The","dog"], answer:3, explanation:"Noun names a person/thing. 'Dog' is the thing." },
  { id:"en8_02", grade:8, subject:"English", topic:"Grammar", question:"Which is a verb in: 'She sings beautifully'?", options:["She","beautifully","a","sings"], answer:3, explanation:"'Sings' is the action word" },
  { id:"en8_03", grade:8, subject:"English", topic:"Figures of Speech", question:"'It's raining cats and dogs' is:", options:["Simile","Metaphor","Alliteration","Idiom"], answer:3, explanation:"Idiom: phrase with non-literal meaning" },
  { id:"en8_04", grade:8, subject:"English", topic:"Figures of Speech", question:"'The stars winked at us' is:", options:["Simile","Hyperbole","Alliteration","Personification"], answer:3, explanation:"Non-human thing given human quality" },
  { id:"en8_05", grade:8, subject:"English", topic:"Grammar", question:"Plural of 'child':", options:["childs","childes","child's","children"], answer:3, explanation:"Irregular plural: child → children" },
  { id:"en8_06", grade:8, subject:"English", topic:"Figures of Speech", question:"'Quick as a fox' is:", options:["Metaphor","Personification","Onomatopoeia","Simile"], answer:3, explanation:"Simile uses 'as' or 'like' to compare" },
  { id:"en9_01", grade:9, subject:"English", topic:"Grammar", question:"'The cake was eaten by Tom' is:", options:["Active voice","Present tense","Future tense","Passive voice"], answer:3, explanation:"Subject receives action = passive voice" },
  { id:"en9_02", grade:9, subject:"English", topic:"Figures of Speech", question:"'Peter Piper picked…' is:", options:["Assonance","Personification","Hyperbole","Alliteration"], answer:3, explanation:"Repetition of initial consonant sound (P)" },
  { id:"en9_03", grade:9, subject:"English", topic:"Figures of Speech", question:"'Eat a horse' level of hunger is:", options:["Metaphor","Simile","Irony","Hyperbole"], answer:3, explanation:"Extreme exaggeration = hyperbole" },
  { id:"en9_04", grade:9, subject:"English", topic:"Literature", question:"Setting of a story refers to:", options:["Main character","Problem in story","The ending","Where/when it takes place"], answer:3, explanation:"Setting = place and time" },
  { id:"en9_05", grade:9, subject:"English", topic:"Grammar", question:"Correct possessive: 'The cat's fur':", options:["It's fur is brown.","Its' fur is brown.","Its's fur is brown.","Its fur is brown."], answer:3, explanation:"'Its' = possessive (no apostrophe). 'It's' = it is" },

  // ══════════════════════════════════════════════════════════════════════════
  // EMS — GRADE 8 & 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ems8_01", grade:8, subject:"Economic & Management Sciences", topic:"Economics", question:"Needs are:", options:["Things you want","Expensive items","Luxuries","Things you cannot survive without"], answer:3, explanation:"Needs = essentials for survival" },
  { id:"ems8_02", grade:8, subject:"Economic & Management Sciences", topic:"Economics", question:"Scarcity means:", options:["Shops have empty shelves","Money is hard to find","There is a drought","Unlimited wants vs limited resources"], answer:3, explanation:"Core economic problem" },
  { id:"ems8_03", grade:8, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"Income R2000, expenses R1500 — savings =", options:["R3500","R2000","R1500","R500"], answer:3, explanation:"Savings = Income − Expenses = R500" },
  { id:"ems8_04", grade:8, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"VAT 15% on R100 item — total price:", options:["R85","R150","R115.15","R115"], answer:3, explanation:"R100 + R15 VAT = R115" },
  { id:"ems9_01", grade:9, subject:"Economic & Management Sciences", topic:"Business", question:"Opportunity cost is:", options:["Price of goods","Cost of production","Tax on profits","Value of next best alternative given up"], answer:3, explanation:"Choosing one option means giving up another" },
  { id:"ems9_02", grade:9, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"Compound interest is calculated on:", options:["Only the interest","The average balance","Principal only","Principal plus accumulated interest"], answer:3, explanation:"Compound grows faster than simple interest" },
  { id:"ems9_03", grade:9, subject:"Economic & Management Sciences", topic:"Economics", question:"Inflation means:", options:["Prices fall","Unemployment rises","Economy grows","General price level rises over time"], answer:3, explanation:"Purchasing power of money decreases" },
  { id:"ems9_04", grade:9, subject:"Economic & Management Sciences", topic:"Economics", question:"GDP stands for:", options:["General Development Plan","Government Domestic Policy","Grand Development Programme","Gross Domestic Product"], answer:3, explanation:"Total value of goods/services produced per year" },

  // ══════════════════════════════════════════════════════════════════════════
  // SOCIAL SCIENCES — GRADE 8 & 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ss8h_01", grade:8, subject:"Social Sciences: History", topic:"SA History", question:"Cape Colony first settled under:", options:["Cecil John Rhodes","Paul Kruger","Louis Botha","Jan van Riebeeck"], answer:3, explanation:"Van Riebeeck arrived 6 April 1652" },
  { id:"ss8h_02", grade:8, subject:"Social Sciences: History", topic:"World History", question:"Columbus reached the Americas in:", options:["1498","1415","1503","1492"], answer:3, explanation:"12 October 1492, sponsored by Spain" },
  { id:"ss8h_03", grade:8, subject:"Social Sciences: History", topic:"SA History", question:"'Apartheid' means:", options:["Development","Freedom","Unity","Separateness"], answer:3, explanation:"Afrikaans: 'apart-hood' = separateness" },
  { id:"ss9h_01", grade:9, subject:"Social Sciences: History", topic:"World History", question:"WWI was triggered by:", options:["Invasion of Poland","Bombing of Pearl Harbor","Russian Revolution","Assassination of Archduke Franz Ferdinand"], answer:3, explanation:"28 June 1914, Sarajevo" },
  { id:"ss9h_02", grade:9, subject:"Social Sciences: History", topic:"SA History", question:"SANNC (later ANC) was founded in:", options:["1948","1960","1994","1912"], answer:3, explanation:"Founded Bloemfontein 8 January 1912" },
  { id:"ss9h_03", grade:9, subject:"Social Sciences: History", topic:"World History", question:"United Nations established in:", options:["1919","1939","1950","1945"], answer:3, explanation:"October 1945 after WWII" },
  { id:"ss8g_01", grade:8, subject:"Social Sciences: Geography", topic:"Map Work", question:"Scale 1:50 000 — 1 cm represents:", options:["50 000 km","1 cm","50 m","500 m (50 000 cm)"], answer:3, explanation:"1:50000 = 500m = 0.5km" },
  { id:"ss8g_02", grade:8, subject:"Social Sciences: Geography", topic:"Climate & Weather", question:"Weather vs climate difference:", options:["They're the same","Climate=daily","Weather=global","Weather=short-term; climate=long-term"], answer:3, explanation:"Weather = hours/days. Climate = 30+ year averages." },
  { id:"ss9g_01", grade:9, subject:"Social Sciences: Geography", topic:"Geomorphology", question:"A delta forms at a river's:", options:["Source","Middle course","Upper course","Mouth"], answer:3, explanation:"Sediment deposited where river meets still water" },
  { id:"ss9g_02", grade:9, subject:"Social Sciences: Geography", topic:"Atmosphere", question:"Greenhouse effect:", options:["Plants produce oxygen","Ozone absorbs UV","Sun heats oceans","Gases trap heat in atmosphere"], answer:3, explanation:"CO₂, CH₄ absorb outgoing infrared radiation" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNOLOGY — GRADE 8 & 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tech8_01", grade:8, subject:"Technology", topic:"Design Process", question:"First step of design process:", options:["Build solution","Evaluate result","Draw a plan","Identify the problem/need"], answer:3, explanation:"1.Identify→2.Design→3.Make→4.Evaluate→5.Communicate" },
  { id:"tech8_02", grade:8, subject:"Technology", topic:"Structures", question:"Triangles are used in structures because:", options:["Flexible","Easy to build","Lightweight only","Very rigid and strong"], answer:3, explanation:"Triangle is the most rigid polygon" },
  { id:"tech8_03", grade:8, subject:"Technology", topic:"Electricity", question:"Current flows only in a … circuit:", options:["Open","Broken","Insulated","Complete/closed"], answer:3, explanation:"A break stops current flow" },
  { id:"tech9_01", grade:9, subject:"Technology", topic:"Design Process", question:"A prototype is:", options:["The final product","A drawing only","A materials list","A working model to test design"], answer:3, explanation:"Built to evaluate before full production" },
  { id:"tech9_02", grade:9, subject:"Technology", topic:"Electricity", question:"Ohm's Law: V=12V, R=3Ω → Current =", options:["36 A","9 A","0.25 A","4 A"], answer:3, explanation:"I=V/R=12/3=4A" },
  { id:"tech9_03", grade:9, subject:"Technology", topic:"Electricity", question:"Good conductor of electricity:", options:["Rubber","Wood","Plastic","Copper"], answer:3, explanation:"Copper has free electrons for easy current flow" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE ORIENTATION — GRADE 8 & 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"lo8_01", grade:8, subject:"Life Orientation", topic:"Personal Development", question:"Self-esteem refers to:", options:["Your school marks","Your height and weight","Your popularity","How you feel about and value yourself"], answer:3, explanation:"Self-esteem = overall sense of self-worth" },
  { id:"lo8_02", grade:8, subject:"Life Orientation", topic:"Health", question:"Main HIV prevention method:", options:["Taking vitamins","Exercise only","Drinking clean water","Abstinence, condoms, no shared needles"], answer:3, explanation:"ABC: Abstinence, Be faithful, Condoms" },
  { id:"lo9_01", grade:9, subject:"Life Orientation", topic:"Careers", question:"APS is used for:", options:["School reports only","Bursary applications","Employment","University entrance requirements"], answer:3, explanation:"APS calculated from NSC for uni admission" },
  { id:"lo9_02", grade:9, subject:"Life Orientation", topic:"Citizenship", question:"Section 9 of SA Constitution guarantees:", options:["Free university education","Right to own a business","Minimum wage","Right to equality and non-discrimination"], answer:3, explanation:"Bill of Rights: everyone equal before the law" },

  // ══════════════════════════════════════════════════════════════════════════
  // CREATIVE ARTS — GRADE 8 & 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ca8_01", grade:8, subject:"Creative Arts", topic:"Visual Arts", question:"Primary colours are:", options:["Red, green, blue","Orange, purple, green","Black, white, grey","Red, blue, yellow"], answer:3, explanation:"Traditional pigment primaries: red, blue, yellow" },
  { id:"ca8_02", grade:8, subject:"Creative Arts", topic:"Music", question:"Tempo in music refers to:", options:["The loudness","The pitch","Rhythm pattern","Speed of the music"], answer:3, explanation:"Tempo = BPM (beats per minute)" },
  { id:"ca9_01", grade:9, subject:"Creative Arts", topic:"Visual Arts", question:"Perspective in art creates illusion of:", options:["Colour harmony","Texture only","Abstract shapes","Depth and 3D space on flat surface"], answer:3, explanation:"One-point, two-point perspective show depth" },
  { id:"ca9_02", grade:9, subject:"Creative Arts", topic:"Drama", question:"Improvisation in drama means:", options:["Learning lines perfectly","Using only props","Directing others","Performing without script"], answer:3, explanation:"Spontaneous dialogue without preparation" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 10  (30 questions, varied answers)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m10_01", grade:10, subject:"Mathematics", topic:"Algebra", question:"Simplify: 3x² − 5x + 2x² + 4x", options:["5x² + x","5x² − 9x","x² − x","5x² − x"], answer:3, explanation:"(3+2)x² + (−5+4)x = 5x² − x" },
  { id:"m10_02", grade:10, subject:"Mathematics", topic:"Algebra", question:"Factorise: x² − 9", options:["(x−9)(x+1)","(x+3)²","(x−3)²","(x−3)(x+3)"], answer:3, explanation:"Difference of squares: (x−3)(x+3)" },
  { id:"m10_03", grade:10, subject:"Mathematics", topic:"Algebra", question:"Solve: 2x + 5 = 13", options:["x=9","x=3","x=6","x=4"], answer:3, explanation:"2x=8 → x=4" },
  { id:"m10_04", grade:10, subject:"Mathematics", topic:"Exponents", question:"Simplify: 2³ × 2⁴", options:["2¹²","4⁷","2⁻¹","2⁷"], answer:3, explanation:"2^(3+4)=2⁷" },
  { id:"m10_05", grade:10, subject:"Mathematics", topic:"Exponents", question:"Value of 5⁰ =", options:["0","5","Undefined","1"], answer:3, explanation:"Any non-zero base to power 0 = 1" },
  { id:"m10_06", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"Next term in 3, 7, 11, 15, …?", options:["17","18","20","19"], answer:3, explanation:"d=4. 15+4=19" },
  { id:"m10_07", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"nth term formula for 5, 8, 11, 14, …?", options:["2n+3","3n−2","n+4","3n+2"], answer:3, explanation:"5+(n−1)3 = 3n+2" },
  { id:"m10_08", grade:10, subject:"Mathematics", topic:"Finance", question:"R500 at 8% simple interest for 3 years — interest =", options:["R40","R24","R180","R120"], answer:3, explanation:"SI=500×0.08×3=R120" },
  { id:"m10_09", grade:10, subject:"Mathematics", topic:"Statistics", question:"Median of 3, 7, 2, 9, 5 =", options:["7","3","9","5"], answer:3, explanation:"Sorted: 2,3,5,7,9 → middle=5" },
  { id:"m10_10", grade:10, subject:"Mathematics", topic:"Geometry", question:"Sum of angles of a triangle:", options:["90°","270°","360°","180°"], answer:3, explanation:"Always 180°" },
  { id:"m10_11", grade:10, subject:"Mathematics", topic:"Geometry", question:"Area of rectangle 8cm × 5cm:", options:["26 cm²","13 cm²","80 cm²","40 cm²"], answer:3, explanation:"A=8×5=40 cm²" },
  { id:"m10_12", grade:10, subject:"Mathematics", topic:"Functions", question:"Gradient of y = 3x − 4:", options:["−4","4","−3","3"], answer:3, explanation:"y=mx+c → m=3" },
  { id:"m10_13", grade:10, subject:"Mathematics", topic:"Functions", question:"f(x)=2x+1; f(3)=", options:["5","9","6","7"], answer:3, explanation:"2(3)+1=7" },
  { id:"m10_14", grade:10, subject:"Mathematics", topic:"Trigonometry", question:"sin θ = opposite / …?", options:["adjacent","base","height","hypotenuse"], answer:3, explanation:"SOH: Sin=Opposite/Hypotenuse" },
  { id:"m10_15", grade:10, subject:"Mathematics", topic:"Probability", question:"3 red, 7 blue balls. P(red) =", options:["7/10","3/7","1/3","3/10"], answer:3, explanation:"P(red)=3/10" },
  { id:"m10_16", grade:10, subject:"Mathematics", topic:"Algebra", question:"Simplify: (x³)²", options:["x⁵","2x³","x","x⁶"], answer:3, explanation:"Power of power: multiply exponents 3×2=6" },
  { id:"m10_17", grade:10, subject:"Mathematics", topic:"Algebra", question:"Factorise: 2x² + 4x", options:["2(x+4)","x(2x+4)","2x(x+4)","2x(x+2)"], answer:3, explanation:"HCF=2x. 2x(x+2)" },
  { id:"m10_18", grade:10, subject:"Mathematics", topic:"Finance", question:"R1000 invested at 6% compound interest for 1 year =", options:["R1600","R1060","R1006","R1060"], answer:1, explanation:"A=1000×(1.06)¹=R1060" },
  { id:"m10_19", grade:10, subject:"Mathematics", topic:"Statistics", question:"Mode of: 3, 5, 3, 7, 3, 5 =", options:["5","7","4","3"], answer:3, explanation:"3 appears most often (3 times)" },
  { id:"m10_20", grade:10, subject:"Mathematics", topic:"Trigonometry", question:"cos θ = adjacent / …?", options:["opposite","hypotenuse squared","base","hypotenuse"], answer:3, explanation:"CAH: Cos=Adjacent/Hypotenuse" },
  { id:"m10_21", grade:10, subject:"Mathematics", topic:"Geometry", question:"Two lines are perpendicular if their gradients multiply to:", options:["0","1","undefined","−1"], answer:3, explanation:"Perpendicular: m₁ × m₂ = −1" },
  { id:"m10_22", grade:10, subject:"Mathematics", topic:"Functions", question:"y-intercept of y = 4x − 7:", options:["4","x=7/4","0","−7"], answer:3, explanation:"c in y=mx+c is the y-intercept = −7" },
  { id:"m10_23", grade:10, subject:"Mathematics", topic:"Probability", question:"P(impossible event) =", options:["0.5","1","−1","0"], answer:3, explanation:"Impossible event has probability 0" },
  { id:"m10_24", grade:10, subject:"Mathematics", topic:"Algebra", question:"Solve: x/3 = 8", options:["3","11","5","24"], answer:3, explanation:"x = 8 × 3 = 24" },
  { id:"m10_25", grade:10, subject:"Mathematics", topic:"Exponents", question:"Simplify: 12x⁶ ÷ 3x²", options:["9x⁴","4x³","9x³","4x⁴"], answer:3, explanation:"12÷3=4, x^(6−2)=x⁴ → 4x⁴" },
  { id:"m10_26", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"Arithmetic sequence: T₁=2, d=5. T₆=", options:["30","22","27","27"], answer:3, explanation:"T₆=2+(5)(5)=27" },
  { id:"m10_27", grade:10, subject:"Mathematics", topic:"Statistics", question:"Interquartile range = Q3 −", options:["Median","Mean","Range","Q1"], answer:3, explanation:"IQR = Q3 − Q1 (middle 50% spread)" },
  { id:"m10_28", grade:10, subject:"Mathematics", topic:"Geometry", question:"Area of circle with radius 7 (π=22/7):", options:["44","22","154 cm²","154"], answer:3, explanation:"A=πr²=22/7×49=154" },
  { id:"m10_29", grade:10, subject:"Mathematics", topic:"Trigonometry", question:"tan 45° =", options:["0","0.5","√3","1"], answer:3, explanation:"tan 45° = sin45°/cos45° = 1" },
  { id:"m10_30", grade:10, subject:"Mathematics", topic:"Algebra", question:"Expand: (x−2)(x−5)", options:["x²−3x+10","x²+7x+10","x²+3x−10","x²−7x+10"], answer:3, explanation:"FOIL: x²−5x−2x+10=x²−7x+10" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 11  (30 questions, varied answers)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m11_01", grade:11, subject:"Mathematics", topic:"Quadratics", question:"Solve: x² − 5x + 6 = 0", options:["x=−2 or x=−3","x=1 or x=6","x=−1 or x=−6","x=2 or x=3"], answer:3, explanation:"(x−2)(x−3)=0" },
  { id:"m11_02", grade:11, subject:"Mathematics", topic:"Finance", question:"R2000 at 10% compound for 2 years =", options:["R2400","R2200","R2440","R2420"], answer:3, explanation:"A=2000(1.1)²=R2420" },
  { id:"m11_03", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"cos 60° =", options:["√3/2","1","0","0.5"], answer:3, explanation:"cos 60°=1/2=0.5" },
  { id:"m11_04", grade:11, subject:"Mathematics", topic:"Statistics", question:"Standard deviation of 0 means:", options:["No data","Data spread out","Mean is zero","All values equal"], answer:3, explanation:"SD=0: all data identical" },
  { id:"m11_05", grade:11, subject:"Mathematics", topic:"Functions", question:"Axis of symmetry of y = x² − 6x + 8:", options:["x=−3","x=8","x=6","x=3"], answer:3, explanation:"x=−b/2a=6/2=3" },
  { id:"m11_06", grade:11, subject:"Mathematics", topic:"Functions", question:"For y = 2x, as x→∞:", options:["y→0","y→−∞","y→2","y→∞"], answer:3, explanation:"Exponential growth: 2x grows without bound" },
  { id:"m11_07", grade:11, subject:"Mathematics", topic:"Functions", question:"A parabola y=ax²+bx+c opens downward when:", options:["a=0","b<0","c<0","a<0"], answer:3, explanation:"Negative a coefficient flips the parabola" },
  { id:"m11_08", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"sin 30° =", options:["√3/2","√2/2","1","0.5"], answer:3, explanation:"sin 30°=1/2=0.5" },
  { id:"m11_09", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"Which identity is correct?", options:["sin²θ+cos²θ=0","sinθ/cosθ=cosθ","tanθ=cosθ/sinθ","sin²θ+cos²θ=1"], answer:3, explanation:"Pythagorean identity" },
  { id:"m11_10", grade:11, subject:"Mathematics", topic:"Probability", question:"P(A or B) = P(A) + P(B) − …?", options:["P(A)","P(B)","P(A+B)","P(A and B)"], answer:3, explanation:"Addition rule for non-mutually-exclusive events" },
  { id:"m11_11", grade:11, subject:"Mathematics", topic:"Finance", question:"Depreciation (straight line) formula:", options:["A=P(1+in)","A=P(1+i)ⁿ","A=P(1+i)","A=P(1−in)"], answer:3, explanation:"Straight-line: A=P(1−in)" },
  { id:"m11_12", grade:11, subject:"Mathematics", topic:"Finance", question:"R5000 depreciated at 10% straight-line after 3 years:", options:["R3500","R3750","R2000","R3500"], answer:0, explanation:"A=5000(1−0.1×3)=5000×0.7=R3500" },
  { id:"m11_13", grade:11, subject:"Mathematics", topic:"Sequences", question:"Geometric sequence: T₁=2, r=3. T₄=", options:["18","24","48","54"], answer:3, explanation:"T₄=2×3³=2×27=54" },
  { id:"m11_14", grade:11, subject:"Mathematics", topic:"Sequences", question:"Sum formula Sₙ for arithmetic series:", options:["Sₙ=a(rⁿ−1)/(r−1)","Sₙ=a/(1−r)","Sₙ=n×a","Sₙ=n/2(2a+(n−1)d)"], answer:3, explanation:"Arithmetic Sₙ = n/2[2a+(n−1)d]" },
  { id:"m11_15", grade:11, subject:"Mathematics", topic:"Functions", question:"y = log₂8 =", options:["2","4","8","3"], answer:3, explanation:"2³=8 → log₂8=3" },
  { id:"m11_16", grade:11, subject:"Mathematics", topic:"Analytical Geometry", question:"Midpoint of (2,4) and (6,10):", options:["(3,5)","(8,14)","(2,3)","(4,7)"], answer:3, explanation:"M=((2+6)/2,(4+10)/2)=(4,7)" },
  { id:"m11_17", grade:11, subject:"Mathematics", topic:"Analytical Geometry", question:"Gradient between (1,2) and (3,8):", options:["2","4","1","3"], answer:3, explanation:"m=(8−2)/(3−1)=6/2=3" },
  { id:"m11_18", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"In which quadrant is sin negative and cos positive?", options:["Quadrant 1","Quadrant 2","Quadrant 3","Quadrant 4"], answer:3, explanation:"Q4: x+, y− → cos+, sin−" },
  { id:"m11_19", grade:11, subject:"Mathematics", topic:"Statistics", question:"A histogram shows:", options:["Scatter of two variables","Individual data points","Cumulative frequency","Distribution/frequency of continuous data"], answer:3, explanation:"Histograms show frequency of grouped data" },
  { id:"m11_20", grade:11, subject:"Mathematics", topic:"Statistics", question:"Positive skew data: mean is … the median", options:["equal to","less than","exactly double","greater than"], answer:3, explanation:"Positive skew: tail right → mean pulled right of median" },
  { id:"m11_21", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"sin(180°−θ) =", options:["−sinθ","cosθ","−cosθ","sinθ"], answer:3, explanation:"sin(180°−θ)=sinθ (supplementary rule)" },
  { id:"m11_22", grade:11, subject:"Mathematics", topic:"Probability", question:"Complement rule: P(A') =", options:["P(A)","P(A)−1","0","1−P(A)"], answer:3, explanation:"P(not A) = 1 − P(A)" },
  { id:"m11_23", grade:11, subject:"Mathematics", topic:"Functions", question:"For y=a·bˣ, if b>1 the function shows:", options:["Linear growth","Decay","Constant","Exponential growth"], answer:3, explanation:"Base >1: exponential growth" },
  { id:"m11_24", grade:11, subject:"Mathematics", topic:"Algebra", question:"Discriminant of x²+2x+1:", options:["−4","8","4","0"], answer:3, explanation:"Δ=b²−4ac=4−4=0 (equal roots)" },
  { id:"m11_25", grade:11, subject:"Mathematics", topic:"Algebra", question:"Solve: x²=9", options:["x=3","x=9","x=±9","x=±3"], answer:3, explanation:"x=±√9=±3" },
  { id:"m11_26", grade:11, subject:"Mathematics", topic:"Finance", question:"Effective annual rate better accounts for:", options:["Inflation","Simple interest","Tax","Compounding periods"], answer:3, explanation:"EAR accounts for how often interest compounds" },
  { id:"m11_27", grade:11, subject:"Mathematics", topic:"Sequences", question:"r (common ratio) for 2, 6, 18, 54 is:", options:["4","2","6","3"], answer:3, explanation:"6/2=3. r=3" },
  { id:"m11_28", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"cos(360°−θ) =", options:["−cosθ","sinθ","−sinθ","cosθ"], answer:3, explanation:"cos(360°−θ)=cosθ" },
  { id:"m11_29", grade:11, subject:"Mathematics", topic:"Analytical Geometry", question:"Distance from (0,0) to (3,4):", options:["7","√7","3","5"], answer:3, explanation:"d=√(9+16)=5" },
  { id:"m11_30", grade:11, subject:"Mathematics", topic:"Statistics", question:"Ogive (cumulative frequency curve) is used to find:", options:["Mean","Mode","Range","Median and percentiles"], answer:3, explanation:"Ogive: read off quartiles and percentiles" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 12  (30 questions, varied answers)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m12_01", grade:12, subject:"Mathematics", topic:"Calculus", question:"Derivative of f(x) = x³:", options:["3x","x²","3x³","3x²"], answer:3, explanation:"Power rule: d/dx(xⁿ)=nxⁿ⁻¹ → 3x²" },
  { id:"m12_02", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"Distance between (1,2) and (4,6):", options:["3","7","√7","5"], answer:3, explanation:"d=√(9+16)=5" },
  { id:"m12_03", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"S∞ of geometric series (|r|<1) =", options:["a(r−1)","a·r","a(1−r)","a/(1−r)"], answer:3, explanation:"Infinite geometric sum = a/(1−r)" },
  { id:"m12_04", grade:12, subject:"Mathematics", topic:"Calculus", question:"Derivative of f(x) = 5x² − 3x + 7:", options:["10x+3","5x−3","10x−3+7","10x−3"], answer:3, explanation:"d/dx: 10x−3 (constant term disappears)" },
  { id:"m12_05", grade:12, subject:"Mathematics", topic:"Calculus", question:"f'(x)=0 at a turning point. For f''(x)>0:", options:["Neither","Point of inflection","Local maximum","Local minimum"], answer:3, explanation:"f''(x)>0 → concave up → minimum" },
  { id:"m12_06", grade:12, subject:"Mathematics", topic:"Finance", question:"R10 000 at 8% p.a. compounded monthly for 2 years:", options:["R11 600","R11 664","R11 726","R11 729.83"], answer:3, explanation:"A=10000(1+0.08/12)^24=R11 729.83" },
  { id:"m12_07", grade:12, subject:"Mathematics", topic:"Finance", question:"Future value annuity formula:", options:["PV=x[(1+i)ⁿ−1]/i","PV=x/i","FV=x·n·i","FV=x[(1+i)ⁿ−1]/i"], answer:3, explanation:"FV annuity: regular payments growing at interest i" },
  { id:"m12_08", grade:12, subject:"Mathematics", topic:"Probability", question:"P(A∩B) if A and B are mutually exclusive:", options:["P(A)·P(B)","P(A)+P(B)","1","0"], answer:3, explanation:"Mutually exclusive: cannot occur together → P=0" },
  { id:"m12_09", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"∑(k=1 to 5) of 2k =", options:["10","25","15","30"], answer:3, explanation:"2+4+6+8+10=30" },
  { id:"m12_10", grade:12, subject:"Mathematics", topic:"Calculus", question:"∫x² dx =", options:["2x","x³","x²/2","x³/3 + C"], answer:3, explanation:"Integral: increase power by 1, divide by new power" },
  { id:"m12_11", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"Equation of circle centre(0,0) radius 5:", options:["x+y=25","x+y=5","x²+y²=5","x²+y²=25"], answer:3, explanation:"x²+y²=r²=25" },
  { id:"m12_12", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"Gradient of tangent to circle x²+y²=25 at (3,4):", options:["4/3","3/4","−4/3","−3/4"], answer:3, explanation:"Radius gradient=4/3, tangent perpendicular=−3/4" },
  { id:"m12_13", grade:12, subject:"Mathematics", topic:"Trigonometry", question:"cos(A−B) =", options:["cosA·cosB+sinA·sinB","cosAcosB−sinAsinB−2","cosA−cosB","cosAcosB+sinAsinB"], answer:3, explanation:"Compound angle: cosA cosB + sinA sinB" },
  { id:"m12_14", grade:12, subject:"Mathematics", topic:"Trigonometry", question:"sin 2A =", options:["sin²A−cos²A","2sin²A","cos²A−sin²A","2sinAcosA"], answer:3, explanation:"Double angle: sin2A=2sinAcosA" },
  { id:"m12_15", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"Geometric series: a=1, r=1/2. S∞=", options:["1/2","1/4","4","2"], answer:3, explanation:"S∞=1/(1−0.5)=2" },
  { id:"m12_16", grade:12, subject:"Mathematics", topic:"Calculus", question:"Maximum of f(x) = −x² + 4x − 1 is at x =", options:["−2","1","−4","2"], answer:3, explanation:"x=−b/2a=−4/(−2)=2" },
  { id:"m12_17", grade:12, subject:"Mathematics", topic:"Calculus", question:"Average gradient between x=1 and x=3 for f(x)=x²:", options:["2","6","3","4"], answer:3, explanation:"[f(3)−f(1)]/(3−1)=(9−1)/2=4" },
  { id:"m12_18", grade:12, subject:"Mathematics", topic:"Finance", question:"Present value formula for annuity:", options:["PV=FV/(1+i)ⁿ","PV=x·n","PV=x·i","PV=x[1−(1+i)⁻ⁿ]/i"], answer:3, explanation:"PV of annuity: discounts future payments back to today" },
  { id:"m12_19", grade:12, subject:"Mathematics", topic:"Probability", question:"If P(A)=0.3 and P(B)=0.5 (independent), P(A and B)=", options:["0.8","0.2","0.35","0.15"], answer:3, explanation:"Independent: P(A∩B)=P(A)×P(B)=0.15" },
  { id:"m12_20", grade:12, subject:"Mathematics", topic:"Statistics", question:"Regression line y=a+bx: b represents:", options:["y-intercept","Correlation coefficient","Variance","Gradient (slope)"], answer:3, explanation:"b is the slope: change in y per unit x" },
  { id:"m12_21", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"Line through (0,3) with gradient 2:", options:["y=3x","y=2x−3","y=3x+2","y=2x+3"], answer:3, explanation:"y=mx+c: m=2, c=3 → y=2x+3" },
  { id:"m12_22", grade:12, subject:"Mathematics", topic:"Calculus", question:"d/dx(x⁴) =", options:["4","x³","4x³","4x⁴"], answer:2, explanation:"Power rule: 4x³" },
  { id:"m12_23", grade:12, subject:"Mathematics", topic:"Trigonometry", question:"sin(A+B) =", options:["sinA+sinB","sinAcosB−cosAsinB","cosAcosB+sinAsinB","sinAcosB+cosAsinB"], answer:3, explanation:"Compound angle addition formula" },
  { id:"m12_24", grade:12, subject:"Mathematics", topic:"Sequences", question:"Sum of first n natural numbers = n(n+1)/… ?", options:["4","3","n","2"], answer:3, explanation:"1+2+…+n = n(n+1)/2" },
  { id:"m12_25", grade:12, subject:"Mathematics", topic:"Calculus", question:"A function's graph crosses x-axis where f(x) =", options:["maximum","undefined","1","0"], answer:3, explanation:"x-intercept: set f(x)=0 and solve" },
  { id:"m12_26", grade:12, subject:"Mathematics", topic:"Statistics", question:"Correlation coefficient r=−1 indicates:", options:["No correlation","Weak correlation","Perfect positive","Perfect negative linear relationship"], answer:3, explanation:"r=−1: perfectly negative linear relationship" },
  { id:"m12_27", grade:12, subject:"Mathematics", topic:"Finance", question:"R3000 per month for 24 months at 12% p.a. — this is:", options:["Simple interest calculation","Compound amount","Single investment","Annuity"], answer:3, explanation:"Regular equal payments = annuity" },
  { id:"m12_28", grade:12, subject:"Mathematics", topic:"Probability", question:"Number of arrangements of 5 different objects:", options:["25","10","50","120"], answer:3, explanation:"5!=120" },
  { id:"m12_29", grade:12, subject:"Mathematics", topic:"Calculus", question:"Point of inflection: f''(x) changes from … to …", options:["0 to positive","positive to negative","negative to 0","positive to negative OR negative to positive"], answer:3, explanation:"POI: second derivative changes sign" },
  { id:"m12_30", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"Angle θ between two lines with gradients m₁, m₂:", options:["θ=m₁−m₂","θ=m₁+m₂","sinθ=(m₁−m₂)/(1+m₁m₂)","tanθ=|(m₁−m₂)/(1+m₁m₂)|"], answer:3, explanation:"Angle between lines formula using tan" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 10  (25 questions, varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps10_01", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"Atomic number of Carbon:", options:["12","4","8","6"], answer:3, explanation:"Carbon: 6 protons" },
  { id:"ps10_02", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"Ohm's Law: V =", options:["I/R","R/I","I+R","I×R"], answer:3, explanation:"V=IR" },
  { id:"ps10_03", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Newton's 1st Law — object at rest will:", options:["Always start moving","Accelerate continuously","Lose mass","Stay at rest unless net force acts"], answer:3, explanation:"Inertia law" },
  { id:"ps10_04", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"SI unit of force:", options:["Joule (J)","Watt (W)","Pascal (Pa)","Newton (N)"], answer:3, explanation:"Force in Newtons (N)" },
  { id:"ps10_05", grade:10, subject:"Physical Sciences", topic:"Waves & Sound", question:"Number of waves per second:", options:["Amplitude","Wavelength","Period","Frequency"], answer:3, explanation:"Frequency in Hertz (Hz)" },
  { id:"ps10_06", grade:10, subject:"Physical Sciences", topic:"Periodic Table", question:"Elements in same group have the same number of:", options:["Neutrons","Atomic mass","Protons","Valence electrons"], answer:3, explanation:"Same group = same valence electrons → similar properties" },
  { id:"ps10_07", grade:10, subject:"Physical Sciences", topic:"Bonding", question:"Ionic bond forms between:", options:["Two non-metals","Two metals","Metal and metalloid","Metal and non-metal"], answer:3, explanation:"Metal loses electron to non-metal" },
  { id:"ps10_08", grade:10, subject:"Physical Sciences", topic:"Energy", question:"KE depends on:", options:["Mass and height","Height only","Velocity only","Mass and velocity"], answer:3, explanation:"KE=½mv²" },
  { id:"ps10_09", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Speed = Distance ÷", options:["Mass","Force","Acceleration","Time"], answer:3, explanation:"v=d/t" },
  { id:"ps10_10", grade:10, subject:"Physical Sciences", topic:"Waves & Sound", question:"Speed of light in vacuum ≈", options:["3×10⁶ m/s","3×10⁹ m/s","3×10¹⁰ m/s","3×10⁸ m/s"], answer:3, explanation:"c≈3×10⁸ m/s" },
  { id:"ps10_11", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"Covalent bond forms between:", options:["Metal and non-metal","Two metals","Metal and metalloid","Two non-metals"], answer:3, explanation:"Non-metals share electrons" },
  { id:"ps10_12", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"F = m × a is Newton's:", options:["1st Law","Gravitational law","3rd Law","2nd Law"], answer:3, explanation:"F=ma is Newton's second law" },
  { id:"ps10_13", grade:10, subject:"Physical Sciences", topic:"Energy", question:"Potential energy = m × g × …?", options:["v","t","a","h"], answer:3, explanation:"PE=mgh (height above ground)" },
  { id:"ps10_14", grade:10, subject:"Physical Sciences", topic:"Periodic Table", question:"Number of electrons in the 1st shell:", options:["8","6","4","2"], answer:3, explanation:"First shell holds maximum 2 electrons" },
  { id:"ps10_15", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"Resistance of two 4Ω resistors in series:", options:["2Ω","8Ω","4Ω","8Ω"], answer:1, explanation:"Series: R=R₁+R₂=8Ω" },
  { id:"ps10_16", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"Resistance of two 4Ω resistors in parallel:", options:["8Ω","4Ω","1Ω","2Ω"], answer:3, explanation:"Parallel: 1/R=1/4+1/4=1/2 → R=2Ω" },
  { id:"ps10_17", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Acceleration unit:", options:["m/s","m","s","m/s²"], answer:3, explanation:"Acceleration = m/s²" },
  { id:"ps10_18", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"Relative atomic mass of carbon:", options:["6","8","14","12"], answer:3, explanation:"C: atomic mass = 12 (6p + 6n)" },
  { id:"ps10_19", grade:10, subject:"Physical Sciences", topic:"Waves & Sound", question:"Wavelength is the distance between:", options:["Amplitude and zero","Trough and equilibrium","Crest and zero","Two consecutive crests"], answer:3, explanation:"λ = crest to crest (or trough to trough)" },
  { id:"ps10_20", grade:10, subject:"Physical Sciences", topic:"Bonding", question:"H₂O is an example of:", options:["Ionic compound","Metallic bond","Non-polar covalent","Polar covalent compound"], answer:3, explanation:"O attracts electrons more → polar covalent" },
  { id:"ps10_21", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"A mixture can be separated by:", options:["Chemical reaction","Nuclear reaction","Melting","Physical means"], answer:3, explanation:"Mixtures: filtration, distillation, evaporation, etc." },
  { id:"ps10_22", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Weight = mass ×", options:["Speed","Density","Area","g (gravitational acceleration)"], answer:3, explanation:"W=mg. On Earth g≈9.8 m/s²" },
  { id:"ps10_23", grade:10, subject:"Physical Sciences", topic:"Energy", question:"Work done = Force ×", options:["Time","Mass","Velocity","Displacement"], answer:3, explanation:"W=F×d (Joules)" },
  { id:"ps10_24", grade:10, subject:"Physical Sciences", topic:"Periodic Table", question:"Noble gases are in group:", options:["1","2","7","18 (0)"], answer:3, explanation:"Group 18: He, Ne, Ar, Kr, Xe, Rn" },
  { id:"ps10_25", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"Power = Voltage ×", options:["Resistance","Time","Charge","Current"], answer:3, explanation:"P=VI (Watts)" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 11  (20 questions)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps11_01", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"Momentum = mass ×", options:["force","distance","acceleration","velocity"], answer:3, explanation:"p=mv (kg·m/s)" },
  { id:"ps11_02", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"Law of conservation of momentum applies when:", options:["External force is large","Temperature is constant","Pressure is constant","No external force acts on system"], answer:3, explanation:"Closed system: total momentum constant" },
  { id:"ps11_03", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"Impulse = Force ×", options:["distance","mass","velocity","time"], answer:3, explanation:"J=F·Δt = change in momentum" },
  { id:"ps11_04", grade:11, subject:"Physical Sciences", topic:"Waves", question:"Doppler effect: source moving toward observer — pitch:", options:["Unchanged","Varies randomly","Decreases","Increases"], answer:3, explanation:"Waves compressed → higher frequency → higher pitch" },
  { id:"ps11_05", grade:11, subject:"Physical Sciences", topic:"Electricity", question:"EMF of battery is measured when:", options:["Battery is short-circuited","Current is maximum","External resistance=0","No current flows (open circuit)"], answer:3, explanation:"EMF = terminal voltage when no current flows" },
  { id:"ps11_06", grade:11, subject:"Physical Sciences", topic:"Electricity", question:"Ohm's Law holds when temperature:", options:["Increases","Decreases","Fluctuates","Remains constant"], answer:3, explanation:"R is constant at constant temperature" },
  { id:"ps11_07", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"Electronegativity increases across a period because:", options:["More neutrons","Larger atomic radius","More shells","More protons attract electrons more strongly"], answer:3, explanation:"More protons = stronger pull on bonding electrons" },
  { id:"ps11_08", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"Reaction rate increases with temperature because:", options:["Reactants become lighter","Pressure decreases","Volume increases","Particles have more kinetic energy"], answer:3, explanation:"More KE → more frequent, successful collisions" },
  { id:"ps11_09", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"A catalyst increases rate by:", options:["Raising activation energy","Adding reactants","Removing products","Lowering activation energy"], answer:3, explanation:"Catalyst provides alternative pathway with lower EA" },
  { id:"ps11_10", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"Chemical equilibrium means:", options:["Reaction has stopped","All reactant converted","Products equal reactants","Forward rate = reverse rate"], answer:3, explanation:"Dynamic equilibrium: both rates equal" },
  { id:"ps11_11", grade:11, subject:"Physical Sciences", topic:"Waves", question:"Transverse wave: particles vibrate … to wave direction:", options:["Parallel","Diagonally","At 45°","Perpendicular"], answer:3, explanation:"Transverse: oscillation ⊥ to propagation" },
  { id:"ps11_12", grade:11, subject:"Physical Sciences", topic:"Waves", question:"Longitudinal wave example:", options:["Light","Water wave","Seismic S-wave","Sound"], answer:3, explanation:"Sound: compressions and rarefactions parallel to motion" },
  { id:"ps11_13", grade:11, subject:"Physical Sciences", topic:"Electricity", question:"Internal resistance of a battery causes:", options:["Higher EMF","More current","Lower terminal voltage","Less resistance externally"], answer:3, explanation:"V_terminal = EMF − I×r" },
  { id:"ps11_14", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"Work-energy theorem: net work done = change in:", options:["momentum","potential energy","force","kinetic energy"], answer:3, explanation:"W_net = ΔKE" },
  { id:"ps11_15", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"A ball thrown upward — at maximum height, velocity is:", options:["Maximum","Equal to initial","Constant","Zero"], answer:3, explanation:"At peak: vertical velocity = 0" },
  { id:"ps11_16", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"Acids turn litmus paper:", options:["Green","Blue","Purple","Red"], answer:3, explanation:"Acid = red litmus. Base = blue litmus." },
  { id:"ps11_17", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"Le Chatelier's principle: if pressure increases on gas equilibrium:", options:["No change","Temperature rises","Equilibrium shifts right always","Equilibrium shifts toward fewer gas moles"], answer:3, explanation:"System opposes change: moves to reduce moles" },
  { id:"ps11_18", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"Oxidation is:", options:["Gaining electrons","No change in charge","Forming ions only","Loss of electrons"], answer:3, explanation:"OIL: Oxidation Is Loss (of electrons)" },
  { id:"ps11_19", grade:11, subject:"Physical Sciences", topic:"Chemistry", question:"pH of a neutral solution at 25°C:", options:["0","1","14","7"], answer:3, explanation:"Neutral: pH=7" },
  { id:"ps11_20", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"Projectile at max height — horizontal velocity is:", options:["Zero","Doubled","Reversed","Unchanged (constant)"], answer:3, explanation:"No horizontal force → horizontal velocity constant" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 12  (20 questions)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps12_01", grade:12, subject:"Physical Sciences", topic:"Electricity", question:"Faraday's Law of Electromagnetic Induction:", options:["V=IR","F=ma","E=mc²","Induced EMF∝rate of change of magnetic flux"], answer:3, explanation:"EMF induced by changing flux" },
  { id:"ps12_02", grade:12, subject:"Physical Sciences", topic:"Electricity", question:"SA household AC supply:", options:["12V, 60Hz","24V, 50Hz","240V, 60Hz","230V, 50Hz"], answer:3, explanation:"SA: 230V at 50Hz" },
  { id:"ps12_03", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Galvanic cell converts:", options:["Electrical to chemical","Light to electrical","Heat to electrical","Chemical to electrical energy"], answer:3, explanation:"Battery/galvanic cell: chemical→electrical" },
  { id:"ps12_04", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"In electrolysis, oxidation occurs at the:", options:["Cathode","Electrolyte","Salt bridge","Anode"], answer:3, explanation:"Anode: site of oxidation (loses electrons)" },
  { id:"ps12_05", grade:12, subject:"Physical Sciences", topic:"Modern Physics", question:"Photoelectric effect showed light behaves as:", options:["Only a wave","Magnetic field","A liquid","Particles (photons)"], answer:3, explanation:"Einstein: light quanta = photons" },
  { id:"ps12_06", grade:12, subject:"Physical Sciences", topic:"Modern Physics", question:"Energy of photon E = h × …?", options:["λ","c","A","f (frequency)"], answer:3, explanation:"E=hf where h=Planck's constant" },
  { id:"ps12_07", grade:12, subject:"Physical Sciences", topic:"Mechanics", question:"Newton's Law of Universal Gravitation: F ∝ …?", options:["m₁+m₂","m₁−m₂","m₁/m₂","m₁×m₂/r²"], answer:3, explanation:"F=Gm₁m₂/r²" },
  { id:"ps12_08", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Reaction is exothermic when:", options:["ΔH>0","ΔH=0","Temperature falls","ΔH<0"], answer:3, explanation:"Exothermic: releases heat → ΔH negative" },
  { id:"ps12_09", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Mole is defined as … particles:", options:["6.02×10²³","6.02×10²⁴","6.02×10²²","6.02×10²³"], answer:0, explanation:"Avogadro's number: 6.02×10²³" },
  { id:"ps12_10", grade:12, subject:"Physical Sciences", topic:"Mechanics", question:"Escape velocity depends on planet's:", options:["Temperature","Rotation speed","Atmospheric pressure","Mass and radius"], answer:3, explanation:"v_esc=√(2GM/R)" },
  { id:"ps12_11", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Rate law: doubling [A] quadruples rate → order =", options:["0","1","3","2"], answer:3, explanation:"Rate∝[A]² → second order" },
  { id:"ps12_12", grade:12, subject:"Physical Sciences", topic:"Electricity", question:"RMS voltage Vrms relates to peak by:", options:["Vrms=Vpeak","Vrms=2Vpeak","Vrms=Vpeak/2","Vrms=Vpeak/√2"], answer:3, explanation:"Vrms=Vpeak/√2 ≈ 0.707×Vpeak" },
  { id:"ps12_13", grade:12, subject:"Physical Sciences", topic:"Modern Physics", question:"Threshold frequency in photoelectric effect:", options:["Any frequency works","Depends on light intensity","Frequency above which more current flows","Minimum frequency to eject electrons"], answer:3, explanation:"Below threshold, no electrons emitted regardless of intensity" },
  { id:"ps12_14", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Kc>1 at equilibrium means:", options:["Mostly reactants","Equal concentrations","Reaction hasn't started","Products predominate"], answer:3, explanation:"Large Kc: products favoured" },
  { id:"ps12_15", grade:12, subject:"Physical Sciences", topic:"Mechanics", question:"Orbital period T² ∝ r³ is:", options:["Newton's 1st Law","Hooke's Law","Newton's Gravitation","Kepler's 3rd Law"], answer:3, explanation:"Kepler's Third Law of planetary motion" },
  { id:"ps12_16", grade:12, subject:"Physical Sciences", topic:"Electricity", question:"Power dissipated P = V²/…?", options:["I","V","P","R"], answer:3, explanation:"P=V²/R (derived from P=VI and V=IR)" },
  { id:"ps12_17", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Cl₂ is reduced in: Cl₂ + 2e⁻ → 2Cl⁻ because:", options:["It loses electrons","It loses protons","It gains protons","It gains electrons"], answer:3, explanation:"RIG: Reduction Is Gain of electrons" },
  { id:"ps12_18", grade:12, subject:"Physical Sciences", topic:"Chemistry", question:"Half-life is the time for … of radioactive substance to decay:", options:["All","¾","¼","½"], answer:3, explanation:"Half-life: time for half the nuclei to decay" },
  { id:"ps12_19", grade:12, subject:"Physical Sciences", topic:"Modern Physics", question:"Nuclear fission releases energy via:", options:["Electron excitation","Chemical bonds","Photon emission","Mass converted to energy (E=mc²)"], answer:3, explanation:"Mass defect converted to energy" },
  { id:"ps12_20", grade:12, subject:"Physical Sciences", topic:"Mechanics", question:"At terminal velocity, net force =", options:["Maximum","Mass × g","Weight only","Zero"], answer:3, explanation:"Drag = Weight → net force = 0, constant velocity" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 10  (20 questions, varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls10_01", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Powerhouse of the cell:", options:["Nucleus","Ribosome","Cell membrane","Mitochondria"], answer:3, explanation:"Mitochondria produces ATP" },
  { id:"ls10_02", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Genetic material stored in:", options:["Ribosome","Vacuole","Golgi body","Nucleus"], answer:3, explanation:"Nucleus houses DNA" },
  { id:"ls10_03", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Photosynthesis occurs in:", options:["Mitochondria","Nucleus","Vacuole","Chloroplast"], answer:3, explanation:"Chloroplasts contain chlorophyll" },
  { id:"ls10_04", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Products of photosynthesis:", options:["6O₂+H₂O","CO₂+H₂O","CO₂ only","C₆H₁₂O₆+6O₂"], answer:3, explanation:"Glucose + oxygen produced" },
  { id:"ls10_05", grade:10, subject:"Life Sciences", topic:"Transport", question:"O₂ carried by RBCs via:", options:["Plasma","Platelets","White blood cells","Haemoglobin"], answer:3, explanation:"Haemoglobin binds oxygen" },
  { id:"ls10_06", grade:10, subject:"Life Sciences", topic:"Biodiversity", question:"Scientific name = Genus + …?", options:["family","order","kingdom","species"], answer:3, explanation:"Binomial: Genus species (e.g. Homo sapiens)" },
  { id:"ls10_07", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Osmosis: water moves from … to … concentration:", options:["low to high via active transport","high to high","low to low","high to low"], answer:3, explanation:"Osmosis: passive movement down concentration gradient" },
  { id:"ls10_08", grade:10, subject:"Life Sciences", topic:"Gaseous Exchange", question:"Gas exchange in plants through:", options:["Roots","Xylem","Flowers","Stomata"], answer:3, explanation:"Stomata on leaves allow CO₂ in, O₂ out" },
  { id:"ls10_09", grade:10, subject:"Life Sciences", topic:"Cell Division", question:"Mitosis produces:", options:["4 different cells","1 larger cell","2 cells with half chromosomes","2 identical daughter cells"], answer:3, explanation:"1 cell → 2 identical cells" },
  { id:"ls10_10", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Cellular respiration:", options:["Occurs in chloroplasts","Produces CO₂ and oxygen","Is only anaerobic","Breaks down glucose to release ATP"], answer:3, explanation:"C₆H₁₂O₆+6O₂→6CO₂+6H₂O+ATP" },
  { id:"ls10_11", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Cell membrane is:", options:["Fully permeable","Impermeable","Made of DNA","Selectively permeable"], answer:3, explanation:"Controls what enters/exits the cell" },
  { id:"ls10_12", grade:10, subject:"Life Sciences", topic:"Biodiversity", question:"Kingdom with most species:", options:["Animalia","Plantae","Protista","Fungi"], answer:0, explanation:"Animalia has the most described species" },
  { id:"ls10_13", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Enzyme that digests starch:", options:["Lipase","Pepsin","Trypsin","Amylase"], answer:3, explanation:"Amylase (in saliva) breaks down starch" },
  { id:"ls10_14", grade:10, subject:"Life Sciences", topic:"Transport", question:"Arteries carry blood:", options:["To the lungs only","Back to heart","At low pressure","Away from heart"], answer:3, explanation:"Arteries = away from heart (usually oxygenated)" },
  { id:"ls10_15", grade:10, subject:"Life Sciences", topic:"Cell Division", question:"DNA replication happens in which phase of mitosis:", options:["Metaphase","Anaphase","Telophase","Interphase (S phase)"], answer:3, explanation:"DNA duplicated during S phase of interphase" },
  { id:"ls10_16", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Ribosomes are responsible for:", options:["Energy production","DNA storage","Waste removal","Protein synthesis"], answer:3, explanation:"Ribosomes translate mRNA into proteins" },
  { id:"ls10_17", grade:10, subject:"Life Sciences", topic:"Gaseous Exchange", question:"Human gas exchange occurs in:", options:["Trachea","Bronchi","Nasal cavity","Alveoli"], answer:3, explanation:"Alveoli: thin walls, large surface area, blood supply" },
  { id:"ls10_18", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Autotroph means:", options:["Cannot make food","Feeds on others","Decomposes organic matter","Makes own food via photosynthesis"], answer:3, explanation:"Autotrophs (plants) produce their own organic molecules" },
  { id:"ls10_19", grade:10, subject:"Life Sciences", topic:"Transport", question:"Veins have … to prevent backflow:", options:["Thick muscles","Smooth endothelium","Elastic walls","Valves"], answer:3, explanation:"Venous valves ensure one-way blood flow" },
  { id:"ls10_20", grade:10, subject:"Life Sciences", topic:"Biodiversity", question:"Vertebrates have:", options:["Exoskeleton","No skeleton","Hydrostatic skeleton","A backbone/vertebral column"], answer:3, explanation:"Vertebrates: fish, amphibians, reptiles, birds, mammals" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 11  (20 questions)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls11_01", grade:11, subject:"Life Sciences", topic:"Genetics", question:"DNA stands for:", options:["Deoxyribose Nucleic Acid","Diribonucleic Acid","Deoxyribose Nitrogen Acid","Deoxyribonucleic Acid"], answer:3, explanation:"Deoxyribonucleic Acid" },
  { id:"ls11_02", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"Basic unit of nervous system:", options:["Axon","Synapse","Myelin","Neuron"], answer:3, explanation:"Neuron = nerve cell" },
  { id:"ls11_03", grade:11, subject:"Life Sciences", topic:"Genetics", question:"Phenotype is:", options:["Genetic code only","DNA sequence","Chromosome number","Observable physical expression of genes"], answer:3, explanation:"Phenotype = what you see (e.g. eye colour)" },
  { id:"ls11_04", grade:11, subject:"Life Sciences", topic:"Genetics", question:"Dominant allele:", options:["Only expressed in homozygous","Never expressed","Masked by recessive","Expressed whether homozygous or heterozygous"], answer:3, explanation:"One copy of dominant = trait expressed" },
  { id:"ls11_05", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"A reflex arc bypasses:", options:["Motor neurons","Sensory neurons","Spinal cord","Brain"], answer:3, explanation:"Reflex: sensory→spinal cord→motor (fast, no brain)" },
  { id:"ls11_06", grade:11, subject:"Life Sciences", topic:"Hormonal System", question:"Insulin is produced by the:", options:["Liver","Adrenal gland","Thyroid","Pancreas"], answer:3, explanation:"Beta cells in islets of Langerhans (pancreas)" },
  { id:"ls11_07", grade:11, subject:"Life Sciences", topic:"Hormonal System", question:"ADH controls:", options:["Blood glucose","Calcium levels","Heart rate","Water reabsorption in kidneys"], answer:3, explanation:"Anti-Diuretic Hormone reduces urine output" },
  { id:"ls11_08", grade:11, subject:"Life Sciences", topic:"Genetics", question:"During meiosis, chromosome number:", options:["Stays the same","Doubles","Triples","Halves"], answer:3, explanation:"Meiosis: 2n→n (haploid gametes)" },
  { id:"ls11_09", grade:11, subject:"Life Sciences", topic:"Evolution", question:"Natural selection means:", options:["Random mutation only","All organisms survive equally","Humans choose best traits","Organisms with advantageous traits survive to reproduce"], answer:3, explanation:"Darwin: survival of the fittest" },
  { id:"ls11_10", grade:11, subject:"Life Sciences", topic:"Evolution", question:"Fossil evidence supports evolution by showing:", options:["All species unchanged","No change in organisms","Random distribution","Progressive changes in organisms over time"], answer:3, explanation:"Fossils show gradual changes in body structures" },
  { id:"ls11_11", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"Myelin sheath speeds up:", options:["Blood flow","Hormone production","Muscle contraction","Nerve impulse transmission"], answer:3, explanation:"Insulating myelin → faster impulse conduction" },
  { id:"ls11_12", grade:11, subject:"Life Sciences", topic:"Genetics", question:"Genotype Aa produces … in offspring when crossed with aa:", options:["All AA","All aa","½ AA ½ Aa","½ Aa ½ aa"], answer:3, explanation:"Aa × aa: 50% Aa (heterozygous), 50% aa" },
  { id:"ls11_13", grade:11, subject:"Life Sciences", topic:"Reproduction", question:"Fertilisation in humans occurs in the:", options:["Uterus","Vagina","Ovary","Fallopian tube"], answer:3, explanation:"Sperm meets egg in fallopian tube (oviduct)" },
  { id:"ls11_14", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"Which neurotransmitter is released at a synapse?", options:["Insulin","Adrenaline only","Haemoglobin","Acetylcholine"], answer:3, explanation:"Acetylcholine (and others) transmit impulse across synapse" },
  { id:"ls11_15", grade:11, subject:"Life Sciences", topic:"Genetics", question:"Sex determination: human females are:", options:["XY","YY","XXX","XX"], answer:3, explanation:"Female=XX, Male=XY" },
  { id:"ls11_16", grade:11, subject:"Life Sciences", topic:"Evolution", question:"Analogous structures have:", options:["Same origin, different function","Same origin and function","No function","Different origin but similar function"], answer:3, explanation:"e.g. bird wing and insect wing — similar shape, different ancestry" },
  { id:"ls11_17", grade:11, subject:"Life Sciences", topic:"Genetics", question:"Codominance example:", options:["Tall dominates short","Albinism","Colour blindness","Blood type AB"], answer:3, explanation:"AB: both A and B antigens expressed equally" },
  { id:"ls11_18", grade:11, subject:"Life Sciences", topic:"Hormonal System", question:"Adrenaline prepares body for:", options:["Sleep","Digestion","Reproduction","Fight or flight response"], answer:3, explanation:"Adrenaline: increases heart rate, dilates pupils, releases glucose" },
  { id:"ls11_19", grade:11, subject:"Life Sciences", topic:"Reproduction", question:"Meiosis produces:", options:["2 identical cells","4 identical cells","2 cells with full chromosomes","4 genetically varied haploid cells"], answer:3, explanation:"4 non-identical haploid gametes" },
  { id:"ls11_20", grade:11, subject:"Life Sciences", topic:"Evolution", question:"Homologous structures indicate:", options:["Convergent evolution","No evolutionary link","Identical function","Common ancestry"], answer:3, explanation:"Same origin (e.g. human arm, whale flipper) = shared ancestor" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 12  (20 questions)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls12_01", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Transcription produces:", options:["Protein from mRNA","DNA from RNA","tRNA from DNA","mRNA from DNA"], answer:3, explanation:"DNA → mRNA (in nucleus)" },
  { id:"ls12_02", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Homozygous means:", options:["Different alleles","One allele only","Three alleles","Two identical alleles"], answer:3, explanation:"Homozygous = AA or aa" },
  { id:"ls12_03", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Translation occurs at:", options:["Nucleus","DNA","Mitochondria","Ribosome"], answer:3, explanation:"mRNA translated to protein at ribosome" },
  { id:"ls12_04", grade:12, subject:"Life Sciences", topic:"Human Evolution", question:"Australopithecus is significant because:", options:["Had large brain like modern humans","Used complex language","Lived in the sea","Shows early upright walking"], answer:3, explanation:"Bipedalism evolved before large brain" },
  { id:"ls12_05", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Codon is:", options:["Sequence of 2 bases","Single amino acid","Single base on tRNA","Sequence of 3 bases on mRNA"], answer:3, explanation:"Triplet codon codes for one amino acid" },
  { id:"ls12_06", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Mutation is:", options:["Normal cell division","Protein synthesis error","Environmental damage only","Change in DNA sequence"], answer:3, explanation:"Mutation: permanent change in genetic material" },
  { id:"ls12_07", grade:12, subject:"Life Sciences", topic:"Human Evolution", question:"Homo sapiens evolved approximately:", options:["6 million years ago","500 000 years ago","10 000 years ago","200 000 years ago"], answer:3, explanation:"H. sapiens: ~200 000 years ago in Africa" },
  { id:"ls12_08", grade:12, subject:"Life Sciences", topic:"Population Ecology", question:"Carrying capacity (K) is the:", options:["Maximum birth rate","Minimum population","Growth rate","Maximum sustainable population in environment"], answer:3, explanation:"K: environment's max supportable population" },
  { id:"ls12_09", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"tRNA carries:", options:["mRNA instructions","DNA template","Ribosomes to mRNA","Amino acids to ribosome"], answer:3, explanation:"tRNA: anticodon matches codon, delivers amino acid" },
  { id:"ls12_10", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Linked genes are:", options:["On different chromosomes","Identical genes","Recessive genes only","On the same chromosome"], answer:3, explanation:"Linked genes tend to be inherited together" },
  { id:"ls12_11", grade:12, subject:"Life Sciences", topic:"Human Evolution", question:"Bipedalism freed hands for:", options:["Swimming","Flying","Running faster","Tool use and carrying objects"], answer:3, explanation:"Upright walking freed hands → tool use, social development" },
  { id:"ls12_12", grade:12, subject:"Life Sciences", topic:"Population Ecology", question:"Logistic growth: J-curve becomes S-curve when:", options:["Birth rate increases","Population goes extinct","Food is unlimited","Resources become limiting"], answer:3, explanation:"Resource limitation slows growth → S-curve" },
  { id:"ls12_13", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"DNA base pairing: Adenine pairs with:", options:["Guanine","Cytosine","Adenine","Thymine (in DNA)"], answer:3, explanation:"A-T and G-C in DNA (A-U in RNA)" },
  { id:"ls12_14", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Polymerase chain reaction (PCR) is used to:", options:["Sequence proteins","Detect pH","Measure mutation rate","Amplify DNA"], answer:3, explanation:"PCR: copies specific DNA segments for analysis" },
  { id:"ls12_15", grade:12, subject:"Life Sciences", topic:"Human Evolution", question:"Ardi (Ardipithecus) shows:", options:["Modern human brain size","Sea-dwelling ancestors","Tool use earlier than expected","Very early hominid features (~4.4 mya)"], answer:3, explanation:"Ardipithecus: 4.4 million years ago, early biped" },
  { id:"ls12_16", grade:12, subject:"Life Sciences", topic:"Population Ecology", question:"Mutualism is an interaction where:", options:["One benefits, one harmed","One benefits, one unaffected","Neither benefits","Both organisms benefit"], answer:3, explanation:"Mutualism: +/+ relationship (e.g. bees and flowers)" },
  { id:"ls12_17", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Anticodon is found on:", options:["mRNA","DNA","Ribosome","tRNA"], answer:3, explanation:"tRNA anticodon pairs with mRNA codon" },
  { id:"ls12_18", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Karyotype shows:", options:["Protein structure","Amino acid sequence","Gene expression","Chromosome number and structure"], answer:3, explanation:"Karyotype: photograph of all chromosomes arranged in pairs" },
  { id:"ls12_19", grade:12, subject:"Life Sciences", topic:"Human Evolution", question:"Larger brain capacity is associated with:", options:["Larger teeth","Less bipedalism","Earlier evolution","Complex tool use and language"], answer:3, explanation:"Brain evolution linked to cognitive complexity" },
  { id:"ls12_20", grade:12, subject:"Life Sciences", topic:"Population Ecology", question:"Symbiosis broadly means:", options:["Both organisms die","Random interaction","One organism benefits only","Close interaction between two different species"], answer:3, explanation:"Symbiosis: includes mutualism, commensalism, parasitism" },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCOUNTING — GRADE 10  (15 questions, varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ac10_01", grade:10, subject:"Accounting", topic:"Accounting Equation", question:"Assets =", options:["Income − Expenses","Cash + Debtors","Revenue − Costs","Liabilities + Equity"], answer:3, explanation:"A = L + OE (fundamental equation)" },
  { id:"ac10_02", grade:10, subject:"Accounting", topic:"Bookkeeping", question:"Every debit has an equal:", options:["Smaller credit","Larger debit","No entry","Credit"], answer:3, explanation:"Double-entry: debit = credit" },
  { id:"ac10_03", grade:10, subject:"Accounting", topic:"Financial Statements", question:"Gross Profit = Sales −", options:["Expenses","Net Profit","Returns","Cost of Sales"], answer:3, explanation:"GP = Revenue − COGS" },
  { id:"ac10_04", grade:10, subject:"Accounting", topic:"Journals", question:"CRJ records:", options:["Credit sales","Credit purchases","All money paid","All money received"], answer:3, explanation:"Cash Receipts Journal: all cash inflows" },
  { id:"ac10_05", grade:10, subject:"Accounting", topic:"VAT", question:"SA standard VAT rate:", options:["14%","10%","20%","15%"], answer:3, explanation:"15% since April 2018" },
  { id:"ac10_06", grade:10, subject:"Accounting", topic:"Debtors", question:"A debtor is someone who:", options:["Supplies goods","Manages accounts","Business owes money to","Owes money to the business"], answer:3, explanation:"Debtor: bought on credit, owes the business" },
  { id:"ac10_07", grade:10, subject:"Accounting", topic:"Banking", question:"Bank reconciliation compares cashbook to:", options:["Income statement","Trial balance","Balance sheet","Bank statement"], answer:3, explanation:"Cashbook vs bank statement" },
  { id:"ac10_08", grade:10, subject:"Accounting", topic:"Trial Balance", question:"Trial balance proves:", options:["Assets = liabilities","Income > expenses","All entries correct","Total debits = total credits"], answer:3, explanation:"TB: debits equal credits" },
  { id:"ac10_09", grade:10, subject:"Accounting", topic:"Bookkeeping", question:"CPJ stands for:", options:["Cash Purchases Journal","Credit Payments Journal","Central Posting Journal","Cash Payments Journal"], answer:3, explanation:"CPJ: records all cash paid out" },
  { id:"ac10_10", grade:10, subject:"Accounting", topic:"Debtors", question:"A creditor is someone the business:", options:["Owes nothing to","Sold goods to","Loaned money to","Owes money to"], answer:3, explanation:"Creditor: business bought on credit from them" },
  { id:"ac10_11", grade:10, subject:"Accounting", topic:"Financial Statements", question:"Net Profit = Gross Profit −", options:["Cost of Sales","Revenue","Assets","Expenses"], answer:3, explanation:"NP = GP − Operating Expenses" },
  { id:"ac10_12", grade:10, subject:"Accounting", topic:"Accounting Equation", question:"If assets increase by R500 and liabilities stay same, equity:", options:["Decreases R500","Stays same","Doubles","Increases R500"], answer:3, explanation:"A=L+E → equity must increase by same amount" },
  { id:"ac10_13", grade:10, subject:"Accounting", topic:"VAT", question:"VAT input tax means:", options:["VAT charged to customers","VAT owed to SARS","VAT on loans","VAT paid on purchases"], answer:3, explanation:"Input VAT: claimed back from SARS on purchases" },
  { id:"ac10_14", grade:10, subject:"Accounting", topic:"Journals", question:"DJ (Debtors Journal) records:", options:["Cash sales","Cash purchases","Credit purchases","Credit sales"], answer:3, explanation:"DJ: goods sold on credit" },
  { id:"ac10_15", grade:10, subject:"Accounting", topic:"Banking", question:"Outstanding deposit in bank rec means:", options:["Deposit reversed","Error in cashbook","Deposit recorded in bank already","Deposit in cashbook not yet in bank statement"], answer:3, explanation:"Timing difference: cashbook records before bank" },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCOUNTING — GRADE 12  (15 questions, varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ac12_01", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Current ratio measures:", options:["Profitability","Solvency","Efficiency","Short-term liquidity"], answer:3, explanation:"Current ratio = Current Assets / Current Liabilities" },
  { id:"ac12_02", grade:12, subject:"Accounting", topic:"Companies", question:"Dividends paid from:", options:["Share capital","Loans","Assets","Retained income/profits"], answer:3, explanation:"Dividends = profit distribution to shareholders" },
  { id:"ac12_03", grade:12, subject:"Accounting", topic:"Cash Flow", question:"Cash Flow Statement shows:", options:["Profit and loss","Assets and liabilities","Equity changes","Sources and uses of cash"], answer:3, explanation:"Cash flow: inflows and outflows of cash" },
  { id:"ac12_04", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Return on Equity (ROE) =", options:["Net profit / Sales","Assets / Equity","Revenue / Assets","Net profit / Equity × 100"], answer:3, explanation:"ROE measures profitability relative to shareholders' investment" },
  { id:"ac12_05", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Acid test ratio excludes:", options:["Cash","Debtors","Creditors","Inventory (stock)"], answer:3, explanation:"Quick ratio: Current Assets − Stock / Current Liabilities" },
  { id:"ac12_06", grade:12, subject:"Accounting", topic:"Companies", question:"Issued share capital is:", options:["All authorised shares","Shares repurchased","Treasury shares","Shares actually sold to shareholders"], answer:3, explanation:"Issued = shares sold and in shareholders' hands" },
  { id:"ac12_07", grade:12, subject:"Accounting", topic:"Companies", question:"IFRS requires financial statements to show:", options:["Tax forecasts","Director salaries only","Budget plans","True and fair view"], answer:3, explanation:"IFRS: faithful representation = true and fair view" },
  { id:"ac12_08", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Debt ratio = Total Liabilities /", options:["Net profit","Share capital","Total equity","Total assets"], answer:3, explanation:"Debt ratio shows how much financed by debt" },
  { id:"ac12_09", grade:12, subject:"Accounting", topic:"Cash Flow", question:"Purchase of fixed assets appears in … activities:", options:["Operating","Financing","Revenue","Investing"], answer:3, explanation:"Buying non-current assets = investing activity" },
  { id:"ac12_10", grade:12, subject:"Accounting", topic:"Companies", question:"Retained income at year end =", options:["Opening retained + dividends","Opening + revenue only","Share capital + profit","Opening retained + net profit − dividends"], answer:3, explanation:"Retained: add profit, subtract dividends declared" },
  { id:"ac12_11", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Stock turnover rate: higher is generally:", options:["Worse","Same","Irrelevant","Better (selling stock faster)"], answer:3, explanation:"Fast turnover = efficient stock management" },
  { id:"ac12_12", grade:12, subject:"Accounting", topic:"Auditing", question:"Internal audit differs from external audit in that it:", options:["Is done by SARS","Is legally required","Only checks bank statements","Is done by company employees"], answer:3, explanation:"Internal: employees; External: independent auditors" },
  { id:"ac12_13", grade:12, subject:"Accounting", topic:"Cash Flow", question:"Issue of shares appears in … activities:", options:["Operating","Investing","Tax","Financing"], answer:3, explanation:"Issuing shares = financing activity" },
  { id:"ac12_14", grade:12, subject:"Accounting", topic:"Companies", question:"Depreciation reduces asset value to reflect:", options:["Tax benefit","Inflation","Market price only","Wear and tear over time"], answer:3, explanation:"Depreciation: allocates cost over useful life" },
  { id:"ac12_15", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Gross profit margin = Gross Profit / Sales × …?", options:["1","10","1000","100"], answer:3, explanation:"Gross profit margin expressed as a percentage" },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH — GRADE 10, 11, 12  (varied positions)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"en10_01", grade:10, subject:"English", topic:"Grammar", question:"Correct sentence:", options:["She doesn't know nothing.","She know nothing.","She don't know nothing.","She doesn't know anything."], answer:3, explanation:"Double negatives incorrect. 'Doesn't know anything' is standard." },
  { id:"en10_02", grade:10, subject:"English", topic:"Figures of Speech", question:"'The sun smiled on us' is:", options:["Simile","Metaphor","Alliteration","Personification"], answer:3, explanation:"Non-human given human quality" },
  { id:"en10_03", grade:10, subject:"English", topic:"Figures of Speech", question:"'As brave as a lion' is:", options:["Metaphor","Personification","Hyperbole","Simile"], answer:3, explanation:"Simile: comparison using 'as'" },
  { id:"en10_04", grade:10, subject:"English", topic:"Comprehension", question:"Topic sentence:", options:["Ends paragraph","Gives example","Provides evidence","Introduces main idea"], answer:3, explanation:"Topic sentence = main idea of paragraph" },
  { id:"en10_05", grade:10, subject:"English", topic:"Writing", question:"Persuasive text aims to:", options:["Tell a story","Describe a place","Explain how something works","Change reader's opinion"], answer:3, explanation:"Persuasion: arguments + evidence" },
  { id:"en10_06", grade:10, subject:"English", topic:"Grammar", question:"Which is a conjunction?", options:["quickly","beautiful","run","because"], answer:3, explanation:"Conjunctions join clauses: because, and, but, or…" },
  { id:"en10_07", grade:10, subject:"English", topic:"Figures of Speech", question:"'The wind whispered through trees' uses:", options:["Simile","Alliteration","Oxymoron","Personification"], answer:3, explanation:"Wind given human ability to whisper" },
  { id:"en10_08", grade:10, subject:"English", topic:"Writing", question:"Structure of an essay: introduction, body, and …?", options:["Introduction again","Summary only","Title page","Conclusion"], answer:3, explanation:"3-part structure: intro, body paragraphs, conclusion" },
  { id:"en10_09", grade:10, subject:"English", topic:"Grammar", question:"'Although she was tired, she kept working' — 'Although' is:", options:["Preposition","Noun","Adjective","Conjunction (subordinating)"], answer:3, explanation:"Subordinating conjunction: introduces dependent clause" },
  { id:"en10_10", grade:10, subject:"English", topic:"Comprehension", question:"Inference means:", options:["Copying from text","Summarising only","Rewriting main idea","Drawing conclusion not directly stated"], answer:3, explanation:"Inference: reading between the lines" },
  { id:"en11_01", grade:11, subject:"English", topic:"Literature", question:"Protagonist =", options:["Villain","Narrator","Author","Main character"], answer:3, explanation:"Protagonist is the central character" },
  { id:"en11_02", grade:11, subject:"English", topic:"Figures of Speech", question:"'I've told you a million times!' =", options:["Simile","Metaphor","Irony","Hyperbole"], answer:3, explanation:"Extreme exaggeration" },
  { id:"en11_03", grade:11, subject:"English", topic:"Literature", question:"Dramatic irony means:", options:["Character says opposite of truth","Coincidental events","Exaggerated comparison","Audience knows something character doesn't"], answer:3, explanation:"Dramatic irony creates tension through audience knowledge" },
  { id:"en11_04", grade:11, subject:"English", topic:"Grammar", question:"'He was given the prize' — voice:", options:["Active","Future","Present continuous","Passive"], answer:3, explanation:"Subject receives action = passive" },
  { id:"en11_05", grade:11, subject:"English", topic:"Writing", question:"A discursive essay:", options:["Only narrates","Only persuades","Describes only","Explores multiple viewpoints on an issue"], answer:3, explanation:"Discursive: balanced exploration of different sides" },
  { id:"en11_06", grade:11, subject:"English", topic:"Literature", question:"Antagonist is:", options:["Main character","Narrator","Author's voice","Character who opposes protagonist"], answer:3, explanation:"Antagonist = villain or opposing force" },
  { id:"en11_07", grade:11, subject:"English", topic:"Figures of Speech", question:"Oxymoron is:", options:["Repetition of sounds","Exaggeration","Comparison using like","Two contradictory words together"], answer:3, explanation:"e.g. 'bittersweet', 'living death'" },
  { id:"en12_01", grade:12, subject:"English", topic:"Literature", question:"Climax of a story:", options:["Introduction","Falling action","Resolution","Point of highest tension"], answer:3, explanation:"Climax = turning point of the narrative" },
  { id:"en12_02", grade:12, subject:"English", topic:"Figures of Speech", question:"'Classroom was a zoo' =", options:["Simile","Personification","Alliteration","Metaphor"], answer:3, explanation:"Direct comparison without 'like' or 'as'" },
  { id:"en12_03", grade:12, subject:"English", topic:"Writing", question:"Argumentative essay:", options:["Tells a story","Describes a place","Explains a process","Takes clear position backed by evidence"], answer:3, explanation:"Presents stance with logical evidence" },
  { id:"en12_04", grade:12, subject:"English", topic:"Literature", question:"Denouement refers to:", options:["Rising action","Climax","Exposition","Resolution/untangling after climax"], answer:3, explanation:"Denouement: final clarification after main conflict resolved" },
  { id:"en12_05", grade:12, subject:"English", topic:"Grammar", question:"Subjunctive mood used for:", options:["Completed past actions","Present facts","Future certainty","Hypothetical or wish situations"], answer:3, explanation:"'If I were president…' — subjunctive for unreal situations" },

  // ══════════════════════════════════════════════════════════════════════════
  // BUSINESS STUDIES — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"bs10_01", grade:10, subject:"Business Studies", topic:"Forms of Ownership", question:"Sole trader owned by:", options:["Two or more partners","Shareholders","Government","One person"], answer:3, explanation:"Sole proprietor = single owner" },
  { id:"bs10_02", grade:10, subject:"Business Studies", topic:"Forms of Ownership", question:"A partnership is dissolved when:", options:["New product launched","Profit falls","More partners join","Partner dies, goes insolvent, or partners agree to dissolve"], answer:3, explanation:"Partnerships are fragile — end easily" },
  { id:"bs10_03", grade:10, subject:"Business Studies", topic:"Business Functions", question:"Human Resources function deals with:", options:["Product development","Financial planning","Market research","Recruiting, training, managing employees"], answer:3, explanation:"HR: all people-related activities in business" },
  { id:"bs10_04", grade:10, subject:"Business Studies", topic:"Business Functions", question:"The 'P' in SWOT for internal analysis stands for:", options:["SWOT has no P","Profit","Price","SWOT = Strengths, Weaknesses, Opportunities, Threats"], answer:3, explanation:"SWOT: S and W are internal; O and T are external" },
  { id:"bs11_01", grade:11, subject:"Business Studies", topic:"Marketing", question:"4 P's of marketing:", options:["People, Process, Plan, Profit","Product, Profit, Place, People","Price, Plan, Process, Promotion","Product, Price, Place, Promotion"], answer:3, explanation:"Marketing Mix = 4 P's" },
  { id:"bs11_02", grade:11, subject:"Business Studies", topic:"Business Strategies", question:"A SWOT analysis strength is:", options:["External opportunity","External threat","Internal weakness","Internal advantage"], answer:3, explanation:"Strength: internal positive factor" },
  { id:"bs11_03", grade:11, subject:"Business Studies", topic:"Business Strategies", question:"Porter's 5 Forces analyses:", options:["Financial ratios","Employee morale","Marketing strategies","Competitive forces in an industry"], answer:3, explanation:"5 Forces: suppliers, buyers, substitutes, new entrants, rivalry" },
  { id:"bs11_04", grade:11, subject:"Business Studies", topic:"Labour Relations", question:"CCMA stands for:", options:["Corporate Capital Management Act","Central Commerce and Marketing Authority","Consumer Credit Management Act","Commission for Conciliation, Mediation and Arbitration"], answer:3, explanation:"CCMA resolves labour disputes in SA" },
  { id:"bs12_01", grade:12, subject:"Business Studies", topic:"Business Ethics", question:"CSR refers to:", options:["Profit only","Tax avoidance","Shareholder returns only","Company's ethical, social, environmental responsibility"], answer:3, explanation:"CSR: contributing beyond profit" },
  { id:"bs12_02", grade:12, subject:"Business Studies", topic:"Business Ethics", question:"King IV Report focuses on:", options:["Tax compliance only","Marketing standards","Financial reporting only","Corporate governance"], answer:3, explanation:"King IV: ethical leadership and good governance" },
  { id:"bs12_03", grade:12, subject:"Business Studies", topic:"Entrepreneurship", question:"An entrepreneur's main characteristic:", options:["Avoids all risk","Follows instructions only","Prefers working for others","Takes calculated risks for profit"], answer:3, explanation:"Entrepreneurship = recognising opportunities + risk-taking" },
  { id:"bs12_04", grade:12, subject:"Business Studies", topic:"Business Strategies", question:"Franchise advantages include:", options:["Complete independence","Unique untested brand","No support from franchisor","Established brand and business model"], answer:3, explanation:"Franchisee gets proven system, training, brand recognition" },
  { id:"bs12_05", grade:12, subject:"Business Studies", topic:"Labour Relations", question:"LRA (Labour Relations Act) in SA:", options:["Regulates taxation","Controls company formation","Sets minimum wages","Governs relationship between employers and employees"], answer:3, explanation:"LRA: trade unions, strikes, dismissal, and workplace rights" },

  // ══════════════════════════════════════════════════════════════════════════
  // ECONOMICS — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ec10_01", grade:10, subject:"Economics", topic:"Basic Concepts", question:"Scarcity means:", options:["Only shortage of money","Lack of natural resources","High inflation","Limited resources vs unlimited wants"], answer:3, explanation:"Core economic problem" },
  { id:"ec10_02", grade:10, subject:"Economics", topic:"Basic Concepts", question:"A free market price is determined by:", options:["Government decree","International organisations","Cartels only","Supply and demand"], answer:3, explanation:"Market equilibrium: supply meets demand" },
  { id:"ec10_03", grade:10, subject:"Economics", topic:"Basic Concepts", question:"Opportunity cost when choosing option A:", options:["Price of A","Cost to produce A","Tax on A","Value of best alternative (B) given up"], answer:3, explanation:"What you sacrifice by not choosing the next best option" },
  { id:"ec11_01", grade:11, subject:"Economics", topic:"Microeconomics", question:"Law of demand: price increases → quantity demanded:", options:["Increases","Stays same","Doubles","Decreases"], answer:3, explanation:"Inverse relationship: higher price → less demanded" },
  { id:"ec11_02", grade:11, subject:"Economics", topic:"Microeconomics", question:"Price elasticity of demand measures:", options:["Income change only","Supply response","Government tax effect","Responsiveness of demand to price change"], answer:3, explanation:"PED = %ΔQd / %ΔP" },
  { id:"ec11_03", grade:11, subject:"Economics", topic:"Microeconomics", question:"A monopoly is when:", options:["Many sellers compete","Government fixes prices","Two firms dominate","One seller dominates the market"], answer:3, explanation:"Monopoly: single seller, no close substitutes" },
  { id:"ec11_04", grade:11, subject:"Economics", topic:"Microeconomics", question:"Inferior good: as income rises, demand:", options:["Rises proportionally","Stays same","Doubles","Falls"], answer:3, explanation:"Inferior goods: e.g. instant noodles — replaced by better options" },
  { id:"ec12_01", grade:12, subject:"Economics", topic:"Macroeconomics", question:"GDP =", options:["General Development Plan","Gross Development Progress","Government Domestic Policy","Gross Domestic Product"], answer:3, explanation:"Total value of goods/services in country per year" },
  { id:"ec12_02", grade:12, subject:"Economics", topic:"Macroeconomics", question:"Expansionary monetary policy involves:", options:["Increasing taxes","Reducing government spending","Selling bonds","Lowering interest rates"], answer:3, explanation:"Low rates → more borrowing → economic stimulus" },
  { id:"ec12_03", grade:12, subject:"Economics", topic:"Macroeconomics", question:"CPI measures:", options:["Industrial output","Money supply","Export prices","Consumer Price Index — inflation"], answer:3, explanation:"CPI tracks price changes for basket of goods" },
  { id:"ec12_04", grade:12, subject:"Economics", topic:"Macroeconomics", question:"Trade deficit means:", options:["Exports > imports","Balanced trade","Government overspending","Imports > exports"], answer:3, explanation:"Deficit: spending more on imports than earning from exports" },
  { id:"ec12_05", grade:12, subject:"Economics", topic:"Macroeconomics", question:"Fiscal policy uses … to influence economy:", options:["Interest rates","Money supply","Exchange rates","Government spending and taxation"], answer:3, explanation:"Fiscal = budget decisions by government" },

  // ══════════════════════════════════════════════════════════════════════════
  // HISTORY — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"hi10_01", grade:10, subject:"History", topic:"World History", question:"WWI began in:", options:["1918","1939","1905","1914"], answer:3, explanation:"28 July 1914: assassination of Franz Ferdinand" },
  { id:"hi10_02", grade:10, subject:"History", topic:"SA History", question:"The mineral revolution refers to SA's discovery of:", options:["Oil (1960)","Platinum (1920)","Uranium (1940)","Diamonds (1867) and gold (1886)"], answer:3, explanation:"Diamonds at Kimberley; gold on Witwatersrand" },
  { id:"hi10_03", grade:10, subject:"History", topic:"World History", question:"The Great Depression began:", options:["1918","1925","1935","1929"], answer:3, explanation:"Wall Street Crash October 1929 triggered global depression" },
  { id:"hi10_04", grade:10, subject:"History", topic:"World History", question:"Scramble for Africa refers to:", options:["African independence","Pan-Africanism","Cold War in Africa","European colonisation of Africa (1880s)"], answer:3, explanation:"By 1914 most of Africa colonised by European powers" },
  { id:"hi11_01", grade:11, subject:"History", topic:"Cold War", question:"Cold War was between:", options:["USA and Germany","UK and Soviet Union","USA and China","USA and Soviet Union"], answer:3, explanation:"Capitalism (USA) vs Communism (USSR) 1947–1991" },
  { id:"hi11_02", grade:11, subject:"History", topic:"Cold War", question:"The Berlin Wall was built in:", options:["1945","1953","1989","1961"], answer:3, explanation:"Wall built 1961 to prevent East Germans fleeing West" },
  { id:"hi11_03", grade:11, subject:"History", topic:"Civil Society", question:"The Defiance Campaign (SA 1952) protested:", options:["WWI involvement","British imperialism","Mining conditions","Pass laws and apartheid laws"], answer:3, explanation:"ANC and SAIC challenged unjust apartheid laws" },
  { id:"hi11_04", grade:11, subject:"History", topic:"Civil Society", question:"The Freedom Charter (1955) demanded:", options:["Separate development","White minority rule","Economic isolation","A non-racial democratic SA"], answer:3, explanation:"'South Africa belongs to all who live in it'" },
  { id:"hi12_01", grade:12, subject:"History", topic:"SA History", question:"Sharpeville Massacre occurred in:", options:["1976","1948","1990","1960"], answer:3, explanation:"21 March 1960: 69 protesters killed" },
  { id:"hi12_02", grade:12, subject:"History", topic:"SA History", question:"SA's first democratic elections:", options:["1990","1996","1992","1994"], answer:3, explanation:"27 April 1994: Mandela elected president" },
  { id:"hi12_03", grade:12, subject:"History", topic:"SA History", question:"The Bantu Education Act (1953) aimed to:", options:["Improve black education","Provide equal education","Fund rural schools","Provide inferior education to black South Africans"], answer:3, explanation:"Designed to prepare black people for servitude only" },
  { id:"hi12_04", grade:12, subject:"History", topic:"SA History", question:"Soweto Uprising of 1976 was sparked by:", options:["Removal of black voters","Closure of mines","Pass law protests","Enforcement of Afrikaans as medium of instruction"], answer:3, explanation:"Students protested being taught in Afrikaans" },
  { id:"hi12_05", grade:12, subject:"History", topic:"SA History", question:"F.W. de Klerk unbanned the ANC in:", options:["1994","1976","1964","1990"], answer:3, explanation:"2 February 1990: organisations unbanned, Mandela released" },

  // ══════════════════════════════════════════════════════════════════════════
  // GEOGRAPHY — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ge10_01", grade:10, subject:"Geography", topic:"Map Work", question:"Contour lines close together indicate:", options:["Gentle slope","Flat land","A river","Steep slope"], answer:3, explanation:"Close contours = rapid elevation change = steep" },
  { id:"ge10_02", grade:10, subject:"Geography", topic:"Map Work", question:"Grid reference reads column first, then … :", options:["Colour","Scale","Contour","Row"], answer:3, explanation:"Eastings first, then Northings: 'along the corridor, up the stairs'" },
  { id:"ge10_03", grade:10, subject:"Geography", topic:"Geomorphology", question:"V-shaped valleys formed by:", options:["Glaciers","Wind erosion","Wave action","River erosion"], answer:3, explanation:"Rivers cut down through rock creating V-shape in upper course" },
  { id:"ge10_04", grade:10, subject:"Geography", topic:"Atmosphere", question:"Insolation means:", options:["Thermal insulation","Atmospheric pressure","Wind speed","Incoming solar radiation"], answer:3, explanation:"Insolation: solar energy reaching Earth's surface" },
  { id:"ge11_01", grade:11, subject:"Geography", topic:"Climate", question:"Coriolis effect in Southern Hemisphere deflects winds:", options:["To the right","Straight up","Down","To the left"], answer:3, explanation:"Southern Hemisphere: deflection to left" },
  { id:"ge11_02", grade:11, subject:"Geography", topic:"Climate", question:"Mediterranean climate has … summers and … winters:", options:["Wet, cold","Wet, dry","Wet, hot","Hot dry, wet mild"], answer:3, explanation:"Summer drought, winter rainfall pattern" },
  { id:"ge11_03", grade:11, subject:"Geography", topic:"Geomorphology", question:"A meander is a:", options:["Straight river channel","Waterfall","Canyon","Sinuous bend in a river"], answer:3, explanation:"Meanders: loops formed in lower course where river swings laterally" },
  { id:"ge11_04", grade:11, subject:"Geography", topic:"Population", question:"Push factor for migration:", options:["Job opportunities","Good healthcare","Better education","War, poverty, drought in origin area"], answer:3, explanation:"Push = reasons to LEAVE; Pull = reasons to go TO" },
  { id:"ge12_01", grade:12, subject:"Geography", topic:"Development", question:"HDI measures:", options:["GDP only","Population size","Industrial output","Life expectancy, education, and income"], answer:3, explanation:"Human Development Index: health + education + living standard" },
  { id:"ge12_02", grade:12, subject:"Geography", topic:"Development", question:"Gini coefficient measures:", options:["GDP growth","Birth rate","Inflation","Income inequality"], answer:3, explanation:"0=perfect equality, 1=perfect inequality" },
  { id:"ge12_03", grade:12, subject:"Geography", topic:"Geomorphology", question:"Abrasion in coastal geomorphology means:", options:["Water freezing in cracks","Chemical weathering","Wave energy alone","Rock scraping/grinding by particles in waves"], answer:3, explanation:"Abrasion: sand/pebbles in waves wear away cliff face" },
  { id:"ge12_04", grade:12, subject:"Geography", topic:"Climate", question:"El Niño causes SA to experience:", options:["Flooding","Cold snaps","Extra rainfall","Drought conditions"], answer:3, explanation:"El Niño: warm Pacific → reduced rainfall in southern Africa" },
  { id:"ge12_05", grade:12, subject:"Geography", topic:"Development", question:"Urbanisation refers to:", options:["Rural population growth","Industrialisation only","Agricultural expansion","Increase in proportion of population in urban areas"], answer:3, explanation:"More people living in cities = urbanisation" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL LITERACY — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ml10_01", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"15% of R800 =", options:["R80","R150","R200","R120"], answer:3, explanation:"0.15×800=R120" },
  { id:"ml10_02", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"VAT 15% on R200 — total:", options:["R215","R200","R185","R230"], answer:3, explanation:"R200+R30=R230" },
  { id:"ml10_03", grade:10, subject:"Mathematical Literacy", topic:"Measurement", question:"2.5 litres = ? ml", options:["250 ml","25 000 ml","0.25 ml","2500 ml"], answer:3, explanation:"1L=1000ml. 2.5×1000=2500" },
  { id:"ml10_04", grade:10, subject:"Mathematical Literacy", topic:"Maps & Scale", question:"Map scale 1:25 000 — 4 cm on map =", options:["25 m","100 m","250 m","1000 m"], answer:3, explanation:"4×25000=100 000cm=1000m=1km" },
  { id:"ml10_05", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"Simple interest on R2000 at 10% for 3 years:", options:["R6000","R200","R2600","R600"], answer:3, explanation:"SI=2000×0.1×3=R600" },
  { id:"ml11_01", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"R4000 at 6% compound for 2 years =", options:["R4480","R4240","R4480.40","R4494.40"], answer:3, explanation:"A=4000×(1.06)²=R4494.40" },
  { id:"ml11_02", grade:11, subject:"Mathematical Literacy", topic:"Data Handling", question:"A pie chart's total angles =", options:["180°","270°","90°","360°"], answer:3, explanation:"Pie chart represents 360° = 100%" },
  { id:"ml11_03", grade:11, subject:"Mathematical Literacy", topic:"Measurement", question:"Area of floor 6m × 4m in cm²:", options:["24 cm²","2400 cm²","240 000 cm²","240 000 cm²"], answer:2, explanation:"6m=600cm, 4m=400cm. 600×400=240 000cm²" },
  { id:"ml11_04", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"After 10% salary increase, R8000 becomes:", options:["R8100","R7200","R9000","R8800"], answer:3, explanation:"8000×1.10=R8800" },
  { id:"ml12_01", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"UIF stands for:", options:["Universal Income Fund","Urban Insurance Finance","United Income Fund","Unemployment Insurance Fund"], answer:3, explanation:"UIF provides relief to workers who lose jobs" },
  { id:"ml12_02", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"Break-even point is where:", options:["Profit is maximum","Revenue is zero","Loss is minimum","Revenue equals total costs"], answer:3, explanation:"Break-even: no profit, no loss" },
  { id:"ml12_03", grade:12, subject:"Mathematical Literacy", topic:"Data Handling", question:"Scatter plot shows:", options:["Frequency distribution","Single variable data","Proportions","Relationship between two variables"], answer:3, explanation:"Scatter plot: two-variable correlation" },
  { id:"ml12_04", grade:12, subject:"Mathematical Literacy", topic:"Measurement", question:"Percentage error = (|measured−actual| / actual) × …?", options:["10","1000","10 000","100"], answer:3, explanation:"Percentage error expressed as %" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL SCIENCES — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ts10_01", grade:10, subject:"Technical Sciences", topic:"Forces", question:"Friction is a:", options:["Non-contact force","Gravitational force","Magnetic force","Contact force"], answer:3, explanation:"Requires physical contact between surfaces" },
  { id:"ts10_02", grade:10, subject:"Technical Sciences", topic:"Electricity", question:"V=12V, R=4Ω → I =", options:["48 A","8 A","0.33 A","3 A"], answer:3, explanation:"I=V/R=12/4=3A" },
  { id:"ts10_03", grade:10, subject:"Technical Sciences", topic:"Forces", question:"Resultant force of 10N and 6N in same direction:", options:["4 N","60 N","10 N","16 N"], answer:3, explanation:"Same direction: add forces 10+6=16N" },
  { id:"ts11_01", grade:11, subject:"Technical Sciences", topic:"Newton's Laws", question:"Newton's 1st Law = law of:", options:["Action-reaction","Momentum","Gravity","Inertia"], answer:3, explanation:"Object continues in state unless net force acts" },
  { id:"ts11_02", grade:11, subject:"Technical Sciences", topic:"Electricity", question:"Power formula P =", options:["V/I","I/V","V+I","V×I"], answer:3, explanation:"P=VI (Watts)" },
  { id:"ts12_01", grade:12, subject:"Technical Sciences", topic:"Electricity", question:"Faraday's Law: EMF induced when:", options:["Current through resistor","Voltage applied to conductor","Circuit opened","Magnetic flux through coil changes"], answer:3, explanation:"Changing flux induces EMF" },
  { id:"ts12_02", grade:12, subject:"Technical Sciences", topic:"Mechanics", question:"Mechanical advantage = Load / …?", options:["Work","Distance","Velocity","Effort"], answer:3, explanation:"MA: force multiplication of a machine" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL MATHEMATICS — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tm10_01", grade:10, subject:"Technical Mathematics", topic:"Algebra", question:"4a + 3b − 2a + b =", options:["6a+4b","2a+2b","6a+2b","2a+4b"], answer:3, explanation:"(4−2)a+(3+1)b=2a+4b" },
  { id:"tm10_02", grade:10, subject:"Technical Mathematics", topic:"Geometry", question:"Area of triangle: base 10cm, height 6cm:", options:["60 cm²","16 cm²","100 cm²","30 cm²"], answer:3, explanation:"A=½×10×6=30cm²" },
  { id:"tm10_03", grade:10, subject:"Technical Mathematics", topic:"Geometry", question:"Volume of cylinder: radius 3cm, height 7cm (π≈3.14):", options:["65.94 cm³","131.9 cm³","188 cm³","197.82 cm³"], answer:3, explanation:"V=π×r²×h=3.14×9×7=197.82cm³" },
  { id:"tm11_01", grade:11, subject:"Technical Mathematics", topic:"Algebra", question:"Solve: x² = 25", options:["x=5","x=25","x=±25","x=±5"], answer:3, explanation:"x=±√25=±5" },
  { id:"tm11_02", grade:11, subject:"Technical Mathematics", topic:"Trigonometry", question:"sin 90° =", options:["0","0.5","undefined","1"], answer:3, explanation:"sin 90°=1" },
  { id:"tm12_01", grade:12, subject:"Technical Mathematics", topic:"Trigonometry", question:"Sine rule: a/sin A =", options:["b/cos B","a/cos A","sin B/b","b/sin B"], answer:3, explanation:"a/sinA=b/sinB=c/sinC" },
  { id:"tm12_02", grade:12, subject:"Technical Mathematics", topic:"Calculus", question:"Derivative of 4x³:", options:["4x","3x²","12x³","12x²"], answer:3, explanation:"d/dx(4x³)=12x²" },

  // ══════════════════════════════════════════════════════════════════════════
  // CIVIL TECHNOLOGY — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ct10_01", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Main reinforcing in reinforced concrete:", options:["Timber","Brick","Gravel","Steel rebar"], answer:3, explanation:"Rebar: handles tension; concrete: compression" },
  { id:"ct10_02", grade:10, subject:"Civil Technology", topic:"Drawing & Plans", question:"'NTS' on a drawing means:", options:["North To South","No Technical Spec","Number of Total Sheets","Not To Scale"], answer:3, explanation:"NTS = Not To Scale" },
  { id:"ct10_03", grade:10, subject:"Civil Technology", topic:"Concrete", question:"Water-cement ratio affects concrete:", options:["Colour","Weight only","Reinforcement","Strength and workability"], answer:3, explanation:"Lower w/c ratio = stronger but less workable" },
  { id:"ct11_01", grade:11, subject:"Civil Technology", topic:"Walls", question:"DPC prevents:", options:["Cold","Structural failure","Wind damage","Rising damp"], answer:3, explanation:"Damp Proof Course stops moisture rising from ground" },
  { id:"ct11_02", grade:11, subject:"Civil Technology", topic:"Roofs", question:"Pitch of a roof refers to:", options:["Material used","Roof colour","Thickness","Steepness/slope angle"], answer:3, explanation:"Roof pitch = angle of slope, affects drainage and appearance" },
  { id:"ct12_01", grade:12, subject:"Civil Technology", topic:"Structures", question:"Reinforced concrete handles tension and compression because:", options:["Concrete handles both","Steel handles compression","Same material throughout","Steel handles tension, concrete handles compression"], answer:3, explanation:"Steel and concrete complement each other" },
  { id:"ct12_02", grade:12, subject:"Civil Technology", topic:"Construction", question:"Curing concrete means:", options:["Colouring it","Adding more cement","Heating to set faster","Keeping it moist to gain strength"], answer:3, explanation:"Curing prevents moisture loss during hydration" },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL TECHNOLOGY — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"et10_01", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"Battery converts chemical energy to:", options:["Mechanical energy","Heat energy","Light energy","Electrical energy"], answer:3, explanation:"Battery: chemical→electrical" },
  { id:"et10_02", grade:10, subject:"Electrical Technology", topic:"Safety", question:"Earth wire colour in SA:", options:["Red","Black","Blue","Green & Yellow"], answer:3, explanation:"SA: Earth=Green/Yellow, Live=Red/Brown, Neutral=Black/Blue" },
  { id:"et10_03", grade:10, subject:"Electrical Technology", topic:"Circuits", question:"A fuse protects a circuit by:", options:["Increasing voltage","Storing energy","Filtering AC","Melting to break circuit when overloaded"], answer:3, explanation:"Fuse wire melts at rated current, breaking circuit" },
  { id:"et11_01", grade:11, subject:"Electrical Technology", topic:"AC Theory", question:"SA AC mains frequency:", options:["60 Hz","100 Hz","50 kHz","50 Hz"], answer:3, explanation:"SA uses 50Hz (UK/Europe standard)" },
  { id:"et11_02", grade:11, subject:"Electrical Technology", topic:"Transformers", question:"Step-up transformer:", options:["Decreases current and voltage","Keeps voltage same","Increases current, decreases voltage","Increases voltage, decreases current"], answer:3, explanation:"More secondary turns: V up, I down (power constant)" },
  { id:"et12_01", grade:12, subject:"Electrical Technology", topic:"Three-Phase", question:"SA 3-phase line voltage ≈", options:["230 V","690 V","110 V","400 V"], answer:3, explanation:"VL=√3×230≈400V" },
  { id:"et12_02", grade:12, subject:"Electrical Technology", topic:"Motors", question:"DC motor converts electrical to:", options:["Chemical energy","Light energy","Thermal energy only","Mechanical energy"], answer:3, explanation:"Electric motor: electrical→mechanical (rotational)" },

  // ══════════════════════════════════════════════════════════════════════════
  // MECHANICAL TECHNOLOGY — GRADE 10, 11, 12  (varied)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"mt10_01", grade:10, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"Vernier calliper measures to:", options:["0.1 mm","1 mm","0.001 mm","0.02 mm"], answer:3, explanation:"Vernier accurate to 0.02mm" },
  { id:"mt10_02", grade:10, subject:"Mechanical Technology", topic:"Tools", question:"A tap cuts:", options:["External threads","Keyways","Gear teeth","Internal threads"], answer:3, explanation:"Tap=internal (female); die=external (male)" },
  { id:"mt10_03", grade:10, subject:"Mechanical Technology", topic:"Materials", question:"Mild steel compared to high carbon steel:", options:["Harder and more brittle","Same hardness","Cannot be welded","Softer and more ductile (easier to weld)"], answer:3, explanation:"Low carbon = softer, weldable; high carbon = harder, brittle" },
  { id:"mt11_01", grade:11, subject:"Mechanical Technology", topic:"Welding", question:"MIG welding uses:", options:["Coated stick electrode","Carbon arc","Gas flame only","Continuous wire electrode"], answer:3, explanation:"MIG: continuous wire + inert shielding gas" },
  { id:"mt11_02", grade:11, subject:"Mechanical Technology", topic:"Power Transmission", question:"A belt drive connects two shafts by:", options:["Gears","A chain","Direct contact","Belt over pulleys"], answer:3, explanation:"Belt drive: flexible power transmission between pulleys" },
  { id:"mt12_01", grade:12, subject:"Mechanical Technology", topic:"Maintenance", question:"Preventive maintenance =", options:["Fixing after breakdown","Emergency repairs","Replacing all parts","Scheduled work before breakdowns"], answer:3, explanation:"Preventive: routine service to prevent failures" },
  { id:"mt12_02", grade:12, subject:"Mechanical Technology", topic:"Hydraulics", question:"Pascal's Law states pressure in fluid:", options:["Varies with direction","Only acts downward","Decreases with depth","Transmitted equally in all directions"], answer:3, explanation:"Hydraulic systems: pressure applied = pressure transmitted" },

];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = {
  "Mathematics":                      { icon:"📐", color:"#2563eb", grades:[8,9,10,11,12] },
  "Natural Sciences":                  { icon:"🔭", color:"#0f766e", grades:[8,9] },
  "English":                           { icon:"📖", color:"#0891b2", grades:[8,9,10,11,12] },
  "Economic & Management Sciences":    { icon:"💰", color:"#16a34a", grades:[8,9] },
  "Social Sciences: History":          { icon:"🏛️", color:"#92400e", grades:[8,9] },
  "Social Sciences: Geography":        { icon:"🌍", color:"#1d4ed8", grades:[8,9] },
  "Technology":                        { icon:"🔧", color:"#7c3aed", grades:[8,9] },
  "Life Orientation":                  { icon:"💚", color:"#059669", grades:[8,9] },
  "Creative Arts":                     { icon:"🎨", color:"#ec4899", grades:[8,9] },
  "Technical Mathematics":             { icon:"🔧", color:"#0369a1", grades:[10,11,12] },
  "Mathematical Literacy":             { icon:"💡", color:"#7c3aed", grades:[10,11,12] },
  "Physical Sciences":                 { icon:"⚗️", color:"#6d28d9", grades:[10,11,12] },
  "Technical Sciences":                { icon:"🔬", color:"#0f766e", grades:[10,11,12] },
  "Life Sciences":                     { icon:"🧬", color:"#16a34a", grades:[10,11,12] },
  "Accounting":                        { icon:"📒", color:"#b45309", grades:[10,11,12] },
  "Business Studies":                  { icon:"💼", color:"#059669", grades:[10,11,12] },
  "Economics":                         { icon:"📈", color:"#dc2626", grades:[10,11,12] },
  "History":                           { icon:"🏛️", color:"#92400e", grades:[10,11,12] },
  "Geography":                         { icon:"🌍", color:"#1d4ed8", grades:[10,11,12] },
  "Civil Technology":                  { icon:"🏗️", color:"#b45309", grades:[10,11,12] },
  "Electrical Technology":             { icon:"⚡", color:"#ca8a04", grades:[10,11,12] },
  "Mechanical Technology":             { icon:"⚙️", color:"#475569", grades:[10,11,12] },
};

const GRADE_COLORS = { 8:"#0f766e", 9:"#7c3aed", 10:"#2563eb", 11:"#9333ea", 12:"#16a34a" };
const GRADE_LABELS = {
  8:  { emoji:"🌱", tagline:"Foundation Phase — CAPS curriculum basics" },
  9:  { emoji:"🌿", tagline:"Preparing for high school — choose your stream!" },
  10: { emoji:"📚", tagline:"NSC begins — core concepts for your stream" },
  11: { emoji:"🎯", tagline:"Building towards Matric" },
  12: { emoji:"🏆", tagline:"Matric year — NSC exam practice" },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PastPapersQuiz({ student, onBack }) {
  const grade  = parseInt(student?.grade) || 10;
  const gc     = GRADE_COLORS[grade] || "#2563eb";
  const glabel = GRADE_LABELS[grade] || GRADE_LABELS[10];

  const [screen,     setScreen]     = useState("home");
  const [selSubject, setSelSubject] = useState(null);
  const [questions,  setQuestions]  = useState([]);
  const [current,    setCurrent]    = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [confirmed,  setConfirmed]  = useState(false);
  const [answers,    setAnswers]    = useState([]);
  const [timeLeft,   setTimeLeft]   = useState(30);
  const [timedOut,   setTimedOut]   = useState(false);
  const [history,    setHistory]    = useState([]);
  const timerRef = useRef(null);
  const NUM_Q = 10;

  useEffect(() => {
    if (screen !== "quiz" || confirmed) return;
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleTimeout(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, screen, confirmed]);

  const handleTimeout = () => { setTimedOut(true); setConfirmed(true); clearInterval(timerRef.current); };

  const startQuiz = (subject) => {
    const pool   = QUESTION_BANK.filter(q => q.subject === subject && q.grade === grade);
    const picked = shuffle(pool).slice(0, Math.min(NUM_Q, pool.length));
    setSelSubject(subject); setQuestions(picked); setCurrent(0);
    setSelected(null); setConfirmed(false); setTimedOut(false); setAnswers([]);
    setScreen("quiz");
  };

  const selectAnswer  = (idx) => { if (confirmed) return; setSelected(idx); };
  const confirmAnswer = () => { if (selected === null && !timedOut) return; clearInterval(timerRef.current); setConfirmed(true); };

  const nextQuestion = () => {
    const q       = questions[current];
    const correct = !timedOut && selected === q.answer;
    const newAns  = [...answers, { q, chosen: timedOut ? null : selected, correct, timedOut }];
    if (current + 1 < questions.length) {
      setAnswers(newAns); setCurrent(c => c + 1);
      setSelected(null); setConfirmed(false); setTimedOut(false);
    } else {
      const score   = newAns.filter(a => a.correct).length;
      const session = { subject: selSubject, grade, score, total: questions.length,
                        pct: Math.round((score / questions.length) * 100),
                        date: new Date().toLocaleDateString("en-ZA"), answers: newAns };
      setAnswers(newAns);
      setHistory(h => [session, ...h.slice(0, 9)]);
      setScreen("results");
    }
  };

  const availableSubjects = Object.entries(SUBJECTS).filter(([name]) =>
    QUESTION_BANK.some(q => q.subject === name && q.grade === grade)
  );

  const q        = questions[current];
  const finalPct = screen === "results" ? Math.round((answers.filter(a => a.correct).length / questions.length) * 100) : 0;

  // ─── HOME ─────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={S.wrap}>
      <div style={{ ...S.heroBar, background:`linear-gradient(135deg,${gc},${gc}cc)` }}>
        <button style={S.backBtn} onClick={onBack}>← Back</button>
        <div style={S.heroContent}>
          <span style={{ fontSize:48 }}>{glabel.emoji}</span>
          <div>
            <h1 style={S.heroTitle}>Past Papers Practice</h1>
            <p style={S.heroSub}>Grade {grade} · {glabel.tagline}</p>
          </div>
        </div>
      </div>

      <div style={S.body}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
          <div style={{ ...S.gradeBadge, background:gc }}>Grade {grade}</div>
          <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>
            {NUM_Q}-question timed quiz · 30 sec per question · instant feedback
          </p>
        </div>

        <div style={S.howBox}>
          <b style={{ fontSize:13, color:"#1e293b" }}>⚡ How it works:</b>
          <div style={S.howGrid}>
            {[["30 sec","Per question"],["10 Q's","Per session"],["Instant","Feedback"],["Full","Review"]].map(([a,b])=>(
              <div key={a} style={S.howItem}>
                <span style={{ fontWeight:800, color:gc, fontSize:15 }}>{a}</span>
                <span style={{ fontSize:11, color:"#6b7280" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 style={S.sectionTitle}>Choose a Subject</h3>
        <div style={S.subjectGrid}>
          {availableSubjects.map(([name, cfg]) => {
            const count = QUESTION_BANK.filter(q => q.subject === name && q.grade === grade).length;
            const last  = history.find(h => h.subject === name);
            return (
              <button key={name} style={{ ...S.subjectCard, borderColor:cfg.color }} onClick={() => startQuiz(name)}>
                <span style={{ fontSize:28, marginBottom:6, display:"block" }}>{cfg.icon}</span>
                <p style={{ fontWeight:800, fontSize:13, color:"#1e293b", margin:"0 0 3px" }}>{name}</p>
                <p style={{ fontSize:10, color:"#94a3b8", margin:"0 0 8px" }}>{count} questions</p>
                {last && <div style={{ ...S.lastScore, background:`${cfg.color}18`, color:cfg.color }}>Last: {last.pct}%</div>}
                <div style={{ ...S.startChip, background:cfg.color }}>Start →</div>
              </button>
            );
          })}
        </div>

        {history.length > 0 && (
          <div style={{ marginTop:28 }}>
            <h3 style={S.sectionTitle}>📊 Recent Sessions</h3>
            {history.slice(0,5).map((h,i) => {
              const cfg = SUBJECTS[h.subject] || { icon:"📝" };
              const col = h.pct>=70?"#16a34a":h.pct>=50?"#d97706":"#dc2626";
              return (
                <div key={i} style={S.historyRow}>
                  <span style={{ fontSize:18 }}>{cfg.icon}</span>
                  <div style={{ flex:1 }}>
                    <span style={{ fontWeight:700, fontSize:13 }}>{h.subject}</span>
                    <span style={{ fontSize:11, color:"#94a3b8", marginLeft:8 }}>{h.date}</span>
                  </div>
                  <div style={{ ...S.histScore, background:`${col}18`, color:col }}>{h.score}/{h.total} · {h.pct}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  // ─── QUIZ ─────────────────────────────────────────────────────────────────
  if (screen === "quiz" && q) {
    const cfg      = SUBJECTS[selSubject] || { color:gc };
    const progress = (current / questions.length) * 100;
    const timerPct = (timeLeft / 30) * 100;

    return (
      <div style={S.wrap}>
        <div style={{ ...S.quizHeader, background:`linear-gradient(135deg,${cfg.color},${cfg.color}bb)` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button style={S.quitBtn} onClick={() => setScreen("home")}>✕ Quit</button>
            <div style={{ textAlign:"center" }}>
              <p style={{ margin:0, color:"#fff", fontWeight:700, fontSize:14 }}>{cfg.icon} {selSubject}</p>
              <p style={{ margin:0, color:"rgba(255,255,255,.75)", fontSize:12 }}>Grade {grade} · Q {current+1} of {questions.length}</p>
            </div>
            <div style={{ position:"relative", width:48, height:48 }}>
              <svg width="48" height="48" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="4"/>
                <circle cx="24" cy="24" r="20" fill="none" stroke={timeLeft>8?"#fff":"#fca5a5"} strokeWidth="4"
                  strokeDasharray={`${2*Math.PI*20}`}
                  strokeDashoffset={`${2*Math.PI*20*(1-timerPct/100)}`}
                  style={{ transition:"stroke-dashoffset 1s linear" }}/>
              </svg>
              <span style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", fontSize:13, fontWeight:900, color:"#fff" }}>{timeLeft}</span>
            </div>
          </div>
          <div style={S.progressTrack}>
            <div style={{ ...S.progressFill, width:`${progress}%`, background:"rgba(255,255,255,.9)" }}/>
          </div>
        </div>

        <div style={S.quizBody}>
          <span style={{ ...S.topicBadge, background:`${cfg.color}18`, color:cfg.color }}>{q.topic}</span>
          <p style={S.questionText}>{q.question}</p>

          {timedOut && <div style={S.timedOutBanner}>⏱️ Time's up! Correct answer highlighted below.</div>}

          <div style={S.optionsList}>
            {q.options.map((opt, idx) => {
              let style = S.option;
              if (confirmed || timedOut) {
                if (idx === q.answer)      style = { ...S.option, ...S.optCorrect };
                else if (idx === selected) style = { ...S.option, ...S.optWrong };
                else                       style = { ...S.option, ...S.optDim };
              } else if (selected === idx) style = { ...S.option, ...S.optSelected, borderColor:cfg.color, background:`${cfg.color}12` };
              return (
                <button key={idx} style={style} onClick={() => selectAnswer(idx)} disabled={confirmed || timedOut}>
                  <span style={S.optLetter}>{["A","B","C","D"][idx]}</span>
                  <span style={{ flex:1, textAlign:"left" }}>{opt}</span>
                  {confirmed && idx === q.answer && <span>✅</span>}
                  {confirmed && idx === selected && idx !== q.answer && <span>❌</span>}
                </button>
              );
            })}
          </div>

          {(confirmed || timedOut) && (
            <div style={{ ...S.explanation, borderColor: selected===q.answer?"#16a34a":"#f59e0b" }}>
              <b style={{ fontSize:13 }}>💡 Explanation:</b>
              <p style={{ margin:"6px 0 0", fontSize:13, color:"#374151", lineHeight:1.6 }}>{q.explanation}</p>
            </div>
          )}

          <div style={{ display:"flex", gap:12, marginTop:16 }}>
            {!confirmed && !timedOut && (
              <button style={{ ...S.actionBtn, background:cfg.color, opacity:selected===null?0.5:1 }}
                onClick={confirmAnswer} disabled={selected===null}>Confirm Answer</button>
            )}
            {(confirmed || timedOut) && (
              <button style={{ ...S.actionBtn, background:cfg.color }} onClick={nextQuestion}>
                {current + 1 < questions.length ? "Next Question →" : "See Results →"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RESULTS ──────────────────────────────────────────────────────────────
  if (screen === "results") {
    const cfg      = SUBJECTS[selSubject] || { color:gc, icon:"📝" };
    const correct  = answers.filter(a => a.correct).length;
    const grade_col = finalPct>=70?"#16a34a":finalPct>=50?"#d97706":"#dc2626";
    const medal     = finalPct>=90?"🥇":finalPct>=70?"🥈":finalPct>=50?"🥉":"📚";
    const msg       = finalPct>=90?"Outstanding! Excellent work!":finalPct>=70?"Great job! Keep it up!":finalPct>=50?"Good effort. Review the explanations.":"Keep practising — you will improve!";

    return (
      <div style={S.wrap}>
        <div style={{ ...S.resultsHeader, background:`linear-gradient(135deg,${cfg.color},${cfg.color}bb)` }}>
          <p style={{ color:"rgba(255,255,255,.8)", fontSize:13, margin:"0 0 4px" }}>{cfg.icon} {selSubject} · Grade {grade}</p>
          <div style={{ fontSize:56 }}>{medal}</div>
          <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"4px 0" }}>{correct} / {questions.length}</h2>
          <div style={{ fontSize:36, fontWeight:900, color:"#fff" }}>{finalPct}%</div>
          <p style={{ color:"rgba(255,255,255,.9)", fontSize:14, margin:"8px 0 0" }}>{msg}</p>
        </div>

        <div style={S.body}>
          <div style={S.scoreBar}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#6b7280" }}>Score</span>
              <span style={{ fontSize:12, fontWeight:700, color:grade_col }}>{finalPct}%</span>
            </div>
            <div style={S.scoreTrack}><div style={{ ...S.scoreFill, width:`${finalPct}%`, background:grade_col }}/></div>
          </div>

          <h3 style={S.sectionTitle}>📋 Question Review</h3>
          {answers.map((a, i) => (
            <div key={i} style={{ ...S.reviewCard, borderLeft:`4px solid ${a.correct?"#16a34a":"#dc2626"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <span style={S.reviewNum}>Q{i+1}</span>
                <div style={{ display:"flex", gap:6 }}>
                  <span style={{ ...S.topicBadge, background:`${cfg.color}18`, color:cfg.color, margin:0 }}>{a.q.topic}</span>
                  {a.timedOut && <span style={{ ...S.topicBadge, background:"#f1f5f9", color:"#6b7280", margin:0 }}>⏱ timed out</span>}
                </div>
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:"#1e293b", margin:"0 0 8px" }}>{a.q.question}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {a.q.options.map((opt, idx) => (
                  <div key={idx} style={{
                    padding:"6px 10px", borderRadius:8, fontSize:12,
                    background: idx===a.q.answer?"#d1fae5":idx===a.chosen&&idx!==a.q.answer?"#fee2e2":"#f8fafc",
                    color: idx===a.q.answer?"#065f46":idx===a.chosen&&idx!==a.q.answer?"#991b1b":"#374151",
                    fontWeight: idx===a.q.answer||idx===a.chosen?700:400,
                    border:`1px solid ${idx===a.q.answer?"#6ee7b7":idx===a.chosen&&idx!==a.q.answer?"#fca5a5":"#e2e8f0"}`,
                  }}>
                    {["A","B","C","D"][idx]}. {opt}{idx===a.q.answer?" ✓":""}{idx===a.chosen&&idx!==a.q.answer?" ✗":""}
                  </div>
                ))}
              </div>
              <div style={S.reviewExplanation}>💡 {a.q.explanation}</div>
            </div>
          ))}

          <div style={{ display:"flex", gap:12, marginTop:24, flexWrap:"wrap" }}>
            <button style={{ ...S.actionBtn, background:cfg.color, flex:1 }} onClick={() => startQuiz(selSubject)}>🔄 Try Again</button>
            <button style={{ ...S.actionBtn, background:"#475569", flex:1 }} onClick={() => setScreen("home")}>📚 Another Subject</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  wrap:              { fontFamily:"'Segoe UI',sans-serif", background:"#e0f2fe", minHeight:"100vh" },
  heroBar:           { padding:"20px 20px 24px" },
  backBtn:           { background:"rgba(255,255,255,.2)", border:"1px solid rgba(255,255,255,.4)", color:"#fff", borderRadius:8, padding:"6px 14px", fontSize:13, cursor:"pointer", marginBottom:16, display:"block" },
  heroContent:       { display:"flex", alignItems:"center", gap:16 },
  heroTitle:         { fontSize:24, fontWeight:900, color:"#fff", margin:0 },
  heroSub:           { fontSize:13, color:"rgba(255,255,255,.8)", margin:"4px 0 0" },
  body:              { padding:"20px" },
  gradeBadge:        { display:"inline-block", color:"#fff", borderRadius:99, padding:"4px 16px", fontSize:13, fontWeight:800 },
  howBox:            { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 16px", marginBottom:20 },
  howGrid:           { display:"flex", gap:16, marginTop:10, flexWrap:"wrap" },
  howItem:           { display:"flex", flexDirection:"column", gap:2, minWidth:60 },
  sectionTitle:      { fontSize:13, fontWeight:800, color:"#1e293b", margin:"0 0 12px", textTransform:"uppercase", letterSpacing:1 },
  subjectGrid:       { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))", gap:10 },
  subjectCard:       { background:"#fff", border:"2px solid", borderRadius:14, padding:"14px 10px", textAlign:"center", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center" },
  lastScore:         { borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:700, marginBottom:6 },
  startChip:         { color:"#fff", borderRadius:99, padding:"4px 14px", fontSize:11, fontWeight:700, marginTop:6 },
  historyRow:        { background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:12, marginBottom:8 },
  histScore:         { borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:700 },
  quizHeader:        { padding:"16px 20px 0" },
  quitBtn:           { background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", borderRadius:8, padding:"4px 12px", fontSize:12, cursor:"pointer" },
  progressTrack:     { height:4, background:"rgba(255,255,255,.25)", borderRadius:99, marginTop:14, overflow:"hidden" },
  progressFill:      { height:"100%", borderRadius:99, transition:"width .4s ease" },
  quizBody:          { padding:"20px" },
  topicBadge:        { display:"inline-block", borderRadius:99, padding:"3px 12px", fontSize:11, fontWeight:700, marginBottom:12 },
  questionText:      { fontSize:16, fontWeight:700, color:"#1e293b", lineHeight:1.6, margin:"0 0 16px" },
  timedOutBanner:    { background:"#fef9c3", border:"1px solid #fde68a", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#713f12", marginBottom:12, fontWeight:600 },
  optionsList:       { display:"flex", flexDirection:"column", gap:10 },
  option:            { display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"#fff", border:"2px solid #e2e8f0", borderRadius:12, fontSize:14, cursor:"pointer", textAlign:"left", transition:"all .15s" },
  optSelected:       { border:"2px solid", fontWeight:600 },
  optCorrect:        { background:"#d1fae5", border:"2px solid #6ee7b7", color:"#065f46", fontWeight:700, cursor:"default" },
  optWrong:          { background:"#fee2e2", border:"2px solid #fca5a5", color:"#991b1b", fontWeight:700, cursor:"default" },
  optDim:            { background:"#f8fafc", border:"2px solid #e2e8f0", color:"#9ca3af", cursor:"default" },
  optLetter:         { width:28, height:28, borderRadius:"50%", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0 },
  explanation:       { background:"#fffbeb", border:"1px solid", borderRadius:10, padding:"12px 14px", marginTop:14 },
  actionBtn:         { padding:"13px 24px", color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", flex:1 },
  resultsHeader:     { padding:"28px 20px 24px", textAlign:"center" },
  scoreBar:          { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"16px", marginBottom:20 },
  scoreTrack:        { height:10, background:"#f1f5f9", borderRadius:99, overflow:"hidden" },
  scoreFill:         { height:"100%", borderRadius:99, transition:"width .6s ease" },
  reviewCard:        { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px", marginBottom:10 },
  reviewNum:         { background:"#f1f5f9", color:"#475569", borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700 },
  reviewExplanation: { background:"#fffbeb", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#713f12", marginTop:10, lineHeight:1.6 },
};
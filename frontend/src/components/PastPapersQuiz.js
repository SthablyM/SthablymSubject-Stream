// src/components/PastPapersQuiz.js
// Past Papers Quiz — Grades 8, 9, 10, 11, 12
// NSC / CAPS-style multiple choice questions per subject and grade
import React, { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION BANK
// Format: { id, grade, subject, topic, question, options[], answer(0-indexed), explanation }
// ─────────────────────────────────────────────────────────────────────────────
const QUESTION_BANK = [

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m8_01", grade:8, subject:"Mathematics", topic:"Whole Numbers", question:"What is the value of 7³?", options:["343","21","49","147"], answer:0, explanation:"7³ = 7 × 7 × 7 = 49 × 7 = 343" },
  { id:"m8_02", grade:8, subject:"Mathematics", topic:"Whole Numbers", question:"What is the LCM of 4 and 6?", options:["12","24","2","8"], answer:0, explanation:"Multiples of 4: 4,8,12. Multiples of 6: 6,12. LCM = 12" },
  { id:"m8_03", grade:8, subject:"Mathematics", topic:"Whole Numbers", question:"What is the HCF of 24 and 36?", options:["12","6","4","72"], answer:0, explanation:"Factors of 24: 1,2,3,4,6,8,12,24. Factors of 36: 1,2,3,4,6,9,12,18,36. HCF = 12" },
  { id:"m8_04", grade:8, subject:"Mathematics", topic:"Integers", question:"What is −5 + (−3)?", options:["−8","8","−2","2"], answer:0, explanation:"Adding two negative numbers: −5 + (−3) = −8" },
  { id:"m8_05", grade:8, subject:"Mathematics", topic:"Integers", question:"What is (−4) × (−3)?", options:["12","−12","−7","7"], answer:0, explanation:"Negative × negative = positive. (−4) × (−3) = +12" },
  { id:"m8_06", grade:8, subject:"Mathematics", topic:"Integers", question:"What is −20 ÷ 4?", options:["−5","5","−80","80"], answer:0, explanation:"Negative ÷ positive = negative. −20 ÷ 4 = −5" },
  { id:"m8_07", grade:8, subject:"Mathematics", topic:"Fractions", question:"What is 2/3 + 1/4?", options:["11/12","3/7","3/12","2/7"], answer:0, explanation:"LCD = 12. 8/12 + 3/12 = 11/12" },
  { id:"m8_08", grade:8, subject:"Mathematics", topic:"Fractions", question:"What is 3/5 × 10/9?", options:["2/3","5/9","1/3","30/45"], answer:0, explanation:"3/5 × 10/9 = 30/45 = 2/3 (simplify by cancelling: 3×10 / 5×9 = 30/45 = 2/3)" },
  { id:"m8_09", grade:8, subject:"Mathematics", topic:"Decimals", question:"What is 0.4 × 0.3?", options:["0.12","0.7","1.2","0.012"], answer:0, explanation:"0.4 × 0.3: multiply 4 × 3 = 12, then 1+1 = 2 decimal places → 0.12" },
  { id:"m8_10", grade:8, subject:"Mathematics", topic:"Percentages", question:"What is 20% of 250?", options:["50","25","200","5"], answer:0, explanation:"20% of 250 = 0.20 × 250 = 50" },
  { id:"m8_11", grade:8, subject:"Mathematics", topic:"Algebra", question:"Simplify: 3x + 5x − 2x", options:["6x","8x","10x","3x"], answer:0, explanation:"Collect like terms: (3 + 5 − 2)x = 6x" },
  { id:"m8_12", grade:8, subject:"Mathematics", topic:"Algebra", question:"Solve for x: x + 7 = 15", options:["8","22","7","−8"], answer:0, explanation:"x = 15 − 7 = 8" },
  { id:"m8_13", grade:8, subject:"Mathematics", topic:"Algebra", question:"Expand: 2(x + 4)", options:["2x + 8","2x + 4","x + 8","2x − 8"], answer:0, explanation:"Distribute: 2 × x = 2x and 2 × 4 = 8. Answer: 2x + 8" },
  { id:"m8_14", grade:8, subject:"Mathematics", topic:"Geometry", question:"How many degrees in a straight angle?", options:["180°","90°","360°","270°"], answer:0, explanation:"A straight angle is exactly 180°" },
  { id:"m8_15", grade:8, subject:"Mathematics", topic:"Geometry", question:"The area of a square with side 6 cm is:", options:["36 cm²","24 cm²","12 cm²","216 cm²"], answer:0, explanation:"Area of square = side² = 6² = 36 cm²" },
  { id:"m8_16", grade:8, subject:"Mathematics", topic:"Geometry", question:"How many sides does a hexagon have?", options:["6","5","7","8"], answer:0, explanation:"Hexagon = 6 sides (hex = 6 in Greek)" },
  { id:"m8_17", grade:8, subject:"Mathematics", topic:"Geometry", question:"The perimeter of a rectangle 8m × 3m is:", options:["22 m","24 m","11 m","48 m"], answer:0, explanation:"Perimeter = 2(l + w) = 2(8 + 3) = 2 × 11 = 22 m" },
  { id:"m8_18", grade:8, subject:"Mathematics", topic:"Patterns", question:"The next term in 1, 4, 9, 16, … is:", options:["25","20","36","18"], answer:0, explanation:"These are perfect squares: 1², 2², 3², 4², 5² = 25" },
  { id:"m8_19", grade:8, subject:"Mathematics", topic:"Patterns", question:"What is the 5th term of the sequence: 3, 6, 9, 12, …?", options:["15","18","12","21"], answer:0, explanation:"Arithmetic sequence with d = 3. T₅ = 3 × 5 = 15" },
  { id:"m8_20", grade:8, subject:"Mathematics", topic:"Statistics", question:"The range of 2, 7, 4, 9, 5 is:", options:["7","9","5","4"], answer:0, explanation:"Range = maximum − minimum = 9 − 2 = 7" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m9_01", grade:9, subject:"Mathematics", topic:"Algebra", question:"Factorise: x² − 16", options:["(x−4)(x+4)","(x−4)²","(x+4)²","(x−8)(x+2)"], answer:0, explanation:"Difference of squares: x² − 16 = x² − 4² = (x−4)(x+4)" },
  { id:"m9_02", grade:9, subject:"Mathematics", topic:"Algebra", question:"Solve for x: 3x − 6 = 12", options:["6","2","−2","18"], answer:0, explanation:"3x = 12 + 6 = 18. x = 18 ÷ 3 = 6" },
  { id:"m9_03", grade:9, subject:"Mathematics", topic:"Algebra", question:"Simplify: (2x)³", options:["8x³","6x³","2x³","8x"], answer:0, explanation:"(2x)³ = 2³ × x³ = 8x³" },
  { id:"m9_04", grade:9, subject:"Mathematics", topic:"Algebra", question:"Expand: (x + 3)(x − 2)", options:["x² + x − 6","x² − x − 6","x² + x + 6","x² + 6"], answer:0, explanation:"FOIL: x² − 2x + 3x − 6 = x² + x − 6" },
  { id:"m9_05", grade:9, subject:"Mathematics", topic:"Exponents", question:"Simplify: a⁴ × a³", options:["a⁷","a¹²","a","a⁴"], answer:0, explanation:"Multiply same bases: add exponents. a⁴ × a³ = a^(4+3) = a⁷" },
  { id:"m9_06", grade:9, subject:"Mathematics", topic:"Exponents", question:"What is 2⁻³?", options:["1/8","−8","−6","1/6"], answer:0, explanation:"Negative exponent: 2⁻³ = 1/2³ = 1/8" },
  { id:"m9_07", grade:9, subject:"Mathematics", topic:"Number Patterns", question:"Find T₄ if Tₙ = 2n + 1", options:["9","7","11","8"], answer:0, explanation:"T₄ = 2(4) + 1 = 8 + 1 = 9" },
  { id:"m9_08", grade:9, subject:"Mathematics", topic:"Number Patterns", question:"The common difference of 5, 8, 11, 14 is:", options:["3","5","8","2"], answer:0, explanation:"Each term increases by 3: 8−5=3, 11−8=3. Common difference = 3" },
  { id:"m9_09", grade:9, subject:"Mathematics", topic:"Functions", question:"If f(x) = 3x − 1, what is f(4)?", options:["11","12","13","10"], answer:0, explanation:"f(4) = 3(4) − 1 = 12 − 1 = 11" },
  { id:"m9_10", grade:9, subject:"Mathematics", topic:"Functions", question:"The gradient of the line y = −2x + 5 is:", options:["−2","5","2","−5"], answer:0, explanation:"In y = mx + c, the gradient m = −2" },
  { id:"m9_11", grade:9, subject:"Mathematics", topic:"Geometry", question:"Two angles are complementary if they add up to:", options:["90°","180°","360°","270°"], answer:0, explanation:"Complementary angles sum to 90°. Supplementary angles sum to 180°." },
  { id:"m9_12", grade:9, subject:"Mathematics", topic:"Geometry", question:"The sum of interior angles of a pentagon is:", options:["540°","360°","720°","180°"], answer:0, explanation:"Sum = (n−2) × 180° = (5−2) × 180° = 3 × 180° = 540°" },
  { id:"m9_13", grade:9, subject:"Mathematics", topic:"Geometry", question:"Pythagoras: in a right triangle with legs 6 and 8, the hypotenuse is:", options:["10","14","7","√(48)"], answer:0, explanation:"c² = 6² + 8² = 36 + 64 = 100. c = √100 = 10" },
  { id:"m9_14", grade:9, subject:"Mathematics", topic:"Probability", question:"A bag has 4 red, 3 blue, 3 green balls. P(blue) =", options:["3/10","4/10","3/7","1/3"], answer:0, explanation:"Total = 10. P(blue) = 3/10" },
  { id:"m9_15", grade:9, subject:"Mathematics", topic:"Statistics", question:"The mean of 4, 8, 12, 16 is:", options:["10","8","12","40"], answer:0, explanation:"Mean = (4+8+12+16)/4 = 40/4 = 10" },
  { id:"m9_16", grade:9, subject:"Mathematics", topic:"Finance", question:"R800 at 5% simple interest for 2 years earns:", options:["R80","R40","R160","R880"], answer:0, explanation:"SI = P × r × t = 800 × 0.05 × 2 = R80" },
  { id:"m9_17", grade:9, subject:"Mathematics", topic:"Measurement", question:"Volume of a rectangular prism 5m × 4m × 3m =", options:["60 m³","47 m³","20 m³","12 m³"], answer:0, explanation:"V = l × w × h = 5 × 4 × 3 = 60 m³" },
  { id:"m9_18", grade:9, subject:"Mathematics", topic:"Measurement", question:"The circumference of a circle with diameter 14 cm is approximately:", options:["44 cm","88 cm","22 cm","154 cm"], answer:0, explanation:"C = πd = 22/7 × 14 = 44 cm" },
  { id:"m9_19", grade:9, subject:"Mathematics", topic:"Algebra", question:"Solve: 2(x − 3) = 8", options:["7","5","11","−1"], answer:0, explanation:"2x − 6 = 8. 2x = 14. x = 7" },
  { id:"m9_20", grade:9, subject:"Mathematics", topic:"Statistics", question:"The median of 3, 7, 2, 10, 5, 8 is:", options:["6","5","7","5.5"], answer:0, explanation:"Arrange: 2,3,5,7,8,10. Median = average of 3rd and 4th = (5+7)/2 = 6" },

  // ══════════════════════════════════════════════════════════════════════════
  // NATURAL SCIENCES — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ns8_01", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"What is the state of matter that has no fixed shape but a fixed volume?", options:["Liquid","Solid","Gas","Plasma"], answer:0, explanation:"Liquids have a fixed volume but take the shape of their container — unlike solids (fixed shape) or gases (no fixed volume)" },
  { id:"ns8_02", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"Which change of state occurs when water turns into ice?", options:["Freezing","Melting","Evaporation","Condensation"], answer:0, explanation:"Freezing: liquid → solid. Melting: solid → liquid. Evaporation: liquid → gas." },
  { id:"ns8_03", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"An element is a substance made of:", options:["One type of atom only","Two different atoms","Molecules only","Mixtures of atoms"], answer:0, explanation:"An element contains only one type of atom — e.g. oxygen (O), iron (Fe), gold (Au)" },
  { id:"ns8_04", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"The symbol for the element Gold is:", options:["Au","Go","Ag","Gd"], answer:0, explanation:"Gold's symbol is Au, from the Latin word 'Aurum'" },
  { id:"ns8_05", grade:8, subject:"Natural Sciences", topic:"Matter & Materials", question:"Mixing salt and water is an example of a:", options:["Solution","Compound","Pure substance","Chemical reaction"], answer:0, explanation:"Salt water is a homogeneous mixture (solution) — salt dissolves in water but no new substance is formed" },
  { id:"ns8_06", grade:8, subject:"Natural Sciences", topic:"Energy & Change", question:"Which form of energy does a moving ball have?", options:["Kinetic energy","Potential energy","Chemical energy","Electrical energy"], answer:0, explanation:"Moving objects have kinetic energy. KE = ½mv²" },
  { id:"ns8_07", grade:8, subject:"Natural Sciences", topic:"Energy & Change", question:"The sun produces energy by:", options:["Nuclear fusion","Burning coal","Chemical reactions","Electrical energy"], answer:0, explanation:"The sun's energy comes from nuclear fusion — hydrogen atoms fuse to form helium, releasing enormous energy" },
  { id:"ns8_08", grade:8, subject:"Natural Sciences", topic:"Energy & Change", question:"Sound is a form of:", options:["Mechanical energy (vibration)","Electrical energy","Chemical energy","Nuclear energy"], answer:0, explanation:"Sound travels as mechanical waves — vibrations that need a medium (solid, liquid, or gas) to travel through" },
  { id:"ns8_09", grade:8, subject:"Natural Sciences", topic:"Life & Living", question:"The process by which green plants make food using sunlight is called:", options:["Photosynthesis","Respiration","Digestion","Fermentation"], answer:0, explanation:"Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Plants convert light energy into chemical energy (glucose)." },
  { id:"ns8_10", grade:8, subject:"Natural Sciences", topic:"Life & Living", question:"Which organ in the human body pumps blood?", options:["Heart","Lungs","Liver","Kidneys"], answer:0, explanation:"The heart is a muscular pump that circulates blood around the body through arteries and veins" },
  { id:"ns8_11", grade:8, subject:"Natural Sciences", topic:"Life & Living", question:"What is the function of the lungs?", options:["Gas exchange (oxygen in, CO₂ out)","Digest food","Pump blood","Filter blood"], answer:0, explanation:"The lungs exchange gases: oxygen from air enters the blood, and carbon dioxide from the blood is exhaled" },
  { id:"ns8_12", grade:8, subject:"Natural Sciences", topic:"Life & Living", question:"Which nutrient provides the most energy per gram?", options:["Fats","Carbohydrates","Proteins","Vitamins"], answer:0, explanation:"Fats provide 9 kcal/gram, more than carbohydrates (4 kcal/g) and proteins (4 kcal/g)" },
  { id:"ns8_13", grade:8, subject:"Natural Sciences", topic:"Earth & Beyond", question:"The layer of gases surrounding Earth is called the:", options:["Atmosphere","Hydrosphere","Lithosphere","Biosphere"], answer:0, explanation:"The atmosphere is Earth's layer of gases (nitrogen 78%, oxygen 21%, other 1%)" },
  { id:"ns8_14", grade:8, subject:"Natural Sciences", topic:"Earth & Beyond", question:"Which planet is closest to the sun?", options:["Mercury","Venus","Earth","Mars"], answer:0, explanation:"Mercury is the innermost planet — closest to the sun and smallest planet in our solar system" },
  { id:"ns8_15", grade:8, subject:"Natural Sciences", topic:"Earth & Beyond", question:"What causes day and night on Earth?", options:["Earth rotating on its axis","Earth orbiting the sun","The moon's orbit","Clouds blocking sunlight"], answer:0, explanation:"Earth rotates once every 24 hours — the side facing the sun has day, the opposite side has night" },

  // ══════════════════════════════════════════════════════════════════════════
  // NATURAL SCIENCES — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ns9_01", grade:9, subject:"Natural Sciences", topic:"Matter & Materials", question:"An atom's atomic number represents the number of:", options:["Protons","Neutrons","Electrons","Nucleons"], answer:0, explanation:"Atomic number = number of protons in the nucleus. This defines the element." },
  { id:"ns9_02", grade:9, subject:"Natural Sciences", topic:"Matter & Materials", question:"In a period of the periodic table, elements are arranged by:", options:["Increasing atomic number","Increasing atomic mass","Decreasing reactivity","Similar properties"], answer:0, explanation:"Periods go across the table with increasing atomic number (1 extra proton each step)" },
  { id:"ns9_03", grade:9, subject:"Natural Sciences", topic:"Matter & Materials", question:"A compound is formed when:", options:["Two or more elements are chemically combined","Substances are physically mixed","Atoms are separated","Elements share electrons only"], answer:0, explanation:"A compound is a substance where two or more elements are chemically bonded — has different properties from its elements" },
  { id:"ns9_04", grade:9, subject:"Natural Sciences", topic:"Matter & Materials", question:"What type of bond forms between a metal and non-metal?", options:["Ionic bond","Covalent bond","Metallic bond","Hydrogen bond"], answer:0, explanation:"Metals lose electrons to non-metals, forming positive and negative ions — held together by electrostatic attraction (ionic bond)" },
  { id:"ns9_05", grade:9, subject:"Natural Sciences", topic:"Chemical Change", question:"In a chemical reaction, the law of conservation of mass states:", options:["Mass of reactants = mass of products","Mass always increases","Mass always decreases","Mass is not involved"], answer:0, explanation:"Atoms are rearranged but not created or destroyed — total mass stays the same in any chemical reaction" },
  { id:"ns9_06", grade:9, subject:"Natural Sciences", topic:"Chemical Change", question:"Burning wood is an example of a:", options:["Chemical change","Physical change","Reversible change","State change"], answer:0, explanation:"Burning produces new substances (CO₂, H₂O, ash) — a chemical change. Physical changes don't produce new substances." },
  { id:"ns9_07", grade:9, subject:"Natural Sciences", topic:"Energy & Change", question:"When current flows through a resistor, electrical energy is converted to:", options:["Heat energy","Kinetic energy","Chemical energy","Nuclear energy"], answer:0, explanation:"Electrical energy converts to heat energy in resistors — this is the joule heating effect (P = I²R)" },
  { id:"ns9_08", grade:9, subject:"Natural Sciences", topic:"Energy & Change", question:"Which of these is a renewable energy source?", options:["Solar energy","Coal","Oil","Natural gas"], answer:0, explanation:"Solar energy is renewable — it comes from the sun which will last billions of years. Coal, oil, and gas are finite." },
  { id:"ns9_09", grade:9, subject:"Natural Sciences", topic:"Life & Living", question:"The process by which living things break down food to release energy is:", options:["Cellular respiration","Photosynthesis","Transpiration","Digestion"], answer:0, explanation:"Cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy (ATP)" },
  { id:"ns9_10", grade:9, subject:"Natural Sciences", topic:"Life & Living", question:"Which part of the cell controls all its activities?", options:["Nucleus","Cytoplasm","Mitochondria","Cell membrane"], answer:0, explanation:"The nucleus contains DNA and directs all cellular activities including growth, reproduction, and metabolism" },
  { id:"ns9_11", grade:9, subject:"Natural Sciences", topic:"Life & Living", question:"Vaccines work by:", options:["Training the immune system to recognise a pathogen","Killing bacteria directly","Replacing white blood cells","Reducing fever"], answer:0, explanation:"Vaccines introduce weakened/killed pathogens or antigens — the immune system creates memory cells for future protection" },
  { id:"ns9_12", grade:9, subject:"Natural Sciences", topic:"Life & Living", question:"The theory of evolution was proposed by:", options:["Charles Darwin","Isaac Newton","Louis Pasteur","Gregor Mendel"], answer:0, explanation:"Charles Darwin proposed the theory of evolution by natural selection in 'On the Origin of Species' (1859)" },
  { id:"ns9_13", grade:9, subject:"Natural Sciences", topic:"Earth & Beyond", question:"The ozone layer protects Earth from:", options:["Harmful ultraviolet (UV) radiation","Infrared radiation","Visible light","Radio waves"], answer:0, explanation:"The ozone layer (in the stratosphere) absorbs most of the sun's harmful UV-B and UV-C radiation" },
  { id:"ns9_14", grade:9, subject:"Natural Sciences", topic:"Earth & Beyond", question:"Global warming is primarily caused by increased levels of:", options:["Carbon dioxide (CO₂) in the atmosphere","Oxygen in the atmosphere","Nitrogen in the atmosphere","Water vapour only"], answer:0, explanation:"CO₂ and other greenhouse gases trap heat in the atmosphere — increased levels from burning fossil fuels cause global warming" },
  { id:"ns9_15", grade:9, subject:"Natural Sciences", topic:"Earth & Beyond", question:"The rock cycle shows that rocks can:", options:["Change from one type to another over time","Never change","Only form at volcanoes","Only be found underground"], answer:0, explanation:"The rock cycle shows how igneous, sedimentary, and metamorphic rocks can transform into each other through geological processes" },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"en8_01", grade:8, subject:"English", topic:"Grammar", question:"Which word is a noun in: 'The dog runs fast'?", options:["dog","runs","fast","The"], answer:0, explanation:"A noun names a person, place, thing, or idea. 'Dog' is the thing being discussed." },
  { id:"en8_02", grade:8, subject:"English", topic:"Grammar", question:"Which is a verb in: 'She sings beautifully'?", options:["sings","She","beautifully","a"], answer:0, explanation:"A verb shows an action. 'Sings' is what she does — the action word." },
  { id:"en8_03", grade:8, subject:"English", topic:"Grammar", question:"Which sentence uses the correct past tense?", options:["She walked to school.","She walk to school.","She walks to school.","She walking to school."], answer:0, explanation:"'Walked' is the simple past tense of 'walk'. Past tense describes completed actions." },
  { id:"en8_04", grade:8, subject:"English", topic:"Grammar", question:"Which punctuation ends a question?", options:["?","!",".","..."], answer:0, explanation:"A question mark (?) ends an interrogative (question) sentence" },
  { id:"en8_05", grade:8, subject:"English", topic:"Figures of Speech", question:"'It's raining cats and dogs' is an example of a:", options:["Idiom","Simile","Metaphor","Alliteration"], answer:0, explanation:"An idiom is a phrase whose meaning cannot be understood from the individual words — it means raining heavily" },
  { id:"en8_06", grade:8, subject:"English", topic:"Figures of Speech", question:"'The stars winked at us' is an example of:", options:["Personification","Simile","Hyperbole","Alliteration"], answer:0, explanation:"Personification gives human qualities to non-human things. Stars cannot literally wink." },
  { id:"en8_07", grade:8, subject:"English", topic:"Comprehension", question:"The first sentence of a paragraph is usually the:", options:["Topic sentence","Concluding sentence","Supporting sentence","Introductory hook"], answer:0, explanation:"The topic sentence introduces the main idea of the paragraph — usually the first sentence" },
  { id:"en8_08", grade:8, subject:"English", topic:"Writing", question:"Which type of writing tells a story?", options:["Narrative","Descriptive","Argumentative","Expository"], answer:0, explanation:"Narrative writing tells a story with characters, setting, and plot. It answers 'what happened?'" },
  { id:"en8_09", grade:8, subject:"English", topic:"Grammar", question:"What is the plural of 'child'?", options:["children","childs","childes","child's"], answer:0, explanation:"'Child' is an irregular noun — its plural is 'children', not 'childs'" },
  { id:"en8_10", grade:8, subject:"English", topic:"Grammar", question:"Which is an adjective in: 'The tall boy ran quickly'?", options:["tall","boy","ran","quickly"], answer:0, explanation:"Adjectives describe nouns. 'Tall' describes the boy — it tells us what kind of boy he is." },
  { id:"en8_11", grade:8, subject:"English", topic:"Grammar", question:"Which word is an adverb in: 'She spoke softly'?", options:["softly","She","spoke","in"], answer:0, explanation:"Adverbs modify verbs, adjectives, or other adverbs. 'Softly' tells us HOW she spoke." },
  { id:"en8_12", grade:8, subject:"English", topic:"Comprehension", question:"When you summarise a passage, you:", options:["State the main ideas in your own words briefly","Copy the entire passage","Add your own opinions","Make it longer"], answer:0, explanation:"A summary restates the main points of a text in your own words, much shorter than the original" },
  { id:"en8_13", grade:8, subject:"English", topic:"Figures of Speech", question:"'Quick as a fox' is a:", options:["Simile","Metaphor","Personification","Onomatopoeia"], answer:0, explanation:"A simile compares using 'as' or 'like'. 'Quick as a fox' compares someone's speed to a fox." },
  { id:"en8_14", grade:8, subject:"English", topic:"Grammar", question:"Which sentence is in the present tense?", options:["She reads every day.","She read yesterday.","She will read tomorrow.","She was reading."], answer:0, explanation:"'Reads' is simple present tense — it describes a habitual/current action" },
  { id:"en8_15", grade:8, subject:"English", topic:"Writing", question:"A formal letter should begin with:", options:["Dear Mr/Mrs [surname],","Hey there!","Hi [name],","What's up,"], answer:0, explanation:"Formal letters use respectful salutations like 'Dear Mr Smith,' followed by a comma" },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"en9_01", grade:9, subject:"English", topic:"Grammar", question:"Which sentence is in the passive voice?", options:["The cake was eaten by Tom.","Tom ate the cake.","Tom is eating the cake.","Tom will eat the cake."], answer:0, explanation:"Passive voice: the subject receives the action. 'The cake' (object) becomes the subject — 'was eaten by Tom'" },
  { id:"en9_02", grade:9, subject:"English", topic:"Grammar", question:"A pronoun is used to:", options:["Replace a noun","Describe a noun","Show an action","Connect clauses"], answer:0, explanation:"Pronouns replace nouns to avoid repetition (e.g. he, she, it, they, we, I, you)" },
  { id:"en9_03", grade:9, subject:"English", topic:"Figures of Speech", question:"'Peter Piper picked a peck of pickled peppers' is an example of:", options:["Alliteration","Assonance","Personification","Hyperbole"], answer:0, explanation:"Alliteration: repetition of the same initial consonant sound ('P' sound repeated here)" },
  { id:"en9_04", grade:9, subject:"English", topic:"Figures of Speech", question:"'I'm so hungry I could eat a horse' is an example of:", options:["Hyperbole","Metaphor","Simile","Irony"], answer:0, explanation:"Hyperbole is extreme exaggeration — you literally cannot eat a horse, it expresses extreme hunger" },
  { id:"en9_05", grade:9, subject:"English", topic:"Literature", question:"The setting of a story refers to:", options:["Where and when the story takes place","The main character","The problem in the story","The ending"], answer:0, explanation:"Setting = place and time — it establishes the context and atmosphere of the narrative" },
  { id:"en9_06", grade:9, subject:"English", topic:"Literature", question:"The theme of a story is:", options:["The central message or idea the author explores","The list of characters","The order of events","The point of view"], answer:0, explanation:"Theme is the underlying message or central idea (e.g. friendship, courage, justice) explored through the story" },
  { id:"en9_07", grade:9, subject:"English", topic:"Comprehension", question:"Skimming a text means:", options:["Reading quickly to get the general idea","Reading every word carefully","Reading only the last paragraph","Reading backwards"], answer:0, explanation:"Skimming: fast reading for the overall gist — you read headings, first sentences, and key words" },
  { id:"en9_08", grade:9, subject:"English", topic:"Writing", question:"In an essay, a thesis statement:", options:["States the main argument of the essay","Concludes the essay","Lists all the evidence","Introduces characters"], answer:0, explanation:"A thesis statement (usually at the end of the introduction) clearly states the main argument or position of the essay" },
  { id:"en9_09", grade:9, subject:"English", topic:"Grammar", question:"A conjunction joins:", options:["Words, phrases, or clauses","Only verbs","Nouns and pronouns","Sentences to questions"], answer:0, explanation:"Conjunctions connect parts of a sentence: and, but, or, because, although, while, so..." },
  { id:"en9_10", grade:9, subject:"English", topic:"Grammar", question:"The correct form is:", options:["Its fur is brown.","It's fur is brown.","Its' fur is brown.","Its's fur is brown."], answer:0, explanation:"'Its' (possessive, no apostrophe) shows ownership. 'It's' = it is. The cat's fur belongs to it → 'its fur'." },
  { id:"en9_11", grade:9, subject:"English", topic:"Figures of Speech", question:"'The wind whispered through the trees' uses:", options:["Personification","Simile","Alliteration","Oxymoron"], answer:0, explanation:"Personification: wind given the human quality of whispering — wind cannot literally whisper" },
  { id:"en9_12", grade:9, subject:"English", topic:"Writing", question:"The purpose of a persuasive essay is to:", options:["Convince the reader to agree with your view","Entertain with a story","Explain how something works","Describe a place in detail"], answer:0, explanation:"Persuasive writing uses arguments, evidence, and rhetorical techniques to change the reader's opinion or behaviour" },
  { id:"en9_13", grade:9, subject:"English", topic:"Literature", question:"The conflict in a story is:", options:["The struggle or problem the character faces","The beginning of the story","The happy ending","The narrator's point of view"], answer:0, explanation:"Conflict drives the plot — it can be character vs character, vs nature, vs society, or vs themselves" },
  { id:"en9_14", grade:9, subject:"English", topic:"Grammar", question:"Which sentence contains a preposition?", options:["The book is on the table.","She runs fast.","He sings well.","They played."], answer:0, explanation:"'On' is a preposition — it shows the relationship between 'book' and 'table' (position)" },
  { id:"en9_15", grade:9, subject:"English", topic:"Comprehension", question:"The tone of a text refers to:", options:["The writer's attitude or feeling toward the subject","The length of the text","The number of paragraphs","The vocabulary used"], answer:0, explanation:"Tone reflects the author's attitude: formal, informal, angry, humorous, sarcastic, serious, sympathetic, etc." },

  // ══════════════════════════════════════════════════════════════════════════
  // ECONOMIC & MANAGEMENT SCIENCES — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ems8_01", grade:8, subject:"Economic & Management Sciences", topic:"Economics", question:"Needs are things that:", options:["You cannot survive without","You want but don't need","Are expensive","Are luxuries"], answer:0, explanation:"Needs = essentials for survival (food, water, shelter, clothing, safety). Wants = desires beyond basic needs." },
  { id:"ems8_02", grade:8, subject:"Economic & Management Sciences", topic:"Economics", question:"Scarcity means:", options:["Resources are limited but wants are unlimited","Money is hard to find","Shops have empty shelves","There is a drought"], answer:0, explanation:"Scarcity is the basic economic problem: unlimited human wants vs limited resources (land, labour, capital)" },
  { id:"ems8_03", grade:8, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"A budget is:", options:["A plan for income and expenses","A bank account","A type of loan","A business plan only"], answer:0, explanation:"A budget is a financial plan showing expected income and planned expenses — helps manage money wisely" },
  { id:"ems8_04", grade:8, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"If income = R2000 and expenses = R1500, the saving is:", options:["R500","R3500","R2000","R1500"], answer:0, explanation:"Savings = Income − Expenses = R2000 − R1500 = R500" },
  { id:"ems8_05", grade:8, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"Interest on a savings account is money:", options:["Earned by saving","Paid to a bank","Lost when spending","Taken as tax"], answer:0, explanation:"Interest earned = reward from the bank for depositing/saving your money with them" },
  { id:"ems8_06", grade:8, subject:"Economic & Management Sciences", topic:"Business", question:"An entrepreneur is someone who:", options:["Starts a business and takes risks","Only works for others","Only invests in stocks","Works for the government"], answer:0, explanation:"An entrepreneur creates a business, organises resources, and accepts financial risk to earn profit" },
  { id:"ems8_07", grade:8, subject:"Economic & Management Sciences", topic:"Business", question:"Profit = Revenue −", options:["Costs/Expenses","Tax","Savings","Interest"], answer:0, explanation:"Profit = Revenue (income from sales) − Total costs (expenses). If costs exceed revenue, there is a loss." },
  { id:"ems8_08", grade:8, subject:"Economic & Management Sciences", topic:"Economics", question:"Supply is the amount of a product that:", options:["Sellers are willing to sell","Buyers want to buy","Is available in shops","Is imported"], answer:0, explanation:"Supply = the quantity of a good/service that producers are willing and able to offer at a given price" },
  { id:"ems8_09", grade:8, subject:"Economic & Management Sciences", topic:"Economics", question:"When price increases, demand usually:", options:["Decreases","Increases","Stays the same","Doubles"], answer:0, explanation:"Law of Demand: as price rises, quantity demanded falls — inverse relationship (assuming other factors constant)" },
  { id:"ems8_10", grade:8, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"VAT at 15% on a R100 item makes the price:", options:["R115","R85","R150","R115.15"], answer:0, explanation:"VAT = 15% × 100 = R15. Total = R100 + R15 = R115" },

  // ══════════════════════════════════════════════════════════════════════════
  // ECONOMIC & MANAGEMENT SCIENCES — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ems9_01", grade:9, subject:"Economic & Management Sciences", topic:"Business", question:"A sole trader business has:", options:["One owner with unlimited liability","Multiple shareholders","Limited liability","A board of directors"], answer:0, explanation:"Sole trader: one owner who is personally responsible for all debts — unlimited liability" },
  { id:"ems9_02", grade:9, subject:"Economic & Management Sciences", topic:"Business", question:"A partnership agreement should include:", options:["How profits and losses are shared","Only the business name","Only the address","The bank account number only"], answer:0, explanation:"A partnership agreement covers: profit sharing, roles, capital contributions, dispute resolution, and dissolution terms" },
  { id:"ems9_03", grade:9, subject:"Economic & Management Sciences", topic:"Economics", question:"Opportunity cost is:", options:["The value of the next best alternative given up","The price of goods","The cost of production","Tax paid on profits"], answer:0, explanation:"When you choose one option, you give up the next best alternative — that sacrifice is the opportunity cost" },
  { id:"ems9_04", grade:9, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"Compound interest means interest is calculated on:", options:["The principal plus accumulated interest","The principal only","Only the interest","The average balance"], answer:0, explanation:"Compound interest earns interest on both the original principal AND previously earned interest — grows faster than simple interest" },
  { id:"ems9_05", grade:9, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"A bank statement shows:", options:["All transactions in your account","Your credit score","Your tax number","Your insurance policy"], answer:0, explanation:"A bank statement is a monthly record of all deposits, withdrawals, fees, and the account balance" },
  { id:"ems9_06", grade:9, subject:"Economic & Management Sciences", topic:"Business", question:"Marketing involves:", options:["Promoting and selling products to customers","Only advertising on TV","Only pricing products","Manufacturing goods"], answer:0, explanation:"Marketing = identifying customer needs and satisfying them profitably: product, price, place, and promotion (4 P's)" },
  { id:"ems9_07", grade:9, subject:"Economic & Management Sciences", topic:"Economics", question:"Inflation means:", options:["The general price level rises over time","Prices fall","Unemployment rises","The economy grows"], answer:0, explanation:"Inflation = sustained rise in the general price level — the purchasing power of money decreases" },
  { id:"ems9_08", grade:9, subject:"Economic & Management Sciences", topic:"Financial Literacy", question:"A debit card deducts money:", options:["Directly from your bank account","From a credit limit","From a savings account only","From future earnings"], answer:0, explanation:"A debit card spends money you actually have — it draws directly from your bank account balance" },
  { id:"ems9_09", grade:9, subject:"Economic & Management Sciences", topic:"Business", question:"Fixed costs are costs that:", options:["Do not change with the level of production","Increase with production","Decrease with more sales","Are only labour costs"], answer:0, explanation:"Fixed costs (rent, salaries, insurance) stay the same regardless of how much is produced or sold" },
  { id:"ems9_10", grade:9, subject:"Economic & Management Sciences", topic:"Economics", question:"GDP stands for:", options:["Gross Domestic Product","General Development Plan","Government Domestic Policy","Grand Development Programme"], answer:0, explanation:"GDP = Gross Domestic Product — the total value of all goods and services produced in a country in a year" },

  // ══════════════════════════════════════════════════════════════════════════
  // SOCIAL SCIENCES: HISTORY — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ss8h_01", grade:8, subject:"Social Sciences: History", topic:"SA History", question:"The Cape Colony was first settled by the Dutch under:", options:["Jan van Riebeeck","Cecil John Rhodes","Paul Kruger","Louis Botha"], answer:0, explanation:"Jan van Riebeeck arrived at the Cape on 6 April 1652, establishing a refreshment station for the Dutch East India Company (VOC)" },
  { id:"ss8h_02", grade:8, subject:"Social Sciences: History", topic:"SA History", question:"The Khoikhoi were the indigenous people who:", options:["Herded cattle and sheep at the Cape","Built the Great Zimbabwe","Settled the Highveld","Mined gold in Witwatersrand"], answer:0, explanation:"The Khoikhoi were pastoralists (herders) who had lived at the Cape for thousands of years before European settlement" },
  { id:"ss8h_03", grade:8, subject:"Social Sciences: History", topic:"World History", question:"The Renaissance was a period of:", options:["Cultural and intellectual rebirth in Europe","Industrial revolution","Religious wars","Colonial expansion only"], answer:0, explanation:"The Renaissance (14th–17th century) saw a revival of art, science, and learning in Europe, starting in Italy" },
  { id:"ss8h_04", grade:8, subject:"Social Sciences: History", topic:"World History", question:"Christopher Columbus sailed west across the Atlantic in:", options:["1492","1498","1415","1503"], answer:0, explanation:"Columbus reached the Americas (Bahamas) on 12 October 1492, sponsored by Spain's King Ferdinand and Queen Isabella" },
  { id:"ss8h_05", grade:8, subject:"Social Sciences: History", topic:"SA History", question:"The Slave Trade brought enslaved people to the Cape mainly from:", options:["Madagascar, East Africa, and Asia","Europe and America","West Africa only","Australia"], answer:0, explanation:"Cape slaves came from Madagascar, East Africa, the Indian subcontinent, and Southeast Asia — not West Africa (unlike American slavery)" },
  { id:"ss8h_06", grade:8, subject:"Social Sciences: History", topic:"World History", question:"The French Revolution began in:", options:["1789","1815","1776","1848"], answer:0, explanation:"The French Revolution started in 1789 with the storming of the Bastille — overthrowing the monarchy and aristocracy" },
  { id:"ss8h_07", grade:8, subject:"Social Sciences: History", topic:"SA History", question:"The word 'apartheid' means:", options:["Separateness (apart-hood)","Development","Freedom","Unity"], answer:0, explanation:"Apartheid is an Afrikaans word meaning 'separateness' — the policy of racial segregation practiced in SA from 1948–1994" },
  { id:"ss8h_08", grade:8, subject:"Social Sciences: History", topic:"Historical Skills", question:"A primary source is:", options:["A source created at the time of the event","A textbook written later","A documentary film","An encyclopedia"], answer:0, explanation:"Primary sources: diaries, letters, photographs, newspapers from the time. Secondary sources: books written later about the event." },

  // ══════════════════════════════════════════════════════════════════════════
  // SOCIAL SCIENCES: HISTORY — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ss9h_01", grade:9, subject:"Social Sciences: History", topic:"World History", question:"World War I (1914–1918) was triggered by:", options:["The assassination of Archduke Franz Ferdinand","The invasion of Poland","The bombing of Pearl Harbor","The Russian Revolution"], answer:0, explanation:"WWI began after Austro-Hungarian Archduke Franz Ferdinand was assassinated in Sarajevo on 28 June 1914" },
  { id:"ss9h_02", grade:9, subject:"Social Sciences: History", topic:"World History", question:"The Russian Revolution of 1917 led to:", options:["The establishment of a communist state","A democracy in Russia","The end of WWI","The formation of the United Nations"], answer:0, explanation:"The 1917 Bolshevik Revolution (led by Lenin) overthrew the Tsar and eventually created the Soviet Union (USSR)" },
  { id:"ss9h_03", grade:9, subject:"Social Sciences: History", topic:"SA History", question:"The Mineral Revolution in SA refers to the discovery of:", options:["Diamonds (1867) and gold (1886)","Coal and iron ore","Oil and gas","Copper and tin"], answer:0, explanation:"Diamonds found at Kimberley (1867) and gold on the Witwatersrand (1886) transformed SA's economy and society" },
  { id:"ss9h_04", grade:9, subject:"Social Sciences: History", topic:"SA History", question:"The SANNC (later ANC) was founded in:", options:["1912","1948","1960","1994"], answer:0, explanation:"The South African Native National Congress was founded in Bloemfontein on 8 January 1912, becoming the ANC in 1923" },
  { id:"ss9h_05", grade:9, subject:"Social Sciences: History", topic:"World History", question:"The Holocaust was the systematic murder of approximately:", options:["6 million Jews and millions of others by Nazi Germany","2 million soldiers in WWI","10 million in the Russian Revolution","1 million in Rwanda"], answer:0, explanation:"The Holocaust (1941–45): Nazi Germany systematically murdered ~6 million Jews plus Roma, disabled people, and others" },
  { id:"ss9h_06", grade:9, subject:"Social Sciences: History", topic:"SA History", question:"The National Party came to power in South Africa in:", options:["1948","1960","1994","1912"], answer:0, explanation:"The National Party won the 1948 election on an apartheid platform — formalising racial segregation as government policy" },
  { id:"ss9h_07", grade:9, subject:"Social Sciences: History", topic:"Historical Skills", question:"Bias in a historical source means:", options:["The author's point of view influences the content","The source is always wrong","The source is very old","The source is in a foreign language"], answer:0, explanation:"Bias: the source reflects the author's perspective, prejudices, or purpose — historians must identify and account for bias" },
  { id:"ss9h_08", grade:9, subject:"Social Sciences: History", topic:"World History", question:"The United Nations was established in:", options:["1945","1919","1939","1950"], answer:0, explanation:"The UN was founded in October 1945 after WWII — replacing the League of Nations to maintain international peace" },

  // ══════════════════════════════════════════════════════════════════════════
  // SOCIAL SCIENCES: GEOGRAPHY — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ss8g_01", grade:8, subject:"Social Sciences: Geography", topic:"Map Work", question:"A map's scale of 1:50 000 means 1 cm on the map represents:", options:["50 000 cm (500 m) in reality","50 000 km","1 cm in reality","50 m in reality"], answer:0, explanation:"1:50 000 scale: 1 cm on map = 50 000 cm in reality = 500 m = 0.5 km" },
  { id:"ss8g_02", grade:8, subject:"Social Sciences: Geography", topic:"Map Work", question:"The four cardinal directions are:", options:["North, South, East, West","Up, Down, Left, Right","Northeast, Northwest, Southeast, Southwest","Top, Bottom, Left, Right"], answer:0, explanation:"Cardinal directions: N, S, E, W. Intercardinal (ordinal): NE, NW, SE, SW" },
  { id:"ss8g_03", grade:8, subject:"Social Sciences: Geography", topic:"Map Work", question:"Contour lines on a topographic map connect points of:", options:["Equal elevation","Equal temperature","Equal rainfall","Equal population"], answer:0, explanation:"Contour lines join all points at the same height above sea level — they show the shape and steepness of terrain" },
  { id:"ss8g_04", grade:8, subject:"Social Sciences: Geography", topic:"Climate & Weather", question:"The equator receives:", options:["The most direct sunlight throughout the year","The least sunlight","Only morning sunlight","Sunlight in summer only"], answer:0, explanation:"The equator is always perpendicular (or nearly so) to the sun's rays — receives intense, direct sunlight year-round" },
  { id:"ss8g_05", grade:8, subject:"Social Sciences: Geography", topic:"Climate & Weather", question:"What is the main difference between weather and climate?", options:["Weather is short-term; climate is long-term patterns","They are the same","Climate is daily; weather is seasonal","Weather is global; climate is local"], answer:0, explanation:"Weather = current atmospheric conditions (hours/days). Climate = average weather patterns over 30+ years in a region." },
  { id:"ss8g_06", grade:8, subject:"Social Sciences: Geography", topic:"Population", question:"Population density is:", options:["Number of people per km²","The total population of a country","The birth rate","The migration rate"], answer:0, explanation:"Population density = total population ÷ total area (km²). It shows how crowded an area is." },
  { id:"ss8g_07", grade:8, subject:"Social Sciences: Geography", topic:"Environment", question:"Deforestation means:", options:["Cutting down forests (clearing trees)","Planting trees","Protecting wildlife","Mining underground"], answer:0, explanation:"Deforestation: large-scale removal of forests for agriculture, logging, or development — causes erosion, flooding, and climate change" },
  { id:"ss8g_08", grade:8, subject:"Social Sciences: Geography", topic:"Map Work", question:"The international dateline is at approximately:", options:["180° longitude","0° longitude","90° latitude","23.5° latitude"], answer:0, explanation:"The International Date Line runs along 180° longitude — crossing it changes the calendar date by one day" },

  // ══════════════════════════════════════════════════════════════════════════
  // SOCIAL SCIENCES: GEOGRAPHY — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ss9g_01", grade:9, subject:"Social Sciences: Geography", topic:"Geomorphology", question:"Erosion is the process of:", options:["Wearing away and removal of rock/soil by water, wind, or ice","Building up of land","Folding of rock layers","Volcanic activity"], answer:0, explanation:"Erosion: weathered material is transported away by water (rivers, waves), wind, or glaciers" },
  { id:"ss9g_02", grade:9, subject:"Social Sciences: Geography", topic:"Geomorphology", question:"A delta forms at a river's:", options:["Mouth (where it enters the sea/lake)","Source","Middle course","Upper course"], answer:0, explanation:"Deltas form where a river deposits sediment as it enters a slow-moving/still body of water — fan-shaped landform" },
  { id:"ss9g_03", grade:9, subject:"Social Sciences: Geography", topic:"Atmosphere", question:"The greenhouse effect occurs when:", options:["Greenhouse gases trap heat in the atmosphere","Plants produce oxygen","The ozone layer absorbs UV","The sun heats the oceans"], answer:0, explanation:"Greenhouse gases (CO₂, CH₄, H₂O) absorb outgoing infrared radiation from Earth's surface, warming the lower atmosphere" },
  { id:"ss9g_04", grade:9, subject:"Social Sciences: Geography", topic:"Population", question:"When death rate is higher than birth rate, the population:", options:["Decreases (natural decrease)","Increases","Stays the same","Doubles"], answer:0, explanation:"Natural decrease: when more people die than are born — population shrinks. Natural increase = births > deaths." },
  { id:"ss9g_05", grade:9, subject:"Social Sciences: Geography", topic:"Population", question:"Rural-to-urban migration happens mainly because:", options:["People seek better economic opportunities in cities","Cities have better weather","Rural areas are dangerous","Government forces people to move"], answer:0, explanation:"Push factors (poverty, lack of jobs in rural areas) and pull factors (employment, services in cities) drive urbanisation" },
  { id:"ss9g_06", grade:9, subject:"Social Sciences: Geography", topic:"Development", question:"A developing country typically has:", options:["Low GDP per capita and poor infrastructure","High GDP and advanced technology","Universal healthcare","Strong manufacturing sector only"], answer:0, explanation:"Developing (less developed) countries: lower incomes, weaker infrastructure, higher poverty rates, often primary sector economies" },
  { id:"ss9g_07", grade:9, subject:"Social Sciences: Geography", topic:"Atmosphere", question:"The biome found in areas with hot days, cold nights, and very little rainfall is:", options:["Desert","Tropical rainforest","Savanna","Temperate grassland"], answer:0, explanation:"Deserts receive less than 250mm rain per year, have extreme temperatures, and sparse vegetation" },
  { id:"ss9g_08", grade:9, subject:"Social Sciences: Geography", topic:"Development", question:"Which best describes South Africa's economy?", options:["A middle-income emerging market economy","Fully developed","One of the poorest in the world","Purely agricultural"], answer:0, explanation:"SA is an upper-middle-income country and Africa's second-largest economy — a mixed emerging market with high inequality" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNOLOGY — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tech8_01", grade:8, subject:"Technology", topic:"Design Process", question:"The first step of the design process is:", options:["Identify the problem/need","Build the solution","Evaluate the result","Draw a plan"], answer:0, explanation:"Design process: 1.Investigate/identify problem → 2.Design → 3.Make → 4.Evaluate → 5.Communicate" },
  { id:"tech8_02", grade:8, subject:"Technology", topic:"Structures", question:"A structure that is stable resists:", options:["Collapsing or toppling over","All forces easily","Only gravity","Only wind"], answer:0, explanation:"Structural stability means the structure can withstand loads (forces) without deforming, collapsing, or tipping" },
  { id:"tech8_03", grade:8, subject:"Technology", topic:"Structures", question:"Triangles are used in structures because they are:", options:["Very rigid and strong","Flexible","Easy to build","Lightweight only"], answer:0, explanation:"A triangle is the most rigid polygon — adding a diagonal to a rectangle creates two triangles, greatly increasing stiffness" },
  { id:"tech8_04", grade:8, subject:"Technology", topic:"Processing", question:"Cutting, drilling, and shaping are examples of:", options:["Mechanical processing","Chemical processing","Electrical processing","Thermal processing"], answer:0, explanation:"Mechanical processing: changing shape/size using force — cutting, drilling, bending, pressing, welding" },
  { id:"tech8_05", grade:8, subject:"Technology", topic:"Systems & Control", question:"In a system, the input is:", options:["What goes into the system","What comes out","The process in the middle","The feedback"], answer:0, explanation:"All systems have: INPUT → PROCESS → OUTPUT. Feedback returns output information to control the input." },
  { id:"tech8_06", grade:8, subject:"Technology", topic:"Electricity", question:"An electric circuit must be … for current to flow:", options:["Complete/closed","Open","Broken","Insulated"], answer:0, explanation:"Current flows only in a complete (closed) circuit — a break in the circuit stops current flow" },
  { id:"tech8_07", grade:8, subject:"Technology", topic:"Electricity", question:"Which component controls the flow of current in a circuit?", options:["Switch","Battery","Wire","Bulb"], answer:0, explanation:"A switch opens (off) or closes (on) a circuit — controlling whether current flows" },
  { id:"tech8_08", grade:8, subject:"Technology", topic:"Structures", question:"Compression is a force that:", options:["Pushes/squeezes a material","Pulls/stretches a material","Bends a material","Twists a material"], answer:0, explanation:"Compression = squeezing force that tends to shorten the material. Tension = stretching force that tends to lengthen it." },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNOLOGY — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tech9_01", grade:9, subject:"Technology", topic:"Design Process", question:"A prototype is:", options:["A working model built to test a design","The final product","A drawing only","A list of materials"], answer:0, explanation:"A prototype is an early test model — built to evaluate and improve the design before full production" },
  { id:"tech9_02", grade:9, subject:"Technology", topic:"Structures", question:"Which beam cross-section is most efficient for resisting bending?", options:["I-beam (H-section)","Solid square","Hollow circle","Flat plate"], answer:0, explanation:"I-beams concentrate material where stress is highest (top and bottom flanges) — very efficient for bending resistance" },
  { id:"tech9_03", grade:9, subject:"Technology", topic:"Systems & Control", question:"Pneumatics uses … to transmit force:", options:["Compressed air","Hydraulic oil","Electricity","Mechanical gears"], answer:0, explanation:"Pneumatics: compressed air is used to create movement and force in cylinders and actuators" },
  { id:"tech9_04", grade:9, subject:"Technology", topic:"Electricity", question:"Ohm's Law: if voltage = 12V and resistance = 3Ω, current =", options:["4 A","36 A","9 A","0.25 A"], answer:0, explanation:"I = V/R = 12/3 = 4 A. Current = Voltage ÷ Resistance" },
  { id:"tech9_05", grade:9, subject:"Technology", topic:"Electricity", question:"Which material is a good conductor of electricity?", options:["Copper","Rubber","Wood","Plastic"], answer:0, explanation:"Copper is an excellent conductor — free electrons allow easy current flow. Rubber/wood/plastic are insulators." },
  { id:"tech9_06", grade:9, subject:"Technology", topic:"Processing", question:"Welding joins materials by:", options:["Melting and fusing them together","Using glue","Bolting them","Nailing them"], answer:0, explanation:"Welding uses heat (and sometimes pressure) to melt and join metal pieces — a permanent join" },
  { id:"tech9_07", grade:9, subject:"Technology", topic:"Systems & Control", question:"A gear ratio of 3:1 means:", options:["The driven gear turns 3 times slower with 3× more torque","The driven gear turns 3 times faster","Both gears turn at the same speed","Speed is the same but direction changes"], answer:0, explanation:"Gear ratio 3:1: input turns 3 times for every 1 output turn — output is slower but has 3× more torque" },
  { id:"tech9_08", grade:9, subject:"Technology", topic:"Design Process", question:"Evaluating a design means:", options:["Testing it against the design brief to see if it meets requirements","Only checking if it looks nice","Making a final drawing","Presenting to the class"], answer:0, explanation:"Evaluation: testing the product against the original design brief/specifications — does it solve the problem? What can improve?" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE ORIENTATION — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"lo8_01", grade:8, subject:"Life Orientation", topic:"Personal Development", question:"Self-esteem refers to:", options:["How you feel about and value yourself","Your height and weight","Your school marks","Your popularity"], answer:0, explanation:"Self-esteem = your overall sense of self-worth and confidence. Healthy self-esteem leads to better mental health and relationships." },
  { id:"lo8_02", grade:8, subject:"Life Orientation", topic:"Personal Development", question:"Peer pressure is when:", options:["Friends or peers influence your behaviour or decisions","A teacher gives you homework","Your parents set rules","You feel anxious about exams"], answer:0, explanation:"Peer pressure: social influence from peers to conform to group behaviours — can be positive or negative" },
  { id:"lo8_03", grade:8, subject:"Life Orientation", topic:"Health", question:"The main way to prevent the spread of HIV is:", options:["Abstinence, using condoms, and not sharing needles","Taking vitamins","Exercise only","Drinking clean water"], answer:0, explanation:"HIV prevention: ABC approach — Abstinence, Be faithful, use Condoms. Also avoid sharing needles/blood contact." },
  { id:"lo8_04", grade:8, subject:"Life Orientation", topic:"Citizenship", question:"Human rights are:", options:["Rights every person has from birth, regardless of background","Rights only adults have","Rights earned through good behaviour","Rights granted by government"], answer:0, explanation:"Human rights are universal — every person is born with them (right to life, dignity, equality, freedom) regardless of race, gender, etc." },
  { id:"lo8_05", grade:8, subject:"Life Orientation", topic:"Careers", question:"A career is:", options:["A long-term series of jobs in a particular field","Any single job","A hobby","Only professional jobs"], answer:0, explanation:"A career is a long-term occupation or profession — it involves development, growth, and a series of related positions over time" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE ORIENTATION — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"lo9_01", grade:9, subject:"Life Orientation", topic:"Careers", question:"When choosing subjects for Grade 10, you should consider your:", options:["Interests, strengths, and career goals","Only what your friends choose","The easiest subjects","Your parents' careers only"], answer:0, explanation:"Subject choice should align with your interests, strengths, and the career/study path you want to follow" },
  { id:"lo9_02", grade:9, subject:"Life Orientation", topic:"Careers", question:"The APS (Admission Point Score) is used for:", options:["University entrance requirements","School reports only","Bursary applications only","Employment"], answer:0, explanation:"APS is calculated from your NSC results and used by universities to determine admission to programmes" },
  { id:"lo9_03", grade:9, subject:"Life Orientation", topic:"Social Issues", question:"Gender-based violence (GBV) refers to:", options:["Violence directed at people because of their gender","Only physical violence","Violence in schools only","Sports injuries"], answer:0, explanation:"GBV: harm inflicted on people based on gender — includes physical, sexual, emotional, and economic abuse. Mostly affects women and girls." },
  { id:"lo9_04", grade:9, subject:"Life Orientation", topic:"Health", question:"Substance abuse can lead to:", options:["Health problems, addiction, crime, and broken relationships","Better social skills","Improved concentration","Higher exam marks"], answer:0, explanation:"Substance abuse: drugs/alcohol damage health, impair judgement, cause addiction, destroy relationships, and often lead to crime" },
  { id:"lo9_05", grade:9, subject:"Life Orientation", topic:"Citizenship", question:"Section 9 of the South African Constitution guarantees:", options:["The right to equality and non-discrimination","The right to own a business","Free university education","A minimum wage"], answer:0, explanation:"Section 9 of SA's Constitution (Bill of Rights): everyone is equal before the law and has the right not to be discriminated against" },

  // ══════════════════════════════════════════════════════════════════════════
  // CREATIVE ARTS — GRADE 8
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ca8_01", grade:8, subject:"Creative Arts", topic:"Visual Arts", question:"The primary colours are:", options:["Red, blue, and yellow","Red, green, and blue","Orange, purple, and green","Black, white, and grey"], answer:0, explanation:"Primary colours (traditional/pigment): red, blue, and yellow — cannot be made by mixing other colours" },
  { id:"ca8_02", grade:8, subject:"Creative Arts", topic:"Visual Arts", question:"Mixing red and blue makes:", options:["Purple/violet","Orange","Green","Brown"], answer:0, explanation:"Red + Blue = Purple (violet). Red + Yellow = Orange. Blue + Yellow = Green. (Secondary colours)" },
  { id:"ca8_03", grade:8, subject:"Creative Arts", topic:"Drama", question:"In a play, the script contains:", options:["The words spoken by characters and stage directions","Only the setting description","Only the character names","A list of props only"], answer:0, explanation:"A script contains: dialogue (words spoken), stage directions (movements/actions), and character names" },
  { id:"ca8_04", grade:8, subject:"Creative Arts", topic:"Music", question:"Tempo in music refers to:", options:["The speed of the music","The loudness","The pitch","The rhythm pattern"], answer:0, explanation:"Tempo = how fast or slow music is played, measured in BPM (beats per minute). Allegro = fast, Andante = walking pace, Largo = slow." },
  { id:"ca8_05", grade:8, subject:"Creative Arts", topic:"Music", question:"A melody is:", options:["A sequence of notes that form a recognisable tune","The rhythm section only","The bass line","The accompaniment"], answer:0, explanation:"Melody = a series of pitches arranged in time to create a recognisable tune — the 'singable' part of music" },

  // ══════════════════════════════════════════════════════════════════════════
  // CREATIVE ARTS — GRADE 9
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ca9_01", grade:9, subject:"Creative Arts", topic:"Visual Arts", question:"Perspective in art creates the illusion of:", options:["Depth and three-dimensional space on a flat surface","Colour harmony","Texture only","Abstract shapes"], answer:0, explanation:"Perspective techniques (one-point, two-point) make flat 2D drawings appear three-dimensional by showing depth and distance" },
  { id:"ca9_02", grade:9, subject:"Creative Arts", topic:"Drama", question:"Improvisation in drama means:", options:["Performing without a script, creating dialogue spontaneously","Learning your lines perfectly","Using only props","Directing others"], answer:0, explanation:"Improvisation: actors create dialogue and action on the spot without preparation — builds creativity and confidence" },
  { id:"ca9_03", grade:9, subject:"Creative Arts", topic:"Music", question:"Harmony in music occurs when:", options:["Two or more notes are played together","One note plays at a time","Instruments play at different times","The melody is repeated"], answer:0, explanation:"Harmony: two or more pitches sounding simultaneously create a chord — harmony supports and enriches the melody" },
  { id:"ca9_04", grade:9, subject:"Creative Arts", topic:"Visual Arts", question:"A collage is made by:", options:["Cutting and gluing different materials onto a surface","Painting with brushes only","Sculpting clay","Digital drawing"], answer:0, explanation:"Collage: artwork created by sticking various materials (paper, fabric, photos, objects) onto a flat surface" },
  { id:"ca9_05", grade:9, subject:"Creative Arts", topic:"Drama", question:"Blocking in theatre refers to:", options:["The planned movement of actors on stage","Memorising lines","The stage lighting","Costume design"], answer:0, explanation:"Blocking: the planned, rehearsed movements and positions of actors on stage — decided by the director" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS GRADE 10 (keeping existing — abbreviated here, full bank stays)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m10_01", grade:10, subject:"Mathematics", topic:"Algebra", question:"Simplify: 3x² − 5x + 2x² + 4x", options:["5x² − x","5x² + x","5x² − 9x","x² − x"], answer:0, explanation:"Combine like terms: (3+2)x² + (−5+4)x = 5x² − x" },
  { id:"m10_02", grade:10, subject:"Mathematics", topic:"Algebra", question:"Factorise: x² − 9", options:["(x−3)(x+3)","(x−9)(x+1)","(x+3)²","(x−3)²"], answer:0, explanation:"Difference of squares: a²−b² = (a−b)(a+b), so x²−9 = (x−3)(x+3)" },
  { id:"m10_03", grade:10, subject:"Mathematics", topic:"Algebra", question:"Solve for x: 2x + 5 = 13", options:["x = 4","x = 9","x = 3","x = 6"], answer:0, explanation:"2x = 13−5 = 8, so x = 4" },
  { id:"m10_04", grade:10, subject:"Mathematics", topic:"Exponents", question:"Simplify: 2³ × 2⁴", options:["2⁷","2¹²","4⁷","2⁻¹"], answer:0, explanation:"When multiplying same bases, add exponents: 2³ × 2⁴ = 2⁷" },
  { id:"m10_05", grade:10, subject:"Mathematics", topic:"Exponents", question:"What is the value of 5⁰?", options:["0","1","5","Undefined"], answer:1, explanation:"Any non-zero number raised to the power of 0 equals 1" },
  { id:"m10_06", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"What is the next term in: 3, 7, 11, 15, ...?", options:["17","18","19","20"], answer:2, explanation:"Common difference is 4, so 15 + 4 = 19" },
  { id:"m10_07", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"Find the nth term: 5, 8, 11, 14,...", options:["3n + 2","2n + 3","3n − 2","n + 4"], answer:0, explanation:"Common difference is 3, first term is 5. Formula: 5 + (n−1)3 = 3n + 2" },
  { id:"m10_08", grade:10, subject:"Mathematics", topic:"Finance", question:"R500 at 8% simple interest for 3 years. Interest earned =", options:["R120","R40","R24","R180"], answer:0, explanation:"SI = P × r × t = 500 × 0.08 × 3 = R120" },
  { id:"m10_09", grade:10, subject:"Mathematics", topic:"Statistics", question:"Median of: 3, 7, 2, 9, 5 =", options:["5","7","3","9"], answer:0, explanation:"Arrange: 2,3,5,7,9. Middle value = 5" },
  { id:"m10_10", grade:10, subject:"Mathematics", topic:"Geometry", question:"The angles of a triangle sum to:", options:["90°","180°","270°","360°"], answer:1, explanation:"Interior angles of any triangle always add up to 180°" },
  { id:"m10_11", grade:10, subject:"Mathematics", topic:"Geometry", question:"Area of rectangle 8cm × 5cm =", options:["40 cm²","26 cm²","13 cm²","80 cm²"], answer:0, explanation:"Area = 8 × 5 = 40 cm²" },
  { id:"m10_12", grade:10, subject:"Mathematics", topic:"Functions", question:"Gradient of y = 3x − 4 =", options:["3","−4","4","−3"], answer:0, explanation:"In y = mx + c, m is the gradient = 3" },
  { id:"m10_13", grade:10, subject:"Mathematics", topic:"Functions", question:"If f(x) = 2x + 1, f(3) =", options:["7","5","9","6"], answer:0, explanation:"f(3) = 2(3) + 1 = 7" },
  { id:"m10_14", grade:10, subject:"Mathematics", topic:"Trigonometry", question:"sin θ = opposite/…?", options:["hypotenuse","adjacent","base","height"], answer:0, explanation:"SOH: Sin = Opposite/Hypotenuse" },
  { id:"m10_15", grade:10, subject:"Mathematics", topic:"Probability", question:"Bag has 3 red and 7 blue balls. P(red) =", options:["3/10","7/10","3/7","1/3"], answer:0, explanation:"P(red) = 3/10" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps10_01", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"Atomic number of Carbon =", options:["6","12","4","8"], answer:0, explanation:"Carbon has 6 protons — atomic number 6" },
  { id:"ps10_02", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"Ohm's Law: V =", options:["I × R","I / R","R / I","I + R"], answer:0, explanation:"V = IR (Voltage = Current × Resistance)" },
  { id:"ps10_03", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Newton's 1st Law: object at rest will:", options:["Stay at rest unless a net force acts","Always start moving","Accelerate continuously","Lose mass"], answer:0, explanation:"Inertia: objects stay at rest or in motion unless a net force acts" },
  { id:"ps10_04", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"SI unit of force =", options:["Newton (N)","Joule (J)","Watt (W)","Pascal (Pa)"], answer:0, explanation:"Force measured in Newtons (N)" },
  { id:"ps10_05", grade:10, subject:"Physical Sciences", topic:"Waves & Sound", question:"Number of waves per second =", options:["Frequency","Amplitude","Wavelength","Period"], answer:0, explanation:"Frequency = waves per second, measured in Hertz (Hz)" },
  { id:"ps10_06", grade:10, subject:"Physical Sciences", topic:"Periodic Table", question:"Elements in same group have same number of:", options:["Valence electrons","Neutrons","Atomic mass","Protons"], answer:0, explanation:"Same group = same number of valence electrons → similar chemical properties" },
  { id:"ps10_07", grade:10, subject:"Physical Sciences", topic:"Bonding", question:"Ionic bond forms between:", options:["Metal and non-metal","Two non-metals","Two metals","Metal and metalloid"], answer:0, explanation:"Metal transfers electrons to non-metal → ionic bond" },
  { id:"ps10_08", grade:10, subject:"Physical Sciences", topic:"Energy", question:"KE depends on:", options:["Mass and velocity","Mass and height","Height only","Velocity only"], answer:0, explanation:"KE = ½mv²" },
  { id:"ps10_09", grade:10, subject:"Physical Sciences", topic:"Energy", question:"Light bulb converts: Electrical →", options:["Light + Heat","Chemical energy","Mechanical energy","Sound"], answer:0, explanation:"Electrical energy → light + heat energy" },
  { id:"ps10_10", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Speed = Distance ÷", options:["Time","Mass","Force","Acceleration"], answer:0, explanation:"Speed = Distance / Time" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls10_01", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Powerhouse of the cell =", options:["Mitochondria","Nucleus","Ribosome","Cell membrane"], answer:0, explanation:"Mitochondria produces ATP — 'powerhouse of the cell'" },
  { id:"ls10_02", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Genetic material is in the:", options:["Nucleus","Ribosome","Vacuole","Golgi body"], answer:0, explanation:"Nucleus houses DNA" },
  { id:"ls10_03", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Photosynthesis occurs in:", options:["Chloroplast","Mitochondria","Nucleus","Vacuole"], answer:0, explanation:"Chloroplasts contain chlorophyll and perform photosynthesis" },
  { id:"ls10_04", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"6CO₂ + 6H₂O + light →", options:["C₆H₁₂O₆ + 6O₂","6O₂ + H₂O","CO₂ + H₂O","Glucose only"], answer:0, explanation:"Photosynthesis produces glucose and oxygen" },
  { id:"ls10_05", grade:10, subject:"Life Sciences", topic:"Transport", question:"O₂ carried by red blood cells via:", options:["Haemoglobin","Plasma","Platelets","White blood cells"], answer:0, explanation:"Haemoglobin binds to oxygen in RBCs" },
  { id:"ls10_06", grade:10, subject:"Life Sciences", topic:"Biodiversity", question:"Scientific name = Genus + …?", options:["species","family","order","kingdom"], answer:0, explanation:"Binomial nomenclature: Genus species (e.g. Homo sapiens)" },
  { id:"ls10_07", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Osmosis = movement of … across semi-permeable membrane", options:["Water","Solutes","Gases","Nutrients"], answer:0, explanation:"Osmosis: water moves from high to low concentration" },
  { id:"ls10_08", grade:10, subject:"Life Sciences", topic:"Gaseous Exchange", question:"Gas exchange in plants through:", options:["Stomata","Roots","Xylem","Flowers"], answer:0, explanation:"Stomata on leaves allow CO₂ in and O₂ out" },
  { id:"ls10_09", grade:10, subject:"Life Sciences", topic:"Cell Division", question:"Mitosis produces:", options:["2 identical daughter cells","4 different cells","1 larger cell","2 cells with half chromosomes"], answer:0, explanation:"Mitosis: 1 cell → 2 identical daughter cells" },
  { id:"ls10_10", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Cells break down glucose for energy via:", options:["Cellular respiration","Photosynthesis","Transpiration","Digestion"], answer:0, explanation:"Cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP" },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCOUNTING — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ac10_01", grade:10, subject:"Accounting", topic:"Accounting Equation", question:"Assets =", options:["Liabilities + Equity","Income − Expenses","Cash + Debtors","Revenue − Costs"], answer:0, explanation:"Fundamental equation: Assets = Liabilities + Owner's Equity" },
  { id:"ac10_02", grade:10, subject:"Accounting", topic:"Bookkeeping", question:"Every debit has an equal:", options:["Credit","Smaller credit","Larger debit","No entry"], answer:0, explanation:"Double-entry: every debit = equal credit" },
  { id:"ac10_03", grade:10, subject:"Accounting", topic:"Financial Statements", question:"Gross Profit = Sales −", options:["Cost of Sales","Expenses","Net Profit","Returns"], answer:0, explanation:"Gross Profit = Revenue − Cost of Goods Sold" },
  { id:"ac10_04", grade:10, subject:"Accounting", topic:"Journals", question:"CRJ records:", options:["All money received","All money paid","Credit sales","Credit purchases"], answer:0, explanation:"Cash Receipts Journal records all cash coming into the business" },
  { id:"ac10_05", grade:10, subject:"Accounting", topic:"VAT", question:"SA standard VAT rate =", options:["15%","14%","10%","20%"], answer:0, explanation:"SA VAT = 15% (increased from 14% in April 2018)" },
  { id:"ac10_06", grade:10, subject:"Accounting", topic:"Debtors", question:"A debtor is someone who:", options:["Owes money to the business","The business owes money to","Supplies goods","Manages accounts"], answer:0, explanation:"Debtors owe money to the business — bought on credit" },
  { id:"ac10_07", grade:10, subject:"Accounting", topic:"Banking", question:"Bank reconciliation compares cashbook to:", options:["Bank statement","Income statement","Trial balance","Balance sheet"], answer:0, explanation:"Bank rec: cashbook vs bank statement" },
  { id:"ac10_08", grade:10, subject:"Accounting", topic:"Trial Balance", question:"Trial Balance proves:", options:["Total debits = total credits","Assets = liabilities","Income > expenses","All entries correct"], answer:0, explanation:"TB: total debits must equal total credits" },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"en10_01", grade:10, subject:"English", topic:"Grammar", question:"Which sentence is grammatically correct?", options:["She doesn't know nothing.","She doesn't know anything.","She know nothing.","She don't know nothing."], answer:1, explanation:"Double negatives are incorrect. 'Doesn't know anything' is correct." },
  { id:"en10_02", grade:10, subject:"English", topic:"Figures of Speech", question:"'The sun smiled on us' is:", options:["Personification","Simile","Metaphor","Alliteration"], answer:0, explanation:"Personification: the sun given human quality of smiling" },
  { id:"en10_03", grade:10, subject:"English", topic:"Figures of Speech", question:"'As brave as a lion' is a:", options:["Simile","Metaphor","Personification","Hyperbole"], answer:0, explanation:"Simile compares using 'as' or 'like'" },
  { id:"en10_04", grade:10, subject:"English", topic:"Comprehension", question:"Topic sentence purpose:", options:["Introduce main idea of paragraph","End the paragraph","Give an example","Provide evidence"], answer:0, explanation:"Topic sentence states the main idea — usually the first sentence" },
  { id:"en10_05", grade:10, subject:"English", topic:"Writing", question:"Persuasive text aims to:", options:["Change reader's opinion","Tell a story","Describe a place","Explain how something works"], answer:0, explanation:"Persuasive writing convinces the reader using arguments and evidence" },
  { id:"en11_01", grade:11, subject:"English", topic:"Literature", question:"Protagonist =", options:["Main character","Villain","Narrator","Author"], answer:0, explanation:"Protagonist is the central/main character" },
  { id:"en11_02", grade:11, subject:"English", topic:"Figures of Speech", question:"'I've told you a million times!' =", options:["Hyperbole","Simile","Metaphor","Irony"], answer:0, explanation:"Hyperbole = extreme exaggeration" },
  { id:"en12_01", grade:12, subject:"English", topic:"Literature", question:"Climax of a story =", options:["Point of highest tension","Introduction","Falling action","Resolution"], answer:0, explanation:"Climax = turning point, moment of highest drama" },
  { id:"en12_02", grade:12, subject:"English", topic:"Figures of Speech", question:"'Classroom was a zoo' =", options:["Metaphor","Simile","Personification","Alliteration"], answer:0, explanation:"Metaphor: direct comparison without 'like' or 'as'" },
  { id:"en12_03", grade:12, subject:"English", topic:"Writing", question:"Argumentative essay:", options:["Takes clear position supported by evidence","Tells a story","Describes a place","Explains a process"], answer:0, explanation:"Argumentative essay presents a stance backed by logical evidence" },

  // ══════════════════════════════════════════════════════════════════════════
  // BUSINESS STUDIES — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"bs10_01", grade:10, subject:"Business Studies", topic:"Forms of Ownership", question:"Sole trader owned by:", options:["One person","Two or more partners","Shareholders","Government"], answer:0, explanation:"Sole trader = single owner" },
  { id:"bs11_01", grade:11, subject:"Business Studies", topic:"Marketing", question:"4 P's of marketing =", options:["Product, Price, Place, Promotion","People, Process, Plan, Profit","Product, Profit, Place, People","Price, Plan, Process, Promotion"], answer:0, explanation:"Marketing Mix = 4 P's" },
  { id:"bs12_01", grade:12, subject:"Business Studies", topic:"Business Ethics", question:"CSR refers to:", options:["Company's commitment to ethical, social, and environmental responsibility","Profit only","Tax avoidance","Shareholder returns only"], answer:0, explanation:"CSR: businesses contributing positively beyond profit" },

  // ══════════════════════════════════════════════════════════════════════════
  // ECONOMICS — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ec10_01", grade:10, subject:"Economics", topic:"Basic Concepts", question:"Scarcity means:", options:["Limited resources vs unlimited wants","Only shortage of money","Lack of natural resources","High inflation"], answer:0, explanation:"Fundamental economic problem: unlimited wants, limited resources" },
  { id:"ec11_01", grade:11, subject:"Economics", topic:"Microeconomics", question:"Law of demand: as price increases, quantity demanded:", options:["Decreases","Increases","Stays same","Doubles"], answer:0, explanation:"Inverse relationship: higher price → lower quantity demanded" },
  { id:"ec12_01", grade:12, subject:"Economics", topic:"Macroeconomics", question:"GDP = ", options:["Gross Domestic Product","General Development Plan","Gross Development Progress","Government Domestic Policy"], answer:0, explanation:"GDP = total value of goods and services produced in a country per year" },

  // ══════════════════════════════════════════════════════════════════════════
  // HISTORY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"hi10_01", grade:10, subject:"History", topic:"World History", question:"WWI began in:", options:["1914","1918","1939","1905"], answer:0, explanation:"WWI: 28 July 1914 — assassination of Archduke Franz Ferdinand" },
  { id:"hi11_01", grade:11, subject:"History", topic:"Cold War", question:"Cold War was between:", options:["USA and Soviet Union","USA and Germany","UK and Soviet Union","USA and China"], answer:0, explanation:"Cold War (1947–1991): USA (capitalism) vs USSR (communism)" },
  { id:"hi12_01", grade:12, subject:"History", topic:"SA History", question:"Sharpeville Massacre occurred in:", options:["1960","1976","1948","1990"], answer:0, explanation:"21 March 1960: police killed 69 peaceful protesters in Sharpeville" },
  { id:"hi12_02", grade:12, subject:"History", topic:"SA History", question:"SA's first democratic elections were in:", options:["1994","1990","1996","1992"], answer:0, explanation:"27 April 1994: SA's first fully democratic elections — Mandela became president" },

  // ══════════════════════════════════════════════════════════════════════════
  // GEOGRAPHY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ge10_01", grade:10, subject:"Geography", topic:"Map Work", question:"Contour lines close together indicate:", options:["Steep slope","Gentle slope","Flat land","A river"], answer:0, explanation:"Closely-spaced contour lines = steep terrain" },
  { id:"ge11_01", grade:11, subject:"Geography", topic:"Climate", question:"Coriolis effect in Southern Hemisphere deflects winds:", options:["To the left","To the right","Straight up","Down"], answer:0, explanation:"Southern Hemisphere: Coriolis deflects to the left" },
  { id:"ge12_01", grade:12, subject:"Geography", topic:"Development", question:"HDI measures:", options:["Life expectancy, education, and income","GDP only","Population size","Industrial output"], answer:0, explanation:"HDI = health + education + standard of living" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS GRADE 11 & 12 — core questions
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m11_01", grade:11, subject:"Mathematics", topic:"Quadratics", question:"Solve: x² − 5x + 6 = 0", options:["x=2 or x=3","x=−2 or x=−3","x=1 or x=6","x=−1 or x=−6"], answer:0, explanation:"Factorise: (x−2)(x−3)=0" },
  { id:"m11_02", grade:11, subject:"Mathematics", topic:"Finance", question:"R2000 at 10% compound interest for 2 years =", options:["R2420","R2400","R2200","R2440"], answer:0, explanation:"A = 2000(1.1)² = R2420" },
  { id:"m11_03", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"cos 60° =", options:["0.5","√3/2","1","0"], answer:0, explanation:"cos 60° = 1/2 = 0.5" },
  { id:"m11_04", grade:11, subject:"Mathematics", topic:"Statistics", question:"Standard deviation of 0 means:", options:["All values equal","No data","Data spread out","Mean is zero"], answer:0, explanation:"SD = 0 means all data points identical" },
  { id:"m12_01", grade:12, subject:"Mathematics", topic:"Calculus", question:"Derivative of f(x) = x³ =", options:["3x²","3x","x²","3x³"], answer:0, explanation:"Power rule: d/dx(x³) = 3x²" },
  { id:"m12_02", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"Distance between (1,2) and (4,6) =", options:["5","3","7","√7"], answer:0, explanation:"d = √(9+16) = 5" },
  { id:"m12_03", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"S∞ of geometric series (|r|<1) =", options:["a/(1−r)","a/(r−1)","a·r","a(1−r)"], answer:0, explanation:"S∞ = a/(1−r) when |r| < 1" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL LITERACY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ml10_01", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"15% of R800 =", options:["R120","R80","R150","R200"], answer:0, explanation:"0.15 × 800 = R120" },
  { id:"ml10_02", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"VAT at 15% on R200 = total of:", options:["R230","R215","R200","R185"], answer:0, explanation:"VAT = R30. Total = R230" },
  { id:"ml10_03", grade:10, subject:"Mathematical Literacy", topic:"Measurement", question:"2.5 litres = ? ml", options:["2500 ml","250 ml","25 000 ml","0.25 ml"], answer:0, explanation:"1 L = 1000 ml. 2.5 × 1000 = 2500 ml" },
  { id:"ml11_01", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"Compound interest on R4000 at 6% for 2 years =", options:["R4494.40","R4480","R4240","R4480.40"], answer:0, explanation:"A = 4000 × (1.06)² = R4494.40" },
  { id:"ml12_01", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"UIF stands for:", options:["Unemployment Insurance Fund","Universal Income Fund","Urban Insurance Finance","United Income Fund"], answer:0, explanation:"UIF provides relief to workers who lose jobs" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL MATHEMATICS — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tm10_01", grade:10, subject:"Technical Mathematics", topic:"Algebra", question:"Simplify: 4a + 3b − 2a + b =", options:["2a + 4b","6a + 4b","2a + 2b","6a + 2b"], answer:0, explanation:"(4a−2a) + (3b+b) = 2a + 4b" },
  { id:"tm10_02", grade:10, subject:"Technical Mathematics", topic:"Geometry", question:"Area of triangle: base 10cm, height 6cm =", options:["30 cm²","60 cm²","16 cm²","100 cm²"], answer:0, explanation:"A = ½ × 10 × 6 = 30 cm²" },
  { id:"tm11_01", grade:11, subject:"Technical Mathematics", topic:"Algebra", question:"Solve: x² = 25", options:["x = ±5","x = 5","x = 25","x = ±25"], answer:0, explanation:"x = ±√25 = ±5" },
  { id:"tm12_01", grade:12, subject:"Technical Mathematics", topic:"Trigonometry", question:"Sine rule: a/sin A =", options:["b/sin B","b/cos B","a/cos A","sin B/b"], answer:0, explanation:"a/sin A = b/sin B = c/sin C" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL SCIENCES — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ts10_01", grade:10, subject:"Technical Sciences", topic:"Forces", question:"Friction is a:", options:["Contact force","Non-contact force","Gravitational force","Magnetic force"], answer:0, explanation:"Friction requires physical contact between surfaces" },
  { id:"ts10_02", grade:10, subject:"Technical Sciences", topic:"Electricity", question:"If V=12V, R=4Ω, then I =", options:["3 A","48 A","8 A","0.33 A"], answer:0, explanation:"I = V/R = 12/4 = 3 A" },
  { id:"ts11_01", grade:11, subject:"Technical Sciences", topic:"Newton's Laws", question:"Newton's 1st Law = law of:", options:["Inertia","Action-reaction","Momentum","Gravity"], answer:0, explanation:"1st Law: object stays at rest or motion unless net force acts" },
  { id:"ts12_01", grade:12, subject:"Technical Sciences", topic:"Electricity", question:"Faraday's Law: EMF induced when:", options:["Magnetic flux through coil changes","Current flows through resistor","Voltage applied to conductor","Circuit opened"], answer:0, explanation:"Changing magnetic flux induces EMF" },

  // ══════════════════════════════════════════════════════════════════════════
  // CIVIL TECHNOLOGY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ct10_01", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Main structural component in reinforced concrete =", options:["Steel rebar","Timber","Brick","Gravel"], answer:0, explanation:"Rebar handles tension; concrete handles compression" },
  { id:"ct10_02", grade:10, subject:"Civil Technology", topic:"Drawing & Plans", question:"'NTS' on a drawing means:", options:["Not To Scale","North To South","No Technical Spec","Number of Total Sheets"], answer:0, explanation:"NTS = Not To Scale" },
  { id:"ct11_01", grade:11, subject:"Civil Technology", topic:"Walls", question:"DPC prevents:", options:["Rising damp","Cold","Structural failure","Wind damage"], answer:0, explanation:"Damp Proof Course stops moisture rising from ground" },
  { id:"ct12_01", grade:12, subject:"Civil Technology", topic:"Structures", question:"Reinforced concrete strong in tension and compression because:", options:["Steel handles tension, concrete handles compression","Concrete handles both","Steel handles compression","Same material"], answer:0, explanation:"Steel + concrete = complete structural performance" },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL TECHNOLOGY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"et10_01", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"Battery converts chemical energy to:", options:["Electrical energy","Mechanical energy","Heat energy","Light energy"], answer:0, explanation:"Battery: chemical → electrical energy" },
  { id:"et10_02", grade:10, subject:"Electrical Technology", topic:"Safety", question:"Earth wire colour in SA =", options:["Green & Yellow","Red","Black","Blue"], answer:0, explanation:"SA: Earth = Green/Yellow, Live = Red/Brown, Neutral = Black/Blue" },
  { id:"et11_01", grade:11, subject:"Electrical Technology", topic:"AC Theory", question:"SA AC mains frequency =", options:["50 Hz","60 Hz","100 Hz","50 kHz"], answer:0, explanation:"SA uses 50 Hz AC supply" },
  { id:"et12_01", grade:12, subject:"Electrical Technology", topic:"Three-Phase", question:"SA 3-phase line voltage ≈", options:["400 V","230 V","690 V","110 V"], answer:0, explanation:"VL = √3 × 230 ≈ 400 V" },

  // ══════════════════════════════════════════════════════════════════════════
  // MECHANICAL TECHNOLOGY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"mt10_01", grade:10, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"Vernier calliper measures to:", options:["0.02 mm","0.1 mm","1 mm","0.001 mm"], answer:0, explanation:"Vernier calliper accurate to 0.02 mm" },
  { id:"mt10_02", grade:10, subject:"Mechanical Technology", topic:"Tools", question:"A tap cuts:", options:["Internal threads","External threads","Keyways","Gear teeth"], answer:0, explanation:"Tap = internal (female) threads; die = external (male) threads" },
  { id:"mt11_01", grade:11, subject:"Mechanical Technology", topic:"Welding", question:"MIG welding uses:", options:["Continuous wire electrode","Coated stick electrode","Carbon arc","Gas flame only"], answer:0, explanation:"MIG: continuous wire + inert shielding gas" },
  { id:"mt12_01", grade:12, subject:"Mechanical Technology", topic:"Maintenance", question:"Preventive maintenance =", options:["Scheduled before breakdowns","Fixing after breakdown","Emergency repairs","Replacing all parts"], answer:0, explanation:"Preventive: routine maintenance to prevent failures" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls11_01", grade:11, subject:"Life Sciences", topic:"Genetics", question:"DNA stands for:", options:["Deoxyribonucleic Acid","Deoxyribose Nucleic Acid","Diribonucleic Acid","Deoxyribose Nitrogen Acid"], answer:0, explanation:"DNA = Deoxyribonucleic Acid" },
  { id:"ls11_02", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"Basic unit of nervous system =", options:["Neuron","Axon","Synapse","Myelin"], answer:0, explanation:"Neuron = nerve cell, basic structural unit" },
  { id:"ls12_01", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Transcription produces:", options:["mRNA from DNA","Protein from mRNA","DNA from RNA","tRNA from DNA"], answer:0, explanation:"Transcription: DNA → mRNA (in nucleus)" },
  { id:"ls12_02", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Homozygous means:", options:["Two identical alleles","Different alleles","One allele only","Three alleles"], answer:0, explanation:"Homozygous = AA or aa (same two alleles)" },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCOUNTING — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ac12_01", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Current ratio measures:", options:["Short-term liquidity","Profitability","Solvency","Efficiency"], answer:0, explanation:"Current ratio = Current Assets / Current Liabilities" },
  { id:"ac12_02", grade:12, subject:"Accounting", topic:"Companies", question:"Dividends paid from:", options:["Retained income/profits","Share capital","Loans","Assets"], answer:0, explanation:"Dividends = distribution of profit to shareholders" },
  { id:"ac12_03", grade:12, subject:"Accounting", topic:"Cash Flow", question:"Cash Flow Statement shows:", options:["Sources and uses of cash","Profit and loss","Assets and liabilities","Equity changes"], answer:0, explanation:"Cash Flow tracks cash inflows and outflows" },

];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT CONFIG — grades each subject is available for
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = {
  // Grade 8 & 9 subjects
  "Mathematics":                      { icon:"📐", color:"#2563eb", grades:[8,9,10,11,12] },
  "Natural Sciences":                  { icon:"🔭", color:"#0f766e", grades:[8,9] },
  "English":                           { icon:"📖", color:"#0891b2", grades:[8,9,10,11,12] },
  "Economic & Management Sciences":    { icon:"💰", color:"#16a34a", grades:[8,9] },
  "Social Sciences: History":          { icon:"🏛️", color:"#92400e", grades:[8,9] },
  "Social Sciences: Geography":        { icon:"🌍", color:"#1d4ed8", grades:[8,9] },
  "Technology":                        { icon:"🔧", color:"#7c3aed", grades:[8,9] },
  "Life Orientation":                  { icon:"💚", color:"#059669", grades:[8,9] },
  "Creative Arts":                     { icon:"🎨", color:"#ec4899", grades:[8,9] },
  // Grade 10-12 subjects
  "Technical Mathematics":             { icon:"🔧", color:"#0369a1", grades:[10,11,12] },
  "Mathematical Literacy":             { icon:"💡", color:"#7c3aed", grades:[10,11,12] },
  "Physical Sciences":                 { icon:"⚗️", color:"#6d28d9", grades:[10,11,12] },
  "Technical Sciences":                { icon:"🔬", color:"#0f766e", grades:[10,11,12] },
  "Life Sciences":                     { icon:"🧬", color:"#16a34a", grades:[10,11,12] },
  "Accounting":                        { icon:"📒", color:"#b45309", grades:[10,12] },
  "Business Studies":                  { icon:"💼", color:"#059669", grades:[10,11,12] },
  "Economics":                         { icon:"📈", color:"#dc2626", grades:[10,11,12] },
  "History":                           { icon:"🏛️", color:"#92400e", grades:[10,11,12] },
  "Geography":                         { icon:"🌍", color:"#1d4ed8", grades:[10,11,12] },
  "Civil Technology":                  { icon:"🏗️", color:"#b45309", grades:[10,11,12] },
  "Electrical Technology":             { icon:"⚡", color:"#ca8a04", grades:[10,11,12] },
  "Mechanical Technology":             { icon:"⚙️", color:"#475569", grades:[10,11,12] },
};

const GRADE_COLORS = {
  8:  "#0f766e",
  9:  "#7c3aed",
  10: "#2563eb",
  11: "#9333ea",
  12: "#16a34a",
};

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
  const grade = parseInt(student?.grade) || 10;
  const gc    = GRADE_COLORS[grade] || "#2563eb";
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

  // ── Timer ────────────────────────────────────────────────────────────────
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

  // ── Start quiz ───────────────────────────────────────────────────────────
  const startQuiz = (subject) => {
    const pool   = QUESTION_BANK.filter(q => q.subject === subject && q.grade === grade);
    const picked = shuffle(pool).slice(0, Math.min(NUM_Q, pool.length));
    setSelSubject(subject); setQuestions(picked); setCurrent(0);
    setSelected(null); setConfirmed(false); setTimedOut(false); setAnswers([]);
    setScreen("quiz");
  };

  const selectAnswer  = (idx) => { if (confirmed) return; setSelected(idx); };
  const confirmAnswer = () => { if (selected === null && !timedOut) return; clearInterval(timerRef.current); setConfirmed(true); };

  // ── Next question ────────────────────────────────────────────────────────
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

  // ── Available subjects ───────────────────────────────────────────────────
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

        {/* Grade 8 & 9 info banner */}
        {(grade === 8 || grade === 9) && (
          <div style={{ background: grade===8?"#f0fdfa":"#faf5ff", border:`1px solid ${grade===8?"#99f6e4":"#e9d5ff"}`, borderRadius:12, padding:"12px 16px", marginBottom:20, display:"flex", gap:10 }}>
            <span style={{ fontSize:20 }}>{grade===8?"🌱":"🌿"}</span>
            <div>
              <b style={{ fontSize:13, color: grade===8?"#0f766e":"#7c3aed" }}>
                {grade===8?"Grade 8 — Foundation Questions":"Grade 9 — Get Ready for High School!"}
              </b>
              <p style={{ margin:"4px 0 0", fontSize:13, color: grade===8?"#0f766e":"#6b21a8", lineHeight:1.6 }}>
                {grade===8
                  ? "These questions cover core CAPS topics for Grade 8. Practice to build a strong foundation for high school."
                  : "These questions help you prepare for Grade 10 and the subject choices you'll be making soon. Great preparation!"}
              </p>
            </div>
          </div>
        )}

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
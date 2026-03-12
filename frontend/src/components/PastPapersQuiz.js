// src/components/PastPapersQuiz.js
// Past Papers Quiz for Grade 10, 11, 12
// NSC-style multiple choice questions per subject and grade
import React, { useState, useEffect, useRef, useMemo } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION BANK  — 15 questions per subject per grade
// Format: { id, grade, subject, topic, question, options[], answer(0-indexed), explanation }
// ─────────────────────────────────────────────────────────────────────────────
const QUESTION_BANK = [

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m10_01", grade:10, subject:"Mathematics", topic:"Algebra", question:"Simplify: 3x² − 5x + 2x² + 4x", options:["5x² − x","5x² + x","5x² − 9x","x² − x"], answer:0, explanation:"Combine like terms: (3+2)x² + (−5+4)x = 5x² − x" },
  { id:"m10_02", grade:10, subject:"Mathematics", topic:"Algebra", question:"Factorise: x² − 9", options:["(x−3)(x+3)","(x−9)(x+1)","(x+3)²","(x−3)²"], answer:0, explanation:"Difference of squares: a²−b² = (a−b)(a+b), so x²−9 = (x−3)(x+3)" },
  { id:"m10_03", grade:10, subject:"Mathematics", topic:"Algebra", question:"Solve for x: 2x + 5 = 13", options:["x = 4","x = 9","x = 3","x = 6"], answer:0, explanation:"2x = 13−5 = 8, so x = 4" },
  { id:"m10_04", grade:10, subject:"Mathematics", topic:"Exponents", question:"Simplify: 2³ × 2⁴", options:["2⁷","2¹²","4⁷","2⁻¹"], answer:0, explanation:"When multiplying same bases, add exponents: 2³ × 2⁴ = 2^(3+4) = 2⁷" },
  { id:"m10_05", grade:10, subject:"Mathematics", topic:"Exponents", question:"What is the value of 5⁰?", options:["0","1","5","Undefined"], answer:1, explanation:"Any non-zero number raised to the power of 0 equals 1" },
  { id:"m10_06", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"What is the next term in: 3, 7, 11, 15, ...?", options:["17","18","19","20"], answer:2, explanation:"Common difference is 4, so 15 + 4 = 19" },
  { id:"m10_07", grade:10, subject:"Mathematics", topic:"Number Patterns", question:"Find the nth term of the pattern: 5, 8, 11, 14,...", options:["3n + 2","2n + 3","3n − 2","n + 4"], answer:0, explanation:"Common difference is 3, first term is 5. Formula: a + (n−1)d = 5 + (n−1)3 = 3n + 2" },
  { id:"m10_08", grade:10, subject:"Mathematics", topic:"Finance", question:"R500 is invested at 8% simple interest for 3 years. What is the total interest earned?", options:["R120","R40","R24","R180"], answer:0, explanation:"Simple Interest = P × r × t = 500 × 0.08 × 3 = R120" },
  { id:"m10_09", grade:10, subject:"Mathematics", topic:"Statistics", question:"What is the median of: 3, 7, 2, 9, 5?", options:["5","7","3","9"], answer:0, explanation:"Arrange in order: 2,3,5,7,9. The middle value (3rd of 5) is 5" },
  { id:"m10_10", grade:10, subject:"Mathematics", topic:"Geometry", question:"The angles of a triangle sum to:", options:["90°","180°","270°","360°"], answer:1, explanation:"The interior angles of any triangle always add up to 180°" },
  { id:"m10_11", grade:10, subject:"Mathematics", topic:"Geometry", question:"What is the area of a rectangle with length 8cm and width 5cm?", options:["40 cm²","26 cm²","13 cm²","80 cm²"], answer:0, explanation:"Area = length × width = 8 × 5 = 40 cm²" },
  { id:"m10_12", grade:10, subject:"Mathematics", topic:"Functions", question:"What is the gradient of the line y = 3x − 4?", options:["3","-4","4","-3"], answer:0, explanation:"In the form y = mx + c, m is the gradient. Here m = 3" },
  { id:"m10_13", grade:10, subject:"Mathematics", topic:"Functions", question:"If f(x) = 2x + 1, what is f(3)?", options:["7","5","9","6"], answer:0, explanation:"f(3) = 2(3) + 1 = 6 + 1 = 7" },
  { id:"m10_14", grade:10, subject:"Mathematics", topic:"Trigonometry", question:"In a right-angled triangle, sin θ = opposite/…?", options:["hypotenuse","adjacent","base","height"], answer:0, explanation:"SOH-CAH-TOA: Sin = Opposite/Hypotenuse" },
  { id:"m10_15", grade:10, subject:"Mathematics", topic:"Probability", question:"A bag has 3 red and 7 blue balls. What is P(red)?", options:["3/10","7/10","3/7","1/3"], answer:0, explanation:"P(red) = number of red / total = 3/10" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m11_01", grade:11, subject:"Mathematics", topic:"Quadratics", question:"Solve: x² − 5x + 6 = 0", options:["x=2 or x=3","x=−2 or x=−3","x=1 or x=6","x=−1 or x=−6"], answer:0, explanation:"Factorise: (x−2)(x−3)=0, so x=2 or x=3" },
  { id:"m11_02", grade:11, subject:"Mathematics", topic:"Quadratics", question:"The vertex of y = x² − 4x + 3 is at x =", options:["2","−2","4","−4"], answer:0, explanation:"Vertex x-coordinate: x = −b/2a = −(−4)/2(1) = 2" },
  { id:"m11_03", grade:11, subject:"Mathematics", topic:"Exponents", question:"Simplify: (2³)²", options:["2⁶","2⁵","2⁹","6²"], answer:0, explanation:"Power of a power: (aᵐ)ⁿ = aᵐⁿ. (2³)² = 2⁶" },
  { id:"m11_04", grade:11, subject:"Mathematics", topic:"Number Patterns", question:"Find T₅ if Tₙ = 2n² − 1", options:["49","23","47","51"], answer:0, explanation:"T₅ = 2(5²)−1 = 2(25)−1 = 50−1 = 49" },
  { id:"m11_05", grade:11, subject:"Mathematics", topic:"Finance", question:"R2000 invested at 10% compound interest for 2 years gives:", options:["R2420","R2400","R2200","R2440"], answer:0, explanation:"A = P(1+r)ⁿ = 2000(1.1)² = 2000 × 1.21 = R2420" },
  { id:"m11_06", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"cos 60° =", options:["0.5","√3/2","1","0"], answer:0, explanation:"cos 60° = 1/2 = 0.5 (standard angle value)" },
  { id:"m11_07", grade:11, subject:"Mathematics", topic:"Trigonometry", question:"tan 45° =", options:["1","0","√2","undefined"], answer:0, explanation:"tan 45° = sin 45°/cos 45° = (√2/2)/(√2/2) = 1" },
  { id:"m11_08", grade:11, subject:"Mathematics", topic:"Functions", question:"The domain of f(x) = 1/(x−3) excludes:", options:["x = 3","x = −3","x = 0","x = 1"], answer:0, explanation:"The denominator cannot be zero, so x − 3 ≠ 0, meaning x ≠ 3" },
  { id:"m11_09", grade:11, subject:"Mathematics", topic:"Probability", question:"Two events A and B are mutually exclusive if:", options:["P(A and B) = 0","P(A and B) = 1","P(A) = P(B)","P(A or B) = 0"], answer:0, explanation:"Mutually exclusive events cannot occur simultaneously, so P(A∩B) = 0" },
  { id:"m11_10", grade:11, subject:"Mathematics", topic:"Statistics", question:"What does a standard deviation of 0 mean?", options:["All values are equal","No data collected","Data is spread out","Mean is zero"], answer:0, explanation:"Standard deviation measures spread. SD = 0 means all data points are identical." },
  { id:"m11_11", grade:11, subject:"Mathematics", topic:"Euclidean Geometry", question:"The theorem of Pythagoras states: in a right triangle, c² =", options:["a² + b²","a² − b²","2ab","a + b"], answer:0, explanation:"Pythagoras: c² = a² + b² where c is the hypotenuse" },
  { id:"m11_12", grade:11, subject:"Mathematics", topic:"Measurement", question:"Volume of a cylinder: V = πr²h. If r=3 and h=5, V =", options:["45π","15π","9π","30π"], answer:0, explanation:"V = π(3²)(5) = π(9)(5) = 45π" },
  { id:"m11_13", grade:11, subject:"Mathematics", topic:"Algebra", question:"Simplify: (x+2)(x−2)", options:["x²−4","x²+4","x²−2x+4","x²+2x−4"], answer:0, explanation:"Difference of squares: (a+b)(a−b) = a²−b². So (x+2)(x−2) = x²−4" },
  { id:"m11_14", grade:11, subject:"Mathematics", topic:"Algebra", question:"If 3(x+2) = 21, then x =", options:["5","7","9","3"], answer:0, explanation:"3x + 6 = 21 → 3x = 15 → x = 5" },
  { id:"m11_15", grade:11, subject:"Mathematics", topic:"Functions", question:"Which graph represents a linear function?", options:["A straight line","A parabola","A hyperbola","A circle"], answer:0, explanation:"A linear function y = mx + c always produces a straight line graph" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICS — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"m12_01", grade:12, subject:"Mathematics", topic:"Calculus", question:"What is the derivative of f(x) = x³?", options:["3x²","3x","x²","3x³"], answer:0, explanation:"Power rule: d/dx(xⁿ) = nxⁿ⁻¹. So d/dx(x³) = 3x²" },
  { id:"m12_02", grade:12, subject:"Mathematics", topic:"Calculus", question:"The derivative of f(x) = 5 is:", options:["0","5","1","undefined"], answer:0, explanation:"The derivative of a constant is always 0" },
  { id:"m12_03", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"Find S₅ of the arithmetic series: 2 + 5 + 8 + ...", options:["40","35","30","45"], answer:0, explanation:"Sₙ = n/2[2a+(n−1)d] = 5/2[4+12] = 5/2×16 = 40" },
  { id:"m12_04", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"In a geometric series, if a=2 and r=3, what is T₄?", options:["54","27","18","162"], answer:0, explanation:"Tₙ = a·rⁿ⁻¹ = 2·3³ = 2·27 = 54" },
  { id:"m12_05", grade:12, subject:"Mathematics", topic:"Finance", question:"The present value formula is PV =", options:["FV/(1+r)ⁿ","FV(1+r)ⁿ","FV−rⁿ","FV·n·r"], answer:0, explanation:"PV = FV/(1+r)ⁿ — you discount future value back to present" },
  { id:"m12_06", grade:12, subject:"Mathematics", topic:"Trigonometry", question:"sin(A+B) =", options:["sinA cosB + cosA sinB","sinA cosB − cosA sinB","cosA cosB − sinA sinB","cosA cosB + sinA sinB"], answer:0, explanation:"Compound angle formula: sin(A+B) = sinA cosB + cosA sinB" },
  { id:"m12_07", grade:12, subject:"Mathematics", topic:"Trigonometry", question:"The general solution of sin x = 0 is:", options:["x = n·180°","x = 90°+n·180°","x = n·90°","x = 45°+n·360°"], answer:0, explanation:"sin x = 0 at x = 0°, 180°, 360°,... i.e. x = n·180°" },
  { id:"m12_08", grade:12, subject:"Mathematics", topic:"Calculus", question:"If f(x) = x², the gradient at x = 3 is:", options:["6","9","3","12"], answer:0, explanation:"f'(x) = 2x, so f'(3) = 2(3) = 6" },
  { id:"m12_09", grade:12, subject:"Mathematics", topic:"Statistics", question:"The regression line is used for:", options:["Predicting values","Finding probability","Calculating standard deviation","Sorting data"], answer:0, explanation:"Regression (line of best fit) is used to predict one variable from another" },
  { id:"m12_10", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"The distance between (1,2) and (4,6) is:", options:["5","3","7","√7"], answer:0, explanation:"d = √((4−1)²+(6−2)²) = √(9+16) = √25 = 5" },
  { id:"m12_11", grade:12, subject:"Mathematics", topic:"Analytical Geometry", question:"The midpoint of (2,4) and (8,10) is:", options:["(5,7)","(6,14)","(3,5)","(10,14)"], answer:0, explanation:"Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2) = ((2+8)/2,(4+10)/2) = (5,7)" },
  { id:"m12_12", grade:12, subject:"Mathematics", topic:"Functions", question:"The asymptotes of y = 1/x are:", options:["x=0 and y=0","x=1 and y=1","x=−1 and y=−1","x=0 and y=1"], answer:0, explanation:"The hyperbola y=1/x has a vertical asymptote at x=0 and horizontal at y=0" },
  { id:"m12_13", grade:12, subject:"Mathematics", topic:"Counting Principles", question:"In how many ways can 4 people be arranged in a line?", options:["24","12","16","8"], answer:0, explanation:"4! = 4×3×2×1 = 24" },
  { id:"m12_14", grade:12, subject:"Mathematics", topic:"Probability", question:"P(A') (complement of A) =", options:["1 − P(A)","P(A) − 1","P(A) + 1","1/P(A)"], answer:0, explanation:"The probability of 'not A' is 1 minus the probability of A" },
  { id:"m12_15", grade:12, subject:"Mathematics", topic:"Sequences & Series", question:"Sum to infinity of a geometric series (|r|<1): S∞ =", options:["a/(1−r)","a/(r−1)","a·r","a(1−r)"], answer:0, explanation:"S∞ = a/(1−r) when the common ratio |r| < 1" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps10_01", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"What is the atomic number of Carbon?", options:["6","12","4","8"], answer:0, explanation:"Carbon (C) has 6 protons, so its atomic number is 6" },
  { id:"ps10_02", grade:10, subject:"Physical Sciences", topic:"Matter & Classification", question:"Which of these is a pure substance?", options:["Distilled water","Sea water","Air","Brass"], answer:0, explanation:"Distilled water is a single compound (H₂O). The others are mixtures." },
  { id:"ps10_03", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"Ohm's Law states: V =", options:["I × R","I / R","R / I","I + R"], answer:0, explanation:"Ohm's Law: Voltage = Current × Resistance (V = IR)" },
  { id:"ps10_04", grade:10, subject:"Physical Sciences", topic:"Electricity", question:"The unit of electrical resistance is:", options:["Ohm (Ω)","Volt (V)","Ampere (A)","Watt (W)"], answer:0, explanation:"Resistance is measured in Ohms (Ω), named after Georg Ohm" },
  { id:"ps10_05", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Newton's First Law states that an object at rest will:", options:["Stay at rest unless acted on by a net force","Always start moving","Accelerate continuously","Lose mass over time"], answer:0, explanation:"Newton's 1st Law (Inertia): objects stay at rest or in motion unless a net force acts on them" },
  { id:"ps10_06", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"The SI unit of force is the:", options:["Newton (N)","Joule (J)","Watt (W)","Pascal (Pa)"], answer:0, explanation:"Force is measured in Newtons (N), named after Isaac Newton" },
  { id:"ps10_07", grade:10, subject:"Physical Sciences", topic:"Waves & Sound", question:"The number of waves per second is called:", options:["Frequency","Amplitude","Wavelength","Period"], answer:0, explanation:"Frequency is the number of complete wave cycles per second, measured in Hertz (Hz)" },
  { id:"ps10_08", grade:10, subject:"Physical Sciences", topic:"Waves & Sound", question:"Which wave requires a medium to travel through?", options:["Sound","Light","X-rays","Radio waves"], answer:0, explanation:"Sound is a mechanical wave and requires a medium (solid, liquid or gas) to propagate" },
  { id:"ps10_09", grade:10, subject:"Physical Sciences", topic:"Periodic Table", question:"Elements in the same group of the periodic table have:", options:["The same number of valence electrons","The same atomic mass","The same number of neutrons","The same period"], answer:0, explanation:"Elements in the same group share the same number of valence electrons, giving them similar chemical properties" },
  { id:"ps10_10", grade:10, subject:"Physical Sciences", topic:"Periodic Table", question:"Which group contains the noble gases?", options:["Group 18","Group 1","Group 17","Group 2"], answer:0, explanation:"Noble gases (He, Ne, Ar, Kr, Xe, Rn) are in Group 18 (the rightmost column)" },
  { id:"ps10_11", grade:10, subject:"Physical Sciences", topic:"Bonding", question:"An ionic bond forms between:", options:["A metal and a non-metal","Two non-metals","Two metals","A metal and a metalloid"], answer:0, explanation:"Ionic bonds form when a metal transfers electrons to a non-metal, creating oppositely charged ions" },
  { id:"ps10_12", grade:10, subject:"Physical Sciences", topic:"Bonding", question:"The chemical formula of water is:", options:["H₂O","HO","H₂O₂","HO₂"], answer:0, explanation:"Water has 2 hydrogen atoms and 1 oxygen atom: H₂O" },
  { id:"ps10_13", grade:10, subject:"Physical Sciences", topic:"Energy", question:"Kinetic energy depends on:", options:["Mass and velocity","Mass and height","Height only","Velocity only"], answer:0, explanation:"KE = ½mv². Kinetic energy depends on both the mass and velocity of an object" },
  { id:"ps10_14", grade:10, subject:"Physical Sciences", topic:"Energy", question:"Which energy transformation occurs in a light bulb?", options:["Electrical → Light + Heat","Chemical → Electrical","Mechanical → Electrical","Light → Chemical"], answer:0, explanation:"A light bulb converts electrical energy into light energy and heat energy" },
  { id:"ps10_15", grade:10, subject:"Physical Sciences", topic:"Mechanics", question:"Speed = Distance ÷ …?", options:["Time","Mass","Force","Acceleration"], answer:0, explanation:"Speed = Distance / Time. This is the basic formula for calculating speed" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps11_01", grade:11, subject:"Physical Sciences", topic:"Vectors & Scalars", question:"Which is a vector quantity?", options:["Velocity","Speed","Mass","Temperature"], answer:0, explanation:"Velocity has both magnitude and direction, making it a vector. Speed is scalar (magnitude only)." },
  { id:"ps11_02", grade:11, subject:"Physical Sciences", topic:"Newton's Laws", question:"Newton's 2nd Law states: F =", options:["ma","mv","m/a","v/t"], answer:0, explanation:"Newton's Second Law: Force = mass × acceleration (F = ma)" },
  { id:"ps11_03", grade:11, subject:"Physical Sciences", topic:"Newton's Laws", question:"Action-reaction pairs are described by Newton's:", options:["3rd Law","1st Law","2nd Law","Law of Gravity"], answer:0, explanation:"Newton's 3rd Law: For every action there is an equal and opposite reaction" },
  { id:"ps11_04", grade:11, subject:"Physical Sciences", topic:"Electrostatics", question:"Like charges:", options:["Repel each other","Attract each other","Have no effect","Cancel out"], answer:0, explanation:"Like charges (++ or −−) repel each other; unlike charges (+−) attract" },
  { id:"ps11_05", grade:11, subject:"Physical Sciences", topic:"Electrostatics", question:"Coulomb's Law gives the force between:", options:["Two charged particles","Two magnets","Two masses","Two resistors"], answer:0, explanation:"Coulomb's Law calculates the electrostatic force between two point charges" },
  { id:"ps11_06", grade:11, subject:"Physical Sciences", topic:"Electricity", question:"In a series circuit, total resistance is:", options:["R₁ + R₂","R₁ × R₂","1/R₁ + 1/R₂","R₁ − R₂"], answer:0, explanation:"In a series circuit, total resistance = sum of all individual resistances: RT = R₁ + R₂ + ..." },
  { id:"ps11_07", grade:11, subject:"Physical Sciences", topic:"Electricity", question:"Power in an electric circuit: P =", options:["V × I","V / I","I / V","V + I"], answer:0, explanation:"Electrical power P = Voltage × Current = VI (measured in Watts)" },
  { id:"ps11_08", grade:11, subject:"Physical Sciences", topic:"Chemical Reactions", question:"In a balanced equation, the law of conservation of:", options:["Mass","Energy","Momentum","Charge"], answer:0, explanation:"Balancing equations ensures the law of conservation of mass — atoms are neither created nor destroyed" },
  { id:"ps11_09", grade:11, subject:"Physical Sciences", topic:"Acids & Bases", question:"A substance with pH < 7 is:", options:["Acidic","Basic","Neutral","Salt"], answer:0, explanation:"pH < 7 = acidic, pH = 7 = neutral, pH > 7 = basic/alkaline" },
  { id:"ps11_10", grade:11, subject:"Physical Sciences", topic:"Acids & Bases", question:"NaOH is an example of a:", options:["Base","Acid","Salt","Oxide"], answer:0, explanation:"Sodium hydroxide (NaOH) is a strong base — it ionises fully in water to give OH⁻ ions" },
  { id:"ps11_11", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"Work done = Force × …?", options:["Displacement","Mass","Velocity","Time"], answer:0, explanation:"W = F × d (Work = Force × displacement in the direction of the force)" },
  { id:"ps11_12", grade:11, subject:"Physical Sciences", topic:"Mechanics", question:"The unit of work/energy is:", options:["Joule (J)","Watt (W)","Newton (N)","Pascal (Pa)"], answer:0, explanation:"Work and energy are both measured in Joules (J)" },
  { id:"ps11_13", grade:11, subject:"Physical Sciences", topic:"Waves", question:"The Doppler effect describes changes in:", options:["Observed frequency","Amplitude","Speed of light","Wavelength only"], answer:0, explanation:"The Doppler effect: when a source moves towards/away from you, the observed frequency changes" },
  { id:"ps11_14", grade:11, subject:"Physical Sciences", topic:"Chemical Bonding", question:"A covalent bond involves:", options:["Sharing of electrons","Transfer of electrons","Sharing of protons","Transfer of neutrons"], answer:0, explanation:"Covalent bonds form when atoms share electrons (usually between non-metals)" },
  { id:"ps11_15", grade:11, subject:"Physical Sciences", topic:"Hydrocarbons", question:"The simplest hydrocarbon is:", options:["Methane (CH₄)","Ethane (C₂H₆)","Propane (C₃H₈)","Butane (C₄H₁₀)"], answer:0, explanation:"Methane (CH₄) is the simplest alkane with just 1 carbon atom" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHYSICAL SCIENCES — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ps12_01", grade:12, subject:"Physical Sciences", topic:"Momentum", question:"Impulse equals:", options:["Change in momentum","Force × distance","Mass × velocity","Force / time"], answer:0, explanation:"Impulse = Δp = F×Δt = change in momentum" },
  { id:"ps12_02", grade:12, subject:"Physical Sciences", topic:"Momentum", question:"The law of conservation of momentum states that total momentum is conserved when:", options:["No external net force acts","Objects are stationary","Only elastic collisions occur","Mass is constant"], answer:0, explanation:"Total momentum of a system is conserved when no external net force acts on the system" },
  { id:"ps12_03", grade:12, subject:"Physical Sciences", topic:"Vertical Projectile", question:"An object in free fall has acceleration of approximately:", options:["9.8 m/s² downward","10 m/s² upward","0 m/s²","5 m/s² downward"], answer:0, explanation:"Near Earth's surface, free fall acceleration = g ≈ 9.8 m/s² (directed downward)" },
  { id:"ps12_04", grade:12, subject:"Physical Sciences", topic:"Electrodynamics", question:"An electric generator converts:", options:["Mechanical energy to electrical energy","Electrical energy to mechanical energy","Chemical energy to electrical energy","Heat to electrical energy"], answer:0, explanation:"A generator (dynamo) converts kinetic/mechanical energy into electrical energy using electromagnetic induction" },
  { id:"ps12_05", grade:12, subject:"Physical Sciences", topic:"Electrodynamics", question:"Faraday's Law relates to:", options:["Electromagnetic induction","Static electricity","Nuclear reactions","Acid-base reactions"], answer:0, explanation:"Faraday's Law of Electromagnetic Induction: a changing magnetic field induces an EMF" },
  { id:"ps12_06", grade:12, subject:"Physical Sciences", topic:"Photoelectric Effect", question:"The photoelectric effect supports the:", options:["Particle nature of light","Wave nature of light","Refraction of light","Diffraction of light"], answer:0, explanation:"The photoelectric effect shows that light behaves as particles (photons) when it ejects electrons from a metal surface" },
  { id:"ps12_07", grade:12, subject:"Physical Sciences", topic:"Optical Phenomena", question:"The energy of a photon is E =", options:["hf","mv²","½mv²","mc²"], answer:0, explanation:"Planck's equation: E = hf, where h = Planck's constant and f = frequency" },
  { id:"ps12_08", grade:12, subject:"Physical Sciences", topic:"Chemical Equilibrium", question:"Le Chatelier's Principle states:", options:["A system in equilibrium adjusts to minimise the effect of a change","Reactants equal products at equilibrium","Equilibrium means the reaction has stopped","Concentration is always constant"], answer:0, explanation:"Le Chatelier's Principle: if a stress is applied to a system in equilibrium, it shifts to relieve that stress" },
  { id:"ps12_09", grade:12, subject:"Physical Sciences", topic:"Acids & Bases", question:"According to Brønsted-Lowry, an acid is a:", options:["Proton donor","Proton acceptor","Electron donor","Electron acceptor"], answer:0, explanation:"Brønsted-Lowry definition: Acid = proton (H⁺) donor; Base = proton acceptor" },
  { id:"ps12_10", grade:12, subject:"Physical Sciences", topic:"Electrochemistry", question:"Oxidation involves:", options:["Loss of electrons","Gain of electrons","Loss of protons","Gain of protons"], answer:0, explanation:"OIL RIG: Oxidation Is Loss (of electrons); Reduction Is Gain (of electrons)" },
  { id:"ps12_11", grade:12, subject:"Physical Sciences", topic:"Organic Chemistry", question:"What is the IUPAC name of CH₃CH₂OH?", options:["Ethanol","Methanol","Propanol","Ethanoic acid"], answer:0, explanation:"CH₃CH₂OH has 2 carbons with an OH group — that makes it Ethanol (eth = 2 carbons, -ol = alcohol)" },
  { id:"ps12_12", grade:12, subject:"Physical Sciences", topic:"Organic Chemistry", question:"A substitution reaction in alkanes involves:", options:["Replacement of one atom/group with another","Adding atoms across a double bond","Removing H₂","Joining two molecules"], answer:0, explanation:"Substitution: one atom (usually H) is replaced by another atom or group, common in alkanes with halogens" },
  { id:"ps12_13", grade:12, subject:"Physical Sciences", topic:"Nuclear Reactions", question:"Alpha decay emits a particle with:", options:["2 protons and 2 neutrons","1 proton and 1 electron","0 protons and 1 neutron","2 electrons"], answer:0, explanation:"Alpha (α) particle = helium nucleus = 2 protons + 2 neutrons (⁴He)" },
  { id:"ps12_14", grade:12, subject:"Physical Sciences", topic:"Mechanics", question:"According to the work-energy theorem, net work done =", options:["Change in kinetic energy","Change in potential energy","Total energy","Force × mass"], answer:0, explanation:"Work-Energy Theorem: Wnet = ΔKE. Net work equals the change in kinetic energy." },
  { id:"ps12_15", grade:12, subject:"Physical Sciences", topic:"Mechanics", question:"At maximum height, a projectile's vertical velocity is:", options:["Zero","Maximum","Equal to horizontal velocity","Negative"], answer:0, explanation:"At the peak of its trajectory, the projectile momentarily stops moving vertically — vy = 0" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls10_01", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"The powerhouse of the cell is the:", options:["Mitochondria","Nucleus","Ribosome","Cell membrane"], answer:0, explanation:"The mitochondria produces ATP (energy) through cellular respiration — hence 'powerhouse of the cell'" },
  { id:"ls10_02", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Which organelle contains the cell's genetic material?", options:["Nucleus","Ribosome","Vacuole","Golgi body"], answer:0, explanation:"The nucleus houses the DNA (chromosomes) which carries all genetic information" },
  { id:"ls10_03", grade:10, subject:"Life Sciences", topic:"Cell Division", question:"Mitosis produces:", options:["2 identical daughter cells","4 different cells","1 larger cell","2 cells with half the chromosomes"], answer:0, explanation:"Mitosis: one cell divides into 2 genetically identical daughter cells (same chromosome number)" },
  { id:"ls10_04", grade:10, subject:"Life Sciences", topic:"Cell Division", question:"Meiosis is used for:", options:["Formation of sex cells (gametes)","Growth and repair","Asexual reproduction","Cloning"], answer:0, explanation:"Meiosis produces 4 genetically unique gametes (sperm/eggs) with half the chromosome number" },
  { id:"ls10_05", grade:10, subject:"Life Sciences", topic:"Biosphere", question:"Producers in an ecosystem are:", options:["Plants","Animals","Decomposers","Fungi"], answer:0, explanation:"Producers (plants) make their own food via photosynthesis — they form the base of food chains" },
  { id:"ls10_06", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"Photosynthesis occurs in the:", options:["Chloroplast","Mitochondria","Nucleus","Vacuole"], answer:0, explanation:"Photosynthesis takes place in the chloroplasts, which contain chlorophyll to absorb sunlight" },
  { id:"ls10_07", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"The equation for photosynthesis is: 6CO₂ + 6H₂O + light →", options:["C₆H₁₂O₆ + 6O₂","6O₂ + H₂O","CO₂ + H₂O","C₆H₁₂O₆ only"], answer:0, explanation:"Photosynthesis: Carbon dioxide + water + light energy → glucose + oxygen" },
  { id:"ls10_08", grade:10, subject:"Life Sciences", topic:"Transport", question:"Red blood cells carry oxygen using:", options:["Haemoglobin","Plasma","Platelets","White blood cells"], answer:0, explanation:"Haemoglobin is the protein in red blood cells that binds to oxygen and transports it around the body" },
  { id:"ls10_09", grade:10, subject:"Life Sciences", topic:"Biodiversity", question:"The scientific name of an organism consists of:", options:["Genus and species","Family and order","Kingdom and phylum","Class and genus"], answer:0, explanation:"Binomial nomenclature: scientific names have two parts — Genus (capital) and species (lowercase)" },
  { id:"ls10_10", grade:10, subject:"Life Sciences", topic:"Support & Movement", question:"Bone is connected to muscle by:", options:["Tendons","Ligaments","Cartilage","Nerves"], answer:0, explanation:"Tendons connect muscles to bones; ligaments connect bones to other bones" },
  { id:"ls10_11", grade:10, subject:"Life Sciences", topic:"Biosphere", question:"A food chain always begins with a:", options:["Producer","Consumer","Decomposer","Herbivore"], answer:0, explanation:"Food chains start with producers (plants) which capture energy from the sun" },
  { id:"ls10_12", grade:10, subject:"Life Sciences", topic:"Cell Biology", question:"Osmosis is the movement of:", options:["Water across a semi-permeable membrane","Solutes from high to low concentration","Gases in breathing","Nutrients in the blood"], answer:0, explanation:"Osmosis: movement of water molecules from a region of high water concentration to low, across a semi-permeable membrane" },
  { id:"ls10_13", grade:10, subject:"Life Sciences", topic:"Gaseous Exchange", question:"Gas exchange in plants occurs through:", options:["Stomata","Roots","Xylem","Flowers"], answer:0, explanation:"Stomata are tiny pores on leaves that allow CO₂ in and O₂ out during photosynthesis" },
  { id:"ls10_14", grade:10, subject:"Life Sciences", topic:"Reproduction", question:"Fertilisation is the fusion of:", options:["Sperm and egg","Two eggs","Two sperm","Nucleus and cytoplasm"], answer:0, explanation:"Fertilisation: a sperm cell fuses with an egg cell to form a zygote (fertilised egg)" },
  { id:"ls10_15", grade:10, subject:"Life Sciences", topic:"Nutrition", question:"The process by which cells break down glucose to release energy is:", options:["Cellular respiration","Photosynthesis","Transpiration","Digestion"], answer:0, explanation:"Cellular respiration: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP (energy)" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls11_01", grade:11, subject:"Life Sciences", topic:"Genetics", question:"DNA stands for:", options:["Deoxyribonucleic Acid","Deoxyribose Nucleic Acid","Diribonucleic Acid","Deoxyribose Nitrogen Acid"], answer:0, explanation:"DNA = Deoxyribonucleic Acid — the molecule that carries genetic information" },
  { id:"ls11_02", grade:11, subject:"Life Sciences", topic:"Genetics", question:"The monomer unit of DNA is a:", options:["Nucleotide","Amino acid","Glucose","Fatty acid"], answer:0, explanation:"DNA is a polymer made of nucleotide monomers, each consisting of a sugar, phosphate, and nitrogenous base" },
  { id:"ls11_03", grade:11, subject:"Life Sciences", topic:"Genetics", question:"In DNA, Adenine pairs with:", options:["Thymine","Guanine","Cytosine","Uracil"], answer:0, explanation:"DNA base pairing: A-T (Adenine-Thymine) and G-C (Guanine-Cytosine)" },
  { id:"ls11_04", grade:11, subject:"Life Sciences", topic:"Genetics", question:"A gene is a section of DNA that codes for:", options:["A specific protein","A chromosome","A cell","An organ"], answer:0, explanation:"A gene is a specific sequence of DNA bases that codes for a particular protein" },
  { id:"ls11_05", grade:11, subject:"Life Sciences", topic:"Human Reproduction", question:"Fertilisation in humans occurs in the:", options:["Fallopian tube","Uterus","Ovary","Vagina"], answer:0, explanation:"Fertilisation (sperm meets egg) normally occurs in the fallopian tube (oviduct)" },
  { id:"ls11_06", grade:11, subject:"Life Sciences", topic:"Human Reproduction", question:"The hormone responsible for initiating puberty in males is:", options:["Testosterone","Oestrogen","Progesterone","FSH"], answer:0, explanation:"Testosterone is the primary male sex hormone responsible for puberty and male characteristics" },
  { id:"ls11_07", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"The basic unit of the nervous system is the:", options:["Neuron","Axon","Synapse","Myelin"], answer:0, explanation:"A neuron (nerve cell) is the basic structural and functional unit of the nervous system" },
  { id:"ls11_08", grade:11, subject:"Life Sciences", topic:"Nervous System", question:"The Central Nervous System consists of:", options:["Brain and spinal cord","Brain and nerves","Spinal cord and nerves","Neurons and synapses"], answer:0, explanation:"The CNS = brain + spinal cord. The peripheral nervous system includes all the nerves outside these." },
  { id:"ls11_09", grade:11, subject:"Life Sciences", topic:"Excretion", question:"The main organ of excretion in humans is the:", options:["Kidney","Liver","Skin","Lungs"], answer:0, explanation:"The kidneys are the primary excretory organs, filtering blood and excreting urea in urine" },
  { id:"ls11_10", grade:11, subject:"Life Sciences", topic:"Excretion", question:"The functional unit of the kidney is the:", options:["Nephron","Glomerulus","Collecting duct","Loop of Henle"], answer:0, explanation:"The nephron is the basic functional unit of the kidney — millions of nephrons filter blood continuously" },
  { id:"ls11_11", grade:11, subject:"Life Sciences", topic:"Plants", question:"Water is transported up a plant through:", options:["Xylem","Phloem","Stomata","Root hairs"], answer:0, explanation:"Xylem vessels carry water and minerals from roots to leaves (upward). Phloem carries sugars." },
  { id:"ls11_12", grade:11, subject:"Life Sciences", topic:"Plants", question:"The process of water loss from leaves is called:", options:["Transpiration","Respiration","Translocation","Osmosis"], answer:0, explanation:"Transpiration is the evaporation of water from plant leaves through stomata" },
  { id:"ls11_13", grade:11, subject:"Life Sciences", topic:"Evolution", question:"Darwin's theory of natural selection states that:", options:["Organisms best adapted to their environment survive and reproduce","All organisms evolve at the same rate","Mutations are always beneficial","Organisms create new traits by trying"], answer:0, explanation:"Survival of the fittest: individuals best adapted to their environment are more likely to survive and reproduce" },
  { id:"ls11_14", grade:11, subject:"Life Sciences", topic:"Immune System", question:"Antibodies are produced by:", options:["B-lymphocytes","T-lymphocytes","Red blood cells","Platelets"], answer:0, explanation:"B-cells (B-lymphocytes) produce antibodies — proteins that identify and neutralise foreign pathogens" },
  { id:"ls11_15", grade:11, subject:"Life Sciences", topic:"Immune System", question:"HIV attacks which type of cell?", options:["CD4 T-helper cells","B-cells","Platelets","Neurons"], answer:0, explanation:"HIV targets and destroys CD4 T-helper cells, weakening the immune system and leading to AIDS" },

  // ══════════════════════════════════════════════════════════════════════════
  // LIFE SCIENCES — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ls12_01", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Transcription produces:", options:["mRNA from DNA","Protein from mRNA","DNA from RNA","tRNA from DNA"], answer:0, explanation:"Transcription: DNA is used as a template to produce mRNA in the nucleus" },
  { id:"ls12_02", grade:12, subject:"Life Sciences", topic:"DNA & Protein Synthesis", question:"Translation occurs at the:", options:["Ribosome","Nucleus","Mitochondria","Golgi body"], answer:0, explanation:"Translation: mRNA is read by ribosomes to assemble amino acids into a protein" },
  { id:"ls12_03", grade:12, subject:"Life Sciences", topic:"Genetics", question:"A dominant allele is represented by:", options:["A capital letter","A lowercase letter","A number","An asterisk"], answer:0, explanation:"In genetics notation: capital letters (e.g. A) represent dominant alleles; lowercase (a) represents recessive" },
  { id:"ls12_04", grade:12, subject:"Life Sciences", topic:"Genetics", question:"An organism with two identical alleles is called:", options:["Homozygous","Heterozygous","Hemizygous","Allozygous"], answer:0, explanation:"Homozygous = same two alleles (AA or aa). Heterozygous = different alleles (Aa)." },
  { id:"ls12_05", grade:12, subject:"Life Sciences", topic:"Genetics", question:"Sex in humans is determined by:", options:["Sex chromosomes (XX/XY)","Autosomal chromosomes","Gene mutations","Environmental factors"], answer:0, explanation:"Females = XX; Males = XY. The Y chromosome from the father determines male sex." },
  { id:"ls12_06", grade:12, subject:"Life Sciences", topic:"Evolution", question:"The fossil record provides evidence for:", options:["Evolution over time","Extinction only","Creation of species","Genetic mutation"], answer:0, explanation:"Fossils show how organisms have changed (evolved) over millions of years" },
  { id:"ls12_07", grade:12, subject:"Life Sciences", topic:"Evolution", question:"Analogous structures in different species suggest:", options:["Convergent evolution","Divergent evolution","Common ancestry","Genetic drift"], answer:0, explanation:"Analogous structures (same function, different origin) suggest convergent evolution — unrelated species evolving similar traits" },
  { id:"ls12_08", grade:12, subject:"Life Sciences", topic:"Human Evolution", question:"The earliest genus in the human evolutionary line is:", options:["Australopithecus","Homo sapiens","Homo habilis","Homo erectus"], answer:0, explanation:"Australopithecus (e.g. 'Lucy') appeared ~3–4 million years ago and is considered an early human ancestor" },
  { id:"ls12_09", grade:12, subject:"Life Sciences", topic:"Population Ecology", question:"The maximum population an environment can support is called:", options:["Carrying capacity","Population density","Birth rate","Growth rate"], answer:0, explanation:"Carrying capacity (K) is the maximum population size an environment can sustain indefinitely" },
  { id:"ls12_10", grade:12, subject:"Life Sciences", topic:"Reproductive Strategies", question:"K-selected species typically have:", options:["Few offspring, high parental care","Many offspring, low parental care","Rapid reproduction","Short lifespan"], answer:0, explanation:"K-selected species (e.g. elephants, humans) invest heavily in few offspring — high survival rate" },
  { id:"ls12_11", grade:12, subject:"Life Sciences", topic:"Meiosis", question:"Crossing over during meiosis increases:", options:["Genetic variation","Number of chromosomes","Cell size","Mutation rate"], answer:0, explanation:"Crossing over (recombination) during Prophase I shuffles alleles, creating new gene combinations" },
  { id:"ls12_12", grade:12, subject:"Life Sciences", topic:"Genetics", question:"A sex-linked trait carried on the X chromosome is:", options:["More common in males","More common in females","Equally common","Only in females"], answer:0, explanation:"Males (XY) only have one X chromosome, so a recessive X-linked trait will be expressed if inherited" },
  { id:"ls12_13", grade:12, subject:"Life Sciences", topic:"Nervous System", question:"A reflex arc bypasses the:", options:["Brain","Spinal cord","Receptor","Effector"], answer:0, explanation:"Reflex arcs are processed in the spinal cord, bypassing the brain for a faster response" },
  { id:"ls12_14", grade:12, subject:"Life Sciences", topic:"Endocrine System", question:"Insulin is produced by the:", options:["Pancreas","Thyroid","Adrenal gland","Pituitary gland"], answer:0, explanation:"Insulin is produced by beta cells in the islets of Langerhans in the pancreas" },
  { id:"ls12_15", grade:12, subject:"Life Sciences", topic:"Biomes", question:"The biome found in the Western Cape with hot dry summers is:", options:["Fynbos / Mediterranean","Savanna","Grassland","Karoo"], answer:0, explanation:"The Cape Fynbos (Fynbos biome) has a Mediterranean climate: hot dry summers and cool wet winters" },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCOUNTING — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ac10_01", grade:10, subject:"Accounting", topic:"Accounting Equation", question:"The accounting equation is: Assets =", options:["Liabilities + Equity","Income − Expenses","Cash + Debtors","Revenue − Costs"], answer:0, explanation:"The fundamental accounting equation: Assets = Liabilities + Owner's Equity" },
  { id:"ac10_02", grade:10, subject:"Accounting", topic:"Accounting Equation", question:"If assets = R80 000 and liabilities = R30 000, equity =", options:["R50 000","R110 000","R30 000","R80 000"], answer:0, explanation:"Equity = Assets − Liabilities = R80 000 − R30 000 = R50 000" },
  { id:"ac10_03", grade:10, subject:"Accounting", topic:"Bookkeeping", question:"The double-entry rule states every debit has a:", options:["Equal credit","Smaller credit","Larger debit","No entry"], answer:0, explanation:"Double-entry bookkeeping: every transaction has equal debits and credits" },
  { id:"ac10_04", grade:10, subject:"Accounting", topic:"Bookkeeping", question:"A debit entry increases:", options:["Assets and expenses","Liabilities and income","Equity and liabilities","Income and equity"], answer:0, explanation:"DEAD CLIC: Debits increase Expenses, Assets, Drawings. Credits increase Liabilities, Income, Capital." },
  { id:"ac10_05", grade:10, subject:"Accounting", topic:"Financial Statements", question:"Gross Profit = Sales −", options:["Cost of Sales","Expenses","Net Profit","Returns"], answer:0, explanation:"Gross Profit = Sales/Revenue − Cost of Goods Sold (Cost of Sales)" },
  { id:"ac10_06", grade:10, subject:"Accounting", topic:"Financial Statements", question:"The Income Statement shows:", options:["Revenue, expenses, and profit","Assets and liabilities","Cash inflows only","Owner's equity"], answer:0, explanation:"The Income Statement (Profit & Loss) shows income, expenses, and the resulting profit or loss" },
  { id:"ac10_07", grade:10, subject:"Accounting", topic:"Journals", question:"The Cash Receipts Journal records:", options:["All money received","All money paid","Credit sales","Credit purchases"], answer:0, explanation:"CRJ (Cash Receipts Journal) records all cash coming into the business" },
  { id:"ac10_08", grade:10, subject:"Accounting", topic:"Journals", question:"The Cash Payments Journal records:", options:["All money paid out","All money received","All credit transactions","Stock movements"], answer:0, explanation:"CPJ (Cash Payments Journal) records all cash leaving the business" },
  { id:"ac10_09", grade:10, subject:"Accounting", topic:"VAT", question:"The standard VAT rate in South Africa is:", options:["15%","14%","10%","20%"], answer:0, explanation:"South Africa's standard VAT rate was increased from 14% to 15% on 1 April 2018" },
  { id:"ac10_10", grade:10, subject:"Accounting", topic:"Debtors", question:"A debtor is someone who:", options:["Owes money to the business","The business owes money to","Supplies goods on credit","Manages the accounts"], answer:0, explanation:"Debtors (trade receivables) owe money to the business — they bought on credit" },
  { id:"ac10_11", grade:10, subject:"Accounting", topic:"Creditors", question:"A creditor is someone to whom:", options:["The business owes money","Money is owed by a customer","The business lends money","No transaction has occurred"], answer:0, explanation:"Creditors (trade payables) are owed money by the business — suppliers who gave goods on credit" },
  { id:"ac10_12", grade:10, subject:"Accounting", topic:"Banking", question:"A bank reconciliation compares the cashbook to the:", options:["Bank statement","Income statement","Trial balance","Balance sheet"], answer:0, explanation:"Bank reconciliation: compare the company's cashbook balance with the bank's statement to find differences" },
  { id:"ac10_13", grade:10, subject:"Accounting", topic:"Stock", question:"FIFO stands for:", options:["First In First Out","First In Final Out","Final In First Out","Fixed Income Final Output"], answer:0, explanation:"FIFO: the first stock purchased is assumed to be the first stock sold" },
  { id:"ac10_14", grade:10, subject:"Accounting", topic:"Ledger", question:"The general ledger contains:", options:["All accounts of the business","Only asset accounts","Only cash transactions","The trial balance only"], answer:0, explanation:"The general ledger is the main book of accounts — it contains all accounts (assets, liabilities, income, expenses)" },
  { id:"ac10_15", grade:10, subject:"Accounting", topic:"Trial Balance", question:"The Trial Balance proves that:", options:["Total debits equal total credits","Assets equal liabilities","Income exceeds expenses","All entries are correct"], answer:0, explanation:"A trial balance checks that total debits = total credits (but doesn't guarantee all entries are correct)" },

  // ══════════════════════════════════════════════════════════════════════════
  // ACCOUNTING — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ac12_01", grade:12, subject:"Accounting", topic:"Companies", question:"Ordinary share capital is classified as:", options:["Equity","Liability","Asset","Revenue"], answer:0, explanation:"Ordinary share capital represents the owners' investment — it is classified as equity on the balance sheet" },
  { id:"ac12_02", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"The current ratio measures:", options:["Short-term liquidity","Profitability","Solvency","Efficiency"], answer:0, explanation:"Current ratio = Current Assets / Current Liabilities — measures ability to pay short-term debts" },
  { id:"ac12_03", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Gross Profit % = (Gross Profit / Sales) × …?", options:["100","Sales","Net Profit","Expenses"], answer:0, explanation:"Gross Profit % = (Gross Profit ÷ Net Sales) × 100 — expressed as a percentage" },
  { id:"ac12_04", grade:12, subject:"Accounting", topic:"Cash Flow", question:"The Cash Flow Statement shows:", options:["Sources and uses of cash","Profit and loss","Assets and liabilities","Equity changes"], answer:0, explanation:"The Cash Flow Statement tracks actual cash inflows and outflows from operating, investing, and financing activities" },
  { id:"ac12_05", grade:12, subject:"Accounting", topic:"Companies", question:"Dividends are paid from:", options:["Retained income / profits","Share capital","Loans","Assets"], answer:0, explanation:"Dividends are distributions of profit to shareholders — paid out of retained earnings/profit" },
  { id:"ac12_06", grade:12, subject:"Accounting", topic:"Fixed Assets", question:"Accumulated depreciation is shown on the:", options:["Balance Sheet","Income Statement","Cash Flow Statement","Trial Balance only"], answer:0, explanation:"Accumulated depreciation reduces the carrying value of fixed assets on the balance sheet" },
  { id:"ac12_07", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Acid test ratio = (Current Assets − Stock) / …?", options:["Current Liabilities","Total Assets","Equity","Sales"], answer:0, explanation:"Acid test (quick ratio) = (Current Assets − Inventory) / Current Liabilities — excludes less-liquid stock" },
  { id:"ac12_08", grade:12, subject:"Accounting", topic:"Budgets", question:"A projected income statement helps a business:", options:["Plan future income and expenses","Record past transactions","Calculate VAT","Audit accounts"], answer:0, explanation:"Projected/budgeted income statements help management plan and control future performance" },
  { id:"ac12_09", grade:12, subject:"Accounting", topic:"Auditing", question:"An internal auditor works:", options:["Within the company","For the government","For SARS","For an external firm"], answer:0, explanation:"Internal auditors are employees of the organisation who review internal controls and operations" },
  { id:"ac12_10", grade:12, subject:"Accounting", topic:"Ethics", question:"GAAP stands for:", options:["Generally Accepted Accounting Principles","Government Approved Audit Procedures","General Asset Accounting Policy","Gross Annual Accounting Practice"], answer:0, explanation:"GAAP = Generally Accepted Accounting Principles — the framework for financial reporting" },
  { id:"ac12_11", grade:12, subject:"Accounting", topic:"Manufacturing", question:"Direct materials + Direct labour + Manufacturing overheads =", options:["Total production cost","Gross profit","Cost of sales","Net profit"], answer:0, explanation:"Total production cost = direct materials + direct labour + manufacturing overheads" },
  { id:"ac12_12", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Return on Equity (ROE) measures:", options:["Profit generated from shareholders' equity","Profit as % of total assets","Ability to pay short-term debts","Revenue growth"], answer:0, explanation:"ROE = Net Profit / Shareholders' Equity × 100 — how efficiently equity generates profit" },
  { id:"ac12_13", grade:12, subject:"Accounting", topic:"Companies", question:"A rights issue allows existing shareholders to:", options:["Buy new shares at a discounted price","Receive bonus shares free","Sell shares back to the company","Vote on dividends"], answer:0, explanation:"A rights issue gives existing shareholders the right to buy additional shares at a discount before the public" },
  { id:"ac12_14", grade:12, subject:"Accounting", topic:"Companies", question:"Debentures are:", options:["Long-term debt instruments issued by a company","Shares with voting rights","Short-term loans","Government bonds"], answer:0, explanation:"Debentures are fixed-interest debt securities — the company borrows from investors and pays interest" },
  { id:"ac12_15", grade:12, subject:"Accounting", topic:"Financial Analysis", question:"Stock turnover rate = Cost of Sales / …?", options:["Average Stock","Opening Stock","Net Sales","Closing Stock"], answer:0, explanation:"Stock turnover = Cost of Sales / Average Stock — measures how often stock is sold and replaced per year" },

  // ══════════════════════════════════════════════════════════════════════════
  // ENGLISH — GRADE 10, 11, 12 (combined — Language, Literature, Writing)
  // ══════════════════════════════════════════════════════════════════════════
  { id:"en10_01", grade:10, subject:"English", topic:"Grammar", question:"Which sentence is grammatically correct?", options:["She doesn't know nothing.","She doesn't know anything.","She know nothing.","She don't know nothing."], answer:1, explanation:"Double negatives are grammatically incorrect. 'Doesn't know anything' uses a single negative correctly." },
  { id:"en10_02", grade:10, subject:"English", topic:"Grammar", question:"The past tense of 'run' is:", options:["Runned","Ran","Ranned","Runs"], answer:1, explanation:"'Run' is an irregular verb. Its past tense is 'ran', not 'runned'." },
  { id:"en10_03", grade:10, subject:"English", topic:"Figures of Speech", question:"'The sun smiled on us today' is an example of:", options:["Personification","Simile","Metaphor","Alliteration"], answer:0, explanation:"Personification gives human qualities to non-human things. The sun cannot literally smile." },
  { id:"en10_04", grade:10, subject:"English", topic:"Figures of Speech", question:"'As brave as a lion' is a:", options:["Simile","Metaphor","Personification","Hyperbole"], answer:0, explanation:"A simile compares using 'as' or 'like'. 'As brave as a lion' directly compares two things." },
  { id:"en10_05", grade:10, subject:"English", topic:"Comprehension", question:"The main purpose of a topic sentence is to:", options:["Introduce the main idea of a paragraph","End the paragraph","Give an example","Provide evidence"], answer:0, explanation:"A topic sentence states the main idea/argument of a paragraph — usually the first sentence" },
  { id:"en11_01", grade:11, subject:"English", topic:"Grammar", question:"Which is the correct use of a semi-colon?", options:["He studied hard; he passed the exam.","He studied hard; and he passed.","He studied: hard; passed.","He; studied hard."], answer:0, explanation:"A semi-colon connects two closely related independent clauses without a conjunction" },
  { id:"en11_02", grade:11, subject:"English", topic:"Literature", question:"The protagonist of a story is:", options:["The main character","The villain","The narrator","The author"], answer:0, explanation:"The protagonist is the central/main character, usually the hero of the story" },
  { id:"en11_03", grade:11, subject:"English", topic:"Literature", question:"An antagonist is:", options:["The character opposing the protagonist","The narrator","The setting","The climax"], answer:0, explanation:"The antagonist is the character (or force) working against the protagonist — often the villain" },
  { id:"en11_04", grade:11, subject:"English", topic:"Figures of Speech", question:"'I've told you a million times!' is an example of:", options:["Hyperbole","Simile","Metaphor","Irony"], answer:0, explanation:"Hyperbole is extreme exaggeration for emphasis or effect — you haven't literally said it a million times" },
  { id:"en11_05", grade:11, subject:"English", topic:"Writing", question:"In a formal letter, the salutation ends with:", options:["A comma or colon","A full stop","An exclamation mark","Nothing"], answer:0, explanation:"Formal letter salutations (Dear Mr Smith,) end with a comma. Some formats use a colon." },
  { id:"en12_01", grade:12, subject:"English", topic:"Grammar", question:"The subjunctive mood is used to express:", options:["Hypothetical or wish situations","Past actions","Future certainty","Questions"], answer:0, explanation:"Subjunctive: 'If I were you...' or 'I suggest that he be present' — expresses wishes, hypotheticals, demands" },
  { id:"en12_02", grade:12, subject:"English", topic:"Literature", question:"A soliloquy is:", options:["A character speaking their thoughts aloud when alone","A conversation between two characters","A narrator's description","A poem within a play"], answer:0, explanation:"A soliloquy is when a character speaks their inner thoughts aloud — revealing feelings to the audience" },
  { id:"en12_03", grade:12, subject:"English", topic:"Literature", question:"The climax of a story is:", options:["The point of highest tension","The introduction","The falling action","The resolution"], answer:0, explanation:"The climax is the turning point — the moment of highest tension or drama in the narrative arc" },
  { id:"en12_04", grade:12, subject:"English", topic:"Figures of Speech", question:"'The classroom was a zoo' is a:", options:["Metaphor","Simile","Personification","Alliteration"], answer:0, explanation:"A metaphor makes a direct comparison (without 'like' or 'as'). 'Was a zoo' = directly says it is something else." },
  { id:"en12_05", grade:12, subject:"English", topic:"Writing", question:"Which of these best describes an argumentative essay?", options:["It takes a clear position and supports it with evidence","It tells a personal story","It describes a place or event","It explains how something works"], answer:0, explanation:"An argumentative essay presents a clear stance on an issue and backs it up with logical evidence and reasoning" },

  // ══════════════════════════════════════════════════════════════════════════
  // BUSINESS STUDIES — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"bs10_01", grade:10, subject:"Business Studies", topic:"Forms of Ownership", question:"A sole trader business is owned by:", options:["One person","Two or more partners","Shareholders","The government"], answer:0, explanation:"A sole trader (sole proprietorship) is owned and managed by a single individual" },
  { id:"bs10_02", grade:10, subject:"Business Studies", topic:"Forms of Ownership", question:"A partnership has a maximum of how many partners in SA?", options:["20","10","50","Unlimited"], answer:0, explanation:"In South Africa, a general partnership is limited to 20 partners (except professional partnerships)" },
  { id:"bs11_01", grade:11, subject:"Business Studies", topic:"Business Functions", question:"Which business function deals with hiring and training staff?", options:["Human Resources","Marketing","Finance","Operations"], answer:0, explanation:"Human Resources Management (HRM) handles recruitment, training, performance management, and employee relations" },
  { id:"bs11_02", grade:11, subject:"Business Studies", topic:"Marketing", question:"The 4 P's of marketing are:", options:["Product, Price, Place, Promotion","People, Process, Plan, Profit","Product, Profit, Place, People","Price, Plan, Process, Promotion"], answer:0, explanation:"The Marketing Mix = Product, Price, Place (distribution), Promotion — known as the 4 P's" },
  { id:"bs12_01", grade:12, subject:"Business Studies", topic:"Business Legislation", question:"The Consumer Protection Act in SA protects:", options:["Consumers from unfair business practices","Businesses from consumers","Employees from unfair dismissal","Companies from competition"], answer:0, explanation:"The Consumer Protection Act (68 of 2008) gives consumers rights against unfair, dishonest, and unsafe business practices" },
  { id:"bs12_02", grade:12, subject:"Business Studies", topic:"Business Ethics", question:"Corporate Social Responsibility (CSR) refers to:", options:["A company's commitment to ethical, social, and environmental responsibility","Profit maximisation","Tax avoidance strategies","Shareholder returns only"], answer:0, explanation:"CSR: businesses going beyond profit to contribute positively to society and the environment" },

  // ══════════════════════════════════════════════════════════════════════════
  // ECONOMICS — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ec10_01", grade:10, subject:"Economics", topic:"Basic Concepts", question:"Scarcity in economics means:", options:["Limited resources relative to unlimited wants","Shortage of money only","Lack of natural resources","High inflation"], answer:0, explanation:"Scarcity is the fundamental economic problem: unlimited human wants vs limited resources" },
  { id:"ec10_02", grade:10, subject:"Economics", topic:"Basic Concepts", question:"Opportunity cost is:", options:["The value of the next best alternative forgone","The price of a product","The cost of production","The profit lost"], answer:0, explanation:"Opportunity cost is what you give up to get something else — the next best alternative sacrificed" },
  { id:"ec11_01", grade:11, subject:"Economics", topic:"Microeconomics", question:"The law of demand states: as price increases, quantity demanded:", options:["Decreases","Increases","Stays the same","Doubles"], answer:0, explanation:"Law of Demand: there is an inverse relationship between price and quantity demanded (ceteris paribus)" },
  { id:"ec11_02", grade:11, subject:"Economics", topic:"Microeconomics", question:"A market is in equilibrium when:", options:["Quantity supplied equals quantity demanded","Price is at its maximum","Supply is greater than demand","Demand is greater than supply"], answer:0, explanation:"Market equilibrium: the price at which the quantity buyers want to buy equals the quantity sellers want to sell" },
  { id:"ec12_01", grade:12, subject:"Economics", topic:"Macroeconomics", question:"GDP stands for:", options:["Gross Domestic Product","General Development Plan","Gross Development Progress","Government Domestic Policy"], answer:0, explanation:"GDP = Gross Domestic Product — the total monetary value of all goods and services produced in a country in a year" },
  { id:"ec12_02", grade:12, subject:"Economics", topic:"Macroeconomics", question:"Inflation means:", options:["A general rise in the price level over time","A fall in prices","Increased employment","Economic growth"], answer:0, explanation:"Inflation is a sustained increase in the general price level, reducing purchasing power of money" },

  // ══════════════════════════════════════════════════════════════════════════
  // HISTORY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"hi10_01", grade:10, subject:"History", topic:"World History", question:"The First World War began in:", options:["1914","1918","1939","1905"], answer:0, explanation:"World War I began on 28 July 1914 following the assassination of Archduke Franz Ferdinand" },
  { id:"hi10_02", grade:10, subject:"History", topic:"South African History", question:"The Anglo-Boer War took place between:", options:["1899-1902","1914-1918","1939-1945","1880-1881"], answer:0, explanation:"The Second Anglo-Boer War (South African War) was fought between the British Empire and the Boer Republics from 1899 to 1902" },
  { id:"hi11_01", grade:11, subject:"History", topic:"Cold War", question:"The Cold War was primarily between:", options:["USA and Soviet Union","USA and Germany","UK and Soviet Union","USA and China"], answer:0, explanation:"The Cold War (1947–1991) was the ideological and political rivalry between the USA (capitalism) and USSR (communism)" },
  { id:"hi11_02", grade:11, subject:"History", topic:"SA History", question:"The ANC was founded in:", options:["1912","1948","1960","1994"], answer:0, explanation:"The African National Congress (ANC) was founded on 8 January 1912 in Bloemfontein as the South African Native National Congress" },
  { id:"hi12_01", grade:12, subject:"History", topic:"SA History", question:"The Sharpeville Massacre occurred in:", options:["1960","1976","1948","1990"], answer:0, explanation:"On 21 March 1960, police opened fire on peaceful protesters in Sharpeville, killing 69 people" },
  { id:"hi12_02", grade:12, subject:"History", topic:"SA History", question:"Apartheid officially ended when South Africa held its first democratic elections in:", options:["1994","1990","1996","1992"], answer:0, explanation:"South Africa's first fully democratic elections were held on 27 April 1994 — Nelson Mandela became president" },

  // ══════════════════════════════════════════════════════════════════════════
  // GEOGRAPHY — GRADE 10, 11, 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ge10_01", grade:10, subject:"Geography", topic:"Map Work", question:"On a topographic map, contour lines close together indicate:", options:["Steep slope","Gentle slope","Flat land","A river"], answer:0, explanation:"Closely-spaced contour lines = steep terrain; widely spaced = gentle slope" },
  { id:"ge10_02", grade:10, subject:"Geography", topic:"Atmosphere", question:"The layer of atmosphere closest to Earth's surface is the:", options:["Troposphere","Stratosphere","Mesosphere","Thermosphere"], answer:0, explanation:"The troposphere is the lowest atmospheric layer (0–12 km) where all weather occurs" },
  { id:"ge11_01", grade:11, subject:"Geography", topic:"Climate", question:"The Coriolis effect causes winds in the Southern Hemisphere to deflect:", options:["To the left","To the right","Straight up","Straight down"], answer:0, explanation:"In the Southern Hemisphere, the Coriolis effect deflects moving air/water to the left (opposite to Northern Hemisphere)" },
  { id:"ge11_02", grade:11, subject:"Geography", topic:"Population", question:"A population pyramid with a wide base indicates:", options:["High birth rate, young population","Low birth rate","Ageing population","High death rate only"], answer:0, explanation:"Wide base in a population pyramid = many young people = high birth rate (often developing countries)" },
  { id:"ge12_01", grade:12, subject:"Geography", topic:"Development", question:"The Human Development Index (HDI) measures:", options:["Life expectancy, education, and income","GDP only","Population size","Industrial output"], answer:0, explanation:"HDI = composite measure of health (life expectancy), education, and standard of living (GNI per capita)" },
  { id:"ge12_02", grade:12, subject:"Geography", topic:"Geomorphology", question:"A V-shaped valley is formed by:", options:["River erosion","Glacial erosion","Wind erosion","Tectonic uplift"], answer:0, explanation:"V-shaped valleys are formed by river downcutting (vertical erosion) in mountainous areas" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL MATHEMATICS — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tm10_01", grade:10, subject:"Technical Mathematics", topic:"Algebra", question:"Simplify: 4a + 3b − 2a + b", options:["2a + 4b","6a + 4b","2a + 2b","6a + 2b"], answer:0, explanation:"Collect like terms: (4a−2a) + (3b+b) = 2a + 4b" },
  { id:"tm10_02", grade:10, subject:"Technical Mathematics", topic:"Algebra", question:"Solve for x: 5x − 10 = 20", options:["x = 6","x = 2","x = 10","x = 30"], answer:0, explanation:"5x = 20 + 10 = 30, so x = 30 ÷ 5 = 6" },
  { id:"tm10_03", grade:10, subject:"Technical Mathematics", topic:"Algebra", question:"Expand: 3(2x − 4)", options:["6x − 12","6x + 12","6x − 4","3x − 12"], answer:0, explanation:"Distribute: 3 × 2x = 6x and 3 × (−4) = −12, giving 6x − 12" },
  { id:"tm10_04", grade:10, subject:"Technical Mathematics", topic:"Exponents", question:"What is 3⁴?", options:["81","12","27","64"], answer:0, explanation:"3⁴ = 3 × 3 × 3 × 3 = 81" },
  { id:"tm10_05", grade:10, subject:"Technical Mathematics", topic:"Exponents", question:"Simplify: x⁵ ÷ x²", options:["x³","x⁷","x¹⁰","x"], answer:0, explanation:"When dividing same bases, subtract exponents: x⁵ ÷ x² = x^(5−2) = x³" },
  { id:"tm10_06", grade:10, subject:"Technical Mathematics", topic:"Geometry", question:"A right angle measures:", options:["90°","180°","45°","360°"], answer:0, explanation:"A right angle is exactly 90° — shown by a small square in diagrams" },
  { id:"tm10_07", grade:10, subject:"Technical Mathematics", topic:"Geometry", question:"The perimeter of a square with side 7 cm is:", options:["28 cm","14 cm","49 cm","21 cm"], answer:0, explanation:"Perimeter of square = 4 × side = 4 × 7 = 28 cm" },
  { id:"tm10_08", grade:10, subject:"Technical Mathematics", topic:"Geometry", question:"The area of a triangle with base 10 cm and height 6 cm is:", options:["30 cm²","60 cm²","16 cm²","100 cm²"], answer:0, explanation:"Area of triangle = ½ × base × height = ½ × 10 × 6 = 30 cm²" },
  { id:"tm10_09", grade:10, subject:"Technical Mathematics", topic:"Measurement", question:"Convert 3.5 km to metres:", options:["3500 m","350 m","35 000 m","3.5 m"], answer:0, explanation:"1 km = 1000 m, so 3.5 km = 3.5 × 1000 = 3500 m" },
  { id:"tm10_10", grade:10, subject:"Technical Mathematics", topic:"Measurement", question:"The volume of a rectangular prism 4m × 3m × 2m is:", options:["24 m³","18 m³","9 m³","26 m³"], answer:0, explanation:"Volume = length × width × height = 4 × 3 × 2 = 24 m³" },
  { id:"tm10_11", grade:10, subject:"Technical Mathematics", topic:"Trigonometry", question:"In a right-angled triangle, which side is the hypotenuse?", options:["The side opposite the right angle","The shortest side","The base","The vertical side"], answer:0, explanation:"The hypotenuse is always opposite the right angle and is the longest side of a right triangle" },
  { id:"tm10_12", grade:10, subject:"Technical Mathematics", topic:"Trigonometry", question:"sin 30° =", options:["0.5","1","0.866","0.707"], answer:0, explanation:"sin 30° = 1/2 = 0.5 (standard angle — must be memorised)" },
  { id:"tm10_13", grade:10, subject:"Technical Mathematics", topic:"Number Patterns", question:"The next term in: 2, 5, 8, 11, … is:", options:["14","13","15","12"], answer:0, explanation:"Common difference is 3: 11 + 3 = 14" },
  { id:"tm10_14", grade:10, subject:"Technical Mathematics", topic:"Statistics", question:"The mean of 4, 8, 6, 10, 2 is:", options:["6","5","7","8"], answer:0, explanation:"Mean = sum ÷ count = (4+8+6+10+2) ÷ 5 = 30 ÷ 5 = 6" },
  { id:"tm10_15", grade:10, subject:"Technical Mathematics", topic:"Finance", question:"Simple interest on R1000 at 5% for 2 years is:", options:["R100","R50","R200","R105"], answer:0, explanation:"SI = P × r × t = 1000 × 0.05 × 2 = R100" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL MATHEMATICS — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tm11_01", grade:11, subject:"Technical Mathematics", topic:"Algebra", question:"Factorise: 2x² + 6x", options:["2x(x + 3)","2(x² + 3x)","x(2x + 6)","2x(x − 3)"], answer:0, explanation:"Take out the HCF: 2x is common to both terms → 2x(x + 3)" },
  { id:"tm11_02", grade:11, subject:"Technical Mathematics", topic:"Algebra", question:"Solve: x² = 25", options:["x = ±5","x = 5","x = 25","x = ±25"], answer:0, explanation:"Take the square root of both sides: x = ±√25 = ±5" },
  { id:"tm11_03", grade:11, subject:"Technical Mathematics", topic:"Trigonometry", question:"cos 45° =", options:["√2/2","1/2","√3/2","1"], answer:0, explanation:"cos 45° = 1/√2 = √2/2 ≈ 0.707" },
  { id:"tm11_04", grade:11, subject:"Technical Mathematics", topic:"Trigonometry", question:"In a right triangle, if the opposite = 6 and hypotenuse = 10, sin θ =", options:["0.6","0.8","0.75","0.5"], answer:0, explanation:"sin θ = opposite/hypotenuse = 6/10 = 0.6" },
  { id:"tm11_05", grade:11, subject:"Technical Mathematics", topic:"Geometry", question:"The sum of interior angles of a quadrilateral is:", options:["360°","180°","270°","540°"], answer:0, explanation:"A quadrilateral has 4 sides. Sum of interior angles = (4−2) × 180° = 360°" },
  { id:"tm11_06", grade:11, subject:"Technical Mathematics", topic:"Geometry", question:"A circle with radius 7 cm has circumference:", options:["44 cm","14 cm","154 cm","28 cm"], answer:0, explanation:"C = 2πr = 2 × 22/7 × 7 = 44 cm" },
  { id:"tm11_07", grade:11, subject:"Technical Mathematics", topic:"Geometry", question:"Area of a circle with radius 5 cm:", options:["78.5 cm²","31.4 cm²","25 cm²","15.7 cm²"], answer:0, explanation:"A = πr² = π × 5² = 25π ≈ 78.5 cm²" },
  { id:"tm11_08", grade:11, subject:"Technical Mathematics", topic:"Finance", question:"R5000 at 8% compound interest for 2 years gives:", options:["R5832","R5800","R5400","R6000"], answer:0, explanation:"A = P(1+r)ⁿ = 5000(1.08)² = 5000 × 1.1664 = R5832" },
  { id:"tm11_09", grade:11, subject:"Technical Mathematics", topic:"Measurement", question:"Convert 250 cm² to m²:", options:["0.025 m²","2.5 m²","0.25 m²","25 m²"], answer:0, explanation:"1 m² = 10 000 cm², so 250 cm² ÷ 10 000 = 0.025 m²" },
  { id:"tm11_10", grade:11, subject:"Technical Mathematics", topic:"Statistics", question:"The mode of: 3, 5, 5, 7, 8, 5 is:", options:["5","7","3","8"], answer:0, explanation:"The mode is the value that appears most often. 5 appears 3 times." },
  { id:"tm11_11", grade:11, subject:"Technical Mathematics", topic:"Algebra", question:"If y = 2x − 3, what is x when y = 7?", options:["x = 5","x = 7","x = 4","x = 2"], answer:0, explanation:"7 = 2x − 3 → 2x = 10 → x = 5" },
  { id:"tm11_12", grade:11, subject:"Technical Mathematics", topic:"Number Patterns", question:"Find T₄ of the sequence Tₙ = 3n + 1:", options:["13","10","7","16"], answer:0, explanation:"T₄ = 3(4) + 1 = 12 + 1 = 13" },
  { id:"tm11_13", grade:11, subject:"Technical Mathematics", topic:"Geometry", question:"Two angles are supplementary if they add up to:", options:["180°","90°","360°","270°"], answer:0, explanation:"Supplementary angles sum to 180°. Complementary angles sum to 90°." },
  { id:"tm11_14", grade:11, subject:"Technical Mathematics", topic:"Trigonometry", question:"tan θ = opposite/…?", options:["adjacent","hypotenuse","base","height"], answer:0, explanation:"TOA in SOH-CAH-TOA: tan = Opposite ÷ Adjacent" },
  { id:"tm11_15", grade:11, subject:"Technical Mathematics", topic:"Measurement", question:"The surface area of a cube with side 3 cm is:", options:["54 cm²","27 cm²","18 cm²","36 cm²"], answer:0, explanation:"Surface area of cube = 6s² = 6 × 3² = 6 × 9 = 54 cm²" },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL MATHEMATICS — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"tm12_01", grade:12, subject:"Technical Mathematics", topic:"Algebra", question:"Solve: 2x² − 8 = 0", options:["x = ±2","x = ±4","x = 2","x = 4"], answer:0, explanation:"2x² = 8 → x² = 4 → x = ±√4 = ±2" },
  { id:"tm12_02", grade:12, subject:"Technical Mathematics", topic:"Algebra", question:"The roots of x² − 6x + 9 = 0 are:", options:["x = 3 (repeated)","x = 3 and x = −3","x = −3 (repeated)","x = 6 and x = 3"], answer:0, explanation:"Factorise: (x−3)² = 0, so x = 3 is a repeated root" },
  { id:"tm12_03", grade:12, subject:"Technical Mathematics", topic:"Trigonometry", question:"The sine rule states: a/sin A =", options:["b/sin B","b/cos B","a/cos A","sin B/b"], answer:0, explanation:"Sine rule: a/sin A = b/sin B = c/sin C — used for non-right triangles" },
  { id:"tm12_04", grade:12, subject:"Technical Mathematics", topic:"Trigonometry", question:"The cosine rule: c² = a² + b² − 2ab cos C is used when you know:", options:["Two sides and included angle","Only angles","Only one side","Three angles"], answer:0, explanation:"Cosine rule is used when you have two sides and the included angle (SAS) or all three sides (SSS)" },
  { id:"tm12_05", grade:12, subject:"Technical Mathematics", topic:"Finance", question:"The depreciation formula (straight line) is:", options:["A = P(1 − in)","A = P(1 + i)ⁿ","A = P − P/n","A = Pin"], answer:0, explanation:"Straight-line depreciation: A = P(1 − in), where i = annual rate and n = years" },
  { id:"tm12_06", grade:12, subject:"Technical Mathematics", topic:"Finance", question:"Hire purchase means you:", options:["Pay in instalments with interest","Pay cash upfront","Rent without ownership","Save before buying"], answer:0, explanation:"Hire purchase (HP): you take the item immediately and pay it off in monthly instalments (with interest)" },
  { id:"tm12_07", grade:12, subject:"Technical Mathematics", topic:"Geometry", question:"The volume of a cone: V = ⅓πr²h. If r=3 and h=7:", options:["21π","63π","9π","7π"], answer:0, explanation:"V = ⅓ × π × 3² × 7 = ⅓ × π × 9 × 7 = 21π" },
  { id:"tm12_08", grade:12, subject:"Technical Mathematics", topic:"Geometry", question:"The surface area of a cylinder (closed both ends): SA =", options:["2πr² + 2πrh","πr² + 2πrh","2πrh","4πr²"], answer:0, explanation:"Closed cylinder SA = 2 circles + curved surface = 2πr² + 2πrh" },
  { id:"tm12_09", grade:12, subject:"Technical Mathematics", topic:"Statistics", question:"The range of: 4, 9, 2, 15, 7 is:", options:["13","11","15","7"], answer:0, explanation:"Range = maximum − minimum = 15 − 2 = 13" },
  { id:"tm12_10", grade:12, subject:"Technical Mathematics", topic:"Statistics", question:"An ogive is a graph of:", options:["Cumulative frequency","Frequency only","Mean values","Probability"], answer:0, explanation:"An ogive (cumulative frequency curve) shows running totals of frequency — used to find quartiles" },
  { id:"tm12_11", grade:12, subject:"Technical Mathematics", topic:"Measurement", question:"Convert 72 km/h to m/s:", options:["20 m/s","72 m/s","0.72 m/s","7.2 m/s"], answer:0, explanation:"Divide by 3.6: 72 ÷ 3.6 = 20 m/s. (or × 1000/3600)" },
  { id:"tm12_12", grade:12, subject:"Technical Mathematics", topic:"Number Patterns", question:"In a geometric sequence, if T₁ = 3 and r = 2, find T₅:", options:["48","96","24","12"], answer:0, explanation:"Tₙ = a × r^(n−1). T₅ = 3 × 2⁴ = 3 × 16 = 48" },
  { id:"tm12_13", grade:12, subject:"Technical Mathematics", topic:"Algebra", question:"Solve simultaneously: x + y = 7 and x − y = 3:", options:["x=5, y=2","x=3, y=4","x=4, y=3","x=7, y=0"], answer:0, explanation:"Add the equations: 2x = 10, x = 5. Then 5 + y = 7, y = 2." },
  { id:"tm12_14", grade:12, subject:"Technical Mathematics", topic:"Trigonometry", question:"Area of a triangle = ½ab sin C. If a=6, b=8, C=30°:", options:["12","24","48","6"], answer:0, explanation:"Area = ½ × 6 × 8 × sin 30° = ½ × 6 × 8 × 0.5 = 12" },
  { id:"tm12_15", grade:12, subject:"Technical Mathematics", topic:"Geometry", question:"Two tangents drawn from an external point to a circle are:", options:["Equal in length","Parallel","Perpendicular to each other","Different lengths"], answer:0, explanation:"Tangent lines from an external point to a circle are always equal in length" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL LITERACY — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ml10_01", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"What is 15% of R800?", options:["R120","R80","R150","R200"], answer:0, explanation:"15% of 800 = 0.15 × 800 = R120" },
  { id:"ml10_02", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"A shirt costs R350. It is discounted by 20%. What is the sale price?", options:["R280","R70","R420","R300"], answer:0, explanation:"Discount = 20% × 350 = R70. Sale price = 350 − 70 = R280" },
  { id:"ml10_03", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"Which fraction is equivalent to 0.75?", options:["3/4","3/5","7/10","1/4"], answer:0, explanation:"0.75 = 75/100 = 3/4 (simplify by dividing by 25)" },
  { id:"ml10_04", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"If you earn R3500 per month and pay 25% tax, your take-home pay is:", options:["R2625","R875","R3000","R2500"], answer:0, explanation:"Tax = 25% × 3500 = R875. Take-home = 3500 − 875 = R2625" },
  { id:"ml10_05", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"VAT at 15% on an item of R200 means the total cost is:", options:["R230","R215","R200","R185"], answer:0, explanation:"VAT = 15% × 200 = R30. Total = 200 + 30 = R230" },
  { id:"ml10_06", grade:10, subject:"Mathematical Literacy", topic:"Measurement", question:"How many millilitres are in 2.5 litres?", options:["2500 ml","250 ml","25 000 ml","0.25 ml"], answer:0, explanation:"1 litre = 1000 ml. 2.5 × 1000 = 2500 ml" },
  { id:"ml10_07", grade:10, subject:"Mathematical Literacy", topic:"Measurement", question:"A room is 5m long and 4m wide. Its area is:", options:["20 m²","18 m²","9 m²","40 m²"], answer:0, explanation:"Area of rectangle = length × width = 5 × 4 = 20 m²" },
  { id:"ml10_08", grade:10, subject:"Mathematical Literacy", topic:"Maps & Plans", question:"On a map with scale 1:50 000, a distance of 2 cm represents:", options:["1 km","50 000 cm","2 km","500 m"], answer:0, explanation:"2 cm × 50 000 = 100 000 cm = 1000 m = 1 km" },
  { id:"ml10_09", grade:10, subject:"Mathematical Literacy", topic:"Data Handling", question:"The middle value of an ordered data set is called the:", options:["Median","Mean","Mode","Range"], answer:0, explanation:"The median is the middle value when data is arranged in order" },
  { id:"ml10_10", grade:10, subject:"Mathematical Literacy", topic:"Data Handling", question:"A pie chart shows data as parts of a:", options:["Circle","Bar","Line","Histogram"], answer:0, explanation:"A pie chart divides a circle into sectors, each representing a proportion of the whole" },
  { id:"ml10_11", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"Round 3.748 to 2 decimal places:", options:["3.75","3.74","3.7","4.00"], answer:0, explanation:"Look at the 3rd decimal (8 ≥ 5), so round up: 3.748 → 3.75" },
  { id:"ml10_12", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"An electricity bill shows 450 units at R1.20 per unit. The bill is:", options:["R540","R450","R270","R120"], answer:0, explanation:"450 units × R1.20 = R540" },
  { id:"ml10_13", grade:10, subject:"Mathematical Literacy", topic:"Measurement", question:"A fence needs to go around a garden 12m × 8m. How much fencing is needed?", options:["40 m","20 m","96 m","32 m"], answer:0, explanation:"Perimeter = 2(l + w) = 2(12 + 8) = 2 × 20 = 40 m" },
  { id:"ml10_14", grade:10, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"Express 45 minutes as a fraction of 1 hour:", options:["3/4","1/2","1/4","2/3"], answer:0, explanation:"45 minutes out of 60 minutes = 45/60 = 3/4" },
  { id:"ml10_15", grade:10, subject:"Mathematical Literacy", topic:"Finance", question:"If petrol costs R22.50 per litre and you fill 40 litres, the cost is:", options:["R900","R450","R880","R990"], answer:0, explanation:"40 × R22.50 = R900" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL LITERACY — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ml11_01", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"Compound interest on R4000 at 6% for 2 years (using A = P(1+r)ⁿ):", options:["R4494.40","R4480","R4240","R4480.40"], answer:0, explanation:"A = 4000 × (1.06)² = 4000 × 1.1236 = R4494.40" },
  { id:"ml11_02", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"A monthly bond repayment is R2800. Over 20 years, total repayment =", options:["R672 000","R280 000","R336 000","R560 000"], answer:0, explanation:"Total = R2800 × 12 months × 20 years = R2800 × 240 = R672 000" },
  { id:"ml11_03", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"If inflation is 5% per year, an item costing R100 today will cost how much in 2 years?", options:["R110.25","R110","R105","R115"], answer:0, explanation:"After 1 yr: 100 × 1.05 = R105. After 2 yrs: 105 × 1.05 = R110.25" },
  { id:"ml11_04", grade:11, subject:"Mathematical Literacy", topic:"Measurement", question:"A car travels 360 km in 4 hours. Its average speed is:", options:["90 km/h","40 km/h","1440 km/h","45 km/h"], answer:0, explanation:"Speed = Distance ÷ Time = 360 ÷ 4 = 90 km/h" },
  { id:"ml11_05", grade:11, subject:"Mathematical Literacy", topic:"Measurement", question:"Convert 3 hours 45 minutes to minutes:", options:["225 min","345 min","183 min","215 min"], answer:0, explanation:"3 hours = 180 minutes. 180 + 45 = 225 minutes" },
  { id:"ml11_06", grade:11, subject:"Mathematical Literacy", topic:"Maps & Plans", question:"A plan has scale 1:100. A wall 3 cm on the plan is actually:", options:["3 m","30 m","300 cm","0.3 m"], answer:0, explanation:"3 cm × 100 = 300 cm = 3 m" },
  { id:"ml11_07", grade:11, subject:"Mathematical Literacy", topic:"Data Handling", question:"On a box-and-whisker plot, the box represents:", options:["The middle 50% of the data","The full range","The mean","The mode"], answer:0, explanation:"The box in a box-and-whisker plot spans from Q1 to Q3 — the interquartile range (middle 50% of data)" },
  { id:"ml11_08", grade:11, subject:"Mathematical Literacy", topic:"Data Handling", question:"In a scatter plot, a positive correlation means:", options:["As x increases, y increases","As x increases, y decreases","No relationship","Random data"], answer:0, explanation:"Positive correlation: both variables increase together — the scatter plot slopes upward from left to right" },
  { id:"ml11_09", grade:11, subject:"Mathematical Literacy", topic:"Probability", question:"A die is rolled. P(even number) =", options:["1/2","1/3","2/3","1/6"], answer:0, explanation:"Even numbers on a die: 2, 4, 6 = 3 out of 6 outcomes. P = 3/6 = 1/2" },
  { id:"ml11_10", grade:11, subject:"Mathematical Literacy", topic:"Probability", question:"If P(rain) = 0.3, then P(no rain) =", options:["0.7","0.3","0.6","1.3"], answer:0, explanation:"P(not A) = 1 − P(A) = 1 − 0.3 = 0.7" },
  { id:"ml11_11", grade:11, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"A recipe uses 750 g of flour for 12 muffins. For 20 muffins you need:", options:["1250 g","900 g","1500 g","600 g"], answer:0, explanation:"750/12 × 20 = 62.5 × 20 = 1250 g" },
  { id:"ml11_12", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"A R20 000 car loses 15% of its value per year. After 1 year it is worth:", options:["R17 000","R3000","R16 000","R18 000"], answer:0, explanation:"Depreciation = 15% × 20 000 = R3000. Value = 20 000 − 3000 = R17 000" },
  { id:"ml11_13", grade:11, subject:"Mathematical Literacy", topic:"Measurement", question:"Convert 2.5 kg to grams:", options:["2500 g","250 g","25 000 g","0.25 g"], answer:0, explanation:"1 kg = 1000 g. 2.5 × 1000 = 2500 g" },
  { id:"ml11_14", grade:11, subject:"Mathematical Literacy", topic:"Finance", question:"R600 is shared in the ratio 3:2 between two people. The larger share is:", options:["R360","R240","R300","R400"], answer:0, explanation:"Total parts = 5. Larger share = 3/5 × 600 = R360" },
  { id:"ml11_15", grade:11, subject:"Mathematical Literacy", topic:"Measurement", question:"How many tiles (30cm × 30cm) are needed to cover a floor of 2.7m × 1.8m?", options:["54","27","81","45"], answer:0, explanation:"Floor area = 270 × 180 = 48 600 cm². Tile area = 30 × 30 = 900 cm². 48 600 ÷ 900 = 54 tiles" },

  // ══════════════════════════════════════════════════════════════════════════
  // MATHEMATICAL LITERACY — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ml12_01", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"A house is bought for R800 000 at 9.5% interest over 20 years. This is an example of:", options:["A mortgage bond","A personal loan","Hire purchase","Leasing"], answer:0, explanation:"A mortgage bond is a long-term loan secured against property — the most common way to buy a house in SA" },
  { id:"ml12_02", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"If your gross income is R25 000/month and tax is R4800, your net income is:", options:["R20 200","R29 800","R4800","R25 000"], answer:0, explanation:"Net income = Gross income − Tax = R25 000 − R4800 = R20 200" },
  { id:"ml12_03", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"UIF stands for:", options:["Unemployment Insurance Fund","Universal Income Fund","Urban Insurance Finance","United Income Fund"], answer:0, explanation:"UIF (Unemployment Insurance Fund) provides short-term relief to workers who lose their jobs" },
  { id:"ml12_04", grade:12, subject:"Mathematical Literacy", topic:"Maps & Plans", question:"On a road map, a straight line of 4 cm represents 200 km. The scale is:", options:["1:5 000 000","1:500 000","1:50 000","1:200 000"], answer:0, explanation:"200 km = 20 000 000 mm. 4 cm = 40 mm. Scale = 40 : 20 000 000 = 1 : 500 000. Let me recalc: 200km=200×100 000cm=20 000 000cm. 4cm:20 000 000cm = 1:5 000 000" },
  { id:"ml12_05", grade:12, subject:"Mathematical Literacy", topic:"Measurement", question:"A swimming pool is 25m × 10m × 2m deep. Its volume in litres is:", options:["500 000 L","5000 L","50 000 L","5 000 000 L"], answer:0, explanation:"Volume = 25 × 10 × 2 = 500 m³. 1 m³ = 1000 L. 500 × 1000 = 500 000 L" },
  { id:"ml12_06", grade:12, subject:"Mathematical Literacy", topic:"Data Handling", question:"The interquartile range (IQR) is:", options:["Q3 − Q1","Q2 − Q1","Max − Min","Mean − Median"], answer:0, explanation:"IQR = Q3 − Q1 — measures the spread of the middle 50% of data, less affected by outliers" },
  { id:"ml12_07", grade:12, subject:"Mathematical Literacy", topic:"Data Handling", question:"Which graph would best show how a family spends their monthly budget?", options:["Pie chart","Line graph","Scatter plot","Histogram"], answer:0, explanation:"A pie chart is ideal for showing proportions/parts of a whole — perfect for budget breakdowns" },
  { id:"ml12_08", grade:12, subject:"Mathematical Literacy", topic:"Probability", question:"In a class of 30 students, 12 play sport. P(randomly chosen student plays sport) =", options:["2/5","1/3","3/5","12/100"], answer:0, explanation:"P = 12/30 = 2/5 = 0.4. Simplify 12/30 by dividing by 6." },
  { id:"ml12_09", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"Depreciation of R40 000 at 10% p.a. using the reducing balance method after 2 years:", options:["R32 400","R32 000","R36 000","R8 000"], answer:0, explanation:"Year 1: 40000 × 0.9 = R36 000. Year 2: 36000 × 0.9 = R32 400" },
  { id:"ml12_10", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"A budget deficit means:", options:["Expenses exceed income","Income exceeds expenses","Income equals expenses","Savings are positive"], answer:0, explanation:"A deficit = spending more than you earn. A surplus = earning more than you spend." },
  { id:"ml12_11", grade:12, subject:"Mathematical Literacy", topic:"Numbers & Calculations", question:"R15 000 increased by 12% is:", options:["R16 800","R13 200","R1800","R17 000"], answer:0, explanation:"Increase = 12% × 15 000 = R1800. New amount = 15 000 + 1800 = R16 800" },
  { id:"ml12_12", grade:12, subject:"Mathematical Literacy", topic:"Measurement", question:"A nurse gives a patient 0.5 ml per kg of body weight. For a 60 kg patient, the dosage is:", options:["30 ml","120 ml","60 ml","0.5 ml"], answer:0, explanation:"Dosage = 0.5 ml × 60 kg = 30 ml" },
  { id:"ml12_13", grade:12, subject:"Mathematical Literacy", topic:"Maps & Plans", question:"A builder reads a floor plan where 1 cm = 2 m. A room measuring 4 cm × 3 cm on the plan has an actual area of:", options:["48 m²","24 m²","12 m²","6 m²"], answer:0, explanation:"Actual dimensions: 4×2=8 m and 3×2=6 m. Area = 8 × 6 = 48 m²" },
  { id:"ml12_14", grade:12, subject:"Mathematical Literacy", topic:"Data Handling", question:"An outlier in a data set is a value that is:", options:["Much higher or lower than the rest of the data","The most common value","Equal to the mean","In the middle of the data"], answer:0, explanation:"An outlier is an extreme value that lies far from the other data points — it can skew the mean" },
  { id:"ml12_15", grade:12, subject:"Mathematical Literacy", topic:"Finance", question:"Store A sells 5 kg of rice for R65. Store B sells 3 kg for R42. Which is better value?", options:["Store A (R13/kg vs R14/kg)","Store B","They are equal","Cannot compare"], answer:0, explanation:"Store A: R65÷5 = R13/kg. Store B: R42÷3 = R14/kg. Store A is cheaper per kg." },

];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = {
  "Mathematics":              { icon:"📐", color:"#2563eb", grades:[10,11,12] },
  "Technical Mathematics":    { icon:"🔧", color:"#0369a1", grades:[10,11,12] },
  "Mathematical Literacy":    { icon:"💡", color:"#7c3aed", grades:[10,11,12] },
  "Physical Sciences":        { icon:"⚗️", color:"#6d28d9", grades:[10,11,12] },
  "Life Sciences":             { icon:"🧬", color:"#16a34a", grades:[10,11,12] },
  "Accounting":               { icon:"📒", color:"#b45309", grades:[10,12] },
  "English":                  { icon:"📖", color:"#0891b2", grades:[10,11,12] },
  "Business Studies":         { icon:"💼", color:"#059669", grades:[10,11,12] },
  "Economics":                { icon:"📈", color:"#dc2626", grades:[10,11,12] },
  "History":                  { icon:"🏛️", color:"#92400e", grades:[10,11,12] },
  "Geography":                { icon:"🌍", color:"#0369a1", grades:[10,11,12] },
};

const GRADE_COLORS = { 10:"#2563eb", 11:"#7c3aed", 12:"#16a34a" };

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

  const [screen,      setScreen]      = useState("home");    // home|subject|quiz|results
  const [selSubject,  setSelSubject]  = useState(null);
  const [questions,   setQuestions]   = useState([]);
  const [current,     setCurrent]     = useState(0);
  const [selected,    setSelected]    = useState(null);
  const [confirmed,   setConfirmed]   = useState(false);
  const [answers,     setAnswers]     = useState([]);        // {q, chosen, correct}
  const [timeLeft,    setTimeLeft]    = useState(30);
  const [timedOut,    setTimedOut]    = useState(false);
  const [history,     setHistory]     = useState([]);        // past sessions
  const timerRef = useRef(null);
  const NUM_Q = 10;

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen !== "quiz" || confirmed) return;
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, screen, confirmed]);

  const handleTimeout = () => {
    setTimedOut(true);
    setConfirmed(true);
    clearInterval(timerRef.current);
  };

  // ── Start quiz ───────────────────────────────────────────────────────────
  const startQuiz = (subject) => {
    const pool = QUESTION_BANK.filter(q => q.subject === subject && q.grade === grade);
    const picked = shuffle(pool).slice(0, Math.min(NUM_Q, pool.length));
    setSelSubject(subject);
    setQuestions(picked);
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setTimedOut(false);
    setAnswers([]);
    setScreen("quiz");
  };

  // ── Select answer ────────────────────────────────────────────────────────
  const selectAnswer = (idx) => {
    if (confirmed) return;
    setSelected(idx);
  };

  const confirmAnswer = () => {
    if (selected === null && !timedOut) return;
    clearInterval(timerRef.current);
    setConfirmed(true);
  };

  // ── Next question ────────────────────────────────────────────────────────
  const nextQuestion = () => {
    const q = questions[current];
    const correct = !timedOut && selected === q.answer;
    const newAnswers = [...answers, { q, chosen: timedOut ? null : selected, correct, timedOut }];
    if (current + 1 < questions.length) {
      setAnswers(newAnswers);
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
      setTimedOut(false);
    } else {
      // End — show results
      const score = newAnswers.filter(a => a.correct).length;
      const session = {
        subject: selSubject,
        grade,
        score,
        total: questions.length,
        pct: Math.round((score / questions.length) * 100),
        date: new Date().toLocaleDateString("en-ZA"),
        answers: newAnswers,
      };
      setAnswers(newAnswers);
      setHistory(h => [session, ...h.slice(0, 9)]);
      setScreen("results");
    }
  };

  // ── Available subjects for this grade ───────────────────────────────────
  const availableSubjects = Object.entries(SUBJECTS).filter(([name]) =>
    QUESTION_BANK.some(q => q.subject === name && q.grade === grade)
  );

  const q = questions[current];
  const score = answers.filter(a => a.correct).length;
  const pct = questions.length ? Math.round((score / answers.filter(()=>true).length || 0) * 100) : 0;
  const finalPct = screen === "results" ? Math.round((answers.filter(a=>a.correct).length / questions.length) * 100) : 0;

  // ─── SCREENS ──────────────────────────────────────────────────────────────

  // ── HOME ─────────────────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={S.wrap}>
      <div style={{ ...S.heroBar, background: `linear-gradient(135deg, ${gc}, ${gc}cc)` }}>
        <button style={S.backBtn} onClick={onBack}>← Back</button>
        <div style={S.heroContent}>
          <span style={{ fontSize:48 }}>📝</span>
          <div>
            <h1 style={S.heroTitle}>Past Papers Practice</h1>
            <p style={S.heroSub}>Grade {grade} · NSC-style questions · Timed quiz · Instant feedback</p>
          </div>
        </div>
      </div>

      <div style={S.body}>
        {/* Grade badge */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
          <div style={{ ...S.gradeBadge, background: gc }}>Grade {grade}</div>
          <p style={{ margin:0, fontSize:13, color:"#6b7280" }}>
            Choose a subject below to start a {NUM_Q}-question timed quiz
          </p>
        </div>

        {/* How it works */}
        <div style={S.howBox}>
          <b style={{ fontSize:13, color:"#1e293b" }}>⚡ How it works:</b>
          <div style={S.howGrid}>
            {[["30 sec","Per question timer"],["10 questions","Per session"],["Instant feedback","After each answer"],["Detailed results","At the end"]].map(([a,b])=>(
              <div key={a} style={S.howItem}>
                <span style={{ fontWeight:800, color:gc, fontSize:15 }}>{a}</span>
                <span style={{ fontSize:11, color:"#6b7280" }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject grid */}
        <h3 style={S.sectionTitle}>Choose a Subject</h3>
        <div style={S.subjectGrid}>
          {availableSubjects.map(([name, cfg]) => {
            const count = QUESTION_BANK.filter(q => q.subject === name && q.grade === grade).length;
            const last = history.find(h => h.subject === name);
            return (
              <button key={name} style={{ ...S.subjectCard, borderColor: cfg.color }}
                onClick={() => startQuiz(name)}>
                <span style={{ fontSize:32, marginBottom:8, display:"block" }}>{cfg.icon}</span>
                <p style={{ fontWeight:800, fontSize:14, color:"#1e293b", margin:"0 0 4px" }}>{name}</p>
                <p style={{ fontSize:11, color:"#94a3b8", margin:"0 0 8px" }}>{count} questions available</p>
                {last && (
                  <div style={{ ...S.lastScore, background:`${cfg.color}18`, color:cfg.color }}>
                    Last: {last.pct}% · {last.date}
                  </div>
                )}
                <div style={{ ...S.startChip, background:cfg.color }}>Start →</div>
              </button>
            );
          })}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div style={{ marginTop:32 }}>
            <h3 style={S.sectionTitle}>📊 Recent Sessions</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {history.slice(0,5).map((h,i) => {
                const cfg = SUBJECTS[h.subject];
                const col = h.pct>=70?"#16a34a":h.pct>=50?"#d97706":"#dc2626";
                return (
                  <div key={i} style={S.historyRow}>
                    <span style={{ fontSize:20 }}>{cfg?.icon}</span>
                    <div style={{ flex:1 }}>
                      <span style={{ fontWeight:700, fontSize:13 }}>{h.subject}</span>
                      <span style={{ fontSize:11, color:"#94a3b8", marginLeft:8 }}>{h.date}</span>
                    </div>
                    <div style={{ ...S.histScore, background:`${col}18`, color:col }}>
                      {h.score}/{h.total} · {h.pct}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (screen === "quiz" && q) {
    const cfg = SUBJECTS[selSubject];
    const progress = ((current) / questions.length) * 100;
    const timerPct = (timeLeft / 30) * 100;
    const timerColor = timeLeft > 15 ? cfg.color : timeLeft > 8 ? "#d97706" : "#dc2626";

    return (
      <div style={S.wrap}>
        {/* Header */}
        <div style={{ ...S.quizHeader, background:`linear-gradient(135deg,${cfg.color},${cfg.color}bb)` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <button style={S.quitBtn} onClick={()=>setScreen("home")}>✕ Quit</button>
            <div style={{ textAlign:"center" }}>
              <p style={{ margin:0, color:"#fff", fontWeight:700, fontSize:14 }}>{cfg.icon} {selSubject}</p>
              <p style={{ margin:0, color:"rgba(255,255,255,.75)", fontSize:12 }}>Grade {grade} · Q {current+1} of {questions.length}</p>
            </div>
            {/* Timer ring */}
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
          {/* Progress bar */}
          <div style={S.progressTrack}>
            <div style={{ ...S.progressFill, width:`${progress}%`, background:"rgba(255,255,255,.9)" }}/>
          </div>
        </div>

        <div style={S.quizBody}>
          {/* Topic badge */}
          <span style={{ ...S.topicBadge, background:`${cfg.color}18`, color:cfg.color }}>{q.topic}</span>

          {/* Question */}
          <p style={S.questionText}>{q.question}</p>

          {/* Timed out banner */}
          {timedOut && (
            <div style={S.timedOutBanner}>⏱️ Time's up! The correct answer is highlighted below.</div>
          )}

          {/* Options */}
          <div style={S.optionsList}>
            {q.options.map((opt, idx) => {
              let style = S.option;
              if (confirmed || timedOut) {
                if (idx === q.answer)       style = { ...S.option, ...S.optCorrect };
                else if (idx === selected)  style = { ...S.option, ...S.optWrong };
                else                        style = { ...S.option, ...S.optDim };
              } else if (selected === idx)  style = { ...S.option, ...S.optSelected, borderColor:cfg.color, background:`${cfg.color}12` };

              return (
                <button key={idx} style={style} onClick={() => selectAnswer(idx)} disabled={confirmed || timedOut}>
                  <span style={S.optLetter}>{["A","B","C","D"][idx]}</span>
                  <span style={{ flex:1, textAlign:"left" }}>{opt}</span>
                  {confirmed && idx === q.answer && <span style={{ fontSize:18 }}>✅</span>}
                  {confirmed && idx === selected && idx !== q.answer && <span style={{ fontSize:18 }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {(confirmed || timedOut) && (
            <div style={{ ...S.explanation, borderColor: selected===q.answer?"#16a34a":"#f59e0b" }}>
              <b style={{ fontSize:13 }}>💡 Explanation:</b>
              <p style={{ margin:"6px 0 0", fontSize:13, color:"#374151", lineHeight:1.6 }}>{q.explanation}</p>
            </div>
          )}

          {/* Action button */}
          <div style={{ display:"flex", gap:12, marginTop:16 }}>
            {!confirmed && !timedOut && (
              <button style={{ ...S.actionBtn, background:cfg.color, opacity:selected===null?0.5:1 }}
                onClick={confirmAnswer} disabled={selected===null}>
                Confirm Answer
              </button>
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

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === "results") {
    const cfg = SUBJECTS[selSubject];
    const correct = answers.filter(a=>a.correct).length;
    const grade_col = finalPct>=70?"#16a34a":finalPct>=50?"#d97706":"#dc2626";
    const medal = finalPct>=90?"🥇":finalPct>=70?"🥈":finalPct>=50?"🥉":"📚";
    const msg = finalPct>=90?"Outstanding! Excellent work!"
               :finalPct>=70?"Great job! Keep it up!"
               :finalPct>=50?"Good effort. Review the explanations."
               :"Keep practising — you will improve!";

    return (
      <div style={S.wrap}>
        {/* Results header */}
        <div style={{ ...S.resultsHeader, background:`linear-gradient(135deg,${cfg.color},${cfg.color}bb)` }}>
          <p style={{ color:"rgba(255,255,255,.8)", fontSize:13, margin:"0 0 4px" }}>{cfg.icon} {selSubject} · Grade {grade}</p>
          <div style={{ fontSize:64 }}>{medal}</div>
          <h2 style={{ color:"#fff", fontSize:26, fontWeight:900, margin:"4px 0" }}>
            {correct} / {questions.length}
          </h2>
          <div style={{ fontSize:36, fontWeight:900, color:"#fff" }}>{finalPct}%</div>
          <p style={{ color:"rgba(255,255,255,.9)", fontSize:14, margin:"8px 0 0" }}>{msg}</p>
        </div>

        <div style={S.body}>
          {/* Score bar */}
          <div style={S.scoreBar}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"#6b7280" }}>Score</span>
              <span style={{ fontSize:12, fontWeight:700, color:grade_col }}>{finalPct}%</span>
            </div>
            <div style={S.scoreTrack}>
              <div style={{ ...S.scoreFill, width:`${finalPct}%`, background:grade_col }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
              {[{p:50,l:"50%"},{p:70,l:"70%"},{p:80,l:"80%"},{p:90,l:"90%"}].map(m=>(
                <span key={m.p} style={{ fontSize:10, color:finalPct>=m.p?"#374151":"#d1d5db", fontWeight:finalPct>=m.p?700:400 }}>|{m.l}</span>
              ))}
            </div>
          </div>

          {/* Question review */}
          <h3 style={S.sectionTitle}>📋 Question Review</h3>
          {answers.map((a, i) => (
            <div key={i} style={{ ...S.reviewCard, borderLeft:`4px solid ${a.correct?"#16a34a":"#dc2626"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                <span style={S.reviewNum}>Q{i+1}</span>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
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
                    border: `1px solid ${idx===a.q.answer?"#6ee7b7":idx===a.chosen&&idx!==a.q.answer?"#fca5a5":"#e2e8f0"}`,
                  }}>
                    {["A","B","C","D"][idx]}. {opt}
                    {idx===a.q.answer&&" ✓"}
                    {idx===a.chosen&&idx!==a.q.answer&&" ✗"}
                  </div>
                ))}
              </div>
              <div style={S.reviewExplanation}>💡 {a.q.explanation}</div>
            </div>
          ))}

          {/* Action buttons */}
          <div style={{ display:"flex", gap:12, marginTop:24, flexWrap:"wrap" }}>
            <button style={{ ...S.actionBtn, background:cfg.color, flex:1 }}
              onClick={() => startQuiz(selSubject)}>
              🔄 Try Again
            </button>
            <button style={{ ...S.actionBtn, background:"#475569", flex:1 }}
              onClick={() => setScreen("home")}>
              📚 Choose Another Subject
            </button>
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
  wrap:           { fontFamily:"'Segoe UI',sans-serif", background:"#f8fafc", minHeight:"100vh" },
  heroBar:        { padding:"20px 20px 24px", position:"relative" },
  backBtn:        { background:"rgba(255,255,255,.2)", border:"1px solid rgba(255,255,255,.4)", color:"#fff", borderRadius:8, padding:"6px 14px", fontSize:13, cursor:"pointer", marginBottom:16, display:"block" },
  heroContent:    { display:"flex", alignItems:"center", gap:16 },
  heroTitle:      { fontSize:26, fontWeight:900, color:"#fff", margin:0 },
  heroSub:        { fontSize:13, color:"rgba(255,255,255,.8)", margin:"4px 0 0" },
  body:           { padding:"20px" },
  gradeBadge:     { display:"inline-block", color:"#fff", borderRadius:99, padding:"4px 16px", fontSize:13, fontWeight:800 },
  howBox:         { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px 16px", marginBottom:24 },
  howGrid:        { display:"flex", gap:16, marginTop:10, flexWrap:"wrap" },
  howItem:        { display:"flex", flexDirection:"column", gap:2, minWidth:80 },
  sectionTitle:   { fontSize:14, fontWeight:800, color:"#1e293b", margin:"0 0 12px", textTransform:"uppercase", letterSpacing:1 },
  subjectGrid:    { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 },
  subjectCard:    { background:"#fff", border:"2px solid", borderRadius:14, padding:"16px 12px", textAlign:"center", cursor:"pointer", transition:"transform .1s", display:"flex", flexDirection:"column", alignItems:"center" },
  lastScore:      { borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700, marginBottom:8 },
  startChip:      { color:"#fff", borderRadius:99, padding:"4px 16px", fontSize:12, fontWeight:700 },
  historyRow:     { background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:12 },
  histScore:      { borderRadius:99, padding:"3px 12px", fontSize:12, fontWeight:700 },

  quizHeader:     { padding:"16px 20px 0" },
  quitBtn:        { background:"rgba(255,255,255,.15)", border:"1px solid rgba(255,255,255,.3)", color:"#fff", borderRadius:8, padding:"4px 12px", fontSize:12, cursor:"pointer" },
  progressTrack:  { height:4, background:"rgba(255,255,255,.25)", borderRadius:99, marginTop:14, overflow:"hidden" },
  progressFill:   { height:"100%", borderRadius:99, transition:"width .4s ease" },

  quizBody:       { padding:"20px" },
  topicBadge:     { display:"inline-block", borderRadius:99, padding:"3px 12px", fontSize:11, fontWeight:700, marginBottom:12 },
  questionText:   { fontSize:17, fontWeight:700, color:"#1e293b", lineHeight:1.6, margin:"0 0 16px" },
  timedOutBanner: { background:"#fef9c3", border:"1px solid #fde68a", borderRadius:10, padding:"10px 14px", fontSize:13, color:"#713f12", marginBottom:12, fontWeight:600 },
  optionsList:    { display:"flex", flexDirection:"column", gap:10 },
  option:         { display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"#fff", border:"2px solid #e2e8f0", borderRadius:12, fontSize:14, cursor:"pointer", textAlign:"left", transition:"all .15s" },
  optSelected:    { border:"2px solid", fontWeight:600 },
  optCorrect:     { background:"#d1fae5", border:"2px solid #6ee7b7", color:"#065f46", fontWeight:700, cursor:"default" },
  optWrong:       { background:"#fee2e2", border:"2px solid #fca5a5", color:"#991b1b", fontWeight:700, cursor:"default" },
  optDim:         { background:"#f8fafc", border:"2px solid #e2e8f0", color:"#9ca3af", cursor:"default" },
  optLetter:      { width:28, height:28, borderRadius:"50%", background:"#f1f5f9", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0 },
  explanation:    { background:"#fffbeb", border:"1px solid", borderRadius:10, padding:"12px 14px", marginTop:14 },
  actionBtn:      { padding:"13px 24px", color:"#fff", border:"none", borderRadius:12, fontSize:14, fontWeight:700, cursor:"pointer", flex:1 },

  resultsHeader:  { padding:"28px 20px 24px", textAlign:"center" },
  scoreBar:       { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"16px", marginBottom:20 },
  scoreTrack:     { height:10, background:"#f1f5f9", borderRadius:99, overflow:"hidden" },
  scoreFill:      { height:"100%", borderRadius:99, transition:"width .6s ease" },
  reviewCard:     { background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, padding:"14px", marginBottom:10 },
  reviewNum:      { background:"#f1f5f9", color:"#475569", borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700 },
  reviewExplanation: { background:"#fffbeb", borderRadius:8, padding:"8px 12px", fontSize:12, color:"#713f12", marginTop:10, lineHeight:1.6 },
};
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

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL SCIENCES — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ts10_01", grade:10, subject:"Technical Sciences", topic:"Forces", question:"Which of the following is a contact force?", options:["Friction","Gravity","Magnetic force","Electrostatic force"], answer:0, explanation:"Friction is a contact force — it only acts when two surfaces are in physical contact with each other." },
  { id:"ts10_02", grade:10, subject:"Technical Sciences", topic:"Forces", question:"The SI unit of force is:", options:["Newton (N)","Joule (J)","Pascal (Pa)","Watt (W)"], answer:0, explanation:"Force is measured in Newtons (N), named after Isaac Newton. 1 N = 1 kg·m/s²." },
  { id:"ts10_03", grade:10, subject:"Technical Sciences", topic:"Forces", question:"A force of 20 N acts on a mass of 4 kg. The acceleration is:", options:["5 m/s²","80 m/s²","0.2 m/s²","16 m/s²"], answer:0, explanation:"Newton's 2nd Law: a = F/m = 20/4 = 5 m/s²" },
  { id:"ts10_04", grade:10, subject:"Technical Sciences", topic:"Electricity", question:"The unit of electrical current is:", options:["Ampere (A)","Volt (V)","Ohm (Ω)","Watt (W)"], answer:0, explanation:"Current is measured in Amperes (A) — it represents the flow of electric charge per second." },
  { id:"ts10_05", grade:10, subject:"Technical Sciences", topic:"Electricity", question:"Ohm's Law: if V = 12 V and R = 4 Ω, then I =", options:["3 A","48 A","8 A","0.33 A"], answer:0, explanation:"I = V/R = 12/4 = 3 A" },
  { id:"ts10_06", grade:10, subject:"Technical Sciences", topic:"Electricity", question:"In a series circuit, if one bulb blows:", options:["All bulbs go out","Other bulbs stay on","Only that bulb goes out","Nothing changes"], answer:0, explanation:"In a series circuit there is only one path for current. If broken, no current flows and all components stop." },
  { id:"ts10_07", grade:10, subject:"Technical Sciences", topic:"Matter & Materials", question:"A material that allows electricity to pass through it easily is called:", options:["Conductor","Insulator","Semiconductor","Resistor"], answer:0, explanation:"Conductors (e.g. copper, aluminium) have free electrons that allow easy flow of electric current." },
  { id:"ts10_08", grade:10, subject:"Technical Sciences", topic:"Matter & Materials", question:"Which material is the best electrical insulator?", options:["Rubber","Copper","Aluminium","Steel"], answer:0, explanation:"Rubber is an insulator — it does not allow electric current to pass, which is why wires are coated in it." },
  { id:"ts10_09", grade:10, subject:"Technical Sciences", topic:"Energy", question:"The formula for kinetic energy is:", options:["KE = ½mv²","KE = mgh","KE = Fd","KE = mv"], answer:0, explanation:"Kinetic energy = ½ × mass × velocity² = ½mv²" },
  { id:"ts10_10", grade:10, subject:"Technical Sciences", topic:"Energy", question:"Potential energy stored due to height is called:", options:["Gravitational PE","Elastic PE","Chemical PE","Nuclear PE"], answer:0, explanation:"Gravitational potential energy = mgh — depends on mass, gravitational field, and height above ground." },
  { id:"ts10_11", grade:10, subject:"Technical Sciences", topic:"Waves", question:"The distance between two consecutive crests of a wave is the:", options:["Wavelength","Amplitude","Frequency","Period"], answer:0, explanation:"Wavelength (λ) is the distance between two identical points on consecutive waves (e.g. crest to crest)." },
  { id:"ts10_12", grade:10, subject:"Technical Sciences", topic:"Waves", question:"Wave speed = frequency × …?", options:["Wavelength","Amplitude","Period","Mass"], answer:0, explanation:"v = f × λ. Wave speed equals frequency multiplied by wavelength." },
  { id:"ts10_13", grade:10, subject:"Technical Sciences", topic:"Matter & Materials", question:"Steel is an example of a:", options:["Metal alloy","Pure metal","Non-metal","Ceramic"], answer:0, explanation:"Steel is an alloy of iron and carbon — mixing metals/elements produces an alloy with improved properties." },
  { id:"ts10_14", grade:10, subject:"Technical Sciences", topic:"Forces", question:"When all forces on an object are balanced, the object is in:", options:["Equilibrium","Motion","Acceleration","Free fall"], answer:0, explanation:"Equilibrium: net force = 0. The object is either stationary or moving at constant velocity." },
  { id:"ts10_15", grade:10, subject:"Technical Sciences", topic:"Energy", question:"The unit of energy is the:", options:["Joule (J)","Watt (W)","Newton (N)","Pascal (Pa)"], answer:0, explanation:"Energy is measured in Joules (J). Power is Watts (W = J/s)." },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL SCIENCES — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ts11_01", grade:11, subject:"Technical Sciences", topic:"Newton's Laws", question:"Newton's 1st Law is also known as the law of:", options:["Inertia","Action-reaction","Momentum","Gravity"], answer:0, explanation:"Newton's 1st Law (Inertia): an object remains at rest or in uniform motion unless acted on by a net force." },
  { id:"ts11_02", grade:11, subject:"Technical Sciences", topic:"Newton's Laws", question:"A 2 kg object accelerates at 3 m/s². The net force is:", options:["6 N","1.5 N","0.67 N","5 N"], answer:0, explanation:"F = ma = 2 × 3 = 6 N" },
  { id:"ts11_03", grade:11, subject:"Technical Sciences", topic:"Newton's Laws", question:"Newton's 3rd Law states that for every action there is:", options:["An equal and opposite reaction","A greater reaction","No reaction","A smaller reaction"], answer:0, explanation:"Newton's 3rd Law: action-reaction pairs are equal in magnitude and opposite in direction." },
  { id:"ts11_04", grade:11, subject:"Technical Sciences", topic:"Electricity", question:"Power in an electrical circuit: P =", options:["V × I","V / I","I / V","V + I"], answer:0, explanation:"Electrical power P = Voltage × Current = VI, measured in Watts (W)." },
  { id:"ts11_05", grade:11, subject:"Technical Sciences", topic:"Electricity", question:"In a parallel circuit, total voltage across each branch is:", options:["Equal to supply voltage","Divided equally","Zero","Added together"], answer:0, explanation:"In a parallel circuit, each branch receives the full supply voltage — unlike series circuits." },
  { id:"ts11_06", grade:11, subject:"Technical Sciences", topic:"Electricity", question:"A fuse protects a circuit by:", options:["Melting and breaking the circuit when current is too high","Increasing resistance","Storing excess charge","Reducing voltage"], answer:0, explanation:"A fuse contains a thin wire that melts (blows) when excessive current flows, breaking the circuit to prevent damage." },
  { id:"ts11_07", grade:11, subject:"Technical Sciences", topic:"Magnetism", question:"A magnetic field is represented by:", options:["Field lines from North to South","Field lines from South to North","Straight lines only","Dotted circles"], answer:0, explanation:"Magnetic field lines run from the North pole to the South pole outside the magnet." },
  { id:"ts11_08", grade:11, subject:"Technical Sciences", topic:"Magnetism", question:"An electromagnet is created by:", options:["Passing current through a coil of wire","Rubbing a metal bar","Cooling a metal","Heating a magnet"], answer:0, explanation:"An electromagnet is made by winding a coil of wire around an iron core and passing current through it." },
  { id:"ts11_09", grade:11, subject:"Technical Sciences", topic:"Pressure", question:"Pressure = Force / …?", options:["Area","Mass","Volume","Velocity"], answer:0, explanation:"P = F/A. Pressure = Force divided by the area over which the force acts. Unit: Pascal (Pa)." },
  { id:"ts11_10", grade:11, subject:"Technical Sciences", topic:"Pressure", question:"A hydraulic system uses which principle?", options:["Pressure is transmitted equally through a fluid","Gases compress under pressure","Liquids are compressible","Friction increases pressure"], answer:0, explanation:"Pascal's Principle: pressure applied to an enclosed fluid is transmitted equally in all directions (basis of hydraulics)." },
  { id:"ts11_11", grade:11, subject:"Technical Sciences", topic:"Heat & Thermodynamics", question:"Heat transfer through direct contact is called:", options:["Conduction","Convection","Radiation","Insulation"], answer:0, explanation:"Conduction is heat transfer through a solid by direct contact between particles — metals are good conductors." },
  { id:"ts11_12", grade:11, subject:"Technical Sciences", topic:"Heat & Thermodynamics", question:"Heat transfer in fluids (liquids and gases) by movement is called:", options:["Convection","Conduction","Radiation","Evaporation"], answer:0, explanation:"Convection: warm fluid rises and cool fluid sinks, creating circulation currents that transfer heat." },
  { id:"ts11_13", grade:11, subject:"Technical Sciences", topic:"Matter & Materials", question:"Tensile strength refers to a material's ability to resist:", options:["Being stretched/pulled apart","Being compressed","Being bent","Being twisted"], answer:0, explanation:"Tensile strength = resistance to being pulled apart. Materials with high tensile strength (e.g. steel) are used in construction." },
  { id:"ts11_14", grade:11, subject:"Technical Sciences", topic:"Matter & Materials", question:"Hardness of a material refers to its resistance to:", options:["Scratching and indentation","Bending","Stretching","Breaking"], answer:0, explanation:"Hardness measures how resistant a material is to being scratched or permanently deformed on its surface." },
  { id:"ts11_15", grade:11, subject:"Technical Sciences", topic:"Forces", question:"Torque (moment) = Force × …?", options:["Perpendicular distance","Mass","Speed","Area"], answer:0, explanation:"Torque = F × d (perpendicular distance from the pivot). It measures the turning effect of a force." },

  // ══════════════════════════════════════════════════════════════════════════
  // TECHNICAL SCIENCES — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ts12_01", grade:12, subject:"Technical Sciences", topic:"Electricity", question:"Faraday's Law states that an EMF is induced when:", options:["Magnetic flux through a coil changes","Current flows through a resistor","Voltage is applied to a conductor","A circuit is opened"], answer:0, explanation:"Faraday's Law of Electromagnetic Induction: a changing magnetic flux induces an EMF in a conductor." },
  { id:"ts12_02", grade:12, subject:"Technical Sciences", topic:"Electricity", question:"An AC generator produces:", options:["Alternating current","Direct current","Static electricity","Magnetic fields only"], answer:0, explanation:"An AC generator (alternator) converts mechanical energy into alternating current using electromagnetic induction." },
  { id:"ts12_03", grade:12, subject:"Technical Sciences", topic:"Electricity", question:"A transformer steps voltage up by having:", options:["More turns on the secondary coil","Fewer turns on the secondary coil","Equal turns on both coils","No iron core"], answer:0, explanation:"Step-up transformer: secondary coil has more turns than primary. Vs/Vp = Ns/Np." },
  { id:"ts12_04", grade:12, subject:"Technical Sciences", topic:"Mechanics", question:"The work-energy theorem states that net work done equals:", options:["Change in kinetic energy","Change in potential energy","Total force applied","Mass × acceleration"], answer:0, explanation:"Wnet = ΔKE. The net work done on an object equals its change in kinetic energy." },
  { id:"ts12_05", grade:12, subject:"Technical Sciences", topic:"Mechanics", question:"Conservation of energy means:", options:["Energy cannot be created or destroyed, only transferred","Energy is always lost as heat","Mechanical energy is always conserved","Only kinetic energy is conserved"], answer:0, explanation:"Law of Conservation of Energy: energy is never created or destroyed — it changes from one form to another." },
  { id:"ts12_06", grade:12, subject:"Technical Sciences", topic:"Mechanics", question:"Momentum = mass × …?", options:["Velocity","Acceleration","Force","Speed"], answer:0, explanation:"p = mv. Momentum is the product of an object's mass and its velocity. Unit: kg·m/s." },
  { id:"ts12_07", grade:12, subject:"Technical Sciences", topic:"Pressure & Hydraulics", question:"A hydraulic jack uses a small piston area of 5 cm² and large piston area of 100 cm². If input force is 50 N, output force is:", options:["1000 N","250 N","500 N","10 N"], answer:0, explanation:"F₂/F₁ = A₂/A₁. F₂ = 50 × (100/5) = 50 × 20 = 1000 N. This is mechanical advantage." },
  { id:"ts12_08", grade:12, subject:"Technical Sciences", topic:"Heat & Thermodynamics", question:"The first law of thermodynamics is essentially:", options:["Conservation of energy","Conservation of momentum","Ohm's Law","Newton's 2nd Law"], answer:0, explanation:"The 1st Law of Thermodynamics: energy is conserved — heat added to a system equals change in internal energy plus work done." },
  { id:"ts12_09", grade:12, subject:"Technical Sciences", topic:"Matter & Materials", question:"Ductility refers to a material's ability to:", options:["Be drawn into wire without breaking","Resist scratching","Conduct heat","Absorb shocks"], answer:0, explanation:"Ductile materials (e.g. copper, aluminium) can be stretched into thin wires — essential for electrical cables." },
  { id:"ts12_10", grade:12, subject:"Technical Sciences", topic:"Matter & Materials", question:"A material that returns to its original shape after being deformed is:", options:["Elastic","Plastic","Brittle","Ductile"], answer:0, explanation:"Elastic materials (e.g. rubber, spring steel) recover their original shape after the applied force is removed." },
  { id:"ts12_11", grade:12, subject:"Technical Sciences", topic:"Waves & Optics", question:"The speed of light in a vacuum is approximately:", options:["3 × 10⁸ m/s","3 × 10⁶ m/s","3 × 10¹⁰ m/s","3 × 10⁴ m/s"], answer:0, explanation:"c ≈ 3 × 10⁸ m/s (300 000 km/s). This is the universal speed limit." },
  { id:"ts12_12", grade:12, subject:"Technical Sciences", topic:"Waves & Optics", question:"When light moves from a dense medium to a less dense medium, it:", options:["Bends away from the normal","Bends toward the normal","Does not bend","Reflects completely"], answer:0, explanation:"Refraction: light bends away from the normal when entering a less dense medium (e.g. glass to air)." },
  { id:"ts12_13", grade:12, subject:"Technical Sciences", topic:"Electricity", question:"Root Mean Square (RMS) voltage is related to peak voltage by:", options:["Vrms = Vpeak/√2","Vrms = Vpeak × √2","Vrms = Vpeak/2","Vrms = 2 × Vpeak"], answer:0, explanation:"For AC: Vrms = Vpeak ÷ √2 ≈ 0.707 × Vpeak. RMS values are used for equivalent DC power calculations." },
  { id:"ts12_14", grade:12, subject:"Technical Sciences", topic:"Mechanics", question:"Efficiency of a machine = (useful output / total input) × …?", options:["100%","50%","Total output","Input force"], answer:0, explanation:"Efficiency % = (useful work output / total work input) × 100. No machine is 100% efficient due to friction." },
  { id:"ts12_15", grade:12, subject:"Technical Sciences", topic:"Pressure & Hydraulics", question:"Bernoulli's Principle states that in a fluid, as speed increases:", options:["Pressure decreases","Pressure increases","Density increases","Temperature increases"], answer:0, explanation:"Bernoulli: faster-moving fluids exert less pressure. This explains aircraft lift and carburettor operation." },

  // ══════════════════════════════════════════════════════════════════════════
  // CIVIL TECHNOLOGY — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ct10_01", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Which material is used as the main structural component in reinforced concrete?", options:["Steel rebar","Timber","Brick","Gravel"], answer:0, explanation:"Reinforced concrete uses steel reinforcing bars (rebar) to handle tension, while concrete handles compression." },
  { id:"ct10_02", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Portland cement is mixed with water to form:", options:["Cement paste","Concrete","Mortar","Grout"], answer:0, explanation:"Cement + water = cement paste. Add sand = mortar. Add sand + aggregate = concrete." },
  { id:"ct10_03", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Mortar is used in construction to:", options:["Bond bricks together","Form structural beams","Waterproof walls","Make roof tiles"], answer:0, explanation:"Mortar is a mixture of cement, sand, and water used to bond bricks, blocks, and stones together." },
  { id:"ct10_04", grade:10, subject:"Civil Technology", topic:"Drawing & Plans", question:"In a building plan, what does a dashed line typically represent?", options:["A hidden feature or overhead element","A wall","A door","The boundary"], answer:0, explanation:"Dashed/broken lines in plans represent hidden features — elements above the cutting plane, like roof overhangs." },
  { id:"ct10_05", grade:10, subject:"Civil Technology", topic:"Drawing & Plans", question:"What does 'NTS' mean on a drawing?", options:["Not To Scale","North To South","No Technical Specification","Number of Total Sheets"], answer:0, explanation:"NTS = Not To Scale. It means the drawing dimensions may not accurately reflect the real measurements." },
  { id:"ct10_06", grade:10, subject:"Civil Technology", topic:"Foundations", question:"A strip foundation is most suitable for:", options:["Load-bearing walls","Isolated columns","Large flat slabs","Soft soil only"], answer:0, explanation:"Strip foundations run continuously under load-bearing walls, distributing the wall's weight along its length." },
  { id:"ts10_06b", grade:10, subject:"Civil Technology", topic:"Foundations", question:"The purpose of a foundation is to:", options:["Transfer building loads safely to the ground","Waterproof the building","Insulate the building","Hold walls together"], answer:0, explanation:"Foundations distribute the structural load of the building to the subsoil safely and prevent settlement." },
  { id:"ct10_07", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Aggregate used in concrete includes:", options:["Sand and stone","Cement and water","Steel and timber","Brick and clay"], answer:0, explanation:"Aggregate = fine aggregate (sand) + coarse aggregate (crushed stone/gravel). These form the bulk of concrete." },
  { id:"ct10_08", grade:10, subject:"Civil Technology", topic:"Roofing", question:"A roof that slopes in two directions is called:", options:["Gable roof","Hip roof","Flat roof","Mono-pitch roof"], answer:0, explanation:"A gable (pitched) roof has two sloping sides that meet at a ridge, with triangular gable ends on two sides." },
  { id:"ct10_09", grade:10, subject:"Civil Technology", topic:"Roofing", question:"Roof trusses are mainly made from:", options:["Timber or steel","Concrete","Brick","PVC"], answer:0, explanation:"Roof trusses are prefabricated triangular frames made from timber or steel — they support the roof covering." },
  { id:"ct10_10", grade:10, subject:"Civil Technology", topic:"Site Work", question:"A site survey is done before construction to:", options:["Measure and map the land","Order materials","Hire workers","Draw the plan"], answer:0, explanation:"A site survey establishes boundaries, levels, and features of the land before design and construction begins." },
  { id:"ct10_11", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"The water-cement ratio affects concrete:", options:["Strength and workability","Colour","Insulation","Weight only"], answer:0, explanation:"Lower water-cement ratio = stronger, less permeable concrete. Too much water weakens the mix." },
  { id:"ct10_12", grade:10, subject:"Civil Technology", topic:"Drawing & Plans", question:"On a floor plan, a thin rectangle across a wall opening usually represents:", options:["A window","A door","A cupboard","A fireplace"], answer:0, explanation:"Windows are shown as thin parallel lines or rectangles in the wall opening on a floor plan." },
  { id:"ct10_13", grade:10, subject:"Civil Technology", topic:"Health & Safety", question:"On a construction site, a hard hat protects against:", options:["Falling objects","Electrical shocks","Chemical exposure","Noise"], answer:0, explanation:"Hard hats (safety helmets) are mandatory on construction sites to protect workers from falling objects and head injuries." },
  { id:"ct10_14", grade:10, subject:"Civil Technology", topic:"Construction Materials", question:"Bricks are classified by their:", options:["Strength, size, and quality","Colour only","Weight only","Age"], answer:0, explanation:"Bricks are classified by compressive strength, dimensional tolerances, and quality/durability class." },
  { id:"ct10_15", grade:10, subject:"Civil Technology", topic:"Plumbing", question:"The fall (slope) on a drainage pipe ensures:", options:["Waste flows by gravity","Water pressure increases","Pipes don't freeze","Air escapes"], answer:0, explanation:"Drainage pipes must have a minimum fall (gradient) so that gravity causes waste water to flow away without blockages." },

  // ══════════════════════════════════════════════════════════════════════════
  // CIVIL TECHNOLOGY — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ct11_01", grade:11, subject:"Civil Technology", topic:"Structures", question:"A beam that is supported at both ends and loaded in the middle is under:", options:["Bending (shear and compression/tension)","Pure compression","Pure tension","No stress"], answer:0, explanation:"A simply supported beam experiences bending — the bottom is in tension and the top in compression under a central load." },
  { id:"ct11_02", grade:11, subject:"Civil Technology", topic:"Structures", question:"An arch transfers loads primarily through:", options:["Compression","Tension","Shear","Torsion"], answer:0, explanation:"Arches redirect loads into compressive forces along their curve — this is why they are ideal for masonry construction." },
  { id:"ct11_03", grade:11, subject:"Civil Technology", topic:"Construction Materials", question:"The curing of concrete involves:", options:["Keeping concrete moist to allow full hydration","Heating it to dry quickly","Adding more cement","Covering with plastic sheets permanently"], answer:0, explanation:"Curing maintains moisture so cement hydration continues fully — inadequate curing results in weak, cracked concrete." },
  { id:"ct11_04", grade:11, subject:"Civil Technology", topic:"Walls", question:"A cavity wall consists of:", options:["Two skins of brick with an air gap","One thick brick wall","Concrete blocks only","Timber frame with plaster"], answer:0, explanation:"Cavity walls have an inner and outer leaf (skin) of brick separated by a gap — this improves thermal and damp resistance." },
  { id:"ct11_05", grade:11, subject:"Civil Technology", topic:"Walls", question:"The purpose of a damp-proof course (DPC) is to:", options:["Prevent rising damp","Add strength to walls","Hold bricks together","Support the roof"], answer:0, explanation:"A DPC is a horizontal waterproof layer in a wall that prevents moisture from rising up from the ground (rising damp)." },
  { id:"ct11_06", grade:11, subject:"Civil Technology", topic:"Floors", question:"A suspended timber floor is supported by:", options:["Floor joists","Concrete slab","Foundation walls only","Steel beams only"], answer:0, explanation:"Suspended timber floors consist of timber joists spanning between walls — the floor boards are fixed to the joists." },
  { id:"ct11_07", grade:11, subject:"Civil Technology", topic:"Plumbing", question:"A P-trap in a plumbing system is used to:", options:["Prevent sewer gases from entering the building","Increase water pressure","Filter drinking water","Regulate hot water temperature"], answer:0, explanation:"A P-trap (or U-bend) holds a water seal that blocks sewer gases and odours from entering the building through drain pipes." },
  { id:"ct11_08", grade:11, subject:"Civil Technology", topic:"Drawing & Plans", question:"A section drawing shows:", options:["An interior cut-through view of a structure","The roof plan","The site layout","Only the elevation"], answer:0, explanation:"A section (cross-section) is drawn as if the building were sliced open — it reveals internal construction details." },
  { id:"ct11_09", grade:11, subject:"Civil Technology", topic:"Drawing & Plans", question:"An elevation drawing shows:", options:["The external face of a building from one side","The top view","The internal layout","The foundation plan"], answer:0, explanation:"An elevation is an orthographic view of the external face of a building — front, side, and rear elevations are drawn." },
  { id:"ct11_10", grade:11, subject:"Civil Technology", topic:"Roofing", question:"A valley in a roof is where:", options:["Two roof slopes meet forming an internal angle","A slope meets a wall","The ridge is located","A dormer window is placed"], answer:0, explanation:"A valley is the internal junction where two roof planes meet — it channels rainwater to the gutters." },
  { id:"ct11_11", grade:11, subject:"Civil Technology", topic:"Foundations", question:"A raft foundation is used when:", options:["Soil has low bearing capacity","Building is very light","Only a single column is needed","Soil is very hard rock"], answer:0, explanation:"Raft (mat) foundations spread the building load over a large area — used on soft or variable soils to prevent differential settlement." },
  { id:"ct11_12", grade:11, subject:"Civil Technology", topic:"Health & Safety", question:"The Occupational Health and Safety Act (OHSA) in SA requires:", options:["Safe working conditions for all workers","Only managers to wear PPE","Workers to pay for their own safety equipment","Overtime on construction sites"], answer:0, explanation:"The OHSA (Act 85 of 1993) requires employers to provide safe working conditions and appropriate PPE for workers." },
  { id:"ct11_13", grade:11, subject:"Civil Technology", topic:"Electrical", question:"In a building, SANS 10142 governs:", options:["Electrical wiring installations","Plumbing codes","Structural loads","Fire safety"], answer:0, explanation:"SANS 10142 is the South African National Standard for electrical installations in buildings." },
  { id:"ct11_14", grade:11, subject:"Civil Technology", topic:"Construction Materials", question:"Aggregate grading refers to:", options:["The distribution of particle sizes in aggregate","The strength of the aggregate","The colour classification","The source of the aggregate"], answer:0, explanation:"Grading describes the range of particle sizes — a well-graded aggregate produces a stronger, denser concrete mix." },
  { id:"ct11_15", grade:11, subject:"Civil Technology", topic:"Structures", question:"Dead load in a building refers to:", options:["The permanent weight of the structure itself","Temporary loads like people and furniture","Wind load","Snow load"], answer:0, explanation:"Dead loads are permanent, static loads — the weight of walls, slabs, roof, and all permanent fixtures." },

  // ══════════════════════════════════════════════════════════════════════════
  // CIVIL TECHNOLOGY — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"ct12_01", grade:12, subject:"Civil Technology", topic:"Structures", question:"Reinforced concrete is strong in both tension and compression because:", options:["Steel handles tension and concrete handles compression","Concrete handles both","Steel handles compression","They are the same material"], answer:0, explanation:"Concrete is strong in compression but weak in tension. Steel rebar adds tensile strength — together they resist both." },
  { id:"ct12_02", grade:12, subject:"Civil Technology", topic:"Structures", question:"Pre-stressed concrete involves:", options:["Applying tension to steel tendons before concrete sets","Adding extra cement","Curing in hot conditions","Using lightweight aggregate"], answer:0, explanation:"Pre-stressing applies compressive force to concrete via tensioned steel tendons — greatly increases load capacity and reduces deflection." },
  { id:"ct12_03", grade:12, subject:"Civil Technology", topic:"Project Management", question:"A Bill of Quantities (BOQ) is used to:", options:["List and quantify all materials and work items for costing","Draw the building plans","Manage workers","Specify safety rules"], answer:0, explanation:"A BOQ is a document prepared by a quantity surveyor listing all materials, labour, and tasks with quantities for pricing." },
  { id:"ct12_04", grade:12, subject:"Civil Technology", topic:"Project Management", question:"A Gantt chart is used in construction to:", options:["Show the schedule and timeline of tasks","Calculate costs","Draw floor plans","Specify materials"], answer:0, explanation:"A Gantt chart is a bar chart showing project tasks against time — essential for scheduling and monitoring construction progress." },
  { id:"ct12_05", grade:12, subject:"Civil Technology", topic:"Drawing & Plans", question:"An isometric drawing shows an object:", options:["In 3D with all axes at 30° to the horizontal","From directly above","From directly in front","As a cross-section"], answer:0, explanation:"Isometric projection: a 3D representation drawn with horizontal edges at 30° — gives a clear 3D view without perspective." },
  { id:"ct12_06", grade:12, subject:"Civil Technology", topic:"Structures", question:"Live load refers to:", options:["Variable loads such as people, furniture, and vehicles","The weight of the structure","Foundation loads","Wind only"], answer:0, explanation:"Live (imposed) loads are temporary and variable — occupants, furniture, vehicles, snow. They vary with use." },
  { id:"ct12_07", grade:12, subject:"Civil Technology", topic:"Electrical", question:"A RCCD (residual current device) in a DB board protects against:", options:["Electric shock and earth leakage","Power surges only","Short circuits only","Overloading only"], answer:0, explanation:"An RCD/RCCB detects earth leakage and trips within milliseconds — preventing electrocution from faulty appliances." },
  { id:"ct12_08", grade:12, subject:"Civil Technology", topic:"Plumbing", question:"A geyser (water heater) thermostat is set to approximately what temperature in SA?", options:["60°C","40°C","80°C","100°C"], answer:0, explanation:"SA regulations recommend geysers be set to 60°C — hot enough to kill legionella bacteria but not cause scalding." },
  { id:"ct12_09", grade:12, subject:"Civil Technology", topic:"Construction Materials", question:"Waterproofing a concrete structure can be done by adding:", options:["Admixtures to the concrete mix","Extra aggregate","Less cement","More water"], answer:0, explanation:"Waterproofing admixtures reduce permeability of concrete — used in basements, water tanks, and retaining walls." },
  { id:"ct12_10", grade:12, subject:"Civil Technology", topic:"Structures", question:"The factor of safety in structural design means:", options:["The structure can carry more load than the design load","The building is completely safe","No live loads are applied","The material has no defects"], answer:0, explanation:"Factor of safety = ultimate load / design load. Structures are designed to carry more than the expected load for safety." },
  { id:"ct12_11", grade:12, subject:"Civil Technology", topic:"Drawing & Plans", question:"SANS stands for:", options:["South African National Standard","South African New Specification","Structural and Numerical Standard","Standard Architectural Number System"], answer:0, explanation:"SANS = South African National Standard — the technical standards that govern construction, electrical, and safety in SA." },
  { id:"ct12_12", grade:12, subject:"Civil Technology", topic:"Roofing", question:"IBR sheeting stands for:", options:["Inverted Box Rib","Integrated Building Roof","Iron Bonded Roofing","Industrial Brick Roofing"], answer:0, explanation:"IBR (Inverted Box Rib) is a profiled metal roofing and cladding sheet widely used in SA industrial and residential buildings." },
  { id:"ct12_13", grade:12, subject:"Civil Technology", topic:"Health & Safety", question:"A risk assessment on a construction site identifies:", options:["Hazards and their likelihood of causing harm","Only the most dangerous workers","Building materials needed","The project timeline"], answer:0, explanation:"A risk assessment identifies hazards, evaluates risk (likelihood × severity), and puts controls in place to reduce harm." },
  { id:"ct12_14", grade:12, subject:"Civil Technology", topic:"Structures", question:"The span of a beam is:", options:["The distance between its supports","Its length only","Its depth","The load it carries"], answer:0, explanation:"The span is the horizontal distance between the two support points of a beam — longer spans require deeper/stronger beams." },
  { id:"ct12_15", grade:12, subject:"Civil Technology", topic:"Construction Materials", question:"Slump test on fresh concrete measures:", options:["Workability/consistency","Strength","Water content","Aggregate size"], answer:0, explanation:"The slump test measures concrete workability (consistency) — how easily it flows and is placed without segregation." },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL TECHNOLOGY — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"et10_01", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"What does a battery convert chemical energy into?", options:["Electrical energy","Mechanical energy","Heat energy","Light energy"], answer:0, explanation:"A battery converts chemical energy stored in its cells into electrical energy (EMF) to drive current around a circuit." },
  { id:"et10_02", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"Conventional current flows from:", options:["Positive to negative terminal","Negative to positive terminal","Both directions","The centre of the wire"], answer:0, explanation:"Conventional current flows from + to − (positive to negative) outside the source. Electron flow is actually the opposite." },
  { id:"et10_03", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"If V = 24 V and R = 8 Ω, current I =", options:["3 A","192 A","0.33 A","16 A"], answer:0, explanation:"Ohm's Law: I = V/R = 24/8 = 3 A" },
  { id:"et10_04", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"Electrical power is calculated by:", options:["P = V × I","P = V / I","P = I / V","P = V + I"], answer:0, explanation:"P = VI. Alternatively P = I²R or P = V²/R. Power is measured in Watts (W)." },
  { id:"et10_05", grade:10, subject:"Electrical Technology", topic:"Components", question:"A resistor in a circuit is used to:", options:["Limit or control current flow","Store electrical energy","Convert AC to DC","Amplify voltage"], answer:0, explanation:"Resistors limit current flow and can drop voltage in a circuit — they dissipate energy as heat." },
  { id:"et10_06", grade:10, subject:"Electrical Technology", topic:"Components", question:"A capacitor stores energy in:", options:["An electric field","A magnetic field","Chemical bonds","Mechanical motion"], answer:0, explanation:"A capacitor stores electrical energy in the electric field between its two plates (dielectric)." },
  { id:"et10_07", grade:10, subject:"Electrical Technology", topic:"Components", question:"An LED is a:", options:["Light Emitting Diode","Low Energy Device","Linear Electric Driver","Light Efficiency Detector"], answer:0, explanation:"LED = Light Emitting Diode. It emits light when current flows through it in the forward direction." },
  { id:"et10_08", grade:10, subject:"Electrical Technology", topic:"Safety", question:"Before working on any electrical circuit, you must first:", options:["Switch off and isolate the supply","Check the fuse","Test with a multimeter","Wear rubber gloves only"], answer:0, explanation:"Always isolate (switch off and lock out) the power supply before working on any electrical installation — safety first." },
  { id:"et10_09", grade:10, subject:"Electrical Technology", topic:"Safety", question:"The colour of the Earth wire in South African wiring is:", options:["Green & Yellow","Red","Black","Blue"], answer:0, explanation:"In SA: Earth = Green/Yellow striped, Live = Brown/Red, Neutral = Blue/Black. Earth is always green-yellow." },
  { id:"et10_10", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"In a series circuit with R₁=3 Ω and R₂=5 Ω, total resistance =", options:["8 Ω","2 Ω","15 Ω","4 Ω"], answer:0, explanation:"Series circuit: RT = R₁ + R₂ = 3 + 5 = 8 Ω" },
  { id:"et10_11", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"In a parallel circuit with R₁=6 Ω and R₂=6 Ω, total resistance =", options:["3 Ω","12 Ω","6 Ω","1 Ω"], answer:0, explanation:"Parallel: 1/RT = 1/6 + 1/6 = 2/6, so RT = 3 Ω. Parallel resistance is always less than the smallest branch." },
  { id:"et10_12", grade:10, subject:"Electrical Technology", topic:"Components", question:"A fuse is rated at 5 A. It will blow when current exceeds:", options:["5 A","5 V","5 W","5 Ω"], answer:0, explanation:"A fuse is rated by the maximum current it can safely carry. It melts and breaks the circuit if current exceeds 5 A." },
  { id:"et10_13", grade:10, subject:"Electrical Technology", topic:"Magnetism", question:"The force on a current-carrying conductor in a magnetic field is used in:", options:["Electric motors","Generators","Transformers","Capacitors"], answer:0, explanation:"Electric motors use the force on current-carrying conductors in a magnetic field (F = BIl) to produce rotation." },
  { id:"et10_14", grade:10, subject:"Electrical Technology", topic:"Tools", question:"A multimeter can measure:", options:["Voltage, current, and resistance","Only voltage","Only current","Power and energy only"], answer:0, explanation:"A digital multimeter (DMM) measures voltage (V), current (A), and resistance (Ω) — an essential electrical tool." },
  { id:"et10_15", grade:10, subject:"Electrical Technology", topic:"Basic Electricity", question:"Energy consumed = Power × …?", options:["Time","Voltage","Current","Resistance"], answer:0, explanation:"E = P × t. Electrical energy = power × time. Units: Watts × seconds = Joules, or kW × hours = kWh." },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL TECHNOLOGY — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"et11_01", grade:11, subject:"Electrical Technology", topic:"AC Theory", question:"In South Africa, the AC mains frequency is:", options:["50 Hz","60 Hz","100 Hz","50 kHz"], answer:0, explanation:"South Africa uses 50 Hz AC supply (220V/230V). The USA uses 60 Hz. Frequency = cycles per second." },
  { id:"et11_02", grade:11, subject:"Electrical Technology", topic:"AC Theory", question:"The peak voltage of SA 230V mains (RMS) is approximately:", options:["325 V","230 V","163 V","460 V"], answer:0, explanation:"Vpeak = Vrms × √2 = 230 × 1.414 ≈ 325 V. Mains voltage is quoted as RMS, not peak." },
  { id:"et11_03", grade:11, subject:"Electrical Technology", topic:"Transformers", question:"A step-down transformer:", options:["Reduces voltage and increases current","Increases voltage and reduces current","Keeps voltage the same","Converts AC to DC"], answer:0, explanation:"Step-down transformer: secondary voltage < primary voltage. Since power is conserved, current increases when voltage drops." },
  { id:"et11_04", grade:11, subject:"Electrical Technology", topic:"Transformers", question:"Transformer turns ratio: Np/Ns = Vp/Vs. If Np=200 and Ns=100 and Vp=240V, then Vs=", options:["120 V","480 V","60 V","240 V"], answer:0, explanation:"Vs = Vp × (Ns/Np) = 240 × (100/200) = 240 × 0.5 = 120 V" },
  { id:"et11_05", grade:11, subject:"Electrical Technology", topic:"Motors", question:"A DC motor converts:", options:["Electrical energy to mechanical (rotational) energy","Mechanical energy to electrical energy","AC to DC","Chemical energy to motion"], answer:0, explanation:"A DC motor converts electrical energy into mechanical rotational energy using the force on current-carrying conductors in a magnetic field." },
  { id:"et11_06", grade:11, subject:"Electrical Technology", topic:"Motors", question:"The speed of a DC motor can be controlled by:", options:["Varying the supply voltage or armature resistance","Changing the wire colour","Adding more brushes","Cooling the motor"], answer:0, explanation:"DC motor speed control: reduce armature voltage or increase series resistance to slow down; increase voltage to speed up." },
  { id:"et11_07", grade:11, subject:"Electrical Technology", topic:"Components", question:"An inductor (coil) stores energy in:", options:["A magnetic field","An electric field","Chemical bonds","Heat"], answer:0, explanation:"An inductor stores energy in its magnetic field when current flows through it — opposes changes in current." },
  { id:"et11_08", grade:11, subject:"Electrical Technology", topic:"AC Theory", question:"Inductive reactance (XL) increases when frequency:", options:["Increases","Decreases","Stays the same","Reaches zero"], answer:0, explanation:"XL = 2πfL. Inductive reactance is directly proportional to frequency — higher frequency = higher XL." },
  { id:"et11_09", grade:11, subject:"Electrical Technology", topic:"Safety", question:"An earth leakage circuit breaker (ELCB) trips when:", options:["Current flows to earth instead of through the load","Too much current flows","Voltage drops","A switch is opened"], answer:0, explanation:"ELCB/RCD detects imbalance between live and neutral currents (indicating earth leakage) and trips in milliseconds." },
  { id:"et11_10", grade:11, subject:"Electrical Technology", topic:"Wiring", question:"Cable size selection depends on:", options:["Current rating, voltage drop, and protection","Wire colour","Insulation colour only","Conduit size only"], answer:0, explanation:"Cables are selected based on: current-carrying capacity, acceptable voltage drop over the run length, and short-circuit protection." },
  { id:"et11_11", grade:11, subject:"Electrical Technology", topic:"Components", question:"A diode allows current to flow:", options:["In one direction only","In both directions","Only when voltage is zero","In proportion to resistance"], answer:0, explanation:"A diode is a semiconductor device that conducts current in one direction only (forward biased) — used in rectifiers." },
  { id:"et11_12", grade:11, subject:"Electrical Technology", topic:"Components", question:"A rectifier circuit converts:", options:["AC to DC","DC to AC","High voltage to low voltage","Current to voltage"], answer:0, explanation:"A rectifier uses diodes to convert alternating current (AC) into direct current (DC)." },
  { id:"et11_13", grade:11, subject:"Electrical Technology", topic:"Magnetism", question:"Fleming's Left-Hand Rule is used to find the:", options:["Direction of force on a conductor in a motor","Direction of induced EMF","Direction of magnetic field","Polarity of a battery"], answer:0, explanation:"Fleming's Left-Hand Rule: thumb = Force (motion), index = Field, middle = Current — used for motors." },
  { id:"et11_14", grade:11, subject:"Electrical Technology", topic:"Magnetism", question:"Fleming's Right-Hand Rule is used for:", options:["Generators (direction of induced current)","Motors","Capacitors","Resistors"], answer:0, explanation:"Fleming's Right-Hand Rule: thumb = Motion, index = Field, middle = induced Current — used for generators." },
  { id:"et11_15", grade:11, subject:"Electrical Technology", topic:"AC Theory", question:"The power factor of a purely resistive circuit is:", options:["1 (unity)","0","0.5","Infinity"], answer:0, explanation:"Power factor = cos φ. For a purely resistive circuit, voltage and current are in phase (φ = 0°), so PF = cos 0° = 1." },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL TECHNOLOGY — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"et12_01", grade:12, subject:"Electrical Technology", topic:"Three-Phase", question:"The South African 3-phase supply provides a line voltage of approximately:", options:["400 V","230 V","690 V","110 V"], answer:0, explanation:"In SA, 3-phase line voltage = 400 V (phase voltage = 230 V). VL = √3 × Vph = 1.732 × 230 ≈ 400 V." },
  { id:"et12_02", grade:12, subject:"Electrical Technology", topic:"Three-Phase", question:"In a balanced star (Y) connection, line current equals:", options:["Phase current","√3 × phase current","Phase current / √3","3 × phase current"], answer:0, explanation:"Star connection: IL = Iph (line current equals phase current). VL = √3 × Vph." },
  { id:"et12_03", grade:12, subject:"Electrical Technology", topic:"Three-Phase", question:"3-phase power: P = √3 × VL × IL × …?", options:["cos φ","sin φ","tan φ","2π"], answer:0, explanation:"3-phase power P = √3 × VL × IL × cos φ, where cos φ is the power factor." },
  { id:"et12_04", grade:12, subject:"Electrical Technology", topic:"Motors", question:"A squirrel cage induction motor is preferred in industry because:", options:["It is robust, low maintenance, and runs on AC","It requires carbon brushes","It only runs on DC","It has variable speed without a drive"], answer:0, explanation:"Squirrel cage induction motors: no brushes/commutator, robust, low cost, low maintenance — ideal for industrial use." },
  { id:"et12_05", grade:12, subject:"Electrical Technology", topic:"Motors", question:"Motor starter circuits use a contactor because:", options:["It safely switches high current motor loads remotely","It converts AC to DC","It reduces motor speed","It measures power consumption"], answer:0, explanation:"A contactor is a heavy-duty relay that can switch motor currents (often 10s of amps) safely via a low-power control circuit." },
  { id:"et12_06", grade:12, subject:"Electrical Technology", topic:"PLCs", question:"PLC stands for:", options:["Programmable Logic Controller","Power Line Controller","Parallel Load Circuit","Programmed Lighting Component"], answer:0, explanation:"PLC = Programmable Logic Controller — an industrial computer that controls machinery and processes using ladder logic." },
  { id:"et12_07", grade:12, subject:"Electrical Technology", topic:"PLCs", question:"In PLC ladder logic, a normally open (NO) contact closes when:", options:["The input is activated (logic 1)","The input is off (logic 0)","Power is cut","The output is on"], answer:0, explanation:"A normally open contact in ladder logic is open (0) by default and closes (passes current) when the input bit is 1." },
  { id:"et12_08", grade:12, subject:"Electrical Technology", topic:"Electronic Control", question:"A thyristor (SCR) is mainly used for:", options:["Controlled rectification and power control","Amplification of small signals","Storing charge","Measuring resistance"], answer:0, explanation:"SCR (Silicon Controlled Rectifier/thyristor): used in power control circuits — can be triggered to conduct and controls large AC/DC loads." },
  { id:"et12_09", grade:12, subject:"Electrical Technology", topic:"Wiring", question:"A distribution board (DB board) in a house contains:", options:["Circuit breakers that protect each circuit","Only the main switch","Light switches","The electricity meter"], answer:0, explanation:"A DB board distributes power from the supply to individual circuits, each protected by its own circuit breaker or fuse." },
  { id:"et12_10", grade:12, subject:"Electrical Technology", topic:"AC Theory", question:"Impedance (Z) in an AC circuit is:", options:["The total opposition to current (resistance + reactance)","Only resistance","Only reactance","Voltage divided by power"], answer:0, explanation:"Impedance Z = √(R² + X²). It is the total opposition to AC current, combining resistance and reactance." },
  { id:"et12_11", grade:12, subject:"Electrical Technology", topic:"AC Theory", question:"At resonance in an LC circuit:", options:["XL = XC and impedance is minimum","XL > XC","Current is zero","Voltage is zero"], answer:0, explanation:"At resonance: inductive reactance equals capacitive reactance (XL = XC), impedance is at minimum, and current is maximum." },
  { id:"et12_12", grade:12, subject:"Electrical Technology", topic:"Safety", question:"IP54 rating on electrical equipment means:", options:["Dust protected and splash proof","Fully waterproof and dustproof","Only indoor use","High voltage rating"], answer:0, explanation:"IP (Ingress Protection) rating: first digit = dust protection (5=dust protected), second digit = water protection (4=splash proof)." },
  { id:"et12_13", grade:12, subject:"Electrical Technology", topic:"Motors", question:"Slip in an induction motor refers to:", options:["Difference between synchronous and rotor speed","Motor overheating","Current through brushes","Power factor loss"], answer:0, explanation:"Slip = (Ns − Nr)/Ns × 100%. The rotor always runs slightly slower than the rotating magnetic field — this slip is essential for torque production." },
  { id:"et12_14", grade:12, subject:"Electrical Technology", topic:"Electronic Control", question:"A transistor in saturation acts like:", options:["A closed switch","An open switch","A resistor","A capacitor"], answer:0, explanation:"Saturation: transistor is fully ON, acting as a closed switch — maximum collector current flows." },
  { id:"et12_15", grade:12, subject:"Electrical Technology", topic:"Three-Phase", question:"Star-delta starting of a motor reduces the starting current by:", options:["A factor of 3","A factor of 2","Half","One quarter"], answer:0, explanation:"Star-delta starting: motor starts in star (reduced voltage), then switches to delta. Starting current is reduced to 1/3 of full DOL current." },

  // ══════════════════════════════════════════════════════════════════════════
  // MECHANICAL TECHNOLOGY — GRADE 10
  // ══════════════════════════════════════════════════════════════════════════
  { id:"mt10_01", grade:10, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"A vernier calliper is used to measure:", options:["Small dimensions accurately (to 0.02 mm)","Large distances","Surface roughness","Angles only"], answer:0, explanation:"A vernier calliper measures internal/external dimensions and depths accurately to 0.02 mm (or 0.05 mm on some models)." },
  { id:"mt10_02", grade:10, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"A micrometer measures with greater precision than a vernier calliper — up to:", options:["0.01 mm","0.1 mm","1 mm","0.001 mm"], answer:0, explanation:"An outside micrometer measures to 0.01 mm (some digital to 0.001 mm) — more precise than a vernier calliper." },
  { id:"mt10_03", grade:10, subject:"Mechanical Technology", topic:"Materials", question:"Mild steel has a carbon content of approximately:", options:["0.1 – 0.3%","0.6 – 1.4%","2 – 4%","5%+"], answer:0, explanation:"Mild (low carbon) steel: 0.1–0.3% carbon. Medium carbon: 0.3–0.6%. High carbon: 0.6–1.4%. Cast iron: 2–4%." },
  { id:"mt10_04", grade:10, subject:"Mechanical Technology", topic:"Materials", question:"Hardening of steel is done by:", options:["Heating to critical temperature then quenching","Cooling slowly in a furnace","Heating then letting it air cool","Hammering the metal"], answer:0, explanation:"Hardening: heat steel to critical temp (cherry red), then quench rapidly in oil or water — creates a hard, brittle structure (martensite)." },
  { id:"mt10_05", grade:10, subject:"Mechanical Technology", topic:"Tools", question:"A hacksaw is used to:", options:["Cut metal","Drill holes","Measure dimensions","File surfaces"], answer:0, explanation:"A hacksaw cuts metal using a replaceable blade with hardened teeth — used for cutting bar stock, pipes, and bolts." },
  { id:"mt10_06", grade:10, subject:"Mechanical Technology", topic:"Tools", question:"A tap is used to:", options:["Cut internal threads","Cut external threads","Measure bore diameter","Polish surfaces"], answer:0, explanation:"A tap cuts internal (female) threads inside a hole. A die cuts external (male) threads on a rod/bolt." },
  { id:"mt10_07", grade:10, subject:"Mechanical Technology", topic:"Fasteners", question:"A bolt is different from a stud because:", options:["A bolt has a head; a stud has threads on both ends","A bolt has no head","A stud has a head","They are the same"], answer:0, explanation:"Bolt: has a head + threaded shank. Stud: no head, threaded at both ends. Both are used with nuts." },
  { id:"mt10_08", grade:10, subject:"Mechanical Technology", topic:"Fasteners", question:"A spring washer is used to:", options:["Prevent a nut from loosening under vibration","Increase clamping force","Reduce bolt size","Guide the bolt"], answer:0, explanation:"Spring (split/lock) washers bite into the nut and mating surface under load — they resist loosening from vibration." },
  { id:"mt10_09", grade:10, subject:"Mechanical Technology", topic:"Lubrication", question:"The main purpose of lubrication in a machine is:", options:["Reduce friction and wear between moving parts","Increase speed","Tighten bolts","Cool the motor"], answer:0, explanation:"Lubrication reduces friction between moving surfaces, decreasing wear, heat generation, and energy loss." },
  { id:"mt10_10", grade:10, subject:"Mechanical Technology", topic:"Safety", question:"Personal Protective Equipment (PPE) in a workshop includes:", options:["Safety glasses, gloves, and overalls","Only a hard hat","Only safety shoes","Earplugs only"], answer:0, explanation:"Workshop PPE includes safety glasses (eye protection), overalls, safety shoes (toe protection), and gloves as appropriate." },
  { id:"mt10_11", grade:10, subject:"Mechanical Technology", topic:"Materials", question:"Annealing steel makes it:", options:["Softer and more ductile","Harder and more brittle","Stronger and magnetic","Lighter"], answer:0, explanation:"Annealing: heat to critical temperature, then cool very slowly (in furnace). Result: soft, ductile steel — easy to machine." },
  { id:"mt10_12", grade:10, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"A centre punch is used to:", options:["Mark a starting point for drilling","Measure hole diameter","Cut a thread","Remove a bearing"], answer:0, explanation:"A centre punch creates a small indentation (centre) on a workpiece to guide a drill bit and prevent it from wandering." },
  { id:"mt10_13", grade:10, subject:"Mechanical Technology", topic:"Tools", question:"A file is used to:", options:["Remove small amounts of material from metal surfaces","Drill holes","Cut threads","Measure thickness"], answer:0, explanation:"Files remove material by abrasion — used to deburr, shape, and smooth metal surfaces and edges." },
  { id:"mt10_14", grade:10, subject:"Mechanical Technology", topic:"Drives", question:"A V-belt and pulley system is used to:", options:["Transmit power between shafts","Lubricate bearings","Measure shaft speed","Align shafts"], answer:0, explanation:"V-belt drives transmit rotational power from one shaft to another via pulleys — also used to change speed/torque ratios." },
  { id:"mt10_15", grade:10, subject:"Mechanical Technology", topic:"Drives", question:"If a drive pulley is smaller than the driven pulley, the driven shaft will rotate:", options:["Slower with more torque","Faster with less torque","At the same speed","With less power"], answer:0, explanation:"Speed ratio = D_driven/D_drive. Larger driven pulley = slower speed but higher torque — mechanical advantage." },

  // ══════════════════════════════════════════════════════════════════════════
  // MECHANICAL TECHNOLOGY — GRADE 11
  // ══════════════════════════════════════════════════════════════════════════
  { id:"mt11_01", grade:11, subject:"Mechanical Technology", topic:"Welding", question:"MIG welding uses:", options:["A continuous wire electrode fed through a gun","A coated stick electrode","A carbon arc","Only heat from gas flames"], answer:0, explanation:"MIG (Metal Inert Gas / GMAW): a continuous consumable wire electrode is fed automatically while inert shielding gas protects the weld pool." },
  { id:"mt11_02", grade:11, subject:"Mechanical Technology", topic:"Welding", question:"TIG welding is best suited for:", options:["Thin, precise welds on stainless steel and aluminium","Heavy structural steel","Cast iron only","Only mild steel pipe"], answer:0, explanation:"TIG (Tungsten Inert Gas / GTAW) uses a non-consumable tungsten electrode — produces high-quality, precise welds on thin materials." },
  { id:"mt11_03", grade:11, subject:"Mechanical Technology", topic:"Welding", question:"A welding distortion can be minimised by:", options:["Using tack welds and clamping the workpiece","Welding faster","Using more heat","Welding from one end only"], answer:0, explanation:"Tack welding at intervals and clamping/jigging the workpiece reduces movement and distortion during welding." },
  { id:"mt11_04", grade:11, subject:"Mechanical Technology", topic:"Heat Treatment", question:"Tempering steel after hardening is done to:", options:["Reduce brittleness while retaining some hardness","Make it softer than original","Increase hardness further","Remove carbon"], answer:0, explanation:"Tempering: reheat hardened steel to below critical temp (150–600°C), then cool. Reduces brittleness while maintaining hardness." },
  { id:"mt11_05", grade:11, subject:"Mechanical Technology", topic:"Heat Treatment", question:"Case hardening produces a component with:", options:["A hard outer surface and tough inner core","Uniform hardness throughout","Soft surface only","High carbon throughout"], answer:0, explanation:"Case hardening (carburising): adds carbon to the surface layer, creating a hard case while the core remains tough." },
  { id:"mt11_06", grade:11, subject:"Mechanical Technology", topic:"Drives", question:"A gear ratio of 4:1 means the output shaft:", options:["Rotates 4 times slower with 4 times more torque","Rotates 4 times faster","Has less torque","Has the same speed"], answer:0, explanation:"Gear ratio 4:1: input rotates 4 times for every 1 output rotation. Output is slower but has 4× more torque (ignoring losses)." },
  { id:"mt11_07", grade:11, subject:"Mechanical Technology", topic:"Drives", question:"A worm gear drive is used when:", options:["Very large speed reductions are needed in a compact space","High speeds are required","Equal speed ratio is needed","Reversibility is essential"], answer:0, explanation:"Worm gears provide high reduction ratios in a compact unit — also self-locking (cannot be back-driven) in many applications." },
  { id:"mt11_08", grade:11, subject:"Mechanical Technology", topic:"Bearings", question:"A ball bearing is used to:", options:["Reduce friction and support rotating shafts","Lubricate the shaft","Align the shaft","Measure shaft speed"], answer:0, explanation:"Ball bearings use rolling elements to minimise friction between the rotating shaft and housing — supporting radial and some axial loads." },
  { id:"mt11_09", grade:11, subject:"Mechanical Technology", topic:"Bearings", question:"Grease is preferred over oil in sealed bearings because:", options:["It stays in place and requires no reservoir","It lubricates better at all speeds","It is cheaper","It prevents corrosion better"], answer:0, explanation:"Grease is packed into sealed/shielded bearings at manufacture and stays in place — no oil reservoir or pump is needed." },
  { id:"mt11_10", grade:11, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"A lathe is used to:", options:["Machine cylindrical parts by rotating the workpiece","Drill rectangular holes","Cut sheet metal","Shape flat surfaces"], answer:0, explanation:"A centre lathe rotates the workpiece while a cutting tool shapes it — used for turning, facing, boring, and threading." },
  { id:"mt11_11", grade:11, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"A drill press is more accurate than a hand drill because:", options:["The drill runs perpendicular to the work surface","It drills faster","It uses larger bits","It is computer controlled"], answer:0, explanation:"A drill press has a fixed vertical spindle — the drill enters the workpiece at exactly 90° (or set angle), unlike a hand drill." },
  { id:"mt11_12", grade:11, subject:"Mechanical Technology", topic:"Materials", question:"Stainless steel resists corrosion because of its:", options:["High chromium content (11%+)","High carbon content","Special coating","Aluminium addition"], answer:0, explanation:"Stainless steel contains at least 11% chromium — it forms a self-repairing chromium oxide passive layer that prevents rust." },
  { id:"mt11_13", grade:11, subject:"Mechanical Technology", topic:"Hydraulics", question:"Pascal's Law states that pressure in a fluid:", options:["Is transmitted equally in all directions","Only acts downward","Reduces with depth","Acts only on solids"], answer:0, explanation:"Pascal's Law: pressure applied to an enclosed fluid is transmitted undiminished in all directions — basis of hydraulics." },
  { id:"mt11_14", grade:11, subject:"Mechanical Technology", topic:"Hydraulics", question:"Hydraulic oil must be:", options:["Incompressible and have good lubrication properties","Compressible","Water-based only","Very thin (low viscosity)"], answer:0, explanation:"Hydraulic fluid must be virtually incompressible (transmit force accurately) and lubricate moving parts within the system." },
  { id:"mt11_15", grade:11, subject:"Mechanical Technology", topic:"Safety", question:"A Material Safety Data Sheet (MSDS) provides information about:", options:["Hazards and safe handling of chemicals","Dimensions of materials","Cost of materials","Welding procedures"], answer:0, explanation:"MSDS (now called SDS) gives details on chemical hazards, safe handling, PPE, storage, and emergency response." },

  // ══════════════════════════════════════════════════════════════════════════
  // MECHANICAL TECHNOLOGY — GRADE 12
  // ══════════════════════════════════════════════════════════════════════════
  { id:"mt12_01", grade:12, subject:"Mechanical Technology", topic:"Drives", question:"In a chain and sprocket drive, the velocity ratio = number of teeth on driven / …?", options:["Number of teeth on driver","Diameter of driven sprocket","Chain pitch","Number of links"], answer:0, explanation:"VR = T_driven / T_driver. Equivalent to gear ratio — more teeth on driven sprocket = slower, more torque." },
  { id:"mt12_02", grade:12, subject:"Mechanical Technology", topic:"Drives", question:"Mechanical advantage in a pulley system means:", options:["Less effort force is needed to lift a load","The load moves faster","No friction exists","The rope is longer"], answer:0, explanation:"Mechanical advantage (MA) = Load/Effort. A pulley system multiplies force — you apply less force over a greater distance." },
  { id:"mt12_03", grade:12, subject:"Mechanical Technology", topic:"Welding", question:"OAW (oxy-acetylene welding) uses:", options:["Oxygen and acetylene gas to produce a flame","Only acetylene","An arc between electrodes","A plasma cutter"], answer:0, explanation:"OAW burns oxygen + acetylene to produce a flame reaching ~3200°C — used for welding, cutting, and brazing." },
  { id:"mt12_04", grade:12, subject:"Mechanical Technology", topic:"Welding", question:"Brazing differs from welding because:", options:["Brazing uses a filler metal below the base metal's melting point","Brazing melts the base metal","Brazing uses flux only","They are identical processes"], answer:0, explanation:"Brazing: filler metal (brass/silver) melts between 450–900°C — base metal doesn't melt. Welding melts the base metal." },
  { id:"mt12_05", grade:12, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"Tolerance in engineering refers to:", options:["The permissible variation in a dimension","The maximum dimension only","The material hardness","Surface finish rating"], answer:0, explanation:"Tolerance = upper limit − lower limit. It defines how much a dimension can vary while the part still functions correctly." },
  { id:"mt12_06", grade:12, subject:"Mechanical Technology", topic:"Fitting & Machining", question:"A shaft-basis fit system means:", options:["The shaft dimension is fixed and the hole varies","The hole dimension is fixed","Both vary equally","Neither varies"], answer:0, explanation:"Shaft-basis: shaft has a fixed (constant) size; the hole (bore) is varied to achieve the required fit (clearance, transition, or interference)." },
  { id:"mt12_07", grade:12, subject:"Mechanical Technology", topic:"Pneumatics", question:"Compressed air in a pneumatic system is produced by:", options:["A compressor","A hydraulic pump","A gearbox","A motor only"], answer:0, explanation:"A compressor pressurises air for pneumatic systems — unlike hydraulics, pneumatics uses air (compressible fluid)." },
  { id:"mt12_08", grade:12, subject:"Mechanical Technology", topic:"Pneumatics", question:"Pneumatics is preferred over hydraulics when:", options:["Cleanliness and fast speed are needed but forces are lower","Very high forces are required","Precision positioning is critical","Oil leaks are acceptable"], answer:0, explanation:"Pneumatics: clean, fast, lighter loads (tools, clamps, automation). Hydraulics: higher forces (presses, earthmovers)." },
  { id:"mt12_09", grade:12, subject:"Mechanical Technology", topic:"Materials", question:"The Brinell Hardness Test measures hardness by:", options:["Pressing a hardened steel ball into the surface","Scratching the surface","Dropping a weight","Bending a sample"], answer:0, explanation:"Brinell test: a hardened steel or carbide ball is pressed into the surface under a known load — BHN = Load/surface area of indentation." },
  { id:"mt12_10", grade:12, subject:"Mechanical Technology", topic:"Materials", question:"A Charpy impact test measures:", options:["Toughness (energy absorbed before fracture)","Hardness","Tensile strength","Ductility"], answer:0, explanation:"Charpy/Izod impact tests measure toughness — how much energy a material absorbs when struck. Important for materials used in cold/dynamic conditions." },
  { id:"mt12_11", grade:12, subject:"Mechanical Technology", topic:"Maintenance", question:"Preventive maintenance means:", options:["Scheduled maintenance done before breakdowns occur","Fixing equipment after it breaks","Emergency repairs","Replacing all parts annually"], answer:0, explanation:"Preventive maintenance: routine inspections, lubrication, and part replacement on a schedule — prevents unexpected breakdowns." },
  { id:"mt12_12", grade:12, subject:"Mechanical Technology", topic:"Maintenance", question:"Predictive maintenance uses:", options:["Condition monitoring (vibration, temperature, oil analysis) to predict failures","Only scheduled intervals","Visual inspection only","Breakdown data"], answer:0, explanation:"Predictive maintenance monitors actual equipment condition (vibration analysis, thermography, oil sampling) to predict when maintenance is needed." },
  { id:"mt12_13", grade:12, subject:"Mechanical Technology", topic:"Hydraulics", question:"A hydraulic accumulator is used to:", options:["Store hydraulic energy and dampen pressure surges","Pump fluid","Filter the oil","Measure pressure"], answer:0, explanation:"An accumulator stores hydraulic energy (pressurised fluid) for peak demand, smooths pressure surges, and acts as an emergency power source." },
  { id:"mt12_14", grade:12, subject:"Mechanical Technology", topic:"Drives", question:"An epicyclic (planetary) gear set is used in:", options:["Automatic transmissions and gearboxes","Simple hand tools","Belt conveyors","Hydraulic pumps"], answer:0, explanation:"Planetary gear sets offer multiple gear ratios in a compact package — used in automatic gearboxes, hub gears, and industrial reducers." },
  { id:"mt12_15", grade:12, subject:"Mechanical Technology", topic:"Materials", question:"Fatigue failure in metals occurs when:", options:["Repeated cyclic stresses cause cracks to grow and fracture","A single overload breaks the part","The metal overheats","Corrosion removes material"], answer:0, explanation:"Metal fatigue: cracks initiate at stress concentrations under repeated loading well below ultimate tensile strength — responsible for many engineering failures." },

];

// ─────────────────────────────────────────────────────────────────────────────
// SUBJECT CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECTS = {
  "Mathematics":              { icon:"📐", color:"#2563eb", grades:[10,11,12] },
  "Technical Mathematics":    { icon:"🔧", color:"#0369a1", grades:[10,11,12] },
  "Mathematical Literacy":    { icon:"💡", color:"#7c3aed", grades:[10,11,12] },
  "Physical Sciences":        { icon:"⚗️", color:"#6d28d9", grades:[10,11,12] },
  "Technical Sciences":       { icon:"🔬", color:"#0f766e", grades:[10,11,12] },
  "Life Sciences":             { icon:"🧬", color:"#16a34a", grades:[10,11,12] },
  "Accounting":               { icon:"📒", color:"#b45309", grades:[10,12] },
  "English":                  { icon:"📖", color:"#0891b2", grades:[10,11,12] },
  "Business Studies":         { icon:"💼", color:"#059669", grades:[10,11,12] },
  "Economics":                { icon:"📈", color:"#dc2626", grades:[10,11,12] },
  "History":                  { icon:"🏛️", color:"#92400e", grades:[10,11,12] },
  "Geography":                { icon:"🌍", color:"#1d4ed8", grades:[10,11,12] },
  "Civil Technology":         { icon:"🏗️", color:"#b45309", grades:[10,11,12] },
  "Electrical Technology":    { icon:"⚡", color:"#ca8a04", grades:[10,11,12] },
  "Mechanical Technology":    { icon:"⚙️", color:"#475569", grades:[10,11,12] },
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
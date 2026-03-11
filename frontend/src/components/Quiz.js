// src/components/Quiz.js
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import StudentProfile from "./StudentProfile";
import EnhancedResults from "./EnhancedResults";

// ─── TIMER LIMITS ─────────────────────────────────────────────────────────────
const ATTITUDE_TIME  = 30;   // seconds per attitude/opinion question
const MATH_TIME      = 45;   // seconds per math challenge question

// ─── SA SUBJECT STREAMS ───────────────────────────────────────────────────────
const SA_STREAMS = {
  "Science Stream": {
    subjects: ["Mathematics", "Physical Sciences", "Life Sciences", "Geography / Agricultural Sciences"],
    careers:  ["Doctor", "Engineer", "Pharmacist", "Environmental Scientist", "Veterinarian", "Biotechnologist"],
    color: "#2563eb", icon: "🔬"
  },
  "Commerce Stream": {
    subjects: ["Mathematics", "Accounting", "Business Studies", "Economics"],
    careers:  ["Accountant", "Financial Analyst", "Entrepreneur", "Economist", "Auditor", "Investment Banker"],
    color: "#16a34a", icon: "📊"
  },
  "Humanities Stream": {
    subjects: ["Mathematical Literacy", "History", "Tourism", "Geography", "Consumer Studies"],
    careers:  ["Journalist", "Social Worker", "Teacher", "Tourism Manager", "Historian", "Psychologist"],
    color: "#9333ea", icon: "🎭"
  },
  "Engineering / Technical Stream": {
    subjects: ["Technical Mathematics", "Technical Sciences", "Civil Technology / Electrical Technology", "Engineering Graphics and Design"],
    careers:  ["Civil Engineer", "Electrician", "Draughtsperson", "Mechanical Technician", "Construction Manager", "IT Technician"],
    color: "#ea580c", icon: "⚙️"
  }
};

// ─── MATH QUESTION BANK (30 questions) ───────────────────────────────────────
const MATH_BANK = [
  { id:"m01", difficulty:"easy",   topic:"Arithmetic", question:"What is 12 × 8?",                                                           answer:"96"   },
  { id:"m02", difficulty:"easy",   topic:"Arithmetic", question:"What is 144 ÷ 12?",                                                         answer:"12"   },
  { id:"m03", difficulty:"easy",   topic:"Arithmetic", question:"What is 25% of 200?",                                                       answer:"50"   },
  { id:"m04", difficulty:"easy",   topic:"Arithmetic", question:"What is 15% of 200?",                                                       answer:"30"   },
  { id:"m05", difficulty:"easy",   topic:"Arithmetic", question:"What is 7² (7 squared)?",                                                   answer:"49"   },
  { id:"m06", difficulty:"easy",   topic:"Arithmetic", question:"What is the square root of 225?",                                          answer:"15"   },
  { id:"m07", difficulty:"easy",   topic:"Arithmetic", question:"What is 1000 ÷ 25?",                                                       answer:"40"   },
  { id:"m08", difficulty:"easy",   topic:"Arithmetic", question:"What is 3³ (3 cubed)?",                                                    answer:"27"   },
  { id:"m09", difficulty:"medium", topic:"Algebra",    question:"Solve for x: 2x + 3 = 11",                                                  answer:"4"    },
  { id:"m10", difficulty:"medium", topic:"Algebra",    question:"Solve for x: 3x − 5 = 16",                                                  answer:"7"    },
  { id:"m11", difficulty:"medium", topic:"Algebra",    question:"Solve for x: 5x + 2 = 27",                                                  answer:"5"    },
  { id:"m12", difficulty:"medium", topic:"Algebra",    question:"Solve for x: 4(x − 1) = 20",                                                answer:"6"    },
  { id:"m13", difficulty:"medium", topic:"Algebra",    question:"Simplify: 3x + 2x − x  (write answer as a term, e.g. 4x)",                  answer:"4x"   },
  { id:"m14", difficulty:"hard",   topic:"Algebra",    question:"Solve for x: x² = 81  (positive value only)",                               answer:"9"    },
  { id:"m15", difficulty:"hard",   topic:"Algebra",    question:"Solve for x: 2x² = 50  (positive value only)",                              answer:"5"    },
  { id:"m16", difficulty:"easy",   topic:"Geometry",   question:"A triangle has angles 50° and 60°. What is the third angle?",               answer:"70"   },
  { id:"m17", difficulty:"easy",   topic:"Geometry",   question:"A triangle has angles 45° and 90°. What is the third angle?",               answer:"45"   },
  { id:"m18", difficulty:"medium", topic:"Geometry",   question:"Area of a rectangle 8 cm long and 5 cm wide? (answer in cm²)",              answer:"40"   },
  { id:"m19", difficulty:"medium", topic:"Geometry",   question:"Perimeter of a square with side 7 cm? (answer in cm)",                     answer:"28"   },
  { id:"m20", difficulty:"medium", topic:"Geometry",   question:"Circumference of a circle with radius 7? Use π ≈ 22/7",                    answer:"44"   },
  { id:"m21", difficulty:"hard",   topic:"Geometry",   question:"A right triangle has legs of 3 and 4. What is the hypotenuse?",             answer:"5"    },
  { id:"m22", difficulty:"easy",   topic:"Patterns",   question:"Next number: 2, 4, 8, 16, ___?",                                            answer:"32"   },
  { id:"m23", difficulty:"easy",   topic:"Patterns",   question:"Next number: 1, 4, 9, 16, ___?",                                            answer:"25"   },
  { id:"m24", difficulty:"medium", topic:"Patterns",   question:"10th term of the sequence 3, 6, 9, 12, ...?",                               answer:"30"   },
  { id:"m25", difficulty:"medium", topic:"Patterns",   question:"Find the missing number: 5, 10, ___, 20, 25",                               answer:"15"   },
  { id:"m26", difficulty:"hard",   topic:"Patterns",   question:"Find the missing number: 2, 6, 18, ___, 162",                               answer:"54"   },
  { id:"m27", difficulty:"easy",   topic:"Statistics", question:"Mean of 4, 8, 12, 16?",                                                     answer:"10"   },
  { id:"m28", difficulty:"easy",   topic:"Statistics", question:"Median of 3, 7, 9, 11, 15?",                                                answer:"9"    },
  { id:"m29", difficulty:"medium", topic:"Statistics", question:"Range of 5, 12, 3, 19, 8?",                                                 answer:"16"   },
  { id:"m30", difficulty:"medium", topic:"Statistics", question:"A bag has 3 red and 7 blue balls. Probability of picking red? (decimal)",   answer:"0.3"  },
];

const MATH_PER_ATTEMPT = 7;
const SESSION_KEY = "sa_quiz_used_math_ids";

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickMathQuestions() {
  let usedIds = [];
  try { usedIds = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]"); } catch (_) {}
  const unused = MATH_BANK.filter(q => !usedIds.includes(q.id));
  const pool   = unused.length >= MATH_PER_ATTEMPT ? unused : [...MATH_BANK];
  const picked = shuffleArray(pool).slice(0, MATH_PER_ATTEMPT);
  const newUsed = [...new Set([...usedIds, ...picked.map(q => q.id)])];
  sessionStorage.setItem(SESSION_KEY, newUsed.length >= MATH_BANK.length ? "[]" : JSON.stringify(newUsed));
  return picked;
}

// Web Speech API voice welcome
function speakWelcome() {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(
    "Welcome to Stablym Subject Stream. Please be honest with yourself. This is the beginning of your dreams."
  );
  msg.rate  = 0.88;
  msg.pitch = 1.05;
  msg.volume = 1;

  // Prefer a warm English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel"))
  ) || voices.find(v => v.lang.startsWith("en"));
  if (preferred) msg.voice = preferred;

  window.speechSynthesis.speak(msg);
}

// ─── QUESTION BANK ────────────────────────────────────────────────────────────
const QUESTION_BANK = [
  { category:"Scientific Curiosity",             stream:"Science Stream",                   weight:1,   questions:["I enjoy doing experiments or investigations.","I'm curious about how natural things work.","I like subjects like Biology, Physics, or Chemistry.","I enjoy solving science-related problems.","I'm interested in discovering new scientific facts.","I like watching science documentaries or reading about discoveries.","I enjoy questioning why things happen in nature.","I find topics like genetics, atoms, or ecosystems fascinating."] },
  { category:"Numerical & Analytical Skills",    stream:"Science Stream",                   weight:0.8, questions:["I enjoy solving math problems and number puzzles.","I like analyzing data and finding patterns.","I'm confident working with statistics and graphs.","I enjoy logical reasoning and problem-solving tasks.","I like calculating and comparing numbers.","I enjoy working with spreadsheets or data tables.","I can spot errors in calculations quickly.","I like brain teasers that involve logic."] },
  { category:"Business & Financial Interest",    stream:"Commerce Stream",                  weight:1,   questions:["I'm interested in how money and business work.","I want to learn about entrepreneurship.","I enjoy thinking about investments and saving.","I like business studies or economics.","I'm curious how companies grow and compete.","I enjoy reading about successful entrepreneurs.","I like understanding how markets and prices change.","I'd enjoy managing a budget or running a small project."] },
  { category:"Creativity & Expression",          stream:"Humanities Stream",                weight:0.9, questions:["I enjoy drawing, writing, or performing.","I like expressing ideas creatively.","I think of creative ways to solve problems.","I enjoy art, design, or music subjects.","I like storytelling and narratives.","I enjoy making videos, podcasts, or creative projects.","I like decorating, designing, or styling things.","I often imagine new ideas, inventions, or stories."] },
  { category:"Social Awareness & Communication", stream:"Humanities Stream",                weight:1,   questions:["I enjoy helping and understanding people.","I'm interested in social and community issues.","I communicate my ideas easily to others.","I like working in groups and collaborating.","I enjoy leading discussions and debates.","I notice when people around me are struggling and want to help.","I like volunteering or community projects.","I'm good at listening and giving advice."] },
  { category:"Technical & Practical Skills",     stream:"Engineering / Technical Stream",   weight:1,   questions:["I enjoy building or fixing things with my hands.","I like working with tools and machinery.","I enjoy practical, hands-on tasks.","I'm interested in engineering, IT, or construction.","I prefer learning by doing over reading theory.","I enjoy taking things apart to see how they work.","I like computer hardware, electronics, or circuits.","I find it satisfying when a mechanical or technical problem is solved."] },
  { category:"History & Critical Thinking",      stream:"Humanities Stream",                weight:0.7, questions:["I enjoy learning about history and past events.","I like discussing how historical decisions affect today.","I enjoy debating and forming strong arguments.","I analyze situations from multiple angles.","I'm curious about different cultures and societies.","I enjoy reading about world events and politics.","I like evaluating two sides of an argument.","I find it interesting how societies change over time."] },
  { category:"Maths Aptitude & Interest",        stream:"Science Stream",                   weight:0.9, questions:["I enjoy solving complex maths problems.","I feel confident working with numbers.","I like algebra, geometry, and calculus.","I apply mathematical thinking in everyday life.","I want to improve and challenge my maths skills.","I enjoy competitions that test mathematical ability.","Maths is one of my favourite subjects at school.","I can understand mathematical concepts without much help."] },
  { category:"Career Aspirations",               stream:null,                               weight:1,   questions:["I see myself working in a laboratory or research environment.","I dream of running my own business one day.","I want a career that directly helps or counsels people.","I'm drawn to careers that involve designing or building structures.","I'd like to work in creative industries like media or the arts.","I want to work with data, numbers, or financial systems.","I'd like a career in education, law, or social services.","I want to work with computers, networks, or technology."] },
  { category:"Learning Style",                   stream:null,                               weight:0.6, questions:["I learn best through experiments and seeing results.","I understand things better when I use diagrams or charts.","I prefer group discussions over studying alone.","I enjoy following step-by-step technical instructions.","I find it easier to learn through storytelling and examples.","I remember things better when I write them down.","I learn quickly by watching demonstrations.","I prefer solving real-life problems over memorising theory."] },
  { category:"Extracurricular Interests",        stream:null,                               weight:0.5, questions:["I participate in science fairs or coding competitions.","I'm involved in entrepreneurship clubs or business projects.","I take part in drama, debate, or community service.","I enjoy robotics, woodwork, or electronics clubs.","I'm part of sports teams, history clubs, or cultural activities.","I like attending or organising fundraisers and events.","I enjoy maths olympiad or academic competitions.","I like creative writing clubs, art groups, or music ensembles."] },
  { category:"Subject Performance",              stream:null,                               weight:1.2, questions:["I consistently perform well in Science subjects.","I achieve good marks in Mathematics.","I do well in Business Studies or Accounting.","I excel in Language and Social Science subjects.","I perform best in Technical or Practical subjects.","My teachers say I have a talent for analytical thinking.","I find it easier to write essays and arguments than solve equations.","I tend to score higher in practical or hands-on assessments."] },
];

function buildActiveQuestions() {
  return QUESTION_BANK.map(cat => ({ ...cat, questions: shuffleArray(cat.questions).slice(0, 5) }));
}

// ─── SCORING ─────────────────────────────────────────────────────────────────
const SCORE_MAP = { "Strongly Agree":5, "Agree":4, "Neutral":3, "Disagree":2, "Strongly Disagree":1 };
const OPTIONS   = ["Strongly Agree","Agree","Neutral","Disagree","Strongly Disagree"];
const DIFF_COLOR = { easy:"#16a34a", medium:"#d97706", hard:"#dc2626" };

const careerMap      = ["Science Stream","Commerce Stream","Humanities Stream","Engineering / Technical Stream","Humanities Stream","Commerce Stream","Humanities Stream","Engineering / Technical Stream"];
const learningMap    = ["Science Stream","Science Stream","Humanities Stream","Engineering / Technical Stream","Humanities Stream","Humanities Stream","Science Stream","Engineering / Technical Stream"];
const extracurricMap = ["Science Stream","Commerce Stream","Humanities Stream","Engineering / Technical Stream","Humanities Stream","Humanities Stream","Science Stream","Humanities Stream"];
const performanceMap = ["Science Stream","Science Stream","Commerce Stream","Humanities Stream","Engineering / Technical Stream","Science Stream","Humanities Stream","Engineering / Technical Stream"];

function calculateStreamScores(answers, questionsData, mathBonus, mathTotal) {
  const scores = { "Science Stream":0, "Commerce Stream":0, "Humanities Stream":0, "Engineering / Technical Stream":0 };
  const maxes  = { ...scores };
  questionsData.forEach(cat => {
    cat.questions.forEach((_, qi) => {
      const key   = `${cat.category}-${qi}`;
      const score = SCORE_MAP[answers[key]] || 3;
      let target  = cat.stream;
      if (!target) {
        if      (cat.category === "Career Aspirations")       target = careerMap[qi]      || "Humanities Stream";
        else if (cat.category === "Learning Style")           target = learningMap[qi]    || "Humanities Stream";
        else if (cat.category === "Extracurricular Interests") target = extracurricMap[qi] || "Humanities Stream";
        else if (cat.category === "Subject Performance")      target = performanceMap[qi] || "Science Stream";
      }
      if (target && scores[target] !== undefined) {
        scores[target] += score * cat.weight;
        maxes[target]  += 5    * cat.weight;
      }
    });
  });
  if (mathTotal > 0) {
    const bonus = (mathBonus / mathTotal) * 25;
    scores["Science Stream"] += bonus;
    scores["Engineering / Technical Stream"] += bonus * 0.7;
    maxes["Science Stream"]  += 25;
    maxes["Engineering / Technical Stream"] += 17.5;
  }
  const pct = {};
  Object.keys(scores).forEach(s => { pct[s] = Math.round((scores[s] / (maxes[s] || 1)) * 100); });
  return pct;
}

// ─── COUNTDOWN RING COMPONENT ─────────────────────────────────────────────────
function CountdownRing({ timeLeft, totalTime }) {
  const radius = 22;
  const circ   = 2 * Math.PI * radius;
  const pct    = timeLeft / totalTime;
  const offset = circ * (1 - pct);

  const urgent  = timeLeft <= 10;
  const warning = timeLeft <= 20 && !urgent;
  const color   = urgent ? "#dc2626" : warning ? "#d97706" : "#2563eb";

  return (
    <div style={{ position:"relative", width:60, height:60, flexShrink:0 }}>
      <svg width={60} height={60} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={30} cy={30} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={4} />
        <circle
          cx={30} cy={30} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition:"stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <div style={{
        position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize: timeLeft <= 9 ? 15 : 13,
        fontWeight: 800,
        color,
        fontVariantNumeric: "tabular-nums"
      }}>
        {timeLeft}
      </div>
    </div>
  );
}

// ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
function WelcomeScreen({ onStart }) {
  const spokenRef = useRef(false);

  useEffect(() => {
    if (spokenRef.current) return;
    spokenRef.current = true;
    // Slight delay so voices are loaded
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) { speakWelcome(); }
      else { setTimeout(trySpeak, 300); }
    };
    setTimeout(trySpeak, 400);
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div style={st.welcomeWrap}>
      {/* Animated background orbs */}
      <div style={st.orb1} />
      <div style={st.orb2} />
      <div style={st.orb3} />

      <div style={st.welcomeCard}>
        <div style={st.logoRing}>🎓</div>
        <h1 style={st.welcomeTitle}>STABLYM</h1>
        <h2 style={st.welcomeSub}>Subject Stream Selector</h2>
        <p style={st.welcomeTagline}>
          "Be honest with yourself.<br />
          <strong>This is the beginning of your dreams.</strong>"
        </p>

        <div style={st.welcomeDivider} />

        <div style={st.welcomeInfoGrid}>
          <div style={st.welcomeInfoBox}>
            <span style={st.infoIcon}>⏱️</span>
            <span style={st.infoLabel}>30s per<br/>question</span>
          </div>
          <div style={st.welcomeInfoBox}>
            <span style={st.infoIcon}>🧮</span>
            <span style={st.infoLabel}>45s per<br/>math challenge</span>
          </div>
          <div style={st.welcomeInfoBox}>
            <span style={st.infoIcon}>🎯</span>
            <span style={st.infoLabel}>12 categories<br/>60 questions</span>
          </div>
        </div>

        <p style={st.welcomeNote}>
          ⚠️ Questions are <b>timed</b>. If time runs out, the question will be skipped automatically.
          Trust your first instinct — don't overthink!
        </p>

        <button style={st.startBtn} onClick={onStart}>
          Begin My Journey →
        </button>

        <button
          style={st.replayBtn}
          onClick={speakWelcome}
          title="Replay welcome message"
        >
          🔊 Replay Welcome
        </button>
      </div>
    </div>
  );
}

// ─── MAIN QUIZ ────────────────────────────────────────────────────────────────
export default function Quiz() {
  const [screen, setScreen] = useState("welcome"); // "welcome" | "profile" | "quiz" | "results"
  const [student, setStudent] = useState(null);

  const questionsData = useMemo(() => buildActiveQuestions(), []);
  const mathQuestions = useMemo(() => pickMathQuestions(),    []);

  const [answers,       setAnswers]       = useState({});
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [showMath,     setShowMath]     = useState(false);
  const [mathIndex,    setMathIndex]    = useState(0);
  const [mathAnswer,   setMathAnswer]   = useState("");
  const [mathCorrect,  setMathCorrect]  = useState(0);
  const [mathLog,      setMathLog]      = useState([]);
  const [mathTimedOut, setMathTimedOut] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect,    setIsCorrect]    = useState(false);

  const [streamScores, setStreamScores] = useState(null);
  const [mathResults,  setMathResults]  = useState(null);

  // ── TIMER STATE ─────────────────────────────────────────────────────────────
  const [timeLeft,  setTimeLeft]  = useState(ATTITUDE_TIME);
  const timerRef = useRef(null);

  // Total questions for progress
  const totalQ   = questionsData.reduce((s, c) => s + c.questions.length, 0);
  const answered = Object.keys(answers).length;
  const progress = Math.min(100, Math.round((answered / totalQ) * 100));

  const curCat   = questionsData[categoryIndex];
  const curQ     = curCat?.questions[questionIndex];
  const curMathQ = mathQuestions[mathIndex];

  // ── FORWARD DECLARATIONS (needed in timer callback) ─────────────────────────
  const handleAnswerRef  = useRef(null);
  const submitMathRef    = useRef(null);
  const finaliseRef      = useRef(null);
  const mathPendingRef   = useRef({ score:0, log:[], to:[] }); // stores math results when challenge runs mid-quiz

  // ── TIMER RESET HELPER ───────────────────────────────────────────────────────
  const resetTimer = useCallback((seconds) => {
    clearInterval(timerRef.current);
    setTimeLeft(seconds);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // ── AUTO-ADVANCE WHEN TIMER HITS 0 ──────────────────────────────────────────
  useEffect(() => {
    if (screen !== "quiz") return;
    if (timeLeft !== 0) return;
    if (showFeedback) return;

    if (showMath) {
      // Math timed out — mark as wrong + timed out
      const isRight  = false;
      const newLog   = [...mathLog, isRight];
      const newTO    = [...mathTimedOut, true];
      setMathLog(newLog);
      setMathTimedOut(newTO);
      setIsCorrect(false);
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        setMathAnswer("");
        if (mathIndex < mathQuestions.length - 1) {
          setMathIndex(i => i + 1);
          resetTimer(MATH_TIME);
        } else {
          if (finaliseRef.current) finaliseRef.current(answers, mathCorrect, newLog, newTO);
        }
      }, 1800);
    } else {
      // Attitude timed out — record "Neutral" and advance
      if (handleAnswerRef.current) handleAnswerRef.current("Neutral", true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, screen, showFeedback, showMath]);

  // Reset timer when question changes
  useEffect(() => {
    if (screen !== "quiz") return;
    if (showFeedback) return;
    resetTimer(showMath ? MATH_TIME : ATTITUDE_TIME);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIndex, questionIndex, mathIndex, showMath, screen]);

  // Stop timer during feedback
  useEffect(() => {
    if (showFeedback) clearInterval(timerRef.current);
  }, [showFeedback]);

  // Cleanup on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── FINALISE ─────────────────────────────────────────────────────────────────
  const finalise = useCallback(async (finalAnswers, mathScore, wasCorrectLog, timedOutLog) => {
    clearInterval(timerRef.current);
    const scores  = calculateStreamScores(finalAnswers, questionsData, mathScore, wasCorrectLog.length);
    const mResult = wasCorrectLog.length > 0
      ? { correct: mathScore, total: mathQuestions.length, questions: mathQuestions, wasCorrect: wasCorrectLog, timedOut: timedOutLog }
      : null;
    try {
      const grouped = {};
      Object.keys(finalAnswers).forEach(key => {
        const [cat] = key.split("-");
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(finalAnswers[key]);
      });
      await axios.post("http://127.0.0.1:5000/api/submit-quiz", { answers: grouped });
    } catch (_) {}
    setStreamScores(scores);
    setMathResults(mResult);
    setScreen("results");
  }, [questionsData, mathQuestions]);

  finaliseRef.current = finalise;

  // ── HANDLE ATTITUDE ANSWER ────────────────────────────────────────────────────
  const handleAnswer = useCallback((option, wasTimeout = false) => {
    clearInterval(timerRef.current);

    if (!curCat) { finalise(answers, 0, [], []); return; }

    const key        = `${curCat.category}-${questionIndex}`;
    const newAnswers = { ...answers, [key]: option };
    setAnswers(newAnswers);

    const isLastQ    = questionIndex >= curCat.questions.length - 1;
    const isLastCat  = categoryIndex >= questionsData.length - 1;
    const isMathsCat = curCat.category === "Maths Aptitude & Interest";

    if (!isLastQ) {
      setQuestionIndex(qi => qi + 1);
    } else if (isMathsCat) {
      const mathAns   = Object.keys(newAnswers).filter(k => k.startsWith("Maths Aptitude")).map(k => newAnswers[k]);
      const likesMath = mathAns.some(a => a === "Agree" || a === "Strongly Agree");
      if (likesMath) {
        setShowMath(true);
      } else if (!isLastCat) {
        setCategoryIndex(ci => ci + 1);
        setQuestionIndex(0);
      } else {
        finalise(newAnswers, 0, [], []);
      }
    } else if (!isLastCat) {
      setCategoryIndex(ci => ci + 1);
      setQuestionIndex(0);
    } else {
      // Use any math results accumulated during the challenge
      const mp = mathPendingRef.current;
      finalise(newAnswers, mp.score, mp.log, mp.to);
    }
  }, [answers, curCat, questionIndex, categoryIndex, questionsData, finalise]);

  handleAnswerRef.current = handleAnswer;

  // ── SUBMIT MATH ANSWER ────────────────────────────────────────────────────────
  const submitMathAnswer = useCallback(() => {
    if (!mathAnswer.trim()) { alert("Please enter an answer."); return; }
    clearInterval(timerRef.current);
    const isRight  = mathAnswer.trim().toLowerCase() === curMathQ.answer.toLowerCase();
    const newCount = mathCorrect + (isRight ? 1 : 0);
    const newLog   = [...mathLog, isRight];
    const newTO    = [...mathTimedOut, false];
    setMathCorrect(newCount);
    setMathLog(newLog);
    setMathTimedOut(newTO);
    setIsCorrect(isRight);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setMathAnswer("");
      if (mathIndex < mathQuestions.length - 1) {
        setMathIndex(i => i + 1);
        resetTimer(MATH_TIME);
      } else {
        // Math challenge done — check if there are more attitude categories left
        // (Maths Aptitude is category index 7, there may be more after it)
        const mathCatIndex = questionsData.findIndex(c => c.category === "Maths Aptitude & Interest");
        const nextCatIndex = mathCatIndex + 1;
        if (nextCatIndex < questionsData.length) {
          setShowMath(false);
          setCategoryIndex(nextCatIndex);
          setQuestionIndex(0);
          // Store math results so finalise has them when quiz truly ends
          // We use a ref trick: pass them via a stored variable
          mathPendingRef.current = { score: newCount, log: newLog, to: newTO };
          resetTimer(ATTITUDE_TIME);
        } else {
          finalise(answers, newCount, newLog, newTO);
        }
      }
    }, 1800);
  }, [mathAnswer, curMathQ, mathCorrect, mathLog, mathTimedOut, mathIndex, mathQuestions, answers, finalise, resetTimer]);

  submitMathRef.current = submitMathAnswer;

  // ── START QUIZ ────────────────────────────────────────────────────────────────
  const goToProfile = () => {
    window.speechSynthesis.cancel();
    setScreen("profile");
  };

  const startQuiz = (studentData) => {
    setStudent(studentData);
    setScreen("quiz");
    resetTimer(ATTITUDE_TIME);
  };

  if (screen === "welcome") return <WelcomeScreen onStart={goToProfile} />;
  if (screen === "profile") return <StudentProfile onComplete={startQuiz} />;
  if (screen === "results") return <EnhancedResults streamScores={streamScores} mathResults={mathResults} student={student} />;

  // ── URGENCY STYLING ────────────────────────────────────────────────────────
  const currentLimit = showMath ? MATH_TIME : ATTITUDE_TIME;
  const isUrgent     = timeLeft <= 10;
  const isWarning    = timeLeft <= 20 && !isUrgent;
  const cardUrgencyStyle = isUrgent
    ? { boxShadow:"0 0 0 3px #fca5a5, 0 8px 40px rgba(220,38,38,.15)" }
    : isWarning
    ? { boxShadow:"0 0 0 3px #fcd34d, 0 8px 40px rgba(217,119,6,.10)" }
    : {};

  return (
    <div style={st.wrap}>
      <div style={{ ...st.card, ...cardUrgencyStyle }}>

        <div style={st.header}>
          <h1 style={st.appTitle}>🎓 STABLYM Stream Selector</h1>
          <p style={st.subtitle}>Grade 10 Stream &amp; Career Guidance</p>
        </div>

        {/* Progress + Timer row */}
        <div style={st.topRow}>
          <div style={{ flex:1 }}>
            <div style={st.progressTrack}>
              <div style={{ ...st.progressFill, width:`${progress}%` }} />
            </div>
            <span style={st.progressLabel}>{progress}% complete</span>
          </div>
          <CountdownRing timeLeft={timeLeft} totalTime={currentLimit} />
        </div>

        {isUrgent && !showFeedback && (
          <div style={st.urgentBanner}>
            ⚡ Time is almost up! Answer quickly or it will be skipped.
          </div>
        )}

        {showMath ? (
          <div style={st.mathWrap}>
            <div style={st.categoryBadge}>🧮 Math Challenge</div>
            <div style={st.mathMeta}>
              <span style={{ fontSize:14, color:"#6b7280" }}>Question {mathIndex+1} of {mathQuestions.length}</span>
              <span style={{ ...st.diffBadge, background: DIFF_COLOR[curMathQ.difficulty] }}>{curMathQ.difficulty}</span>
              <span style={st.topicTag}>{curMathQ.topic}</span>
            </div>
            <p style={st.question}>{curMathQ.question}</p>
            {!showFeedback ? (
              <div style={st.mathInputRow}>
                <input
                  style={st.mathInput}
                  type="text"
                  value={mathAnswer}
                  onChange={e => setMathAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submitMathAnswer()}
                  placeholder="Type your answer..."
                  autoFocus
                />
                <button style={st.submitBtn} onClick={submitMathAnswer}>Submit →</button>
              </div>
            ) : (
              <div style={{ ...st.feedback, background: isCorrect ? "#d1fae5" : timeLeft === 0 ? "#f1f5f9" : "#fee2e2" }}>
                <p style={{ fontSize:40, margin:0 }}>{isCorrect ? "✅" : timeLeft === 0 ? "⏱️" : "❌"}</p>
                <p style={{ fontWeight:700, fontSize:18, margin:"8px 0 4px" }}>
                  {isCorrect ? "Correct!" : timeLeft === 0 ? "Time's up!" : "Incorrect"}
                </p>
                {!isCorrect && <p style={{ color:"#991b1b", margin:0 }}>Answer: <b>{curMathQ.answer}</b></p>}
              </div>
            )}
            <div style={st.mathScoreBar}>
              <span style={{ color:"#16a34a" }}>✔ {mathCorrect} correct</span>
              <span style={{ color:"#94a3b8" }}>·</span>
              <span style={{ color:"#dc2626" }}>✘ {mathIndex - mathCorrect + (showFeedback ? 1 : 0)} incorrect</span>
            </div>
          </div>
        ) : (
          <div>
            <div style={st.categoryBadge}>
              {curCat.category}
              <span style={st.catNum}> — Category {categoryIndex+1} of {questionsData.length}</span>
            </div>
            <p style={st.questionNum}>Question {questionIndex+1} of {curCat.questions.length}</p>
            <p style={st.question}>{curQ}</p>
            <div style={st.optionsGrid}>
              {OPTIONS.map(opt => {
                const sel = answers[`${curCat.category}-${questionIndex}`] === opt;
                return (
                  <button
                    key={opt}
                    style={{ ...st.optionBtn, ...(sel ? st.optionSelected : {}) }}
                    onClick={() => handleAnswer(opt)}
                  >{opt}</button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const st = {
  // Welcome
  welcomeWrap:     { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)", padding:"24px 16px", position:"relative", overflow:"hidden", fontFamily:"'Segoe UI',sans-serif" },
  orb1:            { position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.35) 0%,transparent 70%)", top:"-100px", left:"-100px", animation:"pulse 6s ease-in-out infinite" },
  orb2:            { position:"absolute", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(37,99,235,.3) 0%,transparent 70%)", bottom:"-80px", right:"-80px", animation:"pulse 8s ease-in-out infinite reverse" },
  orb3:            { position:"absolute", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.25) 0%,transparent 70%)", top:"40%", right:"10%", animation:"pulse 5s ease-in-out infinite" },
  welcomeCard:     { background:"rgba(255,255,255,.07)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,.15)", borderRadius:28, padding:"48px 44px", maxWidth:520, width:"100%", textAlign:"center", position:"relative", zIndex:1 },
  logoRing:        { fontSize:64, marginBottom:8, display:"block" },
  welcomeTitle:    { fontSize:44, fontWeight:900, color:"#fff", letterSpacing:6, margin:"0 0 4px", fontFamily:"'Segoe UI',sans-serif" },
  welcomeSub:      { fontSize:17, color:"rgba(255,255,255,.65)", margin:"0 0 24px", letterSpacing:1, fontWeight:400 },
  welcomeTagline:  { fontSize:16, color:"rgba(255,255,255,.85)", lineHeight:1.7, margin:"0 0 24px", fontStyle:"italic" },
  welcomeDivider:  { height:1, background:"rgba(255,255,255,.15)", margin:"0 0 24px" },
  welcomeInfoGrid: { display:"flex", justifyContent:"center", gap:16, marginBottom:24, flexWrap:"wrap" },
  welcomeInfoBox:  { background:"rgba(255,255,255,.08)", borderRadius:14, padding:"14px 18px", display:"flex", flexDirection:"column", alignItems:"center", gap:6, minWidth:90 },
  infoIcon:        { fontSize:24 },
  infoLabel:       { fontSize:12, color:"rgba(255,255,255,.7)", lineHeight:1.4, textAlign:"center" },
  welcomeNote:     { fontSize:13, color:"rgba(255,255,255,.55)", lineHeight:1.6, marginBottom:28, padding:"12px 16px", background:"rgba(255,255,255,.05)", borderRadius:10, border:"1px solid rgba(255,255,255,.1)" },
  startBtn:        { width:"100%", padding:"16px", background:"linear-gradient(135deg,#6366f1,#2563eb)", color:"#fff", border:"none", borderRadius:14, fontSize:17, fontWeight:800, cursor:"pointer", letterSpacing:0.5, marginBottom:10 },
  replayBtn:       { background:"transparent", border:"1px solid rgba(255,255,255,.25)", color:"rgba(255,255,255,.6)", padding:"8px 18px", borderRadius:99, fontSize:13, cursor:"pointer" },
  // Quiz
  wrap:            { minHeight:"100vh", background:"#f0f4ff", display:"flex", justifyContent:"center", alignItems:"flex-start", padding:"32px 16px", fontFamily:"'Segoe UI',sans-serif" },
  card:            { background:"#fff", borderRadius:20, boxShadow:"0 8px 40px rgba(0,0,0,.10)", padding:"36px 40px", maxWidth:640, width:"100%", transition:"box-shadow .3s" },
  header:          { textAlign:"center", marginBottom:24 },
  appTitle:        { fontSize:24, fontWeight:800, color:"#1e293b", margin:0 },
  subtitle:        { color:"#64748b", fontSize:14, marginTop:4 },
  topRow:          { display:"flex", alignItems:"center", gap:16, marginBottom:20 },
  progressTrack:   { height:8, background:"#e2e8f0", borderRadius:99, overflow:"hidden" },
  progressFill:    { height:"100%", background:"linear-gradient(90deg,#6366f1,#2563eb)", borderRadius:99, transition:"width .4s ease" },
  progressLabel:   { fontSize:12, color:"#94a3b8", marginTop:4, display:"block" },
  urgentBanner:    { background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:10, padding:"10px 14px", marginBottom:16, color:"#991b1b", fontSize:13, fontWeight:600, textAlign:"center" },
  categoryBadge:   { display:"inline-block", background:"#eff6ff", color:"#2563eb", borderRadius:99, padding:"6px 16px", fontSize:14, fontWeight:700, marginBottom:8 },
  catNum:          { fontWeight:400, color:"#6b7280" },
  questionNum:     { fontSize:12, color:"#9ca3af", margin:"0 0 12px" },
  question:        { fontSize:20, fontWeight:600, color:"#1e293b", lineHeight:1.5, marginBottom:28 },
  optionsGrid:     { display:"flex", flexDirection:"column", gap:10 },
  optionBtn:       { padding:"14px 20px", borderRadius:12, border:"2px solid #e2e8f0", background:"#f8fafc", fontSize:15, fontWeight:500, color:"#374151", cursor:"pointer", textAlign:"left", transition:"all .15s" },
  optionSelected:  { background:"#eff6ff", borderColor:"#2563eb", color:"#2563eb" },
  mathWrap:        { textAlign:"center" },
  mathMeta:        { display:"flex", justifyContent:"center", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap" },
  diffBadge:       { color:"#fff", borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:700 },
  topicTag:        { background:"#f1f5f9", color:"#475569", borderRadius:99, padding:"3px 10px", fontSize:12, fontWeight:600 },
  mathInputRow:    { display:"flex", gap:10, marginTop:16 },
  mathInput:       { flex:1, padding:"12px 16px", border:"2px solid #e2e8f0", borderRadius:12, fontSize:16, outline:"none" },
  submitBtn:       { padding:"12px 24px", background:"#2563eb", color:"#fff", border:"none", borderRadius:12, fontWeight:700, cursor:"pointer", fontSize:15 },
  feedback:        { borderRadius:16, padding:"24px", marginTop:16, textAlign:"center" },
  mathScoreBar:    { display:"flex", justifyContent:"center", gap:12, marginTop:16, fontSize:14, fontWeight:600 },
};
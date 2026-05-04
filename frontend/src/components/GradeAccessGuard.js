// ═══════════════════════════════════════════════════════════════════════════
// STABLYM — GradeAccessGuard.js
//
// These are re-exported from SubscriptionGate.js for convenience.
// You can import directly from SubscriptionGate.js instead if you prefer.
//
// USAGE:
//   import { GradeAccessGuard, FeatureGuard, QuizLimitGuard, UpgradeBanner } from "./GradeAccessGuard";
//
// ── GRADE GATE: block Grade 10+ for free users ────────────────────────────
//   <GradeAccessGuard grade={10}>
//     <EnhancedResults />
//   </GradeAccessGuard>
//
// ── FEATURE GATE: block APS Calculator for free users ────────────────────
//   <FeatureGuard feature="apsCalc">
//     <APSCalculator />
//   </FeatureGuard>
//
//   Available feature keys:
//     "apsCalc"             — APS Calculator
//     "universities"        — University Finder
//     "pdfDownload"         — PDF report download
//     "teacherPortal"       — Teacher Portal (school plans)
//     "uniPartner"          — University Partner dashboard
//     "uniPartnerFeatured"  — Featured University placement
//
// ── QUIZ LIMIT GATE: block when daily quota hit ───────────────────────────
//   <QuizLimitGuard>
//     <QuizStartButton />
//   </QuizLimitGuard>
//
// ── INLINE UPGRADE PROMPT: show inside any component ─────────────────────
//   <UpgradeBanner reason="Download your full results as a PDF report" />
//
// ── IN CODE: check access without rendering a gate ───────────────────────
//   const { canAccessGrade, canDoQuiz, recordQuiz, planLimits } = useSubscription();
//
//   if (!canAccessGrade(12)) { navigate("/upgrade"); return; }
//
//   const startQuiz = () => {
//     if (!canDoQuiz()) { setShowLimit(true); return; }
//     recordQuiz();  // ← call this when quiz actually starts
//     // ... rest of quiz logic
//   };
//
// ── PAYFAST PAYMENT: trigger from anywhere ───────────────────────────────
//   const { pay } = useSubscription();
//   <button onClick={() => pay("premium_monthly")}>Upgrade to Premium</button>
//
//   Valid plan IDs:
//     "premium_monthly" "premium_annual" "parent"
//     "school_starter"  "school_standard" "school_pro"
//     "uni_listed"      "uni_featured"
// ═══════════════════════════════════════════════════════════════════════════

export {
  GradeAccessGuard,
  FeatureGuard,
  QuizLimitGuard,
  UpgradeBanner,
  useSubscription,
} from "./SubscriptionGate";

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION EXAMPLES
// ─────────────────────────────────────────────────────────────────────────────

// ── index.js  (wrap your entire app) ─────────────────────────────────────────
/*
import React from "react";
import ReactDOM from "react-dom/client";
import SubscriptionGate from "./components/SubscriptionGate";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SubscriptionGate>
      <App />
    </SubscriptionGate>
  </React.StrictMode>
);
*/

// ── EnhancedResults.js  (gate tabs) ──────────────────────────────────────────
/*
import { FeatureGuard, UpgradeBanner, useSubscription } from "./GradeAccessGuard";

function EnhancedResults({ student }) {
  const { planLimits, pay } = useSubscription();

  return (
    <div>
      {activeTab === "aps" && (
        <FeatureGuard feature="apsCalc">
          <APSCalculator />
        </FeatureGuard>
      )}

      {activeTab === "universities" && (
        <FeatureGuard feature="universities">
          <UniversityFinder />
        </FeatureGuard>
      )}

      {planLimits.pdfDownload
        ? <button onClick={downloadPDF}>⬇ Download PDF</button>
        : <UpgradeBanner reason="Download your full results as a PDF report" />
      }
    </div>
  );
}
*/

// ── PastPapersQuiz.js  (gate quiz attempts) ───────────────────────────────────
/*
import { useSubscription } from "./GradeAccessGuard";

function PastPapersQuiz({ grade }) {
  const { canAccessGrade, canDoQuiz, recordQuiz, upgradePlan } = useSubscription();

  // Check grade access first
  if (!canAccessGrade(grade)) {
    return <GradeAccessGuard grade={grade}>{null}</GradeAccessGuard>;
  }

  const handleStart = (subject) => {
    if (!canDoQuiz()) {
      setScreen("limitReached");  // show <QuizLimitGuard> at this screen
      return;
    }
    recordQuiz();  // increment the count
    // ... start the quiz
  };

  return <QuizUI onStart={handleStart} />;
}
*/

// ── StudentProfile.js  (check before proceeding) ─────────────────────────────
/*
import { useSubscription } from "./GradeAccessGuard";

function StudentProfile({ student }) {
  const { canAccessGrade, pay } = useSubscription();
  const grade = parseInt(student.grade);

  if (!canAccessGrade(grade)) {
    return (
      <div style={{ textAlign:"center", padding:32 }}>
        <p>Grade {grade} requires Premium access.</p>
        <button onClick={() => pay("premium_monthly")}>Upgrade to Premium — R49/month</button>
      </div>
    );
  }

  // ... render full profile
}
*/
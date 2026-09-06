import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Lightbulb,
  Target,
  TrendingUp,
  UserRound,
  AlertTriangle,
  BookOpen,
  Sparkles,
  CircleCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useInterview } from "../../features/hooks/InterviewHook";

/* =========================================================
   HELPER / ATOMIC COMPONENTS
========================================================= */

const SummaryRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-1.5 text-xs">
    <div className="flex items-center gap-2 text-slate-600">
      <span className="text-slate-400">{icon}</span>
      <span>{label}</span>
    </div>

    <span className="font-semibold text-slate-800">{value}</span>
  </div>
);

/* =========================================================
   DETAIL BLOCK
========================================================= */

const DetailBlock = ({ label, text, icon }) => (
  <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      <span className="text-indigo-600">{icon}</span>
      <span>{label}</span>
    </div>

    <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
      {text || "No information available."}
    </p>
  </div>
);

/* =========================================================
   OVERVIEW CARD
========================================================= */

const OverviewCard = ({ icon, title, items, warning }) => (
  <div
    className={`rounded-xl border p-4 ${
      warning
        ? "border-amber-200 bg-amber-50/30"
        : "border-indigo-100 bg-indigo-50/20"
    }`}
  >
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-lg ${
          warning
            ? "bg-amber-100 text-amber-700"
            : "bg-indigo-100 text-indigo-600"
        }`}
      >
        {icon}
      </div>

      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
        {title}
      </h4>
    </div>

    <ul className="mt-3 space-y-1.5">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-2 text-xs text-slate-700"
        >
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              warning ? "bg-amber-500" : "bg-indigo-500"
            }`}
          />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* =========================================================
   QUICK ACTION
========================================================= */

const QuickAction = ({ icon, title, text, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex cursor-pointer flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/40 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/30"
  >
    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
      {icon}
    </div>

    <div className="mt-2.5">
      <p className="text-xs font-semibold text-slate-800">{title}</p>

      <p className="mt-0.5 text-[10px] text-slate-500">{text}</p>
    </div>
  </button>
);

/* =========================================================
   SKILL CARD
========================================================= */

const SkillCard = ({ skill, severity, reason, recommendation }) => {
  const getSeverityBadge = (level) => {
    switch (level) {
      case "high":
        return "border-red-200 bg-red-50 text-red-700";

      case "medium":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "low":
      default:
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold text-slate-800">
          {skill || "Unknown skill"}
        </h3>

        <span
          className={`rounded-full border px-2 py-0.5 text-[9px] font-medium capitalize ${getSeverityBadge(
            severity,
          )}`}
        >
          {severity || "low"} gap
        </span>
      </div>

      <div className="mt-2 grid gap-2.5 md:grid-cols-2">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            Identified gap
          </p>

          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            {reason || "No reason provided."}
          </p>
        </div>

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-indigo-600">
            Action item
          </p>

          <p className="mt-0.5 text-xs leading-relaxed text-slate-600">
            {recommendation || "No recommendation provided."}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   OVERVIEW CONTENT
========================================================= */

const OverviewContent = ({ report, setActiveSection }) => {
  const technicalQuestions = report?.technicalQuestions || [];
  const behavioralQuestions = report?.behavioralQuestions || [];
  const skillsGap = report?.skillsGap || [];

  const strongAreas = skillsGap
    .filter((item) => item.severity === "low")
    .map((item) => item.skill)
    .filter(Boolean);

  const focusAreas = skillsGap
    .filter((item) => item.severity === "high" || item.severity === "medium")
    .map((item) => item.skill)
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {/* AI SUMMARY */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Sparkles size={16} />
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-600">
              AI assessment
            </p>

            <h3 className="mt-0.5 text-xs font-semibold text-slate-800">
              Your personalized interview assessment
            </h3>

            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-600">
              Your profile has been analyzed against the target job description.
              Review the questions, skill gaps and preparation plan to improve
              your interview readiness.
            </p>
          </div>
        </div>
      </div>

      {/* AREAS */}

      <div className="grid gap-3 md:grid-cols-2">
        <OverviewCard
          icon={<Award size={15} />}
          title="Strong areas"
          items={
            strongAreas.length > 0
              ? strongAreas
              : ["No major strengths identified."]
          }
        />

        <OverviewCard
          icon={<AlertTriangle size={15} />}
          title="Focus areas"
          items={
            focusAreas.length > 0
              ? focusAreas
              : ["No major skill gaps identified."]
          }
          warning
        />
      </div>

      {/* QUICK ACTIONS */}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Continue preparation
        </p>

        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-3">
          <QuickAction
            icon={<BrainCircuit size={15} />}
            title="Technical"
            text="Practice likely questions"
            onClick={() => setActiveSection("technical")}
          />

          <QuickAction
            icon={<Target size={15} />}
            title="Skills"
            text="Close your biggest gaps"
            onClick={() => setActiveSection("skills")}
          />

          <QuickAction
            icon={<BookOpen size={15} />}
            title="Preparation"
            text="Follow your preparation plan"
            onClick={() => setActiveSection("plan")}
          />
        </div>
      </div>

      {/* REPORT METRICS */}

      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveSection("technical")}
          className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-200"
        >
          <BrainCircuit size={15} className="text-indigo-600" />

          <p className="mt-2 text-lg font-bold text-slate-900">
            {technicalQuestions.length}
          </p>

          <p className="text-[10px] text-slate-500">Technical questions</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("behavioral")}
          className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-violet-200"
        >
          <UserRound size={15} className="text-violet-600" />

          <p className="mt-2 text-lg font-bold text-slate-900">
            {behavioralQuestions.length}
          </p>

          <p className="text-[10px] text-slate-500">Behavioral questions</p>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("skills")}
          className="rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-amber-200"
        >
          <Target size={15} className="text-amber-600" />

          <p className="mt-2 text-lg font-bold text-slate-900">
            {skillsGap.length}
          </p>

          <p className="text-[10px] text-slate-500">Skill gaps</p>
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   TECHNICAL CONTENT
========================================================= */

const TechnicalContent = ({ questions, expanded, setExpanded }) => {
  if (!questions.length) {
    return (
      <EmptyState
        icon={<BrainCircuit size={18} />}
        title="No technical questions"
        text="No technical interview questions were generated for this report."
      />
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
        <div className="flex gap-2.5">
          <Lightbulb size={15} className="mt-0.5 shrink-0 text-indigo-600" />

          <p className="text-xs leading-snug text-slate-600">
            These questions were generated from the requirements of the target
            role and your current profile.
          </p>
        </div>
      </div>

      {questions.map((item, index) => {
        const isOpen = expanded === index;

        return (
          <div
            key={item._id || index}
            className={`rounded-xl border transition ${
              isOpen
                ? "border-indigo-200 bg-indigo-50/10 shadow-2xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : index)}
              className="flex w-full cursor-pointer items-center gap-3 p-3 text-left"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex-1 text-xs font-medium leading-snug text-slate-800">
                {item.question || "Interview question"}
              </span>

              {isOpen ? (
                <ChevronUp size={15} className="text-slate-400" />
              ) : (
                <ChevronDown size={15} className="text-slate-400" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-slate-200/80 p-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <DetailBlock
                    label="What this evaluates"
                    text={item.intention}
                    icon={<Target size={12} />}
                  />

                  <DetailBlock
                    label="Preparation guidance"
                    text={item.answer}
                    icon={<Lightbulb size={12} />}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
   BEHAVIORAL CONTENT
========================================================= */

const BehavioralContent = ({ questions, expanded, setExpanded }) => {
  if (!questions.length) {
    return (
      <EmptyState
        icon={<UserRound size={18} />}
        title="No behavioral questions"
        text="No behavioral questions were generated for this report."
      />
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="rounded-lg border border-violet-100 bg-violet-50/40 p-3">
        <div className="flex gap-2.5">
          <UserRound size={15} className="mt-0.5 shrink-0 text-violet-600" />

          <p className="text-xs leading-snug text-slate-600">
            Behavioral questions focus on communication, collaboration,
            ownership and workplace situations.
          </p>
        </div>
      </div>

      {questions.map((item, index) => {
        const isOpen = expanded === index;

        return (
          <div
            key={item._id || index}
            className={`rounded-xl border transition ${
              isOpen
                ? "border-violet-200 bg-violet-50/10 shadow-2xs"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : index)}
              className="flex w-full cursor-pointer items-center gap-3 p-3 text-left"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex-1 text-xs font-medium leading-snug text-slate-800">
                {item.question || "Behavioral question"}
              </span>

              {isOpen ? (
                <ChevronUp size={15} className="text-slate-400" />
              ) : (
                <ChevronDown size={15} className="text-slate-400" />
              )}
            </button>

            {isOpen && (
              <div className="border-t border-slate-200/80 p-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <DetailBlock
                    label="What this evaluates"
                    text={item.intention}
                    icon={<Target size={12} />}
                  />

                  <DetailBlock
                    label="How to answer"
                    text={item.answer}
                    icon={<Lightbulb size={12} />}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
   SKILLS CONTENT
========================================================= */

const SkillsContent = ({ skills }) => {
  if (!skills.length) {
    return (
      <EmptyState
        icon={<Target size={18} />}
        title="No skill gaps found"
        text="The AI did not identify any significant skill gaps."
      />
    );
  }

  return (
    <div>
      <div className="mb-3 rounded-lg border border-amber-200/80 bg-amber-50/30 p-3">
        <div className="flex gap-2.5">
          <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />

          <p className="text-xs leading-snug text-slate-600">
            These gaps represent areas where additional preparation could
            improve your interview performance.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {skills.map((item, index) => (
          <SkillCard
            key={item._id || index}
            skill={item.skill}
            severity={item.severity}
            reason={item.reason}
            recommendation={item.recommendation}
          />
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   PREPARATION CONTENT
========================================================= */

const PreparationContent = ({ plan }) => {
  if (!plan.length) {
    return (
      <EmptyState
        icon={<BookOpen size={18} />}
        title="No preparation plan"
        text="No preparation roadmap was generated for this report."
      />
    );
  }

  return (
    <div>
      <div className="mb-3 rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
        <div className="flex gap-2.5">
          <Clock3 size={15} className="mt-0.5 shrink-0 text-indigo-600" />

          <p className="text-xs leading-snug text-slate-600">
            Follow this plan in order. It prioritizes the areas that will have
            the biggest impact on your interview readiness.
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {plan.map((item, index) => (
          <div
            key={item._id || index}
            className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
          >
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-700">
                {item.day}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-semibold text-slate-800">
                  {item.focus}
                </h3>

                <div className="mt-2.5 grid gap-1.5">
                  {(item.tasks || []).map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="flex items-center gap-2 rounded-md border border-slate-100 bg-slate-50/60 px-2.5 py-1.5 text-xs text-slate-700"
                    >
                      <CheckCircle2
                        size={12}
                        className="shrink-0 text-indigo-600"
                      />

                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   EMPTY STATE
========================================================= */

const EmptyState = ({ icon, title, text }) => {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">{title}</h3>

      <p className="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
        {text}
      </p>
    </div>
  );
};

/* =========================================================
   LOADING STATE
========================================================= */

const LoadingReport = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-slate-50 px-5">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <BrainCircuit size={22} className="animate-pulse" />
        </div>

        <h2 className="mt-4 text-sm font-semibold text-slate-800">
          Loading interview report
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Preparing your personalized AI analysis...
        </p>
      </div>
    </main>
  );
};

/* =========================================================
   ERROR STATE
========================================================= */

const ErrorReport = ({ message, onBack }) => {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-slate-50 px-5">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
          <AlertTriangle size={20} />
        </div>

        <h2 className="mt-4 text-sm font-semibold text-slate-900">
          Unable to load report
        </h2>

        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          {message}
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
        >
          <ArrowLeft size={13} />
          Back
        </button>
      </div>
    </main>
  );
};

/* =========================================================
   MAIN INTERVIEW COMPONENT
========================================================= */

const Interview = () => {
  const navigate = useNavigate();

  /*
   * The interview ID comes directly from:
   *
   * /interview/:interviewId
   *
   * This makes the URL the source of truth.
   */
  const { interviewId } = useParams();

  const { report, loading, handleGetInterviewReportById } = useInterview();

  const [activeSection, setActiveSection] = useState("overview");

  const [expandedTechnical, setExpandedTechnical] = useState(null);

  const [expandedBehavioral, setExpandedBehavioral] = useState(null);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD REPORT
  ========================================================= */

  useEffect(() => {
    if (!interviewId) {
      setError("Interview report ID is missing.");
      return;
    }

    let isMounted = true;

    const loadReport = async () => {
      try {
        setError("");

        await handleGetInterviewReportById(interviewId);
      } catch (error) {
        console.error("Load Interview Report Error:", error);

        if (isMounted) {
          setError(
            error.response?.data?.message ||
              "Unable to load the interview report.",
          );
        }
      }
    };

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [interviewId]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading && !report) {
    return <LoadingReport />;
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !report) {
    return <ErrorReport message={error} onBack={() => navigate("/home")} />;
  }

  /* =========================================================
     REPORT NOT FOUND
  ========================================================= */

  if (!report) {
    return (
      <ErrorReport
        message="The requested interview report could not be found."
        onBack={() => navigate("/home")}
      />
    );
  }

  /* =========================================================
     REPORT DATA
  ========================================================= */

  const technicalQuestions = report.technicalQuestions || [];

  const behavioralQuestions = report.behavioralQuestions || [];

  const skillsGap = report.skillsGap || [];

  const preparationPlan = report.preparationPlan || [];

  const matchScore =
    typeof report.matchScore === "number"
      ? report.matchScore
      : Number(report.matchScore) || 0;

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navigation = [
    {
      id: "overview",
      title: "Overview",
      description: "Your interview readiness",
      icon: <BarChart3 size={16} />,
    },
    {
      id: "technical",
      title: "Technical Questions",
      description: "Technical preparation",
      icon: <BrainCircuit size={16} />,
      count: technicalQuestions.length,
    },
    {
      id: "behavioral",
      title: "Behavioral Questions",
      description: "Communication & behavior",
      icon: <UserRound size={16} />,
      count: behavioralQuestions.length,
    },
    {
      id: "skills",
      title: "Skills Gap",
      description: "Areas to improve",
      icon: <Target size={16} />,
      count: skillsGap.length,
    },
    {
      id: "plan",
      title: "Preparation Plan",
      description: "Your study roadmap",
      icon: <BookOpen size={16} />,
      count: preparationPlan.length,
    },
  ];

  const activeItem = navigation.find((item) => item.id === activeSection);

  /* =========================================================
     HIGHEST PRIORITY SKILL
  ========================================================= */

  const prioritySkill =
    skillsGap.length > 0
      ? [...skillsGap].sort((a, b) => {
          const priority = {
            high: 3,
            medium: 2,
            low: 1,
          };

          return (priority[b.severity] || 0) - (priority[a.severity] || 0);
        })[0]
      : null;

  /* =========================================================
     SCORE LABEL
  ========================================================= */

  const getScoreLabel = (score) => {
    if (score >= 80) {
      return "Strong profile match";
    }

    if (score >= 60) {
      return "Good profile match";
    }

    if (score >= 40) {
      return "Moderate profile match";
    }

    return "Needs improvement";
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <main className="h-screen w-full overflow-hidden bg-slate-50 p-3 text-slate-800 lg:p-4">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-48 -top-48 h-125 w-125 rounded-full bg-linear-to-r from-indigo-100/50 to-violet-100/40 blur-[130px]" />

        <div className="absolute -right-48 top-[15%] h-125 w-125 rounded-full bg-linear-to-r from-violet-100/40 to-indigo-100/40 blur-[130px]" />
      </div>

      <div className="relative mx-auto flex h-full w-full max-w-375 flex-col overflow-hidden">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="flex h-11 shrink-0 items-center justify-between border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-2xs">
              <BrainCircuit size={16} />
            </div>

            <div>
              <p className="text-xs font-semibold leading-none text-slate-900">
                InterviewAI
              </p>

              <p className="text-[9px] text-slate-500">
                Interview intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={13} />
            Back
          </button>
        </header>

        {/* ===================================================
            PAGE TITLE
        ==================================================== */}

        <section className="shrink-0 py-2.5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-600" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-700">
                  AI generated report
                </span>
              </div>

              <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900">
                Interview Report
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[10px] font-medium text-emerald-800">
                  Analysis complete
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            APPLICATION LAYOUT
        ==================================================== */}

        <div className="grid min-h-0 flex-1 items-start gap-3 overflow-hidden xl:grid-cols-[220px_minmax(0,1fr)_250px]">
          {/* =================================================
              LEFT MENU
          ================================================== */}

          <aside className="flex flex-col gap-2.5">
            <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs">
              <p className="px-2.5 pb-1 pt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Report sections
              </p>

              <div className="space-y-0.5">
                {navigation.map((item) => {
                  const active = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition ${
                        active
                          ? "bg-indigo-50 text-indigo-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition ${
                          active
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-slate-100 text-slate-500 group-hover:text-slate-700"
                        }`}
                      >
                        {item.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            className={`truncate text-xs font-medium ${
                              active
                                ? "font-semibold text-indigo-950"
                                : "text-slate-700"
                            }`}
                          >
                            {item.title}
                          </p>

                          {typeof item.count === "number" && (
                            <span
                              className={`text-[9px] font-medium ${
                                active ? "text-indigo-600" : "text-slate-400"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CANDIDATE CARD */}

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <UserRound size={15} />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-800">
                    {report.users?.username || "Candidate profile"}
                  </p>

                  <p className="truncate text-[9px] text-slate-500">
                    {report.users?.email || "Resume analyzed"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* =================================================
              MAIN CONTENT
          ================================================== */}

          <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
            <div className="mb-2 flex shrink-0 items-center justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Current section
                </p>

                <h2 className="text-sm font-semibold text-slate-900">
                  {activeItem?.title}
                </h2>
              </div>

              <div className="hidden items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 shadow-2xs sm:flex">
                <FileText size={12} className="text-slate-400" />

                <span className="text-[10px] text-slate-600">AI analysis</span>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {activeSection === "overview" && (
                <OverviewContent
                  report={report}
                  setActiveSection={setActiveSection}
                />
              )}

              {activeSection === "technical" && (
                <TechnicalContent
                  questions={technicalQuestions}
                  expanded={expandedTechnical}
                  setExpanded={setExpandedTechnical}
                />
              )}

              {activeSection === "behavioral" && (
                <BehavioralContent
                  questions={behavioralQuestions}
                  expanded={expandedBehavioral}
                  setExpanded={setExpandedBehavioral}
                />
              )}

              {activeSection === "skills" && (
                <SkillsContent skills={skillsGap} />
              )}

              {activeSection === "plan" && (
                <PreparationContent plan={preparationPlan} />
              )}
            </div>
          </section>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================== */}

          <aside className="flex flex-col gap-2.5">
            {/* MATCH SCORE */}

            <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-linear-to-br from-indigo-50/60 to-violet-50/40 p-4 shadow-2xs">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Match score
                    </p>
                  </div>

                  <TrendingUp size={15} className="text-indigo-600" />
                </div>

                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold leading-none tracking-tight text-slate-900">
                    {matchScore}
                  </span>

                  <span className="mb-0.5 text-xs font-medium text-slate-500">
                    /100
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-indigo-600 to-violet-600 transition-all duration-700"
                    style={{
                      width: `${Math.min(Math.max(matchScore, 0), 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <CircleCheck size={12} className="text-emerald-600" />

                  <span className="text-[10px] font-medium text-emerald-700">
                    {getScoreLabel(matchScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* TARGET ROLE */}

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Target role
              </p>

              <div className="mt-2 flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <BriefcaseBusiness size={14} />
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-3 text-xs font-medium leading-relaxed text-slate-800">
                    {report.jobDescription || "Target role"}
                  </p>

                  <p className="mt-1 text-[9px] text-slate-500">
                    Job description analyzed
                  </p>
                </div>
              </div>
            </div>

            {/* REPORT STATS */}

            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Report summary
              </p>

              <div className="mt-1 space-y-0.5">
                <SummaryRow
                  icon={<BrainCircuit size={13} />}
                  label="Technical questions"
                  value={technicalQuestions.length}
                />

                <SummaryRow
                  icon={<UserRound size={13} />}
                  label="Behavioral questions"
                  value={behavioralQuestions.length}
                />

                <SummaryRow
                  icon={<AlertTriangle size={13} />}
                  label="Skill gaps"
                  value={skillsGap.length}
                />

                <SummaryRow
                  icon={<BookOpen size={13} />}
                  label="Preparation days"
                  value={preparationPlan.length}
                />
              </div>
            </div>

            {/* PRIORITY */}

            {prioritySkill && (
              <div className="rounded-xl border border-red-100 bg-red-50/40 p-3">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle size={13} className="text-red-600" />

                  <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-red-700">
                    Highest priority
                  </p>
                </div>

                <p className="mt-1.5 text-xs font-semibold text-slate-900">
                  {prioritySkill.skill}
                </p>

                <p className="mt-0.5 line-clamp-3 text-[10px] text-slate-600">
                  {prioritySkill.recommendation}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveSection("skills")}
                  className="mt-2 flex cursor-pointer items-center gap-1.5 text-[10px] font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  View skill gap
                  <TrendingUp size={11} />
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Interview;

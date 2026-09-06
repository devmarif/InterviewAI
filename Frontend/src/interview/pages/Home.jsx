import React, { useState } from "react";
import { useInterview } from "../../features/hooks/InterviewHook";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Check,
  FileText,
  Sparkles,
  Target,
  Upload,
  UserRound,
  X,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();

  const { loading, handleGenerateInterviewReport } = useInterview();

  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  /* =========================================================
     RESUME VALIDATION
  ========================================================= */

  const validateResume = (file) => {
    if (!file) {
      toast.error("Please select a resume.");
      return false;
    }

    // Check file type
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF resume.");
      return false;
    }

    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume size must be less than 10 MB.");
      return false;
    }

    return true;
  };

  /* =========================================================
     RESUME FILE CHANGE
  ========================================================= */

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (validateResume(file)) {
      setResume(file);

      toast.success("Resume uploaded successfully.");
    }

    // Reset input so the same file can be selected again
    event.target.value = "";
  };

  /* =========================================================
     DRAG & DROP
  ========================================================= */

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    if (validateResume(file)) {
      setResume(file);

      toast.success("Resume uploaded successfully.");
    }
  };

  /* =========================================================
     REMOVE RESUME
  ========================================================= */

  const removeResume = () => {
    setResume(null);

    toast.success("Resume removed.");
  };

  /* =========================================================
     FORM SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prevent duplicate requests
    if (loading) {
      return;
    }

    /* -------------------------------------------------------
       VALIDATE SELF DESCRIPTION
    ------------------------------------------------------- */

    if (!selfDescription.trim()) {
      toast.error("Please tell us about yourself.");
      return;
    }

    /* -------------------------------------------------------
       VALIDATE JOB DESCRIPTION
    ------------------------------------------------------- */

    if (!jobDescription.trim()) {
      toast.error("Please add the job description.");
      return;
    }

    /* -------------------------------------------------------
       VALIDATE RESUME
    ------------------------------------------------------- */

    if (!resume) {
      toast.error("Please upload your resume.");
      return;
    }

    try {
      /* -----------------------------------------------------
         GENERATE INTERVIEW REPORT
      ----------------------------------------------------- */

      const data = await handleGenerateInterviewReport({
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resumeFile: resume,
      });

      console.log("Interview Report Response:", data);

      /* -----------------------------------------------------
         GET GENERATED REPORT ID
      ----------------------------------------------------- */

      const reportId = data?.interviewReport?._id;

      if (!reportId) {
        toast.error("Report was generated, but the report ID was not found.");

        return;
      }

      /* -----------------------------------------------------
         SUCCESS MESSAGE
      ----------------------------------------------------- */

      toast.success("Interview report generated successfully!");

      /* -----------------------------------------------------
         NAVIGATE TO REPORT PAGE
      ----------------------------------------------------- */

      navigate(`/interview/${reportId}`);
    } catch (error) {
      console.error(
        "Generate Interview Report Error:",
        error.response?.data || error.message,
      );

      toast.error(
        error.response?.data?.message ||
          "Something went wrong while generating your interview report.",
      );
    }
  };

  return (
    <main className="relative min-h-screen bg-slate-50 text-indigo-950 font-sans antialiased">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-125 w-125 rounded-full bg-linear-to-r from-indigo-200/40 to-violet-200/40 blur-[120px]" />

        <div className="absolute -right-40 top-[20%] h-125 w-125 rounded-full bg-linear-to-r from-indigo-100/60 to-violet-100/60 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        {/* ===================================================
            HEADER
        ==================================================== */}

        <header className="flex items-center justify-between border-b border-indigo-100 pb-6">
          {/* LOGO */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
              <BrainCircuit size={20} />
            </div>

            <div>
              <p className="text-base font-extrabold tracking-tight text-indigo-950">
                InterviewAI
              </p>

              <p className="text-xs text-slate-500">AI interview workspace</p>
            </div>
          </div>

          {/* AI STATUS */}

          <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />

            <span className="text-xs font-semibold text-indigo-950">
              AI Online
            </span>
          </div>
        </header>

        {/* ===================================================
            HERO
        ==================================================== */}

        <section className="mx-auto mt-14 max-w-3xl text-center sm:mt-18">
          {/* BADGE */}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100/70 px-4 py-1.5">
            <Sparkles size={14} className="text-indigo-600" />

            <span className="text-xs font-semibold text-indigo-600">
              Personalized AI interview preparation
            </span>
          </div>

          {/* HEADING */}

          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-950 sm:text-5xl lg:text-6xl">
            Turn your resume into{" "}
            <span className="block text-indigo-600">interview confidence.</span>
          </h1>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Upload your resume, describe your experience, and add the job you're
            targeting. InterviewAI will analyze everything and build a
            personalized preparation strategy for you.
          </p>
        </section>

        {/* ===================================================
            PREPARATION INDICATOR
        ==================================================== */}

        <section className="mx-auto mt-12 max-w-4xl">
          <div className="grid grid-cols-3 gap-2 rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
            {/* STEP 1 */}

            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                01
              </span>

              <span className="text-xs font-semibold text-indigo-950">
                Your profile
              </span>
            </div>

            <div className="hidden h-px flex-1 bg-indigo-100 sm:block" />

            {/* STEP 2 */}

            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                02
              </span>

              <span className="text-xs font-semibold text-indigo-950">
                Target role
              </span>
            </div>

            <div className="hidden h-px flex-1 bg-indigo-100 sm:block" />

            {/* STEP 3 */}

            <div className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                03
              </span>

              <span className="text-xs font-semibold text-indigo-950">
                Resume
              </span>
            </div>
          </div>
        </section>

        {/* ===================================================
            WORKSPACE FORM
        ==================================================== */}

        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* =================================================
                PROFILE CARD
            ================================================== */}

            <WorkspaceCard
              number="01"
              icon={<UserRound size={18} />}
              title="Your profile"
              description="Tell AI about your experience."
            >
              <textarea
                value={selfDescription}
                onChange={(event) => setSelfDescription(event.target.value)}
                placeholder="Experience, skills, achievements, career goals..."
                className="mt-5 min-h-50 w-full resize-none border-0 border-b-2 border-indigo-200 bg-transparent py-2.5 text-sm leading-relaxed text-indigo-950 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600"
              />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Professional background
                </span>

                <span className="text-xs font-semibold text-indigo-600">
                  {selfDescription.length}
                </span>
              </div>
            </WorkspaceCard>

            {/* =================================================
                JOB DESCRIPTION CARD
            ================================================== */}

            <WorkspaceCard
              number="02"
              icon={<BriefcaseBusiness size={18} />}
              title="Target role"
              description="Tell AI what you're applying for."
            >
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description, responsibilities and required skills..."
                className="mt-5 min-h-50 w-full resize-none border-0 border-b-2 border-indigo-200 bg-transparent py-2.5 text-sm leading-relaxed text-indigo-950 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600"
              />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Target opportunity
                </span>

                <span className="text-xs font-semibold text-indigo-600">
                  {jobDescription.length}
                </span>
              </div>
            </WorkspaceCard>

            {/* =================================================
                RESUME UPLOAD CARD
            ================================================== */}

            <WorkspaceCard
              number="03"
              icon={<FileText size={18} />}
              title="Resume"
              description="Upload your latest resume."
            >
              {!resume ? (
                <label
                  htmlFor="resume"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`mt-5 flex min-h-50 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 text-center transition-all ${
                    isDragging
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-indigo-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30"
                  }`}
                >
                  {/* UPLOAD ICON */}

                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                    <Upload size={20} />
                  </div>

                  {/* TITLE */}

                  <p className="text-sm font-semibold text-indigo-950">
                    Upload resume
                  </p>

                  {/* DESCRIPTION */}

                  <p className="mt-1 text-xs text-slate-500">
                    Drop PDF here or{" "}
                    <span className="font-semibold text-indigo-600">
                      browse
                    </span>
                  </p>

                  {/* FILE REQUIREMENTS */}

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    PDF · Maximum 10 MB
                  </p>

                  {/* INPUT */}

                  <input
                    id="resume"
                    type="file"
                    accept="application/pdf"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="mt-5 flex min-h-50 flex-col justify-between rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
                  <div>
                    {/* FILE ICON */}

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <FileText size={18} />
                    </div>

                    {/* FILE INFORMATION */}

                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <p className="max-w-47.5 truncate text-sm font-bold text-indigo-950">
                          {resume.name}
                        </p>

                        <Check size={16} className="text-emerald-600" />
                      </div>

                      <p className="mt-1 text-xs text-slate-500">
                        {(resume.size / 1024 / 1024).toFixed(2)} MB · PDF
                      </p>
                    </div>
                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={removeResume}
                    disabled={loading}
                    className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-rose-500 transition-colors hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={14} />
                    Remove resume
                  </button>
                </div>
              )}
            </WorkspaceCard>
          </div>

          {/* =================================================
              AI ANALYSIS SECTION
          ================================================== */}

          <section className="mt-8 overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-sm">
            <div className="grid lg:grid-cols-[0.9fr_1.6fr]">
              {/* LEFT SIDE */}

              <div className="border-b border-indigo-100 bg-indigo-50/30 p-8 lg:border-b-0 lg:border-r">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                  <Sparkles size={18} />
                </div>

                <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  AI analysis
                </p>

                <h2 className="mt-1 text-xl font-extrabold text-indigo-950">
                  What you'll receive
                </h2>

                <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500">
                  Your information will be analyzed together to create a
                  preparation strategy specifically tailored for your target
                  role.
                </p>
              </div>

              {/* RIGHT SIDE */}

              <div className="grid sm:grid-cols-2">
                <AnalysisPreview
                  icon={<Target size={18} />}
                  title="Match analysis"
                  text="See how closely your profile matches the job."
                />

                <AnalysisPreview
                  icon={<BrainCircuit size={18} />}
                  title="Interview questions"
                  text="Get technical and behavioral questions."
                />

                <AnalysisPreview
                  icon={<Zap size={18} />}
                  title="Skill gaps"
                  text="Discover the areas you should improve."
                />

                <AnalysisPreview
                  icon={<Check size={18} />}
                  title="Preparation plan"
                  text="Follow a focused preparation roadmap."
                />
              </div>
            </div>
          </section>

          {/* =================================================
              CTA
          ================================================== */}

          <section className="mt-8 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* CTA CONTENT */}

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <BrainCircuit size={20} />
                </div>

                <div>
                  <p className="text-base font-bold text-indigo-950">
                    Ready to start preparing?
                  </p>

                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
                    InterviewAI will compare your profile with the target role
                    and generate your personalized interview report.
                  </p>
                </div>
              </div>

              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-indigo-50 shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating report...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate interview report
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* =================================================
              SECURITY
          ================================================== */}

          <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />

            <span>Your resume and information are securely protected.</span>
          </div>
        </form>
      </div>
    </main>
  );
};

/* =========================================================
   WORKSPACE CARD
========================================================= */

const WorkspaceCard = ({ number, icon, title, description, children }) => {
  return (
    <section className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start gap-3.5">
        {/* ICON */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          {icon}
        </div>

        {/* CONTENT */}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-indigo-600">
              {number}
            </span>

            <h2 className="text-sm font-bold text-indigo-950">{title}</h2>
          </div>

          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
};

/* =========================================================
   ANALYSIS PREVIEW
========================================================= */

const AnalysisPreview = ({ icon, title, text }) => {
  return (
    <div className="border-b border-indigo-100 p-6 transition-colors hover:bg-indigo-50/20 sm:border-r sm:last:border-r-0">
      {/* ICON */}

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
        {icon}
      </div>

      {/* TITLE */}

      <h3 className="mt-4 text-sm font-bold text-indigo-950">{title}</h3>

      {/* DESCRIPTION */}

      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{text}</p>
    </div>
  );
};

export default Home;

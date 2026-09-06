import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  BrainCircuit,
  MessageSquare,
  Mic,
  BarChart3,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const AuthLayouts = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRegister = location.pathname === "/register";

  return (
    <div className="h-screen overflow-hidden bg-[#eef2ff] text-slate-900">
      {/* NAVBAR */}
      <nav className="h-18 px-5 sm:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
        {/* LOGO */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-3"
        >
          {/* Logo Icon */}
          <div
            className="
              relative
              w-10
              h-10
              rounded-xl
              bg-slate-900
              flex
              items-center
              justify-center
              shadow-sm
              group-hover:scale-105
              transition-transform
            "
          >
            <BrainCircuit size={21} strokeWidth={2} className="text-white" />

            {/* Small indicator */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-[#eef2ff]" />
          </div>

          {/* Brand */}
          <div className="flex flex-col items-start leading-none">
            <span className="text-[17px] font-bold tracking-tight text-slate-900">
              InterviewAI
            </span>

            <span className="text-[10px] text-slate-400 mt-1 tracking-[0.12em] uppercase">
              Smart preparation
            </span>
          </div>
        </button>

        {/* RIGHT ACTION */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-xs text-slate-400">
            {isRegister
              ? "Already preparing with us?"
              : "Ready to improve your interview skills?"}
          </span>

          <button
            onClick={() => navigate(isRegister ? "/" : "/register")}
            className="
              group
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-white
              border
              border-slate-200/80
              text-sm
              font-semibold
              text-slate-700
              shadow-sm
              hover:border-indigo-200
              hover:text-indigo-600
              hover:shadow-md
              transition-all
            "
          >
            {isRegister ? "Sign in" : "Create account"}

            <ArrowUpRight
              size={15}
              className="
                text-slate-400
                group-hover:text-indigo-500
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
                transition-all
              "
            />
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="h-[calc(100vh-72px)] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="h-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT SIDE */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">
              <Sparkles size={16} />

              {isRegister
                ? "Start your AI interview journey"
                : "AI-powered interview preparation"}
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08]">
              {isRegister ? (
                <>
                  Build confidence
                  <span className="block text-indigo-600 mt-2">
                    before your next interview.
                  </span>
                </>
              ) : (
                <>
                  Your next interview
                  <span className="block text-indigo-600 mt-2">
                    starts with practice.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-lg text-slate-500 text-lg leading-8">
              {isRegister
                ? "Create your account and practice realistic interviews with intelligent feedback designed to help you perform at your best."
                : "Practice realistic interviews, receive intelligent feedback, and build the confidence you need to perform at your best."}
            </p>

            {/* AI VISUALIZATION */}
            <div className="mt-8 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white border border-indigo-100 shadow-sm flex items-center justify-center">
                <BrainCircuit size={30} className="text-indigo-600" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MessageSquare size={15} className="text-indigo-500" />
                  Smart Questions
                  <span className="text-xs text-slate-400">AI generated</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mic size={15} className="text-purple-500" />
                  Voice Practice
                  <span className="text-xs text-slate-400">
                    Real interview feel
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <BarChart3 size={15} className="text-emerald-500" />
                  Performance
                  <span className="text-xs text-slate-400">
                    Detailed insights
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center h-full min-h-0">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayouts;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/AuthHook";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { handleRegister, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Form data:", data);

      const response = await handleRegister(
        data.name,
        data.email,
        data.password,
      );

      console.log("REGISTER RESPONSE:", response);

      toast.success(response?.message || "Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message,
      );

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";

      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      {/* HEADER */}
      <div className="mb-6">
        <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 mb-4">
          <ShieldCheck className="text-white" size={22} />
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h2>

        <p className="mt-1.5 text-sm text-slate-500">
          Get started with your free account today.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* NAME */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Full name
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              {...register("name", {
                required: "Name is required",
              })}
              className={`w-full h-12 pl-11 pr-4 rounded-xl bg-white border text-sm outline-none transition placeholder:text-slate-400 ${
                errors.name
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full h-12 pl-11 pr-4 rounded-xl bg-white border text-sm outline-none transition placeholder:text-slate-400 ${
                errors.email
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Password
          </label>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`w-full h-12 pl-11 pr-11 rounded-xl bg-white border text-sm outline-none transition placeholder:text-slate-400 ${
                errors.password
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                  : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              }`}
            />

            {/* EYE BUTTON */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* TERMS */}
        <div>
          <div className="flex items-start gap-2.5">
            <input
              type="checkbox"
              {...register("terms", {
                required: "You must accept the terms",
              })}
              className="mt-1 accent-indigo-600 cursor-pointer"
            />

            <p className="text-xs text-slate-500 leading-5">
              I agree to the{" "}
              <span className="text-indigo-600 font-medium cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-indigo-600 font-medium cursor-pointer">
                Privacy Policy
              </span>
              .
            </p>
          </div>

          {errors.terms && (
            <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>
          )}
        </div>

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="group w-full h-12 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.99] transition shadow-md shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </form>

      {/* LOGIN */}
      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          Login
        </button>
      </p>

      {/* SECURITY */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={14} />
        <span>Your information is securely protected</span>
      </div>
    </section>
  );
};

export default Register;

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/AuthHook";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const { loading, handleLogin } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * Handles login form submission.
   *
   * @param {Object} data - Form data.
   * @param {string} data.email - User's email address.
   * @param {string} data.password - User's password.
   */
  const onSubmit = async (data) => {
    try {
      console.log("FORM DATA:", data);

      const response = await handleLogin(data.email, data.password);

      console.log("LOGIN RESPONSE:", response);

      // Success toast
      toast.success(response?.message || "Login successful! Welcome back.");

      // Navigate to home
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);

      // Get backend error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password. Please try again.";

      // Error toast
      toast.error(errorMessage);
    }
  };

  return (
    <section className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
      {/* =================================================
          LOGIN HEADING
      ================================================== */}

      <div className="mb-9">
        <p className="text-sm font-semibold text-indigo-600 mb-3">
          Welcome back
        </p>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-indigo-950">
          Sign in to continue
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-500 leading-6">
          Continue your interview preparation journey.
        </p>
      </div>

      {/* =================================================
          LOGIN FORM
      ================================================== */}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        {/* =================================================
            EMAIL
        ================================================== */}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-indigo-950 mb-2"
          >
            Email address
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
            />

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className={`w-full pl-8 pr-3 py-3.5 bg-transparent border-0 border-b-2 outline-none text-indigo-950 placeholder:text-slate-400 transition-all ${
                errors.email
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-indigo-200 focus:border-indigo-600"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* =================================================
            PASSWORD
        ================================================== */}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-indigo-950"
            >
              Password
            </label>

            <button
              type="button"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-0 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
            />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full pl-8 pr-10 py-3.5 bg-transparent border-0 border-b-2 outline-none text-indigo-950 placeholder:text-slate-400 transition-all ${
                errors.password
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-indigo-200 focus:border-indigo-600"
              }`}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-700 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-xs font-semibold text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* =================================================
            REMEMBER ME
        ================================================== */}

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-400"
          />

          <span className="text-xs text-slate-500">Keep me signed in</span>
        </label>

        {/* =================================================
            SUBMIT
        ================================================== */}

        <button
          type="submit"
          disabled={loading}
          className="
            group
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-3.5
            px-5
            rounded-xl
            bg-indigo-600
            hover:bg-indigo-700
            disabled:bg-indigo-400
            disabled:cursor-not-allowed
            text-indigo-50
            font-semibold
            text-sm
            transition-all
            duration-200
            shadow-lg
            shadow-indigo-200
            cursor-pointer
          "
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in...
            </>
          ) : (
            <>
              Sign in to InterviewAI
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}
        </button>
      </form>

      {/* =================================================
          SECURITY
      ================================================== */}

      <div className="flex items-center gap-2 mt-7 text-xs text-slate-500">
        <ShieldCheck size={16} className="text-emerald-600" />

        <span>Your account information is securely protected.</span>
      </div>

      {/* =================================================
          REGISTER
      ================================================== */}

      <div className="mt-8 pt-6 border-t border-indigo-100 text-center">
        <p className="text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            Create one
          </button>
        </p>
      </div>
    </section>
  );
};

export default Login;

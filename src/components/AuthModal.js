import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { SpinnerIcon } from "./icons";

export default function AuthModal({ isOpen, onClose, initialMode = "signin" }) {
  const { loginUser, signupUser, forgotPasswordUser } = useAuth();

  const [mode, setMode] = useState(initialMode); // "signin" | "signup" | "forgot"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoResetToken, setDemoResetToken] = useState(""); // Holds simulated token for testing
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError("");
      setSuccessMsg("");
      setDemoResetToken("");
      setShowPassword(false);
      setAgreeTerms(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setDemoResetToken("");

    const { name, email, password, confirmPassword } = formData;

    if (!email) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (mode === "signup" && !name) {
      setError("Name is required");
      return;
    }

    if (mode !== "forgot") {
      if (!password) {
        setError("Password is required");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (!agreeTerms) {
        setError("You must agree to the Terms of Use and Privacy Policy to proceed");
        return;
      }
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        await loginUser(email, password);
        onClose();
      } else if (mode === "signup") {
        await signupUser(name, email, password);
        onClose();
      } else if (mode === "forgot") {
        const res = await forgotPasswordUser(email);
        setSuccessMsg("We sent a password reset token to your email!");
        if (res.resetToken) {
          setDemoResetToken(res.resetToken);
        }
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccessMsg("");
    setDemoResetToken("");
    setShowPassword(false);
    setAgreeTerms(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose}></div>

      {/* Modal card */}
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-10 transition-all duration-300 animate-scale-in text-gray-900 dark:text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {mode === "signin" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-sm mt-1.5 text-gray-500 dark:text-slate-400">
            {mode === "signin" && "Sign in to manage your shortened links"}
            {mode === "signup" && "Join us to unlock branding, QR codes & analytics"}
            {mode === "forgot" && "Enter your email to receive a password reset token"}
          </p>
        </div>

        {/* Form Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 text-sm rounded-xl bg-red-50 border border-red-200 dark:bg-red-950/20 dark:border-red-900/50 text-red-600 dark:text-red-400 animate-fade-in">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form Success Alert */}
        {successMsg && (
          <div className="mb-4 flex flex-col gap-2 p-4 text-sm rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-900/50 text-green-700 dark:text-green-400 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">{successMsg}</span>
            </div>

            {demoResetToken && (
              <div className="mt-2.5 p-3 rounded-lg bg-white dark:bg-slate-950 border border-green-200 dark:border-green-900 flex flex-col items-center gap-2 text-center text-xs text-gray-700 dark:text-slate-300">
                <p className="font-medium">Demo Mode Integration:</p>
                <button
                  onClick={() => {
                    onClose();
                    // Dispatch a custom event or navigate manually
                    window.history.pushState({}, "", `/reset-password?token=${demoResetToken}`);
                    window.dispatchEvent(new Event("popstate"));
                  }}
                  className="w-full px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition-colors"
                >
                  Click Here to Reset Password Now
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field (Sign Up only) */}
          {mode === "signup" && (
            <div className="space-y-1">
              <label htmlFor="name-input" className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  id="name-input"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-google-blue dark:focus:border-blue-500 focus:ring-2 focus:ring-google-blue/20 outline-none transition-all duration-200"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email-input" className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email-input"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-google-blue dark:focus:border-blue-500 focus:ring-2 focus:ring-google-blue/20 outline-none transition-all duration-200"
              />
            </div>
          </div>

          {/* Password Fields */}
          {mode !== "forgot" && (
            <>
              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password-input" className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="text-xs font-semibold text-google-blue dark:text-blue-400 hover:underline focus:outline-none"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password-input"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-google-blue dark:focus:border-blue-500 focus:ring-2 focus:ring-google-blue/20 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              {mode === "signup" && (
                <div className="space-y-1">
                  <label htmlFor="confirmPassword-input" className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                    <input
                      id="confirmPassword-input"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-google-blue dark:focus:border-blue-500 focus:ring-2 focus:ring-google-blue/20 outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Terms and Conditions Checkbox */}
          {mode !== "forgot" && (
            <div className="flex items-end gap-2.5 mt-2 mb-1 animate-fade-in">
              <input
                id="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setError("");
                }}
                className="mt-1 w-4 h-4 text-google-blue border-gray-300 rounded focus:ring-google-blue dark:bg-slate-950 dark:border-slate-800 focus:ring-offset-0 focus:ring-1 cursor-pointer"
              />
              <label htmlFor="agree-terms" className="text-xs text-gray-500 dark:text-slate-400 leading-snug cursor-pointer">
                I have read and agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-google-blue dark:text-blue-400 hover:underline"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-google-blue dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                </a>.
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-google-blue hover:bg-google-blue/90 text-white rounded-xl font-semibold shadow-md active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <SpinnerIcon className="w-5 h-5 text-white" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {mode === "signin" && "Sign In"}
                {mode === "signup" && "Get Started"}
                {mode === "forgot" && "Send Reset Token"}
              </>
            )}
          </button>
        </form>

        {/* Modal Footer Switch Mode */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-sm">
          {mode === "signin" && (
            <p className="text-gray-500 dark:text-slate-400">
              Don't have an account?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="font-semibold text-google-blue dark:text-blue-400 hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p className="text-gray-500 dark:text-slate-400">
              Already have an account?{" "}
              <button
                onClick={() => switchMode("signin")}
                className="font-semibold text-google-blue dark:text-blue-400 hover:underline focus:outline-none"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <button
              onClick={() => switchMode("signin")}
              className="font-semibold text-google-blue dark:text-blue-400 hover:underline focus:outline-none flex items-center justify-center gap-1.5 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

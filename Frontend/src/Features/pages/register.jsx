import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Authuse } from "../Auth/hooks/useAuth";
import { AuthLayout } from "../Auth/components/AuthLayout";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle,  } from "lucide-react";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { loading, handleRegister } = Authuse();

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-neutral-800' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score: 65, label: 'Medium', color: 'bg-yellow-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await handleRegister({ email, password, username });
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Failed to create account. Please try again.");
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join Dexa AI and start automating your local OS workflow"
    >
      {/* Error Alert Message */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start space-x-3 text-sm animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Username Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Username
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-5 h-5 text-neutral-500 transition-colors group-focus-within:text-white" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Vaibhav Marathe"
              required
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/10 transition-all text-sm"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-5 h-5 text-neutral-500 transition-colors group-focus-within:text-white" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full pl-11 pr-4 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/10 transition-all text-sm"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-5 h-5 text-neutral-500 transition-colors group-focus-within:text-white" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              className="w-full pl-11 pr-11 py-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/10 transition-all text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-neutral-500 hover:text-neutral-300 focus:outline-none transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Dynamic Password Strength Indicator */}
          {password && (
            <div className="mt-2.5 space-y-1">
              <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] text-neutral-400">
                <span>Strength: <strong className="text-white">{strength.label}</strong></span>
                <span>Minimum 6 characters</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-lg shadow-white/10 hover:shadow-white/20 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

      </form>

      {/* Switch to Login Link */}
      <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
        <p className="text-neutral-400 text-sm">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-neutral-300 transition-colors underline decoration-white/30 underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>

    </AuthLayout>
  );
};

export default Register;
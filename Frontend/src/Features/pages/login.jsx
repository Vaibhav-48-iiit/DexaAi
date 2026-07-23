import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Authuse } from '../Auth/hooks/useAuth.jsx';
import { AuthLayout } from '../Auth/components/AuthLayout.jsx';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { loading, handlelogin } = Authuse();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await handlelogin({ email, password });
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setErrorMsg(err.response?.data?.message || err.message || "Invalid email or password. Please try again.");
    }
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your Dexa AI environment"
    >
      {/* Error Alert Message */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start space-x-3 text-sm animate-pulse">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Password
            </label>
          </div>
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
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-lg shadow-white/10 hover:shadow-white/20 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In to Dexa</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

      </form>

      {/* Switch to Register Link */}
      <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center">
        <p className="text-neutral-400 text-sm">
          Don't have an account?{' '}
          <Link 
            to="/register" 
            className="font-semibold text-white hover:text-neutral-300 transition-colors underline decoration-white/30 underline-offset-4"
          >
            Create an Account
          </Link>
        </p>
      </div>

    </AuthLayout>
  );
};

export default Login;
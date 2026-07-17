import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { Authuse } from "../Auth/hooks/useAuth"
 
const Register = () => { 
 const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const[username, setUsername] = useState('')

   
  const Navigate = useNavigate()
const { loading, handleRegister } = Authuse();
  const handleSubmit = async(e) => {
    e.preventDefault()
    await handleRegister({email,password,username})
    Navigate("/");
  }
  if(loading) {
    return (<div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        <p className="text-center text-white">Logging in...</p>
      </div>
    </div>)
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome to <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">DexaAi</span>
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">Sign up to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">Username</label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-neutral-400 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 transition">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
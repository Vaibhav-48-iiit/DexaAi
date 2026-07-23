import { useState, useRef, useEffect } from 'react';
import { Bot,  Terminal } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const commands = [
    "Open YouTube...",
    "Play Spotify playlist...",
    "Find my unindexed files...",
    "Search the web for news...",
    "Run system diagnostics..."
  ];
  const [commandIndex, setCommandIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCommandIndex((prev) => (prev + 1) % commands.length);
    }, 3000); // 3 seconds per command (matches fadeInUp duration)
    return () => clearInterval(interval);
  }, [commands.length]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  return (
    <div className="min-h-screen bg-[#090A0F] text-white flex flex-col lg:flex-row overflow-hidden relative font-sans selection:bg-white selection:text-black">

      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-white/5 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-white/5 rounded-full blur-[160px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[40%] right-[30%] w-125 h-125 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Panel - Visual AI Showcase (Visible on Large Screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 z-10 border-r border-neutral-800/50 bg-linear-to-b from-neutral-950/40 to-neutral-900/20 backdrop-blur-3xl">

        {/* Top Header & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/20">
            <Bot className="w-6 h-6 text-black" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight bg-linear-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
              Dexa<span className="text-neutral-500">.AI</span>
            </span>
            <span className="ml-2.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-white/10 text-white border border-white/20 rounded-full">
              Local OS Assistant
            </span>
          </div>
        </div>

        {/* Center AI Voice Assistant Orb & Commands */}
        <div className="relative my-auto flex flex-col items-center justify-center text-center w-full">

          {/* Voice Assistant Particle Orb */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-6 mt-4">
            
            {/* Background ambient glow */}
            <div className="absolute inset-0 rounded-full bg-white/5 blur-3xl animate-pulse-glow" />
            
            {/* 3D Dot Sphere Simulation */}
            <div 
              className="w-48 h-48 rounded-full relative overflow-hidden animate-breathe"
              style={{
                background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.2), rgba(15, 23, 42, 0.9) 75%)',
                boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.8), inset 20px 20px 40px rgba(255,255,255,0.1), 0 0 40px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Rotating Dot Pattern */}
              <div 
                className="absolute inset-[-50%] opacity-60 animate-spin-slow mix-blend-screen"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
                  backgroundSize: '14px 14px',
                  transformOrigin: 'center center'
                }}
              />
              
              {/* Secondary Counter-Rotating Layer for Parallax */}
              <div 
                className="absolute inset-[-50%] opacity-30 animate-spin-reverse-slow mix-blend-screen"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)',
                  backgroundSize: '20px 20px',
                  transformOrigin: 'center center'
                }}
              />
            </div>
            
            {/* Soundwave Ripple Rings */}
            <div className="absolute inset-2 border border-white/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-[-4%] border border-white/5 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />
            <div className="absolute inset-[-10%] border border-white/5 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '2s' }} />
          </div>

          {/* Headline & Dynamic Commands */}
          <div className="mt-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              AI <span className="text-neutral-400">Voice Assistant</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-3 max-w-sm mx-auto leading-relaxed mb-6">
              Powered by local models. Control your PC completely hands-free with natural language.
            </p>
            
            {/* Command Typer Loop */}
            <div className="h-10 flex items-center justify-center overflow-hidden">
              <div className="px-5 py-2 rounded-full bg-neutral-900/60 border border-white/20 backdrop-blur-md text-white font-mono text-xs sm:text-sm inline-flex items-center space-x-2 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                <span className="animate-fade-in-up" key={commandIndex}>"{commands[commandIndex]}"</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-800/60 pt-4">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-neutral-400" />
            <span>v2.4 Local Operating System Suite</span>
          </div>
          <span>Encrypted Local Storage</span>
        </div>

      </div>

      {/* Right Panel - Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <div className="w-full max-w-md">

          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-white/20">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Dexa<span className="text-neutral-500">.AI</span>
            </span>
          </div>

          {/* Main Auth Form Cyber Card */}
          <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="bg-neutral-950/80 backdrop-blur-3xl border border-white/5 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden group"
          >
            {/* Interactive Mouse Spotlight */}
            <div 
              className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-500"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 40%)`
              }}
            />

            {/* Top Accent Neon Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-80" />

            {/* HUD Corner Brackets */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/30 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/30 rounded-br-xl" />

            {/* Vertical Laser Scanline */}
            <div className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white/50 to-transparent opacity-0 z-0 animate-scanline shadow-[0_0_15px_rgba(255,255,255,0.5)] pointer-events-none" />
            
            {/* Form Content Wrapper (elevated above absolute background effects) */}
            <div className="relative z-10">
              {/* Form Title & Subtitle */}
              <div className="mb-8 relative inline-block">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {title}
                </h1>
                {/* Subtle text glow underneath title */}
                <div className="absolute inset-0 bg-white/5 blur-xl -z-10" />
                {subtitle && (
                  <p className="text-neutral-400 text-sm mt-2">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Form Content Passed as Children */}
              {children}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      localStorage.setItem("handbook_auth_active", "true");
      router.push("/onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdfcff] dark:bg-black flex items-center justify-center p-6 relative overflow-hidden transition-colors">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[120px] opacity-60" />
      
      <Link 
        href="/"
        className="absolute top-10 left-10 inline-flex items-center gap-2 text-slate-400 hover:text-[#1d3e8e] transition-colors font-bold text-xs uppercase tracking-widest group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      <div className="w-full max-w-xl relative">
        {/* Main Auth Card */}
        <motion.div 
          layout
          className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 md:p-16 shadow-premium border border-slate-50 dark:border-white/5 relative overflow-hidden"
        >
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1d3e8e] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-100 dark:shadow-none">H</div>
              <span className="text-3xl font-black text-slate-900 dark:text-white display-font tracking-tight">Handbook.</span>
            </Link>
          </div>

          <div className="space-y-10">
            <div className="text-center space-y-3">
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight"
                >
                  {isLogin ? "Welcome Back." : "Start your mission."}
                </motion.h1>
              </AnimatePresence>
              <p className="text-slate-400 font-medium text-sm">
                {isLogin ? "Access your academic stack and track your progress." : "Join thousands of scholars achieving excellence with AI."}
              </p>
            </div>

            {/* Social Auth */}
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    localStorage.setItem("handbook_auth_active", "true");
                    router.push("/onboarding");
                  }, 1200);
                }}
                className="flex items-center justify-center gap-3 bg-white dark:bg-white/5 border-2 border-slate-50 dark:border-white/5 hover:border-[#1d3e8e] dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-white/10 transition-all py-4 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 active:scale-95"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                Continue with Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-500">
                <span className="bg-white dark:bg-zinc-900 px-4">Or use your email</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2"
                >
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1d3e8e] dark:group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Scholar Name"
                      required={!isLogin}
                      className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1d3e8e] dark:group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="name@university.edu"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400">Password</label>
                  {isLogin && <button type="button" className="text-[10px] font-bold text-slate-400 hover:text-[#1d3e8e] dark:hover:text-indigo-400">Forgot?</button>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#1d3e8e] dark:group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] dark:focus:border-indigo-500 focus:bg-white dark:focus:bg-zinc-800 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-[#1d3e8e] text-white py-5 rounded-[1.5rem] font-bold text-sm tracking-widest uppercase shadow-xl shadow-indigo-100 hover:bg-[#152d67] transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-slate-400 hover:text-[#1d3e8e] dark:hover:text-indigo-400 transition-colors"
              >
                {isLogin ? (
                  <>Don't have an account? <span className="text-[#1d3e8e] dark:text-indigo-400">Join the mission</span></>
                ) : (
                  <>Already have an account? <span className="text-[#1d3e8e] dark:text-indigo-400">Sign in</span></>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decorative Floating Card */}
        <div className="hidden lg:block absolute -right-32 top-1/2 -translate-y-1/2 w-64 p-6 bg-[#0f172a] rounded-3xl shadow-2xl rotate-6 z-10 border border-white/10">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Week</div>
              <div className="text-sm font-bold text-white">Academic excellence is curated here.</div>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[65%] animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  Layout, 
  MessageSquare, 
  Settings, 
  Crown,
  Bell,
  Search,
  ChevronRight,
  GraduationCap,
  LogOut,
  CreditCard,
  ChevronDown,
  BarChart3,
  Sparkles,
  Zap,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Practice Arena", href: "/practice", icon: Zap },
  { name: "AI Insights", href: "/ai-insights", icon: Sparkles },
  { name: "AI Tutor", href: "/ai-tutor", icon: MessageSquare },
  { name: "My Subjects", href: "/practice/custom", icon: GraduationCap },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useSubjectSelection();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Overview");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const initials = profile.fullName 
    ? profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "JS";

  useEffect(() => {
    // Check for auth token or simulation
    const auth = localStorage.getItem("handbook_auth_active");
    console.log("Sidebar Auth Status:", auth);
    
    if (auth === "true") {
      setIsAuthorized(true);
    } else {
      console.log("Unauthorized access detected, redirecting to pricing...");
      router.push("/pricing");
    }
  }, [router]);

  if (!isAuthorized) return (
     <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-20">
        <div className="w-12 h-12 border-4 border-indigo-100 dark:border-white/10 border-t-[#1d3e8e] rounded-full animate-spin" />
     </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafb] dark:bg-[#000000]">
      {/* Sidebar */}
      <aside className={`!hidden lg:!flex ${isSidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-black border-r border-slate-100 dark:border-white/10 flex-col fixed h-full z-20 transition-all duration-300`}>
        <div className={`p-8 pb-12 flex ${isSidebarOpen ? 'flex-row items-center justify-between' : 'flex-col items-center gap-4'}`}>
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1d3e8e] rounded-lg flex items-center justify-center text-white font-black text-xl flex-shrink-0">H</div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white display-font leading-none tracking-tight">Handbook</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Academic Curator</span>
              </div>
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-white/10 text-slate-400 hover:text-[#1d3e8e] dark:hover:text-white transition-all"
            aria-label="Toggle Sidebar"
          >
            <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>

        <nav className={`flex-1 ${isSidebarOpen ? 'px-6' : 'px-3'} space-y-2 overflow-y-auto no-scrollbar`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center ${isSidebarOpen ? 'gap-4 px-4' : 'justify-center p-3'} py-3.5 rounded-2xl font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#1d3e8e] text-white shadow-xl shadow-indigo-100/50 scale-[1.02] dark:shadow-none"
                    : "text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
                title={isSidebarOpen ? "" : item.name}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "group-hover:text-[#1d3e8e] dark:group-hover:text-white"}`} />
                {isSidebarOpen && <span className="text-sm">{item.name}</span>}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Card */}
        {isSidebarOpen && (
          <div className="p-6">
            <div className="bg-[#1d3e8e] rounded-3xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors" />
              <div className="relative z-10 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Upgrade to Premium</h4>
                  <p className="text-[10px] text-white/70 leading-relaxed">Unlock all scholarly resources and AI insights.</p>
                </div>
                <Link 
                  href="/pricing"
                  className="block w-full bg-white text-[#1d3e8e] py-3 rounded-xl text-xs font-bold text-center shadow-lg transition-transform active:scale-95"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${isSidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        <header className="h-24 px-10 flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-10 border-b border-transparent dark:border-white/5 transition-colors">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all text-xs font-black uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="hidden lg:flex items-center gap-6 px-6 py-3 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 group focus-within:bg-white dark:focus-within:bg-white/10 transition-all">
              <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#1d3e8e] dark:group-focus-within:text-white" />
              <input 
                type="text" 
                placeholder="Search insights..." 
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 dark:text-white w-64 placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button className="relative p-2.5 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 text-slate-400 hover:text-[#1d3e8e] dark:hover:text-white transition-all hover:shadow-soft">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-black" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-4 pl-4 border-l border-slate-100 dark:border-white/10 hover:opacity-80 transition-all group"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#1d3e8e] dark:group-hover:text-indigo-400 transition-colors font-sans">{profile.fullName || "Julian Sterling"}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.department || "Scholar Plus"}</div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#1d3e8e] p-0.5 shadow-lg shadow-indigo-100 dark:shadow-none rotate-3 group-hover:rotate-0 transition-transform">
                  <div className="w-full h-full rounded-[14px] bg-slate-200 dark:bg-slate-800 overflow-hidden flex items-center justify-center font-black text-xs text-slate-700 dark:text-white">
                    {profile.fullName ? initials : <img src={`https://ui-avatars.com/api/?name=${initials}&background=random`} alt="User" className="w-full h-full object-cover" />}
                  </div>
                </div>

                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-4 w-56 bg-white dark:bg-black rounded-[2rem] shadow-premium border border-slate-50 dark:border-white/10 overflow-hidden z-40 p-2"
                    >
                      <div className="space-y-1">
                        <Link 
                          href="/settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1d3e8e] dark:hover:text-white transition-all"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <Link 
                          href="/pricing"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-[#1d3e8e] dark:hover:text-white transition-all"
                        >
                          <CreditCard className="w-4 h-4" />
                          Plan
                        </Link>
                        <div className="h-px bg-slate-50 dark:bg-white/5 mx-2 my-1" />
                        <Link 
                          href="/"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            localStorage.removeItem("handbook_auth_active");
                          }}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Users } from "lucide-react";

import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-8 flex justify-between items-center bg-white/50 dark:bg-black/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-4 md:gap-16">
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1d3e8e] rounded-lg flex items-center justify-center text-white font-black text-xl">H</div>
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white display-font tracking-tight transition-colors">Handbook</span>
        </Link>
        <div className="hidden lg:flex gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <Link href="/auth" className="hover:text-slate-900 dark:hover:text-white transition-colors">Practice</Link>
          <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
          <Link href="/donate" className="hover:text-slate-900 dark:hover:text-white transition-colors">Donate</Link>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-6">
        <ThemeToggle />
        <Link href="/auth" className="hidden sm:block p-2 text-slate-400 hover:text-[#1d3e8e] dark:hover:text-white transition-colors">
          <Users className="w-5 h-5" />
        </Link>
        <Link href="/auth" className="bg-[#1d3e8e] text-white px-4 md:px-8 py-2 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-[#152d67] transition-all active:scale-95 whitespace-nowrap">
          Join the Mission
        </Link>
      </div>
    </nav>
  );
}

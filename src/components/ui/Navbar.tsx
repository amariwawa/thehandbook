"use client";

import Link from "next/link";
import { Crown } from "lucide-react"; // Using a simple icon
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="w-full bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white py-6 px-10 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 transition-colors">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
        <Crown className="w-6 h-6 text-white" />
        <span>HANDBOOK</span>
      </Link>

      {/* Links */}
      <div className="hidden lg:flex gap-8 text-xs font-bold uppercase text-zinc-400">
        <Link href="/practice" className="hover:text-white transition-colors flex items-center gap-1">PRACTICE <span className="text-[10px]">›</span></Link>
        <Link href="/pricing" className="hover:text-white transition-colors flex items-center gap-1">PRICING <span className="text-[10px]">›</span></Link>
        <Link href="/donate" className="hover:text-white transition-colors flex items-center gap-1">DONATE <span className="text-[10px]">›</span></Link>
        <Link href="/docs" className="hover:text-white transition-colors">DOCS</Link>
        <Link href="/company" className="hover:text-white transition-colors">COMPANY</Link>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-6">
        <ThemeToggle />
        <Link href="/auth" className="bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded font-bold text-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all">
          LOG IN
        </Link>
        <Link href="/auth" className="text-zinc-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-xs font-bold transition-all">
          JOIN MISSION
        </Link>
      </div>
    </nav>
  );
}

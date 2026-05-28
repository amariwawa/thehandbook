"use client";

import Link from "next/link";
import { BarChart3, ArrowRight } from "lucide-react";

export default function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-24">
      <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full flex items-center justify-center">
        <BarChart3 className="w-8 h-8 text-slate-400 dark:text-slate-600" />
      </div>
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-bold display-font text-slate-900 dark:text-white tracking-tight">
          Your Study Velocity is waiting.
        </h3>
        <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
          Attempt your first question to see your stats, accuracy trends, and study time.
        </p>
      </div>
      <Link
        href="/practice"
        className="inline-flex items-center gap-2 bg-indigo-500 text-white px-8 py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
      >
        Enter Practice Arena <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 px-10 max-w-7xl mx-auto border-t border-slate-100 dark:border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
        <div className="md:col-span-1 space-y-8">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1d3e8e] rounded-md flex items-center justify-center text-white font-black text-sm">H</div>
            <span className="text-xl font-black text-slate-900 dark:text-white display-font tracking-tight">Handbook</span>
          </Link>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 leading-relaxed uppercase tracking-wider">
            The premium academic curator for Nigeria's brightest minds. Powered by AI, designed for excellence.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">𝕏</div>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs text-sm font-bold">in</div>
          </div>
        </div>
        
        {[
          { title: "Platform", links: ["AI Assistant", "Exam Prep", "Resources", "Pricing"] },
          { title: "Company", links: ["About Us", "Missions", "Careers", "Contact"] },
          { title: "Legal", links: ["Privacy", "Terms", "Guidelines", "Security"] }
        ].map((col, i) => (
          <div key={i} className="space-y-8">
            <h4 className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">{col.title}</h4>
            <ul className="space-y-4">
              {col.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-[11px] font-bold text-slate-400 hover:text-[#1d3e8e] transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="pt-12 border-t border-slate-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div>© 2024 Handbook Curator. All rights reserved.</div>
        <div className="flex gap-10">
          <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

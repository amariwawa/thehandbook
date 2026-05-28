"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white pt-24 pb-12 px-10 border-t border-zinc-100 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-1 space-y-8">
            <Link href="/" className="group flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-500 rounded-md flex items-center justify-center text-white font-black text-sm">H</div>
              <span className="text-xl font-black text-slate-900 dark:text-white display-font tracking-tight">Handbook</span>
            </Link>
            <p className="text-xs font-semibold text-zinc-500 leading-relaxed uppercase tracking-wider">
              The premium academic curator for Nigeria's brightest minds. Powered by AI, designed for excellence.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-500 text-xs transition-colors">𝕏</div>
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-500 text-xs text-sm font-bold transition-colors">in</div>
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
                {col.links.map((link) => {
                  const href = link === "About Us" ? "/company" : "#";
                  return (
                    <li key={link}>
                      <Link href={href} className="text-[11px] font-bold text-zinc-500 hover:text-indigo-500 transition-colors">{link}</Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-12 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div>© 2024 Handbook Curator. All rights reserved.</div>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { Book, Search, ArrowRight, Zap, Brain, FileText, Terminal, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className={`min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white ${GeistMono.className} ${GeistSans.variable} font-bold selection:bg-indigo-100 dark:selection:bg-white/10 selection:text-[#1d3e8e] transition-colors`}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        h1, h2, h3, h4 {
          font-family: 'Geist', sans-serif !important;
          font-weight: 700 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.1 !important;
        }
      `}</style>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-32 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8 hidden lg:block">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Getting Started</h3>
              <ul className="space-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <li><Link href="/docs/introduction" className="hover:text-indigo-500 cursor-pointer transition-colors text-indigo-500 font-bold">Introduction</Link></li>
                <li><Link href="/docs/quick-start-guide" className="hover:text-indigo-500 cursor-pointer transition-colors">Quick Start Guide</Link></li>
                <li><Link href="/docs/how-it-works" className="hover:text-indigo-500 cursor-pointer transition-colors">How it Works</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Features</h3>
              <ul className="space-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <li><Link href="/docs/ai-explanations" className="hover:text-indigo-500 cursor-pointer transition-colors">AI Explanations</Link></li>
                <li><Link href="/docs/practice-modes" className="hover:text-indigo-500 cursor-pointer transition-colors">Practice Modes</Link></li>
                <li><Link href="/docs/performance-tracking" className="hover:text-indigo-500 cursor-pointer transition-colors">Performance Tracking</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Resources</h3>
              <ul className="space-y-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                <li><Link href="/docs/syllabus-overview" className="hover:text-indigo-500 cursor-pointer transition-colors">Syllabus Overview</Link></li>
                <li><Link href="/docs/faq" className="hover:text-indigo-500 cursor-pointer transition-colors">FAQ</Link></li>
                <li><Link href="/docs/support" className="hover:text-indigo-500 cursor-pointer transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9 space-y-12">
            {/* Hero */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                Documentation
              </div>
              <h1 className="text-5xl font-black display-font text-slate-900 dark:text-white tracking-tighter">
                Mastering <span className="text-indigo-500">Handbook.</span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-3xl">
                Everything you need to know about the platform. From your first practice session to analyzing your readiness for exam day.
              </p>
            </div>

            {/* Search Mockup */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search documentation..." 
                className="w-full bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg py-4 pl-12 pr-4 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Grid of Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Zap, title: "Quick Start", desc: "Get up and running in less than 2 minutes.", slug: "quick-start" },
                { icon: Brain, title: "AI Tutor", desc: "Learn how to prompt the AI for deep explanations.", slug: "ai-tutor" },
                { icon: FileText, title: "Practice Modes", desc: "Understand timed vs untimed practice.", slug: "practice-modes" },
                { icon: Terminal, title: "Advanced", desc: "Keyboard shortcuts and custom settings.", slug: "advanced" },
              ].map((item, i) => (
                <Link href={`/docs/${item.slug}`} key={i} className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-8 space-y-4 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all cursor-pointer group block">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 dark:bg-[#141414] border border-zinc-100 dark:border-zinc-800 text-indigo-500 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">{item.title}</h3>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest pt-2 group-hover:translate-x-1 transition-transform">
                    Read More <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

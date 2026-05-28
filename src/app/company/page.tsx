"use client";

import { Heart, Globe, Users, Zap, CheckCircle2, ArrowRight, Eye, Shield, Target } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";

export default function CompanyPage() {
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
      
      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-32 pt-20 space-y-24">
        {/* Hero */}
        <div className="space-y-6 text-center max-w-4xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
          
          <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 mx-auto">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            About Us
          </div>
          <h1 className="text-5xl md:text-7xl font-black display-font text-slate-900 dark:text-white tracking-tighter">
            Building the Future of <span className="text-indigo-500">Education.</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
            We are a team of educators, engineers, and designers dedicated to making quality education accessible to everyone.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              OUR STORY
            </div>
            <h2 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">
              Started in Lagos, <br/>
              Built for the World.
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Handbook was born out of frustration with the current state of exam preparation. We saw students struggling with outdated materials and lack of guidance. We decided to build a platform that leverages AI to provide personalized, high-quality learning experiences.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
              Today, we are helping thousands of students ace their exams and build confidence.
            </p>
          </div>
          {/* Styled Div instead of image placeholder */}
          <div className="relative aspect-video bg-[#0a0a0a] rounded-2xl overflow-hidden border border-zinc-800 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
            <Globe className="w-12 h-12 text-indigo-500 relative z-10" />
            <div className="relative z-10">
              <div className="text-sm font-bold text-white uppercase tracking-widest">Global Impact</div>
              <div className="text-xs text-zinc-500 mt-1">Connecting students to opportunities.</div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <div className="space-y-4 text-center">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              OUR VALUES
            </div>
            <h2 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">
              What We Stand For.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Eye, title: "Transparency", desc: "We are open about how we work and how we handle data." },
              { icon: Target, title: "Student First", desc: "Every decision is made with the student's success in mind." },
              { icon: Shield, title: "Excellence", desc: "We strive for the highest quality in everything we do." },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-8 space-y-4 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 dark:bg-[#141414] border border-zinc-100 dark:border-zinc-800 text-indigo-500 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">{item.title}</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

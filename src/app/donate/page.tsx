"use client";

import { Heart, Globe, Users, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";



export default function DonatePage() {
  return (
    <div className="min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white font-sans transition-colors">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center space-y-12 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-[#1d3e8e] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Heart className="w-3 h-3 fill-indigo-600" />
              Empowering the Future
            </div>
            <h1 className="text-5xl md:text-7xl font-black display-font leading-[0.9] tracking-tighter text-slate-900 dark:text-white">
              Support Our <br/>
              <span className="text-[#1d3e8e] dark:text-indigo-400">Mission.</span>
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed pt-4">
               Donating helps us reach more students and get access to better AI models. 
               Every contribution directly fuels the academic breakthrough of a young scholar.
            </p>
          </motion.div>
        </section>

        {/* Custom Donation Section */}
        <section className="mt-12 bg-slate-900 rounded-[5rem] p-16 md:p-32 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-6xl font-black display-font leading-[0.95] tracking-tight text-white">
                Intelligence is <br/>
                <span className="text-indigo-400">Equal.</span> <br/>
                Opportunity isn't.
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed">
                By supporting Handbook, you're not just donating to a platform; 
                you're investing in the technical and academic sovereignty of 
                thousands of Nigerian students.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-12 bg-indigo-500 rounded-full" />
                  <div className="text-left">
                    <div className="text-lg font-black text-white uppercase tracking-tight">100% Impact</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Directly towards student success</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card-white bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-white/10 p-10 space-y-8 rounded-[3rem]">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Custom Donation</h3>
                <p className="text-sm text-slate-400 font-medium">Enter a custom amount to support the mission.</p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 text-xl font-black text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
                  Complete Custom Support
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

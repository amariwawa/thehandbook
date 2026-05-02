"use client";

import { useState } from "react";

import SidebarLayout from "@/components/ui/SidebarLayout";
import Link from "next/link";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import { motion } from "framer-motion";
import { Layers, ChevronRight, Zap, ChevronDown, BarChart3, Sparkles, ArrowRight, Play } from "lucide-react";

export default function DashboardPage() {
   const { selectedSubjects, getSelectedSubjectDetails, profile } = useSubjectSelection();
   const selectedDetails = getSelectedSubjectDetails();
   const [selectedWeek, setSelectedWeek] = useState("August W4");
   const [velocityFilter, setVelocityFilter] = useState("All Subjects");

   return (
      <SidebarLayout>
         <div className="space-y-16 pb-20">
            {/* Primary Metrics Header */}
            <header className="space-y-12">
               <div className="flex flex-col lg:flex-row justify-between items-end gap-8 pb-10 border-b-2 border-slate-900/5 dark:border-white/5">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/20 text-[#1d3e8e] dark:text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">Momentum Analytics</div>
                     <h1 className="text-7xl font-black display-font leading-none tracking-tighter text-slate-900 dark:text-white transition-all">
                        Study <span className="text-[#1d3e8e] dark:text-indigo-500">Velocity.</span>
                     </h1>
                     <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Tracking scholarly focus and cognitive intensity.</p>
                  </div>

                  <div className="flex items-center gap-4 bg-white dark:bg-white/5 p-2 rounded-2xl border border-slate-100 dark:border-white/10 shadow-soft">
                     <div className="relative">
                        <select 
                           value={selectedWeek}
                           onChange={(e) => setSelectedWeek(e.target.value)}
                           className="appearance-none bg-slate-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 outline-none cursor-pointer transition-all"
                        >
                           {["August W4", "August W3", "August W2", "August W1"].map(w => (
                              <option key={w} value={w} className="bg-white dark:bg-black">{w}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                     </div>

                     <div className="relative">
                        <select 
                           value={velocityFilter}
                           onChange={(e) => setVelocityFilter(e.target.value)}
                           className="appearance-none bg-indigo-600 border border-transparent rounded-xl px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer transition-all shadow-lg shadow-indigo-100/50 dark:shadow-none"
                        >
                           <option value="All Subjects" className="bg-indigo-600">All Subjects</option>
                           {selectedDetails.map(s => (
                              <option key={s.id} value={s.name} className="bg-indigo-600">{s.name}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
                     </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-black rounded-[3rem] border border-slate-100 dark:border-white/10 shadow-soft space-y-10 min-h-[450px] flex flex-col pt-10 group hover:shadow-premium dark:hover:shadow-white/5 transition-all">
                  <div className="flex justify-between items-start px-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-[#1d3e8e] dark:text-white">
                           <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black display-font text-slate-900 dark:text-white uppercase tracking-tight">{velocityFilter} PERFORMANCE</h2>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Snapshot for {selectedWeek}</p>
                        </div>
                     </div>
                     <div className="bg-indigo-50 dark:bg-indigo-900/20 text-[#1d3e8e] dark:text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Live Metrics
                     </div>
                  </div>

                  {/* Mock Chart */}
                  <div className="flex-1 flex items-end justify-between px-10 pb-4 gap-6">
                     {[
                        { day: "MON", val: 64 },
                        { day: "TUE", val: 82 },
                        { day: "WED", val: 45 },
                        { day: "THU", val: 88 },
                        { day: "FRI", val: 70 },
                        { day: "SAT", val: 78 },
                        { day: "SUN", val: 92 },
                     ].map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-4 group/bar">
                           <div className="w-full relative flex items-end justify-center h-40 bg-slate-50/50 dark:bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                 initial={{ height: 0 }}
                                 animate={{ height: `${d.val}%` }}
                                 className="w-full bg-[#1d3e8e] dark:bg-indigo-500 rounded-full transition-all duration-1000 group-hover/bar:bg-indigo-400 relative z-10"
                              />
                              <div
                                 className="absolute bottom-0 w-full bg-indigo-100 dark:bg-indigo-900/40 rounded-full opacity-30"
                                 style={{ height: `${Math.min(100, d.val + 15)}%` }}
                              />
                           </div>
                           <span className="text-[10px] font-black text-slate-400 tracking-widest">{d.day}</span>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/5 border-t border-slate-100 dark:border-white/5 pt-8 mt-auto">
                     <div className="text-center py-6 space-y-1">
                        <div className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">82%</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Accuracy</div>
                     </div>
                     <div className="text-center py-6 space-y-1">
                        <div className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">14.2h</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Study Time</div>
                     </div>
                     <div className="flex items-center justify-center p-6 bg-slate-50/30 dark:bg-white/5">
                        <Link href="/dashboard/analysis" className="w-full">
                           <button className="bg-[#1d3e8e] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none w-full active:scale-95 transition-all">
                              Deep Analysis
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>
            </header>

            {/* Daily AI Insight - Split Report Cards */}
            <section className="space-y-10">
               <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/10 pb-8 px-4">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">Handbook Daily Report.</h3>
                     <p className="text-slate-500 dark:text-slate-400 font-medium">AI analysis of your most recent academic performance.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1: Weakest Points */}
                  <div className="bg-white dark:bg-black rounded-[3rem] p-10 border border-slate-100 dark:border-white/10 shadow-soft flex flex-col gap-8 group hover:shadow-premium dark:hover:shadow-white/5 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                              <Zap className="w-6 h-6" />
                           </div>
                           <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Weakest Points</h4>
                        </div>
                        <span className="bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20">Needs Attention</span>
                     </div>
                     <div className="space-y-4">
                        <p className="text-2xl font-black display-font text-slate-900 dark:text-white leading-tight">
                           Based on your last Calculus drill, you're struggling with <span className="text-rose-500">Chain Rule integration</span>.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                           Focus on the inner function derivative before applying the outer power rule to maintain precision in multi-step solutions.
                        </p>
                     </div>
                     <div className="mt-auto pt-4">
                        <Link href="/ai-insights">
                           <button className="w-full bg-slate-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1d3e8e] hover:text-white transition-all group-hover:bg-[#1d3e8e] group-hover:text-white flex items-center justify-center gap-2">
                              Review Action Plan <ArrowRight className="w-4 h-4" />
                           </button>
                        </Link>
                     </div>
                  </div>

                  {/* Card 2: Strongest Points */}
                  <div className="bg-white dark:bg-black rounded-[3rem] p-10 border border-slate-100 dark:border-white/10 shadow-soft flex flex-col gap-8 group hover:shadow-premium dark:hover:shadow-white/5 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
                              <BarChart3 className="w-6 h-6" />
                           </div>
                           <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Strongest Points</h4>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Mastery Achieved</span>
                     </div>
                     <div className="space-y-4">
                        <p className="text-2xl font-black display-font text-slate-900 dark:text-white leading-tight">
                           Your precision in <span className="text-emerald-500">Physics: Electromagnetism</span> is in the top 5% of your cohort.
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                           You correctly applied Faraday's Law in 100% of complex scenarios. Predictive scoring indicates high exam readiness.
                        </p>
                     </div>
                     <div className="mt-auto pt-4">
                        <Link href="/ai-insights">
                           <button className="w-full bg-slate-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1d3e8e] hover:text-white transition-all group-hover:bg-[#1d3e8e] group-hover:text-white flex items-center justify-center gap-2">
                              View Mastery Details <ArrowRight className="w-4 h-4" />
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>
            </section>

            {/* My Subjects - Editorial Style */}
            <section className="space-y-10">
               <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/10 pb-8 px-4">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">Active Stack.</h3>
                     <p className="text-slate-500 dark:text-slate-400 font-medium">Click on any subject to enter your customized practice suite.</p>
                  </div>
                  <Link href="/practice/custom" className="text-[10px] font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-[0.4em] border-b-2 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-600 dark:hover:border-white transition-all pb-1">
                     Manage Stack
                  </Link>
               </div>

               {selectedSubjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                     {selectedDetails.slice(0, 4).map((item) => (
                        <Link href={`/practice/session/waec/${item.id}`} key={item.id} className="group">
                           <motion.div 
                              whileHover={{ y: -12, scale: 1.02 }}
                              className="bg-white rounded-[3rem] p-10 flex flex-col items-center gap-8 text-center h-full border-2 border-slate-100 hover:border-indigo-100 shadow-soft transition-all"
                           >
                              <div className="w-24 h-24 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center p-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors shadow-soft">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="space-y-2">
                                 <div className="text-[10px] font-bold text-[#1d3e8e] uppercase tracking-[0.4em]">Launch Practice Session</div>
                                 <h4 className="text-3xl font-black display-font text-slate-900 uppercase tracking-tight leading-none">{item.name}</h4>
                              </div>
                           </motion.div>
                        </Link>
                     ))}
                  </div>
               ) : (
                  <div className="bg-white rounded-[4rem] p-20 border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
                     <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                        <Plus className="w-8 h-8" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-black display-font text-slate-900 uppercase tracking-tight">Catalog is Empty</h4>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Start building your scholarly stack to begin analysis.</p>
                     </div>
                     <Link href="/practice/custom" className="bg-[#1d3e8e] text-white px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl dark:shadow-none active:scale-95 transition-all">
                        Build Now
                     </Link>
                  </div>
               )}
            </section>

            {/* Continue Section - Topic Specific */}
            <section className="space-y-10 pt-10">
               <div className="flex justify-between items-end border-b border-slate-100 dark:border-white/10 pb-8 px-4">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">Continue.</h3>
                     <p className="text-slate-500 dark:text-slate-400 font-medium">Resume your most recent topic sessions.</p>
                  </div>
                  <Link href="/practice/arena" className="text-[10px] font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-[0.4em] border-b-2 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-600 dark:hover:border-white transition-all pb-1">
                     Arena Selection
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                     { name: "Calculus & Trig", subject: "MATHEMATICS", subjectId: "mathematics", image: "/subjects/mathematics_v2.png", mastery: 64 },
                     { name: "Electromagnetism", subject: "PHYSICS", subjectId: "physics", image: "/subjects/physics_v2.png", mastery: 28 },
                     { name: "African Poetry", subject: "LITERATURE", subjectId: "literature", image: "/subjects/literature_v2.png", mastery: 85 },
                  ].map((item) => (
                     <div key={item.name} className="bg-white dark:bg-black rounded-[3rem] p-10 border border-slate-100 dark:border-white/10 shadow-soft group hover:shadow-premium dark:hover:shadow-white/5 transition-all flex flex-col gap-10">
                        <div className="flex items-center gap-6">
                           <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center p-4 group-hover:bg-[#1d3e8e] transition-colors overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.subject}</span>
                              <div className="text-2xl font-black display-font text-slate-900 dark:text-white tracking-tight leading-none">{item.name}</div>
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div className="flex justify-between items-end">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Index</span>
                              <span className="text-lg font-black text-[#1d3e8e] dark:text-indigo-400 display-font">{item.mastery}%</span>
                           </div>
                           <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${item.mastery}%` }}
                                 className="h-full bg-[#1d3e8e] dark:bg-indigo-500" 
                              />
                           </div>
                           <Link href={`/practice/session/waec/${item.subjectId}`} className="block">
                              <button className="w-full bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all group-hover:bg-slate-900 dark:group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-xl">
                                 Launch Session
                              </button>
                           </Link>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         </div>
      </SidebarLayout>
   );
}

function Plus(props: any) {
   return (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
       <path d="M5 12h14M12 5v14"/>
     </svg>
   );
 }

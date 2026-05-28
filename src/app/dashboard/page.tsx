"use client";

import { useState } from "react";

import SidebarLayout from "@/components/ui/SidebarLayout";
import Link from "next/link";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import { motion } from "framer-motion";
import { ChevronRight, Zap, ChevronDown, BarChart3, ArrowRight } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import AnalyticsEmptyState from "@/components/AnalyticsEmptyState";
import { getSubjectImage, getSubjectId } from "@/lib/subjectMeta";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-soft space-y-10 min-h-[450px] flex flex-col pt-10 animate-pulse">
      <div className="flex justify-between items-start px-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-zinc-800 rounded-lg" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 w-32 bg-slate-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-end justify-between px-10 pb-4 gap-6">
        {DAYS.map((d) => (
          <div key={d} className="flex-1 flex flex-col items-center gap-4">
            <div className="w-full h-40 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-3 w-6 bg-slate-200 dark:bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-zinc-800 border-t border-slate-200 dark:border-zinc-800 pt-8 mt-auto">
        <div className="text-center py-6 space-y-2">
          <div className="h-10 w-20 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" />
        </div>
        <div className="text-center py-6 space-y-2">
          <div className="h-10 w-20 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" />
          <div className="h-3 w-16 bg-slate-200 dark:bg-zinc-800 rounded mx-auto" />
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="h-12 w-full bg-slate-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
   const { selectedSubjects, getSelectedSubjectDetails, profile } = useSubjectSelection();
   const selectedDetails = getSelectedSubjectDetails();
   const [selectedWeek, setSelectedWeek] = useState("August W4");
   const [velocityFilter, setVelocityFilter] = useState("All Subjects");

   const {
     sessions,
     avgAccuracy,
     totalStudyMins,
     sessionsByDay,
     recentSubjects,
     isLoading,
     isEmpty,
   } = useAnalytics();

   // Build chart data from real sessions
   const chartData = DAYS.map((day) => ({
     day,
     val: Math.min(100, (sessionsByDay[day] ?? 0) * 15 + 10),
   }));

   const accuracyDisplay = avgAccuracy !== null ? `${avgAccuracy}%` : "--";
   const hoursDisplay = totalStudyMins > 0
     ? `${(totalStudyMins / 60).toFixed(1)}h`
     : "0h";

   return (
      <SidebarLayout>
         <div className="space-y-16 pb-20 text-slate-900 dark:text-white min-h-screen transition-colors">
            {/* Primary Metrics Header */}
            <header className="space-y-12">
               <div className="flex flex-col lg:flex-row justify-between items-end gap-8 pb-10 border-b border-slate-200 dark:border-zinc-800">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest">
                       <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                       Momentum Analytics
                     </div>
                     <h1 className="text-5xl font-bold display-font leading-none tracking-tighter text-slate-900 dark:text-white">
                        Study <span className="text-indigo-500">Velocity.</span>
                     </h1>
                     <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium">Tracking scholarly focus and cognitive intensity.</p>
                  </div>

                  <div className="flex items-center gap-4 bg-white dark:bg-[#141414] p-2 rounded-xl border border-slate-200 dark:border-zinc-800">
                     <div className="relative">
                        <select
                           value={selectedWeek}
                           onChange={(e) => setSelectedWeek(e.target.value)}
                           className="appearance-none bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400 outline-none cursor-pointer transition-all"
                        >
                           {["August W4", "August W3", "August W2", "August W1"].map(w => (
                              <option key={w} value={w} className="bg-slate-100 dark:bg-[#0a0a0a]">{w}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600 pointer-events-none" />
                     </div>

                     <div className="relative">
                        <select
                           value={velocityFilter}
                           onChange={(e) => setVelocityFilter(e.target.value)}
                           className="appearance-none bg-indigo-500 border border-transparent rounded-lg px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer transition-all"
                        >
                           <option value="All Subjects" className="bg-slate-100 dark:bg-[#0a0a0a]">All Subjects</option>
                           {selectedDetails.map(s => (
                              <option key={s.id} value={s.name} className="bg-slate-100 dark:bg-[#0a0a0a]">{s.name}</option>
                           ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
                     </div>
                  </div>
               </div>

               {isLoading ? (
                 <SkeletonCard />
               ) : isEmpty ? (
                 <AnalyticsEmptyState />
               ) : (
               <div className="bg-white dark:bg-[#141414] rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-soft space-y-10 min-h-[450px] flex flex-col pt-10 hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                  <div className="flex justify-between items-start px-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center text-indigo-500">
                           <BarChart3 className="w-6 h-6" />
                        </div>
                        <div>
                           <h2 className="text-2xl font-bold display-font text-slate-900 dark:text-white uppercase tracking-tight">{velocityFilter} PERFORMANCE</h2>
                           <p className="text-xs text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest">Snapshot for {selectedWeek}</p>
                        </div>
                     </div>
                     <div className="bg-indigo-500/10 text-indigo-500 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                        Live Metrics
                     </div>
                  </div>

                  {/* Real Chart */}
                  <div className="flex-1 flex items-end justify-between px-10 pb-4 gap-6">
                     {chartData.map((d) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-4 group/bar">
                           <div className="w-full relative flex items-end justify-center h-40 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-full overflow-hidden">
                              <motion.div
                                 initial={{ height: 0 }}
                                 animate={{ height: `${d.val}%` }}
                                 className="w-full bg-indigo-500 rounded-full transition-all duration-1000 group-hover/bar:bg-indigo-400 relative z-10"
                              />
                              <div
                                 className="absolute bottom-0 w-full bg-indigo-500/10 rounded-full"
                                 style={{ height: `${Math.min(100, d.val + 15)}%` }}
                              />
                           </div>
                           <span className="text-[10px] font-black text-slate-500 dark:text-zinc-600 tracking-widest">{d.day}</span>
                        </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-zinc-800 border-t border-slate-200 dark:border-zinc-800 pt-8 mt-auto">
                     <div className="text-center py-6 space-y-1">
                        <div className="text-4xl font-bold display-font text-slate-900 dark:text-white tracking-tight">{accuracyDisplay}</div>
                        <div className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.2em]">Accuracy</div>
                     </div>
                     <div className="text-center py-6 space-y-1">
                        <div className="text-4xl font-bold display-font text-slate-900 dark:text-white tracking-tight">{hoursDisplay}</div>
                        <div className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-[0.2em]">Study Time</div>
                     </div>
                     <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-[#0a0a0a]">
                        <Link href="/dashboard/analysis" className="w-full">
                           <button className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-black text-[10px] uppercase tracking-widest w-full active:scale-95 transition-all hover:bg-indigo-600">
                              Deep Analysis
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>
               )}
            </header>

            {/* Daily AI Insight - Split Report Cards */}
            {!isEmpty && !isLoading && (
            <section className="space-y-10">
               <div className="flex justify-between items-end border-b border-slate-200 dark:border-zinc-800 pb-8 px-4">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-bold display-font text-slate-900 dark:text-white tracking-tight">Handbook Daily Report.</h3>
                     <p className="text-slate-600 dark:text-zinc-400 font-medium">AI analysis of your most recent academic performance.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Card 1: Weakest Points */}
                  <div className="bg-white dark:bg-[#141414] rounded-2xl p-10 border border-slate-200 dark:border-zinc-800 flex flex-col gap-8 group hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 text-rose-500 rounded-lg flex items-center justify-center">
                              <Zap className="w-6 h-6" />
                           </div>
                           <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Weakest Points</h4>
                        </div>
                        <span className="bg-rose-500/10 text-rose-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-rose-500/20">Needs Attention</span>
                     </div>
                     <div className="space-y-4">
                        <p className="text-2xl font-bold display-font text-slate-900 dark:text-white leading-tight">
                           Based on your last {sessions[0]?.subject ?? "practice"} drill, review <span className="text-rose-500">missed concepts</span>.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                           {sessions.length > 1
                             ? `You have completed ${sessions.length} sessions. Focus on topics with the lowest scores to improve your accuracy.`
                             : "Complete more sessions to build a detailed weakness profile."}
                        </p>
                     </div>
                     <div className="mt-auto pt-4">
                        <Link href="/ai-insights">
                           <button className="w-full bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 text-indigo-500 py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              Review Action Plan <ArrowRight className="w-4 h-4" />
                           </button>
                        </Link>
                     </div>
                  </div>

                  {/* Card 2: Strongest Points */}
                  <div className="bg-white dark:bg-[#141414] rounded-2xl p-10 border border-slate-200 dark:border-zinc-800 flex flex-col gap-8 group hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 text-emerald-500 rounded-lg flex items-center justify-center">
                              <BarChart3 className="w-6 h-6" />
                           </div>
                           <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Strongest Points</h4>
                        </div>
                        <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20">Mastery Achieved</span>
                     </div>
                     <div className="space-y-4">
                        <p className="text-2xl font-bold display-font text-slate-900 dark:text-white leading-tight">
                           Your accuracy in <span className="text-emerald-500">{sessions[0]?.subject ?? "practice"}</span> is {avgAccuracy ?? 0}%.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                           Keep up the momentum. Consistent practice is the key to exam readiness.
                        </p>
                     </div>
                     <div className="mt-auto pt-4">
                        <Link href="/ai-insights">
                           <button className="w-full bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 text-indigo-500 py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-2">
                              View Mastery Details <ArrowRight className="w-4 h-4" />
                           </button>
                        </Link>
                     </div>
                  </div>
               </div>
            </section>
            )}

            {/* My Subjects - Editorial Style */}
            <section className="space-y-10">
               <div className="flex justify-between items-end border-b border-slate-200 dark:border-zinc-800 pb-8 px-4">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-bold display-font text-slate-900 dark:text-white tracking-tight">Active Stack.</h3>
                     <p className="text-slate-600 dark:text-zinc-400 font-medium">Click on any subject to enter your customized practice suite.</p>
                  </div>
                  <Link href="/practice/custom" className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em] border-b-2 border-indigo-500/20 hover:border-indigo-500 transition-all pb-1">
                     Manage Stack
                  </Link>
               </div>

               {selectedSubjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {selectedDetails.slice(0, 4).map((item) => (
                        <Link href={`/practice/session/waec/${item.id}`} key={item.id} className="group">
                           <motion.div
                              whileHover={{ y: -8 }}
                              className="bg-white dark:bg-[#141414] rounded-2xl p-10 flex flex-col items-center gap-8 text-center h-full border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all"
                           >
                              <div className="w-24 h-24 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center p-4 group-hover:bg-indigo-500/10 transition-colors">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="space-y-2">
                                 <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em]">Launch Session</div>
                                 <h4 className="text-2xl font-bold display-font text-slate-900 dark:text-white uppercase tracking-tight leading-none">{item.name}</h4>
                              </div>
                           </motion.div>
                        </Link>
                     ))}
                  </div>
               ) : (
                  <div className="bg-white dark:bg-[#141414] rounded-2xl p-20 border border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center space-y-8">
                     <div className="w-20 h-20 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-full flex items-center justify-center text-slate-500 dark:text-zinc-700">
                        <Plus className="w-8 h-8" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-2xl font-bold display-font text-slate-900 dark:text-white uppercase tracking-tight">Catalog is Empty</h4>
                        <p className="text-slate-600 dark:text-zinc-400 font-medium max-w-sm mx-auto">Start building your scholarly stack to begin analysis.</p>
                     </div>
                     <Link href="/practice/custom" className="bg-indigo-500 text-white px-12 py-5 rounded-lg font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all hover:bg-indigo-600">
                        Build Now
                     </Link>
                  </div>
               )}
            </section>

            {/* Continue Section - Real recent subjects */}
            {!isEmpty && !isLoading && recentSubjects.length > 0 && (
            <section className="space-y-10 pt-10">
               <div className="flex justify-between items-end border-b border-slate-200 dark:border-zinc-800 pb-8 px-4">
                  <div className="space-y-2">
                     <h3 className="text-4xl font-bold display-font text-slate-900 dark:text-white tracking-tight">Continue.</h3>
                     <p className="text-slate-600 dark:text-zinc-400 font-medium">Resume your most recent topic sessions.</p>
                  </div>
                  <Link href="/practice/arena" className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em] border-b-2 border-indigo-500/20 hover:border-indigo-500 transition-all pb-1">
                     Arena Selection
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentSubjects.map((item) => {
                     const subjectId = getSubjectId(item.subject);
                     const image = getSubjectImage(item.subject);
                     return (
                        <div key={item.subject} className="bg-white dark:bg-[#141414] rounded-2xl p-10 border border-slate-200 dark:border-zinc-800 flex flex-col gap-10 hover:border-slate-300 dark:hover:border-zinc-700 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center p-4 group-hover:bg-indigo-500/10 transition-colors overflow-hidden">
                                 <img src={image} alt={item.subject} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 space-y-1">
                                 <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest leading-none">{item.subject}</span>
                                 <div className="text-2xl font-bold display-font text-slate-900 dark:text-white tracking-tight leading-none">{item.subject}</div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <div className="flex justify-between items-end">
                                 <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest">Mastery Index</span>
                                 <span className="text-lg font-bold text-indigo-500 display-font">{item.avgScore}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 rounded-full overflow-hidden">
                                 <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.avgScore}%` }}
                                    className="h-full bg-indigo-500"
                                 />
                              </div>
                              <Link href={`/practice/session/waec/${subjectId}`} className="block">
                                 <button className="w-full bg-indigo-500 text-white py-4 rounded-lg font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all hover:bg-indigo-600">
                                    Launch Session
                                 </button>
                              </Link>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </section>
            )}
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

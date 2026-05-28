"use client";

import { useState } from "react";
import SidebarLayout from "@/components/ui/SidebarLayout";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Sparkles, Brain, TrendingUp, Target, ShieldCheck, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AIInsightsPage() {
  const { getSelectedSubjectDetails } = useSubjectSelection();
  const selectedDetails = getSelectedSubjectDetails('mixed');
  const [activeExam, setActiveExam] = useState<'waec' | 'jamb' | 'bece'>('waec');

  const { sessions, avgAccuracy, subjectStats, isEmpty } = useAnalytics();

  // Compute real global stats
  const masteryIndex = avgAccuracy !== null ? avgAccuracy.toString() : "--";
  const totalSessions = sessions.length;
  const weakestSubject = subjectStats.length > 0
    ? subjectStats.reduce((min, s) => (s.avgScore < min.avgScore ? s : min), subjectStats[0])
    : null;
  const criticalConstraint = weakestSubject?.subject ?? "N/A";

  const globalStats = [
    { label: "Mastery Index", value: masteryIndex, trend: totalSessions > 1 ? `${totalSessions} sessions` : "Start now", icon: ShieldCheck, color: "text-emerald-500" },
    { label: "Total Sessions", value: totalSessions.toString(), trend: isEmpty ? "Empty" : "Live", icon: TrendingUp, color: "text-[#1d3e8e]" },
    { label: "Critical Constraint", value: criticalConstraint, trend: isEmpty ? "No data" : "Focus", icon: Target, color: "text-rose-500" },
  ];

  return (
    <SidebarLayout>
      <div className="space-y-16 pb-20">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-[#1d3e8e] dark:text-indigo-400 font-black text-xs uppercase tracking-[0.4em]">
            <Sparkles className="w-4 h-4" />
            Scholarly Intelligence
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold display-font leading-none tracking-tighter text-slate-900 dark:text-white">
              AI <span className="text-[#1d3e8e] dark:text-indigo-400">Insights.</span>
            </h1>
            <p className="text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed">
              {isEmpty
                ? "Complete your first practice session to generate real AI insights across your academic stack."
                : `Consolidated intelligence across your academic stack. We've analyzed ${sessions.length * (sessions[0]?.topics?.length ?? 1)}+ data points to predict your examination performance.`}
            </p>
          </div>
        </header>

        {/* Global Analytics - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-slate-200 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-soft dark:shadow-none">
           {globalStats.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-zinc-900 p-12 space-y-6 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                 <div className="flex justify-between items-start">
                    <div className={`w-12 h-12 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-center ${stat.color} bg-white dark:bg-zinc-800 shadow-sm`}>
                       <stat.icon className="w-5 h-5" />
                    </div>
                    <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">Live Feed</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                    <div className="flex items-baseline gap-3">
                       <div className="text-5xl font-black text-slate-900 dark:text-white display-font tracking-tighter">{stat.value}</div>
                       <div className={`text-[10px] font-black ${stat.color} uppercase tracking-widest`}>{stat.trend}</div>
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Confidence: {isEmpty ? "0%" : "94%"}</span>
                    <div className="w-24 h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className={`h-full ${stat.color.replace('text', 'bg')} w-3/4`} />
                    </div>
                 </div>
             </div>
           ))}
        </div>

        {/* Subject Dossiers */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-slate-900/5 dark:border-white/5 pb-8 px-4 gap-8">
             <div className="space-y-2">
                <h2 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight leading-none uppercase">Topical Analysis.</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Click on any subject for a granular topic-by-topic mastery breakdown.</p>
             </div>

             {/* Exam Switcher Tabs */}
             <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-soft">
                {['waec', 'jamb', 'bece'].map((type) => {
                   const isActive = activeExam === type;
                   const subjectsCount = getSelectedSubjectDetails(type as any).length;
                   
                   return (
                      <button
                        key={type}
                        onClick={() => setActiveExam(type as any)}
                        className={`relative px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                          isActive 
                            ? 'bg-white dark:bg-white/10 text-[#1d3e8e] dark:text-white shadow-premium scale-105 z-10' 
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        {type}
                        {subjectsCount > 0 && (
                           <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] ${
                             isActive ? 'bg-[#1d3e8e] text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                           }`}>
                             {subjectsCount}
                           </span>
                        )}
                      </button>
                   );
                })}
             </div>
          </div>

          <div className="relative min-h-[400px]">
             <div>
                  {(() => {
                    const examSubjects = getSelectedSubjectDetails(activeExam);
                    if (examSubjects.length === 0) {
                      return (
                        <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5 p-24 text-center space-y-6">
                           <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto text-slate-200">
                              <Target className="w-8 h-8" />
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-xl font-black display-font text-slate-900 dark:text-white tracking-tight uppercase">No {activeExam.toUpperCase()} Selection</h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[240px] mx-auto leading-relaxed">
                                 You haven't added any {activeExam.toUpperCase()} subjects to your scholarly stack yet.
                              </p>
                           </div>
                           <Link href="/practice/custom">
                              <button className="text-[#1d3e8e] dark:text-indigo-400 font-black uppercase tracking-widest text-[9px] border-b-2 border-indigo-100 dark:border-indigo-900/50 hover:border-[#1d3e8e] transition-all">
                                 Configure Now
                              </button>
                           </Link>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {examSubjects.map((sub, i) => {
                          const realStat = subjectStats.find((s) => s.subject.toLowerCase() === sub.name.toLowerCase());
                          const readiness = realStat?.avgScore ?? 0;
                          const hasData = realStat !== undefined;

                          return (
                          <Link href={`/ai-insights/${sub.id}`} key={sub.id}>
                          <div className="bg-white border border-slate-200 shadow-soft hover:shadow-premium group transition-all h-full flex flex-col overflow-hidden rounded-[2.5rem]">
                              <div className="p-10 space-y-10 flex-1">
                                 <div className="flex justify-between items-start">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-white/5 group-hover:bg-[#1d3e8e] dark:group-hover:bg-indigo-600 transition-colors overflow-hidden">
                                       <img src={sub.image} alt={sub.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className={`px-4 py-1 rounded-md font-black text-[9px] uppercase tracking-[0.2em] border ${hasData ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-500/20'}`}>
                                       {hasData ? 'Active' : 'Pending'}
                                    </div>
                                 </div>
                                 
                                 <div className="space-y-3">
                                    <h3 className="text-2xl font-black display-font text-slate-900 tracking-tight leading-none uppercase">{sub.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                                       {hasData
                                         ? `Comprehensive ${activeExam.toUpperCase()} data analysis suggests a readiness index of ${readiness}% based on ${realStat.sessions} session${realStat.sessions !== 1 ? 's' : ''}.`
                                         : `No session data yet. Start practicing ${sub.name} to generate real readiness insights.`}
                                    </p>
                                 </div>
                              </div>
          
                              <div className="bg-slate-50/50 p-8 border-t border-slate-100 grid grid-cols-2 gap-px divide-x divide-slate-100">
                                 <div className="space-y-1 pr-4">
                                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Mastery</div>
                                    <div className="text-xl font-black display-font text-slate-900 leading-none">{hasData ? `${readiness}%` : "--"}</div>
                                 </div>
                                 <div className="space-y-1 pl-8">
                                    <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Status</div>
                                    <div className={`text-[10px] font-black uppercase tracking-widest leading-none pt-1 ${hasData ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                                       {hasData ? (readiness >= 70 ? 'Optimal' : readiness >= 40 ? 'Developing' : 'Critical') : 'No Data'}
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="bg-white dark:bg-zinc-800 px-8 py-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between group-hover:bg-slate-900 dark:group-hover:bg-black group-hover:text-white transition-colors">
                                 <span className="text-[9px] font-black dark:text-slate-400 uppercase tracking-[0.4em]">Deep Intelligence</span>
                                 <BarChart3 className="w-4 h-4 dark:text-slate-400" />
                              </div>
                          </div>
                          </Link>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
          </div>

            {selectedDetails.length === 0 && (
              <div className="bg-slate-50 dark:bg-zinc-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/5 p-24 text-center space-y-8">
                <div className="w-24 h-24 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-center mx-auto text-slate-200">
                   <Brain className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-2xl font-black display-font text-slate-900 dark:text-white tracking-tight uppercase">Analysis Queue Inactive</h3>
                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">Populate your scholarly stack to initiate deep intelligence processing.</p>
                </div>
                <Link href="/practice/custom">
                   <button className="bg-slate-900 dark:bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">
                      Configure Stack
                   </button>
                </Link>
              </div>
            )}
        </section>
      </div>
    </SidebarLayout>
  );
}

"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { subjects } from "@/lib/data";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function AnalysisPage() {
  const { sessions, subjectStats, isEmpty } = useAnalytics();

  // Build a lookup of all subjects by id
  const allSubjectsById = useMemo(() => {
    const all = [
      ...Object.values(subjects.waec).flat(),
      ...subjects.jamb,
      ...subjects.bece
    ];
    const map = new Map<string, any>();
    all.forEach((s: any) => map.set(s.id, s));
    return map;
  }, []);

  // Find subjects that have real session data
  const subjectsWithData = useMemo(() => {
    return subjectStats
      .map((stat) => {
        // Try to find matching subject by name
        const match = Array.from(allSubjectsById.values()).find(
          (s: any) => s.name.toLowerCase() === stat.subject.toLowerCase()
        );
        return match ? { ...match, stat } : null;
      })
      .filter(Boolean) as any[];
  }, [subjectStats, allSubjectsById]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectsWithData[0]?.id ?? "mathematics"
  );

  const selectedSubject = subjectsWithData.find((s) => s.id === selectedSubjectId) || subjectsWithData[0];
  const stat = selectedSubject?.stat;

  // Build trend from chronological session scores for this subject
  const trend = useMemo(() => {
    if (!stat) return [];
    return sessions
      .filter((s) => s.subject.toLowerCase() === stat.subject.toLowerCase())
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((s) => s.score ?? 0);
  }, [sessions, stat]);

  // Build topic stats from sessions for this subject
  const { strongTopics, weakTopics } = useMemo(() => {
    if (!stat) return { strongTopics: [] as string[], weakTopics: [] as string[] };

    const topicScores: Record<string, number[]> = {};
    sessions
      .filter((s) => s.subject.toLowerCase() === stat.subject.toLowerCase())
      .forEach((s) => {
        (s.topics ?? []).forEach((topic) => {
          if (!topicScores[topic]) topicScores[topic] = [];
          topicScores[topic].push(s.score ?? 0);
        });
      });

    const strong: string[] = [];
    const weak: string[] = [];

    Object.entries(topicScores).forEach(([topic, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg >= 70) strong.push(topic);
      else if (avg < 50) weak.push(topic);
    });

    return { strongTopics: strong, weakTopics: weak };
  }, [sessions, stat]);

  const accuracy = stat?.avgScore ?? 0;
  const hours = stat ? (stat.totalMins / 60).toFixed(1) : "0";
  const drills = stat?.sessions ?? 0;

  // Pad trend to at least 7 points for the chart visual
  const chartTrend = useMemo(() => {
    if (trend.length >= 7) return trend.slice(-7);
    const padded = [...trend];
    while (padded.length < 7) {
      padded.unshift(padded[0] ?? 50);
    }
    return padded;
  }, [trend]);

  if (isEmpty) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-slate-200">
            <BarChart3 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black display-font text-slate-900 dark:text-white">Analysis Not Available</h1>
            <p className="text-slate-500 font-medium max-w-sm">Complete at least one practice session to see your performance analysis.</p>
          </div>
          <Link href="/practice/arena" className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all">
            Start Practicing
          </Link>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-12 pb-20">
        {/* 1. HERO GRAPH - Moved to absolute top */}
        <div className="card-white dark:bg-zinc-900 p-10 space-y-10 min-h-[450px] flex flex-col overflow-hidden relative shadow-premium border-none bg-gradient-to-br from-white to-slate-50/50 dark:from-zinc-900 dark:to-black">
           <div className="flex justify-between items-center relative z-10">
              <div className="space-y-1">
                 <h3 className="text-3xl font-black display-font text-slate-900 dark:text-white tracking-tighter">Performance Velocity.</h3>
                 <p className="text-sm text-slate-400 font-medium italic">Your mastery trend across the last 30 days</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="bg-slate-900 dark:bg-indigo-600 px-4 py-2 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                    Real-time Analysis
                 </div>
              </div>
           </div>

           {/* Animated SVG Chart */}
           <div className="flex-1 relative mt-10">
              <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                 {[0, 50, 100, 150, 200].map((y) => (
                   <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="currentColor" className="text-slate-100 dark:text-white/5" strokeWidth="1" />
                 ))}
                 
                 <motion.path
                   key={`path-hero-${selectedSubjectId}`}
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: 1 }}
                   transition={{ duration: 2, ease: "circOut" }}
                   d={`M ${chartTrend.map((val: number, i: number) => `${i * 100},${200 - (val / 100) * 200}`).join(' L ')}`}
                   fill="none"
                   stroke="#1d3e8e"
                   className="dark:stroke-indigo-500"
                   strokeWidth="6"
                   strokeLinecap="round"
                   strokeLinejoin="round"
                 />

                 {chartTrend.map((val: number, i: number) => (
                   <motion.circle
                      key={`dot-hero-${selectedSubjectId}-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + (i * 0.1), type: "spring" }}
                      cx={i * 100}
                      cy={200 - (val / 100) * 200}
                      r="8"
                      fill="white"
                      className="dark:fill-black"
                      stroke="#1d3e8e"
                      strokeWidth="4"
                   />
                 ))}
              </svg>
           </div>
           
           <div className="flex justify-between px-2 pt-6">
              {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Current Session"].map((label) => (
                <span key={label} className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
              ))}
           </div>
        </div>

        {/* 2. IDENTITY & SELECTOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 dark:border-white/5 pb-12">
          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-6xl font-black display-font leading-none tracking-tighter text-slate-900 dark:text-white">
              Full <span className="text-[#1d3e8e] dark:text-indigo-400">Analysis.</span>
            </h1>
          </div>

          <section className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {subjectsWithData.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`flex-shrink-0 flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all ${
                  selectedSubjectId === sub.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl translate-y-[-2px]' 
                    : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                <img src={sub.image} alt={sub.name} className="w-6 h-6 object-contain" />
                <span className="text-xs font-black whitespace-nowrap uppercase tracking-widest">{sub.name}</span>
              </button>
            ))}
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
              {/* PRIMARY METRICS - Hours moved to end */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                  key={`acc-${selectedSubjectId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-white dark:bg-zinc-900 p-8 border-l-4 border-l-indigo-500"
                >
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Accuracy</div>
                   <div className="text-5xl font-black display-font text-[#1d3e8e] dark:text-indigo-400">{accuracy}%</div>
                </motion.div>

                <motion.div 
                  key={`quest-${selectedSubjectId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card-white dark:bg-zinc-900 p-8 border-l-4 border-l-purple-500"
                >
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Drills</div>
                   <div className="text-5xl font-black display-font text-slate-900 dark:text-white">{drills}</div>
                </motion.div>

                <motion.div 
                  key={`time-${selectedSubjectId}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card-white dark:bg-zinc-900/50 p-8 border-l-4 border-l-teal-500 bg-slate-50/30 dark:bg-white/5"
                >
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hours Studied</div>
                   <div className="text-5xl font-black display-font text-slate-400 dark:text-slate-500">{hours}h</div>
                </motion.div>
              </div>

               {/* Strengths & Weaknesses (Main area) */}
              <div className="card-white dark:bg-zinc-900 p-12 grid grid-cols-1 md:grid-cols-2 gap-12 border-none">
                 <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-6 h-6 text-teal-500" />
                       <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Elite Areas</h4>
                    </div>
                    <div className="space-y-4">
                       {strongTopics.map((item: string) => (
                         <div key={item} className="p-5 bg-teal-50/30 dark:bg-teal-500/10 rounded-2xl border border-teal-50 dark:border-teal-500/20 font-bold text-slate-700 dark:text-teal-300 text-sm">
                            {item}
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-8">
                    <div className="flex items-center gap-3">
                       <AlertCircle className="w-6 h-6 text-orange-500" />
                       <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Critical Gaps</h4>
                    </div>
                    <div className="space-y-4">
                       {weakTopics.map((item: string) => (
                         <div key={item} className="flex items-center justify-between p-5 bg-orange-50/50 dark:bg-orange-500/10 rounded-2xl border border-orange-100 dark:border-orange-500/20 font-bold text-slate-900 dark:text-orange-300 text-sm group cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                            {item}
                            <ChevronRight className="w-5 h-5 text-orange-300 group-hover:text-orange-600" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden group shadow-premium">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-[#1d3e8e] rounded-full blur-[80px] opacity-20" />
                 <div className="flex items-center gap-4 relative z-10">
                    <Sparkles className="w-6 h-6 text-indigo-300" />
                    <h3 className="text-2xl font-black tracking-tight">AI Strategy</h3>
                 </div>
                 
                 <p className="text-white/70 text-lg leading-relaxed font-medium relative z-10 italic">
                    "{selectedSubject?.name ? `Your ${selectedSubject.name} performance shows ${accuracy}% accuracy across ${drills} session${drills !== 1 ? 's' : ''}. ${strongTopics.length > 0 ? `Strong areas: ${strongTopics.slice(0, 2).join(', ')}.` : ''} ${weakTopics.length > 0 ? `Focus on: ${weakTopics.slice(0, 2).join(', ')}.` : 'Keep practicing to build more topic data.'}` : 'Start a practice session to generate AI strategy insights.'}"
                 </p>
                 
                 <button className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl relative z-10 active:scale-95 transition-all">
                    Update Roadmap
                 </button>
              </div>
           </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

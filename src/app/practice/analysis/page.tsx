"use client";

import { useEffect, useState } from "react";
import SidebarLayout from "@/components/ui/SidebarLayout";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Brain, ArrowLeft, RotateCcw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PracticeResult {
  subject: string;
  score: number;
  total: number;
  results: {
    questionId: number;
    topic: string;
    isCorrect: boolean;
  }[];
}

export default function AnalysisPage() {
  const router = useRouter();
  const [data, setData] = useState<PracticeResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('last_practice_results');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <BarChart3 className="w-16 h-16 text-slate-200" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">No Analysis Data Found</h1>
          <Link href="/practice/arena" className="text-[#1d3e8e] font-bold">Start a Practice Session</Link>
        </div>
      </SidebarLayout>
    );
  }

  // Calculate topic-wise performance
  const topicStats: Record<string, { total: number, correct: number }> = {};
  data.results.forEach(res => {
    if (!topicStats[res.topic]) {
      topicStats[res.topic] = { total: 0, correct: 0 };
    }
    topicStats[res.topic].total += 1;
    if (res.isCorrect) {
      topicStats[res.topic].correct += 1;
    }
  });

  const topics = Object.entries(topicStats).map(([name, stats]) => ({
    name,
    accuracy: Math.round((stats.correct / stats.total) * 100),
    total: stats.total,
    correct: stats.correct
  })).sort((a, b) => b.accuracy - a.accuracy);

  const strongAreas = topics.filter(t => t.accuracy >= 70);
  const weakAreas = topics.filter(t => t.accuracy < 70);

  return (
    <SidebarLayout>
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="space-y-6">
           <button 
             onClick={() => router.back()}
             className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
           >
             <ArrowLeft className="w-4 h-4" />
             Back to Results
           </button>
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-[0.2em]">Post-Session Intelligence</div>
                <h1 className="text-6xl font-black display-font leading-none tracking-tighter text-slate-900 dark:text-white">
                  Performance <span className="text-slate-400 dark:text-slate-500 italic">Audit.</span>
                </h1>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 p-6 rounded-[2rem] shadow-sm">
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{data.score}/{data.total}</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">Final Score</div>
                 </div>
                 <div className="bg-indigo-600 p-6 rounded-[2rem] shadow-xl shadow-indigo-100 dark:shadow-none">
                    <div className="text-3xl font-black text-white">{Math.round((data.score / data.total) * 100)}%</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-indigo-200">Accuracy</div>
                 </div>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Summary Stats */}
           <div className="lg:col-span-2 space-y-8">
              <section className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 rounded-[3rem] p-10 shadow-premium space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-[#1d3e8e] dark:text-indigo-400">
                       <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Topic Proficiency</h3>
                 </div>

                 <div className="space-y-6">
                    {topics.map((topic, i) => (
                      <div key={i} className="space-y-3">
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{topic.name}</span>
                            <span className="text-xs font-black text-slate-400">{topic.accuracy}%</span>
                         </div>
                         <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${topic.accuracy}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className={`h-full rounded-full ${
                                topic.accuracy >= 70 ? 'bg-emerald-500' : topic.accuracy >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-[2.5rem] p-8 space-y-4">
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                       <TrendingUp className="w-5 h-5" />
                       <h4 className="font-black text-sm uppercase tracking-widest">Strong Areas</h4>
                    </div>
                    <div className="space-y-2">
                       {strongAreas.length > 0 ? strongAreas.map((area, i) => (
                         <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            {area.name}
                         </div>
                       )) : <div className="text-slate-400 italic text-sm">No topics mastered yet.</div>}
                    </div>
                 </div>

                 <div className="bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10 rounded-[2.5rem] p-8 space-y-4">
                    <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
                       <Brain className="w-5 h-5" />
                       <h4 className="font-black text-sm uppercase tracking-widest">Growth Areas</h4>
                    </div>
                    <div className="space-y-2">
                       {weakAreas.length > 0 ? weakAreas.map((area, i) => (
                         <div key={i} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm">
                            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                            {area.name}
                         </div>
                       )) : <div className="text-slate-400 italic text-sm">No weak areas identified. Great job!</div>}
                    </div>
                 </div>
              </div>
           </div>

           {/* AI Recommendations */}
           <div className="space-y-8">
              <section className="bg-[#1d3e8e] text-white rounded-[3rem] p-10 shadow-xl space-y-8">
                 <div className="space-y-2">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                       <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-black display-font">AI Tutor <br/><span className="text-indigo-200 italic">Insights.</span></h3>
                 </div>

                 <p className="text-indigo-100/80 text-sm leading-relaxed font-medium">
                    Based on your performance in <b>{data.subject}</b>, I recommend focusing on <b>{weakAreas[0]?.name || "advanced topics"}</b>. 
                    Your understanding of <b>{strongAreas[0]?.name || "fundamentals"}</b> is exceptional.
                 </p>

                 <div className="pt-4 border-t border-white/10 space-y-4">
                    <Link href={`/practice/arena?topic=${weakAreas[0]?.name || ''}`} className="block">
                       <button className="w-full bg-white text-[#1d3e8e] py-4 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                          Target Weak Areas
                       </button>
                    </Link>
                    <Link href="/practice/arena" className="block text-center text-xs font-bold text-indigo-200 hover:text-white transition-colors">
                       Try Another Subject
                    </Link>
                 </div>
              </section>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-sm text-center space-y-4">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Milestone</div>
                 <h4 className="font-bold text-slate-900 dark:text-white">Reach 90% in {data.subject}</h4>
                 <div className="w-full h-1 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[65%]" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

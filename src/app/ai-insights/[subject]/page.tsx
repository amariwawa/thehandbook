"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import { subjects, topics as fallbackTopics } from "@/lib/data";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Brain, Target, TrendingUp, Zap, Sparkles, BarChart3, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SubjectInsightDeepDive() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const { activeExamType } = useSubjectSelection();
  
  const allSubjects = [
    ...Object.values(subjects.waec).flat(),
    ...subjects.jamb,
    ...subjects.bece
  ];
  const currentSubject = allSubjects.find((s: any) => s.id === subjectId);
  
  const [subjectTopics, setSubjectTopics] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoadingTopics(true);
      try {
        const res = await fetch(`/api/syllabus/topics?subject=${subjectId}&exam=${activeExamType || 'waec'}`);
        const data = await res.json();
        setSubjectTopics(data.topics || []);
      } catch (error) {
        console.error("Failed to fetch topics:", error);
        setSubjectTopics(fallbackTopics[subjectId as keyof typeof fallbackTopics] || []);
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, [subjectId, activeExamType]);

  if (!currentSubject) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
             <Brain className="w-10 h-10" />
          </div>
          <div className="space-y-2">
             <h1 className="text-4xl font-black display-font text-slate-900">Analysis Not Found</h1>
             <p className="text-slate-500 font-medium max-w-sm">We couldn't locate the scholarly data for this specific subject stack item.</p>
          </div>
          <button onClick={() => router.back()} className="text-[#1d3e8e] font-black uppercase tracking-widest text-[10px] border-b-2 border-indigo-100">Go Back</button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-16 pb-20 max-w-6xl mx-auto">
        <header className="space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Intelligence Hub
            </button>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">
               <Sparkles className="w-4 h-4 fill-current" />
               Deep Topic Analysis
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
             <div className="w-48 h-48 bg-white rounded-[4rem] p-8 shadow-premium flex items-center justify-center border border-slate-100">
                <img src={currentSubject.image} alt={currentSubject.name} className="w-full h-full object-contain" />
             </div>
             <div className="space-y-4 text-center md:text-left flex-1">
                <h1 className="text-7xl font-black display-font leading-none tracking-tighter text-slate-900 dark:text-white transition-all">
                   {currentSubject.name} <span className="text-[#1d3e8e] dark:text-indigo-400">Deep Dive.</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                   Granular performance breakdown across the entire curriculum of {currentSubject.name}. Predictive analytics suggest focus on specific developmental nodes.
                </p>
             </div>
          </div>
        </header>

        {/* Topic Metrics Grid */}
        <section className="space-y-12">
           <div className="flex justify-between items-end border-b-2 border-slate-900/5 pb-8 px-4">
              <div className="space-y-2">
                 <h2 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight leading-none uppercase">Curriculum Hub.</h2>
                 <p className="text-slate-500 font-medium">Topic-by-topic predictive scoring based on your session history.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {loadingTopics ? (
                <div className="col-span-2 flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="w-8 h-8 text-[#1d3e8e] animate-spin" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Syllabus Topics...</p>
                </div>
              ) : subjectTopics.length === 0 ? (
                <div className="col-span-2 text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">
                  No topics found for this subject.
                </div>
              ) : subjectTopics.map((topic, i) => {
                 const mastery = 85 - (i * 8) > 30 ? 85 - (i * 8) : 32;
                 const color = mastery > 80 ? 'emerald' : mastery > 60 ? 'amber' : 'rose';
                 
                 return (
                    <motion.div 
                       key={topic}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                       className="bg-white rounded-3xl border border-slate-200 shadow-soft hover:shadow-premium transition-all flex flex-col group overflow-hidden"
                    >
                       <div className="p-10 space-y-10 flex-1">
                          <div className="flex justify-between items-start">
                             <div className="space-y-2">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Analytics Node {i + 1}</div>
                                <h3 className="text-3xl font-black display-font text-slate-900 tracking-tight leading-none uppercase">{topic}</h3>
                             </div>
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 border rounded-xl flex items-center justify-center font-black text-xl display-font transition-colors ${
                                   color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                   color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                   'bg-rose-50 text-rose-600 border-rose-100'
                                 }`}>
                                    {mastery}%
                                 </div>
                          </div>

                          <div className="space-y-6">
                             <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Proficiency index</span>
                                <span className="text-xs font-bold text-slate-900">{mastery < 50 ? 'Critical' : 'Stable'}</span>
                             </div>
                             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${mastery}%` }}
                                   transition={{ duration: 1, delay: 0.5 }}
                                   className={`h-full ${color === 'emerald' ? 'bg-[#10b981]' : color === 'amber' ? 'bg-[#f59e0b]' : 'bg-[#ef4444]'}`}
                                />
                             </div>
                          </div>
                       </div>

                       <div className="bg-slate-50 p-6 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-[#1d3e8e]" />
                             </div>
                             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Cycles: {Math.floor(mastery / 12)}</span>
                          </div>
                          <Link href={`/practice/session/waec/${subjectId}`}>
                             <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-lg hover:bg-indigo-600 flex items-center gap-2">
                                Launch Drill
                             </button>
                          </Link>
                       </div>
                    </motion.div>
                 );
              })}
           </div>
        </section>
      </div>
    </SidebarLayout>
  );
}

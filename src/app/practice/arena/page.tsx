"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import { topics } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, Target, BookOpen, ChevronRight, Play, Sparkles, ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function PracticeArenaPage() {
  const { getSelectedSubjectDetails, activeExamType } = useSubjectSelection();
  const selectedDetails = getSelectedSubjectDetails('mixed');
  
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const currentSubject = useMemo(() => 
    selectedDetails.find(s => s.id === selectedSubjectId),
    [selectedSubjectId, selectedDetails]
  );

  const availableTopics = useMemo(() => {
    if (!selectedSubjectId) return [];
    return topics[selectedSubjectId as keyof typeof topics] || ["Foundational Principles", "Advanced Concepts", "Core Theories", "Final Assessment"];
  }, [selectedSubjectId]);

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedSubjectId) {
      setSelectedSubjectId(null);
    }
  };

  return (
    <SidebarLayout>
      <div className="space-y-16 pb-20 max-w-5xl mx-auto">
        <header className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-[0.4em]">
              <Target className="w-4 h-4" />
              Academic Arena
            </div>
            {(selectedSubjectId || selectedTopic) && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all text-xs font-black uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            <h1 className="text-7xl font-black display-font leading-none tracking-tighter text-slate-900">
              {selectedTopic ? "Begin" : selectedSubjectId ? "Choose" : "Choose Your"} <span className="text-[#1d3e8e]">{selectedTopic ? "Drill." : selectedSubjectId ? "Topic." : "Subject."}</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
              {selectedTopic 
                ? `You are about to enter a specialized session focused on ${selectedTopic}.`
                : selectedSubjectId 
                ? `Select a curriculum topic for ${currentSubject?.name}. AI will generate questions specific to this domain.` 
                : "Select a subject from your stack to launch a high-precision practice session."}
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!selectedSubjectId ? (
            /* Step 1: Subject Selection (from Active Stack) */
            <motion.div 
               key="subject-step"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="space-y-12"
            >
               {selectedDetails.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {selectedDetails.map((sub) => (
                        <motion.div
                           key={sub.id}
                           whileHover={{ y: -12 }}
                           onClick={() => setSelectedSubjectId(sub.id)}
                           className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-soft hover:shadow-premium transition-all flex flex-col gap-10 group cursor-pointer"
                        >
                           <div className="flex items-center gap-6">
                              <div className="w-20 h-20 bg-slate-50 rounded-[2rem] p-4 group-hover:bg-[#1d3e8e] transition-colors overflow-hidden flex items-center justify-center">
                                 <img src={sub.image} alt={sub.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 space-y-1 text-left">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">READY FOR SESSION</span>
                                 <div className="text-3xl font-black display-font text-slate-900 tracking-tight leading-tight">{sub.name}</div>
                              </div>
                           </div>
                           <div className="space-y-8">
                              <p className="text-sm text-slate-500 font-medium leading-relaxed text-left">
                                 Full exam simulation ready. {topics[sub.id as keyof typeof topics]?.length || 6} curriculum topics are mapped for AI follow-up.
                              </p>
                              <div className="bg-slate-900 text-white py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2">
                                 <Play className="w-4 h-4 fill-current" />
                                 Topical-Based Learning
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               ) : (
                  <div className="col-span-full py-20 text-center space-y-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                     <BookOpen className="w-16 h-16 text-slate-200 mx-auto" />
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black display-font text-slate-900">Your Stack is Empty</h3>
                        <p className="text-slate-500 font-medium">Add subjects to your academic stack to enable practice.</p>
                     </div>
                     <Link href="/practice/custom">
                        <button className="bg-[#1d3e8e] text-white px-12 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                           Build My Stack
                        </button>
                     </Link>
                  </div>
               )}
            </motion.div>
          ) : !selectedTopic ? (
            /* Step 2: Topic Selection */
            <motion.div 
               key="topic-step"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-12"
            >
               <div className="flex items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-soft">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl p-3 shadow-soft">
                     <img src={currentSubject?.image} alt={currentSubject?.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-[#1d3e8e] uppercase tracking-[0.4em]">Active Selection</div>
                     <div className="text-3xl font-black display-font text-slate-900 tracking-tight">{currentSubject?.name}</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableTopics.map((topic, i) => (
                    <motion.button
                      key={topic}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 10, scale: 1.01 }}
                      onClick={() => setSelectedTopic(topic)}
                      className="bg-white rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-lg hover:border-indigo-100 text-left flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-[#1d3e8e] transition-colors font-black text-sm">
                           0{i + 1}
                        </div>
                        <span className="text-lg font-bold text-slate-700 group-hover:text-slate-900">{topic}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1d3e8e] group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
               </div>
            </motion.div>
          ) : (
            /* Step 3: Launch Confirmation */
            <motion.div 
               key="confirm-step"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-slate-900 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-premium min-h-[500px] flex items-center"
            >
               <div className="absolute top-0 right-0 p-20 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <Orbit className="w-96 h-96 animate-pulse" />
               </div>

               <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8">
                     <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] bg-white w-fit">
                        <Sparkles className="w-3 h-3" /> Ready to Launch
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-5xl font-black display-font leading-none tracking-tight">
                           Arena Selection <br/>
                           <span className="text-indigo-400">Confirmed.</span>
                        </h2>
                        <div className="flex items-center gap-4 pt-4">
                           <div className="px-6 py-2 bg-white/10 rounded-xl text-sm font-bold border border-white/10 uppercase tracking-widest">
                              {currentSubject?.name}
                           </div>
                           <div className="px-6 py-2 bg-indigo-500/20 rounded-xl text-sm font-bold border border-indigo-500/20 uppercase tracking-widest text-indigo-300">
                              {selectedTopic}
                           </div>
                        </div>
                     </div>
                     
                     <Link href={`/practice/session/${activeExamType}/${selectedSubjectId}?topic=${encodeURIComponent(selectedTopic || '')}`}>
                        <button className="bg-white text-[#1d3e8e] px-12 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-4 hover:bg-slate-50">
                           <Play className="w-5 h-5 fill-current" />
                           Topical-Based Learning
                        </button>
                     </Link>
                  </div>

                  <div className="hidden md:flex flex-col gap-6">
                     {[
                        "Continuous AI Performance Monitoring",
                        "Topic-Specific Theoretical Simulation",
                        "Instant Scholarship Grade Prediction"
                     ].map((feat, k) => (
                        <div key={k} className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                           <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                              <Target className="w-5 h-5 text-indigo-300" />
                           </div>
                           <span className="text-sm font-medium text-white/80">{feat}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SidebarLayout>
  );
}

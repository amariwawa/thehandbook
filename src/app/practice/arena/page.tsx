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
      <div className="space-y-16 pb-20 max-w-5xl mx-auto text-white">
        <header className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs uppercase tracking-[0.4em]">
              <Target className="w-4 h-4" />
              Academic Arena
            </div>
            {(selectedSubjectId || selectedTopic) && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold display-font leading-none tracking-tighter text-white">
              {selectedTopic ? "Begin" : selectedSubjectId ? "Choose" : "Choose Your"} <span className="text-indigo-500">{selectedTopic ? "Drill." : selectedSubjectId ? "Topic." : "Subject."}</span>
            </h1>
            <p className="text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed">
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
                           whileHover={{ y: -5 }}
                           onClick={() => setSelectedSubjectId(sub.id)}
                           className="bg-[#0a0a0a] rounded-xl p-6 border border-zinc-800 hover:border-indigo-500/50 transition-all flex flex-col gap-6 group cursor-pointer shadow-2xl"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-[#141414] rounded-lg p-3 group-hover:bg-indigo-500/10 transition-colors overflow-hidden flex items-center justify-center border border-zinc-800">
                                 <img src={sub.image} alt={sub.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="flex-1 space-y-1 text-left">
                                 <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">READY FOR SESSION</span>
                                 <div className="text-2xl font-bold display-font text-white tracking-tight leading-tight">{sub.name}</div>
                              </div>
                           </div>
                           <div className="space-y-6">
                              <p className="text-sm text-zinc-400 font-medium leading-relaxed text-left">
                                 Full exam simulation ready. {topics[sub.id as keyof typeof topics]?.length || 6} curriculum topics are mapped for AI follow-up.
                              </p>
                              <div className="bg-[#141414] border border-zinc-800 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:bg-indigo-500 group-hover:border-indigo-500">
                                 <Play className="w-3 h-3 fill-current" />
                                 Topical Learning
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>
               ) : (
                  <div className="col-span-full py-20 text-center space-y-8 bg-[#0a0a0a] rounded-xl border border-dashed border-zinc-800">
                     <BookOpen className="w-16 h-16 text-zinc-700 mx-auto" />
                     <div className="space-y-2">
                        <h3 className="text-2xl font-bold display-font text-white">Your Stack is Empty</h3>
                        <p className="text-zinc-400 font-medium">Add subjects to your academic stack to enable practice.</p>
                     </div>
                     <Link href="/practice/custom">
                        <button className="bg-indigo-500 text-white px-8 py-3 rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-indigo-600">
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
               <div className="flex items-center gap-6 bg-[#0a0a0a] p-6 rounded-xl border border-zinc-800 shadow-2xl">
                  <div className="w-14 h-14 bg-[#141414] rounded-lg p-2 border border-zinc-800">
                     <img src={currentSubject?.image} alt={currentSubject?.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em]">Active Selection</div>
                     <div className="text-2xl font-bold display-font text-white tracking-tight">{currentSubject?.name}</div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableTopics.map((topic, i) => (
                    <motion.button
                      key={topic}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ x: 5, scale: 1.01 }}
                      onClick={() => setSelectedTopic(topic)}
                      className="bg-[#0a0a0a] rounded-xl p-6 border border-zinc-800 shadow-soft hover:border-indigo-500/50 text-left flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#141414] rounded-lg flex items-center justify-center text-zinc-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-colors font-black text-xs border border-zinc-800">
                           0{i + 1}
                        </div>
                        <span className="text-base font-bold text-zinc-300 group-hover:text-white">{topic}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
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
               className="bg-[#0a0a0a] rounded-xl p-12 text-white relative overflow-hidden border border-zinc-800 shadow-2xl min-h-[400px] flex items-center"
            >
               <div className="absolute top-0 right-0 p-10 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                  <Orbit className="w-96 h-96 animate-pulse text-indigo-500" />
               </div>

               <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <div className="flex items-center gap-2 bg-[#141414] border border-zinc-800 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-500 w-fit">
                        <Sparkles className="w-3 h-3" /> Ready to Launch
                     </div>
                     <div className="space-y-2">
                        <h2 className="text-4xl font-bold display-font leading-none tracking-tight">
                           Arena Selection <br/>
                           <span className="text-indigo-400">Confirmed.</span>
                        </h2>
                        <div className="flex items-center gap-3 pt-4">
                           <div className="px-4 py-1.5 bg-[#141414] border border-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-300">
                              {currentSubject?.name}
                           </div>
                           <div className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-bold uppercase tracking-widest text-indigo-400">
                              {selectedTopic}
                           </div>
                        </div>
                     </div>
                     
                     <Link href={`/practice/session/${activeExamType}/${selectedSubjectId}?topic=${encodeURIComponent(selectedTopic || '')}`}>
                        <button className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3 hover:bg-indigo-600">
                           <Play className="w-4 h-4 fill-current" />
                           Launch Session
                        </button>
                     </Link>
                  </div>

                  <div className="hidden md:flex flex-col gap-4">
                     {[
                        "Continuous AI Performance Monitoring",
                        "Topic-Specific Theoretical Simulation",
                        "Instant Scholarship Grade Prediction"
                     ].map((feat, k) => (
                        <div key={k} className="flex items-center gap-4 p-4 bg-[#141414] rounded-lg border border-zinc-800">
                           <div className="w-8 h-8 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                              <Target className="w-4 h-4 text-indigo-400" />
                           </div>
                           <span className="text-sm font-medium text-zinc-300">{feat}</span>
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

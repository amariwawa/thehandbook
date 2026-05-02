"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { subjects, exams } from "@/lib/data";
import { useSubjectSelection, ExamType } from "@/context/SubjectSelectionContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Search, 
  Trash2, 
  Play, 
  Check, 
  Plus,
  Layers,
  Sparkles,
  Globe,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CustomPracticePage() {
  const { 
    selectedSubjects, 
    toggleSubject, 
    clearStack, 
    getSelectedSubjectDetails,
    activeExamType,
    setActiveExamType
  } = useSubjectSelection();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | 'all'>('all');

  // Sync active exam type with URL param if provided
  useEffect(() => {
    const examParam = searchParams.get('exam') as ExamType;
    if (examParam && ['waec', 'jamb', 'bece', 'mixed'].includes(examParam)) {
      setActiveExamType(examParam);
    }
  }, [searchParams, setActiveExamType]);

  const selectedDetails = getSelectedSubjectDetails(activeExamType);
  const currentExamInfo = activeExamType !== 'mixed' ? exams[activeExamType as keyof typeof exams] : null;

  // Get unique subjects by category/level
  const seniorSubjects = useMemo(() => {
    if (activeExamType === 'jamb') {
      return (subjects.jamb || []).filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeExamType === 'waec') {
      let waecList: any[] = [];
      if (selectedDepartment === 'all') {
        waecList = Object.values(subjects.waec).flat();
      } else {
        waecList = (subjects.waec as any)[selectedDepartment] || [];
      }
      // Deduplicate by ID
      const map = new Map();
      waecList.forEach(s => map.set(s.id, s));
      return Array.from(map.values()).filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Default or mixed
    const map = new Map();
    const allSenior = [
      ...Object.values(subjects.waec).flat(),
      ...(subjects.jamb || [])
    ];
    allSenior.forEach((s: any) => {
      map.set(s.id, s);
    });
    return Array.from(map.values()).filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activeExamType, selectedDepartment]);

  const juniorSubjects = useMemo(() => {
    return (subjects.bece || []).filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const isBeceMode = activeExamType === 'bece';

  return (
    <SidebarLayout>
      <div className="space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 w-full">
            <div className="flex justify-between items-end border-b border-slate-100 pb-8">
              <div className="space-y-2">
                <h1 className="text-6xl font-black display-font leading-none tracking-tighter text-slate-900 dark:text-white transition-all">
                  Subject <span className="text-[#1d3e8e] dark:text-indigo-400">Curator.</span>
                </h1>
                <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Build your scholarly stack for {activeExamType.toUpperCase()} excellence.</p>
              </div>
              <div className="flex gap-4">
                <Link href="/dashboard" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-b-2 border-transparent hover:border-slate-200 transition-all pb-1">
                   Back to Overview
                </Link>
                <Link 
                  href={activeExamType !== 'mixed' ? `/exams/${activeExamType}` : "/practice"}
                  className="text-[10px] font-black text-[#1d3e8e] uppercase tracking-[0.4em] border-b-2 border-indigo-100 hover:border-indigo-600 transition-all pb-1"
                >
                  {activeExamType !== 'mixed' ? `Back to ${activeExamType.toUpperCase()}` : "Browse All"}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-6">
            {/* Stack Switcher */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl">
               {(['waec', 'jamb', 'bece', 'mixed'] as ExamType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveExamType(type)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeExamType === type 
                        ? 'bg-white dark:bg-white/10 text-[#1d3e8e] dark:text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
               ))}
            </div>

            <div className="relative group w-full">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-[#1d3e8e] transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Find a subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 rounded-2xl py-4 pl-14 pr-8 text-sm font-bold text-slate-900 dark:text-white shadow-soft dark:shadow-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 outline-none w-full md:w-80 transition-all"
              />
            </div>
          </div>
        </header>

        {/* Stack Visualizer */}
        <section className="bg-slate-900 rounded-[4rem] p-12 text-white relative overflow-hidden shadow-premium min-h-[400px] flex items-center">
          <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
             <Sparkles className="w-96 h-96" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] bg-white">
                Active {activeExamType !== 'mixed' ? activeExamType.toUpperCase() : "Global"} Stack
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black display-font tracking-tight">
                  {selectedSubjects.length > 0 
                    ? `${selectedSubjects.length} Subjects Ready` 
                    : "Your Stack is Empty"}
                </h2>
                <p className="text-lg text-white/60 font-medium leading-relaxed max-w-md">
                  {selectedSubjects.length > 0 
                    ? "Your selection is automatically synchronized. You can start a mixed session or review topics individually."
                    : "Start by picking subjects below to create your customized academic priority list."}
                </p>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                {selectedSubjects.length > 0 && (
                  <>
                    <button className="bg-white text-[#1d3e8e] px-10 py-5 rounded-[2rem] font-bold text-sm shadow-xl active:scale-95 transition-all flex items-center gap-3">
                      <Play className="w-4 h-4 fill-current" />
                      Start {activeExamType !== 'mixed' ? activeExamType.toUpperCase() : "Mixed"} Session
                    </button>
                    <button 
                      onClick={clearStack}
                      className="text-white/50 hover:text-white font-bold text-sm flex items-center gap-2 transition-colors px-6"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear Stack
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="relative flex items-center justify-center h-64 lg:h-80">
               <AnimatePresence>
                 {selectedDetails.length === 0 ? (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="flex flex-col items-center gap-4 text-white/20"
                   >
                     <Layers className="w-24 h-24" />
                     <span className="text-sm font-black uppercase tracking-[0.3em]">No Active Selection</span>
                   </motion.div>
                 ) : (
                   <div className="relative w-full h-full flex items-center justify-center">
                     {selectedDetails.slice(0, 5).map((sub, i) => (
                        <motion.div
                          key={sub.id}
                          initial={{ opacity: 0, x: 50, rotate: 15 }}
                          animate={{ 
                            opacity: 1, 
                            x: i * 30 - ((selectedDetails.slice(0, 5).length - 1) * 15), 
                            rotate: i * 5 - ((selectedDetails.slice(0, 5).length - 1) * 2.5),
                            zIndex: 10 - i 
                          }}
                          exit={{ opacity: 0, x: -50 }}
                          className="absolute w-40 h-40 bg-white rounded-[2.5rem] p-6 shadow-2xl border-4 border-[#1d3e8e]/10 flex flex-col items-center justify-between"
                        >
                          <img src={sub.image} alt={sub.name} className="w-full h-2/3 object-contain" />
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest text-center">{sub.name}</span>
                        </motion.div>
                      ))}
                      {selectedDetails.length > 5 && (
                        <div className="absolute top-0 right-0 bg-white text-[#1d3e8e] w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-lg z-20 translate-x-1/2 -translate-y-1/2 border-4 border-slate-900">
                          +{selectedDetails.length - 5}
                        </div>
                      )}
                   </div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Selection Grid - Junior Secondary (First if in BECE mode) */}
        {(isBeceMode || activeExamType === 'mixed') && (
          <section id="junior-subjects" className="space-y-12">
            <div className="flex items-center justify-between border-b border-slate-100 pb-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                   <Plus className="w-6 h-6" />
                </div>
                <h2 className="text-5xl font-black display-font text-slate-900 dark:text-white tracking-tight">Junior Secondary <span className="text-emerald-600 dark:text-emerald-400">(BECE)</span></h2>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                {juniorSubjects.length} SUBJECTS
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {juniorSubjects.map((sub, i) => {
                 const isSelected = selectedSubjects.includes(sub.id);
                 return (
                   <motion.div
                     key={sub.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     whileHover={{ y: -12, scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => toggleSubject(sub.id)}
                     className={`card-editorial p-10 h-full flex flex-col justify-between min-h-[460px] border-2 transition-all shadow-premium cursor-pointer group ${
                       isSelected 
                         ? 'border-emerald-500 bg-emerald-50/10 shadow-emerald-100/50' 
                         : 'border-transparent hover:border-emerald-100 bg-white'
                     }`}
                   >
                     <div>
                       <div className={`w-28 h-28 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-soft group-hover:bg-emerald-50 transition-colors p-4 group-hover:rotate-3 transition-transform duration-500`}>
                         <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                       </div>
                       <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            {isSelected ? (
                              <>
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Active in Stack</span>
                              </>
                            ) : (
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Junior Catalog</span>
                            )}
                         </div>
                         <h3 className="text-4xl font-black display-font text-emerald-600 transition-colors uppercase tracking-tight leading-none">{sub.name}</h3>
                         <p className="text-base text-slate-500 font-medium leading-relaxed">
                            Foundational BECE subject. Add {sub.name} to your active stack to prioritize it in your AI Tutoring and Mixed sessions.
                         </p>
                       </div>
                     </div>
                     
                     <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-8">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                             isSelected ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800 group-hover:bg-emerald-500'
                           }`}>
                              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                           </div>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${
                             isSelected ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600'
                           }`}>
                             {isSelected ? "Active in Stack" : "Add to Stack"}
                           </span>
                        </div>
                        {!isSelected && <ChevronRight className="w-5 h-5 text-slate-300 dark:text-zinc-700 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />}
                     </div>
                   </motion.div>
                 );
               })}
            </div>
          </section>
        )}

        {/* Selection Grid - Senior Secondary */}
        {(!isBeceMode || activeExamType === 'mixed') && (
          <section id="senior-subjects" className="space-y-12">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-[#1d3e8e] dark:text-indigo-400">
                   <Check className="w-6 h-6" />
                </div>
                <h2 className="text-5xl font-black display-font text-slate-900 dark:text-white tracking-tight">
                  Senior Secondary <span className="text-[#1d3e8e] dark:text-indigo-400">({activeExamType === 'mixed' ? 'WAEC/JAMB' : activeExamType.toUpperCase()})</span>
                </h2>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                {seniorSubjects.length} SUBJECTS
              </div>
            </div>

            {activeExamType === 'waec' && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
                {['all', 'science', 'arts', 'commercial', 'technical'].map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                      selectedDepartment === dept 
                        ? 'bg-[#1d3e8e] border-[#1d3e8e] text-white shadow-xl translate-y-[-2px]' 
                        : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/5 text-slate-500 hover:border-indigo-100 dark:hover:border-indigo-900'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {seniorSubjects.map((sub, i) => {
                 const isSelected = selectedSubjects.includes(sub.id);
                 return (
                   <motion.div
                     key={sub.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 }}
                     whileHover={{ y: -12, scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => toggleSubject(sub.id)}
                     className={`card-editorial p-10 h-full flex flex-col justify-between min-h-[460px] border-2 transition-all shadow-premium cursor-pointer group ${
                       isSelected 
                         ? 'border-[#1d3e8e] bg-indigo-50/10 shadow-indigo-100/50' 
                         : 'border-transparent hover:border-indigo-100 bg-white'
                     }`}
                   >
                     <div>
                       <div className={`w-28 h-28 bg-slate-50 dark:bg-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-soft group-hover:bg-indigo-50 transition-colors p-4 group-hover:rotate-3 transition-transform duration-500`}>
                         <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                       </div>
                       <div className="space-y-4">
                         <div className="flex items-center gap-2">
                            {isSelected ? (
                              <>
                                <div className="w-2.5 h-2.5 bg-[#1d3e8e] dark:bg-indigo-400 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-[0.4em]">Active in Stack</span>
                              </>
                            ) : (
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Senior Catalog</span>
                            )}
                         </div>
                         <h3 className="text-4xl font-black display-font text-[#1d3e8e] transition-colors uppercase tracking-tight leading-none">{sub.name}</h3>
                         <p className="text-base text-slate-500 font-medium leading-relaxed">
                            Advanced Secondary curriculum. Add {sub.name} to your academic priority stack for focused WAEC & JAMB excellence.
                         </p>
                       </div>
                     </div>
                     
                     <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-8">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                             isSelected ? 'bg-[#1d3e8e]' : 'bg-slate-200 dark:bg-zinc-800 group-hover:bg-[#1d3e8e]'
                           }`}>
                              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                           </div>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${
                             isSelected ? 'text-[#1d3e8e]' : 'text-slate-400 group-hover:text-[#1d3e8e]'
                           }`}>
                             {isSelected ? "Active in Stack" : "Add to Stack"}
                           </span>
                        </div>
                        {!isSelected && <ChevronRight className="w-5 h-5 text-slate-300 dark:text-zinc-700 group-hover:text-[#1d3e8e] group-hover:translate-x-1 transition-all" />}
                     </div>
                   </motion.div>
                 );
               })}
            </div>
          </section>
        )}
      </div>
    </SidebarLayout>
  );
}

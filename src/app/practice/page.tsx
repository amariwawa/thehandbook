"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { GeistMono } from "geist/font/mono";
import { subjects as allSubjectsData } from "@/lib/data";
import { 
  Search, 
  ArrowLeft, 
  Play, 
  BookOpen, 
  ChevronRight,
  Calculator,
  Zap,
  Microscope,
  Atom,
  Languages,
  Gavel,
  FlaskConical,
  Plus,
  ArrowRight,
  GraduationCap,
  Smile,
  Orbit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";

const subjectsData = [
  { id: 'mathematics', name: "Mathematics", image: "/subjects/mathematics_v2.png", color: "bg-indigo-50" },
  { id: 'physics', name: "Physics", image: "/subjects/physics_v2.png", color: "bg-blue-50" },
  { id: 'biology', name: "Biology", image: "/subjects/biology_v2.png", color: "bg-teal-50" },
  { id: 'english', name: "English", image: "/subjects/english_v2.png", color: "bg-purple-50" },
  { id: 'economics', name: "Economics", image: "/subjects/economics_v2.png", color: "bg-orange-50" },
  { id: 'chemistry', name: "Chemistry", image: "/subjects/chemistry_v2.png", color: "bg-rose-50" },
];

export default function PracticePage() {
  const { selectedSubjects, toggleSubject, getSelectedSubjectDetails, setActiveExamType } = useSubjectSelection();
  
  // For the main practice hub, we show the 'mixed' stack by default
  const selectedDetails = getSelectedSubjectDetails('mixed');

  const [activeExam, setActiveExam] = useState<'waec' | 'jamb' | 'bece'>('waec');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string | null>(null);
  const [topicsList, setTopicsList] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [subjectQuery, setSubjectQuery] = useState("");

  const handleSelectSubject = async (subId: string, subName: string) => {
    setSelectedSubjectId(subId);
    setSelectedSubjectName(subName);
    setLoadingTopics(true);
    setTopicsList([]);
    try {
      const res = await fetch(`/api/syllabus/topics?subject=${encodeURIComponent(subId)}&exam=${activeExam}`);
      const data = await res.json();
      if (data.topics && Array.isArray(data.topics)) {
        setTopicsList(data.topics);
      } else {
        setTopicsList(["Foundational Principles", "Advanced Concepts", "Core Theories", "Final Assessment"]);
      }
    } catch (err) {
      console.error("Error loading syllabus topics:", err);
      setTopicsList(["Foundational Principles", "Advanced Concepts", "Core Theories", "Final Assessment"]);
    } finally {
      setLoadingTopics(false);
    }
  };

  const getSubjectsForExam = () => {
    if (activeExam === 'waec') {
      return Object.values(allSubjectsData.waec).flat();
    }
    return allSubjectsData[activeExam] || [];
  };

  const filteredSubjects = getSubjectsForExam().filter(sub => 
    sub.name.toLowerCase().includes(subjectQuery.toLowerCase())
  );

  return (
    <SidebarLayout>
      <div className="space-y-16 pb-20">
        {/* Header Section */}
        <section className="relative flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
              <Play className="w-3 h-3 fill-current" />
              Academic Entry Point
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold display-font leading-none tracking-tighter text-slate-900 dark:text-white transition-all">
                 Choose Your <span className="text-[#1d3e8e] dark:text-indigo-400">Path.</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-lg leading-relaxed">
                Explore specialized curriculums to prepare for your specific mission-critical examinations.
              </p>
            </div>
          </motion.div>
          

        </section>

        {/* Categories Section - Unified Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WAEC Card */}
          <Link href="/exams/waec" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-soft hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-500/50 transition-all h-full flex flex-col items-center text-center space-y-6"
            >
               <div className="w-20 h-20 bg-indigo-50 dark:bg-white/5 rounded-3xl flex items-center justify-center text-[#1d3e8e] dark:text-indigo-400">
                  <GraduationCap className="w-10 h-10" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-4xl font-black display-font tracking-tight text-slate-900 dark:text-white group-hover:text-[#1d3e8e] dark:group-hover:text-indigo-400 transition-colors">WAEC</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Secondary Exit Exam</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    Comprehensive senior exit exams covering core science, art, and tech.
                  </p>
               </div>
               <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/20 group-hover:bg-[#1d3e8e] group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </motion.div>
          </Link>

          {/* JAMB Card */}
          <Link href="/exams/jamb" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[#1d3e8e] rounded-[3.5rem] p-8 text-white shadow-premium hover:shadow-2xl transition-all h-full flex flex-col items-center text-center space-y-6 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
               <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center relative z-10">
                  <Zap className="w-10 h-10" />
               </div>
               <div className="space-y-3 relative z-10">
                  <h2 className="text-4xl font-black display-font tracking-tight">JAMB</h2>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">UTME Entry Level</p>
                  <p className="text-xs text-white/70 font-medium leading-relaxed max-w-[200px]">
                    Official CBT simulations for university entrance preparation.
                  </p>
               </div>
               <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center relative z-10 group-hover:bg-white group-hover:text-[#1d3e8e] transition-all">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </motion.div>
          </Link>

          {/* BECE Card */}
          <Link href="/exams/bece" className="group">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-zinc-900 rounded-[3.5rem] p-8 border border-slate-100 dark:border-white/5 shadow-soft hover:shadow-xl hover:border-pink-100 dark:hover:border-pink-500/50 transition-all h-full flex flex-col items-center text-center space-y-6"
            >
               <div className="w-20 h-20 bg-pink-50 dark:bg-pink-500/10 rounded-3xl flex items-center justify-center text-pink-500">
                  <Smile className="w-10 h-10" />
               </div>
               <div className="space-y-3">
                  <h2 className="text-4xl font-black display-font tracking-tight text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">BECE</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Junior High School</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    Foundational exams for secondary school advancement.
                  </p>
               </div>
               <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-white/20 group-hover:bg-pink-500 group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </motion.div>
          </Link>

          {/* Mixed Custom Practice - Full Row Below */}
          <Link href="/practice/custom" className="md:col-span-3 block group">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                  <div className="w-64 h-64 border-[32px] border-white/10 rounded-full" />
               </div>
               <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                  <div className="flex-1 space-y-4">
                     <div className="flex items-center gap-4">
                        <h3 className="text-5xl font-bold display-font tracking-tight text-white">Academic Stack Builder</h3>
                     </div>
                     <p className="text-sm text-white/60 font-medium max-w-xl leading-relaxed">
                        Choose the official subjects you offer to build your academic stack. Our AI uses this selection to personalize your entire learning suite.
                     </p>
                  </div>
                  <div className="flex items-center gap-8">
                     <AnimatePresence mode="wait">
                        {selectedSubjects.length > 0 && (
                           <motion.div 
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -20 }}
                             className="flex flex-col items-end"
                           >
                              <span className="text-[10px] font-black uppercase text-indigo-300 mb-1">{selectedSubjects.length} subjects selected</span>
                              <div className="bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all">
                                 Edit My Stack
                              </div>
                           </motion.div>
                        )}
                        {selectedSubjects.length === 0 && (
                          <div className="bg-white/10 text-white px-10 py-4 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">
                             Build Stack
                          </div>
                        )}
                     </AnimatePresence>
                     <div className="hidden md:flex -space-x-3">
                        {selectedDetails.length > 0 ? (
                           selectedDetails.slice(0, 4).map((sub, i) => (
                             <div key={sub.id} className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-white overflow-hidden p-1 shadow-lg">
                                <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                             </div>
                           ))
                        ) : (
                           subjectsData.slice(0, 4).map((sub, i) => (
                             <div key={sub.id} className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-white overflow-hidden p-1 shadow-lg opacity-40">
                                <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                             </div>
                           ))
                        )}
                        {selectedSubjects.length > 4 && (
                          <div className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                             +{selectedSubjects.length - 4}
                          </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </Link>
        </section>

        {/* Topical-Based Learning Section */}
        <section className="bg-white dark:bg-[#0a0a0a] rounded-[3.5rem] border border-slate-100 dark:border-zinc-800/80 p-12 space-y-10 transition-colors shadow-soft">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 bg-[#1d3e8e]/5 dark:bg-[#141414] border border-[#1d3e8e]/10 dark:border-zinc-800 text-[#1d3e8e] dark:text-indigo-400 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                   <Zap className="w-3 h-3 fill-current" />
                   Active Learning Hub
                 </div>
                 <h2 className="text-4xl font-black display-font leading-none tracking-tight text-slate-900 dark:text-white">
                   Topical-Based <span className="text-[#1d3e8e] dark:text-indigo-400">Learning.</span>
                 </h2>
                 <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium max-w-xl">
                   Select an examination, choose a subject, and practice with high-precision questions built directly from the official syllabus topics.
                 </p>
              </div>

              {/* Exam Tabs Selector */}
              <div className="flex bg-slate-100 dark:bg-[#141414] p-1.5 rounded-2xl border border-slate-200/50 dark:border-zinc-800/50">
                 {['waec', 'jamb', 'bece'].map((exam) => (
                    <button
                      key={exam}
                      onClick={() => {
                        setActiveExam(exam as any);
                        setSelectedSubjectId(null);
                        setSelectedSubjectName(null);
                        setTopicsList([]);
                        setSubjectQuery("");
                      }}
                      className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        activeExam === exam
                          ? 'bg-[#1d3e8e] text-white shadow-lg'
                          : 'text-slate-400 hover:text-slate-950 dark:hover:text-white'
                      }`}
                    >
                      {exam}
                    </button>
                 ))}
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Subjects Panel */}
              <div className="lg:col-span-2 space-y-6">
                 <div className="flex items-center justify-between gap-4">
                    <div className="text-xs font-black uppercase text-slate-400 tracking-widest">Subjects Available</div>
                    {/* Subject search */}
                    <div className="relative max-w-xs flex-1">
                       <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                       <input 
                         type="text"
                         placeholder="Filter subjects..."
                         value={subjectQuery}
                         onChange={(e) => setSubjectQuery(e.target.value)}
                         className="w-full bg-slate-50 dark:bg-[#141414] border border-slate-100 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-[#1d3e8e] dark:focus:border-indigo-500"
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto pr-2 no-scrollbar">
                    {filteredSubjects.map((sub) => {
                       const isSelected = selectedSubjectId === sub.id;
                       return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelectSubject(sub.id, sub.name)}
                            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-95 ${
                              isSelected
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500 shadow-sm'
                                : 'bg-slate-50/50 dark:bg-[#0a0a0a] border-slate-100 dark:border-zinc-800 hover:border-slate-200 dark:hover:border-zinc-700'
                            }`}
                          >
                             <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 dark:border-zinc-700 shadow-sm shrink-0">
                                <img src={sub.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"} alt={sub.name} className="w-full h-full object-contain" />
                             </div>
                             <div className="truncate">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{sub.name}</div>
                                <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Tap to load topics</div>
                             </div>
                          </button>
                       );
                    })}
                 </div>
              </div>

              {/* Topics Panel */}
              <div className="bg-slate-50/50 dark:bg-[#141414] rounded-3xl p-6 border border-slate-100 dark:border-zinc-800/60 flex flex-col h-[420px] overflow-hidden">
                 <div className="space-y-1 mb-4 border-b border-slate-100 dark:border-zinc-800 pb-3">
                    <div className="text-[9px] font-black uppercase text-[#1d3e8e] dark:text-indigo-400 tracking-[0.15em]">Syllabus Curriculum</div>
                    <h3 className="text-sm font-black display-font text-slate-800 dark:text-slate-100 truncate">
                       {selectedSubjectName ? `${selectedSubjectName} Topics` : "Select a Subject"}
                    </h3>
                 </div>

                 <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-2">
                    {loadingTopics ? (
                       <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          <div className="text-[10px] font-black uppercase tracking-widest animate-pulse">Loading topics...</div>
                       </div>
                    ) : selectedSubjectId ? (
                       topicsList.map((topic, index) => (
                          <Link 
                            key={index}
                            href={`/practice/session/${activeExam}/${selectedSubjectId}?topic=${encodeURIComponent(topic)}`}
                            className="group block"
                          >
                             <div className="p-3 bg-white dark:bg-[#0a0a0a] border border-slate-100 dark:border-zinc-800 rounded-xl hover:border-[#1d3e8e] dark:hover:border-indigo-500 transition-all flex items-center justify-between gap-3 shadow-soft hover:shadow-md">
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-[#1d3e8e] dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-relaxed">
                                   {topic}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-zinc-600 group-hover:text-[#1d3e8e] dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                             </div>
                          </Link>
                       ))
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400 dark:text-zinc-600">
                          <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800/40 rounded-2xl flex items-center justify-center">
                             <BookOpen className="w-8 h-8 opacity-40" />
                          </div>
                          <div>
                             <div className="text-xs font-black uppercase tracking-wider mb-1">No Subject Selected</div>
                             <p className="text-[10px] max-w-[180px] leading-relaxed">Select any subject from the grid on the left to reveal all official topics.</p>
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </section>
      </div>
    </SidebarLayout>
  );
}

function GraduationCapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

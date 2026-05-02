"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
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
  Smile
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
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
            <h1 className="text-8xl font-black display-font leading-[0.85] tracking-tighter text-slate-900 dark:text-white transition-all">
               Choose Your <br/>
               <span className="text-[#1d3e8e] dark:text-indigo-400">Path.</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
              Explore specialized curriculums to prepare for your specific mission-critical examinations.
            </p>
          </motion.div>
          
          <Link href="/practice/arena" className="w-full lg:w-96 relative group">
             <div className="absolute -inset-4 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-[3rem] blur-3xl group-hover:bg-indigo-300/30 dark:group-hover:bg-indigo-900/20 transition-all opacity-0 group-hover:opacity-100" />
             <div className="relative bg-white dark:bg-zinc-900 rounded-[3.5rem] border border-slate-200 dark:border-white/5 shadow-premium overflow-hidden h-full flex flex-col group">
                <div className="p-10 space-y-8 flex-1">
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-[#1d3e8e] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                         <Zap className="w-8 h-8 fill-current" />
                      </div>
                      <div className="text-[10px] font-black text-[#1d3e8e] dark:text-indigo-400 bg-indigo-50 dark:bg-white/5 px-4 py-1.5 rounded-full uppercase tracking-widest">Active Hub</div>
                   </div>
                   
                   <div className="space-y-3">
                      <h3 className="text-3xl font-black display-font text-slate-900 dark:text-white tracking-tight leading-none uppercase">Topical-Based <br/> Learning.</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                         Access your scholarly stack and initiate high-precision AI practice sessions. 
                      </p>
                   </div>
                </div>

                <div className="bg-slate-50 dark:bg-black/40 p-8 border-t border-slate-100 dark:border-white/5 grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/5">
                   <div className="space-y-1">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Subjects</div>
                      <div className="text-xl font-black display-font text-slate-900 dark:text-white leading-none">{selectedSubjects.length} Active</div>
                   </div>
                   <div className="space-y-1 pl-8">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Ready</div>
                      <div className="text-xl font-black display-font text-indigo-600 dark:text-indigo-400 leading-none">NOW</div>
                   </div>
                </div>

                <div className="bg-slate-900 text-white px-10 py-5 flex items-center justify-between group-hover:bg-[#1d3e8e] transition-colors">
                   <span className="text-[10px] font-black uppercase tracking-[0.4em]">Launch Selection</span>
                   <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
             </div>
          </Link>
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
                     <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-300">
                        Subject Curator
                     </div>
                     <h3 className="text-4xl font-black display-font tracking-tight">Academic Stack Builder</h3>
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

        {/* Historical Archives */}
        <section className="bg-white dark:bg-black rounded-[5rem] border border-slate-100 dark:border-white/10 p-16 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center transition-colors">
           <div className="space-y-10">
              <h2 className="text-5xl font-black display-font leading-[0.95] tracking-tight text-slate-900 dark:text-white">
                Historical <br/>
                <span className="text-[#1d3e8e] dark:text-indigo-400">Archives.</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Access the most comprehensive database of past questions in West Africa. Choose a specific year to simulate real exam conditions.
              </p>
              <div className="grid grid-cols-4 gap-4">
                {[2024, 2023, 2022, 2021, 2020, 2019, 2018, "MORE"].map((year) => (
                  <button key={year} className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl py-3 text-[10px] font-black text-slate-500 dark:text-slate-300 hover:bg-[#1d3e8e] hover:text-white transition-all">
                    {year}
                  </button>
                ))}
              </div>
           </div>
           <div className="relative rounded-[4rem] overflow-hidden shadow-premium dark:shadow-none">
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2670" alt="Archives" className="w-full h-[450px] object-cover grayscale brightness-95 dark:brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d3e8e]/20 to-transparent" />
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

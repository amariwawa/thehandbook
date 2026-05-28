"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { exams, categories, subjects as allSubjectsData } from "@/lib/data";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Play } from "lucide-react";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";

export default function ExamTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string;
  const exam = exams[type as keyof typeof exams];
  const { getSelectedSubjectDetails } = useSubjectSelection();
  const selectedDetails = getSelectedSubjectDetails(type as any);

  const getSubjectCategory = (id: string) => {
    if (allSubjectsData.waec.science.find(s => s.id === id)) return 'science';
    if (allSubjectsData.waec.arts.find(s => s.id === id)) return 'arts';
    if (allSubjectsData.waec.commercial.find(s => s.id === id)) return 'commercial';
    if (allSubjectsData.waec.technical.find(s => s.id === id)) return 'technical';
    return 'science';
  };

  if (!exam) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Exam Not Found</h1>
          <button onClick={() => router.back()} className="text-[#1d3e8e] font-bold">Go Back</button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-20 pb-20">
        <header className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-10 flex-1">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Practice
            </button>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold display-font leading-none tracking-tighter text-slate-900 dark:text-white">
                {exam.title} <span className="text-[#1d3e8e] dark:text-indigo-400">Mastery.</span>
              </h1>
              <p className="text-sm text-zinc-400 font-medium max-w-2xl leading-relaxed">
                Precision practice for your active {exam.title} stack. Select a subject to begin.
              </p>
            </div>
          </div>

          <div className="pt-2">
             <Link href={`/practice/custom?exam=${type}`}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 px-8 py-4 rounded-2xl flex items-center gap-3 shadow-soft dark:shadow-none hover:shadow-xl hover:border-[#1d3e8e] dark:hover:border-indigo-500 transition-all group"
                >
                   <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-[#1d3e8e] dark:text-indigo-300 group-hover:bg-[#1d3e8e] group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                   </div>
                   <div className="text-left">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personalize</div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Edit {exam.title} Stack</div>
                   </div>
                </motion.button>
             </Link>
          </div>
        </header>

        <section className="space-y-12">
          {selectedDetails.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {selectedDetails.map((sub, i) => (
                <Link 
                  key={sub.id} 
                  href={`/practice/session/${type}/${sub.id}`}
                  className="group"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="bg-white dark:bg-black rounded-[3rem] p-10 h-full flex flex-col justify-between min-h-[400px] border-2 border-slate-100 dark:border-white/5 hover:border-indigo-100 dark:hover:border-indigo-900 transition-all shadow-premium dark:shadow-none"
                  >
                    <div className={`w-28 h-28 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-soft group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors p-4 group-hover:rotate-3 transition-transform duration-500`}>
                      <img src={sub.image} alt={sub.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 bg-[#1d3e8e] dark:bg-indigo-400 rounded-full animate-pulse" />
                         <span className="text-[10px] font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-[0.4em]">Active in Stack</span>
                      </div>
                      <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white group-hover:text-[#1d3e8e] dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{sub.name}</h3>
                      <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                         High-precision {exam.title} examination prep. Launch AI-tutor assisted drills for {sub.name}.
                      </p>
                      <div className="pt-8 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1d3e8e] rounded-full flex items-center justify-center text-white shadow-lg">
                               <Play className="w-4 h-4 fill-white ml-1" />
                            </div>
                            <span className="text-xs font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-widest">Launch Session</span>
                         </div>
                         <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#1d3e8e] dark:group-hover:text-white transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-white/5 rounded-[4rem] p-20 flex flex-col items-center justify-center text-center space-y-8 border-2 border-dashed border-slate-200 dark:border-white/10">
               <div className="w-24 h-24 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-soft dark:shadow-none text-slate-200 dark:text-slate-700">
                  <Play className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-3xl font-black display-font text-slate-900 dark:text-white">Your Catalog is Empty</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                     Add {exam.title} subjects to your academic stack from the Practice hub to enable direct mastery entry.
                  </p>
               </div>
               <Link href="/practice">
                  <button className="bg-[#1d3e8e] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-premium dark:shadow-none hover:scale-105 transition-all">
                     Build My Stack
                  </button>
               </Link>
            </div>
          )}
        </section>
      </div>
    </SidebarLayout>
  );
}

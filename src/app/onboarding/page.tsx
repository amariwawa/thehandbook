"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Brain, 
  CheckCircle2, 
  User, 
  BookOpen, 
  Sparkles, 
  GraduationCap,
  ChevronRight,
  Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";
import { subjects } from "@/lib/data";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [viewingDept, setViewingDept] = useState<string | null>(null);
  const router = useRouter();
  const { profile, updateProfile, toggleSubject, stacks, activeExamType, setActiveExamType } = useSubjectSelection();

  const handleFinish = () => {
    router.push("/pricing");
  };

  const steps = [
    { title: "Personal Information", icon: User },
    { title: "Academic Path", icon: GraduationCap },
    { title: "Scholarly Stack", icon: BookOpen }
  ];

  return (
    <div className="dark min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden transition-colors">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-[120px] opacity-60" />

      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* AI Tutor Sidebar */}
        <div className="lg:col-span-5 h-full">
           <div className="bg-[#020617] h-full rounded-[3rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl border border-white/5 flex flex-col justify-center">
              <div className="relative z-10 space-y-8">
                 <div className="space-y-3">
                    <h2 className="text-4xl font-black display-font leading-tight tracking-tight">Welcome to <br/><span className="text-indigo-400">Handbook.</span></h2>
                    <p className="text-base text-slate-400 font-medium leading-relaxed">
                       To personalize your excellence path, I need to understand your academic profile.
                    </p>
                 </div>
                 <div className="pt-4 space-y-6">
                    {steps.map((s, i) => (
                       <div key={i} className="flex items-center gap-6">
                          <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-lg font-black transition-all ${step > i + 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : step === i + 1 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/5 text-slate-500 border border-white/5'}`}>
                             {step > i + 1 ? <CheckCircle2 className="w-6 h-6" /> : i + 1}
                          </div>
                          <span className={`text-xs font-black uppercase tracking-[0.2em] ${step === i + 1 ? 'text-white' : 'text-slate-500'}`}>{s.title}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-7">
           <AnimatePresence mode="wait">
              {step === 1 && (
                 <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-black rounded-[3rem] p-12 shadow-premium border border-slate-50 dark:border-white/10 space-y-10"
                 >
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">Personal Information.</h3>
                       <p className="text-sm text-slate-400 font-medium">Basic information for your scholarly record.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Full Scholarly Name</label>
                          <input 
                             type="text" 
                             value={profile.fullName}
                             onChange={(e) => updateProfile({ fullName: e.target.value })}
                             placeholder="e.g. Julian Sterling"
                             className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Academic Email</label>
                          <input 
                             type="email" 
                             value={profile.email}
                             onChange={(e) => updateProfile({ email: e.target.value })}
                             placeholder="e.g. julian@scholar.edu"
                             className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                          />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <div className="flex justify-between items-end px-1">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400">Passions & Knowledge Bases</label>
                             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-white/10 px-2 py-1 rounded-md">Intelligence Feed</span>
                          </div>
                          <textarea 
                             value={profile.hobbies}
                             onChange={(e) => updateProfile({ hobbies: e.target.value })}
                             placeholder="e.g. Football, coding, baking, chess..."
                             rows={2}
                             className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none resize-none"
                          />
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic px-2">
                             Tip: List things you know deeply. I'll use these to generate relatable metaphors and explanations for complex topics.
                          </p>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Scholarly Bio</label>
                          <textarea 
                             value={profile.bio}
                             onChange={(e) => updateProfile({ bio: e.target.value })}
                             placeholder="Briefly describe your academic ambitions..."
                             rows={3}
                             className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none resize-none"
                          />
                       </div>
                    </div>

                    <button 
                       onClick={() => setStep(2)}
                       disabled={!profile.fullName}
                       className="w-full bg-[#1d3e8e] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
                    >
                       Analyze & Proceed <ArrowRight className="w-5 h-5" />
                    </button>
                 </motion.div>
              )}

              {step === 2 && (
                 <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-black rounded-[3rem] p-12 shadow-premium border border-slate-50 dark:border-white/10 space-y-10"
                 >
                    <div className="space-y-2">
                       <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">Academic Path.</h3>
                       <p className="text-sm text-slate-400 font-medium">Defining your institutional position and trajectory.</p>
                    </div>

                    <div className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Current Class</label>
                             <select 
                                value={profile.class}
                                onChange={(e) => updateProfile({ class: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none appearance-none"
                             >
                                <option value="">Select Class</option>
                                <option value="SSS 1">SSS 1</option>
                                <option value="SSS 2">SSS 2</option>
                                <option value="SSS 3">SSS 3</option>
                                <option value="JSS 1">JSS 1</option>
                                <option value="JSS 2">JSS 2</option>
                                <option value="JSS 3">JSS 3</option>
                             </select>
                          </div>
                          
                          {/* Department - Only show for SSS */}
                          {!profile.class.includes("JSS") && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="space-y-2"
                            >
                               <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Department</label>
                               <select 
                                  value={profile.department}
                                  onChange={(e) => updateProfile({ department: e.target.value })}
                                  className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 px-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none appearance-none"
                               >
                                  <option value="">Select Department</option>
                                  <option value="Science">Science</option>
                                  <option value="Commercial">Commercial</option>
                                  <option value="Arts">Arts</option>
                                  <option value="Technical">Technical</option>
                               </select>
                            </motion.div>
                          )}
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#1d3e8e] dark:text-indigo-400 ml-1">Future Area of Study (University)</label>
                          <div className="relative">
                             <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                             <input 
                                type="text" 
                                value={profile.futureArea}
                                onChange={(e) => updateProfile({ futureArea: e.target.value })}
                                placeholder="e.g. Mechanical Engineering"
                                className="w-full bg-slate-50 dark:bg-white/5 border-2 border-transparent focus:border-[#1d3e8e] focus:bg-white dark:focus:bg-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-slate-900 dark:text-white transition-all outline-none"
                             />
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                       <button 
                          onClick={() => setStep(1)}
                          className="flex-1 bg-slate-50 dark:bg-white/5 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
                       >
                          Previous
                       </button>
                       <button 
                          onClick={() => {
                             if (profile.class.includes("JSS") && activeExamType !== 'bece') {
                                setActiveExamType('bece');
                             } else if (!profile.class.includes("JSS") && activeExamType === 'bece') {
                                setActiveExamType('waec');
                             }
                             setStep(3);
                          }}
                          disabled={!profile.class || (!profile.class.includes("JSS") && !profile.department)}
                          className="flex-[2] bg-[#1d3e8e] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-4 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
                       >
                          Curate Stack <ArrowRight className="w-5 h-5" />
                       </button>
                    </div>
                 </motion.div>
              )}

              {step === 3 && (
                 <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white dark:bg-black rounded-[3rem] p-12 shadow-premium border border-slate-50 dark:border-white/10 space-y-10"
                 >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
                       <div className="space-y-1">
                          <h3 className="text-4xl font-black display-font text-slate-900 dark:text-white tracking-tight">Scholarly Stack.</h3>
                          <p className="text-sm text-slate-400 font-medium">
                             {profile.class.includes("JSS") 
                               ? "Select subjects to add to your BECE stack." 
                               : "Choose subjects to add to your WAEC and JAMB stacks separately."}
                          </p>
                       </div>
                       
                       <div className="flex gap-2 bg-slate-50 dark:bg-white/5 p-1 rounded-xl border border-slate-100 dark:border-white/5">
                          {(profile.class.includes("JSS") ? ['bece'] : ['waec', 'jamb']).map((type: string) => (
                             <button
                                key={type}
                                onClick={() => setActiveExamType(type as any)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeExamType === type ? 'bg-[#1d3e8e] text-white shadow-lg dark:shadow-none' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                             >
                                {type}
                             </button>
                          ))}
                       </div>
                    </div>

                    {activeExamType === 'waec' && !profile.class.includes("JSS") && (
                       <div className="flex items-center gap-2 pb-6 overflow-x-auto no-scrollbar">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 shrink-0 mr-2">Browse Departments:</span>
                          {['science', 'commercial', 'arts', 'technical'].map(dept => {
                             const isCurrent = (viewingDept || profile.department.toLowerCase()) === dept;
                             return (
                                <button 
                                   key={dept} 
                                   onClick={() => setViewingDept(dept)}
                                   className={`shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                      isCurrent 
                                         ? 'bg-indigo-100 dark:bg-indigo-900/40 text-[#1d3e8e] dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' 
                                         : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white border border-transparent'
                                   }`}
                                >
                                   {dept}
                                </button>
                             );
                          })}
                       </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-premium">
                       {(() => {
                          let displaySubjects: any[] = [];
                          if (activeExamType === 'bece') {
                             displaySubjects = subjects.bece;
                          } else if (activeExamType === 'jamb') {
                             displaySubjects = subjects.jamb;
                          } else if (activeExamType === 'waec') {
                             const dept = viewingDept || profile.department.toLowerCase();
                             displaySubjects = (subjects.waec as any)[dept] || [];
                          }
                          
                          return displaySubjects.map((s) => {
                             const isSelected = stacks[activeExamType].includes(s.id);
                             return (
                                <button
                                   key={s.id}
                                   onClick={() => toggleSubject(s.id)}
                                   className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 text-center ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20 border-[#1d3e8e] shadow-lg shadow-indigo-100 dark:shadow-none' : 'bg-slate-50 dark:bg-white/5 border-transparent hover:border-slate-200 dark:hover:border-white/10 opacity-60 hover:opacity-100'}`}
                                >
                                   <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 p-2 shadow-sm">
                                      <img src={s.image} alt={s.name} className="w-full h-full object-contain" />
                                   </div>
                                   <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-[#1d3e8e] dark:text-indigo-400' : 'text-slate-400'}`}>{s.name}</span>
                                </button>
                             );
                          });
                       })()}
                    </div>

                    <div className="flex gap-4 pt-10">
                       <button 
                          onClick={() => setStep(2)}
                          className="flex-1 bg-slate-50 dark:bg-white/5 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
                       >
                          Previous
                       </button>
                       <button 
                          onClick={handleFinish}
                          disabled={stacks[activeExamType].length === 0}
                          className="flex-[2] bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 hover:bg-[#1d3e8e] transition-all active:scale-95 disabled:opacity-50"
                       >
                          Commit to Pricing <ArrowRight className="w-5 h-5" />
                       </button>
                    </div>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

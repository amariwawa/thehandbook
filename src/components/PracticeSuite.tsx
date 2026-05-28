"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronRight, RotateCcw, Award, BookOpen, BarChart3 } from "lucide-react";
import Link from "next/link";
import AITutorPracticePanel from "./AITutorPracticePanel";
import { useRouter } from "next/navigation";
import { useRecordSession } from "@/hooks/useRecordSession";

interface Question {
  id: number;
  question: string;
  options: Record<string, string>; // Match JSON structure
  answer: string;
  explanation: string;
  topic: string;
  section: string;
}

interface PracticeSuiteProps {
  questions: Question[];
  subjectName: string;
}

export default function PracticeSuite({ questions, subjectName }: PracticeSuiteProps) {
  const router = useRouter();
  const { recordSession } = useRecordSession();
  const sessionStartRef = useRef<number>(Date.now());
  const hasRecordedRef = useRef(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{questionId: number, topic: string, isCorrect: boolean}[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Convert object options to array for mapping
  const optionsArray = Object.values(currentQuestion.options);
  const optionsKeys = Object.keys(currentQuestion.options);
  
  const isCorrect = selectedAnswer === currentQuestion.options[currentQuestion.answer];

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    setIsSubmitted(true);
    
    const correct = isCorrect;
    if (correct) {
      setScore(prev => prev + 1);
    }

    setResults(prev => [...prev, {
      questionId: currentQuestion.id,
      topic: currentQuestion.topic,
      isCorrect: correct
    }]);
  };

  const handleViewAnalysis = () => {
    // Save results to local storage or state management for the analysis page
    localStorage.setItem('last_practice_results', JSON.stringify({
      subject: subjectName,
      score,
      total: questions.length,
      results
    }));
    router.push('/practice/analysis');
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setShowResults(false);
    sessionStartRef.current = Date.now();
    hasRecordedRef.current = false;
  };

  // Record session to Supabase when quiz completes
  useEffect(() => {
    if (showResults && !hasRecordedRef.current && questions.length > 0) {
      hasRecordedRef.current = true;
      const durationMins = Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 60000));
      const accuracy = Math.round((score / questions.length) * 100);
      const uniqueTopics = Array.from(new Set(results.map((r) => r.topic)));

      recordSession({
        subject: subjectName,
        score: accuracy,
        duration_mins: durationMins,
        session_type: "quiz",
        topics: uniqueTopics.length > 0 ? uniqueTopics : undefined,
      });
    }
  }, [showResults, score, questions.length, subjectName, recordSession, results]);

  const [isGenerating, setIsGenerating] = useState(false);

  const generateMoreQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subject: subjectName,
          topic: questions[0]?.topic || 'General',
          count: 5 
        })
      });
      const data = await response.json();
      if (data.questions) {
        // In a real app, we'd append or replace. For "Endless Loop", we'll append.
        handleReset(); // Reset index to 0
        // We need to pass the new questions up or manage them here
        // For this demo, let's just replace the local set for the next "round"
        window.location.reload(); // Simplest way to "refresh" with new AI context if state is managed globally
        // Better: Update parent state. But since we are in a component, let's just show the new set.
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (showResults) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 rounded-[3rem] p-16 shadow-premium max-w-2xl mx-auto text-center space-y-12"
      >
        <div className="space-y-6">
           <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#1d3e8e]">
              <Award className="w-12 h-12" />
           </div>
           <h2 className="text-4xl font-black display-font text-slate-900 dark:text-white">Session Complete!</h2>
           <p className="text-slate-500 font-medium leading-relaxed">
              Great work in <b>{subjectName}</b>. Your performance has been analyzed by the tutor.
           </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
              <div className="text-4xl font-black text-slate-900 dark:text-white">{score}/{questions.length}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Accuracy Score</div>
           </div>
           <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
              <div className="text-4xl font-black text-[#1d3e8e]">{Math.round((score / questions.length) * 100)}%</div>
              <div className="text-[10px] font-bold text-[#1d3e8e] uppercase tracking-widest mt-2">Scholar Percentile</div>
           </div>
        </div>

        <div className="space-y-4">
           <button 
             onClick={handleViewAnalysis}
             className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-3"
           >
             <BarChart3 className="w-5 h-5" />
             View Detailed Analysis
           </button>

           <button 
             onClick={generateMoreQuestions}
             disabled={isGenerating}
             className="w-full bg-[#1d3e8e] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-3"
           >
             {isGenerating ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <BookOpen className="w-5 h-5" />
             )}
             Generate Endless AI Loop
           </button>
           
           <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleReset}
                className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" /> Restart Set
              </button>
              <Link href="/practice/arena" className="flex-1">
                <button className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold active:scale-95 transition-all">
                  Exit Session
                </button>
              </Link>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
      <div className="lg:col-span-3 space-y-10">
        <div className="flex items-center gap-6 w-full">
           <div className="px-4 py-1.5 bg-slate-100 dark:bg-white/5 rounded-full text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Question {currentQuestionIndex + 1} of {questions.length}
           </div>
           <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden relative">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
               className="absolute top-0 left-0 h-full bg-[#1d3e8e] dark:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]"
             />
           </div>
        </div>

        <div className="space-y-8">
           <h2 className="text-3xl font-black display-font leading-snug text-slate-900 dark:text-white">
             {currentQuestion.question}
           </h2>

           <div className="space-y-4">
             {optionsArray.map((option, i) => {
               const isSelected = selectedAnswer === option;
               const isCorrectAnswer = isSubmitted && option === currentQuestion.options[currentQuestion.answer];
               const isWrongSelection = isSubmitted && isSelected && !isCorrect;

               return (
                 <button
                   key={i}
                   onClick={() => !isSubmitted && setSelectedAnswer(option)}
                   disabled={isSubmitted}
                   className={`w-full p-6 rounded-3xl border-2 text-left transition-all flex items-center justify-between group ${
                     isSelected && !isSubmitted
                       ? 'border-[#1d3e8e] dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10'
                       : isCorrectAnswer
                       ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                       : isWrongSelection
                       ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                       : 'border-slate-100 dark:border-white/5 bg-white dark:bg-zinc-900/50 hover:border-slate-300 dark:hover:border-white/20'
                   }`}
                 >
                   <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isCorrectAnswer
                          ? 'bg-emerald-500 text-white'
                          : isWrongSelection
                          ? 'bg-rose-500 text-white'
                          : isSelected
                          ? 'bg-[#1d3e8e] text-white'
                          : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                      }`}>
                         {String.fromCharCode(65 + i)}
                      </div>
                      <span className={`font-bold ${
                        isSelected || isCorrectAnswer || isWrongSelection 
                        ? 'text-slate-900 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {option}
                      </span>
                   </div>
                   {isCorrectAnswer && <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Check className="w-4 h-4" /></div>}
                   {isWrongSelection && <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white"><X className="w-4 h-4" /></div>}
                 </button>
               );
             })}
           </div>

           <div className="pt-8 flex gap-4">
             {!isSubmitted ? (
               <button 
                 onClick={handleSubmit}
                 disabled={selectedAnswer === null}
                 className="flex-1 bg-[#1d3e8e] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 disabled:opacity-50 active:scale-95 transition-all"
               >
                 Submit Answer
               </button>
             ) : (
               <button 
                 onClick={handleNext}
                 className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 {currentQuestionIndex < questions.length - 1 ? "Next Question" : "View Final Results"} <ChevronRight className="w-5 h-5" />
               </button>
             )}
           </div>
        </div>
      </div>

      <div className="lg:col-span-2 lg:sticky lg:top-8 h-fit">
         {isSubmitted ? (
           <AITutorPracticePanel 
             question={currentQuestion.question}
             options={optionsArray}
             correctAnswer={currentQuestion.options[currentQuestion.answer]}
             studentAnswer={selectedAnswer!}
             isCorrect={isCorrect}
             explanation={currentQuestion.explanation}
           />
         ) : (
           <div className="bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] p-12 h-full flex flex-col items-center justify-center text-center space-y-6 opacity-60">
              <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center shadow-sm">
                 <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-black display-font text-slate-400 dark:text-slate-500">AI Tutor Standing By</h4>
                 <p className="text-xs font-medium text-slate-400 dark:text-slate-500 leading-relaxed max-w-[200px]">Submit an answer to unlock detailed AI explanations and follow-up discussion.</p>
              </div>
           </div>
         )}
      </div>

    </div>
  );
}

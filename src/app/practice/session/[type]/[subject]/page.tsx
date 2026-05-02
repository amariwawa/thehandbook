"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import PracticeSuite from "@/components/PracticeSuite";
import { exams, subjects as allSubjectsData, mockQuestions } from "@/lib/data";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const type = params.type as string;
  const subjectId = params.subject as string;
  const topicParam = searchParams.get('topic');

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<any>(null);
  const [exam, setExam] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Find exam and subject data
        const currentExam = exams[type as keyof typeof exams];
        const allSubjects = Object.values(allSubjectsData).flat();
        const currentSubject = allSubjects.find(s => s.id === subjectId);
        
        setExam(currentExam);
        setSubject(currentSubject);

        // Fetch 50 random questions from API
        const url = `/api/questions?exam=${type}&subject=${subjectId}${topicParam ? `&topic=${encodeURIComponent(topicParam)}` : ''}&count=50`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          // Fallback to mock if API fails or is empty for other subjects
          let mockSet = mockQuestions[subjectId as keyof typeof mockQuestions] || mockQuestions.physics;
          if (topicParam) {
            mockSet = mockSet.filter(q => q.topic === topicParam);
          }
          setQuestions(mockSet);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, subjectId, topicParam]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-[#1d3e8e] animate-spin" />
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Question Library...</p>
        </div>
      </SidebarLayout>
    );
  }

  if (!exam || !subject || questions.length === 0) {
    return (
      <SidebarLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
          <h1 className="text-4xl font-black display-font text-slate-900 dark:text-white">Session Unreachable</h1>
          <p className="text-slate-500 max-w-xs">We couldn't load the questions for this subject. Please try another one.</p>
          <button onClick={() => router.back()} className="text-[#1d3e8e] font-bold">Go Back</button>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-12 pb-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-6">
            <button 
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Exit Session
            </button>
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-[0.2em]">{exam.title} • {subject.name}</div>
              <h1 className="text-5xl font-black display-font leading-none tracking-tighter text-slate-900 dark:text-white">
                Practice <span className="text-slate-400 dark:text-slate-500 italic">Suite.</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-soft">
             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-[#1d3e8e]">
                <span className="text-xs font-black">AI</span>
             </div>
             <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tutor Status</div>
                <div className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   Fully Active
                </div>
             </div>
          </div>
        </header>

        <PracticeSuite questions={questions} subjectName={subject.name} />

      </div>
    </SidebarLayout>
  );
}

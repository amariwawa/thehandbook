"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, Send, Sparkles, SendIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// BULLETPROOF TYPEWRITER
function TypewriterContent({ content }: { content: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const words = content.split(" ").filter(w => w.length > 0);
  
  useEffect(() => {
    let currentText = "";
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < words.length) {
        currentText += (i === 0 ? "" : " ") + words[i];
        setDisplayedText(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 85);

    return () => clearInterval(interval);
  }, [content]);

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown>{displayedText}</ReactMarkdown>
    </div>
  );
}

interface AITutorPracticePanelProps {
  question: string;
  options: string[];
  correctAnswer: string;
  studentAnswer: string;
  isCorrect: boolean;
  explanation?: any;
}

export default function AITutorPracticePanel({ 
  question, 
  options, 
  correctAnswer, 
  studentAnswer, 
  isCorrect,
  explanation = "" 
}: AITutorPracticePanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FORCE CLEAN DATA & STRIP HASHTAGS
    let cleanExp = String(explanation || "");
    if (cleanExp === "undefined" || cleanExp === "null") cleanExp = "";
    
    // Remove "### Explanation" or raw hashtags that clutter the UI
    cleanExp = cleanExp.replace(/###/g, '').replace(/Explanation:/gi, '').trim();
    
    const verdict = isCorrect ? "CORRECT" : "INCORRECT";
    const connector = isCorrect ? "which is the right answer" : `but the right answer is **${correctAnswer}**`;
    
    const initialContent = `${verdict}, you selected **${studentAnswer}**, ${connector}. ${cleanExp}`;

    setMessages([{ role: 'assistant', content: initialContent }]);
  }, [question, studentAnswer, isCorrect, correctAnswer, explanation]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMsg
          ] 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.details || data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      const errMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `**Tutor Note:** ${errMessage}. Please try again.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border-2 border-slate-100 dark:border-slate-800 rounded-[3rem] h-[calc(100vh-160px)] min-h-[600px] flex flex-col overflow-hidden shadow-premium dark:shadow-none">
      {/* Header */}
      <div className="p-8 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-[#1d3e8e] dark:text-indigo-400 relative">
            <Bot className="w-6 h-6 relative z-10" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-indigo-400 rounded-2xl"
            />
          </div>
          <div>
            <h3 className="text-lg font-black display-font text-slate-900 dark:text-white tracking-tight">AI Scholar Tutor</h3>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Always Active</span>
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdfcff] dark:bg-[#0f0f11] no-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-5 rounded-3xl text-sm font-medium leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#1d3e8e] text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-soft dark:shadow-none'
            }`}>
              <div className="prose prose-sm dark:prose-invert max-w-none 
                  prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:text-slate-100 
                  prose-strong:text-[#1d3e8e] dark:prose-strong:text-indigo-400 prose-strong:font-black
                  prose-ul:list-disc prose-ul:pl-4 prose-li:my-1">
                {msg.role === 'assistant' ? (
                  <TypewriterContent content={msg.content} />
                ) : (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl flex gap-1 items-center">
              <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-75" />
              <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-slate-800/50">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your tutor anything..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-[#1d3e8e] dark:focus:border-indigo-500 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1.5 w-11 h-11 bg-[#1d3e8e] text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-95 transition-all disabled:opacity-50"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

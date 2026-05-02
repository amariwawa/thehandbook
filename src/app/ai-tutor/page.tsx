"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { 
  Upload, 
  FileText, 
  X, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  MoreHorizontal,
  Bot,
  User,
  Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";

export default function AITutorPage() {
  const { profile } = useSubjectSelection();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setAttachments(prev => [...prev, {
      type,
      name: file.name,
      mimeType: file.type,
      data: base64,
      preview: type === 'photo' ? base64 : null
    }]);
    
    // Reset inputs
    if (e.target) e.target.value = '';
  };

  const addLink = () => {
    const url = prompt("Enter the URL:");
    if (url) {
      setAttachments(prev => [...prev, {
        type: 'link',
        name: url,
        data: url
      }]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setMessages([
      { 
        role: 'assistant', 
        content: `Hello! I'm your Handbook AI Tutor. How can I help you prepare for your exams today? I can explain concepts from WAEC, JAMB, or BECE subjects.`,
        time: `SENT ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }
    ]);
  }, []);

  const handleSend = async () => {
    if ((!input.trim() && attachments.length === 0) || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      attachments: attachments.map(a => ({ type: a.type, name: a.name, data: a.data, mimeType: a.mimeType })),
      time: `SENT ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setAttachments([]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.details || data.error);

      setMessages(prev => [...prev, data]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errMessage = error instanceof Error ? error.message : "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errMessage,
        time: `SENT ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="h-[calc(100vh-12rem)] flex flex-col">
        {/* Chat Area - Now Full Width */}
        <div className="flex-1 flex flex-col bg-white/50 dark:bg-zinc-900/50 rounded-[4rem] border border-slate-100 dark:border-white/5 overflow-hidden relative shadow-premium">
          <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-slate-200 overflow-hidden' : 'bg-[#1d3e8e] text-white shadow-lg'
                  }`}>
                    {msg.role === 'user' ? (
                      <img src={`https://ui-avatars.com/api/?name=${profile?.fullName || 'U'}&background=random`} alt="User" />
                    ) : (
                      <Bot className="w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-3 flex-1 pt-1">
                    <div className={`text-sm font-medium leading-relaxed p-8 rounded-[2.5rem] shadow-soft ${
                      msg.role === 'user' 
                        ? 'bg-[#f8fafc] dark:bg-white/5 text-slate-700 dark:text-slate-300' 
                        : 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-white border border-slate-50 dark:border-white/5'
                    }`}>
                      {msg.content && msg.content.split('\n').map((line: string, idx: number) => (
                        <p key={idx} className={line.startsWith('*') ? 'ml-4' : ''}>{line}</p>
                      ))}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                          {msg.attachments.map((at: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 bg-white/50 dark:bg-white/5 px-3 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                              {at.type === 'photo' ? (
                                <img src={at.data} className="w-8 h-8 rounded-lg object-cover" alt="" />
                              ) : at.type === 'link' ? (
                                <LinkIcon className="w-4 h-4 text-indigo-500" />
                              ) : (
                                <FileText className="w-4 h-4 text-indigo-500" />
                              )}
                              <span className="text-[10px] font-bold truncate max-w-[150px] dark:text-slate-300">{at.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{msg.time}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#1d3e8e] text-white flex items-center justify-center shrink-0">
                  <Bot className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-3 flex-1 pt-1 opacity-50">
                  <div className="h-20 bg-slate-50 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-10 pt-0">
            <div className="bg-white dark:bg-zinc-800 rounded-[3rem] p-4 shadow-premium border border-slate-50 dark:border-white/5 relative focus-within:ring-2 focus-within:ring-indigo-100/20 transition-all">
              {/* Attachment Previews */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 py-4 flex flex-wrap gap-3 border-b border-slate-50 dark:border-white/5"
                  >
                    {attachments.map((at, i) => (
                      <div key={i} className="group relative flex items-center gap-3 bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-[1.25rem] border border-slate-100 dark:border-white/5 hover:border-indigo-100 transition-all">
                        {at.type === 'photo' ? (
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white dark:bg-zinc-800 shadow-sm">
                            <img src={at.preview} className="w-full h-full object-cover" alt="" />
                          </div>
                        ) : at.type === 'link' ? (
                          <LinkIcon className="w-4 h-4 text-[#1d3e8e] dark:text-indigo-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-[#1d3e8e] dark:text-indigo-400" />
                        )}
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{at.name}</span>
                        <button 
                          onClick={() => removeAttachment(i)}
                          className="bg-white dark:bg-zinc-800 text-slate-400 hover:text-red-500 rounded-full p-1 shadow-sm transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <input 
                type="text"
                placeholder="Ask your tutor anything..."
                className="w-full px-6 py-4 text-sm font-medium bg-transparent border-none focus:outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 text-slate-900 dark:text-white"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <div className="flex items-center gap-4 px-6 pb-2">
                <div className="flex items-center gap-2 border-r border-slate-100 dark:border-white/5 pr-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={(e) => handleFileSelect(e, 'file')}
                    accept=".pdf,.docx,.txt"
                  />
                  <input 
                    type="file" 
                    ref={photoInputRef} 
                    className="hidden" 
                    onChange={(e) => handleFileSelect(e, 'photo')}
                    accept="image/*"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-[#1d3e8e] hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => photoInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-[#1d3e8e] hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={addLink}
                    className="p-2 text-slate-400 hover:text-[#1d3e8e] hover:bg-slate-50 rounded-xl transition-all"
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 flex items-center">
                  <div className="bg-indigo-50 dark:bg-indigo-500/10 text-[#1d3e8e] dark:text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#1d3e8e] dark:bg-indigo-400 rounded-full" />
                    Gemini Flash
                  </div>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#1d3e8e] text-white p-4 rounded-[2rem] shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Zap, 
  MessageCircle, 
  BarChart3,
  Star,
  Quote,
  Crown,
  BookOpen,
  GraduationCap,
  FileText,
  Brain,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useState, useEffect } from "react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

function getWeeksUntilWAEC() {
  const waecDate = new Date(process.env.NEXT_PUBLIC_WAEC_DATE || '2026-05-04');
  const today = new Date();
  const msPerWeek = 1000 * 60 * 60 * 24 * 7;
  const weeks = Math.ceil((waecDate.getTime() - today.getTime()) / msPerWeek);
  return weeks > 0 ? weeks : null; // null = exam passed
}

function Counter({ end, duration = 1600, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // easeOutExpo
      const easeOutExpo = (x: number): number => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      };
      
      setCount(Math.floor(easeOutExpo(percentage) * end));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [weeksAway, setWeeksAway] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeMissionIndex, setActiveMissionIndex] = useState(0);

  const testimonials = [
    { name: "Adaeze Nwosu", score: "301 JAMB", text: "I failed JAMB the first time because I was practicing without understanding. Handbook's AI changed everything." },
    { name: "Emeka Obi", score: "A1 MATHS", text: "The AI Tutor is like having a private teacher 24/7. My physics grades improved in just 2 weeks." },
    { name: "Zainab Ahmed", score: "325 JAMB", text: "Finally, a platform that understands exactly what WAEC examiners are looking for. Strategic prep." },
    { name: "Oluchi Okafor", score: "TOP 1%", text: "JAMB score: 325! I couldn't have done it without the Handbook's precision practice modules." }
  ];
  
  useEffect(() => {
    setWeeksAway(getWeeksUntilWAEC());

    const testimonialInterval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => {
      observer.disconnect();
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div 
      className={`min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white ${GeistMono.className} ${GeistSans.variable} font-bold selection:bg-indigo-100 dark:selection:bg-white/10 selection:text-[#1d3e8e] transition-colors`}

    >
      {/* Google Font Import for Geist */}
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Global Style Override for Headings */}
      <style>{`
        h1, h2, h3, h4 {
          font-family: 'Geist', sans-serif !important;
          font-weight: 700 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.1 !important;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 md:pt-12 pb-12 overflow-hidden relative bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white w-full transition-colors">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
            {/* Left Column */}
            <motion.div 
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                #1 AI Learning Platform
              </div>
              
              {/* Heading */}
              <h1 className="text-5xl md:text-7xl font-black display-font leading-[1.1] text-slate-900 dark:text-white tracking-tighter" suppressHydrationWarning>
                Master New <span className="text-indigo-500">Skills</span> with Our Expert-Led Platform.
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
                Practice real exam questions. Get instant AI explanations when you're stuck. 
                Know exactly where you're weak before exam day.
              </p>
              
              {/* Buttons */}
              <div className="flex items-center gap-6 pt-2">
                 <Link href="/auth" className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 group">
                   Get Started 
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link href="#how-it-works" className="text-slate-600 dark:text-white px-6 py-3 font-bold text-sm hover:text-slate-900 dark:hover:text-zinc-300 transition-all">
                   Learn More
                 </Link>
              </div>
            </motion.div>

            {/* Right Column (Image & Floating Cards) */}
            <motion.div 
              className="lg:col-span-5 relative flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-[400px] aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                <Image 
                  src="/hero_student_books.png" 
                  alt="Student holding books"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Floating Card 1 (Top Right) */}
              <div className="absolute top-10 right-[-20px] bg-white text-black p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-float">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-500">
                   <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">All Exams</div>
                  <div className="text-xs text-zinc-500">JAMB, WAEC, BECE</div>
                </div>
              </div>

              {/* Floating Card 2 (Middle Right) */}
              <div className="absolute bottom-32 right-[-10px] bg-[#141414] border border-zinc-800 p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-float-delayed">
                <div className="flex -space-x-2">
                  <img src="https://i.pravatar.cc/100?img=33" className="w-8 h-8 rounded-full border-2 border-zinc-900" />
                  <img src="https://i.pravatar.cc/100?img=32" className="w-8 h-8 rounded-full border-2 border-zinc-900" />
                  <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full border-2 border-zinc-900" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Top Instructors</div>
                  <div className="text-[10px] text-zinc-500">AI Verified</div>
                </div>
              </div>

              {/* Floating Card 3 (Bottom Left) */}
              <div className="absolute bottom-10 left-[-20px] bg-indigo-500 text-white p-4 rounded-xl shadow-2xl animate-float">
                <div className="text-2xl font-black">10K+</div>
                <div className="text-xs font-bold opacity-80">Practice Questions</div>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div 
            className="mt-20 bg-white dark:bg-zinc-900 text-slate-900 dark:text-white rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl relative z-10 transition-colors"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">10K+</div>
              <div className="text-sm font-bold text-zinc-500">Practice Questions</div>
            </div>
            <div className="border-l border-zinc-100 dark:border-zinc-800 hidden md:block">
              <div className="text-3xl font-black text-slate-900 dark:text-white">4.8</div>
              <div className="text-sm font-bold text-zinc-500">Rating</div>
            </div>
            <div className="border-l border-zinc-100 dark:border-zinc-800 hidden md:block">
              <div className="text-3xl font-black text-slate-900 dark:text-white">3</div>
              <div className="text-sm font-bold text-zinc-500">Major Exams</div>
            </div>
            <div className="border-l border-zinc-100 dark:border-zinc-800 hidden md:block">
              <div className="text-3xl font-black text-slate-900 dark:text-white">24/7</div>
              <div className="text-sm font-bold text-zinc-500">AI Tutor</div>
            </div>
          </motion.div>
        </div>
      </section>






      {/* Testimonials Section */}
      <section 
        className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white relative overflow-hidden transition-colors"

      >
        <div className="max-w-7xl mx-auto px-10 space-y-12 relative z-10">
          <div className="space-y-4 text-left flex flex-col items-start">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              TESTIMONIALS
            </div>
          </div>

          {/* Infinite Auto-Scroll Container */}
          <div className="relative overflow-hidden w-full">
            <motion.div 
              className="flex gap-6 w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                repeat: Infinity, 
                duration: 30, 
                ease: "linear" 
              }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-8 flex flex-col justify-between min-h-[320px] w-[300px] hover:border-zinc-200 dark:hover:border-zinc-700 transition-all group">
                  <div className="space-y-6">
                    {/* Top area with score and arrow */}
                    <div className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
                      <span className="text-slate-900 dark:text-white">{t.score}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    
                    <p className="text-xs text-zinc-400 font-medium leading-relaxed font-mono">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-6 border-t border-zinc-900 mt-auto">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                      alt={t.name}
                      className="w-8 h-8 rounded-full border border-zinc-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">{t.name}</div>
                      <div className="text-xs font-bold text-zinc-600 uppercase tracking-wider">{t.score}</div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-10 space-y-16">
          <div className="space-y-4 text-right flex flex-col items-end">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              ANALYTICS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold display-font text-slate-900 dark:text-white tracking-tight">
              Why Handbook?
            </h2>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
              Every question you attempt moves you closer to your result. Security, compliance, and control aren't afterthoughts. Every feature ships enterprise-ready.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { icon: BookOpen, title: "PRACTICE QUESTIONS", desc: "10,000+ questions covering all subjects and topics." },
              { icon: Zap, title: "EXAMS COVERED", desc: "JAMB · WAEC · BECE. We support the major Nigerian exams." },
              { icon: GraduationCap, title: "AI EXPLANATIONS", desc: "Get instant AI explanations on every question you miss." },
              { icon: FileText, title: "FILE UPLOADS", desc: "Upload past questions or notes and let AI review them." },
              { icon: Brain, title: "PERSONALIZED LEARNING", desc: "The system learns your style and adapts to your needs." },
              { icon: Users, title: "STUDENT COMMUNITY", desc: "Connect with other students and share your progress." }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-8 space-y-4 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 dark:bg-[#141414] border border-zinc-100 dark:border-zinc-800 text-indigo-500 rounded-lg flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-widest">{item.title}</h3>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-500 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                PROCESS
              </div>
              <h2 className="text-4xl md:text-5xl font-black display-font text-slate-900 dark:text-white tracking-tight leading-tight">
                How Handbook Works.
              </h2>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                Three steps between where you are and where you need to be. We've streamlined the process to make learning as efficient as possible.
              </p>
            </div>

            {/* Right Column - Dashboard Card (Mimicking factory.ai) */}
            <div className="lg:col-span-7 relative h-[500px] flex items-center justify-center">
              <div className="relative w-[500px] h-[500px]">
                
                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                  <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                      <stop offset="50%" stopColor="#6366f1" stopOpacity="1" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  
                  {/* Path 1 -> 2 */}
                  <motion.path
                    d="M 175 90 Q 250 100 325 215"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                  />
                  
                  {/* Path 2 -> 3 */}
                  <motion.path
                    d="M 325 215 Q 250 350 200 410"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
                  />

                  {/* Animated dots moving along paths */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="#6366f1"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                      offsetPath: "path('M 175 90 Q 250 100 325 215')",
                    }}
                  />
                  
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="#6366f1"
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
                    style={{
                      offsetPath: "path('M 325 215 Q 250 350 200 410')",
                    }}
                  />
                </svg>

                {/* Node 1: Choose Exam */}
                <motion.div 
                  className="absolute top-[50px] left-[25px] bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 w-[300px] shadow-2xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05, borderColor: '#6366f1' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-500/20">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Step 01</div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">Choose Exam</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Select JAMB, WAEC, or BECE.</div>
                    </div>
                  </div>
                </motion.div>

                {/* Node 2: Practice */}
                <motion.div 
                  className="absolute top-[175px] right-[25px] bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 w-[300px] shadow-2xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  whileHover={{ scale: 1.05, borderColor: '#6366f1' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Step 02</div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">Practice</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Answer real-format questions.</div>
                    </div>
                  </div>
                </motion.div>

                {/* Node 3: AI Explanations */}
                <motion.div 
                  className="absolute bottom-[50px] left-[50px] bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-xl p-5 w-[300px] shadow-2xl backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 2.2 }}
                  whileHover={{ scale: 1.05, borderColor: '#6366f1' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-500/20">
                      <Brain className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Step 03</div>
                      <div className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">AI Review</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Get instant AI explanations.</div>
                    </div>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Device Support Section */}
      <section className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-4xl mx-auto px-10 text-center space-y-8">
          <div className="space-y-4">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              ACCESSIBILITY
            </div>
            <h2 className="text-3xl md:text-4xl font-bold display-font text-slate-900 dark:text-white tracking-tight">
              Works on any device, right from your browser.
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
              No downloads required. Access your study materials, practice questions, and AI tutor on any device with an internet connection.
            </p>
          </div>

          <div className="flex justify-center gap-12 pt-4">
            {[
              { icon: Monitor, label: "Desktop" },
              { icon: Tablet, label: "Tablet" },
              { icon: Smartphone, label: "Mobile" }
            ].map((device, i) => (
              <div key={i} className="flex flex-col items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg flex items-center justify-center text-indigo-500 transition-colors">
                  <device.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">{device.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Innovation Section */}
      <section className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-10 relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column (Dashboard Layout) */}
            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
              <motion.div
                className="grid grid-cols-1 gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
              
              {/* Top Widget: Readiness */}
              <div className="bg-white dark:bg-[#141414] border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6 space-y-4 transition-colors">
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Student Readiness</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                    Measure your progress toward autonomous exam success. Track readiness across subjects, from basic understanding to self-sustaining mastery.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-slate-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                    <span>Filter</span>
                    <span className="text-zinc-500">▼</span>
                  </button>
                  <button className="bg-slate-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-white px-4 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                    Read the Docs
                  </button>
                </div>
              </div>

              {/* Middle Row: Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mastery Score</h3>
                  <div className="text-3xl font-black mt-2 text-indigo-500">LEVEL 3</div>
                </div>
                <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Topics Mastered</h3>
                  <div className="text-3xl font-black mt-2">45 <span className="text-zinc-600 text-lg">/ 120</span></div>
                </div>
                <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Updated</h3>
                  <div className="text-3xl font-black mt-2">1 <span className="text-zinc-600 text-lg">DAY AGO</span></div>
                </div>
              </div>

              {/* Bottom Widget: Charts */}
              <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-6 grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Category Breakdown</h3>
                  {/* Bar Chart */}
                  <div className="h-40 flex flex-col justify-between py-2">
                    {[
                      { label: "Algebra", value: 85, color: "#6366f1" },
                      { label: "Geometry", value: 60, color: "#f97316" },
                      { label: "Calculus", value: 40, color: "#10b981" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                          <span>{item.label}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${item.value}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Level Over Time</h3>
                    <div className="flex gap-2 text-[10px] font-bold text-zinc-600">
                      <span>7d</span><span>1m</span><span>6m</span><span>1y</span><span className="text-indigo-500">All</span>
                    </div>
                  </div>
                  {/* Line Chart Mockup */}
                  <div className="h-40 flex items-end relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,80 L20,75 L40,60 L60,40 L80,65 L100,30" fill="none" stroke="#f97316" strokeWidth="2" />
                      <path d="M0,80 L20,75 L40,60 L60,40 L80,65 L100,30 L100,100 L0,100 Z" fill="url(#gradient-indigo)" opacity="0.1" />
                      <defs>
                        <linearGradient id="gradient-indigo" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#f97316" />
                          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Grid lines */}
                    <div className="absolute inset-0 border-b border-zinc-800 opacity-50" />
                    <div className="absolute inset-0 border-b border-zinc-800 opacity-50 top-1/2" />
                  </div>
                </div>
              </div>

              {/* Footer Widget: List */}
              <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Syllabus Progress</h3>
                  <span className="text-xs text-zinc-600 font-bold"><Counter end={114} /> Topics</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Calculus & Derivatives", level: 3, progress: 85, update: "2 hours ago" },
                    { name: "Organic Chemistry", level: 2, progress: 45, update: "1 day ago" },
                    { name: "Nigerian History", level: 1, progress: 12, update: "3 days ago" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold border-t border-zinc-800/50 pt-3 first:border-t-0 first:pt-0">
                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-500/10 text-indigo-500 w-5 h-5 rounded flex items-center justify-center text-[10px]">{item.level}</span>
                        <span className="text-zinc-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-indigo-500" 
                            style={{ transformOrigin: "left", width: `${item.progress}%` }}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.15 }}
                          />
                        </div>
                        <span className="text-zinc-500">{item.update}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </motion.div>
            </div>

            {/* Right Column (Text Content) */}
            <motion.div 
              className="lg:col-span-5 space-y-8 flex flex-col justify-start pt-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
              >
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                AI Innovation
              </motion.div>
              <motion.h2 
                className="text-5xl font-black display-font leading-[1.1] tracking-tight"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
              >
                AI Innovation that understands You.
              </motion.h2>
              <motion.p 
                className="text-lg text-zinc-400 font-medium leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
              >
                Handbook's AI isn't just a chatbot. It's a sophisticated curator that understands the Nigerian curriculum nuances—from JAMB prep to Post-UTME challenges.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>






      {/* Mission Section */}
      <section className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-10">
          <div className="space-y-4 mb-12 text-left flex flex-col items-start">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              OUR MISSION
            </div>
            <h2 className="text-4xl md:text-5xl font-black display-font text-slate-900 dark:text-white leading-[1.2] tracking-tight">
              Our Mission.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 border border-zinc-800 rounded-lg overflow-hidden">
            {/* Left Column - Content */}
            <div className="lg:col-span-8 bg-white dark:bg-black p-12 flex flex-col justify-between min-h-[500px] transition-colors">
              {[
                {
                  title: "Democratize learning",
                  description: "Make quality education accessible to every student, regardless of background. We believe that top-tier learning tools should not be a privilege, but a standard available to anyone with the drive to succeed.",
                  details: [
                    "Ingesting data from 30+ regional syllabuses.",
                    "Optimized for low-bandwidth connections.",
                    "Available on mobile, tablet, and desktop.",
                    "Zero cost barriers for core features."
                  ],
                  graphData: [10, 25, 40, 55, 70, 85, 100]
                },
                {
                  title: "Be student-first",
                  description: "Prioritize student needs and learning outcomes above all else. Every feature we build and every algorithm we tune is designed with one goal: to help you understand better and score higher.",
                  details: [
                    "Personalized learning paths for each student.",
                    "Real-time feedback on practice attempts.",
                    "Adaptive difficulty based on performance.",
                    "Focus on deep understanding, not just rote memorization."
                  ],
                  graphData: [40, 45, 50, 65, 80, 85, 95]
                },
                {
                  title: "Build for scale",
                  description: "Create a platform that can support millions of students simultaneously. Our architecture is designed to deliver sub-second response times even during peak exam seasons.",
                  details: [
                    "Serverless architecture scaling dynamically.",
                    "Distributed database for zero latency.",
                    "Edge caching of syllabus content.",
                    "Sub-second AI response times."
                  ],
                  graphData: [10, 15, 25, 40, 60, 80, 100]
                },
                {
                  title: "Maintain excellence",
                  description: "Uphold the highest standards of content accuracy and AI performance. We partner with expert educators to ensure our question banks and explanations are flawless.",
                  details: [
                    "100% human-verified question bank.",
                    "Continuous AI model fine-tuning.",
                    "Zero tolerance for hallucinated facts.",
                    "Weekly content quality audits."
                  ],
                  graphData: [95, 98, 97, 99, 100, 99, 100]
                },
                {
                  title: "Foster curiosity",
                  description: "Encourage students to ask questions and explore beyond the syllabus. We want to build a generation of thinkers, not just test-takers.",
                  details: [
                    "Open-ended AI tutor conversations.",
                    "Deep-dive links on complex topics.",
                    "Gamified milestone achievements.",
                    "Community discussion forums."
                  ],
                  graphData: [30, 50, 40, 70, 60, 90, 85]
                },
                {
                  title: "Earn trust",
                  description: "Build a reliable, secure, and transparent platform that parents and teachers trust. Your data security and privacy are non-negotiable.",
                  details: [
                    "End-to-end encryption on student data.",
                    "Strict adherence to data privacy laws.",
                    "Transparent billing and clear value.",
                    "Regular security penetration tests."
                  ],
                  graphData: [100, 100, 100, 100, 100, 100, 100]
                }
              ].map((content, idx) => (
                idx === activeMissionIndex && (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 h-full flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className="text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                        {content.title}
                      </div>
                      
                      <h3 className="text-3xl font-bold display-font text-indigo-500 leading-tight">
                        {idx === 0 && "Turn quality education into a universal right"}
                        {idx === 1 && "Put the learner at the center of the universe"}
                        {idx === 2 && "Build infrastructure that never breaks"}
                        {idx === 3 && "Never compromise on factual accuracy"}
                        {idx === 4 && "Inspire the next generation of thinkers"}
                        {idx === 5 && "Build a platform worthy of absolute trust"}
                      </h3>

                      <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl font-mono">
                        {content.description}
                      </p>
                    </div>

                    {/* Mock Graph */}
                    <div className="h-24 bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 flex items-end justify-between gap-2">
                      {content.graphData.map((val, i) => (
                        <div key={i} className="flex-1 bg-zinc-800 rounded-t-sm" style={{ height: `${val}%` }}>
                          <div className="w-full h-full bg-indigo-500 opacity-80 hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>

                    <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-6 space-y-3 font-mono text-xs">
                      {content.details.map((detail, i) => (
                        <div key={i} className="text-zinc-500 flex gap-3">
                          <span className="text-indigo-500">›</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </div>

            {/* Right Column - Tabs */}
            <div className="lg:col-span-4 border-l border-zinc-100 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a] transition-colors">
              {[
                { title: "Democratize learning", subtitle: "ACCESS TO ALL STUDENTS" },
                { title: "Be student-first", subtitle: "PRIORITIZE OUTCOMES" },
                { title: "Build for scale", subtitle: "INFRASTRUCTURE FOR MILLIONS" },
                { title: "Maintain excellence", subtitle: "HIGHEST STANDARDS ONLY" },
                { title: "Foster curiosity", subtitle: "ENCOURAGE EXPLORATION" },
                { title: "Earn trust", subtitle: "RELIABLE AND SECURE" }
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveMissionIndex(i)}
                  className={`w-full text-left p-6 border-b border-zinc-800 last:border-0 flex flex-col gap-1 transition-all ${
                    activeMissionIndex === i 
                      ? 'bg-black border-r-2 border-r-indigo-500' 
                      : 'hover:bg-black/50 border-r-2 border-r-transparent'
                  }`}
                >
                  <div className={`text-sm font-bold uppercase tracking-wider ${activeMissionIndex === i ? 'text-slate-900 dark:text-white' : 'text-zinc-500'}`}>
                    {item.title}
                  </div>
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                    {item.subtitle}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-10 space-y-12">
          <div className="space-y-4 text-right flex flex-col items-end">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              PRICING
            </div>
            <h2 className="text-4xl md:text-5xl font-black display-font text-slate-900 dark:text-white tracking-tight leading-tight">
              Simple, transparent pricing.
            </h2>
            <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
              Choose the plan that's right for you. All plans include access to our core question bank.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Scholar",
                price: "₦0",
                period: "/month",
                desc: "For the casual learner.",
                features: ["2 AI Tutoring Hours / mo", "5 Mock Exam Sessions", "10 Document Uploads", "Basic Support"],
                button: "Get Started",
                popular: false,
                link: "/pricing"
              },
              {
                name: "Academic",
                price: "₦5,000",
                period: "/month",
                desc: "For serious researchers.",
                features: ["Unlimited AI Tutoring", "Unlimited Mock Exams", "1,000+ Document Storage", "Advanced Analytics"],
                button: "Upgrade to Academic",
                popular: true,
                link: "/pricing"
              },
              {
                name: "Scholar Plus",
                price: "₦50,000",
                period: "/year",
                desc: "For highest achievers.",
                features: ["Everything in Academic", "Advanced AI Model Access", "Mock Exam Generation", "Personal Success Manager", "Bulk Seat Licensing (Optional)"],
                button: "Join Scholar Plus",
                popular: false,
                link: "/pricing"
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-[#0a0a0a] border ${plan.popular ? 'border-indigo-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl p-8 flex flex-col justify-between relative hover:border-zinc-200 dark:hover:border-zinc-700 transition-all`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                      {plan.period && <span className="text-xs text-zinc-500 font-bold">{plan.period}</span>}
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 font-medium">{plan.desc}</p>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link 
                  href={plan.link}
                  className={`w-full text-center block mt-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                    plan.popular 
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                      : 'bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200'
                  }`}
                >
                  {plan.button}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
        <div className="max-w-4xl mx-auto px-10 text-center space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-12 space-y-6 shadow-premium relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 relative z-10">
              <span className="w-2 h-2 bg-white rounded-full" />
              Get Started Today
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black display-font text-white tracking-tight leading-tight relative z-10">
              Ready to Ace Your Exams?
            </h2>
            
            <p className="text-sm text-indigo-100 font-medium leading-relaxed max-w-2xl mx-auto relative z-10">
              Join thousands of students who are already using Handbook to master their syllabuses and score higher.
            </p>
            
            <div className="pt-4 relative z-10">
              <Link href="/auth" className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-sm hover:bg-zinc-100 transition-all group">
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

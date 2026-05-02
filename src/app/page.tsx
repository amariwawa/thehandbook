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
  Brain
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-indigo-100 dark:selection:bg-white/10 selection:text-[#1d3e8e] transition-colors">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 md:pt-24 pb-32 max-w-7xl mx-auto px-4 md:px-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 -z-10" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-10">
            <div className="animate-on-scroll inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest" data-delay="0">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
              ● WAEC · JAMB · BECE PREP
            </div>
            <h1 className="text-5xl md:text-[5.5rem] font-black display-font leading-[0.95] text-slate-900 dark:text-white tracking-tighter" suppressHydrationWarning>
              <span className="animate-on-scroll block" data-delay="1">WAEC is</span>
              <span className={`animate-on-scroll block ${weeksAway !== null && weeksAway <= 4 ? 'text-[#F59E0B]' : ''}`} data-delay="2">
                {weeksAway !== null ? `${weeksAway} weeks ` : 'Your exam is '}
              </span>
              <span className="animate-on-scroll block text-[#1A3DB5] dark:text-indigo-500" data-delay="3">
                {weeksAway !== null ? 'away.' : 'coming.'}
              </span>
            </h1>
            <p className="animate-on-scroll text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md" data-delay="4">
              Practice real exam questions. Get instant AI explanations when you're stuck. 
              Know exactly where you're weak before exam day.
            </p>
            <div className="animate-on-scroll flex items-center gap-8 pt-4" data-delay="5">
               <Link href="/auth" className="btn-premium">
                 Start Practicing Now
               </Link>
               <Link href="#how-it-works" className="text-sm font-bold text-[#1d3e8e] dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-white/10 hover:border-[#1d3e8e] transition-all pb-1">
                 See How It Works →
               </Link>
            </div>
          </div>

          <div className="animate-on-scroll relative transition-all duration-700 w-full max-w-lg mx-auto lg:max-w-none" data-delay="1">
            <div className="absolute -inset-4 bg-indigo-100/50 rounded-[4rem] blur-3xl" />
            <div className="relative rounded-[4rem] overflow-hidden shadow-2xl asymmetric-br animate-float max-w-full">
              <Image 
                src="/landing_hero.png" 
                alt="Nigerian student studying" 
                width={800} 
                height={1000} 
                className="object-cover h-[500px] md:h-[700px] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32 text-center max-w-7xl mx-auto px-4 md:px-10 overflow-hidden">
        <div className="space-y-6 mb-16 md:mb-24 animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-black display-font tracking-tight">
            Practice Makes <span className="text-[#1d3e8e]">Perfect.</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Every question you attempt moves you closer to your result.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
          {[
            { label: "PRACTICE\nQUESTIONS", val: 10000, suffix: "+", icon: BookOpen },
            { label: "EXAMS\nCOVERED", val: 3, suffix: "", icon: Zap, sublabel: "(JAMB · WAEC · BECE)" },
            { label: "EXPLANATION\nON EVERY QUESTION", val: "AI", suffix: "", icon: GraduationCap },
            { label: "FILE UPLOADS\n& AI REVIEWS", val: "DOCS", suffix: "", icon: FileText },
            { label: "PERSONALIZED\nLEARNING", val: "ADAPTS", suffix: "", icon: Brain, sublabel: "(LEARNS YOUR STYLE)" }
          ].map((stat, i) => (
            <div key={i} className="animate-on-scroll space-y-6 group" data-delay={i + 1}>
              <div className="w-16 h-16 bg-indigo-50 text-[#1d3e8e] rounded-[2rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="text-5xl font-black tracking-tighter text-[#1d3e8e]">
                  {typeof stat.val === 'number' ? <Counter end={stat.val} suffix={stat.suffix} /> : stat.val}
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed whitespace-pre-line">
                  {stat.label}
                </div>
                {stat.sublabel && (
                  <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial Section - Single Item Loop */}
      <section className="py-20 bg-white dark:bg-black overflow-hidden border-y border-slate-50 dark:border-white/5 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-10 text-center space-y-16">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
            ● STUDENT SUCCESS STORIES
          </div>
          
          <div className="flex items-center justify-center min-h-[420px] md:min-h-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center justify-center gap-10 w-full"
              >
                <Quote className="w-12 h-12 text-indigo-100 dark:text-white/10" />
                <blockquote className="text-3xl md:text-5xl font-black display-font tracking-tighter leading-[1.1] text-slate-900 dark:text-white max-w-3xl mx-auto px-4">
                  "{testimonials[testimonialIndex].text}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-12 bg-indigo-600 rounded-full" />
                  <div className="text-left">
                    <div className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{testimonials[testimonialIndex].name}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{testimonials[testimonialIndex].score}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3">
            {testimonials.map((_, i) => (
              <div 
                key={i} 
                className={`h-2 rounded-full transition-all duration-500 ${i === testimonialIndex ? 'w-8 bg-[#1d3e8e] dark:bg-indigo-500' : 'w-2 bg-slate-200 dark:bg-white/10'}`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-slate-50 dark:bg-zinc-950/50">
        <div className="max-w-7xl mx-auto px-10 space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-6xl font-black display-font text-slate-900 dark:text-white tracking-tight">Our Mission</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              To bridge the gap between potential and achievement by providing every Nigerian student with a world-class academic tutor powered by AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              { title: "Inclusion", desc: "Education should not be a luxury. We build for the student in Lagos and the learner in Maiduguri alike.", icon: Zap },
              { title: "Excellence", desc: "We provide high-fidelity, curriculum-aligned content that meets global academic standards.", icon: Star },
              { title: "Empowerment", desc: "Giving students the tools to take control of their learning destiny and unlock their professional horizons.", icon: Crown, img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop" }
            ].map((feature, i) => (
              <div key={i} className={`card-editorial bg-white dark:bg-zinc-900 p-10 space-y-6 ${i === 2 ? 'md:col-span-2 flex flex-col md:flex-row items-center gap-10' : ''}`}>
                <div className="w-12 h-12 bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
                </div>
                {feature.img && (
                  <div className="flex-1 w-full h-48 rounded-3xl overflow-hidden grayscale">
                    <img src={feature.img} alt="Empowerment" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Innovation Section */}
      <section className="py-32 max-w-7xl mx-auto px-10">
        <div className="bg-[#0f172a] rounded-[5rem] p-24 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <h2 className="text-6xl font-black display-font leading-[0.95] tracking-tight">
                AI Innovation <br/>
                that understands <br/>
                <span className="text-indigo-400">You.</span>
              </h2>
              <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-md">
                Handbook's AI isn't just a chatbot. It's a sophisticated curator that understands the Nigerian curriculum nuances—from JAMB prep to Post-UTME challenges.
              </p>
              <ul className="space-y-6">
                {[
                  { title: "Adaptive Learning Algorithms", icon: Zap },
                  { title: "24/7 Contextual Mentorship", icon: MessageCircle },
                  { title: "Performance Pattern Analysis", icon: BarChart3 }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center group-hover:bg-indigo-400 group-hover:text-white transition-all">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold tracking-wide">{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
               <div className="absolute -inset-4 bg-indigo-500/10 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 relative overflow-hidden shadow-2xl">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">🤖</div>
                        <div>
                           <div className="text-xs font-black uppercase tracking-widest text-indigo-400">Handbook AI</div>
                           <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              Active Tutor
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                     </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-6 h-[320px] overflow-hidden flex flex-col justify-end">
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-indigo-600 rounded-2xl rounded-tr-none p-4 max-w-[85%] self-end shadow-xl"
                     >
                        <p className="text-sm font-bold text-white">"I'm struggling with the <span className="text-indigo-200 font-bold">Nigeria 2024 Budget</span> question in Government. Why is it a recurrent expenditure?"</p>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5 }}
                        className="bg-white/5 rounded-2xl rounded-tl-none p-4 max-w-[85%]"
                     >
                        <p className="text-sm font-medium text-slate-300">"Great question! Recurrent expenditure refers to 'ongoing costs' like salaries. In the target WAEC/JAMB context, think of it as maintenance vs development (Capital)."</p>
                     </motion.div>

                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex gap-1.5 p-2"
                     >
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                     </motion.div>
                  </div>

                  {/* Chat Input Mockup */}
                  <div className="pt-4">
                     <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-slate-500 text-xs font-bold">Ask anything about your syllabus...</span>
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                           <ArrowRight className="w-4 h-4" />
                        </div>
                     </div>
                  </div>

                  {/* Decorative Glow */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-[#F4F6FB]/50 dark:bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-10 space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto animate-on-scroll">
            <h2 className="text-6xl font-black display-font text-slate-900 dark:text-white tracking-tight">
              How Handbook <span className="text-[#1d3e8e] dark:text-indigo-400">Works.</span>
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Three steps between where you are and where you need to be.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Choose Your Exam & Subject",
                body: "Select JAMB, WAEC, or BECE. Pick your subject and topic. Start practicing in under 60 seconds.",
                pill: "JAMB · WAEC · BECE"
              },
              {
                step: "02",
                icon: Zap,
                title: "Answer Real-Format Questions",
                body: "Timed practice questions built to match the exact format of your exam. No shortcuts, no guessing — real exam conditions.",
                pill: "TIMED · EXAM FORMAT"
              },
              {
                step: "03",
                icon: Star,
                title: "Get AI Explanations Instantly",
                body: "Get a wrong answer? The AI doesn't just show you the right one — it explains exactly why your answer was wrong and how to remember the correct one.",
                pill: "THE CORE DIFFERENTIATOR",
                featured: true
              }
            ].map((step, i) => (
              <div 
                key={i} 
                className={`animate-on-scroll bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-soft space-y-8 relative overflow-hidden ${step.featured ? 'border-2 border-[#0F1F5C]/30 dark:border-white/10' : 'border border-slate-100 dark:border-white/5'}`}
                data-delay={i + 1}
              >
                <div className="absolute top-8 right-8 text-6xl font-black text-[#1d3e8e] dark:text-indigo-500 opacity-[0.15] display-font">{step.step}</div>
                <div className="w-14 h-14 bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{step.body}</p>
                </div>
                <div className="inline-flex items-center bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {step.pill}
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>


      {/* Pricing Section (Headline Update) */}
      <section className="py-24 bg-slate-50 dark:bg-zinc-950/50">

        <div className="max-w-7xl mx-auto px-10 space-y-24">
           <div className="text-center space-y-6 animate-on-scroll">
             <h2 className="text-6xl font-black display-font text-slate-900 dark:text-white tracking-tight">
               Simple <span className="text-[#1d3e8e] dark:text-indigo-400">Pricing.</span>
             </h2>
             <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
               Start free. Upgrade when you're ready to go all in.
             </p>
           </div>
           
           {/* Existing pricing tiers (simplified for brevity, keep layout) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* tier.popular logic updated with dark variants */}
               {[
                 { name: "Scholar", price: "Free", desc: "Best for light practice", features: ["10 Free Questions/Day", "Basic AI Explanations", "JAMB & WAEC Archive"] },
                 { name: "Academic", price: "₦5,000/mo", desc: "For serious exam prep", features: ["Unlimited Practice", "Advanced AI Tutoring", "Performance Analytics", "Priority Support"], popular: true },
                 { name: "Scholar Plus", price: "₦50,000/yr", desc: "Best for top performers", features: ["All Academic Features", "Advanced AI Models", "Mock Exam Simulation", "Personal Success Manager"] }
               ].map((tier, i) => (
                 <div key={i} className={`card-editorial dark:bg-zinc-900 relative flex flex-col justify-between ${tier.popular ? 'border-[#1d3e8e] dark:border-indigo-500 ring-2 ring-indigo-50 dark:ring-indigo-900/20' : 'dark:border-white/5'}`}>
                   {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1d3e8e] dark:bg-indigo-500 text-white px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Most Popular</div>}
                   <div className="space-y-8">
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black dark:text-white">{tier.name}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{tier.desc}</p>
                     </div>
                     <div className="text-5xl font-black dark:text-white">{tier.price}</div>
                     <ul className="space-y-4">
                       {tier.features.map(f => (
                         <li key={f} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                           <CheckCircle2 className="w-4 h-4 text-[#1d3e8e] dark:text-indigo-400" />
                           {f}
                         </li>
                       ))}
                     </ul>
                   </div>
                   <Link 
                     href="/auth" 
                     className={`mt-12 py-4 rounded-2xl font-bold transition-all text-center ${tier.popular ? 'bg-[#1d3e8e] text-white shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-[#152d67] dark:hover:bg-indigo-600' : 'border-2 border-slate-100 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-[#1d3e8e] dark:hover:border-indigo-400'}`}
                   >
                     Get Started
                   </Link>
                 </div>
               ))}
            </div>
        </div>
      </section>

      {/* Weak Topics CTA */}
      <section className="py-24 bg-white dark:bg-black">
        <div className="max-w-2xl mx-auto px-10 text-center space-y-12 animate-on-scroll">
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
            ● FREE TO START
          </div>
          <h2 className="text-6xl font-black display-font text-slate-900 dark:text-white tracking-tight">
            Find out where <span className="text-[#1d3e8e] dark:text-indigo-400">you're weak.</span>
          </h2>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Take a free 10-question diagnostic. Handbook will tell you exactly which topics 
            to focus on before your exam. No account needed to start.
          </p>
          <div className="space-y-6">
            <Link href="/diagnostic" className="btn-premium px-12 py-5 text-lg inline-block">
              Start My Free Diagnostic
            </Link>
            <p className="text-[14px] text-slate-400 font-bold uppercase tracking-widest">
              Takes 4 minutes · No credit card · Works for JAMB, WAEC & BECE
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

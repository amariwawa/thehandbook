"use client";

import { 
  Zap, 
  Star,
  Users,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const PaymentButton = dynamic(() => import("@/components/PaymentButton"), {
  ssr: false,
});

const plans = [
  {
    name: "Scholar",
    price: "0",
    amount: 0,
    description: "For the casual learner.",
    features: [
      "2 AI Tutoring Hours / mo",
      "5 Mock Exam Sessions",
      "10 Document Uploads",
      { text: "Priority Support", disabled: true }
    ],
    cta: "Get Started",
    color: "bg-white dark:bg-black text-slate-900 dark:text-white border-slate-100 dark:border-white/10"
  },
  {
    name: "Academic",
    price: "5,000",
    amount: 5000,
    description: "For serious researchers.",
    features: [
      "Unlimited AI Tutoring",
      "Unlimited Mock Exams",
      "1,000+ Document Storage",
      "Advanced Analytics",
    ],
    cta: "Upgrade to Academic",
    recommended: true,
    color: "bg-[#1d3e8e] text-white border-transparent"
  },
  {
    name: "Scholar Plus",
    price: "50,000",
    amount: 50000,
    period: "/ year",
    description: "For highest achievers.",
    features: [
      "Everything in Academic",
      "Advanced AI Model Access",
      "Mock Exam Generation",
      "Personal Success Manager",
      "Bulk Seat Licensing (Optional)"
    ],
    cta: "Join Scholar Plus",
    color: "bg-[#f1f5f9] dark:bg-white/5 text-slate-900 dark:text-white border-transparent"
  }
];

const matrixData = [
  { feature: "AI Tutoring (Advanced)", scholar: "2 hours/mo", academic: "Unlimited", scholarPlus: "Unlimited" },
  { feature: "Doc Limit (PDF/Images)", scholar: "10 files", academic: "Unlimited", scholarPlus: "Unlimited" },
  { feature: "Mock Exam Access", scholar: "Basic (5/mo)", academic: "Advanced (Unlimited)", scholarPlus: "Unlimited + Generated" },
  { feature: "Collaborative Workspaces", scholar: "—", academic: "Up to 3 members", scholarPlus: "Unlimited Team Seats" },
  { feature: "Analytics Dashboard", scholar: "—", academic: "Student Pro", scholarPlus: "Admin + Success Feed" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white font-sans transition-colors">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-10 space-y-24 pb-20">
        {/* Header Section */}
        <section className="text-center space-y-10 max-w-4xl mx-auto pt-20">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black display-font leading-[0.9] tracking-tighter text-slate-900 dark:text-white">
              Academic Excellence, <br/>
              <span className="text-[#1d3e8e] dark:text-indigo-400">Curated.</span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed pt-4">
              Choose the foundation for your intellectual journey. From individual scholars to elite scholars, Handbook scales with your ambition.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-[4rem] p-12 border flex flex-col justify-between relative group ${plan.color} ${plan.recommended ? 'shadow-premium scale-105 z-10' : 'shadow-soft dark:shadow-none'}`}
            >
              {plan.recommended && (
                <div className="absolute top-8 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 text-white">
                  <Star className="w-3 h-3 fill-white" />
                  Recommended
                </div>
              )}
              
              <div className="space-y-12">
                <div className="flex justify-between items-start">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black display-font tracking-tight">{plan.name}</h3>
                      <p className={`text-xs font-medium ${plan.recommended ? 'text-white/70' : 'text-slate-400 dark:text-slate-500'}`}>{plan.description}</p>
                   </div>
                   {plan.name === 'Scholar' && <div className="w-10 h-10 bg-indigo-50 dark:bg-white/10 text-[#1d3e8e] dark:text-white rounded-xl flex items-center justify-center"><Zap className="w-5 h-5" /></div>}
                   {plan.name === 'Academic' && <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white"><Star className="w-5 h-5" /></div>}
                   {plan.name === 'Scholar Plus' && <div className="w-10 h-10 bg-[#1d3e8e]/10 dark:bg-[#1d3e8e]/20 text-[#1d3e8e] dark:text-indigo-400 rounded-xl flex items-center justify-center"><Users className="w-5 h-5" /></div>}
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black tracking-tighter">
                    ₦{plan.price}
                  </span>
                  <span className={`text-sm font-bold ${plan.recommended ? 'text-white/60' : 'text-slate-400'}`}>{plan.period || "/ month"}</span>
                </div>

                <ul className="space-y-6">
                  {plan.features.map((feature: any, idx) => (
                    <li key={idx} className={`flex items-center gap-4 text-xs font-bold tracking-tight ${feature.disabled ? 'opacity-30' : ''}`}>
                      {feature.disabled ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className={`w-4 h-4 ${plan.recommended ? 'text-white' : 'text-[#1d3e8e] dark:text-indigo-400'}`} />
                      )}
                      <span>{typeof feature === 'string' ? feature : feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <PaymentButton plan={plan} />
            </motion.div>
          ))}
        </section>

        {/* Feature Matrix */}
        <section className="space-y-12">
           <div className="space-y-4">
              <h2 className="text-4xl font-black display-font tracking-tight">Feature Matrix</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">A granular look at how Handbook empowers your studies.</p>
           </div>
           
           <div className="bg-white dark:bg-black rounded-[3rem] border border-slate-100 dark:border-white/10 overflow-hidden shadow-soft dark:shadow-none transition-colors">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                       <th className="p-8 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider w-1/4">Core Features</th>
                       <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-wider">Scholar</th>
                       <th className="p-8 text-[11px] font-black text-[#1d3e8e] dark:text-indigo-400 uppercase tracking-wider">Academic</th>
                       <th className="p-8 text-[11px] font-black text-slate-400 uppercase tracking-wider">Scholar Plus</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {matrixData.map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50/30 dark:hover:bg-white/5 transition-colors">
                          <td className="p-8 text-xs font-bold text-slate-900 dark:text-white">{row.feature}</td>
                          <td className="p-8 text-xs font-bold text-slate-500 dark:text-slate-400">{row.scholar}</td>
                          <td className="p-8 text-xs font-black text-[#1d3e8e] dark:text-indigo-400">{row.academic}</td>
                          <td className="p-8 text-xs font-bold text-slate-500 dark:text-slate-400">{row.scholarPlus}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        {/* Still Deciding? */}
        <section className="bg-slate-50 dark:bg-white/5 rounded-[5rem] p-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center overflow-hidden transition-colors">
           <div className="space-y-10">
              <h2 className="text-5xl font-black display-font leading-tight tracking-tight text-slate-900 dark:text-white">
                Still deciding?
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                Start with Scholar for free and upgrade when you're ready to break through your academic plateaus.
              </p>
              <div className="flex gap-6">
                <Link 
                  href="/dashboard"
                  className="bg-[#1d3e8e] text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl dark:shadow-none hover:scale-105 active:scale-95 transition-all inline-block"
                >
                  Start Free Trial
                </Link>
                <button className="text-[#1d3e8e] dark:text-indigo-400 font-bold text-sm border-b-2 border-indigo-100 dark:border-indigo-900/50 pb-1">
                  View Success Stories →
                </button>
              </div>
           </div>
            <div className="relative flex justify-center scale-110 isolate">
              {/* Premium Glow */}
              <div className="absolute w-[500px] h-[500px] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[100px] animate-pulse -z-10" />
              
              {/* iPhone 17 Mockup */}
              <div className="relative w-[280px] h-[580px] bg-[#0f172a] rounded-[3.5rem] border-[10px] border-[#1e293b] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col group">
                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-7 bg-black rounded-full z-30 flex items-center justify-center p-1.5 overflow-hidden">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    <div className="h-0.5 w-8 bg-white/20 rounded-full" />
                  </div>
                </div>

                {/* Screen Content */}
                <div className="absolute inset-0 bg-white dark:bg-black overflow-hidden">
                   <img 
                    src="/mockups/iphone-dashboard-clean.png" 
                    alt="Handbook Student Suite" 
                    className="w-full h-full object-cover dark:brightness-90"
                   />
                </div>

                {/* Glass Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              </div>

              {/* Decorative Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-12 top-20 w-12 h-12 bg-white dark:bg-black rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 dark:border-white/10"
              >
                <Zap className="w-6 h-6 text-[#1d3e8e] dark:text-indigo-400" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 bottom-20 w-10 h-10 bg-[#1d3e8e] rounded-xl shadow-xl flex items-center justify-center text-white"
              >
                <Star className="w-5 h-5 fill-white" />
              </motion.div>
            </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

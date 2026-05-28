"use client";

import { 
  Zap, 
  Star,
  Users,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

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
    <div className={`min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white ${GeistMono.className} ${GeistSans.variable} font-bold selection:bg-indigo-100 dark:selection:bg-white/10 selection:text-[#1d3e8e] transition-colors`}>
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        h1, h2, h3, h4 {
          font-family: 'Geist', sans-serif !important;
          font-weight: 700 !important;
          letter-spacing: -0.02em !important;
          line-height: 1.1 !important;
        }
      `}</style>
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-32 pt-20 space-y-24">
        {/* Header Section */}
        <section className="text-center space-y-6 max-w-4xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
          
          <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 mx-auto">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            PRICING
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black display-font text-slate-900 dark:text-white tracking-tighter">
            Academic Excellence, <span className="text-indigo-500">Curated.</span>
          </h1>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
            Choose the foundation for your intellectual journey. From individual scholars to elite scholars, Handbook scales with your ambition.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white dark:bg-[#0a0a0a] border ${plan.recommended ? 'border-indigo-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl p-8 flex flex-col justify-between relative group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Recommended
                </div>
              )}
              
              <div className="space-y-6">
                {/* Top Label */}
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex justify-between">
                  <span>0{i+1} {plan.name.toUpperCase()}</span>
                </div>

                {/* Title and Price */}
                <div className="flex justify-between items-baseline">
                  <h3 className="text-3xl font-bold display-font text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">₦{plan.price}</span>
                    <span className="text-xs text-zinc-500">{plan.period || "/mo"}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed min-h-[40px]">
                  {plan.description}
                </p>

                {/* Divider */}
                <div className="border-t border-dashed border-zinc-100 dark:border-zinc-800 my-4" />

                {/* Features */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Key Features</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature: any, idx) => (
                      <li key={idx} className={`text-xs font-bold flex items-center gap-2 ${typeof feature === 'object' && feature.disabled ? 'text-zinc-300 dark:text-zinc-700' : 'text-slate-700 dark:text-zinc-300'}`}>
                        <span className={typeof feature === 'object' && feature.disabled ? 'text-zinc-300 dark:text-zinc-700' : 'text-indigo-500'}>✓</span>
                        <span>{typeof feature === 'string' ? feature : feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Button */}
              <div className="mt-8">
                <PaymentButton plan={plan} />
              </div>
            </motion.div>
          ))}
        </section>

        {/* Feature Matrix */}
        <section className="space-y-12">
           <div className="space-y-4 text-left">
              <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                COMPARISON
              </div>
              <h2 className="text-4xl font-black display-font tracking-tight text-slate-900 dark:text-white">Feature Matrix</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">A granular look at how Handbook empowers your studies.</p>
           </div>
           
           <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden transition-colors">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 dark:bg-[#141414] border-b border-zinc-100 dark:border-zinc-800">
                       <th className="p-6 text-[11px] font-bold text-zinc-500 uppercase tracking-wider w-1/4">Core Features</th>
                       <th className="p-6 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Scholar</th>
                       <th className="p-6 text-[11px] font-bold text-indigo-500 uppercase tracking-wider">Academic</th>
                       <th className="p-6 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Scholar Plus</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {matrixData.map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-[#141414]/50 transition-colors">
                          <td className="p-6 text-xs font-bold text-slate-900 dark:text-white">{row.feature}</td>
                          <td className="p-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">{row.scholar}</td>
                          <td className="p-6 text-xs font-bold text-indigo-500">{row.academic}</td>
                          <td className="p-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">{row.scholarPlus}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>

        {/* Still Deciding? */}
        <section className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-2xl p-12 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="space-y-6 relative z-10">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              NEXT STEPS
            </div>
            <h2 className="text-4xl md:text-5xl font-black display-font leading-tight tracking-tight text-slate-900 dark:text-white">
              Still deciding?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
              Start with Scholar for free and upgrade when you're ready to break through your academic plateaus.
            </p>
            <div className="flex gap-6 pt-2">
              <Link 
                href="/dashboard"
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center gap-2 group"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center isolate lg:justify-end">
            {/* Premium Glow */}
            <div className="absolute w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -z-10" />
            
            {/* iPhone Mockup (Simplified for identity) */}
            <div className="relative w-[240px] h-[480px] bg-[#0a0a0a] rounded-[2.5rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30" />
              
              {/* Screen Content */}
              <div className="absolute inset-0 bg-white dark:bg-black overflow-hidden flex items-center justify-center">
                 <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Dashboard Preview</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

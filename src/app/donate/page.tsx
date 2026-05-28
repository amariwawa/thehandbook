"use client";

import { Heart, Globe, Users, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { useState, useEffect } from "react";
import Footer from "@/components/ui/Footer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export default function DonatePage() {
  const [amount, setAmount] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!scriptLoaded) {
      alert("Paystack is still loading... please try again in a second.");
      return;
    }

    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_cc624c94575976e59883ca4e49d7d936a6a850cc',
      email: 'scholar@handbook.ai',
      amount: parseFloat(amount) * 100, // Paystack amount is in kobo
      currency: "NGN",
      ref: 'HB-DONATE-' + Math.floor((Math.random() * 1000000000) + 1),
      callback: (response: any) => {
        console.log("Payment Successful", response);
        setIsSuccess(true);
      },
      onClose: () => {
        console.log("Payment Closed");
      }
    });

    handler.openIframe();
  };

  return (
    <div 
      className={`min-h-screen bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white ${GeistMono.className} ${GeistSans.variable} font-bold selection:bg-indigo-100 dark:selection:bg-white/10 selection:text-[#1d3e8e] transition-colors`}
    >
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 p-10 rounded-2xl shadow-2xl text-center space-y-6 max-w-md mx-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <CheckCircle2 className="text-white w-10 h-10 stroke-[3px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black display-font text-slate-900 dark:text-white tracking-tight">Donation Successful!</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Thank you for supporting the future of education. Your contribution means the world to us.</p>
            </div>
            <button 
              onClick={() => setIsSuccess(false)}
              className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
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

      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        {/* Hero Section */}
        <section className="pt-20 pb-16 text-center space-y-8 max-w-4xl mx-auto relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 mx-auto">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              Empowering the Future
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black display-font text-slate-900 dark:text-white tracking-tighter">
              Support Our <span className="text-indigo-500">Mission.</span>
            </h1>
            
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl mx-auto leading-relaxed pt-2">
               Donating helps us reach more students and get access to better AI models. 
               Every contribution directly fuels the academic breakthrough of a young scholar.
            </p>
          </motion.div>
        </section>

        {/* Impact Section */}
        <section className="py-12 bg-[#fdfcff] dark:bg-black text-slate-900 dark:text-white transition-colors">
          <div className="space-y-4 mb-12 text-left flex flex-col items-start">
            <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full" />
              IMPACT
            </div>
            <h2 className="text-4xl md:text-5xl font-black display-font text-slate-900 dark:text-white leading-[1.2] tracking-tight">
              Where Your Money Goes.
            </h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-2xl">
              We ensure every naira is spent efficiently to maximize student impact. Transparency and efficiency are our core values.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "AI MODEL COSTS", desc: "Funding API calls for GPT-4 and Gemini to provide instant, high-quality explanations." },
              { icon: Globe, title: "SERVER & HOSTING", desc: "Keeping the platform fast, secure, and accessible for thousands of students daily." },
              { icon: Users, title: "SCHOLARSHIPS", desc: "Providing premium access to brilliant students from low-income backgrounds." },
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
          </div>
        </section>

        {/* Custom Donation Section */}
        <section className="mt-12 bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-2xl p-8 md:p-12 text-slate-900 dark:text-white relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                CONTRIBUTE
              </div>
              <h2 className="text-4xl md:text-5xl font-black display-font leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Intelligence is Equal. <br/>
                <span className="text-indigo-500">Opportunity isn't.</span>
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-xl">
                By supporting Handbook, you're not just donating to a platform; 
                you're investing in the technical and academic sovereignty of 
                thousands of Nigerian students.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-10 bg-indigo-500 rounded-full" />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">100% Impact</div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Directly towards student success</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 bg-white dark:bg-[#141414] border border-zinc-100 dark:border-zinc-800 p-8 space-y-6 rounded-xl transition-colors">
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Custom Donation</h3>
                <p className="text-xs text-zinc-400 font-medium">Enter amount to support the mission.</p>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-500">₦</span>
                  <input 
                    id="custom-donation-amount"
                    type="number" 
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg py-4 pl-10 pr-4 text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <button 
                  id="complete-donation-btn"
                  onClick={handlePayment}
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-full font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
                >
                  Complete Custom Support
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

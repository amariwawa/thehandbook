"use client";

import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-slate-50 dark:bg-white/5 rounded-[3rem] p-12 text-center space-y-8 border border-slate-100 dark:border-white/10"
      >
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
            <XCircle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black display-font tracking-tight text-slate-900 dark:text-white">
            Payment Failed.
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            We couldn't process your transaction. Please check your card details or balance and try again.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Link 
            href="/pricing"
            className="w-full bg-[#1d3e8e] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again?
          </Link>
          
          <Link 
            href="/"
            className="block text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

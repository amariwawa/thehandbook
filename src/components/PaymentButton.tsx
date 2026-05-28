"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  amount: number;
  cta: string;
  recommended?: boolean;
}

export default function PaymentButton({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Paystack script manually for maximum reliability
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
    if (!scriptLoaded) {
      alert("Paystack is still loading... please try again in a second.");
      return;
    }

    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: 'pk_test_cc624c94575976e59883ca4e49d7d936a6a850cc',
      email: 'scholar@handbook.ai',
      amount: plan.amount * 100, // Paystack amount is in kobo
      currency: "NGN",
      ref: 'HB-' + Math.floor((Math.random() * 1000000000) + 1),
      callback: (response: any) => {
        // THIS IS THE REDIRECT LOGIC
        console.log("Payment Successful", response);
        localStorage.setItem("handbook_auth_active", "true");
        setIsProcessing(true);
        
        // Immediate hard redirect
        window.location.href = "/dashboard";
      },
      onClose: () => {
        window.location.href = "/payment-failed";
      }
    });

    handler.openIframe();
  };

  if (plan.name === "Scholar") {
    return (
      <Link 
        href="/dashboard"
        className="w-full bg-[#141414] border border-zinc-800 text-white py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 hover:bg-zinc-800 transition-all text-center"
      >
        {plan.cta} →
      </Link>
    );
  }

  return (
    <>
      {isProcessing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[3rem] shadow-2xl border border-white/10 text-center space-y-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Check className="text-white w-10 h-10 stroke-[3px]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black display-font text-slate-900 dark:text-white tracking-tight">Payment Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Entering your Student Suite...</p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handlePayment}
        className="w-full bg-[#141414] border border-zinc-800 text-white py-3 rounded-lg font-bold text-sm flex justify-center items-center gap-2 hover:bg-zinc-800 transition-all"
      >
        {plan.cta} →
      </button>
    </>
  );
}

"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";

export default function DocDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Format slug for display
  const title = slug
    ? slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    : "Document";

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
      
      <main className="max-w-4xl mx-auto px-6 md:px-10 pb-32 pt-20 space-y-8">
        <Link href="/docs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-indigo-500 transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Docs
        </Link>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
            <Book className="w-3 h-3" />
            Documentation
          </div>
          <h1 className="text-5xl font-black display-font text-slate-900 dark:text-white tracking-tighter">
            {title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            Detailed information about {title.toLowerCase()}. Learn how to make the most of this feature.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 rounded-lg p-8 space-y-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            This is a dynamically generated documentation page for the feature "{title}". Here you can find all the necessary details, guides, and references to help you succeed.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
            We are constantly updating our documentation to provide the best possible support. If you find any issues or have questions, please reach out to our support team.
          </p>
          
          <div className="bg-[#141414] border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-400">
            {`// Example configuration
{
  "feature": "${slug}",
  "enabled": true,
  "version": "1.0.0"
}`}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

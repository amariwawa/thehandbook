import SidebarLayout from "@/components/ui/SidebarLayout";
import Link from "next/link";

export default function CatalogPage() {
  return (
    <SidebarLayout>
      <div className="space-y-12">
        <header className="space-y-6">
          <h1 className="text-6xl font-extrabold display-font text-slate-900 leading-tight">
            The Academic <span className="text-indigo-600 block sm:inline italic">Curator</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Access over 50,000 professional exam questions from JAMB, WAEC, and BECE, 
            curated and categorized by academic experts.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          {["All Exams", "Mathematics", "English Language", "Physics", "Biology", "Government"].map((cat, i) => (
            <button key={cat} className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
              i === 0 ? "bg-[#1d3e8e] text-white shadow-lg shadow-indigo-100" : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
            }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Main Trending Card */}
          <Link href="/exams/jamb" className="md:col-span-2 group">
            <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center group cursor-pointer hover:shadow-xl transition-all h-full">
               <div className="flex-1 space-y-6 order-2 md:order-1">
                  <div className="bg-pink-50 text-pink-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest w-max">Trending Now</div>
                  <h2 className="text-4xl font-extrabold display-font text-slate-900 leading-tight">JAMB UTME 2024: Complete Mock Series</h2>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Prepare for the upcoming Unified Tertiary Matriculation Examination with our full-length simulations, featuring AI-driven performance analytics.
                  </p>
                  <div className="flex gap-4 pt-2">
                     <button className="bg-[#1d3e8e] text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all">Enroll Practice</button>
                     <button className="text-[#1d3e8e] font-bold text-xs border-b-2 border-indigo-100 pb-1">View Syllabus</button>
                  </div>
               </div>
               <div className="flex-1 w-full h-80 relative rounded-3xl overflow-hidden order-1 md:order-2">
                  <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2670&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" alt="Library" />
               </div>
            </div>
          </Link>



          {/* Side Small Card 1 */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-8 group hover:-translate-y-1 transition-all">
             <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">🔭</div>
                <div className="text-right">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physics</div>
                   <div className="text-xs font-bold text-[#1d3e8e]">WAEC 2023</div>
                </div>
             </div>
             <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Theoretical Mechanics & Optics</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed h-20 overflow-hidden">
                   Master complex light waves and projectile motions with 200+ past questions and detailed video explanations.
                </p>
             </div>
             <div className="pt-4 border-t border-slate-50 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-600">
                   <span>65% Completed</span>
                   <span className="text-[#1d3e8e] cursor-pointer">Resume →</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-600 w-[65%]"></div>
                </div>
             </div>
          </div>

          {/* Small Card 2 */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm space-y-6">
             <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">📖</div>
                <div className="text-right">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">English</div>
                   <div className="text-xs font-bold text-indigo-900">NECO 2023</div>
                </div>
             </div>
             <h3 className="text-xl font-bold text-slate-900">Lexis and Structure</h3>
             <p className="text-sm text-slate-500 font-medium italic">Improve your vocabulary and grammar logic with curated comprehension passages.</p>
             <div className="flex gap-2">
                <span className="bg-slate-100 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider">Comprehension</span>
                <span className="bg-slate-100 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider">Grammar</span>
             </div>
             <button className="w-full border-2 border-slate-100 text-indigo-900 py-3 rounded-2xl font-bold text-xs mt-4 hover:border-indigo-900 transition-all">Start Exam</button>
          </div>

          {/* Small Card 3 */}
          <div className="bg-[#f0f0f0]/50 rounded-[3rem] p-8 border border-slate-100 text-slate-900 space-y-6 grayscale opacity-80 backdrop-blur-sm relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center bg-slate-100/10 z-10 backdrop-blur-[2px]"></div>
             <div className="flex justify-between items-start relative z-20">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-900 rounded-2xl flex items-center justify-center font-bold">∑</div>
                <div className="text-right">
                   <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maths</div>
                   <div className="text-xs font-bold text-indigo-900">JAMB 2023</div>
                </div>
             </div>
             <h3 className="text-xl font-bold relative z-20">Calculus & Trigonometry</h3>
             <p className="text-xs text-slate-500 font-medium relative z-20">Step-by-step solutions for advanced algebraic expressions and calculus limits.</p>
             <div className="flex items-center gap-3 relative z-20">
                 <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300"></div>
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-400"></div>
                 </div>
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">+1.2k Scholars studying</span>
             </div>
             <button className="w-full bg-slate-800/10 text-slate-900 py-3 rounded-2xl font-bold text-xs relative z-20 cursor-not-allowed">Lock Access</button>
          </div>

          {/* BECE Explorer */}
          <div className="bg-white rounded-[3rem] p-8 border border-slate-100 border-dashed shadow-sm flex flex-col items-center justify-center text-center space-y-6 group cursor-pointer">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-slate-100 transition-all">
                📦
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Junior Secondary (BECE)</h3>
                <p className="text-sm text-slate-400 font-medium px-4">Browse our secondary school collection for Basic Education Certification.</p>
             </div>
             <button className="text-[#1d3e8e] font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                EXPLORE COLLECTION <span>↗</span>
             </button>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-10">
           <div className="flex gap-2">
              {[1, 2, 3, "...", 12].map((p, i) => (
                <button key={i} className={`w-10 h-10 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                  i === 0 ? "bg-[#1d3e8e] text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
                }`}>
                  {p}
                </button>
              ))}
           </div>

           <div className="flex gap-4">
              <button className="bg-white text-slate-500 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest border border-slate-100 flex items-center gap-2">
                 <span>≡</span> Filters
              </button>
              <button className="bg-[#1d3e8e] text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3 active:scale-95 transition-all">
                 Next Subject <span>→</span>
              </button>
           </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

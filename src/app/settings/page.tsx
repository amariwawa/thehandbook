"use client";

import SidebarLayout from "@/components/ui/SidebarLayout";
import { 
  User, 
  Bell, 
  ShieldCheck, 
  Smartphone, 
  CreditCard, 
  LogOut,
  Mail,
  Lock,
  ChevronRight,
  ToggleLeft as Toggle,
  Star,
  Clock,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSubjectSelection } from "@/context/SubjectSelectionContext";

export default function SettingsPage() {
  const { profile, updateProfile } = useSubjectSelection();
  const [notifications, setNotifications] = useState({
    curriculum: true,
    insights: false,
    webinars: true
  });

  const [localProfile, setLocalProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    hobbies: "",
    bio: ""
  });

  const [isSaving, setIsSaving] = useState(false);

  // Initialize local state from profile
  useEffect(() => {
    if (profile) {
      const parts = profile.fullName.split(' ');
      setLocalProfile({
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(' ') || "",
        email: profile.email || "",
        hobbies: profile.hobbies || "",
        bio: profile.bio || ""
      });
    }
  }, [profile]);

  const handleSave = () => {
    setIsSaving(true);
    updateProfile({
      fullName: `${localProfile.firstName} ${localProfile.lastName}`.trim(),
      email: localProfile.email,
      hobbies: localProfile.hobbies,
      bio: localProfile.bio
    });
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <SidebarLayout>
      <div className="space-y-12">
        <header className="flex justify-between items-end">
           <div className="space-y-1">
              <h1 className="text-4xl font-black display-font tracking-tight text-slate-900 dark:text-white uppercase">Account Settings</h1>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Forms */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Profile Details - Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
               {/* Left side: Text */}
               <div className="lg:col-span-4 space-y-4">
                  <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                     <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                     IDENTITY
                  </div>
                  <h2 className="text-3xl font-bold display-font text-white leading-[1.2]">
                     Personal information across the platform.
                  </h2>
                  <p className="text-sm text-zinc-400 font-medium leading-relaxed font-mono">
                     Manage your academic identity, email preferences, and personal details. Turn your study profile into a playbook for success.
                  </p>
               </div>

               {/* Right side: Card */}
               <div className="lg:col-span-8 bg-[#141414] border border-zinc-800 rounded-2xl p-10 space-y-8 hover:border-zinc-700 transition-all">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                     <div className="space-y-1">
                        <h3 className="text-xl font-bold text-white">Profile Details</h3>
                        <p className="text-xs text-zinc-500 font-medium">Update your academic presence.</p>
                     </div>
                     <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50"
                     >
                        {isSaving ? "Saving..." : "Save Changes"}
                     </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">First Name</label>
                        <input 
                           type="text" 
                           value={localProfile.firstName} 
                           onChange={(e) => setLocalProfile(prev => ({ ...prev, firstName: e.target.value }))}
                           className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Last Name</label>
                        <input 
                           type="text" 
                           value={localProfile.lastName} 
                           onChange={(e) => setLocalProfile(prev => ({ ...prev, lastName: e.target.value }))}
                           className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Email Address</label>
                        <input 
                           type="email" 
                           value={localProfile.email}
                           onChange={(e) => setLocalProfile(prev => ({ ...prev, email: e.target.value }))}
                           className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none" 
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Passions & Interests (AI Context)</label>
                        <textarea 
                           rows={2} 
                           value={localProfile.hobbies} 
                           onChange={(e) => setLocalProfile(prev => ({ ...prev, hobbies: e.target.value }))}
                           placeholder="Topics you know deeply..."
                           className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none placeholder:text-zinc-700 outline-none" 
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Bio & Academic Interests</label>
                        <textarea 
                           rows={3} 
                           value={localProfile.bio} 
                           onChange={(e) => setLocalProfile(prev => ({ ...prev, bio: e.target.value }))}
                           className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-lg p-4 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none outline-none" 
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Notification Focus */}
            <section className="bg-[#f2f2ef]/40 dark:bg-zinc-900/40 rounded-[3rem] p-12 space-y-10 border border-[#e5e5e0] dark:border-white/5">
               <div className="space-y-1">
                  <h2 className="text-3xl font-black display-font tracking-tight text-slate-900 dark:text-white">Notification Focus</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Fine-tune your library alerts and AI updates.</p>
               </div>

               <div className="space-y-4">
                  {[
                    { key: 'curriculum', icon: GraduationCapIcon, label: "Curriculum Updates", desc: "New modules added to your followed subjects" },
                    { key: 'insights', icon: Zap, label: "AI Research Insights", desc: "Weekly summaries of AI-curated research papers" },
                    { key: 'webinars', icon: Clock, label: "Webinar Invitations", desc: "Exclusive academic sessions and workshops" }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-6 p-6 bg-white/20 dark:bg-white/5 rounded-[2.5rem] border border-white/40 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 transition-all">
                       <div className="w-12 h-12 bg-[#1d3e8e]/10 dark:bg-indigo-500/20 text-[#1d3e8e] dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5" />
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="text-sm font-black text-slate-900 dark:text-white">{item.label}</div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.desc}</p>
                       </div>
                       <button 
                        onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                        className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${notifications[item.key as keyof typeof notifications] ? 'bg-[#1d3e8e]' : 'bg-slate-200'}`}
                       >
                          <motion.div 
                            animate={{ x: notifications[item.key as keyof typeof notifications] ? 24 : 0 }}
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                          />
                       </button>
                    </div>
                  ))}
               </div>
            </section>
          </div>

          {/* Right Sidebar Area */}
          <div className="space-y-8">
             {/* Plan Details */}
             <div className="bg-white dark:bg-zinc-900 rounded-[4rem] p-10 border border-slate-100 dark:border-white/5 shadow-premium space-y-10 relative overflow-hidden">
                <Star className="absolute top-10 right-10 w-24 h-24 text-[#f2f2ef]/50 dark:text-white/5" />
                <div className="space-y-6 relative z-10">
                   <div className="inline-flex bg-indigo-50 dark:bg-white/5 text-[#1d3e8e] dark:text-indigo-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Active Plan</div>
                   <div className="space-y-2">
                      <h3 className="text-4xl font-black display-font tracking-tight dark:text-white">Scholar Plus</h3>
                      <p className="text-[10px] text-slate-400 font-bold leading-relaxed tracking-wider uppercase">Billed annually • Next payment June 2024</p>
                   </div>
                   
                   <div className="space-y-4 pt-4">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                         <span className="text-slate-500">Usage Limit</span>
                         <span className="text-[#1d3e8e]">85%</span>
                      </div>
                      <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div className="h-full bg-[#1d3e8e] w-[85%]" />
                      </div>
                   </div>
                </div>

                <div className="space-y-3 relative z-10 pt-4">
                   <button className="w-full bg-[#f2f2ef]/40 text-[#1d3e8e] py-5 rounded-[2rem] font-black text-[10px] border border-slate-100 uppercase tracking-widest shadow-soft hover:bg-slate-50 transition-all">
                      Manage Subscription
                   </button>
                   <button className="w-full py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#1d3e8e] transition-colors">
                      View Invoices
                   </button>
                </div>
             </div>

             {/* Security Center */}
             <div className="bg-[#f2f2ef]/40 rounded-[4rem] p-10 border border-[#e5e5e0] space-y-10">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black display-font tracking-tight text-slate-900">Security Center</h3>
                </div>

                <div className="space-y-4">
                   {[
                     { label: "Change Password", status: "Last changed 4 months ago", icon: Lock },
                     { label: "2FA Verification", status: "Enabled via App", icon: ShieldCheck, active: true },
                     { label: "Device Management", status: "3 active sessions", icon: Smartphone }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-5 p-5 bg-white rounded-[2rem] border border-slate-100 shadow-soft group hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center shrink-0">
                           <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                           <div className="text-[11px] font-black text-slate-900">{item.label}</div>
                           <div className={`text-[9px] font-bold ${item.active ? 'text-[#1d3e8e]' : 'text-slate-400'} uppercase tracking-wider flex items-center gap-1.5`}>
                              {item.active && <div className="w-1.5 h-1.5 bg-[#1d3e8e] rounded-full" />}
                              {item.status}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>

                <div className="pt-8 text-center space-y-6">
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed px-10">Want to take a break from your studies?</p>
                   <button className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em] border-b-2 border-rose-100 pb-1 hover:border-rose-500 transition-all">
                     Deactivate Account
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

function GraduationCapIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

import { User, Bell, Shield, CreditCard, Save, Upload, Camera } from 'lucide-react'
import { useState } from 'react'

interface SettingsPageProps {
  onUpgradeClick?: () => void
}

export default function SettingsPage({ onUpgradeClick }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'billing'>('profile')

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
          Settings
        </h1>
        <p className="mt-2 text-sm text-brand-textMuted font-sans">
          Manage your account preferences and configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'notifications' ? 'bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <Bell className="h-4 w-4" />
            Notifications
          </button>

          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'billing' ? 'bg-brand-blue/10 text-brand-lightBlue border border-brand-blue/20' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'}`}
          >
            <CreditCard className="h-4 w-4" />
            Billing
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">Profile Details</h3>
                <p className="text-xs text-brand-textMuted font-sans mt-1">Update your personal information and email address.</p>
              </div>

              <div className="space-y-6">
                
                {/* Avatar Upload */}
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                      alt="Profile" 
                      className="h-20 w-20 rounded-full object-cover border-2 border-brand-blue/30 group-hover:border-brand-lightBlue transition-all"
                    />
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 rounded-xl border border-white/10 hover:border-white/20 bg-[#121626] px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer w-max">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Change Picture</span>
                      <input type="file" className="hidden" accept="image/*" />
                    </label>
                    <p className="text-[10px] text-brand-textMuted mt-2">JPG, GIF or PNG. Max size 2MB.</p>
                  </div>
                </div>

                <div className="border-t border-white/5" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">First Name</label>
                    <input type="text" defaultValue="Alex" className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Last Name</label>
                    <input type="text" defaultValue="Reynolds" className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" defaultValue="alex@company.com" className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed outline-none" disabled />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Job Title</label>
                  <input type="text" defaultValue="Frontend Developer" className="w-full bg-[#121626]/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-blue/50 focus:ring-1 focus:ring-brand-blue/30 outline-none transition-all" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex justify-end">
                <button className="flex items-center gap-2 rounded-xl bg-brand-blue hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-blue/15 transition-all active:scale-[0.98]">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">Notification Preferences</h3>
                <p className="text-xs text-brand-textMuted font-sans mt-1">Choose what updates you want to receive.</p>
              </div>

              <div className="space-y-4">
                {[
                  { title: 'New Job Matches', desc: 'Get notified when we find roles matching your resume.' },
                  { title: 'Resume Analysis Tips', desc: 'Weekly tips on how to improve your ATS score.' },
                  { title: 'Marketing Emails', desc: 'Receive offers and news about our platform.' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-4 rounded-xl border border-white/5 bg-[#121626]/40">
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-brand-textMuted mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={idx < 2} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="rounded-2xl border border-white/5 bg-brand-card/45 p-6 backdrop-blur-md shadow-xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight font-sans">Billing & Plan</h3>
                <p className="text-xs text-brand-textMuted font-sans mt-1">Manage your subscription and payment methods.</p>
              </div>

              <div className="p-5 rounded-xl border border-brand-blue/30 bg-brand-blue/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-blue/20 text-brand-lightBlue text-[10px] font-bold uppercase tracking-wider mb-2">
                    Current Plan
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight">Free Tier</h4>
                  <p className="text-xs text-brand-textMuted mt-1">You have 10 resume analyses remaining this month.</p>
                </div>
                <button 
                  onClick={onUpgradeClick}
                  className="rounded-xl bg-white hover:bg-slate-200 text-brand-dark px-6 py-2.5 text-xs font-bold shadow-lg transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  Upgrade to Pro
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

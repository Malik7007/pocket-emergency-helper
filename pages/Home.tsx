
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserStats, Language, AppTheme, WeatherAlert } from '../types';
import { EMERGENCY_NUMBERS, WEATHER_ALERTS } from '../data';
import { getTranslation } from '../translations';
import { Shield, ChevronRight, Zap, Flame, MessageSquare, Info, X, AlertTriangle, Crown, Book, ListChecks, RefreshCw, ArrowUpRight, CheckCircle2, Car, Map as MapIcon, Landmark, Wind, Sun, CloudLightning, Thermometer, Palette, Globe, User, Check, Settings } from 'lucide-react';

interface HomeProps {
  stats: UserStats;
  updateStats: (update: Partial<UserStats>) => void;
  setLanguage: (lang: Language) => void;
  isSyncing: boolean;
  onSync: () => void;
}

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
  { id: 'ur', label: 'اردو' },
  { id: 'hi', label: 'हिन्दी' },
  { id: 'bn', label: 'বাংলা' }
];

const Home: React.FC<HomeProps> = ({ stats, updateStats, setLanguage, isSyncing, onSync }) => {
  const lang = stats.language;
  const tips = stats.customTips || [];
  const todayTip = tips[new Date().getDate() % tips.length] || tips[0];
  const isRtl = lang === 'ar' || lang === 'ur';
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [showAbout, setShowAbout] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const THEMES: { id: AppTheme; label: string; color: string }[] = [
    { id: 'light', label: 'Light', color: 'bg-white border-slate-200' },
    { id: 'dark', label: 'Dark', color: 'bg-slate-900 border-slate-700' },
    { id: 'pink', label: getTranslation('themeLadies', lang), color: 'bg-[#FFD1FF] border-pink-300' },
    { id: 'gold', label: getTranslation('themeGold', lang), color: 'bg-[#d4af37] border-yellow-600' },
    { id: 'cyber', label: getTranslation('themeCyber', lang), color: 'bg-black border-[#f0f]' }
  ];

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        null,
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const handleQuickSos = (type: 'general' | 'hajj' = 'general') => {
    if (stats.emergencyContact) {
      const baseMsg = type === 'hajj' 
        ? getTranslation('hajjSosMsg', lang) 
        : "SOS! HELP NEEDED.";
      const message = `${baseMsg} My GPS: https://www.google.com/maps?q=${coords?.lat || 0},${coords?.lng || 0}`;
      window.location.href = `sms:${stats.emergencyContact}?body=${encodeURIComponent(message)}`;
    } else {
      alert("Please set an emergency contact in Tools > SOS Center.");
      window.location.hash = '#/tools';
    }
  };

  const WeatherAlertCard = ({ alert }: { alert: WeatherAlert }) => {
    const icon = alert.type === 'sandstorm' ? <Wind size={24} /> : 
                 alert.type === 'heatwave' ? <Sun size={24} /> : 
                 alert.type === 'flood' ? <CloudLightning size={24} /> : <Thermometer size={24} />;
    
    const severityColors = {
      moderate: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
      high: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
      extreme: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
    };

    const typeIconColor = {
      sandstorm: 'text-orange-600',
      heatwave: 'text-red-600',
      flood: 'text-blue-600',
      cold: 'text-cyan-600'
    };

    return (
      <div className={`p-5 rounded-[2rem] border-2 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top duration-700 ${severityColors[alert.severity]}`} role="alert">
        <div className={`shrink-0 p-3 bg-white/50 dark:bg-black/20 rounded-2xl shadow-inner ${typeIconColor[alert.type]}`}>
          {icon}
        </div>
        <div className="text-left">
           <h4 className="text-[11px] font-black uppercase tracking-widest mb-1">{alert.title[lang]}</h4>
           <p className="text-[13px] font-bold leading-tight opacity-90">{alert.advisory[lang]}</p>
           <div className="mt-2 flex items-center gap-2">
             <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
               {alert.severity} Severity
             </span>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4 py-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{getTranslation('appName', lang)}</h1>
              {stats.isPremium && <Crown size={16} className="text-yellow-500 animate-pulse" />}
              <button onClick={() => setShowAbout(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-600 transition-colors">
                <Settings size={18} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`} />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                {isOnline ? getTranslation('online', lang) : getTranslation('offline', lang)} • {getTranslation('tagline', lang)}
              </p>
              {isOnline && (
                <button onClick={onSync} disabled={isSyncing} className="ml-2 text-red-500">
                  <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-lg flex items-center gap-2 bg-orange-100 text-orange-600 shadow-sm">
               <Flame size={14} fill="currentColor" />
               <span className="font-black text-xs">{stats.currentStreak}</span>
            </div>
            <div className={`px-3 py-1 rounded-lg flex items-center gap-2 shadow-lg ${stats.isPremium ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'}`}>
              <Zap size={14} fill="currentColor" />
              <span className="font-black text-xs">{stats.points}</span>
            </div>
          </div>
        </div>
      </header>

      {/* SOS Section */}
      <section className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl border border-slate-800 space-y-3">
        <button 
          onClick={() => handleQuickSos('general')}
          className="w-full bg-red-600 text-white py-5 rounded-2xl flex items-center justify-center gap-4 shadow-xl active:scale-[0.98] transition-all"
        >
          <MessageSquare size={24} />
          <span className="font-black text-lg tracking-tighter uppercase">{getTranslation('sendSos', lang)}</span>
        </button>
        <button 
          onClick={() => handleQuickSos('hajj')}
          className="w-full bg-emerald-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all border border-emerald-500/30"
        >
          <Landmark size={20} />
          <span className="font-black text-xs tracking-widest uppercase">{getTranslation('hajjUmrahSos', lang)}</span>
        </button>
      </section>

      {/* WEATHER ALERTS SECTION */}
      {WEATHER_ALERTS.length > 0 && (
        <section className="space-y-3">
           <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Alerts</h2>
          </div>
          <div className="space-y-3">
            {WEATHER_ALERTS.map(alert => (
              <WeatherAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </section>
      )}

      {/* PROMINENT SAFETY CHECKLIST SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation('checklists', lang)}</h2>
        </div>
        {stats.checklists.length > 0 ? (
          <Link to="/checklists" className="block bg-white dark:bg-[#1e1e1e] p-6 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 shadow-xl active:scale-[0.98] transition-all group overflow-hidden relative">
             <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-base uppercase tracking-tight text-slate-800 dark:text-slate-200">{stats.checklists[0].title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ongoing Preparedness</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-slate-900 dark:text-white leading-none block">
                    {Math.round((stats.checklists[0].items.filter(i=>i.completed).length / stats.checklists[0].items.length) * 100)}%
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Complete</span>
                </div>
             </div>
             <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2 relative z-10">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000 ease-out" 
                  style={{ width: `${(stats.checklists[0].items.filter(i=>i.completed).length / stats.checklists[0].items.length) * 100}%` }}
                />
             </div>
             <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase text-slate-600 dark:text-slate-400 group-hover:text-red-500 transition-colors relative z-10">
                <span>Resume Checklist</span>
                <div className="flex items-center gap-1">
                  {getTranslation('viewAll', lang)} <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />
                </div>
             </div>
             <div className="absolute -bottom-4 -right-4 opacity-[0.03] dark:opacity-[0.07] pointer-events-none transform rotate-12">
               <ListChecks size={120} />
             </div>
          </Link>
        ) : (
          <Link 
            to="/checklists" 
            className="w-full p-8 bg-gradient-to-br from-white to-slate-50 dark:from-[#1e1e1e] dark:to-[#181818] border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] group relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6 relative z-10">
               <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                 <ListChecks size={32} />
               </div>
               <div>
                 <h3 className="font-black text-lg uppercase tracking-tight text-slate-900 dark:text-white">{getTranslation('manualTitle', lang)}</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Essential Offline Readiness</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-2 relative z-10">
               <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50">
                  <MapIcon size={14} className="text-red-500" />
                  <span className="text-[9px] font-black uppercase text-slate-600 dark:text-slate-400">Hajj Kit</span>
               </div>
               <div className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-2 border border-slate-200/50 dark:border-slate-700/50">
                  <Car size={14} className="text-blue-500" />
                  <span className="text-[9px] font-black uppercase text-slate-600 dark:text-slate-400">Car Essentials</span>
               </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase text-red-600 tracking-widest relative z-10">
               <span>Open Recommended Templates</span>
               <ArrowUpRight size={16} />
            </div>
            
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
          </Link>
        )}
      </section>

      {/* Daily Hack */}
      <section className="bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] p-7 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
          <Shield size={16} />
          <span>{getTranslation('dailyHack', lang)}</span>
        </div>
        <p className="text-lg font-bold text-slate-800 dark:text-white leading-tight mb-5 italic">
          "{todayTip?.text[lang]}"
        </p>
        <div className="flex items-center justify-between">
           <Link 
            to="/tips" 
            className="inline-flex items-center text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            {getTranslation('viewAll', lang)}
          </Link>
          <div className="flex items-center gap-2 opacity-30">
            <Zap size={16} className="text-red-600" />
            <span className="text-[8px] font-black uppercase tracking-widest">Tips for You</span>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <Zap size={80} fill="currentColor" />
        </div>
      </section>

      {/* Main Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="/guides" className="bg-white dark:bg-[#1e1e1e] p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-transform group">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Book size={32} />
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest">{getTranslation('safetyGuides', lang)}</span>
        </Link>
        <Link to="/tools" className="bg-white dark:bg-[#1e1e1e] p-7 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-4 active:scale-95 transition-transform group">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Zap size={32} />
          </div>
          <span className="font-black text-[10px] uppercase tracking-widest">{getTranslation('quickTools', lang)}</span>
        </Link>
      </div>

      {/* Settings & About Drawer */}
      {showAbout && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-t-[3rem] p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setShowAbout(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-black mb-1 uppercase text-slate-900 dark:text-white text-center tracking-tighter">{getTranslation('appName', lang)}</h2>
            <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Production Release v1.3.0</p>
            
            <div className="space-y-8">
               {/* Language Section */}
               <section className="space-y-4">
                 <div className="flex items-center gap-2 px-1">
                   <Globe size={16} className="text-blue-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Language Preferences</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                   {LANGUAGES.map(l => (
                     <button 
                       key={l.id} 
                       onClick={() => setLanguage(l.id)} 
                       className={`p-3 rounded-2xl font-black text-[10px] uppercase border transition-all flex items-center justify-between ${stats.language === l.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'}`}
                     >
                       {l.label}
                       {stats.language === l.id && <Check size={12} />}
                     </button>
                   ))}
                 </div>
               </section>

               {/* Theme Section */}
               <section className="space-y-4">
                 <div className="flex items-center gap-2 px-1">
                   <Palette size={16} className="text-red-500" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{getTranslation('theme', lang)}</h3>
                 </div>
                 <div className="grid grid-cols-3 gap-2">
                   {THEMES.map(t => (
                     <button 
                       key={t.id} 
                       onClick={() => updateStats({ theme: t.id })}
                       className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${stats.theme === t.id ? 'border-red-600 bg-red-50 dark:bg-red-900/10 shadow-inner' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'}`}
                     >
                       <div className={`w-10 h-10 rounded-full border-2 ${t.color}`} />
                       <span className={`text-[9px] font-black uppercase ${stats.theme === t.id ? 'text-red-600' : 'text-slate-400'}`}>{t.label}</span>
                     </button>
                   ))}
                 </div>
               </section>

               {/* Premium Status */}
               <section className="bg-slate-50 dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${stats.isPremium ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-200 text-slate-400'}`}>
                      <Crown size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-tight">{stats.isPremium ? 'Premium Active' : 'Basic Member'}</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{stats.isPremium ? 'Full Offline Access Unlocked' : 'Limited features'}</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => updateStats({ isPremium: !stats.isPremium })} 
                   className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${stats.isPremium ? 'bg-slate-900 text-white' : 'bg-yellow-500 text-black shadow-lg shadow-yellow-200/50'}`}
                 >
                   {stats.isPremium ? 'Downgrade' : 'Unlock All'}
                 </button>
               </section>

               {/* Manual & Dev Info */}
               <div className="space-y-3">
                  <Link to="/guidelines" onClick={() => setShowAbout(false)} className="flex items-center justify-between p-5 bg-white dark:bg-[#1e1e1e] border border-slate-100 dark:border-slate-800 rounded-3xl group shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl"><Book size={20} /></div>
                      <span className="text-xs font-black uppercase tracking-widest">{getTranslation('manualTitle', lang)}</span>
                    </div>
                    <ChevronRight size={18} className={`text-slate-400 ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>

                  <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 shadow-xl relative overflow-hidden group border border-slate-800">
                     <div className="flex items-center gap-3 relative z-10">
                        <div className="p-3 bg-white/10 rounded-2xl shadow-inner"><User size={20} className="text-red-500" /></div>
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/50">{getTranslation('devInfo', lang)}</h4>
                          <p className="font-black text-sm tracking-tight text-white">{getTranslation('devName', lang)}</p>
                        </div>
                     </div>
                     <div className="relative z-10 space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">Organization</h4>
                        <p className="font-black text-xs uppercase text-red-500 tracking-tight leading-none">{getTranslation('orgName', lang)}</p>
                     </div>
                     <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase opacity-70 relative z-10">
                       Engineered for high-reliability in critical offline environments. Optimized for Hajj, travel, and emergencies.
                     </p>
                     <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                        <Landmark size={80} />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

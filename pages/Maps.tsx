
import React, { useState } from 'react';
import { Language, MapPoint } from '../types';
import { getTranslation } from '../translations';
import { MapPin, Info, ArrowLeft, Search, Navigation2, Cross, Shield, Building2, Landmark, Filter, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POI_TEMPLATES = [
  { id: 'all', label: 'All Points', icon: Landmark },
  { id: 'hospital', label: 'Hospitals', icon: Cross },
  { id: 'police', label: 'Police Stations', icon: Shield },
  { id: 'shelter', label: 'Emergency Shelters', icon: Building2 },
];

const POINTS_OF_INTEREST: MapPoint[] = [
  { id: '1', name: { en: 'Central Hospital', ar: 'المستشفى المركزي', ur: 'مرکزی ہسپتال', hi: 'केंद्रीय अस्पताल', bn: 'কেন্দ্রীয় হাসপাতাল' }, type: 'hospital', coords: { x: 30, y: 40 } },
  { id: '2', name: { en: 'Police Station', ar: 'مركز الشرطة', ur: 'پولیس اسٹیشن', hi: 'पुलिस स्टेशन', bn: 'পুলিশ স্টেশন' }, type: 'police', coords: { x: 70, y: 20 } },
  { id: '3', name: { en: 'Emergency Shelter', ar: 'ملجأ الطوارئ', ur: 'ہنگامی پناہ گاہ', hi: 'आपातकालीन आश्रय', bn: 'জরুরি আশ্রয়' }, type: 'shelter', coords: { x: 50, y: 75 } },
  { id: '4', name: { en: 'Al-Noor Hospital', ar: 'مستشفى النور', ur: 'النور ہسپتال', hi: 'अल-नूर अस्पताल', bn: 'আল-নূর হাসপাতাল' }, type: 'hospital', coords: { x: 15, y: 65 } },
  { id: '5', name: { en: 'Riyadh Safe Zone', ar: 'منطقة الرياض الآمنة', ur: 'ریاض محفوظ زون', hi: 'रियाद सुरक्षित क्षेत्र', bn: 'রিয়াদ নিরাপদ জোন' }, type: 'shelter', coords: { x: 85, y: 45 } },
];

const MapsPage: React.FC<{ language: Language }> = ({ language }) => {
  const navigate = useNavigate();
  const isRtl = language === 'ar' || language === 'ur';
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPoints = POINTS_OF_INTEREST.filter(poi => {
    const matchesFilter = activeFilter === 'all' || poi.type === activeFilter;
    const matchesSearch = poi.name[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-4 flex flex-col min-h-screen bg-slate-50 dark:bg-[#121212]">
      <header className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm active:scale-95 transition-all">
            <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tighter">{getTranslation('maps', language)}</h1>
        </div>
        
        <div className="relative">
          <Search size={18} className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'} text-slate-400`} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getTranslation('mapAdvanced', language)}
            className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm outline-none font-bold text-sm`}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {POI_TEMPLATES.map(tmpl => (
            <button 
              key={tmpl.id}
              onClick={() => setActiveFilter(tmpl.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeFilter === tmpl.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                  : 'bg-white dark:bg-[#1e1e1e] text-slate-400 border border-slate-100 dark:border-slate-800'
              }`}
            >
              <tmpl.icon size={12} />
              {tmpl.label}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-white dark:bg-[#1e1e1e] rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl mb-6 flex-grow relative min-h-[400px]">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#0c0c0c] flex items-center justify-center">
          {/* Static SVG Map with improved visuals */}
          <svg className="w-full h-full text-slate-200 dark:text-slate-900" viewBox="0 0 100 100">
             <defs>
               <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                 <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
               </pattern>
             </defs>
             <rect width="100" height="100" fill="url(#grid)" />
             <path d="M0,25 Q40,35 60,10 T100,30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5" className="opacity-40" />
             <path d="M10,0 Q35,50 15,100" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8" className="opacity-30" />
          </svg>
          
          {filteredPoints.map(poi => (
            <div 
              key={poi.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ left: `${poi.coords.x}%`, top: `${poi.coords.y}%` }}
              onClick={() => alert(poi.name[language])}
            >
              <div className={`p-3 rounded-2xl shadow-xl transition-all hover:scale-125 group-active:scale-95 border-2 border-white dark:border-slate-900 ${
                poi.type === 'hospital' ? 'bg-red-500 text-white' : 
                poi.type === 'police' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
              }`}>
                {poi.type === 'hospital' ? <Cross size={18} /> : 
                 poi.type === 'police' ? <Shield size={18} /> : <Building2 size={18} />}
              </div>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 text-white text-[10px] font-black py-1 px-3 rounded-xl opacity-0 group-hover:opacity-100 whitespace-nowrap z-30 transition-all uppercase tracking-widest shadow-2xl`}>
                {poi.name[language]}
              </div>
            </div>
          ))}
        </div>
        
        <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-4 z-40">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 p-3 rounded-2xl"><Navigation2 size={24} /></div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Offline reference hubs. Enable GPS for live precise distance calculation.
          </p>
        </div>
      </div>

      <div className="space-y-4 pb-10">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nearby Emergency Hubs</h2>
        {filteredPoints.map(poi => (
          <div key={poi.id} className="bg-white dark:bg-[#1e1e1e] p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between active:scale-95 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                poi.type === 'hospital' ? 'bg-red-50 dark:bg-red-900/10 text-red-500' : 
                poi.type === 'police' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-500' : 'bg-green-50 dark:bg-green-900/10 text-green-500'
              }`}>
                {poi.type === 'hospital' ? <Cross size={20} /> : 
                 poi.type === 'police' ? <Shield size={20} /> : <Building2 size={20} />}
              </div>
              <div>
                <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight block">{poi.name[language]}</span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{poi.type} Point</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-green-500">
               <CheckCircle2 size={12} />
               <span className="text-[10px] font-black uppercase">Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapsPage;

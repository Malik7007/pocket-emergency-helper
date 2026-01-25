
import React, { useState, useMemo } from 'react';
import { Guide, UserStats } from '../types';
import { getTranslation } from '../translations';
import { Search, ChevronRight, X, MapPin, Shield, Info, BookOpen, AlertCircle, Filter } from 'lucide-react';

interface GuidesProps {
  stats: UserStats;
  updateStats: (update: Partial<UserStats>) => void;
  addPoints: (amount: number) => void;
}

const CATEGORIES = ['all', 'health', 'security', 'auto', 'environment', 'ksa'];

const Guides: React.FC<GuidesProps> = ({ stats, updateStats, addPoints }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const lang = stats.language;
  const isRtl = lang === 'ar' || lang === 'ur';
  const allGuides = stats.customGuides || [];

  const filteredGuides = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return allGuides.filter(guide => {
      const matchesSearch = guide.title[lang].toLowerCase().includes(term) || 
                            getTranslation(guide.category, lang).toLowerCase().includes(term);
      const matchesCategory = activeCategory === 'all' || guide.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, lang, allGuides]);

  const handleComplete = (id: string) => {
    if (!stats.guidesCompleted.includes(id)) {
      const newList = [...stats.guidesCompleted, id];
      updateStats({ guidesCompleted: newList });
      addPoints(50);
    }
    setSelectedGuide(null);
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-black mb-1 tracking-tighter uppercase">{getTranslation('safetyGuides', lang)}</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Preloaded expert safety instructions</p>
      </header>
      
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
          <input 
            type="text" 
            placeholder={getTranslation('searchPlaceholder', lang)}
            className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white dark:bg-[#1e1e1e] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm outline-none font-bold text-sm`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'bg-white dark:bg-[#1e1e1e] text-slate-400 border border-slate-100 dark:border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All' : getTranslation(cat, lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredGuides.length > 0 ? filteredGuides.map(guide => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="w-full p-5 bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between text-start active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                guide.category === 'health' ? 'bg-red-50 text-red-500' :
                guide.category === 'auto' ? 'bg-blue-50 text-blue-500' :
                guide.category === 'environment' ? 'bg-green-50 text-green-500' :
                guide.category === 'security' ? 'bg-slate-100 text-slate-600' : 'bg-orange-50 text-orange-600'
              }`}>
                {guide.isKsaSpecific ? <MapPin size={22} /> : <Shield size={22} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-tight">{guide.title[lang]}</h3>
                  {guide.isNew && <span className="bg-red-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black">NEW</span>}
                </div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{getTranslation(guide.category, lang)}</span>
              </div>
            </div>
            <ChevronRight size={18} className={`text-slate-300 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        )) : (
          <div className="text-center py-20 bg-slate-100 dark:bg-white/5 rounded-[3rem]">
            <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No matching guides found</p>
          </div>
        )}
      </div>

      {selectedGuide && (
        <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-md flex items-end justify-center">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-md rounded-t-[3rem] p-8 max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
             <header className="flex justify-between items-start mb-8">
                <div>
                   <span className="text-[10px] text-red-500 font-black uppercase tracking-widest mb-1 block">{getTranslation(selectedGuide.category, lang)}</span>
                   <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase">{selectedGuide.title[lang]}</h2>
                </div>
                <button onClick={() => setSelectedGuide(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400"><X size={24}/></button>
             </header>

             <div className="space-y-4">
                {selectedGuide.content.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="font-black text-red-500 text-lg leading-none">{idx + 1}</span>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{step[lang].replace(/^\d+\.\s+/, '')}</p>
                  </div>
                ))}
             </div>

             <button 
                onClick={() => handleComplete(selectedGuide.id)} 
                className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
             >
                {getTranslation('gotIt', lang)}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guides;

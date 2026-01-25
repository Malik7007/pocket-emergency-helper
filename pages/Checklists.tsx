
import React, { useState } from 'react';
import { UserStats, Checklist } from '../types';
import { getTranslation } from '../translations';
import { Plus, Trash2, CheckSquare, Square, X, ListChecks, Sparkles, PlusCircle, CheckCircle2, Car, Map as MapIcon } from 'lucide-react';

interface ChecklistsPageProps {
  stats: UserStats;
  updateStats: (update: Partial<UserStats>) => void;
  addPoints: (amount: number) => void;
}

const TEMPLATES = [
  {
    title: 'Hajj & Umrah Essentials',
    icon: <MapIcon size={24} />,
    color: 'green',
    items: ['Ihram Clothing', 'Comfortable Walking Shoes', 'Prayer Mat', 'Small Unscented Soap', 'Hajj ID/Permit', 'Small Quran/Dua Book', 'Portable Fan', 'Medication & First Aid']
  },
  { 
    title: 'Car Emergency Kit', 
    icon: <Car size={24} />,
    color: 'blue',
    items: ['Jumper Cables', 'Spare Tire & Jack', 'First Aid Kit', 'Flashlight & Batteries', 'Reflective Triangles', 'Water Bottles']
  }
];

const ChecklistsPage: React.FC<ChecklistsPageProps> = ({ stats, updateStats, addPoints }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const lang = stats.language;
  const isRtl = lang === 'ar' || lang === 'ur';

  const addChecklist = (title: string, items: string[] = []) => {
    const newList: Checklist = {
      id: Date.now().toString(),
      title: title,
      items: items.map(text => ({ id: Math.random().toString(36).substr(2, 9), text, completed: false }))
    };
    updateStats({ checklists: [newList, ...stats.checklists] });
    addPoints(20);
    setShowAdd(false);
    setNewTitle('');
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    const updated = stats.checklists.map(c => {
      if (c.id === checklistId) {
        return {
          ...c,
          items: c.items.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i)
        };
      }
      return c;
    });
    updateStats({ checklists: updated });
  };

  return (
    <div className="p-4 pb-24 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">{getTranslation('checklists', lang)}</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Offline Preparedness Planning</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)} 
          className="bg-slate-900 dark:bg-red-600 text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-transform" 
          aria-label="Add Checklist"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Recommended Templates Hero */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Sparkles size={16} className="text-orange-500" />
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{getTranslation('templates', lang)}</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {TEMPLATES.map((tmpl, idx) => (
            <button 
              key={idx}
              onClick={() => addChecklist(tmpl.title, tmpl.items)}
              className={`w-full bg-white dark:bg-[#1e1e1e] border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 text-left active:scale-[0.98] transition-all shadow-lg flex items-center justify-between group overflow-hidden relative`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-14 h-14 bg-${tmpl.color}-50 dark:bg-${tmpl.color}-900/20 text-${tmpl.color}-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                  {tmpl.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-tight">{tmpl.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tmpl.items.length} Items Included</p>
                </div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-colors relative z-10">
                <Plus size={20} />
              </div>
              <div className={`absolute top-0 right-0 w-24 h-24 bg-${tmpl.color}-500/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12`} />
            </button>
          ))}
        </div>
      </section>

      {/* Checklists Main View */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Active Preparedness</h2>
        {stats.checklists.length > 0 ? stats.checklists.map(list => {
          const completedCount = list.items.filter(i => i.completed).length;
          const totalCount = list.items.length;
          const progress = Math.round((completedCount / totalCount) * 100) || 0;

          return (
            <div key={list.id} className="bg-white dark:bg-[#1e1e1e] rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-md animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-sm uppercase tracking-tight text-slate-800 dark:text-slate-200">{list.title}</h3>
                  <button 
                    onClick={() => updateStats({ checklists: stats.checklists.filter(c => c.id !== list.id) })} 
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors" 
                    aria-label="Delete Checklist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                    <span>{getTranslation('progress', lang)}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-green-500 transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {list.items.map(item => (
                  <button key={item.id} onClick={() => toggleItem(list.id, item.id)} className="w-full flex items-center gap-4 text-left group active:scale-[0.98] transition-all">
                    <div className={`p-2 rounded-xl transition-all shadow-sm ${item.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-300'}`}>
                      {item.completed ? <CheckSquare size={22} /> : <Square size={22} />}
                    </div>
                    <span className={`text-sm font-bold tracking-tight transition-all ${item.completed ? 'text-slate-300 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 bg-slate-100 dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <ListChecks size={48} className="mx-auto text-slate-300 mb-4 opacity-40" />
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No active checklists</p>
          </div>
        )}
      </div>

      {/* Add Custom Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-sm rounded-t-[3rem] p-8 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
             <header className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter">New Checklist</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 text-slate-400"><X size={24} /></button>
             </header>
             <input 
               autoFocus
               type="text" 
               className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-sm uppercase outline-none mb-6"
               placeholder="Checklist Title"
               value={newTitle}
               onChange={(e) => setNewTitle(e.target.value)}
             />
             <button 
               onClick={() => addChecklist(newTitle || 'Custom Checklist')}
               className="w-full py-5 bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
             >
               Create Checklist
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistsPage;


import React, { useState, useRef, useMemo, useEffect } from 'react';
import { UserStats, Tip } from '../types';
import { getTranslation } from '../translations';
import { Share2, Sparkles, ChevronLeft, ChevronRight, Search, X, AlertCircle, Palette, Crown, Lock } from 'lucide-react';

interface TipsProps {
  stats: UserStats;
  updateStats: (update: Partial<UserStats>) => void;
  addPoints: (amount: number) => void;
}

const Tips: React.FC<TipsProps> = ({ stats, updateStats, addPoints }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [shareTheme, setShareTheme] = useState<'red' | 'dark' | 'gold' | 'cyber'>('red');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lang = stats.language;
  const isRtl = lang === 'ar' || lang === 'ur';

  const allTips = stats.customTips || [];

  const filteredTips = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    const visibleTips = stats.isPremium ? allTips : allTips.filter(t => !t.isPremiumOnly);
    if (!term) return visibleTips;
    return visibleTips.filter(tip => 
      tip.text[lang].toLowerCase().includes(term) || 
      tip.category[lang].toLowerCase().includes(term)
    );
  }, [searchTerm, lang, allTips, stats.isPremium]);

  const handleRead = (id: number) => {
    if (!stats.tipsRead.includes(id)) {
      updateStats({ tipsRead: [...stats.tipsRead, id] });
      addPoints(10);
    }
  };

  const shareTipAsImage = async () => {
    if (filteredTips.length === 0) return;
    const tip = filteredTips[currentIdx];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set colors based on chosen share theme
    let bgColor = '#dc2626';
    let textColor = 'white';
    if (shareTheme === 'dark') { bgColor = '#121212'; }
    if (shareTheme === 'gold') { bgColor = '#d4af37'; textColor = '#000'; }
    if (shareTheme === 'cyber') { bgColor = '#000'; textColor = '#0ff'; }

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 400, 400);
    
    ctx.fillStyle = textColor;
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    
    const words = tip.text[lang].split(' ');
    let line = '';
    let y = 160;
    for(let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > 340 && n > 0) {
        ctx.fillText(line, 200, y);
        line = words[n] + ' ';
        y += 35;
      } else { line = testLine; }
    }
    ctx.fillText(line, 200, y);
    ctx.font = 'bold italic 18px Arial';
    ctx.globalAlpha = 0.8;
    ctx.fillText(getTranslation('appName', lang), 200, 360);
    
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'safety-tip.png', { type: 'image/png' });
      if (navigator.share) {
        await navigator.share({ files: [file], title: 'Pocket Helper Tip', text: tip.text[lang] });
      }
    } catch (err) { console.error(err); }
  };

  const activeTip = filteredTips[currentIdx];

  const cycleShareTheme = () => {
    if (!stats.isPremium) return;
    const themes: ('red' | 'dark' | 'gold' | 'cyber')[] = ['red', 'dark', 'gold', 'cyber'];
    const idx = themes.indexOf(shareTheme);
    setShareTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <div className="p-4 flex flex-col min-h-screen pb-24">
      <h1 className="text-2xl font-bold mb-4">{getTranslation('tips', lang)}</h1>
      <div className="relative mb-6">
        <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
        <input 
          type="text" 
          placeholder={getTranslation('searchPlaceholder', lang)}
          className={`w-full ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-red-500`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-grow flex flex-col justify-center items-center gap-6">
        {filteredTips.length > 0 ? (
          <>
            <div className={`relative w-full aspect-square max-w-sm rounded-[3rem] p-8 flex flex-col justify-center text-center shadow-2xl transition-all duration-300 ${
              shareTheme === 'red' ? 'bg-red-600 text-white' :
              shareTheme === 'dark' ? 'bg-slate-900 text-white border-2 border-slate-800' :
              shareTheme === 'gold' ? 'bg-[#d4af37] text-black border-4 border-yellow-200 shadow-yellow-200' :
              'bg-black text-[#0ff] border-2 border-[#f0f] shadow-[0_0_20px_#f0f]'
            }`}>
               <p className="text-2xl font-bold leading-tight">"{activeTip.text[lang]}"</p>
               <canvas ref={canvasRef} width="400" height="400" className="hidden"></canvas>
            </div>

            <div className="flex items-center gap-4 w-full max-w-sm">
               <button onClick={() => setCurrentIdx(prev => (prev - 1 + filteredTips.length) % filteredTips.length)} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center active:scale-90"><ChevronLeft size={24}/></button>
               <button onClick={() => handleRead(activeTip.id)} className="flex-grow h-14 rounded-2xl bg-slate-900 text-white font-bold">{getTranslation('gotIt', lang)}</button>
               <button onClick={() => setCurrentIdx(prev => (prev + 1) % filteredTips.length)} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center active:scale-90"><ChevronRight size={24}/></button>
            </div>

            <div className="flex gap-2 w-full max-w-sm">
              <button 
                onClick={cycleShareTheme}
                className={`flex-grow h-14 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest ${stats.isPremium ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                {stats.isPremium ? <Palette size={18} /> : <Lock size={14} />} {getTranslation('customCard', lang)}
              </button>
              <button 
                onClick={shareTipAsImage} 
                className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95"
              >
                <Share2 size={20} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10 px-6">
            <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
            <p className="text-slate-500 font-bold">Try different keywords or upgrade for more tips.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tips;

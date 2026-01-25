
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
    for (let n = 0; n < words.length; n++) {
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
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'safety-tip.png', { type: 'image/png' });

      // Check if file sharing is supported
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Pocket Helper Tip',
          text: `💡 Safety Tip of the Day: ${tip.text[lang]}`,
        });
      } else if (navigator.share) {
        // Fallback to text-only sharing if files aren't supported
        await navigator.share({
          title: 'Pocket Helper Tip',
          text: `💡 Safety Tip: ${tip.text[lang]}\n\nShared via Pocket Emergency Helper #StaySafe`,
        });
      } else {
        // Ultimate fallback: Copy to clipboard
        await navigator.clipboard.writeText(`💡 Safety Tip: ${tip.text[lang]} (via Pocket Helper)`);
        alert("Sharing not supported. Tip text copied to clipboard!");
      }
    } catch (err) {
      console.error("Share failed", err);
      // Attempt to at least copy text
      try {
        await navigator.clipboard.writeText(`💡 Safety Tip: ${tip.text[lang]}`);
        alert("Tip copied to clipboard!");
      } catch (clipErr) {
        alert("Could not share or copy tip.");
      }
    }
  };

  const activeTip = filteredTips[currentIdx];

  const cycleShareTheme = () => {
    if (!stats.isPremium) {
      alert("Upgrade to Premium to unlock Custom Design Cards!");
      return;
    }
    const themes: ('red' | 'dark' | 'gold' | 'cyber')[] = ['red', 'dark', 'gold', 'cyber'];
    const idx = themes.indexOf(shareTheme);
    setShareTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <div className="p-4 flex flex-col min-h-screen pb-24 animate-in fade-in duration-500">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter">{getTranslation('tips', lang)}</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Daily Safety Wisom</p>
        </div>
        <div className="w-10 h-10 bg-red-600/10 text-red-600 rounded-xl flex items-center justify-center">
          <Sparkles size={20} />
        </div>
      </header>

      <div className="relative mb-6">
        <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
        <input
          type="text"
          placeholder={getTranslation('searchPlaceholder', lang)}
          className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-red-600 font-bold transition-all shadow-sm`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-grow flex flex-col justify-center items-center gap-8">
        {filteredTips.length > 0 ? (
          <>
            <div className={`relative w-full aspect-square max-w-sm rounded-[3.5rem] p-10 flex flex-col justify-center text-center shadow-2xl transition-all duration-500 group overflow-hidden ${shareTheme === 'red' ? 'bg-red-600 text-white' :
                shareTheme === 'dark' ? 'bg-slate-900 text-white border-4 border-slate-800' :
                  shareTheme === 'gold' ? 'bg-[#d4af37] text-black border-4 border-yellow-200 shadow-yellow-200' :
                    'bg-black text-[#0ff] border-2 border-[#f0f] shadow-[0_0_30px_#f0f]'
              }`}>
              <p className="text-2xl font-black leading-tight tracking-tight relative z-10">"{activeTip.text[lang]}"</p>
              <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 italic">{getTranslation('appName', lang)}</span>
              </div>
              <canvas ref={canvasRef} width="400" height="400" className="hidden"></canvas>
              {/* Decorative Circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform" />
            </div>

            <div className="flex items-center gap-4 w-full max-w-sm">
              <button onClick={() => setCurrentIdx(prev => (prev - 1 + filteredTips.length) % filteredTips.length)} className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 flex items-center justify-center active:scale-90 transition-all shadow-sm text-slate-400 hover:text-red-600">
                <ChevronLeft size={28} className={isRtl ? 'rotate-180' : ''} />
              </button>
              <button onClick={() => handleRead(activeTip.id)} className="flex-grow h-16 rounded-[1.5rem] bg-slate-900 dark:bg-red-600 text-white font-black uppercase tracking-widest text-xs shadow-xl active:scale-[0.98] transition-all">
                {getTranslation('gotIt', lang)}
              </button>
              <button onClick={() => setCurrentIdx(prev => (prev + 1) % filteredTips.length)} className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-slate-800 flex items-center justify-center active:scale-90 transition-all shadow-sm text-slate-400 hover:text-red-600">
                <ChevronRight size={28} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </div>

            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={cycleShareTheme}
                className={`flex-grow h-16 rounded-[1.5rem] border-2 flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-sm ${stats.isPremium ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
              >
                {stats.isPremium ? <Palette size={20} className="text-red-600" /> : <Lock size={16} />} {getTranslation('customCard', lang)}
              </button>
              <button
                onClick={shareTipAsImage}
                className="w-16 h-16 rounded-[1.5rem] bg-red-600 text-white flex items-center justify-center shadow-xl active:scale-95 hover:rotate-6 transition-all"
              >
                <Share2 size={24} />
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

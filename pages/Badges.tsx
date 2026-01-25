
import React from 'react';
import { BADGES } from '../data';
import { UserStats } from '../types';
import { getTranslation } from '../translations';
import { Award, CheckCircle } from 'lucide-react';

interface BadgesProps {
  stats: UserStats;
  updateStats: (update: Partial<UserStats>) => void;
}

const Badges: React.FC<BadgesProps> = ({ stats }) => {
  const lang = stats.language;
  const isUnlocked = (badgeId: string) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return false;
    switch (badge.type) {
      case 'guides': return stats.guidesCompleted.length >= badge.requirement;
      case 'tips': return stats.tipsRead.length >= badge.requirement;
      case 'tools': return stats.toolsUsed >= badge.requirement;
      default: return false;
    }
  };

  return (
    <div className="p-4">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Award className="text-yellow-500" />
          {getTranslation('trophy', lang)}
        </h1>
      </header>
      <div className="grid grid-cols-2 gap-4">
        {BADGES.map(badge => {
          const unlocked = isUnlocked(badge.id);
          return (
            <div key={badge.id} className={`p-6 rounded-2xl border flex flex-col items-center text-center ${unlocked ? 'bg-white border-green-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
              <div className="text-5xl mb-4">{unlocked ? badge.icon : '🔒'}</div>
              <h3 className="font-bold text-sm mb-1">{badge.name[lang]}</h3>
              <p className="text-[10px] text-slate-500 leading-tight">{badge.description[lang]}</p>
              {unlocked && <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase"><CheckCircle size={10} /> {getTranslation('unlocked', lang)}</div>}
            </div>
          );
        })}
      </div>
      <div className="mt-8 bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
        <h2 className="text-lg font-bold mb-2">{getTranslation('totalScore', lang)}</h2>
        <div className="text-4xl font-black text-red-500 mb-2">{stats.points}</div>
      </div>
    </div>
  );
};

export default Badges;

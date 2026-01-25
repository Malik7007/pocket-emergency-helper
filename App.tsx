
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Guides from './pages/Guides';
import Tools from './pages/Tools';
import Tips from './pages/Tips';
import Badges from './pages/Badges';
import ChecklistsPage from './pages/Checklists';
import MapsPage from './pages/Maps';
import Guidelines from './pages/Guidelines';
import Navigation from './components/Navigation';
import { UserStats, Language, Guide, Tip, AppTheme } from './types';
import { INITIAL_GUIDES, INITIAL_TIPS } from './data';
import { getTranslation } from './translations';

const STORAGE_KEY = 'pocket_helper_stats_v9_production';

const App: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialStats: UserStats = {
      points: 0,
      tipsRead: [],
      guidesCompleted: [],
      toolsUsed: 0,
      badgesEarned: [],
      language: 'en',
      theme: 'auto',
      checklists: [],
      currentStreak: 0,
      isPremium: false,
      customGuides: INITIAL_GUIDES,
      customTips: INITIAL_TIPS
    };

    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      const lastUsed = parsed.lastUsedDate;

      // Streak Logic
      if (lastUsed) {
        const last = new Date(lastUsed);
        const diff = (new Date(today).getTime() - last.getTime()) / (1000 * 3600 * 24);
        if (diff === 1) {
          parsed.currentStreak += 1;
        } else if (diff > 1) {
          parsed.currentStreak = 1;
        }
      } else {
        parsed.currentStreak = 1;
      }
      parsed.lastUsedDate = today;
      return parsed;
    }
    initialStats.lastUsedDate = new Date().toDateString();
    initialStats.currentStreak = 1;
    return initialStats;
  });

  const checkForUpdates = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const updateGuide: Guide = {
        id: 'safety-update-v1',
        version: 2,
        title: { en: 'Home Fire Safety', ar: 'سلامة الحرائق المنزلية', ur: 'گھر میں آگ سے بچاؤ', hi: 'বাড়ির আগুন সুরক্ষা', bn: 'বাড়ির আগুন সুরক্ষা' },
        category: 'environment',
        isNew: true,
        content: [
          { en: '1. Keep fire extinguishers in the kitchen.', ar: '1. احتفظ بطفايات الحريق في المطبخ.', ur: '1. کچن میں آگ بجھانے والا آلہ رکھیں۔', hi: '১. রান্নাঘরে অগ্নিনির্বাপক যন্ত্র রাখুন।', bn: '১. রান্নাঘরে অগ্নিনির্বাপক যন্ত্র রাখুন।' }
        ]
      };
      setStats(prev => {
        const exists = prev.customGuides?.some(g => g.id === updateGuide.id);
        return { 
          ...prev, 
          customGuides: exists ? prev.customGuides : [updateGuide, ...(prev.customGuides || [])],
          lastSyncTimestamp: Date.now()
        };
      });
      alert(getTranslation('syncSuccess', stats.language));
    } catch (e) {
      console.error(e);
    } finally { setIsSyncing(false); }
  };

  useEffect(() => {
    const applyTheme = (theme: AppTheme) => {
      const root = document.documentElement;
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
      let effectiveTheme = theme;
      if (theme === 'auto') {
        effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (['pink', 'gold', 'cyber'].includes(theme)) {
        root.setAttribute('data-theme', theme);
      } else if (effectiveTheme === 'dark') {
        root.classList.add('dark');
      }
    };
    applyTheme(stats.theme);
  }, [stats.theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    document.documentElement.dir = (stats.language === 'ar' || stats.language === 'ur') ? 'rtl' : 'ltr';
  }, [stats]);

  const updateStats = (update: Partial<UserStats>) => setStats(prev => ({ ...prev, ...update }));
  const addPoints = (amount: number) => setStats(prev => ({ ...prev, points: prev.points + amount }));

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#121212] dark:text-white transition-colors duration-300">
        <main className="flex-grow pb-20 overflow-x-hidden max-w-md mx-auto w-full bg-white dark:bg-[#121212] shadow-xl min-h-screen">
          <Routes>
            <Route path="/" element={<Home stats={stats} updateStats={updateStats} setLanguage={(lang) => updateStats({ language: lang })} isSyncing={isSyncing} onSync={checkForUpdates} />} />
            <Route path="/guides" element={<Guides stats={stats} updateStats={updateStats} addPoints={addPoints} />} />
            <Route path="/tools" element={<Tools stats={stats} updateStats={updateStats} addPoints={addPoints} />} />
            <Route path="/tips" element={<Tips stats={stats} updateStats={updateStats} addPoints={addPoints} />} />
            <Route path="/badges" element={<Badges stats={stats} updateStats={updateStats} />} />
            <Route path="/checklists" element={<ChecklistsPage stats={stats} updateStats={updateStats} addPoints={addPoints} />} />
            <Route path="/maps" element={<MapsPage language={stats.language} />} />
            <Route path="/guidelines" element={<Guidelines language={stats.language} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Navigation language={stats.language} />
      </div>
    </HashRouter>
  );
};

export default App;

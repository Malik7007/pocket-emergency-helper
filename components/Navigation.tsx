
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Wrench, Trophy, Map as MapIcon } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface NavigationProps {
  language: Language;
}

const Navigation: React.FC<NavigationProps> = ({ language }) => {
  const navItems = [
    { to: '/', icon: Home, labelKey: 'home' },
    { to: '/guides', icon: BookOpen, labelKey: 'guides' },
    { to: '/tools', icon: Wrench, labelKey: 'tools' },
    { to: '/maps', icon: MapIcon, labelKey: 'maps' },
    { to: '/badges', icon: Trophy, labelKey: 'trophy' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1e1e1e] border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 safe-bottom z-50 max-w-md mx-auto w-full">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full transition-colors ${
              isActive ? 'text-red-600' : 'text-slate-400 dark:text-slate-600'
            }`
          }
        >
          <item.icon size={20} />
          <span className="text-[10px] mt-1 font-black uppercase tracking-widest">
            {getTranslation(item.labelKey, language)}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;

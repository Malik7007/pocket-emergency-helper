
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Wrench, Info, Zap, Phone, Search, Sliders, Bell, Share2 } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface GuidelinesProps {
  language: Language;
}

const Guidelines: React.FC<GuidelinesProps> = ({ language }) => {
  const navigate = useNavigate();
  const isRtl = language === 'ar' || language === 'ur';

  const sections = [
    {
      title: getTranslation('safetyRules', language),
      icon: <Shield className="text-red-600" size={24} />,
      items: [
        {
          label: 'Immediate Response',
          text: 'In any life-threatening situation, prioritize calling 911 (KSA) or 112 (Global) before opening the app tools.'
        },
        {
          label: 'KSA Desert Safety',
          text: 'Always carry at least 10L of water. If stranded, stay with your vehicle; it is easier for helicopters to spot than a person.'
        },
        {
          label: 'Heatstroke Prevention',
          text: 'Seek shade if you feel dizzy. Pour water over your head and pulse points (wrists, neck) to lower body temperature rapidly.'
        },
        {
          label: 'First Aid Priority',
          text: 'Stop bleeding first by applying firm pressure. Do not move injured persons unless they are in immediate danger from fire or collapse.'
        }
      ]
    },
    {
      title: getTranslation('manualTitle', language),
      icon: <Wrench className="text-blue-600" size={24} />,
      items: [
        {
          label: 'SOS SMS Configuration',
          text: 'Go to Tools > SOS Center. Enter your emergency contact number and SAVE. In an emergency, tapping "SEND SOS SMS" will send your current GPS coordinates automatically.'
        },
        {
          label: 'Digital Magnifier',
          text: 'Use the zoom slider at the bottom of the Magnifier tool to adjust magnification up to 8x. High zoom requires a steady hand for clear text reading.'
        },
        {
          label: 'Flashlight Modes',
          text: 'Manual (Switch), Strobe (Fast Pulse), and Morse SOS (International SOS pattern). Strobe is effective for signaling rescuers in low visibility.'
        },
        {
          label: 'Safety Checklists',
          text: 'Use templates for quick setup or create your own. Checking off items helps ensure you don\'t forget critical supplies during panic.'
        },
        {
          label: 'Premium Features',
          text: 'Upgrade to unlock advanced guides and high-contrast "Elite" themes. Premium members also get access to custom shareable tip cards.'
        }
      ]
    }
  ];

  return (
    <div className="p-4 pb-24 bg-slate-50 dark:bg-[#121212] min-h-screen">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm active:scale-90 transition-transform">
          <ArrowLeft size={20} className={isRtl ? 'rotate-180' : ''} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter">{getTranslation('guidelinesManual', language)}</h1>
      </header>

      <div className="space-y-10">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm">
                {section.icon}
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.items.map((item, iIdx) => (
                <div key={iIdx} className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
                  <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {item.label}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-12 text-center p-8 bg-slate-100 dark:bg-white/5 rounded-[3rem]">
        <Info size={32} className="mx-auto text-slate-300 mb-4" />
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-[200px] mx-auto">
          This app is a support tool and does not replace professional emergency services.
        </p>
      </footer>
    </div>
  );
};

export default Guidelines;

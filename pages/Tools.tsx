
import React, { useState, useEffect, useRef } from 'react';
import { UserStats } from '../types';
import { getTranslation } from '../translations';
import { 
  Flashlight as TorchIcon, Bell, Calculator, RefreshCw, X, Compass as CompassIcon, 
  MessageSquare, MapPin, Send, Camera, Megaphone, Search as SearchIcon, 
  Maximize, Lock, Crown, Hash as HashIcon, Heart, Sliders, Signal as SignalIcon, Home, 
  Volume2, Globe, Phone, ChevronRight, Zap, Play, Square, AlertCircle, Eye
} from 'lucide-react';

interface ToolsProps {
  stats: UserStats;
  updateStats: (update: Partial<UserStats>) => void;
  addPoints: (amount: number) => void;
}

const CURRENCY_RATES: Record<string, number> = {
  'USD': 3.75, 'EUR': 4.05, 'GBP': 4.75, 'INR': 0.045, 'PKR': 0.013, 'EGP': 0.076, 'SAR': 1.0,
};

const Tools: React.FC<ToolsProps> = ({ stats, updateStats, addPoints }) => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [flashlightMode, setFlashlightMode] = useState<'solid' | 'strobe' | 'sos'>('solid');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);
  
  const [convVal, setConvVal] = useState<string>('');
  const [convType, setConvType] = useState<'temp' | 'weight' | 'dist' | 'currency'>('temp');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [sosContact, setSosContact] = useState(stats.emergencyContact || '');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [billAmount, setBillAmount] = useState<string>('');
  const [peopleCount, setPeopleCount] = useState<string>('1');
  const [tipPercent, setTipPercent] = useState<string>('10');

  const [hajjCount, setHajjCount] = useState(0);
  const [whistleOn, setWhistleOn] = useState(false);

  const [rotation, setRotation] = useState(0);
  const [levelPos, setLevelPos] = useState({ x: 0, y: 0 });

  const strobeInterval = useRef<any>(null);
  const whistleInterval = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const lang = stats.language;
  const isRtl = lang === 'ar' || lang === 'ur';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      }, null, { timeout: 5000, enableHighAccuracy: true });
    }
    return () => {
      if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
      if (strobeInterval.current) {
        clearInterval(strobeInterval.current);
        clearTimeout(strobeInterval.current);
      }
    };
  }, [cameraStream]);

  // Orientation Sensors for Compass and Level
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) setRotation(e.alpha);
      if (e.beta !== null && e.gamma !== null) {
        setLevelPos({ x: e.gamma / 45, y: e.beta / 45 });
      }
    };

    if (activeTool === 'compass' || activeTool === 'level') {
      const DOE = (window as any).DeviceOrientationEvent;
      if (typeof DOE?.requestPermission === 'function') {
        DOE.requestPermission().then((state: string) => {
          if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation);
        }).catch((e: any) => console.error("Permission denied", e));
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [activeTool]);

  // Flashlight Pattern Logic
  useEffect(() => {
    if (activeTool === 'flashlight' && strobeActive) {
      if (flashlightMode === 'strobe') {
        strobeInterval.current = setInterval(() => {
          setFlashlightOn(prev => !prev);
        }, 100);
      } else if (flashlightMode === 'sos') {
        const pattern = [200, 200, 200, 200, 200, 600, 600, 200, 600, 200, 600, 600, 200, 200, 200, 200, 200, 1000];
        let pIdx = 0;
        const playSos = () => {
          if (!strobeActive || activeTool !== 'flashlight') return;
          setFlashlightOn(true);
          strobeInterval.current = setTimeout(() => {
            setFlashlightOn(false);
            pIdx = (pIdx + 1) % pattern.length;
            strobeInterval.current = setTimeout(playSos, pattern[pIdx]);
          }, pattern[pIdx]);
        };
        playSos();
      }
    } else {
      if (strobeInterval.current) {
        clearInterval(strobeInterval.current);
        clearTimeout(strobeInterval.current);
      }
      if (!strobeActive) setFlashlightOn(false);
    }
    return () => {
      if (strobeInterval.current) {
        clearInterval(strobeInterval.current);
        clearTimeout(strobeInterval.current);
      }
    };
  }, [strobeActive, flashlightMode, activeTool]);

  const toggleWhistle = async () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    
    if (whistleOn) {
      setWhistleOn(false);
      if (whistleInterval.current) {
        whistleInterval.current.stop();
        whistleInterval.current.disconnect();
        whistleInterval.current = null;
      }
    } else {
      setWhistleOn(true);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2800, ctx.currentTime);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      whistleInterval.current = osc;
    }
  };

  const handleToolUse = (tool: string, isPremiumOnly: boolean = false) => {
    if (isPremiumOnly && !stats.isPremium) {
      alert("This is a Premium Tool. Please upgrade for enhanced utility.");
      return;
    }
    setActiveTool(tool);
    updateStats({ toolsUsed: stats.toolsUsed + 1 });
    addPoints(10);

    if (tool === 'magnifier') {
      setZoomLevel(2.5);
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        }).catch(() => alert("Camera required for Magnifier"));
    } else if (tool === 'mirror') {
      setZoomLevel(1);
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          setCameraStream(stream);
          if (videoRef.current) videoRef.current.srcObject = stream;
        }).catch(() => alert("Camera required for Mirror"));
    }
  };

  const closeTool = () => {
    if (whistleOn) toggleWhistle();
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setStrobeActive(false);
    setFlashlightOn(false);
    setActiveTool(null);
  };

  const calculateConv = () => {
    const num = parseFloat(convVal);
    if (isNaN(num)) return '-';
    if (convType === 'temp') return ((num * 9/5) + 32).toFixed(1) + ' °F';
    if (convType === 'weight') return (num * 2.20462).toFixed(2) + ' lbs';
    if (convType === 'dist') return (num * 0.621371).toFixed(2) + ' mi';
    if (convType === 'currency') return (num / CURRENCY_RATES[targetCurrency]).toFixed(2) + ' ' + targetCurrency;
    return '-';
  };

  const triggerSOSVibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200, 300, 600, 100, 600, 100, 600, 300, 200, 100, 200, 100, 200]);
    } else {
      alert("Device SOS vibration triggered.");
    }
  };

  const handleBroadcastSos = () => {
    if (!stats.emergencyContact) {
      alert("Set contact in SOS Center first");
      return;
    }
    const message = `SOS! My GPS: https://www.google.com/maps?q=${coords?.lat || 0},${coords?.lng || 0}`;
    window.location.href = `sms:${stats.emergencyContact}?body=${encodeURIComponent(message)}`;
  };

  const calculateSplit = () => {
    const total = parseFloat(billAmount) || 0;
    const count = parseInt(peopleCount) || 1;
    const tip = parseFloat(tipPercent) || 0;
    return ((total + (total * (tip/100))) / count).toFixed(2);
  };

  return (
    <div className="p-4 pb-24 space-y-6">
      <header>
        <h1 className="text-2xl font-black tracking-tighter uppercase">{getTranslation('quickTools', lang)}</h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Reliable utilities available offline</p>
      </header>
      
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleToolUse('hajj-counter')} className="col-span-2 bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border-2 border-green-50 dark:border-green-900/10 flex items-center gap-6 shadow-sm active:scale-95 transition-all">
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-3xl flex items-center justify-center shadow-inner"><HashIcon size={32} /></div>
          <div className="text-left">
            <span className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-widest block mb-1">Ritual Counter</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-80">Manual tally tracking</span>
          </div>
        </button>

        {[
          { id: 'flashlight', icon: TorchIcon, color: 'yellow' },
          { id: 'compass', icon: CompassIcon, color: 'blue' },
          { id: 'sos', icon: Bell, color: 'red' },
          { id: 'whistle', icon: Volume2, color: 'purple' },
          { id: 'magnifier', icon: SearchIcon, color: 'indigo', premium: true },
          { id: 'level', icon: Maximize, color: 'emerald' },
          { id: 'mirror', icon: Eye, color: 'rose' },
          { id: 'signalMeter', icon: SignalIcon, color: 'sky' }
        ].map((tool) => (
          <button 
            key={tool.id} 
            onClick={() => handleToolUse(tool.id, tool.premium)} 
            className="bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4 text-center shadow-sm active:scale-95 transition-all relative group"
            aria-label={`Open ${getTranslation(tool.id, lang)}`}
          >
            <div className={`w-14 h-14 bg-${tool.color}-50 dark:bg-${tool.color}-900/20 text-${tool.color}-500 rounded-2xl flex items-center justify-center shadow-inner transition-colors group-hover:bg-${tool.color}-500 group-hover:text-white`}>
              <tool.icon size={28} />
            </div>
            <span className="font-black text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-widest">{getTranslation(tool.id, lang)}</span>
            {tool.premium && !stats.isPremium && <Lock size={12} className="absolute top-4 right-4 text-slate-400" />}
          </button>
        ))}

        <button onClick={() => handleToolUse('convert')} className="col-span-2 bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm active:scale-95 transition-all">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner"><Globe size={32} /></div>
          <div className="text-left">
            <span className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-widest mb-1 block">Converter</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-80">Units & currency rates</span>
          </div>
        </button>

        <button onClick={() => handleToolUse('calc')} className="col-span-2 bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-sm active:scale-95 transition-all">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-3xl flex items-center justify-center shadow-inner"><Calculator size={32} /></div>
          <div className="text-left">
            <span className="font-black text-slate-800 dark:text-slate-200 text-sm uppercase tracking-widest mb-1 block">Bill Splitter</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-80">Calculate tips and splits</span>
          </div>
        </button>
      </div>

      {/* MODALS */}
      {activeTool === 'flashlight' && (
        <div className={`fixed inset-0 z-[200] flex flex-col transition-colors duration-100 ${flashlightOn ? 'bg-white' : 'bg-black'}`}>
          {!flashlightOn && (
            <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
               <h2 className="text-white font-black uppercase text-xl">Screen Flashlight</h2>
               <button onClick={closeTool} className="p-3 bg-white/20 backdrop-blur-lg rounded-full text-white"><X size={32}/></button>
            </div>
          )}
          <div className="flex-grow flex flex-col items-center justify-center gap-8 p-12">
            {!flashlightOn && (
              <div className="bg-white/10 p-8 rounded-[3rem] backdrop-blur-md w-full max-w-sm space-y-6">
                 <div className="flex justify-around">
                   {(['solid', 'strobe', 'sos'] as const).map(m => (
                     <button key={m} onClick={() => setFlashlightMode(m)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${flashlightMode === m ? 'bg-white text-black' : 'text-white/40'}`}>
                       {m}
                     </button>
                   ))}
                 </div>
                 <button 
                  onClick={() => { if (flashlightMode === 'solid') setFlashlightOn(true); else setStrobeActive(prev => !prev); }}
                  className={`w-full py-6 rounded-2xl font-black text-lg uppercase tracking-widest shadow-2xl transition-all ${strobeActive ? 'bg-red-600 text-white' : 'bg-white text-black'}`}
                >
                  {strobeActive ? 'Stop Signal' : 'Start Light'}
                </button>
              </div>
            )}
            {flashlightOn && flashlightMode === 'solid' && (
              <button onClick={() => setFlashlightOn(false)} className="fixed inset-0 w-full h-full opacity-0 z-[210]">Close</button>
            )}
          </div>
        </div>
      )}

      {activeTool === 'whistle' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400">
          <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">High Whistle</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="flex-grow flex flex-col items-center justify-center gap-12 text-center">
             <button onClick={toggleWhistle} className={`w-52 h-52 rounded-full shadow-2xl transition-all flex items-center justify-center ${whistleOn ? 'bg-red-600 text-white animate-pulse' : 'bg-white dark:bg-[#1e1e1e] text-slate-400 border-4 border-slate-200'}`}>
               <Megaphone size={80} />
             </button>
             <div>
               <span className="text-xl font-black uppercase tracking-tighter block mb-2">{whistleOn ? 'WHISTLE ACTIVE' : 'WHISTLE IDLE'}</span>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Produces a piercing 2.8kHz distress signal</p>
             </div>
          </div>
        </div>
      )}

      {activeTool === 'mirror' && (
        <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
             <h2 className="text-white font-black uppercase text-xl">Self Mirror</h2>
             <button onClick={closeTool} className="p-3 bg-white/20 backdrop-blur-lg rounded-full text-white"><X size={32}/></button>
          </div>
          <div className="flex-grow relative overflow-hidden">
             <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
          </div>
          <div className="p-10 bg-black/50 backdrop-blur-xl shrink-0 text-center">
             <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Front camera for inspection or signaling</p>
          </div>
        </div>
      )}

      {activeTool === 'signalMeter' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400">
          <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Signal Meter</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center gap-8">
            <div className="flex items-end gap-2 h-40 w-60 justify-center">
              {[1, 2, 3, 4, 5].map(bar => (
                <div key={bar} className={`w-8 rounded-t-lg transition-all ${bar <= 4 ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800'}`} style={{ height: `${bar * 20}%` }} />
              ))}
            </div>
            <div className="text-center space-y-2">
               <span className="text-4xl font-black">GOOD</span>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Estimated Network Strength</p>
            </div>
            <div className="w-full bg-white dark:bg-[#1e1e1e] p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
               <div className="flex justify-between items-center text-xs font-bold uppercase">
                 <span className="text-slate-400">Connection</span>
                 <span>{navigator.onLine ? 'Connected' : 'Offline'}</span>
               </div>
               <div className="flex justify-between items-center text-xs font-bold uppercase">
                 <span className="text-slate-400">Type</span>
                 <span>{(navigator as any).connection?.effectiveType?.toUpperCase() || 'UNKNOWN'}</span>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'calc' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Bill Splitter</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
             <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400">Total Amount</label>
                <input type="number" className="w-full p-5 bg-slate-50 dark:bg-[#121212] rounded-2xl font-black text-2xl outline-none" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} placeholder="0.00" />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400">People</label>
                 <input type="number" className="w-full p-4 bg-slate-50 dark:bg-[#121212] rounded-xl font-bold" value={peopleCount} onChange={(e) => setPeopleCount(e.target.value)} />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-400">Tip %</label>
                 <input type="number" className="w-full p-4 bg-slate-50 dark:bg-[#121212] rounded-xl font-bold" value={tipPercent} onChange={(e) => setTipPercent(e.target.value)} />
               </div>
             </div>
             <div className="p-6 bg-slate-900 text-white rounded-3xl text-center">
                <span className="text-[10px] font-black uppercase opacity-60 block mb-1">Per Person</span>
                <span className="text-4xl font-black tracking-tighter">{calculateSplit()} SAR</span>
             </div>
          </div>
        </div>
      )}

      {activeTool === 'convert' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400 overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Converter</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
             <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {(['temp', 'weight', 'dist', 'currency'] as const).map(t => (
                  <button key={t} onClick={() => setConvType(t)} className={`flex-shrink-0 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${convType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {t}
                  </button>
                ))}
             </div>
             {convType === 'currency' && (
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                 {Object.keys(CURRENCY_RATES).filter(c => c !== 'SAR').map(c => (
                   <button key={c} onClick={() => setTargetCurrency(c)} className={`flex-shrink-0 px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all ${targetCurrency === c ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                     {c}
                   </button>
                 ))}
               </div>
             )}
             <input type="number" className="w-full p-5 bg-slate-50 dark:bg-[#121212] rounded-2xl font-black text-2xl outline-none" value={convVal} onChange={(e) => setConvVal(e.target.value)} placeholder="0.00" />
             <div className="p-6 bg-slate-100 dark:bg-slate-900 rounded-3xl text-center">
                <span className="text-3xl font-black">{calculateConv()}</span>
             </div>
          </div>
        </div>
      )}

      {activeTool === 'sos' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400">
           <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">SOS Center</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="flex-grow space-y-8">
            <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Emergency Phone</label>
               <input type="tel" className="w-full p-5 bg-slate-50 dark:bg-[#121212] border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black text-xl outline-none" placeholder="+966..." value={sosContact} onChange={(e) => setSosContact(e.target.value)} />
               <button onClick={() => { updateStats({ emergencyContact: sosContact }); alert("Saved!"); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Update Settings</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <button onClick={triggerSOSVibrate} className="p-8 bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-slate-200 flex flex-col items-center gap-4 text-center">
                  <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Bell size={32} /></div>
                  <span className="text-[10px] font-black uppercase">Vibrate Alert</span>
               </button>
               <button onClick={() => { window.location.href = "tel:911"; }} className="p-8 bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-slate-200 flex flex-col items-center gap-4 text-center">
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl"><Phone size={32} /></div>
                  <span className="text-[10px] font-black uppercase">Call 911</span>
               </button>
            </div>

            <button onClick={handleBroadcastSos} className="w-full py-8 bg-red-600 text-white rounded-[3rem] font-black text-xl uppercase tracking-tighter shadow-2xl flex items-center justify-center gap-3">
               <Send size={24} /> Broadcast SOS
            </button>
          </div>
        </div>
      )}

      {activeTool === 'hajj-counter' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400">
          <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Ritual Counter</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center gap-10">
            <div className="relative w-72 h-72">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-green-600 transition-all duration-500" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(hajjCount / 7) * 282.7} 282.7`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-8xl font-black text-slate-900 dark:text-white">{hajjCount}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">/ 7 Tally</span>
              </div>
            </div>
            <button onClick={() => setHajjCount(prev => Math.min(prev + 1, 7))} className="w-full max-w-sm py-10 bg-green-600 text-white rounded-[3rem] font-black text-2xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
              {hajjCount >= 7 ? 'COMPLETED' : '+ 1 CIRCUIT'}
            </button>
            <button onClick={() => setHajjCount(0)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500">Reset Counter</button>
          </div>
        </div>
      )}

      {activeTool === 'magnifier' && (
        <div className="fixed inset-0 z-[120] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
             <h2 className="text-white font-black uppercase text-xl">Magnifier</h2>
             <button onClick={closeTool} className="p-3 bg-white/20 backdrop-blur-lg rounded-full text-white"><X size={32}/></button>
          </div>
          <div className="flex-grow relative overflow-hidden">
             <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" style={{ transform: `scale(${zoomLevel})` }} />
          </div>
          <div className="p-10 bg-black/50 backdrop-blur-xl shrink-0 space-y-6">
             <div className="flex items-center gap-4">
                <SearchIcon size={20} className="text-white" />
                <input type="range" min="1" max="10" step="0.1" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} className="w-full accent-red-600" />
             </div>
             <p className="text-center text-[10px] text-white/50 font-black uppercase tracking-widest">Slide to zoom camera view</p>
          </div>
        </div>
      )}

      {activeTool === 'compass' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400">
           <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Digital Compass</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center">
             <div className="relative w-64 h-64 border-8 border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center transition-transform duration-100" style={{ transform: `rotate(${-rotation}deg)` }}>
                <div className="absolute top-2 font-black text-red-600 text-lg">N</div>
                <div className="absolute bottom-2 font-black text-slate-400 text-lg">S</div>
                <div className="absolute left-2 font-black text-slate-400 text-lg">W</div>
                <div className="absolute right-2 font-black text-slate-400 text-lg">E</div>
                <CompassIcon size={120} className="text-slate-800 dark:text-white" />
             </div>
             <div className="mt-12 text-center space-y-2">
               <span className="text-2xl font-black">{Math.round(rotation)}°</span>
               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-[200px] mx-auto">
                 Real-time orientation sensor active. Keep device flat for accuracy.
               </p>
             </div>
          </div>
        </div>
      )}

      {activeTool === 'level' && (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-[#121212] flex flex-col p-8 animate-in slide-in-from-bottom duration-400">
           <div className="flex justify-between items-center mb-10 shrink-0">
            <h2 className="text-2xl font-black tracking-tighter uppercase">Bubble Level</h2>
            <button onClick={closeTool} className="p-3 bg-white dark:bg-[#1e1e1e] rounded-full shadow-sm text-slate-400"><X size={32}/></button>
          </div>
          <div className="flex-grow flex flex-col justify-center items-center gap-12">
             <div className="w-full h-16 bg-white dark:bg-[#1e1e1e] border-2 border-slate-200 dark:border-slate-800 rounded-full relative overflow-hidden flex items-center">
                <div 
                  className="w-10 h-10 bg-green-500 rounded-full transition-all duration-75 shadow-inner" 
                  style={{ transform: `translateX(${levelPos.x * 120}px)` }} 
                />
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <div className="h-full w-0.5 bg-red-500/50" />
                </div>
             </div>
             <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest max-w-[200px]">
               Tilt your phone horizontally to check surface alignment.
             </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tools;

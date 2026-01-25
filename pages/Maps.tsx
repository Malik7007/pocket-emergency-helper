
import React, { useState, useEffect } from 'react';
import { Language, MapPoint } from '../types';
import { getTranslation } from '../translations';
import { MapPin, Info, ArrowLeft, Search, Navigation2, Cross, Shield, Building2, Landmark, Filter, CheckCircle2, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const POI_TEMPLATES = [
  { id: 'all', label: 'All Points', icon: Landmark },
  { id: 'hospital', label: 'Hospitals', icon: Cross },
  { id: 'police', label: 'Police Stations', icon: Shield },
  { id: 'shelter', label: 'Emergency Shelters', icon: Building2 },
];

const POINTS_OF_INTEREST = [
  { id: '1', name: { en: 'Central Hospital', ar: 'المستشفى المركزي', ur: 'مرکزی ہسپتال', hi: 'केंद्रीय अस्पताल', bn: 'কেন্দ্রীয় হাসপাতাল' }, type: 'hospital', lat: 21.4225, lng: 39.8262 },
  { id: '2', name: { en: 'Police Station', ar: 'مركز الشرطة', ur: 'پولیس اسٹیشن', hi: 'पुलिस स्टेशन', bn: 'পুলিশ স্টেশন' }, type: 'police', lat: 21.4245, lng: 39.8282 },
  { id: '3', name: { en: 'Emergency Shelter', ar: 'ملجأ الطوارئ', ur: 'ہنگامی پناہ گاہ', hi: 'आपातकालीन आश्रय', bn: 'জরুরি আশ্রয়' }, type: 'shelter', lat: 21.4205, lng: 39.8242 },
];

// Helper to center map on user
const RecenterAutomatically = ({ lat, lng }: { lat: number, lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const MapsPage: React.FC<{ language: Language }> = ({ language }) => {
  const navigate = useNavigate();
  const isRtl = language === 'ar' || language === 'ur';
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

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
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeFilter === tmpl.id
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

      <div className="bg-white dark:bg-[#1e1e1e] rounded-[3rem] border-4 border-white dark:border-slate-800 overflow-hidden shadow-2xl mb-6 relative h-[400px] z-10">
        <MapContainer center={userLocation || [21.4225, 39.8262]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>You are here</Popup>
              </Marker>
              <RecenterAutomatically lat={userLocation[0]} lng={userLocation[1]} />
            </>
          )}
          {filteredPoints.map(poi => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]}>
              <Popup>
                <div className="font-black uppercase text-xs">{poi.name[language]}</div>
                <div className="text-[10px] opacity-70 uppercase tracking-widest">{poi.type}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <button
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
              });
            }
          }}
          className="absolute bottom-24 right-6 z-[1000] p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl text-red-600 active:scale-90 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Locate size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-4 z-[1000]">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 p-3 rounded-2xl"><Navigation2 size={24} /></div>
          <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            {userLocation ? 'GPS Signal Active. Showing nearby live hubs.' : 'Offline reference mode. Enable GPS for live mapping.'}
          </p>
        </div>
      </div>

      <div className="space-y-4 pb-10">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nearby Emergency Hubs</h2>
        {filteredPoints.map(poi => (
          <div key={poi.id} className="bg-white dark:bg-[#1e1e1e] p-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between active:scale-95 transition-all shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${poi.type === 'hospital' ? 'bg-red-50 dark:bg-red-900/10 text-red-500' :
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

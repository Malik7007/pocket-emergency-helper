
import React, { useState, useEffect, useMemo } from 'react';
import { Language, MapPoint } from '../types';
import { getTranslation } from '../translations';
import { MapPin, Info, ArrowLeft, Search, Navigation2, Cross, Shield, Building2, Landmark, Filter, CheckCircle2, Locate } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';

const POI_TEMPLATES = [
  { id: 'all', label: 'All Points', icon: Landmark },
  { id: 'hospital', label: 'Hospitals', icon: Cross },
  { id: 'police', label: 'Police Stations', icon: Shield },
  { id: 'shelter', label: 'Emergency Shelters', icon: Building2 },
];

const POINTS_OF_INTEREST = [
  { id: '1', name: { en: 'Central Hospital', ar: 'المستشفى المركزي', ur: 'مرکزی ہسپتال', hi: 'केंद्रीय अस्पताल', bn: 'কেন্দ্রীয় হাসপাতাল' }, type: 'hospital', lat: 21.4225, lng: 39.8262 },
  { id: '2', name: { en: 'Police Station', ar: 'مركز الشرطة', ur: 'پولیس اسٹیشن', hi: 'पुलिस स्टेशन', bn: 'पुलिस स्टेशन' }, type: 'police', lat: 21.4245, lng: 39.8282 },
  { id: '3', name: { en: 'Emergency Shelter', ar: 'ملجأ الطوارئ', ur: 'ہنگامی پناہ گاہ', hi: 'آपातकालीन आश्रय', bn: 'জরুরি আশ্রয়' }, type: 'shelter', lat: 21.4205, lng: 39.8242 },
  { id: '4', name: { en: 'King Abdulaziz Hospital', ar: 'مستشفى الملك عبد العزيز', ur: 'شاہ عبدالعزیز ہسپتال', hi: 'किंग अब्दुलअजीज अस्पताल', bn: 'কিং আবদুল আজিজ হাসপাতাল' }, type: 'hospital', lat: 21.3891, lng: 39.8579 },
  { id: '5', name: { en: 'Al Haram Police', ar: 'شرطة الحرم', ur: 'حرم پولیس', hi: 'अल हरम पुलिस', bn: 'আল হারাম পুলিশ' }, type: 'police', lat: 21.4231, lng: 39.8257 },
];

// Custom Marker Function to use Lucide Icons (Works Offline!)
const createCustomIcon = (type: string) => {
  const iconHtml = renderToStaticMarkup(
    <div style={{
      backgroundColor: type === 'hospital' ? '#ef4444' : type === 'police' ? '#2563eb' : '#059669',
      padding: '8px',
      borderRadius: '12px',
      color: 'white',
      border: '2px solid white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      {type === 'hospital' ? <Cross size={20} /> : type === 'police' ? <Shield size={20} /> : <Building2 size={20} />}
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const UserIcon = L.divIcon({
  html: renderToStaticMarkup(
    <div style={{ width: '20px', height: '20px', backgroundColor: '#3b82f6', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 10px #3b82f6' }} />
  ),
  className: 'user-location-icon',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

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
      }, (err) => console.log("Location error", err));
    }
  }, []);

  const filteredPoints = useMemo(() => {
    return POINTS_OF_INTEREST.filter(poi => {
      const matchesFilter = activeFilter === 'all' || poi.type === activeFilter;
      const matchesSearch = poi.name[language].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, language]);

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

      <div className="bg-white dark:bg-[#1e1e1e] rounded-[3rem] border-4 border-white dark:border-slate-800 overflow-hidden shadow-2xl mb-6 relative h-[450px] z-10">
        <MapContainer center={[21.4225, 39.8262]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <>
              <Marker position={userLocation} icon={UserIcon}>
                <Popup>You are here</Popup>
              </Marker>
            </>
          )}
          {filteredPoints.map(poi => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={createCustomIcon(poi.type)}>
              <Popup>
                <div className="font-black uppercase text-xs text-slate-900">{poi.name[language]}</div>
                <div className="text-[10px] opacity-70 uppercase tracking-widest text-slate-500">{poi.type}</div>
              </Popup>
            </Marker>
          ))}
          {/* Automatically center on points if no user location is found */}
          {!userLocation && filteredPoints.length > 0 && <RecenterAutomatically lat={filteredPoints[0].lat} lng={filteredPoints[0].lng} />}
          {userLocation && <RecenterAutomatically lat={userLocation[0]} lng={userLocation[1]} />}
        </MapContainer>

        <button
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation([position.coords.latitude, position.coords.longitude]);
              });
            }
          }}
          className="absolute bottom-28 right-6 z-[1000] p-4 bg-white dark:bg-slate-900 rounded-full shadow-2xl text-blue-600 active:scale-90 transition-all border border-slate-200 dark:border-slate-700"
        >
          <Locate size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-[2rem] border border-white/20 shadow-2xl flex items-center gap-4 z-[1000]">
          <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 p-3 rounded-2xl"><Navigation2 size={24} /></div>
          <div className="flex-grow">
            <p className="text-[10px] text-slate-800 dark:text-slate-200 font-bold uppercase tracking-widest leading-none mb-1">
              {userLocation ? 'Live GPS Active' : 'Reference Mode'}
            </p>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
              Showing {filteredPoints.length} hubs {activeFilter !== 'all' ? `filtered by ${activeFilter}` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-10">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nearby Emergency Hubs</h2>
        {filteredPoints.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-[#1e1e1e] rounded-[2rem] border border-dashed border-slate-300">
            <Info className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No hubs found for this filter</p>
          </div>
        ) : filteredPoints.map(poi => (
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

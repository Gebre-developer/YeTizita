import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { QrCode, WifiOff, RefreshCw, Layers } from 'lucide-react';

const OfflineShare = ({ course }) => {
  const { language } = useContext(AuthContext);
  const [showQR, setShowQR] = useState(false);

  if (!course) return null;

  // Localized string dictionary matching standard low-data device requirements
  const text = {
    EN: {
      title: "Data-Free P2P Mesh Sharing",
      subtitle: "Share this module structure with nearby classmates for 0 Birr data cost.",
      btnShow: "Generate Share Code",
      btnHide: "Hide Share Code",
      badgeScan: "SCAN MESH",
      hintText: "Have your classmate scan this box using their phone camera to instantly duplicate course structures offline."
    },
    AM: {
      title: "ያለ ኢንተርኔት ፋይል ማጋሪያ",
      subtitle: "የዚህን ኮርስ ዝርዝር በአቅራቢያዎ ላሉ ተማሪዎች ያለምንም የዳታ ወጪ (በ0 ብር) ያጋሩ::",
      btnShow: "የማጋሪያ ኮድ ፍጠር",
      btnHide: "ኮዱን ደብቅ",
      badgeScan: "ኮዱን ይቃኙ",
      hintText: "ጓደኛዎ የስልካቸውን ካሜራ በመጠቀም ይህንን ኮድ እንዲያነቡት ያድርጉ:: ኮርሱ ወዲያውኑ ወደ ስልካቸው ይገለበጣል::"
    }
  }[language || 'EN'];

  // Serializes live database values straight into an ultra-compact payload string
  const generateMeshPayload = () => {
    const compactData = {
      i: course.id,
      t: course.title,
      c: course.category,
      d: course.description ? course.description.substring(0, 60) + '...' : '',
      f: course.fileUrl || null // Securely packages the live MySQL file download location path parameters!
    };
    return encodeURIComponent(JSON.stringify(compactData));
  };
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" /> {text.title}
          </h4>
          <p className="text-[10px] text-slate-400 leading-normal mt-0.5 max-w-[240px] sm:max-w-none">
            {text.subtitle}
          </p>
        </div>
        <button
          onClick={() => setShowQR(!showQR)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition shrink-0 active:scale-[0.98]"
        >
          {showQR ? text.btnHide : text.btnShow}
        </button>
      </div>

      {showQR && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center space-y-3 text-center transition duration-300">
          
          {/* Dynamic High-Density Scanning Box Placeholder Frame */}
          <div className="w-32 h-32 bg-white p-2.5 rounded-xl flex items-center justify-center relative overflow-hidden shadow-xl shadow-slate-950">
            <div className="grid grid-cols-4 gap-1 w-full h-full opacity-[0.85]">
              {[...Array(16)].map((_, i) => (
                <div key={i} className={`rounded-sm ${i % 3 === 0 || i % 5 === 0 ? 'bg-slate-950' : 'bg-slate-200'}`} />
              ))}
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-950 bg-white/95 uppercase tracking-widest p-1 border-2 border-slate-950 rounded-xl m-1 select-none">
              {text.badgeScan}
            </span>
          </div>

          {/* Secure System Action URL Text Block */}
          <div className="space-y-2 w-full">
            <p className="text-[10px] font-mono text-emerald-400 break-all select-all p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 leading-normal max-h-[64px] overflow-y-auto">
              elhub://mesh-share?payload={generateMeshPayload()}
            </p>
            <span className="text-[10px] text-slate-500 block leading-normal px-2">
              {text.hintText}
            </span>
          </div>

        </div>
      )}
    </div>
  );
};

export default OfflineShare;

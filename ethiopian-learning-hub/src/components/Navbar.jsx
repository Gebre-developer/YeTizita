
import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X, BookOpen, Layers, Phone, LayoutDashboard, Globe, Zap, LogOut, PlusCircle } from 'lucide-react';

const Navbar = () => {
  // FIXED: Destructured logoutUser to match your updated AuthContext definitions
  const { 
    user, logoutUser, language, toggleLanguage, lowBandwidthMode, toggleBandwidthMode, streakCount 
  } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Local Translation Dictionaries with full language contextual mapping
  const text = {
    EN: { 
      courses: "Courses", 
      about: "About", 
      contact: "Contact", 
      dashboard: "Dashboard", 
      deployCourse: "Deploy Course",
      lowData: "Low Data Mode",
      signIn: "Sign In",
      register: "Create Account",
      logout: "Logout",
      days: "Days"
    },
    AM: { 
      courses: "ኮርሶች", 
      about: "ስለ እኛ", 
      contact: "እውቂያ", 
      dashboard: "ዳሽቦርድ", 
      deployCourse: "ኮርስ ፍጠር",
      lowData: "አነስተኛ ዳታ",
      signIn: "ግባ",
      register: "አካውንት ክፈት",
      logout: "ውጣ",
      days: "ቀናት"
    }
  }[language || 'EN']; 

  const handleMobileNavigation = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo Wrapper */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-2 group">
            <span className="text-2xl transform group-hover:scale-110 transition duration-300">🇪🇹</span>
            <span className="font-black text-base sm:text-lg tracking-wider bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 bg-clip-text text-transparent group-hover:brightness-110 transition">
              ETHIOPIAN LEARNING HUB
            </span>
          </Link>

          {/* DESKTOP VIEWPORT LAYOUT */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Bandwidth Controller Toggle */}
            <button 
              onClick={toggleBandwidthMode}
              className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold uppercase transition tracking-wider flex items-center gap-1 cursor-pointer ${
                lowBandwidthMode 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Disables background graphics to save cellular mobile data data traffic"
            >
              <span>📉</span> {text.lowData}: {lowBandwidthMode ? "ON" : "OFF"}
            </button>

            {/* Bilingual Translation Toggle Button */}
            <button 
              onClick={toggleLanguage} 
              className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-black tracking-widest transition flex items-center gap-1 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" /> {language === 'EN' ? 'አማርኛ' : 'English'}
            </button>

            {/* Daily Learning Streak Indicator Module */}
            {user && (
              <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{streakCount} {text.days}</span>
              </div>
            )}

            {/* Application Links Navigation */}
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
              <Link to="/courses" className={`px-3 py-2 rounded-xl text-sm transition ${isActive('/courses') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>{text.courses}</Link>
              <Link to="/about" className={`px-3 py-2 rounded-xl text-sm transition ${isActive('/about') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>{text.about}</Link>
              <Link to="/contact" className={`px-3 py-2 rounded-xl text-sm transition ${isActive('/contact') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>{text.contact}</Link>
            </div>
            
            {/* Authenticated Dashboard Actions Control Container */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                {/* FIXED: Handles dual instructor/teacher string keys dynamically from the Neon database tables */}
                {(user.role === 'teacher' || user.role === 'instructor') && (
                  <Link to="/dashboard" className={`text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 rounded-xl shadow-md transition flex items-center gap-1`}>
                    <PlusCircle className="w-3.5 h-3.5" /> {text.deployCourse}
                  </Link>
                )}
                <Link to="/dashboard" className={`text-sm px-2 py-1 rounded-xl transition ${isActive('/dashboard') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>{text.dashboard}</Link>
                <button onClick={() => { logoutUser(); navigate('/'); }} className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" /> {text.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                <Link to="/login" className={`px-3 py-2 rounded-xl text-sm transition ${isActive('/login') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>
                  {text.signIn}
                </Link>
                {/* FIXED: Adjusted pointer link path from /register to /signup to match App.jsx routes */}
                <Link to="/signup" className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md hover:brightness-110 transition">
                  {text.register}
                </Link>
              </div>
            )}
          </div>
          {/* MOBILE TOGGLE TRIGGER CONTROLLER BUTTON */}
          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleLanguage} 
              className="bg-slate-900 border border-slate-800 text-emerald-400 p-2 rounded-xl text-xs font-black transition cursor-pointer"
            >
              {language === 'EN' ? 'አማ' : 'EN'}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 focus:outline-none focus:text-white transition cursor-pointer"
              aria-label="Toggle structural menu view"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-amber-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE CONTENT TRAYS SYSTEM (DRAWER DRAWS DOWN) */}
      <div className={`md:hidden transition-all duration-300 ease-in-out border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl ${mobileMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden'}`}>
        <div className="px-4 pt-2 pb-6 space-y-4">
          
          {/* User Metrics Segment Matrix */}
          <div className="grid grid-cols-2 gap-2 pt-2 pb-1">
            <button 
              onClick={toggleBandwidthMode}
              className={`text-[11px] p-3 rounded-xl border font-bold uppercase transition tracking-wider flex items-center justify-center gap-1.5 cursor-pointer ${
                lowBandwidthMode 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              📉 {text.lowData}: {lowBandwidthMode ? "ON" : "OFF"}
            </button>

            {user ? (
              <div className="flex items-center justify-center space-x-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 p-3 rounded-xl text-xs font-bold">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{streakCount} {text.days}</span>
              </div>
            ) : (
              <div className="flex items-center justify-center bg-slate-900 border border-slate-800 text-slate-500 p-3 rounded-xl text-xs">
                🇪🇹 Learning Hub
              </div>
            )}
          </div>

          {/* Navigational Links Path Matrix */}
          <div className="space-y-1">
            <button onClick={() => handleMobileNavigation('/courses')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition cursor-pointer ${isActive('/courses') ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}>
              <BookOpen className="w-5 h-5" /> {text.courses}
            </button>
            <button onClick={() => handleMobileNavigation('/about')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition cursor-pointer ${isActive('/about') ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}>
              <Layers className="w-5 h-5" /> {text.about}
            </button>
            <button onClick={() => handleMobileNavigation('/contact')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition cursor-pointer ${isActive('/contact') ? 'text-amber-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}>
              <Phone className="w-5 h-5" /> {text.contact}
            </button>
            {user && (
              <button onClick={() => handleMobileNavigation('/dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition cursor-pointer ${isActive('/dashboard') ? 'bg-amber-500/10 text-amber-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'}`}>
                <LayoutDashboard className="w-5 h-5" /> {text.dashboard}
              </button>
            )}
          </div>

          {/* Action Session Blocks Panel Footer */}
          <div className="pt-4 border-t border-slate-900 space-y-2">
            {user ? (
              <div className="space-y-2">
                {/* FIXED: Supports both instructor and teacher string fields securely from DB inside mobile drawer layout views */}
                {(user.role === 'teacher' || user.role === 'instructor') && (
                  <button 
                    onClick={() => handleMobileNavigation('/dashboard')}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-5 h-5" /> {text.deployCourse}
                  </button>
                )}
                <button 
                  onClick={() => { setMobileMenuOpen(false); logoutUser(); navigate('/'); }}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> {text.logout}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleMobileNavigation('/login')}
                  className={`py-3 rounded-xl text-center font-medium border text-sm transition cursor-pointer ${isActive('/login') ? 'border-amber-400 text-amber-400 bg-amber-500/5' : 'border-slate-800 text-slate-300 bg-slate-900'}`}
                >
                  {text.signIn}
                </button>
                {/* FIXED: Synchronized registration mobile redirection path string from /register to /signup to map cleanly to App.jsx */}
                <button 
                  onClick={() => handleMobileNavigation('/signup')}
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold text-sm py-3 rounded-xl shadow-md text-center active:scale-[0.99] transition cursor-pointer"
                >
                  {text.register}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

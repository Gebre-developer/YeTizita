import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios'; // 1. Swapped mockData for Axios

const Dashboard = () => {
  const { user, enrolledCourses = [] } = useContext(AuthContext);
  
  // 2. Added local state to hold live database records
  const [dbCourses, setDbCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gemini Assistant State Variables
  const [copilotInput, setCopilotInput] = useState('');
  const [localChatMessages, setLocalChatMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // 3. Automatically fetch MySQL entries when the dashboard mounts
  useEffect(() => {
    const fetchLiveTracks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        if (response.data.success) {
          setDbCourses(response.data.data);
        }
      } catch (err) {
        console.error("Error connecting to live course backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveTracks();
  }, []);

  // 4. Map the student's enrollments against your real MySQL courses
  const activeModules = (enrolledCourses || [])
    .map(eRecord => {
      if (!eRecord || !eRecord.courseId) return null;
      // Looks through your dynamic MySQL records instead of mock static files
      const courseMatch = dbCourses.find(c => c.id === Number(eRecord.courseId));
      if (!courseMatch) return null;
      
      const totalCount = courseMatch.lessons?.length || 0;
      const completedCount = eRecord.completedLessons?.length || 0;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return { ...courseMatch, completedCount, totalCount, percentage };
    })
    .filter(Boolean);

  const handleSendGeminiMessage = async (e) => {
    e.preventDefault();
    if (!copilotInput.trim() || aiLoading) return;

    const userText = copilotInput;
    setCopilotInput('');
    
    const historicalPayload = [...localChatMessages, { sender: 'user', text: userText }];
    setLocalChatMessages(historicalPayload);
    setAiLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/copilot", {
        prompt: userText,
        courseContext: {
          dashboardPage: "Student Overview Workspace Analytics",
          activeModulesCount: activeModules.length
        }
      });

      if (res.data.success) {
        setLocalChatMessages([...historicalPayload, { sender: 'gemini', text: res.data.text }]);
      }
    } catch (err) {
      console.error("Client AI Stream Delivery Error:", err);
      setLocalChatMessages([...historicalPayload, { sender: 'system', text: "Connection failed. Ensure port 5000 server instance is up." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const renderChatInterface = () => {
    if (localChatMessages.length === 0) {
      return <p className="text-slate-500 text-center italic mt-12">Ask Gemini an architecture question...</p>;
    }
    return localChatMessages.map((msg, mIdx) => (
      <div key={mIdx} className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-emerald-600/10 text-emerald-300 ml-4 text-right' : msg.sender === 'system' ? 'bg-rose-950/30 text-rose-400 text-center italic' : 'bg-slate-800 text-slate-300 mr-4'}`}>
        <p className="font-semibold text-[10px] opacity-60 mb-0.5">{msg.sender === 'user' ? 'You' : msg.sender === 'system' ? 'System' : 'Gemini AI'}</p>
        <p className="whitespace-pre-wrap text-left text-xs">{msg.text}</p>
      </div>
    ));
  };
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 text-white relative">
      
      {/* Profile Welcome Header Banner */}
      <div className="glass-card rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5">
        <div>
          <span className="text-xs bg-emerald-600 text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Profile Level: Student Workbench
          </span>
          <h1 className="text-3xl font-extrabold mt-3 tracking-tight text-white">Selam, {user?.name || 'Academic Scholar'}!</h1>
          <p className="text-slate-400 text-sm mt-1">Track your progress and continue learning where you left off.</p>
        </div>
        <Link to="/courses" className="bg-emerald-600 hover:bg-emerald-500 font-medium text-sm px-5 py-3 rounded-xl transition shadow-md text-white">
          Browse Learning Catalog
        </Link>
      </div>

      {/* Analytics Statistics Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrolled Tracks</p>
          <p className="text-3xl font-black text-white mt-2">
            {loading ? '...' : activeModules.length}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed Lessons</p>
          <p className="text-3xl font-black text-white mt-2">
            {enrolledCourses.reduce((acc, c) => acc + (c?.completedLessons?.length || 0), 0)}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Certificates Earned</p>
          <p className="text-3xl font-black text-amber-500 mt-2">
            {activeModules.filter(m => m.percentage === 100).length}
          </p>
        </div>
      </div>

      {/* Split Learning Space Main Dashboard View Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Active Tracks List View */}
        <div className={`space-y-6 transition-all duration-300 ease-in-out ${isExpanded ? 'lg:col-span-6' : 'lg:col-span-8'}`}>
          <h2 className="text-xl font-bold text-white">Your Active Tracks</h2>
          
          {loading ? (
            <div className="text-center text-emerald-400 font-bold text-sm animate-pulse p-10">
              Streaming database records from learning_hub...
            </div>
          ) : activeModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeModules.map(module => (
                <div key={module.id} className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {module.User?.username || "Hub Instructor"}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">{module.percentage}% Done</span>
                    </div>
                    <h3 className="font-bold text-white text-base line-clamp-1">{module.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{module.completedCount} of {module.totalCount} completed units</p>
                    <div className="w-full bg-slate-950/60 h-2 rounded-full overflow-hidden mt-3">
                      <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${module.percentage}%` }}></div>
                    </div>
                  </div>
                  <Link to={`/courses/${module.id}`} className="w-full mt-4 text-center bg-slate-800/40 hover:bg-slate-800/80 text-white border border-white/10 font-medium text-xs py-2.5 rounded-xl transition block">
                    Launch Learning Space
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 rounded-2xl border border-white/5 text-center text-slate-400">
              You are not enrolled in any training tracks yet. Go to the course catalog to begin!
            </div>
          )}
        </div>

        {/* Right Side: Reusable AI Assistant Module Panel */}
        <div className={`space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? 'lg:col-span-6' : 'lg:col-span-4'}`}>
          <h2 className="text-xl font-bold text-white">AI Workspace</h2>
          <div className={`bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'h-[480px] ring-2 ring-emerald-500/20 shadow-2xl' : 'h-[360px]'}`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Google Gemini Assistant</h3>
              {isExpanded && (
                <button 
                  onClick={() => setIsExpanded(false)} 
                  className="text-[10px] text-slate-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition"
                >
                  ✕ Collapse
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-950/50 mb-3 custom-scrollbar">
              {renderChatInterface()}
              {aiLoading && (
                <div className="flex items-center gap-1.5 p-1 text-[11px] text-emerald-400 font-medium animate-pulse">
                  <span>⚡ Processing blueprint execution...</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSendGeminiMessage} className="flex gap-2 items-center">
              <input 
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                placeholder="Ask a question about your study path..."
                className="flex-1 bg-slate-950 text-xs border border-slate-800 p-2.5 rounded-xl outline-none focus:border-emerald-500 text-slate-200 transition"
              />
              <button 
                type="submit" 
                disabled={aiLoading || !copilotInput.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        </div>
        
      </div>

    </div>
  );
};

export default Dashboard;

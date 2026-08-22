import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { BookOpen, User, Layers, ArrowRight, Loader2, Sparkles } from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();
  const { language } = useContext(AuthContext);
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- Day 1 Inline Form States ---
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    title: "",
    description: "",
    category: "Programming",
    price: ""
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Amharic and English translation layers
  const text = {
    EN: {
      title: "Educational Track Catalog",
      subtitle: "Explore available learning track modules across the hub panel.",
      priceFree: "Free Access",
      viewDetails: "View Course Modules",
      createBtn: "➕ Create New Course Inline",
      closeBtn: "✕ Close Form Panel",
      formTitle: "Deploy Course Parameters Inline"
    },
    AM: {
      title: "የኮርሶች ዝርዝር ማውጫ",
      subtitle: "በመማሪያ ማዕከሉ ውስጥ ያሉትን ሁሉንም የትምህርት ሞጁሎች እዚህ ያግኙ::",
      priceFree: "በነጻ የሚገኝ",
      viewDetails: "ትምህርቱን ጀምር",
      createBtn: "➕ አዲስ ኮርስ በቅጽበት ፍጠር",
      closeBtn: "✕ ቅጹን ዝጋ",
      formTitle: "አዲስ የኮርስ መረጃ ማረጋገጫ ቅጽ"
    }
  }[language || 'EN'];

  // Core catalog payload fetch engine
  const fetchCourses = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://onrender.com";
      const res = await axios.get(`${baseUrl}/api/courses`);
      if (res.data.success) {
        setCourses(res.data.data || []);
      }
    } catch (err) {
      console.error("Catalog acquisition error:", err);
      setError("Unable to sync catalog galleries from data clusters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Day 1 Instructor Form Handler Submission Pipeline
  const handleInlineCourseSubmit = async (e) => {
    e.preventDefault();
    if (!newCourseData.title || !newCourseData.description) {
      setFormError("Title and Description are required fields.");
      return;
    }

    setFormLoading(true);
    setFormError("");

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://onrender.com";
      const res = await axios.post(`${baseUrl}/api/courses`, {
        title: newCourseData.title,
        description: newCourseData.description,
        category: newCourseData.category,
        price: parseFloat(newCourseData.price) || 0.0,
        instructorId: 1 // Matches your current active hardcoded backend validation tracking profile
      });

      if (res.data.success) {
        setNewCourseData({ title: "", description: "", category: "Programming", price: "" });
        setShowCreateForm(false);
        fetchCourses(); // Instantly refreshes your structural view grids array live!
      }
    } catch (err) {
      console.error(err);
      setFormError("Failed to deploy new course structural assets.");
    } finally {
      setFormLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="py-32 text-center text-emerald-400 font-bold animate-pulse text-xs uppercase tracking-widest flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Gathering Academic Tracks...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-white space-y-8">
      
      {/* Platform Welcome Header Identity Block */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
          {text.title}
        </h1>
        
        {/* Toggle Form Action Controller Drawer Button */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">{text.subtitle}</p>
          <button 
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setFormError("");
            }}
            className={`font-black px-5 py-2.5 rounded-xl text-xs transition duration-200 active:scale-[0.98] shadow-md uppercase tracking-wider ${
              showCreateForm 
                ? "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-400" 
                : "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-110 text-white"
            }`}
          >
            {showCreateForm ? text.closeBtn : text.createBtn}
          </button>
        </div>
      </div>

      {/* Day 1 Inline Course Creator Section */}
      {showCreateForm && (
        <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-md p-6 rounded-2xl max-w-xl mx-auto space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-black text-emerald-400 tracking-wide">{text.formTitle}</h3>
          </div>
          
          {formError && (
            <div className="text-rose-400 bg-rose-950/20 text-xs px-3 py-2 rounded-xl border border-rose-900/40 font-medium">
              {formError}
            </div>
          )}
          
          <form onSubmit={handleInlineCourseSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Course Architecture Title</label>
              <input 
                type="text" 
                value={newCourseData.title}
                onChange={(e) => setNewCourseData({...newCourseData, title: e.target.value})}
                placeholder="e.g., Python Backend Infrastructure Engine"
                className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-slate-600 px-3 py-2.5 rounded-xl text-slate-200 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Syllabus Summary Description</label>
              <textarea 
                rows="3"
                value={newCourseData.description}
                onChange={(e) => setNewCourseData({...newCourseData, description: e.target.value})}
                placeholder="Summarize layout components, database handling metrics, and lesson models..."
                className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-slate-600 px-3 py-2.5 rounded-xl text-slate-200 resize-none leading-relaxed transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Track Category</label>
                <select 
                  value={newCourseData.category}
                  onChange={(e) => setNewCourseData({...newCourseData, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none px-3 py-2.5 rounded-xl text-slate-300 cursor-pointer"
                >
                  <option value="Programming">Programming</option>
                  <option value="Design">UI/UX Design</option>
                  <option value="Business">Business Engineering</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Price Tier (ETB)</label>
                <input 
                  type="number" 
                  value={newCourseData.price}
                  onChange={(e) => setNewCourseData({...newCourseData, price: e.target.value})}
                  placeholder="0.00 (Free Access)"
                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-slate-600 px-3 py-2.5 rounded-xl text-slate-200 transition"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={formLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl transition duration-200 active:scale-[0.99] flex items-center justify-center gap-2 text-white shadow-lg disabled:opacity-40"
            >
              {formLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing Cluster Architecture...</span>
                </>
              ) : (
                "Publish Module Live"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Global Error Banner Display Section */}
      {error && (
        <div className="text-center text-xs text-rose-400 font-medium bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl max-w-xl mx-auto">
          {error}
        </div>
      )}

      {/* Course Cards Registry Grid Panel View Layout */}
      {courses.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 text-xs italic">No educational track profiles discovered in your database repository cluster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div 
              key={c.id} 
              className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-emerald-950/10 group"
            >
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {c.category || "Programming"}
                  </span>
                  <span className="text-xs font-black text-amber-400 tracking-wide">
                    {parseFloat(c.price) > 0 ? `${parseFloat(c.price).toFixed(2)} ETB` : text.priceFree}
                  </span>
                </div>
                
                <div>
                  <h2 className="text-sm font-black text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {c.title}
                  </h2>
                  <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3 mt-1.5 font-medium">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800/60 mt-4 pt-4 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                  <User className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">By: {c.instructor?.username || "System Academy"}</span>
                </div>
                
                <button 
                  onClick={() => navigate(`/courses/${c.id}`)}
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition group-hover:gap-1.5"
                >
                  <span>{text.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default Courses;

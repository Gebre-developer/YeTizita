import { useState, useEffect, useContext } from 'react';
import CourseCard from '../components/CourseCard';
import PageWrapper from '../components/PageWrapper';
import { AuthContext } from '../context/AuthContext';
// IMPORT FIXED: Targets your clean services client routing layers natively
import { courseServices, aiServices } from '../services/api';

const Courses = () => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // State management variables for your live cloud MySQL courses
  const [dbCourses, setDbCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gemini Assistant State Variables
  const [copilotInput, setCopilotInput] = useState('');
  const [localChatMessages, setLocalChatMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Connects to your standard public catalog endpoint via proxy
  useEffect(() => {
    const fetchCatalogFromDB = async () => {
      try {
        // FIXED: Replaced raw axios with secure, abstract proxy client wrapper configuration rules
        const result = await courseServices.getAllCourses();

        if (result.success) {
          const mappedData = result.data.map(course => {
            const hasAccess = course.Enrollments?.some(e => String(e.studentId) === String(user?.id)) || false;

            return {
              id: String(course.id), 
              title: course.title,
              description: course.description,
              price: parseFloat(course.price) === 0 ? "FREE" : `$${course.price}`,
              category: course.category || 'Programming', 
              instructor: course.instructor?.username || 'Hub Instructor',
              fileUrl: course.fileUrl || null,
              isEnrolled: hasAccess 
            };
          });
          setDbCourses(mappedData);
        }
      } catch (err) {
        console.error("Database tracking catalog error:", err);
        setError('Failed to pull available training modules from the cloud backend database.');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogFromDB();
  }, [user]);

  // Dynamically compute distinct category options straight from database fields
  const categories = ['All', ...new Set(dbCourses.map(course => course.category))];

  // Apply filters directly onto your live database records array state
  const filteredCourses = dbCourses.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendGeminiMessage = async (e) => {
    e.preventDefault();
    if (!copilotInput.trim() || aiLoading) return;

    const userText = copilotInput;
    setCopilotInput('');
    
    const historicalPayload = [...localChatMessages, { sender: 'user', text: userText }];
    setLocalChatMessages(historicalPayload);
    setAiLoading(true);

    try {
      // FIXED: Switched backend endpoint connection routes to clean unified relative layers
      const res = await aiServices.sendMessageToCopilot(userText, localChatMessages, {
        catalogPage: "Main Courses Discovery Hub",
        activeFilterCategory: activeCategory
      });

      if (res.success) {
        setLocalChatMessages([...historicalPayload, { sender: 'gemini', text: res.text }]);
      }
    } catch (err) {
      console.error("Client AI Stream Delivery Error:", err);
      setLocalChatMessages([...historicalPayload, { 
        sender: 'system', 
        text: "Connection failed. Please ensure the backend web service on Render is fully awake and running." 
      }]);
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
        <p className="font-semibold text-[10px] opacity-60 mb-0.5">{msg.sender === 'user' ? 'You' : msg.sender === 'system' ? 'System' : 'Google Gemini AI'}</p>
        <p className="whitespace-pre-wrap text-left text-xs">{msg.text}</p>
      </div>
    ));
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8 text-white relative">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search tech courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm transition"
          />
        </div>
        {/* Dynamic Category Pill Selection Filters */}
        <div className="flex flex-wrap justify-center gap-3 py-2">
          {loading ? (
            <div className="text-slate-500 text-xs uppercase tracking-widest font-bold animate-pulse">Generating categories...</div>
          ) : (
            categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                {category}
              </button>
            ))
          )}
        </div>

        {/* Catalog Main Layout Content Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Left Panel: Course Catalog Grid List View */}
          <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'lg:col-span-6' : 'lg:col-span-8'}`}>
            {loading ? (
              <div className="text-center py-12 text-emerald-400 font-bold text-sm animate-pulse">
                Streaming live records from cloud learning_hub schema...
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-400 text-xs font-semibold bg-red-500/10 rounded-2xl border border-red-500/20">
                {error}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 border border-slate-800 rounded-2xl p-6 bg-slate-900/40">
                No courses found matching your criteria.
              </div>
            )}
          </div>

          {/* Right Panel: Custom Expandable Google Gemini AI Assistant */}
          <div className={`space-y-4 transition-all duration-300 ease-in-out ${isExpanded ? 'lg:col-span-6' : 'lg:col-span-4'}`}>
            <div className={`bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'h-[480px]' : 'h-[360px]'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Google Gemini Assistant</h3>
                {!isExpanded && (
                  <button 
                    onClick={() => setIsExpanded(true)} 
                    className="text-[10px] text-slate-400 hover:text-white bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 cursor-pointer"
                  >
                    ⛶ Expand
                  </button>
                )}
                {isExpanded && (
                  <button 
                    onClick={() => setIsExpanded(false)} 
                    className="text-[10px] text-slate-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
                  >
                    ✕ Collapse
                  </button>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 text-xs bg-slate-950/50 p-3 rounded-xl min-h-[120px] max-h-[340px]">
                {renderChatInterface()}
              </div>

              <form onSubmit={handleSendGeminiMessage} className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask assistant..."
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  disabled={aiLoading}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500/50 text-white"
                />
                <button 
                  type="submit"
                  disabled={aiLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
};

export default Courses;

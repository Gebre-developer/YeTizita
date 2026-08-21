import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { aiServices } from '../services/api'; // ✅ Connected directly to your newly fixed service file!
import InteractivePlayground from '../components/InteractivePlayground';
import OfflineShare from '../components/OfflineShare'; 
import { Lock, Unlock, Download, ArrowLeft, Loader2, PlayCircle, Award, CheckCircle, Zap } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    user, enrolledCourses, enrollInCourse, toggleLessonCompletion, unlockedBadges,
    isAudioPlaying, setIsAudioPlaying, currentCareerTrack, language 
  } = useContext(AuthContext);
  
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [copilotInput, setCopilotInput] = useState('');
  const [localChatMessages, setLocalChatMessages] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [audioStatusText, setAudioStatusText] = useState('Listen to Audio Explanation');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Layout expansion state engine tracking parameters
  const [isExpanded, setIsExpanded] = useState(false);

  // Amharic and English translations optimized for administrative clarity
  const text = {
    EN: {
      back: "Back to Courses",
      materialsTitle: "Course Syllabus & Study Materials",
      downloadBtn: "Download Materials",
      lockedFiles: "Enroll in this course to gain file access privileges.",
      noFiles: "No study materials uploaded for this module yet.",
      teacherView: "Teacher View Mode — Enrollment Controls Disabled",
      lessonsHeader: "Module Course Lessons"
    },
    AM: {
      back: "ወደ ኮርሶች ይመለሱ",
      materialsTitle: "የኮርሱ ማስተማሪያ ፋይሎች",
      downloadBtn: "ማስተማሪያ ፋይል አውርድ",
      lockedFiles: "የትምህርት ፋይሎችን ለማግኘት እባክዎ አስቀድመው ይመዝገቡ::",
      noFiles: "ምንም የትምህርት ፋይል አልተጫነም::",
      teacherView: "የአስተማሪ መቆጣጠሪያ ማውጫ — መመዝገብ አይቻልም",
      lessonsHeader: "የትምህርት ሞጁሎች"
    }
  }[language || 'EN'];

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://onrender.com';
    axios.get(`${baseUrl}/api/courses/${id}`)
      .then(res => {
        if (res.data.success) {
          const d = res.data.data;
          setCourse({
            id: String(d.id), 
            title: d.title, 
            description: d.description, 
            category: d.category || 'Programming',
            fileUrl: d.fileUrl || null,
            lessons: d.lessons || [
              { id: "L1", title: "Unit Introduction & Architecture", content: "Welcome! Master layout components, logic lifecycles, and database interactions." },
              { id: "L2", title: "Environmental Configurations", content: "Learn to secure application states using environmental string schemas." }
            ]
          });
        }
      })
      .catch(err => {
        console.error(err);
        setError("Could not pull course properties from active data clusters.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center text-emerald-400 font-bold animate-pulse text-sm">Streaming course blueprint...</div>;
  if (!course) return <div className="py-20 text-center text-white"><p>Course Missing</p><button onClick={() => navigate('/courses')} className="mt-4 bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs">Return</button></div>;

  const enrollmentRecord = enrolledCourses?.find(e => String(e.courseId) === course.id);
  const isEnrolled = !!enrollmentRecord;
  const isTeacher = user?.role === 'teacher';
  const currentLesson = course.lessons?.[activeLessonIndex];
  
  const handleSendGeminiMessage = async (e) => {
    e.preventDefault();
    if (!copilotInput.trim() || aiLoading) return;

    const userText = copilotInput;
    setCopilotInput('');
    
    // ✅ Saves active state array layers to prevent state-race mismatches
    const updatedHistory = [...localChatMessages, { sender: 'user', text: userText }];
    setLocalChatMessages(updatedHistory);
    setAiLoading(true);

    try {
      // ✅ Now cleanly calling your newly created backend wrapper with full multi-turn chat history context!
      const data = await aiServices.sendMessageToCopilot(
        userText,
        updatedHistory,
        {
          courseTitle: course.title,
          activeLessonTitle: currentLesson?.title || ""
        }
      );

      if (data.success) {
        setLocalChatMessages([...updatedHistory, { sender: 'gemini', text: data.text }]);
      }
    } catch (err) {
      console.error("Client AI Stream Delivery Error:", err);
      setLocalChatMessages([...updatedHistory, { sender: 'system', text: "Connection failed. Your request timed out or the AI pipeline is unreachable." }]);
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
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 text-white relative">
      <button 
        onClick={() => navigate('/courses')} 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4 text-amber-400" />
        {text.back}
      </button>

      <div className="bg-slate-950/60 p-3 rounded-xl flex justify-between text-xs border border-emerald-500/20">
        <span>🎯 Target Profile: <strong className="text-amber-400">{currentCareerTrack || "Full-Stack Engineer"}</strong></span>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 p-8 rounded-3xl border border-slate-800 shadow-xl relative">
        <span className="bg-emerald-600 text-white text-[10px] px-3 py-1 font-bold uppercase rounded-full">{course.category}</span>
        <h1 className="text-3xl font-black mt-4 mb-4">{course.title}</h1>
        <p className="text-slate-400 text-sm max-w-3xl">{course.description}</p>
        
        <div className="mt-6 flex flex-wrap gap-3">
          {isTeacher ? (
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" /> {text.teacherView}
            </div>
          ) : isEnrolled ? (
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-4 h-4" /> Enrolled & Unlocked
            </div>
          ) : (
            <button 
              onClick={() => user ? enrollInCourse(course.id) : navigate('/login')} 
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition shadow-lg"
            >
              Enroll In Module Course
            </button>
          )}
        </div>
      </div>

      {/* Grid Layout Setup Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              {currentLesson ? currentLesson.title : "Select a Lesson"}
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-900">
              {currentLesson ? currentLesson.content : "Please choose a lesson from the module course registry index sidebar directory to load data contents."}
            </p>
          </div>
          <InteractivePlayground defaultCode="// Write script logic here to verify output parameters..." />
        </div>
        {/* Sidebar Controls Directory Column Layout */}
        <div className="space-y-6">
          
          {/* Module Index Navigation Directory */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-amber-400" /> {text.lessonsHeader}
            </h3>
            <div className="space-y-2">
              {course.lessons?.map((lesson, idx) => (
                <button 
                  key={lesson.id} 
                  disabled={!isEnrolled && !isTeacher} 
                  onClick={() => setActiveLessonIndex(idx)} 
                  className={`w-full text-left p-3 rounded-xl text-xs flex justify-between border transition duration-200 ${(!isEnrolled && !isTeacher) ? 'opacity-40 cursor-not-allowed' : idx === activeLessonIndex ? 'bg-emerald-600/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-950/40 text-slate-400 border-slate-900 hover:border-slate-800'}`}
                >
                  <span className="truncate pr-2">{idx + 1}. {lesson.title}</span>
                  {enrollmentRecord?.completedLessons?.includes(lesson.id) && <span className="text-emerald-400 font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Secure Content File Asset Storage Downloads Cabinet Panel */}
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              {(isEnrolled || isTeacher) ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-slate-600" />}
              {text.materialsTitle}
            </span>
            
            {(isEnrolled || isTeacher) ? (
              course.fileUrl ? (
                <a 
                  href={`${import.meta.env.VITE_API_URL || 'https://onrender.com'}${course.fileUrl}`}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-950 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 text-emerald-400 font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-slate-950"
                >
                  <Download className="w-4 h-4" />
                  <span>{text.downloadBtn}</span>
                </a>
              ) : (
                <p className="text-[11px] text-slate-500 italic text-center py-3 bg-slate-950/40 rounded-xl border border-slate-900">{text.noFiles}</p>
              )
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 text-center text-[11px] text-slate-500 font-medium select-none leading-relaxed">
                {text.lockedFiles}
              </div>
            )}
          </div>

          {/* Copilot Assistant Interface Box Core Structure */}
          {(isEnrolled || isTeacher) && (
            <div className={`bg-slate-900 p-5 rounded-3xl border border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'h-[440px]' : 'h-[340px]'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Google Gemini Assistant</h3>
                {!isExpanded && <button onClick={() => setIsExpanded(true)} className="text-[10px] text-slate-400 hover:text-white bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">⛶ Expand</button>}
                {isExpanded && <button onClick={() => setIsExpanded(false)} className="text-[10px] text-slate-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">✕ Collapse</button>}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-900/60 mb-3 custom-scrollbar">
                {renderChatInterface()}
                {aiLoading && (
                  <div className="flex items-center gap-2 text-slate-500 italic p-1 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Thinking...</span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendGeminiMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  placeholder="Ask a technical question..." 
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl px-3 py-2 text-xs placeholder-slate-600 transition"
                />
                <button 
                  type="submit" 
                  disabled={aiLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 font-bold px-4 py-2 rounded-xl text-xs transition active:scale-95 disabled:opacity-40"
                >
                  Ask
                </button>
              </form>
            </div>
          )}

          {/* Offline Share Node Block P2P Utility */}
          {(isEnrolled || isTeacher) && <OfflineShare courseId={course.id} />}

        </div>
      </div>
      {error && <div className="text-center text-xs text-rose-400 font-medium bg-rose-950/20 border border-rose-900/40 p-3 rounded-xl max-w-xl mx-auto">{error}</div>}
    </div>
  );
};

export default CourseDetails;

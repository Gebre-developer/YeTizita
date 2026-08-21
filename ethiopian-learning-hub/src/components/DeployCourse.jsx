import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, FileText, UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const DeployCourse = () => {
  const { language } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    gradeLevel: ''
  });
  const [courseFile, setCourseFile] = useState(null);

  // Amharic and English translations optimized for school structures
  const text = {
    EN: {
      title: "Deploy New Course",
      subtitle: "Fill out the fields below to publish a course for students.",
      courseTitle: "Course Title",
      category: "Subject / Category",
      grade: "Target Grade Level",
      desc: "Course Description",
      fileLabel: "Upload Syllabus or Material (PDF/ZIP)",
      fileHint: "Compressed files save student download data",
      submitBtn: "Publish & Deploy Course",
      publishing: "Deploying to network...",
      success: "Course deployed successfully!",
      error: "Deployment failed. Please check network connection."
    },
    AM: {
      title: "አዲስ ኮርስ ፍጠር",
      subtitle: "ለተማሪዎች ኮርስ ለመልቀቅ እባክዎ ከታች ያሉትን ቅጾች ይሙሉ::",
      courseTitle: "የኮርሱ ርዕስ",
      category: "የትምህርት አይነት",
      grade: "የክፍል ደረጃ",
      desc: "ስለ ኮርሱ ማብራሪያ",
      fileLabel: "የኮርሱ ማስተማሪያ ፋይል (PDF/ZIP)",
      fileHint: "የተጨመቁ ፋይሎች የተማሪዎችን የዳታ ወጪ ይቀንሳሉ",
      submitBtn: "ኮርሱን ይልቀቁ",
      publishing: "ኮርሱ እየተጫነ ነው...",
      success: "ኮርሱ በተሳካ ሁኔታ ተለቋል!",
      error: "ኮርሱን መጫን አልተቻለም። እባክዎ ኢንተርኔትዎን ያረጋግጡ::"
    }
  }[language || 'EN'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCourseFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('category', formData.category);
    uploadData.append('description', formData.description);
    uploadData.append('gradeLevel', formData.gradeLevel);
    if (courseFile) uploadData.append('courseFile', courseFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // ✅ FIXED: Changed endpoint route from /api/courses/deploy to match your backend index.js path /api/courses
      const response = await fetch(`${apiUrl}/api/courses`, {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        setStatus({ type: 'success', message: text.success });
        setFormData({ title: '', category: '', description: '', gradeLevel: '' });
        setCourseFile(null);
      } else {
        setStatus({ type: 'error', message: text.error });
      }
    } catch (err) {
      console.error("Course deployment system log error:", err);
      setStatus({ type: 'error', message: text.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-6 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Header Info Section */}
        <div className="mb-6 text-center">
          <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-400 mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">{text.title}</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">{text.subtitle}</p>
        </div>

        {/* Global Network Alerts System */}
        {status.message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border ${
            status.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {status.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Deployment Form Target Frame */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Element: Course Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{text.courseTitle}</label>
            <input 
              type="text" 
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition"
              placeholder={language === 'EN' ? 'e.g. Grade 11 Physics - Unit 3' : 'ምሳሌ፡ የ11ኛ ክፍል ፊዚክስ'}
            />
          </div>

          {/* Double Dynamic Column Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{text.category}</label>
              <select 
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none transition"
              >
                <option value="">-- Select --</option>
                <option value="Physics">Physics (ፊዚክስ)</option>
                <option value="Chemistry">Chemistry (ኬሚስትሪ)</option>
                <option value="Biology">Biology (ባዮሎጂ)</option>
                <option value="Mathematics">Mathematics (ሒሳብ)</option>
                <option value="History">History (ታሪክ)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{text.grade}</label>
              <select 
                name="gradeLevel"
                required
                value={formData.gradeLevel}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-3 py-3 text-white text-sm outline-none transition"
              >
                <option value="">-- Select --</option>
                <option value="9">Grade 9 (9ኛ ክፍል)</option>
                <option value="10">Grade 10 (10ኛ ክፍል)</option>
                <option value="11">Grade 11 (11ኛ ክፍል)</option>
                <option value="12">Grade 12 (12ኛ ክፍል)</option>
              </select>
            </div>
          </div>

          {/* Input Element: Description Text Box */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{text.desc}</label>
            <textarea 
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-white text-sm outline-none transition resize-none"
              placeholder={language === 'EN' ? 'Write a brief description about the lessons...' : 'ስለ ትምህርቱ አጭር መግለጫ እዚህ ይጻፉ...'}
            />
          </div>

          {/* Interactive Mobile Touch Targeted Drag/Drop File Matrix */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{text.fileLabel}</label>
            <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/40 bg-slate-950 rounded-xl p-4 transition text-center group cursor-pointer">
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.zip,.rar"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-amber-400 transition" />
                <p className="text-xs text-slate-300 font-medium">
                  {courseFile ? courseFile.name : (language === 'EN' ? "Drag and drop or click to choose file" : "ፋይሉን እዚህ ይጎትቱ ወይም ይጫኑ")}
                </p>
                <p className="text-[10px] text-slate-500">{text.fileHint}</p>
              </div>
            </div>
          </div>

          {/* Submit Trigger Actions Controller */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-500 font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg shadow-amber-950/10 active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{text.publishing}</span>
              </>
            ) : (
              <span>{text.submitBtn}</span>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default DeployCourse;

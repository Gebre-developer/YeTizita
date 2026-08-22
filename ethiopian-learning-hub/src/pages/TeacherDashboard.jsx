// src/pages/TeacherDashboard.jsx - PART 1
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { PlusCircle, FileText, Layers, DollarSign, BookOpen, AlertCircle } from 'lucide-react';

const TeacherDashboard = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form Fields State Variables (Day 1 Feature Requirement)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Programming');
  const [gradeLevel, setGradeLevel] = useState('11'); // Ethiopian Grade System (9-12)
  const [courseFile, setCourseFile] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 🔄 Fetch all deployed courses to filter out the ones owned by this teacher
  const fetchInstructorCourses = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseUrl}/api/courses`);
      
      if (response.data.success) {
        // Filter database courses to only display items deployed by this instructor's ID
        const myModules = response.data.data.filter(c => c.instructorId === user?.id);
        setCourses(myModules);
      }
    } catch (err) {
      console.error("Failed to stream courses from Neon cluster:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchInstructorCourses();
  }, [user]);

  // 🚀 Submit Handling: Deploys a new module live into your database cluster
  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitLoading(true);

    // Form validation check
    if (!title.trim() || !description.trim()) {
      setError('Course Title and Description fields are mandatory.');
      setSubmitLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // Use FormData since your backend endpoint uses Multer for raw file parsing
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price || 0.0);
      formData.append('category', category);
      formData.append('gradeLevel', `Grade ${gradeLevel}`);
      if (courseFile) {
        formData.append('courseFile', courseFile);
      }

      const response = await axios.post(`${baseUrl}/api/courses`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Passes the secure role token handler
        }
      });

      if (response.data.success) {
        setSuccess(`"${title}" has been successfully deployed live to your students!`);
        // Reset form variables smoothly
        setTitle('');
        setDescription('');
        setPrice('');
        setCourseFile(null);
        // Refresh structural data listings instantly
        fetchInstructorCourses();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to deploy the course module. Please verify connection.');
    } finally {
      setSubmitLoading(false);
    }
  };
  // src/pages/TeacherDashboard.jsx - PART 2
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 text-white relative">
      
      {/* 📊 Profile Header Panel Banner (Day 4 Feature Requirement) */}
      <div className="glass-card rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5">
        <div>
          <span className="text-xs bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Profile Access: Instructor Control Panel
          </span>
          <h1 className="text-3xl font-extrabold mt-3 tracking-tight text-white">Selam, Teacher {user?.name || 'Educator'}!</h1>
          <p className="text-slate-400 text-sm mt-1">Deploy fresh content modules and track your curriculum metrics live.</p>
        </div>
        <button 
          onClick={logoutUser}
          className="bg-red-600/80 hover:bg-red-600 font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition shadow-md text-white cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* 📉 Analytics Statistics Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Tracks</p>
          <p className="text-3xl font-black text-white mt-2">{loading ? '...' : courses.length}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Premium Modules</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">
            {loading ? '...' : courses.filter(c => Number(c.price) > 0).length}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Free Resources</p>
          <p className="text-3xl font-black text-amber-400 mt-2">
            {loading ? '...' : courses.filter(c => Number(c.price) === 0).length}
          </p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/5 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Status</p>
          <p className="text-sm font-bold text-slate-300 mt-4 px-2 py-1 bg-slate-950/60 border border-slate-800 rounded-md text-center">
            ● Connected to Neon
          </p>
        </div>
      </div>

      {/* Main Split Grid Workspaces Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 🛠️ LEFT SIDE: Dynamic Course Creation Deployment Form (Day 1 Module Feature) */}
        <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl border border-white/5 shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-emerald-400" /> Deploy New Course
            </h2>
            <p className="text-slate-400 text-xs mt-1">Add curriculum details straight to the database records.</p>
          </div>

          <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl">
                🎉 {success}
              </div>
            )}

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Course Title</label>
              <input
                type="text" required
                placeholder="e.g., Grade 11 Information Technology"
                className="glass-input text-xs"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
              <textarea
                required rows={3}
                placeholder="Write a clear outline summary of your curriculum unit objectives..."
                className="glass-input text-xs resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price (ETB)</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number" min="0" step="0.01"
                    placeholder="0.00 (Free)"
                    className="glass-input text-xs pl-9 w-full"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Curriculum</label>
                <select 
                  className="glass-input text-xs w-full bg-slate-950 cursor-pointer"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                >
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
            </div>
            // src/pages/TeacherDashboard.jsx - PART 3
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
              <select 
                className="glass-input text-xs bg-slate-950 cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Programming">Programming & IT</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Syllabus Document File (PDF/ZIP)</label>
              <div className="relative border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950/20 hover:bg-slate-950/40 transition">
                <input 
                  type="file" 
                  accept=".pdf,.zip,.rar"
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-slate-800 file:text-slate-200 file:cursor-pointer"
                  onChange={(e) => setCourseFile(e.target.files[0])}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:brightness-110 disabled:opacity-50 text-white font-black py-3 rounded-xl transition duration-300 text-xs uppercase tracking-widest shadow-lg shadow-emerald-900/30 transform active:scale-95 mt-2 cursor-pointer"
            >
              {submitLoading ? 'Deploying to Neon Network...' : 'Publish Course Module'}
            </button>
          </form>
        </div>

        {/* 📚 RIGHT SIDE: Live Course Management Inventory View Grid */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" /> Active Course Directory
          </h2>

          {loading ? (
            <div className="text-center text-amber-500 font-bold text-xs animate-pulse p-12 glass-card rounded-3xl border border-white/5">
              Streaming matching database rows from database pool...
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.map(course => (
                <div key={course.id} className="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between shadow-sm space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] bg-slate-800 text-slate-300 font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {course.gradeLevel}
                      </span>
                      <span className="text-[11px] font-black text-emerald-400">
                        {Number(course.price) === 0 ? "FREE" : `${course.price} ETB`}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{course.description}</p>
                  </div>
                  
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {course.category}</span>
                    {course.fileUrl && <span className="flex items-center gap-1 text-amber-500/80"><FileText className="w-3 h-3" /> Attached Asset</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 text-center rounded-3xl border border-white/5 text-slate-400 text-xs">
              No courses deployed yet under your current profile credential rows. Fill out the deployment form to create one!
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;

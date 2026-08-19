import { Link } from 'react-router-dom';
import { Lock, Download, CheckCircle } from 'lucide-react';

const CourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col h-full shadow-lg group bg-slate-900/40">
      
      {/* Upper Cover Segment Matrix */}
      <div className="h-44 bg-slate-950 relative overflow-hidden">
        <img 
          src={course.image || 'https://unsplash.com'} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
        />
        <span className="absolute top-3 right-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 font-bold rounded-full uppercase tracking-wider">
          {course.category}
        </span>

        {/* Dynamic Badge for Enrolled Students */}
        {course.isEnrolled && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] px-2.5 py-1 font-black rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
            <CheckCircle className="w-3 h-3" /> Enrolled
          </span>
        )}
      </div>

      {/* Lower Details Content Panel */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-amber-400 transition duration-300">{course.title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 flex-grow">{course.description}</p>
        
        {/* Dynamic Material Gate Drawer Section */}
        <div className="pt-2 border-t border-slate-800/60">
          {course.isEnrolled ? (
            course.fileUrl ? (
              <a 
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${course.fileUrl}`}
                download
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-emerald-400 font-bold py-2.5 px-4 rounded-xl text-[11px] transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Material</span>
              </a>
            ) : (
              <div className="text-[11px] text-slate-500 italic text-center py-2 bg-slate-950/40 rounded-xl border border-slate-900">
                No files uploaded yet
              </div>
            )
          ) : (
            <div className="w-full bg-slate-950/40 border border-slate-900 text-slate-500 py-2 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 select-none font-medium">
              <Lock className="w-3.5 h-3.5 text-slate-600" />
              <span>Enroll to unlock resources</span>
            </div>
          )}
        </div>

        {/* Action Controller Footers */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-slate-500 font-medium">
            Instructor: <span className="text-slate-400">{course.instructor}</span>
          </span>
          <Link 
            to={`/courses/${course.id}`} 
            className={`text-xs px-4 py-2 rounded-xl font-bold transition shadow-md ${
              course.isEnrolled 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:brightness-110 shadow-emerald-950/20'
            }`}
          >
            {course.isEnrolled ? 'Open Lessons' : 'Enroll & Access'}
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CourseCard;

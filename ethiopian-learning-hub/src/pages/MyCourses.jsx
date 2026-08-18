import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MOCK_COURSES } from '../services/mockData';
import CourseCard from "../components/CourseCard";
import { Link } from 'react-router-dom';

const MyCourses = () => {
  const { enrolledCourses } = useContext(AuthContext);

  // Map enrolled list directly back to primary structured objects
  const enrolledList = MOCK_COURSES.filter(course => 
    enrolledCourses.some(enrollment => enrollment.courseId === course.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">My Active Learning Tracks</h1>
        <p className="text-slate-400 mt-2 text-sm">Resume lessons to complete your custom tracking goals.</p>
      </div>

      {enrolledList.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledList.map(course => (
            <div key={course.id} className="relative group transform hover:-translate-y-1 transition duration-300">
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-slate-800">
          <span className="text-5xl block mb-4">📚</span>
          <h3 className="text-xl font-bold text-slate-200">No active enrollments found</h3>
          <p className="text-slate-400 mt-2 max-w-sm mx-auto text-sm">Explore our localized learning tracks to launch your path configuration map.</p>
          <Link to="/courses" className="mt-6 inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition">
            Explore Course Catalog
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyCourses;

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function InstructorRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-medium tracking-wide">
          Verifying instructor clearance access parameters...
        </span>
      </div>
    );
  }

  // ✅ Role Validation Check: Forwards students out safely back to dashboard feeds
  if (!user || user.role !== 'teacher') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

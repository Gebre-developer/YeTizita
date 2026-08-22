// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import InstructorRoute from './components/InstructorRoute';
import PageWrapper from './components/PageWrapper';
import DeployCourse from './components/DeployCourse';
import AiAssistant from './components/AiAssistant';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyCourses from './pages/MyCourses';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

// 🌐 SYSTEM INTEGRATION: Imported your distinct role dashboard pages cleanly
import StudentsDashboard from './pages/StudentsDashboard'; 
import TeacherDashboard from './pages/TeacherDashboard'; 

// Import your custom asset to guarantee Vite packs it cleanly
import hubBackgroundImg from './assets/img/img.png';

/**
 * 👥 DYNAMIC WORKBENCH RESOLVER
 * Maps a single endpoint route (/dashboard) to completely different UI pages 
 * based on user privileges fetched live from your Neon PostgreSQL database tables.
 */
function DashboardRoleResolver() {
  const { user } = useContext(AuthContext);

  if (user?.role === 'instructor' || user?.role === 'teacher') {
    return <TeacherDashboard />;
  }
  return <StudentsDashboard />;
}

/**
 * AnimatedRoutes handles the Framer Motion page transition layer sequence.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/courses" element={<PageWrapper><Courses /></PageWrapper>} />
        <Route path="/courses/:id" element={<PageWrapper><CourseDetails /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/ai-assistant" element={<PageWrapper><AiAssistant /></PageWrapper>} />
        
        {/* 👥 Protected Student Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageWrapper>
                {/* 🛡️ RESOLVER FIX: Dynamically routes teachers to TeacherDashboard or students to StudentsDashboard */}
                <DashboardRoleResolver />
              </PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-courses" 
          element={<ProtectedRoute><PageWrapper><MyCourses /></PageWrapper></ProtectedRoute>} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} 
        />

        {/* Protected Teacher/Instructor Routes */}
        <Route 
          path="/deploy-course" 
          element={<InstructorRoute><PageWrapper><DeployCourse /></PageWrapper></InstructorRoute>} 
        />

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * Main App Component Container Frame.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
        {/* Fixed background asset viewport canvas sitting safely behind transition timelines */}
        <div 
          className="fixed inset-0 pointer-events-none select-none"
          style={{ 
            backgroundImage: `url(${hubBackgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: -10 
          }}
        >
          {/* Subtle rich dark green gradient overlay shield to maintain high readability across panels */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/85 to-emerald-950/40"></div>
        </div>

        {/* Global application interface nodes */}
        <div className="flex flex-col min-h-screen relative z-10">
          <Navbar />
          <div className="flex-grow">
            <AnimatedRoutes />
          </div>
          <Footer />
        </div>

        {/* 🛠️ ARCHITECTURE RECOVERY FIX: 
            Removed the statically placed <CreateCourse /> from the bottom of the screen.
            Instructors can now manage and create content cleanly inside their private <TeacherDashboard /> view instead! */}

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

// FIXED PATH IMPORT: Points cleanly to where the file resides in your Explorer sidebar
import AiAssistant from './components/AiAssistant';

// Import your custom asset to guarantee Vite packs it cleanly
import hubBackgroundImg from './assets/img/img.png';

/**
 * AnimatedRoutes handles the Framer Motion page transition layer sequence.
 */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/my-courses" 
          element={<ProtectedRoute><MyCourses /></ProtectedRoute>} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
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
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

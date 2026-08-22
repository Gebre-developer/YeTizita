// src/context/AuthContext.jsx - PART 1
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  
  // Custom Workspace System Configuration Metrics
  const [language, setLanguage] = useState('EN'); 
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  // Global Engineering Media Controls
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentCareerTrack, setCurrentCareerTrack] = useState('Fintech Developer');

  // Load persistent configurations instantly on framework startup initialization 
  useEffect(() => {
    const storedUser = localStorage.getItem('el_hub_user');
    const storedToken = localStorage.getItem('token'); 
    const storedEnrollments = localStorage.getItem('el_hub_enrollments');
    const storedLang = localStorage.getItem('el_hub_lang');
    const storedLowData = localStorage.getItem('el_hub_low_data');
    const storedStreak = localStorage.getItem('el_hub_streak');
    
    // 🛡️ RECOVERY FIX: Added safety checks to prevent "undefined" string parsing crashes
    if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed parsing user JSON", e);
      }
    }
    
    if (storedEnrollments && storedEnrollments !== "undefined" && storedEnrollments !== "null") {
      try {
        setEnrolledCourses(JSON.parse(storedEnrollments));
      } catch (e) {
        console.error("Failed parsing enrollment JSON", e);
      }
    }
    
    if (storedLang) setLanguage(storedLang);
    if (storedLowData) setLowBandwidthMode(storedLowData === 'true');
    
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      setToken(storedToken);
      // Binds bearer headers permanently to Axios on browser tab refresh
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    setStreakCount(storedStreak ? parseInt(storedStreak, 10) : (storedUser ? 5 : 0)); 
    setUnlockedBadges(storedUser ? ['Habesha Tech Pioneer'] : []);
    setLoading(false);
  }, []);

  // 🔑 User Login Action Hook Call
  const loginUser = (jwtToken, backendUserPayload) => {
    setUser(backendUserPayload);
    setToken(jwtToken);
    
    localStorage.setItem('el_hub_user', JSON.stringify(backendUserPayload));
    if (jwtToken) {
      localStorage.setItem('token', jwtToken); 
      // Attaches the bearer token immediately to current Axios network channels
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    }
    
    setEnrolledCourses([]);
    setStreakCount(1);
    localStorage.setItem('el_hub_streak', '1');
    setUnlockedBadges(['Habesha Tech Pioneer']);
  };

  // 🔐 User Logout Action Trigger
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    setEnrolledCourses([]);
    setStreakCount(0);
    setUnlockedBadges([]);
    delete axios.defaults.headers.common['Authorization'];
    localStorage.clear(); 
  };
  // src/context/AuthContext.jsx - PART 2

  // Saves language selections dynamically inside browser local storage
  const toggleLanguage = () => {
    setLanguage((l) => {
      const targetLang = l === 'EN' ? 'AM' : 'EN';
      localStorage.setItem('el_hub_lang', targetLang);
      return targetLang;
    });
  };

  // Saves bandwidth parameters persistently inside browser memory structures
  const toggleBandwidthMode = () => {
    setLowBandwidthMode((b) => {
      const nextState = !b;
      localStorage.setItem('el_hub_low_data', String(nextState));
      return nextState;
    });
  };

  // Keeps your local student enrollment metrics logged inside persistent arrays
  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.some(item => String(item.courseId) === String(courseId))) {
      const updatedEnrollments = [...enrolledCourses, { courseId: String(courseId), completedLessons: [] }];
      setEnrolledCourses(updatedEnrollments);
      localStorage.setItem('el_hub_enrollments', JSON.stringify(updatedEnrollments));
    }
  };

  // Syncs lesson completion ticks to localStorage for persistent checkmarks
  const toggleLessonCompletion = (courseId, lessonId) => {
    const updated = enrolledCourses.map(course => {
      if (String(course.courseId) === String(courseId)) {
        const isCompleted = course.completedLessons.includes(lessonId);
        const nextLessons = isCompleted
          ? course.completedLessons.filter(id => id !== lessonId)
          : [...course.completedLessons, lessonId];
        return { ...course, completedLessons: nextLessons };
      }
      return course;
    });
    setEnrolledCourses(updated);
    localStorage.setItem('el_hub_enrollments', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loginUser, 
      logoutUser, 
      login: loginUser, 
      logout: logoutUser, 
      loading, 
      enrolledCourses, 
      enrollInCourse, 
      toggleLessonCompletion,
      language, 
      toggleLanguage, 
      lowBandwidthMode, 
      toggleBandwidthMode, 
      streakCount, 
      unlockedBadges,
      isAudioPlaying, 
      setIsAudioPlaying, 
      currentCareerTrack, 
      setCurrentCareerTrack
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

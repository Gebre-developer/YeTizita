import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Added state tracking for authorization headers
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
    const storedToken = localStorage.getItem('token'); // Read the token storage vector on boot
    const storedEnrollments = localStorage.getItem('el_hub_enrollments');
    const storedLang = localStorage.getItem('el_hub_lang');
    const storedLowData = localStorage.getItem('el_hub_low_data');
    const storedStreak = localStorage.getItem('el_hub_streak');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    if (storedEnrollments) setEnrolledCourses(JSON.parse(storedEnrollments));
    if (storedLang) setLanguage(storedLang);
    if (storedLowData) setLowBandwidthMode(storedLowData === 'true');
    
    setStreakCount(storedStreak ? parseInt(storedStreak, 10) : (storedUser ? 5 : 0)); 
    setUnlockedBadges(storedUser ? ['Habesha Tech Pioneer'] : []);
    setLoading(false);
  }, []);

  // FIXED: Accepts both user profiles and token strings directly from the login forms
  const login = (backendUserPayload, jwtToken) => {
    setUser(backendUserPayload);
    setToken(jwtToken);
    
    localStorage.setItem('el_hub_user', JSON.stringify(backendUserPayload));
    if (jwtToken) {
      localStorage.setItem('token', jwtToken); // Secure token visibility for API interceptors
    }
    
    setEnrolledCourses([]);
    setStreakCount(1);
    localStorage.setItem('el_hub_streak', '1');
    setUnlockedBadges(['Habesha Tech Pioneer']);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setEnrolledCourses([]);
    setStreakCount(0);
    setUnlockedBadges([]);
    localStorage.clear(); // Safely clears out session headers completely
  };

  // ✅ FIXED: Saves language selections dynamically inside browser disk hardware storage
  const toggleLanguage = () => {
    setLanguage((l) => {
      const targetLang = l === 'EN' ? 'AM' : 'EN';
      localStorage.setItem('el_hub_lang', targetLang);
      return targetLang;
    });
  };

  // ✅ FIXED: Saves bandwidth parameters persistently inside browser memory structures
  const toggleBandwidthMode = () => {
    setLowBandwidthMode((b) => {
      const nextState = !b;
      localStorage.setItem('el_hub_low_data', String(nextState));
      return nextState;
    });
  };

  // ✅ FIXED: Keeps your local student enrolment metrics logged inside persistent arrays
  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.some(item => item.courseId === courseId)) {
      const updatedEnrollments = [...enrolledCourses, { courseId, completedLessons: [] }];
      setEnrolledCourses(updatedEnrollments);
      localStorage.setItem('el_hub_enrollments', JSON.stringify(updatedEnrollments));
    }
  };

  // ✅ FIXED: Syncs lesson completion ticks to localStorage for persistent checkmarks
  const toggleLessonCompletion = (courseId, lessonId) => {
    const updated = enrolledCourses.map(course => {
      if (course.courseId === courseId) {
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
      user, token, login, logout, loading, enrolledCourses, enrollInCourse, toggleLessonCompletion,
      language, toggleLanguage, lowBandwidthMode, toggleBandwidthMode, streakCount, unlockedBadges,
      isAudioPlaying, setIsAudioPlaying, currentCareerTrack, setCurrentCareerTrack
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

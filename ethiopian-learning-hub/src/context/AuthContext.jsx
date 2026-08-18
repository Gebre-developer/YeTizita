import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

  useEffect(() => {
    const storedUser = localStorage.getItem('el_hub_user');
    const storedEnrollments = localStorage.getItem('el_hub_enrollments');
    const storedLang = localStorage.getItem('el_hub_lang');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedEnrollments) setEnrolledCourses(JSON.parse(storedEnrollments));
    if (storedLang) setLanguage(storedLang);
    
    setStreakCount(storedUser ? 5 : 0); 
    setUnlockedBadges(storedUser ? ['Habesha Tech Pioneer'] : []);
    setLoading(false);
  }, []);
  // Updated login workflow function parameters to process backend payload responses securely
  const login = (backendPayload) => {
    // backendPayload should be the direct 'res.data.user' or the 'user' object from login response
    // It contains: { id, username, role, email }
    setUser(backendPayload);
    localStorage.setItem('el_hub_user', JSON.stringify(backendPayload));
    
    setEnrolledCourses([]);
    setStreakCount(1);
    setUnlockedBadges(['Habesha Tech Pioneer']);
  };

  const logout = () => {
    setUser(null);
    setEnrolledCourses([]);
    setStreakCount(0);
    setUnlockedBadges([]);
    localStorage.clear();
  };

  const toggleLanguage = () => setLanguage(l => l === 'EN' ? 'AM' : 'EN');
  const toggleBandwidthMode = () => setLowBandwidthMode(b => !b);

  const enrollInCourse = (courseId) => {
    if (!enrolledCourses.some(item => item.courseId === courseId)) {
      setEnrolledCourses([...enrolledCourses, { courseId, completedLessons: [] }]);
    }
  };

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
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, loading, enrolledCourses, enrollInCourse, toggleLessonCompletion,
      language, toggleLanguage, lowBandwidthMode, toggleBandwidthMode, streakCount, unlockedBadges,
      isAudioPlaying, setIsAudioPlaying, currentCareerTrack, setCurrentCareerTrack
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import axios from "axios";

// Dynamically target local development port or production proxy layers
const getBaseURL = () => {
  // If running locally in Vite dev mode, hit your local backend port directly
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  // When built and deployed live on Vercel, leave empty to use vercel.json proxies
  return "";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

// Existing course data requests
export const courseServices = {
  getAllCourses: async () => {
    const response = await api.get("/api/courses");
    return response.data;
  },
};

// AI processing services for your Gemini Assistant and Courses page
export const aiServices = {
  getAIRecommendations: async (userIdOrContext) => {
    const response = await api.post("/api/ai/recommendations", {
      data: userIdOrContext,
    });
    return response.data;
  },
  // Handles chat assistant messages
  sendMessage: async (message) => {
    const response = await api.post("/api/ai/chat", { message });
    return response.data;
  },
};

export default api;

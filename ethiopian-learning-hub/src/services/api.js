import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  // ⚡ CRITICAL FIX: Since your backend is hosted on Render, you should return your Render URL here for production,
  // instead of an empty string, unless you are explicitly proxying through vercel.json.
  return "https://yetizita-backend.onrender.com";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
});

export const courseServices = {
  getAllCourses: async () => {
    const response = await api.get("/api/courses");
    return response.data;
  },
};

export const aiServices = {
  getAIRecommendations: async (userIdOrContext) => {
    const response = await api.post("/api/ai/recommendations", {
      data: userIdOrContext,
    });
    return response.data;
  },

  // 🔄 Keep this for backwards compatibility if used elsewhere
  sendMessage: async (message) => {
    const response = await api.post("/api/ai/chat", { message });
    return response.data;
  },

  // ✅ ADD THIS NEW FUNCTION TO MATCH YOUR BACKEND CODE AND COURSES.JSX
  sendMessageToCopilot: async (prompt, chatHistory, courseContext) => {
    const response = await api.post("/api/copilot", {
      prompt,
      chatHistory,
      courseContext,
    });
    return response.data; // This returns the object with your response text
  },
};

export default api;

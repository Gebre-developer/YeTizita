import axios from "axios";

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }
  // 🎯 PRODUCTION URL FIX: Updated to match your exact live Render web service domain address
  return "https://yetizita.onrender.com";
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

  // ✅ AI COPILOT ROUTE ROUTING LAYER Alignment
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

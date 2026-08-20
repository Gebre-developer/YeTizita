import axios from "axios";

// Create a single client connector for your frontend components
const api = axios.create({
  baseURL: "", // Leave empty so Vercel forwards requests automatically
  withCredentials: true,
});

export const courseServices = {
  getAllCourses: async () => {
    const response = await api.get("/api/courses");
    return response.data;
  },
};

export default api;

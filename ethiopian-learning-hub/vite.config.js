import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // ✅ Local environment routing fallback proxy
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // 💥 CRITICAL FOR VERCEL: Excludes server-side libraries from being built into frontend bundle assets
    rollupOptions: {
      external: [
        "express",
        "cors",
        "sequelize",
        "multer",
        "fs",
        "path",
        "./database",
        "./models/User",
        "./models/Course",
        "./models/Lesson",
        "./models/Enrollment",
        "./middleware/authMiddleware",
        "./routes/authRoutes",
        "./routes/enrollmentRoutes",
      ],
    },
  },
});

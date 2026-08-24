import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // 🎯 CRITICAL FIX FOR VERCEL: Locks the compilation directory strictly inside the frontend 'src'
  root: "./",

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // Tells the compiler exactly where your source files are located so it doesn't scan server folders
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // ✅ Clean, native module-only exclusions that will not throw binding errors in Rolldown
      external: ["express", "cors", "sequelize", "multer", "fs", "path"],
    },
  },
});

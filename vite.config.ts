import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    host: true,
    strictPort: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    origin: "https://5173-walterdevin-bancosolida-t5zuzu82s3p.ws-us120.gitpod.io", // <- ayuda a generar URL correcta
    allowedHosts: ["all"], // <- ¡esto sí!
  },
});

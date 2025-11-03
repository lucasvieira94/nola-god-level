import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  root: 'frontend',
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, '/src/main.js'),
    },
    outDir: '../dist',
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8001", 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

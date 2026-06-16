import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Code splitting for vendor chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate React into its own chunk
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Separate UI components
          'vendor-ui': ['lucide-react'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minification with esbuild (default, faster than terser)
    minify: 'esbuild',
    // Report bundle size
    reportCompressedSize: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("react-pdf") || id.includes("pdfjs-dist") || id.includes("react-markdown") || id.includes("remark-")) {
            return "viewer";
          }
          if (id.includes("jspdf") || id.includes("docx") || id.includes("html2canvas")) {
            return "document-export";
          }
          return undefined;
        },
      },
    },
  },
}));

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow Cloudflare quick tunnel hostnames (e.g. *.trycloudflare.com)
    allowedHosts: [".trycloudflare.com"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // docx (via reactjs-tiptap-editor ImportWord) resolves `buffer` for browser builds
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    include: ["buffer"],
  },
  build: {
    // `editor` chunk (tiptap + docx + excalidraw) is large by nature; it loads only with CMS editor routes.
    chunkSizeWarningLimit: 2400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react-vendor";
          }
          if (id.includes("react-router")) return "router";
          if (
            id.includes("reactjs-tiptap-editor") ||
            id.includes("@tiptap") ||
            id.includes("prosemirror") ||
            id.includes("/docx/")
          ) {
            return "editor";
          }
          if (id.includes("monaco-editor") || id.includes("@monaco-editor")) {
            return "monaco";
          }
          if (id.includes("recharts")) return "charts";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@radix-ui") || id.includes("/radix-ui/")) {
            return "radix";
          }
          if (id.includes("socket.io")) return "socket";
          if (id.includes("zod") || id.includes("@hookform")) return "forms";

          return "vendor";
        },
      },
    },
  },
});

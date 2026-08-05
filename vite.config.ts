import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  /**
   * Which backend the dev server proxies `/api` and `/upload` to.
   *
   * Defaults to live, so a fresh checkout behaves as it always has. Point it at
   * the local backend while working on an endpoint that has not been deployed
   * yet — otherwise the browser talks to live and a new route comes back as
   * `{"status":false,"error":"Unknown method"}`, which reads like a bug in the
   * code rather than a request sent to the wrong server.
   *
   *   VITE_API_PROXY_TARGET=http://127.0.0.1:8090
   *
   * Use 127.0.0.1 rather than localhost: Node resolves localhost to ::1 first,
   * and PHP's built-in server binds IPv4 only, so the proxy would hang.
   *
   * Read here rather than from `import.meta.env` because this is Node config —
   * it is not part of the client bundle.
   */
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET || "https://portal.hamtos.com";

  return {
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs  from 'node:fs'
import https from 'node:https'

const options = {
  key: fs.readFileSync('/home/megajdcc/jdcc/certificados/patripoly.key'),
  cert: fs.readFileSync('/home/megajdcc/jdcc/certificados/patripoly.crt')
}

const host = "patripoly.dev";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  
  server: {
    host : host,
    port : 5173,
    https: https
      .createServer(options, (req, res) => {
        res.writeHead(200);
        res.end("hello world\n");
      })
      .listen(8004),
    open: true,
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
  build: {
    
    // assetsInlineLimit:0,
    manifest: false,
    sourcemap: true,
    chunkSizeWarningLimit: 50000,
    emptyOutDir: true,
    commonjsOptions: {
      requireReturnsDefault: false,
    },

    rollupOptions: {
      onwarn: (warning, warn) => {
        // Puedes personalizar el manejo de advertencias aquí

        // 1. Ignorar advertencias específicas (por código)
        if (warning.code === "DEPRECATION") {
          // Ejemplo: ignorar todas las advertencias de obsolescencia
          return; // No hacer nada
        }

        // 2. Ignorar advertencias basadas en el mensaje
        if (warning.message.includes("Some deprecated feature")) {
          // Ejemplo
          return;
        }

        // 3. Mostrar advertencias específicas y luego ignorarlas
        if (warning.code === "SOME_SPECIFIC_WARNING") {
          console.warn(
            "¡Esta advertencia específica será ignorada!: ",
            warning.message
          );
          return;
        }

        // 4. Mostrar todas las advertencias (comportamiento por defecto)
        warn(warning); // o console.warn(warning.message)
      },
    },
  },

  
}));

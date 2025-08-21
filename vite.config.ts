import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteImagemin from 'vite-plugin-imagemin';
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 75 },
      pngquant: { quality: [0.65, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox' },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'react-vendor';
            if (id.includes('framer-motion')) return 'framer-motion-vendor';
            if (id.includes('recharts') || id.includes('d3')) return 'charts-vendor';
            if (id.includes('@radix-ui')) return 'radix-ui-vendor';
            if (id.includes('leaflet')) return 'leaflet-vendor';
            if (id.includes('@supabase')) return 'supabase-vendor';
            if (id.includes('@huggingface/transformers')) return 'hf-transformers-vendor';
            return 'vendor'; // All other vendors
          }
        },
      },
    },
  },
}));

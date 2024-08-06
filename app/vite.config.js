import { defineConfig } from 'vite'
import copy from "rollup-plugin-copy";


export default defineConfig({
  build: {
    target: "esnext",
  },
  esbuild: {
    target: "esnext",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  plugins: [
    copy({
      targets: [
        { src: "node_modules/**/*.wasm", dest: "node_modules/.vite/dist" },
        { src: 'circuits/**/*', dest: 'dist/circuits' },
      ],
      copySync: true,
      hook: "buildStart",
    }),
  ],
  server: {
    port: 3000,
  },
});
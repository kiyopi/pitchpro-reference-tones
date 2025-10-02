import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PitchProReferenceTones',
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'index.js' : 'index.cjs'
    },
    rollupOptions: {
      external: ['tone'],
      output: {
        globals: {
          tone: 'Tone'
        }
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020'
  },
  publicDir: 'public'
});

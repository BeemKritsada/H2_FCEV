import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const configuredBase = process.env.APP_BASE_PATH ?? '/'
const pathSegment = configuredBase.replace(/^\/+|\/+$/g, '')
const base = configuredBase === './' ? './' : pathSegment.length > 0 ? '/' + pathSegment + '/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
})
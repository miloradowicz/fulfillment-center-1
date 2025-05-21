import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { existsSync, readFileSync } from 'fs'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    https: existsSync('./cert/privkey.pem') && existsSync('./cert/fullchain.pem') ? {
      key: readFileSync('./cert/privkey.pem'),
      cert: readFileSync('./cert/fullchain.pem'),
    } : undefined
  }
})

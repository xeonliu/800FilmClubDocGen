import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // 部署到 GitHub Pages 时使用仓库名作为 base 路径
  base: process.env.GITHUB_ACTIONS ? '/800FilmClubDocGen/' : '/',
})

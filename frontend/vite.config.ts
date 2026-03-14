/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // apiから始まるリクエストを全て8080ポートに転送する
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
  test: {
    globals: true, // describe, it, expect などをインポートなしで使えるようにする
    environment: 'jsdom', // ブラウザの代わりになる仮想環境を指定
    setupFiles: './setupTests.ts', // テスト実行前に読み込むファイルを指定
  }
})

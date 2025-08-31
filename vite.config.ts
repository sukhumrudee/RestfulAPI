import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// root = โฟลเดอร์ที่มี index.html อยู่
export default defineConfig({
  root: './src/frontend',
  plugins: [react()],
  build: {
    outDir: '../../dist', // path ที่จะเก็บไฟล์ build หลัง build เสร็จ
  }
})

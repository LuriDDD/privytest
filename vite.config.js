import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import os from 'os'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.join(os.homedir(), 'certs/localhost.key')),
      cert: fs.readFileSync(path.join(os.homedir(), 'certs/localhost.crt')),
    },
    port: 5173,
    host: 'localhost',
    middlewareMode: false,
    cors: true, // Разрешить все CORS запросы
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    }
  }
})

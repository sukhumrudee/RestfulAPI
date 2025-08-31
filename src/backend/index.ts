// src/backend/index.ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import { handle } from 'hono/vercel'

import booksApi from './api/bookapi'
import menuApi from './api/menuapi'
import ordersApi from './api/orderapi'

// โหลด .env แบบ default (ให้วางไว้ root) ; บน Vercel ใช้ Project Env Vars
dotenv.config()

// ----- Prisma: ป้องกันเปิดหลาย connection ตอน dev HMR -----
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ['query', 'info', 'warn', 'error'], // เปิดถ้าต้อง debug
  })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
// -------------------------------------------------------------

const app = new Hono()

// ตั้ง CORS ให้ยืดหยุ่น (ดึงจาก ENV เมื่อ deploy)
const ORIGIN = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
app.use('/api/*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', ORIGIN)
  c.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, DELETE')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  c.header('Access-Control-Allow-Credentials', 'true')
  if (c.req.method === 'OPTIONS') return c.text('OK', 200)
  await next()
})

// รวม route ไว้ที่เดียว (อย่าซ้ำซ้อนกับ app.get('/api/books') ตรง ๆ)
app.route('/api/books', booksApi)
app.route('/api/menu', menuApi)
app.route('/api/orders', ordersApi)

// --- สำหรับ Vercel ---
export const config = { runtime: 'nodejs' } // Prisma ต้อง nodejs runtime
export default handle(app)

// --- สำหรับโลคัล dev เท่านั้น ---
if (process.env.NODE_ENV !== 'production') {
  serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Backend running at http://localhost:${info.port}`)
  })
}

dotenv.config({ path: "./src/backend/.env" });
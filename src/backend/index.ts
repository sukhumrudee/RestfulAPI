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

// CORS — อนุญาตเฉพาะ origin ที่กำหนด แล้วสะท้อนกลับไปให้ตรง
const ALLOWED = new Set([
  'http://localhost:5173',
  'https://restful-api-frontend-nu.vercel.app', // ใส่โดเมน frontend จริงของคุณ
])

app.use('/api/*', async (c, next) => {
  const origin = c.req.header('origin') ?? ''

  if (ALLOWED.has(origin)) {
    c.header('Access-Control-Allow-Origin', origin)
    c.header('Access-Control-Allow-Credentials', 'true') // ถ้าไม่ใช้คุกกี้จะลบบรรทัดนี้ได้
  }

  c.header('Vary', 'Origin')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (c.req.method === 'OPTIONS') return c.body(null, 204)
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
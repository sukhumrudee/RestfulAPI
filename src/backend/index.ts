import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { handle } from 'hono/vercel';
import dotenv from 'dotenv';

import booksApi from './api/bookapi';
import menuApi from './api/menuapi';
import ordersApi from './api/orderapi';
const app = new Hono();

// CORS allowlist — ต้อง “ไม่มี / ท้ายโดเมน”
const ALLOWED = new Set([
  'http://localhost:5173',
  'https://restful-api-frontend-nu.vercel.app',
]);

app.use('/api/*', async (c, next) => {
  const origin = c.req.header('origin') ?? '';
  if (ALLOWED.has(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Credentials', 'true'); // ถ้าไม่ใช้คุกกี้ลบได้
  }
  c.header('Vary', 'Origin');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (c.req.method === 'OPTIONS') return c.body(null, 204);
  await next();
});

// health check
app.get('/api/health', (c) => c.json({ ok: true }));

// mount routes (ให้ใช้ /api/*)
app.route('/api/books', booksApi);
app.route('/api/menu', menuApi);
app.route('/api/orders', ordersApi);

// Vercel
export const config = { runtime: 'nodejs' };
export default handle(app);

// local dev เท่านั้น
if (process.env.NODE_ENV !== 'production') {
  serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Backend running at http://localhost:${info.port}`);
  });
}

dotenv.config({ path: "./src/backend/.env" });
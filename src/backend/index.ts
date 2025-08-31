import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { handle } from 'hono/vercel';
import booksApi from './api/bookapi';
import menuApi from './api/menuapi';
import ordersApi from './api/orderapi';

dotenv.config();

const app = new Hono();
const prisma = new PrismaClient();

app.use('/api/*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  c.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS, DELETE');
  c.header('Access-Control-Allow-Headers', 'Content-Type');
  c.header('Access-Control-Allow-Credentials', 'true');

  if (c.req.method === 'OPTIONS') {
    return c.text('OK', 200);
  }

  await next();
});


app.get('/api/books', async (c) => {
  try {
    const books = await prisma.book.findMany();
    return c.json(books);
  } catch (error) {
    console.error('Error', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

serve(app, (info) => {
  console.log(`Backend running at http://localhost:${info.port}`);
});

app.route('/api/books', booksApi);
app.route('/api/menu', menuApi);
app.route('/api/orders', ordersApi);

export const config = { runtime: 'nodejs' };
export default handle(app);

import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const booksApi = new Hono();

booksApi.get('/', async (c) => {
  try {
    const books = await prisma.book.findMany();
    return c.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return c.json({ error: 'Failed to fetch books' }, 500);
  }
});


booksApi.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return c.json({ error: 'Book not found' }, 404);
  return c.json(book);
});

export default booksApi;

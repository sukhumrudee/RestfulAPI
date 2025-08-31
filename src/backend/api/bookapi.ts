import { Hono } from 'hono';
import { prisma } from '../db/prisma';

const booksApi = new Hono();

// GET /api/books
booksApi.get('/', async (c) => {
  try {
    const books = await prisma.book.findMany();
    return c.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return c.json({ error: 'Failed to fetch books' }, 500);
  }
});

// GET /api/books/:id
booksApi.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return c.json({ error: 'Book not found' }, 404);
  return c.json(book);
});

export default booksApi;

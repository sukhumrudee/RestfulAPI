import { Hono } from 'hono';
import { prisma } from '../db/prisma';

const menuApi = new Hono();

// GET /api/menu
menuApi.get('/', async (c) => {
  const drinks = await prisma.drink.findMany({ include: { orders: true } });
  return c.json(drinks);
});

// (ออปชัน) สร้าง order จากหน้าเมนู
menuApi.post('/', async (c) => {
  try {
    const { drinkId, quantity, note } = await c.req.json();
    const order = await prisma.order.create({ data: { drinkId, quantity, note, status: 'Pending' } });
    return c.json(order);
  } catch (error) {
    console.error('Error creating order from menu:', error);
    return c.json({ message: 'Failed to create order' }, 500);
  }
});

export default menuApi;

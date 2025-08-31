import { Hono } from 'hono';
import { prisma } from '../db/prisma';

const ordersApi = new Hono();

// GET /api/orders
ordersApi.get('/', async (c) => {
  const orders = await prisma.order.findMany({ include: { drink: true } });
  return c.json(orders);
});

// POST /api/orders
ordersApi.post('/', async (c) => {
  const { drinkId, quantity, note } = await c.req.json();
  const order = await prisma.order.create({ data: { drinkId, quantity, note, status: 'Pending' } });
  return c.json(order);
});

// PATCH /api/orders/:id/confirm
ordersApi.patch('/:id/confirm', async (c) => {
  const id = Number(c.req.param('id'));
  if (Number.isNaN(id)) return c.json({ message: 'Invalid id' }, 400);

  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status: 'Confirmed' },
    include: { drink: true },
  });
  return c.json(updatedOrder);
});

// DELETE /api/orders/:id
ordersApi.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.order.delete({ where: { id } });
  return c.json({ message: 'Order deleted' });
});

export default ordersApi;

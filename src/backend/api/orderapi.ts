import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ordersApi = new Hono();

// GET orders พร้อม Drink
ordersApi.get('/', async (c) => {
  const orders = await prisma.order.findMany({ include: { drink: true } });
  return c.json(orders);
});

// POST order ใหม่
ordersApi.post('/', async (c) => {
  const { drinkId, quantity, note } = await c.req.json();
  const order = await prisma.order.create({ data: { drinkId, quantity, note, status: 'Pending' } });
  return c.json(order);
});

// PATCH ยืนยัน order
ordersApi.patch('/:id/confirm', async (c) => {
  const id = Number(c.req.param('id'))

  try {
    // อัปเดต status เป็น confirmed และดึงข้อมูล drink ด้วย
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'Confirmed' },
      include: {
        drink: true, // <<< สำคัญ: ดึง drink object ด้วย
      },
    })

    return c.json(updatedOrder)
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

// DELETE ลบ order
ordersApi.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  await prisma.order.delete({ where: { id } });
  return c.json({ message: 'Order deleted' });
});

export default ordersApi;

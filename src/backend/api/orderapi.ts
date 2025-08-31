// src/backend/api/orderapi.ts
import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (!globalForPrisma.prisma) globalForPrisma.prisma = prisma

const ordersApi = new Hono()

ordersApi.get('/', async (c) => {
  const orders = await prisma.order.findMany({ include: { drink: true } })
  return c.json(orders)
})

ordersApi.post('/', async (c) => {
  try {
    const { drinkId, quantity, note } = await c.req.json()
    const order = await prisma.order.create({
      data: { drinkId, quantity, note, status: 'Pending' }
    })
    return c.json(order, 201)
  } catch (error) {
    console.error(error)
    return c.json({ message: 'Internal server error' }, 500)
  }
})

ordersApi.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await prisma.order.delete({ where: { id } })
  return c.json({ message: 'Order deleted' })
})

export default ordersApi

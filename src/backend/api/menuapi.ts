import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const menuApi = new Hono();

menuApi.get('/', async (c) => {
  const drinks = await prisma.drink.findMany({
    include: { orders: true }, // รวม orders ของแต่ละ drink
  });
  return c.json(drinks);
});


menuApi.post('/', async (c) => {
  try{
    const { drinkId, quantity, note } = await c.req.json();
    const order = await prisma.order.create({ data: { drinkId, quantity, note, status: 'Pending' } });
    return c.json(order);
  } catch (error){
    console.log("Error", error)
  } 
  });




export default menuApi;

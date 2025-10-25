// delete-all.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAll() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  console.log('All data deleted!')
}

deleteAll()
  .finally(() => prisma.$disconnect())
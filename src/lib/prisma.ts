import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

// Handle connection errors
prisma.$on('error', (e) => {
  console.error('Prisma Client Error:', e);
});

// Handle disconnection
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, disconnecting Prisma Client');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, disconnecting Prisma Client');
  await prisma.$disconnect();
  process.exit(0);
});
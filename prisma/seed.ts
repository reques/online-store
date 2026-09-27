import { PrismaClient, ProductStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash('Admin123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: '商城管理员', passwordHash, role: Role.ADMIN },
  });
  const count = await prisma.product.count();
  if (count === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'TypeScript 入门教程', description: '示例商品', price: 9900, stock: 100, status: ProductStatus.ACTIVE },
        { name: 'NestJS 实战课程', description: '示例商品', price: 19900, stock: 50, status: ProductStatus.ACTIVE },
      ],
    });
  }
}

main().finally(() => prisma.$disconnect());

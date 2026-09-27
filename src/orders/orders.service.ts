import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, ProductStatus } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisService) {}

  async create(userId: number, dto: CreateOrderDto) {
    const quantities = new Map<number, number>();
    for (const item of dto.items) {
      quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
    }

    const order = await this.prisma.$transaction(async (tx) => {
      const productIds = [...quantities.keys()];
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      if (products.length !== productIds.length) throw new BadRequestException('Product not found');

      const items: Prisma.OrderItemCreateWithoutOrderInput[] = [];
      let totalAmount = 0;
      for (const product of products) {
        const quantity = quantities.get(product.id)!;
        if (product.status !== ProductStatus.ACTIVE) {
          throw new BadRequestException(`Product ${product.id} is not available`);
        }
        const updated = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: quantity }, status: ProductStatus.ACTIVE },
          data: { stock: { decrement: quantity }, sales: { increment: quantity } },
        });
        if (updated.count !== 1) throw new BadRequestException(`Insufficient stock: ${product.name}`);
        const subtotal = product.price * quantity;
        if (!Number.isSafeInteger(subtotal) || !Number.isSafeInteger(totalAmount + subtotal)) {
          throw new BadRequestException('Order amount is too large');
        }
        totalAmount += subtotal;
        items.push({
          product: { connect: { id: product.id } },
          productName: product.name,
          unitPrice: product.price,
          quantity,
          subtotal,
        });
      }

      return tx.order.create({
        data: {
          orderNo: randomUUID().replaceAll('-', '').slice(0, 32),
          user: { connect: { id: userId } },
          totalAmount,
          items: { create: items },
        },
        include: { items: true },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });

    await Promise.all([...quantities.keys()].map((id) => this.redis.delete(`product:detail:${id}`)));
    await this.redis.deleteByPattern('product:hot:*');
    return order;
  }

  async findMine(userId: number, query: OrderQueryDto) {
    const where = { userId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where, include: { items: true }, orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize, take: query.pageSize,
      }),
      this.prisma.order.count({ where }),
    ]);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId }, include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(query: OrderQueryDto) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        include: { items: true, user: { select: { id: true, email: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.pageSize, take: query.pageSize,
      }),
      this.prisma.order.count(),
    ]);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }
}

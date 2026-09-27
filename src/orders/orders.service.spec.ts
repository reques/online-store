import { BadRequestException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  it('rejects an order when the conditional stock update fails', async () => {
    const updateMany = jest
      .fn<Promise<{ count: number }>, [unknown]>()
      .mockResolvedValue({ count: 0 });
    const tx = {
      product: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, name: '商品', price: 1000, stock: 1, status: ProductStatus.ACTIVE },
        ]),
        updateMany,
      },
    };
    const prisma = {
      $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    };
    const redis = { delete: jest.fn(), deleteByPattern: jest.fn() };
    const service = new OrdersService(prisma as never, redis as never);

    await expect(
      service.create(1, { items: [{ productId: 1, quantity: 2 }] }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(updateMany).toHaveBeenCalled();
    expect(updateMany.mock.calls[0][0]).toEqual({
      where: { id: 1, stock: { gte: 2 }, status: ProductStatus.ACTIVE },
      data: { stock: { decrement: 2 }, sales: { increment: 2 } },
    });
  });
});

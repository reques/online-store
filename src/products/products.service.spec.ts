import { ProductStatus } from '@prisma/client';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  it('returns a cached product without querying MySQL', async () => {
    const product = { id: 1, name: 'cached', status: ProductStatus.ACTIVE };
    const prisma = { product: { findFirst: jest.fn() } };
    const redis = { getJson: jest.fn().mockResolvedValue(product), setJson: jest.fn() };
    const service = new ProductsService(prisma as never, redis as never);
    await expect(service.findOne(1)).resolves.toBe(product);
    expect(prisma.product.findFirst).not.toHaveBeenCalled();
  });

  it('queries MySQL and populates cache on a miss', async () => {
    const product = { id: 1, name: 'database', status: ProductStatus.ACTIVE };
    const prisma = { product: { findFirst: jest.fn().mockResolvedValue(product) } };
    const redis = { getJson: jest.fn().mockResolvedValue(null), setJson: jest.fn() };
    const service = new ProductsService(prisma as never, redis as never);
    await expect(service.findOne(1)).resolves.toBe(product);
    expect(redis.setJson).toHaveBeenCalledWith('product:detail:1', product, 300);
  });
});

import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product, ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService, private readonly redis: RedisService) {}

  async findAll(query: ProductQueryDto) {
    const cacheKey = `product:hot:${query.page}:${query.pageSize}:${query.keyword ?? ''}`;
    const cached = await this.redis.getJson<unknown>(cacheKey);
    if (cached) return cached;
    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      name: query.keyword ? { contains: query.keyword } : undefined,
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        orderBy: [{ sales: 'desc' }, { id: 'desc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.product.count({ where }),
    ]);
    const result = { items, total, page: query.page, pageSize: query.pageSize };
    await this.redis.setJson(cacheKey, result, 60);
    return result;
  }

  findAllForAdmin(): Promise<Product[]> {
    return this.prisma.product.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number): Promise<Product> {
    const key = `product:detail:${id}`;
    const cached = await this.redis.getJson<Product>(key);
    if (cached) return cached;
    const product = await this.prisma.product.findFirst({
      where: { id, status: ProductStatus.ACTIVE },
    });
    if (!product) throw new NotFoundException('Product not found');
    await this.redis.setJson(key, product, 300);
    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({ data: dto });
    await this.redis.deleteByPattern('product:hot:*');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    await this.ensureExists(id);
    const product = await this.prisma.product.update({ where: { id }, data: dto });
    await Promise.all([
      this.redis.delete(`product:detail:${id}`),
      this.redis.deleteByPattern('product:hot:*'),
    ]);
    return product;
  }

  async remove(id: number): Promise<Product> {
    await this.ensureExists(id);
    const product = await this.prisma.product.update({
      where: { id }, data: { status: ProductStatus.INACTIVE },
    });
    await Promise.all([
      this.redis.delete(`product:detail:${id}`),
      this.redis.deleteByPattern('product:hot:*'),
    ]);
    return product;
  }

  private async ensureExists(id: number): Promise<void> {
    if (!(await this.prisma.product.findUnique({ where: { id }, select: { id: true } }))) {
      throw new NotFoundException('Product not found');
    }
  }
}

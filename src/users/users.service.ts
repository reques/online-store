import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

const safeUserSelect = {
  id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id }, select: safeUserSelect });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  updateMe(id: number, dto: UpdateProfileDto) {
    return this.prisma.user.update({ where: { id }, data: dto, select: safeUserSelect });
  }

  findAll() {
    return this.prisma.user.findMany({ select: safeUserSelect, orderBy: { id: 'desc' } });
  }
}

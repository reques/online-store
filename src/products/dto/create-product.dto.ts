import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @Length(1, 191)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '价格，单位为分' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}

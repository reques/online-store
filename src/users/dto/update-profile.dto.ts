import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: '新昵称' })
  @IsString()
  @Length(1, 100)
  name: string;
}

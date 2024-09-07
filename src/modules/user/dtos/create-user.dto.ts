import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @ApiPropertyOptional()
  name?: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

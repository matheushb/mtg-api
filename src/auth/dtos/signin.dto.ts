import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

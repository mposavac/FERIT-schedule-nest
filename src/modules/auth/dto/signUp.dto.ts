import { IsDefined, IsEmail, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID('4')
  id: string;

  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  password?: string;

  @ApiPropertyOptional()
  @IsDefined()
  @IsString()
  access_token?: string;
}

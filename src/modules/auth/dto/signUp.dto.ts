import { IsDefined, IsEmail, IsString, IsUUID } from 'class-validator';
//import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsDefined()
  @IsUUID('4')
  id: string;

  @IsDefined()
  @IsEmail()
  email: string;

  @IsDefined()
  @IsString()
  password?: string;

  @IsDefined()
  @IsString()
  access_token?: string;
}

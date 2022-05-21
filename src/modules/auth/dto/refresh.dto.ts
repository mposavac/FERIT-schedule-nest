import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  id: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  refresh_token: string;
}

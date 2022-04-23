import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../auth.entity';

export class LoginResponseDto {
  constructor(user: UserEntity) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

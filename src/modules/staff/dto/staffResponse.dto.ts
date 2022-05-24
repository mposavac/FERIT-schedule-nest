import { ApiProperty } from '@nestjs/swagger';

export class StaffResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ime: string;

  @ApiProperty()
  radnoMjesto: string;

  @ApiProperty()
  znanstvenoPodrucje: string;

  @ApiProperty()
  katedra: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  ured: string;
}

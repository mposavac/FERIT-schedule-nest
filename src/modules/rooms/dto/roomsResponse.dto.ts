import { ApiProperty } from '@nestjs/swagger';

class RoomDetails {
  @ApiProperty()
  id: string;

  @ApiProperty()
  covidkap: string;

  @ApiProperty()
  ime: string;

  @ApiProperty()
  kapacitet: string;

  @ApiProperty()
  kvadratura: string;

  @ApiProperty()
  napomena: any;

  @ApiProperty()
  opis: string;

  @ApiProperty()
  tip: string;

  @ApiProperty()
  zaduzenja: any;

  @ApiProperty()
  zanastavu: string;

  @ApiProperty()
  zgrada: string;
}

export class BuildingsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  naziv: string;

  @ApiProperty({ type: RoomDetails })
  prostorije: RoomDetails[];
}

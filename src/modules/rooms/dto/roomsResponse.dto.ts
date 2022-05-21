import { ApiProperty } from '@nestjs/swagger';

class TimeSlots {
  @ApiProperty()
  '@id': string;

  @ApiProperty()
  '@idblok': string;

  @ApiProperty()
  dodatniopis: any;

  @ApiProperty()
  grupastudenata: any;

  @ApiProperty()
  kraj: string;

  @ApiProperty()
  nastavnik: any;

  @ApiProperty()
  odradjeno: string;

  @ApiProperty()
  planirano: string;

  @ApiProperty()
  pocetak: string;

  @ApiProperty()
  predmet: any;

  @ApiProperty()
  prostorija: any;

  @ApiProperty()
  smjer: any;

  @ApiProperty()
  vrstanastave: any;
}

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

export class RoomsResponseDto {
  @ApiProperty()
  date: Date;

  @ApiProperty({ type: TimeSlots })
  timeSlots: TimeSlots[];
}

export class BuildingsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  naziv: string;

  @ApiProperty({ type: RoomDetails })
  prostorije: RoomDetails[];
}

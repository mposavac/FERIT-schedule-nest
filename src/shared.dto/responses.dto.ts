import { ApiProperty } from '@nestjs/swagger';

export class TimeSlots {
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

export class AvailabilityResponseDto {
  @ApiProperty()
  date: Date;

  @ApiProperty({ type: TimeSlots })
  timeSlots: TimeSlots[];
}

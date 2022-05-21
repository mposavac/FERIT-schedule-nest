import { Injectable } from '@nestjs/common';
import raspored from '../../utils/mock.json';
import roomList from '../../utils/roomList.json';
import { unionBy, some } from 'lodash';
import { groupBy } from 'lodash';

@Injectable()
export class RoomsService {
  constructor() {}

  async getRoomAvailability(date: Date, room_id: string) {
    const filteredRooms = [];
    const scheduledSlots = raspored.filter(
      (value) =>
        value.prostorija && value.prostorija['@idprostorije'] === room_id,
    );
    const filteredByIdBlok = unionBy(scheduledSlots, '@idblok');
    filteredByIdBlok.forEach((value: any) => {
      if (
        !some(filteredRooms, {
          nastavnik: value.nastavnik,
          pocetak: value.pocetak,
          kraj: value.kraj,
          predmet: value.predmet,
        })
      )
        filteredRooms.push(value);
    });
    return { date: date, timeSlots: filteredRooms };
  }

  async getBuildings() {
    const filteredForClasses = roomList.prostorije.prostorija.filter(
      (room) => room.zanastavu === '1',
    );
    const grouped_rooms = groupBy(filteredForClasses, 'zgrada');
    console.log(grouped_rooms);
    return [
      {
        id: '1',
        naziv: 'Trpimirova',
        prostorije: grouped_rooms['1'],
      },
      {
        id: '2',
        naziv: 'Kampus',
        prostorije: grouped_rooms['2'],
      },
      {
        id: '3',
        naziv: 'Ostalo',
        prostorije: grouped_rooms['3'],
      },
      {
        id: '4',
        naziv: 'Izvan Zgrade/Dvorane',
        prostorije: grouped_rooms['4'],
      },
      {
        id: '5',
        naziv: 'FAZOS',
        prostorije: grouped_rooms['5'],
      },
      {
        id: '6',
        naziv: 'Vinkovci',
        prostorije: grouped_rooms['6'],
      },
    ];
  }
}

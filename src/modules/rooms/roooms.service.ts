import { Injectable } from '@nestjs/common';
import raspored from '../../utils/mock.json';
import roomList from '../../utils/roomList.json';

@Injectable()
export class RoomsService {
  constructor() {}

  async getRoomAvailability(room_id: string) {
    const rooms = raspored.filter(
      (value) =>
        value.prostorija && value.prostorija['@idprostorije'] === room_id,
    );
    return rooms;
  }

  async getBuildings() {
    //TODO: get it from DB
    return [
      {
        id: '1',
        naziv: 'Trpimirova',
      },
      {
        id: '2',
        naziv: 'Kampus',
      },
      {
        id: '3',
        naziv: 'Ostalo',
      },
      {
        id: '4',
        naziv: 'Izvan Zgrade/Dvorane',
      },
      {
        id: '5',
        naziv: 'FAZOS',
      },
      {
        id: '6',
        naziv: 'Vinkovci',
      },
    ];
  }

  async getRoomsList(building_id: string) {
    const rooms = roomList.prostorije.prostorija.filter(
      (value) => value.zgrada === building_id,
    );
    return rooms;
  }
}

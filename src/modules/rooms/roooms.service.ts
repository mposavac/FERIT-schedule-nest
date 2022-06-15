import { Injectable } from '@nestjs/common';
import roomList from '../../utils/roomList.json';
import { unionBy, some, groupBy } from 'lodash';
import moment from 'moment';
import { checkForJSON } from 'src/utils/checkForJSON';
import { extractFromJSON } from 'src/utils/extractFromJSON';

@Injectable()
export class RoomsService {
  constructor() {}

  async getRoomAvailability(start_date: Date, end_date: Date, room_id: string) {
    await checkForJSON(start_date, end_date);
    const extractedFiles = await extractFromJSON(start_date, end_date);
    return await this.filterByRoom(
      start_date,
      end_date,
      extractedFiles,
      room_id,
    );
  }

  async getBuildings() {
    const filteredForClasses = roomList.prostorije.prostorija.filter(
      (room) => room.zanastavu === '1',
    );
    const grouped_rooms = groupBy(filteredForClasses, 'zgrada');
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

  async filterByRoom(
    start_date: Date,
    end_date: Date,
    extractedFiles: any,
    room_id: string,
  ) {
    const moment_start = moment(start_date);
    const moment_end = moment(end_date);
    const extractedData = [];
    for (let i = 0; i <= moment_end.diff(moment_start, 'days'); i++) {
      const curr_date = moment(start_date).add(i, 'days');
      const curr_date_f = moment(curr_date).format('YYYY-MM-DD');
      try {
        const filteredRooms = [];
        const scheduledSlots = extractedFiles[i].filter(
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
        extractedData.push({ date: curr_date_f, timeSlots: filteredRooms });
      } catch (e) {
        console.log(e);
      }
    }
    return extractedData;
  }
}

import { Injectable } from '@nestjs/common';
import roomList from '../../utils/roomList.json';
import { unionBy, some, groupBy } from 'lodash';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { mkdir, existsSync, readFileSync, writeFileSync, stat } from 'fs';
import moment from 'moment';

@Injectable()
export class RoomsService {
  constructor() {}

  async getRoomAvailability(start_date: Date, end_date: Date, room_id: string) {
    await this.checkForJSON(start_date, end_date);
    return await this.extractFromJSON(start_date, end_date, room_id);
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

  async checkForJSON(start_date: Date, end_date: Date) {
    const dir = __dirname + '/schedule_by_date';
    if (!existsSync(dir))
      mkdir(dir, { recursive: true }, (err) => {
        if (err) console.log(err);
      });

    const moment_start = moment(start_date);
    const moment_end = moment(end_date);
    for (let i = 0; i <= moment_end.diff(moment_start, 'days'); i++) {
      const curr_date = moment(start_date).add(i, 'days');
      const curr_date_f = moment(curr_date).format('YYYY-MM-DD');
      // TODO: Napraviti projveru jeli zadnji put promjenjen prije xy dana
      if (!existsSync(`${dir}/${curr_date_f}.json`)) {
        const raspored = await this.fetchAndParse(curr_date_f);
        writeFileSync(`${dir}/${curr_date_f}.json`, JSON.stringify(raspored));
      }
    }
  }

  async fetchAndParse(date: string) {
    const response = await axios.request({
      method: 'GET',
      url: `https://mrkve.etfos.hr/api/raspored/index.php?date=${date}`,
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    });
    const decoder = new TextDecoder('windows-1250');

    const dataString = decoder.decode(response.data);

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@',
      allowBooleanAttributes: true,
    });
    const data = parser.parse(dataString);
    return data?.raspored?.stavkaRasporeda || [];
  }

  async extractFromJSON(start_date: Date, end_date: Date, room_id: string) {
    const dir = __dirname + '/schedule_by_date';
    const moment_start = moment(start_date);
    const moment_end = moment(end_date);
    const extractedData = [];
    for (let i = 0; i <= moment_end.diff(moment_start, 'days'); i++) {
      const curr_date = moment(start_date).add(i, 'days');
      const curr_date_f = moment(curr_date).format('YYYY-MM-DD');
      try {
        const file = readFileSync(`${dir}/${curr_date_f}.json`, 'utf-8');
        const filteredRooms = await this.filterByRoom(
          curr_date_f,
          JSON.parse(file),
          room_id,
        );
        extractedData.push(filteredRooms);
      } catch (e) {
        console.log(e);
      }
    }

    return extractedData;
  }

  async filterByRoom(curr_date: string, raspored: any, room_id: string) {
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
    return { date: curr_date, timeSlots: filteredRooms };
  }
}

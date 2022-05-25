import { Injectable } from '@nestjs/common';
import raspored from '../../utils/mock.json';
import roomList from '../../utils/roomList.json';
import { some, groupBy } from 'lodash';
import { find, findIndex } from 'lodash';
import moment from 'moment';
import { SchedulerDto } from './dto/scheduler.dto';
import { SchedulerResponseDto } from './dto/schedulerResponse.dto';

@Injectable()
export class SchedulerService {
  async getAvailabileRooms({
    date,
    startTime,
    endTime,
    capacity,
  }: SchedulerDto) {
    const availability: SchedulerResponseDto[] = [];
    const capacityFiltered = roomList.prostorije.prostorija.filter(
      (value) =>
        value.zanastavu === '1' && parseInt(value.kapacitet) >= capacity,
    );

    capacityFiltered.forEach((value) => {
      availability.push({
        id: value['-id'],
        name: value.ime,
        isAvailable: true,
        date: date,
      });
    });

    const unavailableSlots = [];
    raspored
      .filter((value) =>
        find(capacityFiltered, { '-id': value.prostorija['@idprostorije'] }),
      )
      .forEach((value: any) => {
        if (
          !some(unavailableSlots, {
            nastavnik: value.nastavnik,
            pocetak: value.pocetak,
            kraj: value.kraj,
            predmet: value.predmet,
          })
        )
          unavailableSlots.push(value);
      });

    const groupedUnavailableSlots = groupBy(
      unavailableSlots,
      'prostorija["@idprostorije"]',
    );

    for (const key in groupedUnavailableSlots) {
      const scheduleClasses = [];
      let isAvailable = true;
      groupedUnavailableSlots[key].forEach((value) => {
        if (
          moment(value?.kraj, 'HH:mm').isAfter(moment(startTime, 'HH:mm')) &&
          moment(value?.pocetak, 'HH:mm').isBefore(moment(endTime, 'HH:mm'))
        )
          isAvailable = false;
        scheduleClasses.push(value);
      });
      const index = findIndex(availability, { id: key });
      if (index !== -1) {
        availability[index].isAvailable = isAvailable;
        availability[index].unavailableSlots = scheduleClasses;
      }
    }
    return availability
      .filter((value) => value.isAvailable)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}

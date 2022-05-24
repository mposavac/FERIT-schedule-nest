import { unionBy, some } from 'lodash';
import { Injectable } from '@nestjs/common';
import raspored from '../../utils/mock.json';
import staff from '../../utils/staff.json';

@Injectable()
export class StaffService {
  constructor() {}

  async getAvailability(date: Date, mat_broj: string) {
    const filteredRooms = [];
    const scheduledSlots = raspored.filter(
      (value) => value.nastavnik && value.nastavnik['@mat_broj'] === mat_broj,
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

  async getStaffList() {
    const staffMembers = staff.djelatnici.djelatnik.map((staff: any) => ({
      id: staff['-id'],
      ime: staff.imed + ' ' + staff.prezimed,
      radnoMjesto: staff.radnomjesto['#text'],
      znanstvenoPodrucje: staff.znanstveno_podrucje_polje,
      katedra: staff.katedranaziv,
      email: staff.email,
      ured: staff.ured['#text'],
    }));
    return staffMembers;
  }
}

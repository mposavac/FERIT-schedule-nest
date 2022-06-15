import { unionBy, some } from 'lodash';
import { Injectable } from '@nestjs/common';
import staff from '../../utils/staff.json';
import { checkForJSON } from 'src/utils/checkForJSON';
import { extractFromJSON } from 'src/utils/extractFromJSON';
import moment from 'moment';

@Injectable()
export class StaffService {
  constructor() {}

  async getAvailability(start_date: Date, end_date: Date, mat_broj: string) {
    await checkForJSON(start_date, end_date);
    const extractedFiles = await extractFromJSON(start_date, end_date);
    return await this.filterByStaff(
      start_date,
      end_date,
      extractedFiles,
      mat_broj,
    );
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

  async filterByStaff(
    start_date: Date,
    end_date: Date,
    extractedFiles: any,
    mat_broj: string,
  ) {
    const moment_start = moment(start_date);
    const moment_end = moment(end_date);
    const extractedData = [];
    for (let i = 0; i <= moment_end.diff(moment_start, 'days'); i++) {
      const curr_date = moment(start_date).add(i, 'days');
      const curr_date_f = moment(curr_date).format('YYYY-MM-DD');
      const filteredRooms = [];
      const scheduledSlots = extractedFiles[i].filter(
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
      extractedData.push({ date: curr_date_f, timeSlots: filteredRooms });
    }

    return extractedData;
  }
}

import { Injectable } from '@nestjs/common';
import raspored from '../../utils/mock.json';
import staff from '../../utils/staff.json';

@Injectable()
export class StaffService {
  constructor() {}

  async getAvailability(mat_broj: string) {
    const availability = raspored.filter(
      (value) => value.nastavnik && value.nastavnik['@mat_broj'] === mat_broj,
    );
    return availability;
  }

  async getStaffList() {
    return staff.djelatnici.djelatnik;
  }
}

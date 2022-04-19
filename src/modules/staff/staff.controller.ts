import { Controller, Get, Param } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('availability/:mat_broj')
  getAvailabilty(@Param('mat_broj') mat_broj) {
    return this.staffService.getAvailability(mat_broj);
  }

  @Get('list')
  getStaffList() {
    return this.staffService.getStaffList();
  }
}

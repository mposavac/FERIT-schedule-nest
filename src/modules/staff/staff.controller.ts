import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { StaffService } from './staff.service';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('availability/:mat_broj')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    //TODO: add type: GetStaffAvailabilty
  })
  getAvailabilty(@Param('mat_broj') mat_broj) {
    return this.staffService.getAvailability(mat_broj);
  }

  @Get('list')
  @ApiOkResponse({
    description: 'OK.',
    //TODO: add type: GetStaffList
  })
  getStaffList() {
    return this.staffService.getStaffList();
  }
}

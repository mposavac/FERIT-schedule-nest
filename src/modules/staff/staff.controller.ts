import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AvailabilityResponseDto } from 'src/shared.dto/responses.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StaffResponseDto } from './dto/staffResponse.dto';
import { StaffService } from './staff.service';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @UseGuards(JwtAuthGuard)
  @Get('availability/:start_date/:end_date/:mat_broj')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    type: AvailabilityResponseDto,
  })
  @ApiParam({ name: 'start_date', required: true, type: 'date' })
  @ApiParam({ name: 'end_date', required: true, type: 'date' })
  @ApiParam({ name: 'mat_broj', required: true, type: 'string' })
  getAvailabilty(
    @Param('start_date') start_date: Date,
    @Param('end_date') end_date: Date,
    @Param('mat_broj') mat_broj: string,
  ): Promise<AvailabilityResponseDto[]> {
    return this.staffService.getAvailability(start_date, end_date, mat_broj);
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    type: StaffResponseDto,
  })
  getStaffList(): Promise<StaffResponseDto[]> {
    return this.staffService.getStaffList();
  }
}

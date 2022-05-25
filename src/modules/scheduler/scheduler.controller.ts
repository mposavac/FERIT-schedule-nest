import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SchedulerService } from './scheduler.service';
import { SchedulerDto } from './dto/scheduler.dto';
import { SchedulerResponseDto } from './dto/schedulerResponse.dto';

@ApiTags('Scheduler')
@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('availability')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    type: SchedulerResponseDto,
  })
  getRoom(@Body() payload: SchedulerDto): Promise<SchedulerResponseDto[]> {
    return this.schedulerService.getAvailabileRooms(payload);
  }
}

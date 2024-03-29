import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BuildingsResponseDto } from './dto/roomsResponse.dto';
import { AvailabilityResponseDto } from '../../shared.dto/responses.dto';
import { RoomsService } from './roooms.service';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('availability/:start_date/:end_date/:id')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    type: AvailabilityResponseDto,
  })
  @ApiParam({ name: 'start_date', required: true, type: 'date' })
  @ApiParam({ name: 'end_date', required: true, type: 'date' })
  @ApiParam({ name: 'id', required: true, type: 'string' })
  getRoom(
    @Param('start_date') start_date: Date,
    @Param('end_date') end_date: Date,
    @Param('id') room_id: string,
  ): Promise<AvailabilityResponseDto[]> {
    return this.roomsService.getRoomAvailability(start_date, end_date, room_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('buildings')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    type: BuildingsResponseDto,
  })
  getBuildings(): Promise<BuildingsResponseDto[]> {
    return this.roomsService.getBuildings();
  }
}

import { Controller, Get, Param } from '@nestjs/common';
import { RoomsService } from './roooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('availability/:id')
  getRoom(@Param('id') room_id) {
    return this.roomsService.getRoomAvailability(room_id);
  }

  @Get('buildings')
  getBuildings() {
    return this.roomsService.getBuildings();
  }

  @Get('list/:id')
  getRooms(@Param('id') building_id) {
    return this.roomsService.getRoomsList(building_id);
  }
}

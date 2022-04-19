import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoomsService } from './roooms.service';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('availability/:id')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    //TODO: add type: GetRoomDto
  })
  getRoom(@Param('id') room_id) {
    return this.roomsService.getRoomAvailability(room_id);
  }

  @Get('buildings')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    //TODO: add type: GetRoomDto
  })
  getBuildings() {
    return this.roomsService.getBuildings();
  }

  @Get('list/:id')
  @ApiOkResponse({
    description: 'OK.',
    isArray: true,
    //TODO: add type: GetRoomDto
  })
  getRooms(@Param('id') building_id) {
    return this.roomsService.getRoomsList(building_id);
  }
}

import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './roooms.service';

@Module({
  imports: [],
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}

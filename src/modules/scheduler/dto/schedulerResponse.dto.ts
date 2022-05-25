import { ApiProperty } from '@nestjs/swagger';
import { TimeSlots } from 'src/shared.dto/responses.dto';

export class SchedulerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isAvailable: boolean;

  @ApiProperty()
  date: Date;

  @ApiProperty({ type: TimeSlots })
  unavailableSlots?: TimeSlots[];
}

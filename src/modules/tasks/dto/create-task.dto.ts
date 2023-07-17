import { ApiProperty } from '@nestjs/swagger';
import { STATUS } from '../../../shared/constants/status';

export class CreateTaskDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    example: '2023-07-17',
    examples: ['2023-07-17', '17/07/2023'],
  })
  endDate: string;

  @ApiProperty({
    example: STATUS.PENDING,
    examples: [STATUS.PENDING, STATUS.DOING, STATUS.DONE],
  })
  status: string;
}

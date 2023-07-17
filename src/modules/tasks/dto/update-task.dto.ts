import { ApiProperty } from '@nestjs/swagger';
import { STATUS } from '../../../shared/constants/status';

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({
    required: false,
    example: '2023-07-17',
    examples: ['2023-07-17', '17/07/2023'],
  })
  endDate: string;

  @ApiProperty({
    required: false,
    example: STATUS.PENDING,
    examples: [STATUS.PENDING, STATUS.DOING, STATUS.DONE],
  })
  status: string;
}

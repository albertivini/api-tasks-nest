import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  endDate: string;

  @ApiProperty({ required: false })
  status: string;
}

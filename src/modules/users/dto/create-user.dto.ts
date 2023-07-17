import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  username: string;

  @ApiProperty({
    example: 'email@mail.com',
  })
  email: string;

  @ApiProperty()
  password: string;
}

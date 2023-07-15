import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validateSchema } from 'src/shared/utils/validateSchema';
import { createUserSchema } from './schemas/createUserSchema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const body = validateSchema<CreateUserDto>(
        createUserDto,
        createUserSchema,
      );
      await this.usersService.create(body);
    } catch (err) {
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

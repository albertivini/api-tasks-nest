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
import { validateSchema } from '../../shared/utils/validateSchema';
import { createUserSchema } from './schemas/createUserSchema';
import { LoginDto } from './dto/login.dto';
import { loginSchema } from './schemas/loginSchema';

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
      console.error('Create User Error:', err);
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  @HttpCode(201)
  async login(@Body() loginDto: LoginDto) {
    try {
      const body = validateSchema<LoginDto>(loginDto, loginSchema);
      const token = await this.usersService.login(body);
      return { token };
    } catch (err) {
      console.error('Login Error:', err);
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

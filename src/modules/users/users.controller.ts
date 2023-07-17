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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERROR_MESSAGES } from 'src/shared/constants/errorMessages';
import { SWAGGER_SCHEMA_EXAMPLES } from 'src/shared/constants/swaggerExamples';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiBadRequestResponse({
    description: `${ERROR_MESSAGES.EMAIL_ALREADY_IN_USE} | ${ERROR_MESSAGES.USERNAME_ALREADY_IN_USE}`,
  })
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

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({
    description: 'Success',
    schema: {
      example: SWAGGER_SCHEMA_EXAMPLES.login,
    },
  })
  @ApiUnauthorizedResponse({
    description: ERROR_MESSAGES.INCORRECT_USER_OR_PASSWORD,
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      const body = validateSchema<LoginDto>(loginDto, loginSchema);
      const token = await this.usersService.login(body);
      return { token };
    } catch (err) {
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}

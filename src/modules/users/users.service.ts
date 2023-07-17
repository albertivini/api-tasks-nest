import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './interfaces/usersRepository';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { compareHash } from '../../shared/utils/password';
import { TOKEN_SECRET } from '../../shared/constants/tokenSecret';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    const usernameExists = await this.usersRepository.findByUsername(
      createUserDto.username,
    );

    if (usernameExists) throw new Error(ERROR_MESSAGES.USERNAME_ALREADY_IN_USE);

    const emailExists = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (emailExists) throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_IN_USE);

    const user = new User(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );

    await this.usersRepository.create(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByUsername(loginDto.username);

    if (!user) throw new Error(ERROR_MESSAGES.INCORRECT_USER_OR_PASSWORD);

    const comparePassword = compareHash(loginDto.password, user.password);

    if (!comparePassword)
      throw new Error(ERROR_MESSAGES.INCORRECT_USER_OR_PASSWORD);

    const token = sign(
      {
        email: user.email,
      },
      TOKEN_SECRET,
      {
        subject: user.id,
        expiresIn: '1h',
      },
    );

    return token;
  }
}

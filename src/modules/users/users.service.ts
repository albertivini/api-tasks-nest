import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './interfaces/usersRepository';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { compareHash } from '../../shared/utils/password';
import { TOKEN_SECRET } from '../../shared/constants/tokenSecret';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create(createUserDto: CreateUserDto) {
    const user = new User(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
    );

    await this.usersRepository.create(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByUsername(loginDto.username);

    if (!user) throw new Error('Incorrect user or password');

    const comparePassword = compareHash(loginDto.password, user.password);

    if (!comparePassword) throw new Error('Incorrect user or password');
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

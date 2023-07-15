import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './interfaces/usersRepository';
import { User } from './entities/user.entity';

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
}

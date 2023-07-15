import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersRepository } from './interfaces/usersRepository';
import { User } from './entities/user.entity';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }
  findByUsername(username: string): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async create(payload: User): Promise<void> {
    const { username, email, password } = payload;

    await this.prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
  }
}

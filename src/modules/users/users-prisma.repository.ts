import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './interfaces/usersRepository';
import { User } from './entities/user.entity';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
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

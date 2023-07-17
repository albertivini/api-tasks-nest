import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UsersRepository } from '../interfaces/usersRepository';
import { User } from '../entities/user.entity';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

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

  async findByEmail(email: string): Promise<User> {
    const response = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return response;
  }

  async findByUsername(username: string): Promise<User> {
    const response = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return response;
  }
}

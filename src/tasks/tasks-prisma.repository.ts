import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  async create(payload: Task): Promise<void> {
    const { description, endDate, status, title } = payload;

    await this.prisma.task.create({
      data: {
        description,
        endDate,
        status,
        title,
      },
    });
  }
}

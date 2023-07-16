import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }
  findTaskById(id: string): Promise<Task> {
    throw new Error('Method not implemented.');
  }
  updateTask(id: string, payload: Task): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteTask(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAllByUserId(userId: string): Promise<Task[]> {
    throw new Error('Method not implemented.');
  }

  async create(payload: Task, userId: string): Promise<void> {
    const { description, endDate, status, title } = payload;

    await this.prisma.task.create({
      data: {
        description,
        endDate,
        status,
        title,
        userId,
      },
    });
  }
}

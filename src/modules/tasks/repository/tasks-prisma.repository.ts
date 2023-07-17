import { Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { TasksRepository } from '../interfaces/TasksRepository';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private prisma: PrismaService) {}
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

  async findAllByUserId(userId: string): Promise<Task[]> {
    const response = await this.prisma.task.findMany({
      where: {
        userId,
      },
    });

    return response;
  }

  async findAllByUserIdAndStatus(userId: string, status: any): Promise<Task[]> {
    const response = await this.prisma.task.findMany({
      where: {
        userId,
        status,
      },
    });

    return response;
  }

  async findTaskById(id: string): Promise<Task> {
    const response = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    return response;
  }
  async updateTask(id: string, payload: Task): Promise<void> {
    const { title, description, endDate, status } = payload;

    await this.prisma.task.update({
      where: {
        id,
      },
      data: {
        title: title ? title : undefined,
        description: description ? description : undefined,
        endDate: endDate ? endDate : undefined,
        status: status ? status : undefined,
      },
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.prisma.task.delete({
      where: {
        id,
      },
    });
  }
}

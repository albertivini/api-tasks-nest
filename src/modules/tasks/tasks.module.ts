import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './interfaces/tasksRepository';
import { PrismaTasksRepository } from './repository/tasks-prisma.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
    PrismaService,
  ],
})
export class TasksModule {}

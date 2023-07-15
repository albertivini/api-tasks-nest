import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaTasksRepository } from './tasks-prisma.repository';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: TasksRepository,
      useClass: PrismaTasksRepository,
    },
  ],
})
export class TasksModule {}

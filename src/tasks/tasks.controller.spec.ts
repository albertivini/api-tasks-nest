import sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaTasksRepository } from './tasks-prisma.repository';
import { CreateTaskDto } from './dto/create-task.dto';

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useClass: PrismaTasksRepository,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    sinon.restore();
  });

  it('should create a task', async () => {
    sinon.stub(TasksService.prototype, 'create').resolves();
    const createTask = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    expect(await controller.create(createTask)).toBeUndefined();
  });

  it('should not be able to create a task', async () => {
    sinon.stub(TasksService.prototype, 'create').resolves();
    const createTask = {
      title: 'task title',
      description: 'task description',
      status: 'PENDING',
    };

    try {
      await controller.create(createTask as unknown as CreateTaskDto);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should not be able to create a task with generic service error', async () => {
    sinon
      .stub(TasksService.prototype, 'create')
      .throws({ error: '001', message: 'error' });

    const createTask = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    try {
      await controller.create(createTask as unknown as CreateTaskDto);
    } catch (err) {
      expect(err.status).toBe(500);
    }
  });
});

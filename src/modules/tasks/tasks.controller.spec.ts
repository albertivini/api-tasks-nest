import sinon from 'sinon';
import { Request } from 'express';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaTasksRepository } from './repository/tasks-prisma.repository';
import { Task } from './entities/task.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

const task: Task = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  endDate: '2023-07-16',
  status: 'PENDING',
};

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
        PrismaService,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    sinon.restore();
  });

  it('should create a task', async () => {
    sinon.stub(TasksService.prototype, 'create').resolves();

    const request = {
      userId: 'user',
    } as unknown as Request;

    const body = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    expect(await controller.create(request, body)).toBeUndefined();
  });

  it('should not be able to create a task', async () => {
    sinon.stub(TasksService.prototype, 'create').resolves();
    const request = {
      userId: 'user',
    } as unknown as Request;

    const body = {
      title: 'task title',
      description: 'task description',
      status: 'PENDING',
    } as unknown as CreateTaskDto;

    try {
      await controller.create(request, body);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should not be able to create a task with generic service error', async () => {
    sinon
      .stub(TasksService.prototype, 'create')
      .throws({ error: '001', message: 'error' });

    const request = {
      userId: 'user',
    } as unknown as Request;

    const body = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    try {
      await controller.create(request, body);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should get all tasks from an user', async () => {
    sinon
      .stub(TasksService.prototype, 'findAllByUserId')
      .resolves([task, task]);

    const request = {
      userId: 'userId',
    } as unknown as Request;

    expect((await controller.findAll(request)).length).toBe(2);
  });

  it('should get all tasks from an user with query param', async () => {
    sinon
      .stub(TasksService.prototype, 'findAllByUserId')
      .resolves([task, task]);

    const request = {
      userId: 'userId',
    } as unknown as Request;

    const query = {
      status: 'PENDING',
    };

    expect((await controller.findAll(request, query.status)).length).toBe(2);
  });

  it('should not get all tasks from an user with query param because status query is wrong', async () => {
    sinon
      .stub(TasksService.prototype, 'findAllByUserId')
      .resolves([task, task]);

    const request = {
      userId: 'userId',
      query: {
        status: 'OTHER',
      },
    } as unknown as Request;

    try {
      await controller.findAll(request);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should not get all tasks from an user with service generic error', async () => {
    sinon
      .stub(TasksService.prototype, 'findAllByUserId')
      .throws({ message: 'error' });

    const request = {
      userId: 'userId',
    } as unknown as Request;

    try {
      await controller.findAll(request);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should update a task from an user', async () => {
    sinon.stub(TasksService.prototype, 'update').resolves();

    const request = {
      userId: 'userId',
    } as unknown as Request;

    const params = {
      taskId: 'taskId',
    };
    const body = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    expect(
      await controller.update(request, body, params.taskId),
    ).toBeUndefined();
  });

  it('should not update a task from an user with service generic error', async () => {
    sinon.stub(TasksService.prototype, 'update').throws({ message: 'error' });

    const request = {
      userId: 'userId',
    } as unknown as Request;

    const params = {
      taskId: 'taskId',
    };

    const body = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    try {
      await controller.update(request, body, params.taskId);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should delete a task from an user', async () => {
    sinon.stub(TasksService.prototype, 'remove').resolves();

    const request = {
      userId: 'userId',
    } as unknown as Request;

    const params = {
      taskId: 'taskId',
    };

    expect(await controller.remove(request, params.taskId)).toBeUndefined();
  });

  it('should not delete a task from an user with service generic error', async () => {
    sinon.stub(TasksService.prototype, 'remove').throws({ message: 'error' });

    const request = {
      userId: 'userId',
    } as unknown as Request;

    const params = {
      taskId: 'taskId',
    };

    try {
      await controller.remove(request, params.taskId);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});

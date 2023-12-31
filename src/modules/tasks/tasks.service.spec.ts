import sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaTasksRepository } from './repository/tasks-prisma.repository';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

const task: Task = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  description: 'description',
  endDate: '2023-07-16',
  status: 'PENDING',
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useClass: PrismaTasksRepository,
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    sinon.restore();
  });

  it('should create a task', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'create').resolves();

    const createTask = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    expect(await service.create(createTask, 'userId')).toBeUndefined();
  });

  it('should find all tasks from an user', async () => {
    sinon
      .stub(PrismaTasksRepository.prototype, 'findAllByUserId')
      .resolves([task, task]);

    expect((await service.findAllByUserId('userId')).length).toBe(2);
  });

  it('should find all tasks from an user with status query param', async () => {
    sinon
      .stub(PrismaTasksRepository.prototype, 'findAllByUserIdAndStatus')
      .resolves([task, task]);

    expect((await service.findAllByUserId('userId', 'PENDING')).length).toBe(2);
  });

  it('should update a task from an user', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'findTaskById').resolves(task);
    sinon.stub(PrismaTasksRepository.prototype, 'updateTask').resolves();

    const updateTask: UpdateTaskDto = {
      title: 'title',
      description: 'description',
      endDate: '2023-07-16',
      status: 'DONE',
    };

    expect(
      await service.update('taskId', 'userId', updateTask),
    ).toBeUndefined();
  });

  it('should not update a task from an user because task does not exists', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'findTaskById').resolves();

    const updateTask: UpdateTaskDto = {
      title: 'title',
      description: 'description',
      endDate: '2023-07-16',
      status: 'DONE',
    };

    try {
      await service.update('taskId', 'userId', updateTask);
    } catch (err) {
      expect(err.message).toBe(ERROR_MESSAGES.TASK_DOES_NOT_EXISTS);
    }
  });

  it('should not update a task from an user because task does not belong to user', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'findTaskById').resolves(task);

    const updateTask: UpdateTaskDto = {
      title: 'title',
      description: 'description',
      endDate: '2023-07-16',
      status: 'DONE',
    };

    try {
      await service.update('taskId', 'wrongUser', updateTask);
    } catch (err) {
      expect(err.message).toBe(ERROR_MESSAGES.TASK_DOES_NOT_BELONGS_USER);
    }
  });

  it('should delete a task from an user', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'findTaskById').resolves(task);
    sinon.stub(PrismaTasksRepository.prototype, 'deleteTask').resolves();

    expect(await service.remove('taskId', 'userId')).toBeUndefined();
  });

  it('should not delete a task from an user because task does not exists', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'findTaskById').resolves();

    try {
      await service.remove('taskId', 'userId');
    } catch (err) {
      expect(err.message).toBe(ERROR_MESSAGES.TASK_DOES_NOT_EXISTS);
    }
  });

  it('should not delete a task from an user because task does not belong to user', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'findTaskById').resolves(task);

    try {
      await service.remove('taskId', 'wrongUser');
    } catch (err) {
      expect(err.message).toBe(ERROR_MESSAGES.TASK_DOES_NOT_BELONGS_USER);
    }
  });
});

import sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './interfaces/TasksRepository';
import { PrismaTasksRepository } from './tasks-prisma.repository';

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
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    sinon.restore();
  });

  it('should be defined', async () => {
    sinon.stub(PrismaTasksRepository.prototype, 'create').resolves();

    const createTask = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-08-23',
      status: 'PENDING',
    };

    expect(await service.create(createTask)).toBeUndefined();
  });
});

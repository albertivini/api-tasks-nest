import sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './interfaces/usersRepository';
import { PrismaUsersRepository } from './users-prisma.repository';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: PrismaUsersRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    sinon.restore();
  });

  it('should create a user', async () => {
    sinon.stub(UsersService.prototype, 'create').resolves();

    const createUser = {
      username: 'username',
      email: 'email@mail.com',
      password: 'password',
    };
    expect(await controller.create(createUser)).toBeUndefined();
  });

  it('should not create a user', async () => {
    sinon.stub(UsersService.prototype, 'create').resolves();

    const createUser = {
      username: 'username',
      email: 'email',
      password: 'password',
    };
    try {
      await controller.create(createUser);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });

  it('should not create a user with generic service error', async () => {
    sinon
      .stub(UsersService.prototype, 'create')
      .throws({ error: '001', message: 'error' });

    const createUser = {
      username: 'username',
      email: 'email',
      password: 'password',
    };
    try {
      await controller.create(createUser);
    } catch (err) {
      expect(err.status).toBe(400);
    }
  });
});

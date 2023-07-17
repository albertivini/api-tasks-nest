import sinon from 'sinon';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './interfaces/usersRepository';
import { PrismaUsersRepository } from './repository/users-prisma.repository';
import { LoginDto } from './dto/login.dto';
import * as compareHash from '../../shared/utils/password';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: PrismaUsersRepository,
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    sinon.restore();
  });

  it('should create an user', async () => {
    sinon.stub(PrismaUsersRepository.prototype, 'create').resolves();
    sinon.stub(PrismaUsersRepository.prototype, 'findByUsername').resolves();
    sinon.stub(PrismaUsersRepository.prototype, 'findByEmail').resolves();

    const createUser: CreateUserDto = {
      username: 'username',
      email: 'email@mail.com',
      password: 'password',
    };

    expect(await service.create(createUser)).toBeUndefined();
  });

  it('should not create an user because username already exists', async () => {
    sinon.stub(PrismaUsersRepository.prototype, 'create').resolves();
    sinon.stub(PrismaUsersRepository.prototype, 'findByUsername').resolves({
      id: 'id',
      username: 'username',
      email: 'email@email.com',
      password: 'password',
    });
    sinon.stub(PrismaUsersRepository.prototype, 'findByEmail').resolves();

    const createUser: CreateUserDto = {
      username: 'username',
      email: 'email@mail.com',
      password: 'password',
    };

    try {
      await service.create(createUser);
    } catch (err) {
      expect(err.message).toBe('Username is already in use');
    }
  });

  it('should not create an user because email already exists', async () => {
    sinon.stub(PrismaUsersRepository.prototype, 'create').resolves();
    sinon.stub(PrismaUsersRepository.prototype, 'findByUsername').resolves();
    sinon.stub(PrismaUsersRepository.prototype, 'findByEmail').resolves({
      id: 'id',
      username: 'username',
      email: 'email@email.com',
      password: 'password',
    });

    const createUser: CreateUserDto = {
      username: 'username',
      email: 'email@mail.com',
      password: 'password',
    };

    try {
      await service.create(createUser);
    } catch (err) {
      expect(err.message).toBe('Email is already in use');
    }
  });

  it('should login an user', async () => {
    sinon.stub(PrismaUsersRepository.prototype, 'findByUsername').resolves({
      id: 'id',
      username: 'username',
      email: 'email@email.com',
      password: 'password',
    });
    sinon.stub(compareHash, 'compareHash').returns(true);

    const loginUser: LoginDto = {
      username: 'username',
      password: 'password',
    };

    const response = await service.login(loginUser);

    expect(typeof response).toBe('string');
  });

  it('should not login an user does not exists', async () => {
    sinon.stub(PrismaUsersRepository.prototype, 'findByUsername').resolves();
    sinon.stub(compareHash, 'compareHash').returns(true);

    const loginUser: LoginDto = {
      username: 'username',
      password: 'password',
    };

    try {
      await service.login(loginUser);
    } catch (err) {
      expect(err.message).toBe('Incorrect user or password');
    }
  });

  it('should not login an user does not exists', async () => {
    sinon.stub(PrismaUsersRepository.prototype, 'findByUsername').resolves({
      id: 'id',
      username: 'username',
      email: 'email@email.com',
      password: 'password',
    });
    sinon.stub(compareHash, 'compareHash').returns(false);

    const loginUser: LoginDto = {
      username: 'username',
      password: 'password',
    };

    try {
      await service.login(loginUser);
    } catch (err) {
      expect(err.message).toBe('Incorrect user or password');
    }
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

let token: string;
let taskId: string;

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST Create user)', async () => {
    const body = {
      username: 'test',
      email: 'email@mail.com',
      password: 'password',
    };

    return request(app.getHttpServer()).post('/users').send(body).expect(201);
  });

  it('/login (POST Login)', async () => {
    const body = {
      username: 'test',
      password: 'password',
    };

    const response = request(app.getHttpServer())
      .post('/users/login')
      .send(body);

    token = (await response).body.token;

    return response.expect(200);
  });

  it('/tasks (POST Task)', async () => {
    const body = {
      title: 'task title',
      description: 'task description',
      endDate: '2023-07-20',
      status: 'PENDING',
    };

    const response = request(app.getHttpServer())
      .post('/tasks')
      .send(body)
      .set({ Authorization: `Bearer ${token}` });

    return response.expect(201);
  });

  it('/tasks (GET All Tasks)', async () => {
    const response = request(app.getHttpServer())
      .get('/tasks')
      .set({ Authorization: `Bearer ${token}` });

    taskId = (await response).body[0].id;

    expect((await response).statusCode).toBe(200);
  });

  it('/tasks (PUT Task)', async () => {
    const body = {
      status: 'DONE',
    };

    const response = request(app.getHttpServer())
      .put(`/tasks/${taskId}`)
      .send(body)
      .set({ Authorization: `Bearer ${token}` });

    expect((await response).statusCode).toBe(204);
  });

  it('/tasks (DELETE Task)', async () => {
    const response = request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set({ Authorization: `Bearer ${token}` });

    expect((await response).statusCode).toBe(200);
  });
});

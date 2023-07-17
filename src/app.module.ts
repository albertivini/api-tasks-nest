import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { LoginMiddleware } from './middlewares/login.middleware';
import { TasksController } from './modules/tasks/tasks.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [TasksModule, UsersModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoginMiddleware).forRoutes(TasksController);
  }
}

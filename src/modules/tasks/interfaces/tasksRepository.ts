import { Task } from '../entities/task.entity';

export abstract class TasksRepository {
  abstract create(payload: Task, userId: string): Promise<void>;
}

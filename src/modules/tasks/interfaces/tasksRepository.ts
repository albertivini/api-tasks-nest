import { Task } from '../entities/task.entity';

export abstract class TasksRepository {
  abstract create(payload: Task, userId: string): Promise<void>;
  abstract findAllByUserId(userId: string): Promise<Task[]>;
  abstract findTaskById(id: string): Promise<Task>;
  abstract updateTask(id: string, payload: Task): Promise<void>;
  abstract deleteTask(id: string): Promise<void>;
  abstract findAllByUserIdAndStatus(userId: string, status): Promise<Task[]>;
}

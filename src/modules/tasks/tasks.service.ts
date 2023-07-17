import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksRepository } from './interfaces/TasksRepository';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const task = new Task(
      createTaskDto.title,
      createTaskDto.description,
      createTaskDto.endDate,
      createTaskDto.status,
    );

    await this.tasksRepository.create(task, userId);
  }

  async findAllByUserId(userId: string, status?: string) {
    if (status) {
      const tasks = await this.tasksRepository.findAllByUserIdAndStatus(
        userId,
        status,
      );

      return tasks;
    }

    const tasks = await this.tasksRepository.findAllByUserId(userId);

    return tasks;
  }

  async update(taskId: string, userId: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepository.findTaskById(taskId);

    if (!task) throw new Error('Task does not exists');

    if (task.userId !== userId)
      throw new Error('This task does not belong to this user');

    const updateTask = new Task(
      updateTaskDto.title,
      updateTaskDto.description,
      updateTaskDto.endDate,
      updateTaskDto.status,
    );

    await this.tasksRepository.updateTask(taskId, updateTask);
  }

  async remove(taskId: string, userId: string) {
    const task = await this.tasksRepository.findTaskById(taskId);

    if (task.userId !== userId)
      throw new Error('This task does not belong to this user');

    await this.tasksRepository.deleteTask(taskId);
  }
}

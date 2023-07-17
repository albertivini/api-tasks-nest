import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { validateSchema } from '../../shared/utils/validateSchema';
import { createTaskSchema } from './schemas/createTaskSchema';
import { updateTaskSchema } from './schemas/updateTaskSchema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { findAllByUserIdSchema } from './schemas/findAllByUserIdSchema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(201)
  async create(@Req() request: Request) {
    try {
      const { userId } = request;

      const createTaskDto = request.body;
      const body = validateSchema<CreateTaskDto>(
        createTaskDto,
        createTaskSchema,
      );
      await this.tasksService.create(body, userId);
    } catch (err) {
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @HttpCode(200)
  async findAll(@Req() request: Request) {
    try {
      const { userId } = request;
      const { query } = request;

      const validatedQuery = validateSchema<{ status?: string }>(
        query,
        findAllByUserIdSchema,
      );

      const queryStatus = validatedQuery.status
        ? validatedQuery.status
        : undefined;

      const response = await this.tasksService.findAllByUserId(
        userId,
        queryStatus,
      );
      return response;
    } catch (err) {
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':taskId')
  @HttpCode(204)
  async update(@Req() request: Request) {
    try {
      const { userId, params, body } = request;

      const { taskId } = params;

      const updateTaskDto = validateSchema<UpdateTaskDto>(
        body,
        updateTaskSchema,
      );

      await this.tasksService.update(taskId, userId, updateTaskDto);
    } catch (err) {
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':taskId')
  @HttpCode(200)
  async remove(@Req() request: Request) {
    try {
      const { userId, params } = request;

      const { taskId } = params;

      await this.tasksService.remove(taskId, userId);
    } catch (err) {
      throw new HttpException(
        {
          error: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

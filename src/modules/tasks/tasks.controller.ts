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
      const response = await this.tasksService.findAllByUserId(userId);
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

      const { id } = params;

      const updateTaskDto = validateSchema<UpdateTaskDto>(
        body,
        updateTaskSchema,
      );

      await this.tasksService.update(id, userId, updateTaskDto);
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
  @HttpCode(204)
  async remove(@Req() request: Request) {
    try {
      const { userId, params } = request;

      const { id } = params;

      await this.tasksService.remove(id, userId);
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

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
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { validateSchema } from '../../shared/utils/validateSchema';
import { createTaskSchema } from './schemas/createTaskSchema';
import { updateTaskSchema } from './schemas/updateTaskSchema';
import { UpdateTaskDto } from './dto/update-task.dto';
import { findAllByUserIdSchema } from './schemas/findAllByUserIdSchema';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SWAGGER_SCHEMA_EXAMPLES } from '../../shared/constants/swaggerExamples';
import { ERROR_MESSAGES } from '../../shared/constants/errorMessages';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'Success',
  })
  @ApiBadRequestResponse()
  async create(@Req() request: Request, @Body() createTaskDto: CreateTaskDto) {
    try {
      const { userId } = request;

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
  @ApiOkResponse({
    description: 'Success',
    schema: {
      example: [SWAGGER_SCHEMA_EXAMPLES.postTask],
    },
  })
  @ApiBadRequestResponse()
  async findAll(@Req() request: Request, @Query('status') status?: string) {
    try {
      const { userId } = request;

      const validatedQuery = validateSchema<{ status?: string }>(
        { status },
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
  @ApiNoContentResponse({
    description: 'Success',
  })
  @ApiBadRequestResponse({
    description: `${ERROR_MESSAGES.TASK_DOES_NOT_EXISTS} | ${ERROR_MESSAGES.TASK_DOES_NOT_BELONGS_USER}`,
  })
  async update(
    @Req() request: Request,
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('taskId') taskId: string,
  ) {
    try {
      const { userId } = request;

      const body = validateSchema<UpdateTaskDto>(
        updateTaskDto,
        updateTaskSchema,
      );

      await this.tasksService.update(taskId, userId, body);
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
  @ApiOkResponse({
    description: 'Success',
  })
  @ApiBadRequestResponse({
    description: `${ERROR_MESSAGES.TASK_DOES_NOT_EXISTS} | ${ERROR_MESSAGES.TASK_DOES_NOT_BELONGS_USER}`,
  })
  async remove(@Req() request: Request, @Param('taskId') taskId: string) {
    try {
      const { userId } = request;

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

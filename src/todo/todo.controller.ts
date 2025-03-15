import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoGateway } from './todo.gateway';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly todoGateway: TodoGateway,
  ) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    try {
      const todo = await this.todoService.create(createTodoDto);
      this.todoGateway.emitTodoCreated(todo);
      return todo;
    } catch (error) {
      throw new HttpException(
        'Failed to create todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.todoService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch todos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const todo = await this.todoService.findOne(id);
      if (!todo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      return todo;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    try {
      const todo = await this.todoService.update(id, updateTodoDto);
      if (!todo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      this.todoGateway.emitTodoUpdate(todo);
      return todo;
    } catch (error) {
      throw new HttpException(
        'Failed to update todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const todo = await this.todoService.remove(id);
      if (!todo) {
        throw new HttpException('Todo not found', HttpStatus.NOT_FOUND);
      }
      this.todoGateway.emitTodoDeleted(id);
      return todo;
    } catch (error) {
      throw new HttpException(
        'Failed to delete todo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 
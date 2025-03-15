import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Todo } from './schemas/todo.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class TodoGateway {
  @WebSocketServer()
  server: Server;

  emitTodoUpdate(todo: Todo) {
    this.server.emit('todoUpdated', todo);
  }

  emitTodoCreated(todo: Todo) {
    this.server.emit('todoCreated', todo);
  }

  emitTodoDeleted(todoId: string) {
    this.server.emit('todoDeleted', todoId);
  }

  @SubscribeMessage('joinTodoRoom')
  handleJoinRoom() {
    // Handle when a client connects
    return { event: 'joinedTodoRoom' };
  }
} 
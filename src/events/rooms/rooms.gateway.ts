import { OnModuleInit } from '@nestjs/common';
import { EventsGateway } from '../events.gateway';

export class RoomsGateway extends EventsGateway implements OnModuleInit {
  onModuleInit() {
    this.server.on('connection', (client) => {
      client.join('room1');

      this.server.to('room1').emit('message', 'Hello from room1');
    });
  }

  private enterRoom(client: any, room: string) {
    client.join(room);
    this.server.to(room).emit('message', `${client.id} joined ${room}`);
  }
}

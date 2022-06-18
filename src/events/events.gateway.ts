import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import ConnectedPlayers from 'src/game/players/connected-players';
import { EventsToEmit } from './events.constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  pingInterval: 5000,
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connect', (client) => {
      console.log(client.id);
    });

    this.server.on('connection', (client) => {
      client.on('disconnect', () => {
        const player = ConnectedPlayers.get(client.id);
        if (player) {
          ConnectedPlayers.remove(client.id);
          if (player.getCurrentRoom()) {
            this.server
              .to(player.getCurrentRoom().getName())
              .emit(EventsToEmit.PLAYER_LEFT_ROOM, player.getInfo());
          }
        }
      });
    });
  }
}

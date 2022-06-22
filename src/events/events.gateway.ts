import { CACHE_MANAGER, Inject, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server } from 'socket.io';
import ConnectedPlayers from 'src/game/players/connected-players';
import { CLIENT_SOCKET_INSTANCE_KEY, EventsToEmit } from './events.constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  onModuleInit() {
    this.server.on('connect', (client) => {
      console.log(client.id);
      this.cacheManager.set(CLIENT_SOCKET_INSTANCE_KEY(client.id), true, {
        // clear the cache after 1 day
        ttl: 86400,
      });
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

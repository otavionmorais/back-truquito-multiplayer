import { CACHE_MANAGER, Inject, OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { Server } from 'socket.io';
import { Constants } from 'src/app.constants';
import Players from 'src/game/players';
import Rooms from 'src/game/rooms';
import {
  getRoomByName,
  getRoomNumberOfPlayers,
  removePlayerFromRoom,
} from 'src/game/rooms/rooms.service';
import { CLIENT_SOCKET_INSTANCE_KEY, EventsToEmit } from './events.constants';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private players: Players,
    private rooms: Rooms,
  ) {}

  onModuleInit() {
    this.server.on('connect', (client) => {
      console.log(client.id);
      this.cacheManager.set(CLIENT_SOCKET_INSTANCE_KEY(client.id), true, {
        ttl: Constants.DEFAULT_TTL,
      });
    });

    this.server.on('connection', (client) => {
      client.on('disconnect', async () => {
        await this.cacheManager.del(CLIENT_SOCKET_INSTANCE_KEY(client.id));
        const player = await this.players.get(client.id);

        if (player) {
          await this.players.remove(client.id);
          if (player.roomName) {
            const room = await getRoomByName(
              player.roomName,
              this.cacheManager,
            );

            if (!room) {
              return;
            }

            await removePlayerFromRoom(room, client.id, this.cacheManager);

            this.server
              .to(room.name)
              .emit(EventsToEmit.PLAYER_LEFT_ROOM, player);

            if (!getRoomNumberOfPlayers(room)) {
              await this.rooms.remove(room.name);
            }
          }
        }
      });
    });
  }
}

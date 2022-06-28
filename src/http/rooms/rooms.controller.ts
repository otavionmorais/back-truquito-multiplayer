import {
  Body,
  CACHE_MANAGER,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  CLIENT_SOCKET_INSTANCE_KEY,
  EventsToEmit,
} from 'src/events/events.constants';
import EnterRoomDTO from './dtos/EnterRoomDTO';
import { IEnterRoomResponse } from './rooms.structures';
import { EventsGateway } from 'src/events/events.gateway';
import { DefaultRules, Errors } from 'src/app.constants';
import { Cache } from 'cache-manager';
import Rooms from 'src/game/rooms';
import Players from 'src/game/players';
import { joinRoom } from 'src/game/players/players.service';

@Controller('rooms')
export class RoomsController {
  constructor(
    private eventsGateway: EventsGateway,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private rooms: Rooms,
    private players: Players,
  ) {}

  @Post('join')
  async enterRoom(@Body() data: EnterRoomDTO): Promise<IEnterRoomResponse> {
    const { websocketClientId } = data;

    const socketExists = (await this.cacheManager.get(
      CLIENT_SOCKET_INSTANCE_KEY(websocketClientId),
    )) as boolean | null;

    if (!socketExists) {
      throw new HttpException(
        {
          code: Errors.SOCKET_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      let player = await this.players.get(websocketClientId);
      if (!player) {
        player = {
          id: websocketClientId,
          name: data.playerName,
        };
        await this.players.add(player);
      }

      let room = await this.rooms.get(data.roomName);

      if (!room) {
        room = {
          name: data.roomName,
          players: [],
          maxPlayers: DefaultRules.maxPlayers,
        };
        await this.rooms.add(room);
      }

      await joinRoom(player, room, this.cacheManager);

      this.eventsGateway.server
        .in(websocketClientId)
        .socketsJoin(data.roomName);

      this.eventsGateway.server
        .to(data.roomName)
        .emit(EventsToEmit.PLAYER_ENTERED_ROOM, player);

      return {
        room,
        player,
      };
    } catch (e) {
      throw new HttpException(
        {
          message: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

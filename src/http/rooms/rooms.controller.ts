import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EventsToEmit } from 'src/events/events.constants';
import ConnectedPlayers from 'src/game/players/connected-players';
import { Player } from 'src/game/players/player';
import ConnectedRooms from 'src/game/rooms/connected-rooms';
import { Room } from 'src/game/rooms/room.class';
import EnterRoomDTO from './dtos/EnterRoomDTO';
import { IEnterRoomResponse } from './rooms.structures';
import { EventsGateway } from 'src/events/events.gateway';
import { DefaultRules, Errors } from 'src/app.constants';

@Controller('rooms')
export class RoomsController {
  constructor(private eventsGateway: EventsGateway) {}

  @Post('enter')
  async enterRoom(@Body() data: EnterRoomDTO): Promise<IEnterRoomResponse> {
    const { websocketClientId } = data;

    const connectedSockets = await this.eventsGateway.server.fetchSockets();

    const currentSocket = connectedSockets.find(
      (socket) => socket.id === websocketClientId,
    );

    if (!currentSocket) {
      throw new HttpException(
        {
          code: Errors.SOCKET_NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      let player = ConnectedPlayers.get(websocketClientId);

      if (!player) {
        player = new Player(data.playerName, websocketClientId);
        ConnectedPlayers.add(player);
      }

      let room = ConnectedRooms.get(data.roomName);

      if (!room) {
        room = new Room(data.roomName, DefaultRules.maxPlayers);
        ConnectedRooms.add(room);
      }

      player.joinRoom(room);
      currentSocket.join(data.roomName);
      this.eventsGateway.server
        .to(data.roomName)
        .emit(EventsToEmit.PLAYER_ENTERED_ROOM, player.getInfo());

      return {
        room: room.getName(),
        player: player.getInfo(),
      };
    } catch (e) {
      throw new HttpException(
        {
          code: e.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

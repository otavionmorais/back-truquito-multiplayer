import { Body, Controller, Post } from '@nestjs/common';
import {
  DefaultRules,
  Errors,
  EventsToEmit,
} from 'src/events/events.constants';
import ConnectedPlayers from 'src/game/players/connected-players';
import { Player } from 'src/game/players/player';
import ConnectedRooms from 'src/game/rooms/connected-rooms';
import { Room } from 'src/game/rooms/room.class';
import EnterRoomDTO from './dtos/EnterRoomDTO';
import { WebSocketGateway } from '@nestjs/websockets';
import { IEnterRoomResponse } from './rooms.structures';
import { EventsGateway } from 'src/events/events.gateway';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
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
      throw new Error(Errors.SOCKET_NOT_FOUND);
    }

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
    const res = this.eventsGateway.server
      .to(data.roomName)
      .emit(EventsToEmit.PLAYER_ENTERED_ROOM, player.getInfo());

    return {
      room: room.getName(),
      player: player.getInfo(),
    };
  }
}

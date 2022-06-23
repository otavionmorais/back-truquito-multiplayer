import { IPlayer } from 'src/game/players/players.structures';
import { IRoom } from 'src/game/rooms/rooms.structures';

export interface IEnterRoomResponse {
  room: IRoom;
  player: IPlayer;
}

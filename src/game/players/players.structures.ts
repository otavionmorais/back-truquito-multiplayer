import { IRoom } from '../rooms/rooms.structures';

export interface IPlayer {
  id: string;
  name: string;
  currentRoom?: IRoom | null;
}

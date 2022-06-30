import { IPlayer } from '../players/players.structures';

export interface IRoom {
  name: string;
  maxPlayers: number;
  players: IPlayer[];
  // currentMatch: IMatch | null;
}

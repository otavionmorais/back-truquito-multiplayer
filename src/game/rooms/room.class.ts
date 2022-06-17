import { Errors } from 'src/events/events.constants';
import { Match } from '../matches/match';
import { Player } from '../players/player';

export class Room {
  constructor(private name: string, private maxPlayers: number) {}

  private currentMatch: Match;
  private players: Player[] = [];

  public addPlayer(player: Player): void {
    if (this.isFull()) {
      throw new Error(Errors.ROOM_FULL);
    }
    this.players.push(player);
  }

  public removePlayer(player: Player): void {
    this.players = this.players.filter((p) => p.getId() !== player.getId());
  }

  public isFull(): boolean {
    return this.players.length >= this.maxPlayers;
  }

  public createNewMatch(): Match {
    this.currentMatch = new Match(this);
    return this.currentMatch;
  }

  public getCurrentMatch(): Match {
    return this.currentMatch;
  }

  public getName(): string {
    return this.name;
  }
}

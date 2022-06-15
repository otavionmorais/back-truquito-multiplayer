import { Match } from '../matches/match.class';
import { Player } from '../players/player.class';

export class Room {
  constructor(
    private config: {
      id: string;
      name: string;
      players: Player[];
      maxPlayers: number;
    },
  ) {}

  private currentMatch: Match;

  public addPlayer(player: Player): void {
    if (this.isFull()) {
      throw new Error('Room is full');
    }
    this.config.players.push(player);
  }

  public isFull(): boolean {
    return this.config.players.length >= this.config.maxPlayers;
  }

  public createNewMatch(): Match {
    this.currentMatch = new Match(this);
    return this.currentMatch;
  }

  public getCurrentMatch(): Match {
    return this.currentMatch;
  }
}

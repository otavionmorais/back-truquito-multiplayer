import { Player } from './player';

export default class ConnectedPlayers {
  private static players = [];

  public static add(player: Player): void {
    if (!this.players.find((p) => p.getId() === player.getId())) {
      this.players.push(player);
    }
  }

  public static remove(id: string): void {
    this.players = this.players.filter((p) => p.getId() !== id);
  }

  public static getAll(): Player[] {
    return this.players;
  }

  public static get(id: string): Player | null {
    return this.players.find((p) => p.getId() === id) || null;
  }
}

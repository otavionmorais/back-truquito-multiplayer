import { Match } from '../matches/match';
import { Room } from '../rooms/room.class';

export class Player {
  constructor(private name: string, websocketClientId: string) {
    this.id = websocketClientId;
  }

  private currentRoom: Room | null;
  private id: string;

  public joinRoom(room: Room): void {
    this.currentRoom = room;
    room.addPlayer(this);
  }

  public getCurrentRoom(): Room | null {
    return this.currentRoom;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getCurrentMatch(): Match | null {
    return this.currentRoom?.getCurrentMatch();
  }

  public leaveRoom(): void {
    this.currentRoom.removePlayer(this);
    this.currentRoom = null;
  }

  public getInfo(): { name: string; id: string } {
    return {
      name: this.name,
      id: this.id,
    };
  }
}
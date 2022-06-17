import { Room } from './room.class';

export default class ConnectedRooms {
  private static rooms: Room[] = [];

  public static add(room: Room): void {
    this.rooms.push(room);
  }

  public static remove(room: Room): void {
    this.rooms = this.rooms.filter((r) => r.getName() !== room.getName());
  }

  public static getAll(): Room[] {
    return this.rooms;
  }

  public static get(name: string): Room | null {
    return this.rooms.find((r) => r.getName() === name) || null;
  }
}

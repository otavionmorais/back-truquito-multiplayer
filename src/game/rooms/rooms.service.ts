import { Cache } from 'cache-manager';
import { Constants, Errors } from 'src/app.constants';
import { IRoom } from './rooms.structures';

export async function addPlayerToRoom(
  room: IRoom,
  playerId: string,
  cacheManager: Cache,
): Promise<void> {
  if (isRoomFull(room)) {
    throw new Error(Errors.ROOM_FULL);
  }
  if (playerExistsInRoom(room, playerId)) {
    throw new Error(Errors.PLAYER_ALREADY_IN_ROOM);
  }
  room.players.push(playerId);
  await cacheManager.set(`${Constants.CACHE_ROOM_PREFIX}:${room.name}`, room, {
    ttl: Constants.DEFAULT_TTL,
  });
}

export async function removePlayerFromRoom(
  room: IRoom,
  playerId: string,
  cacheManager: Cache,
): Promise<void> {
  room.players = room.players.filter((p) => p !== playerId);
  await cacheManager.set(`${Constants.CACHE_ROOM_PREFIX}:${room.name}`, room, {
    ttl: Constants.DEFAULT_TTL,
  });
}

export function isRoomFull(room: IRoom): boolean {
  return room.players.length >= room.maxPlayers;
}

export function getRoomNumberOfPlayers(room: IRoom): number {
  return room.players.length;
}

export function playerExistsInRoom(room: IRoom, playerId: string): boolean {
  return room.players.includes(playerId);
}

export function getRoomByName(
  roomName: string,
  cacheManager: Cache,
): Promise<IRoom | null> {
  return cacheManager.get(`${Constants.CACHE_ROOM_PREFIX}:${roomName}`);
}

// export async function createNewMatch(
//   room: IRoom,
//   cacheManager: Cache,
// ): Promise<IMatch> {
//   room.currentMatch = {};
//   await cacheManager.set(`${Constants.CACHE_ROOM_PREFIX}:${room.name}`, room);
//   return room.currentMatch;
// }

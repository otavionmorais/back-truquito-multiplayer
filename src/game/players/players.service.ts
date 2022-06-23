import { Constants, Errors } from 'src/app.constants';
import { IRoom } from '../rooms/rooms.structures';
import { addPlayerToRoom, removePlayerFromRoom } from '../rooms/rooms.service';
import { IPlayer } from './players.structures';
import { Cache } from 'cache-manager';

export async function joinRoom(
  player: IPlayer,
  room: IRoom,
  cacheManager: Cache,
): Promise<void> {
  if (player.currentRoom) {
    throw new Error(Errors.PLAYER_ALREADY_IN_ROOM);
  }
  await addPlayerToRoom(room, player.id, cacheManager);
  player.currentRoom = room;
  await cacheManager.set(
    `${Constants.CACHE_PLAYER_PREFIX}:${player.id}`,
    player,
    {
      ttl: Constants.DEFAULT_TTL,
    },
  );
}

export async function leaveRoom(
  player: IPlayer,
  room: IRoom,
  cacheManager: Cache,
): Promise<void> {
  await removePlayerFromRoom(room, player.id, cacheManager);
  player.currentRoom = null;
  await cacheManager.set(
    `${Constants.CACHE_PLAYER_PREFIX}:${player.id}`,
    player,
    {
      ttl: Constants.DEFAULT_TTL,
    },
  );
}

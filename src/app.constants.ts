export enum Errors {
  ROOM_FULL = 'Room is full.',
  SOCKET_NOT_FOUND = 'Socket is not connected.',
  PLAYER_ALREADY_IN_ROOM = 'Player is already in a room.',
}

export const DefaultRules = {
  maxPlayers: 4,
};

export const Constants = {
  CACHE_ROOM_PREFIX: 'room',
  CACHE_PLAYER_PREFIX: 'player',
  DEFAULT_TTL: 60 * 60 * 12,
};

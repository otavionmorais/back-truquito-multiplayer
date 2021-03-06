export enum EventsToBeListened {
  PLAYER_REQUESTED_TO_ENTER_ROOM = 'rooms.player.requestedToEnter',
  PLAYER_REQUESTED_TO_LEAVE_ROOM = 'rooms.player.requestedToLeave',
}

export enum EventsToEmit {
  PLAYER_ENTERED_ROOM = 'rooms.player.entered',
  PLAYER_LEFT_ROOM = 'rooms.player.left',
}

export const CLIENT_SOCKET_INSTANCE_KEY = (websocketClientid: string) =>
  `clientsocket::${websocketClientid}`;

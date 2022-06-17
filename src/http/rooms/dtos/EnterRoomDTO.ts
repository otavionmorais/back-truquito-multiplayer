import { IsString, MaxLength, MinLength } from 'class-validator';

export default class EnterRoomDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  roomName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  playerName: string;

  @IsString()
  websocketClientId: string;
}

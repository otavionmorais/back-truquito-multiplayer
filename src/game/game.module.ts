import { Module } from '@nestjs/common';
import Players from 'src/game/players';
import Rooms from 'src/game/rooms';

@Module({
  providers: [Players, Rooms],
  exports: [Players, Rooms],
})
export class GameModule {}

import { Module } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import Players from 'src/game/players';
import Rooms from 'src/game/rooms';
import { HttpController } from './http.controller';
import { RoomsController } from './rooms/rooms.controller';

@Module({
  controllers: [HttpController, RoomsController],
  providers: [EventsGateway, Rooms, Players],
})
export class HttpModule {}

import { Module } from '@nestjs/common';
import Players from 'src/game/players';
import Rooms from 'src/game/rooms';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway, Players, Rooms],
})
export class EventsModule {}

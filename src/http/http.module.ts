import { Module } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { HttpController } from './http.controller';
import { RoomsController } from './rooms/rooms.controller';

@Module({
  controllers: [HttpController, RoomsController],
  providers: [EventsGateway],
})
export class HttpModule {}

import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { HttpModule } from './http/http.module';

@Module({
  imports: [EventsModule, HttpModule],
})
export class AppModule {}

import { CacheModule, Module } from '@nestjs/common';
import type { ClientOpts } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EventsModule } from './events/events.module';
import { HttpModule } from './http/http.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().default(3000),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
      }),
    }),
    {
      ...CacheModule.register<ClientOpts>({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      }),
      global: true,
    },
    GameModule,
    EventsModule,
    HttpModule,
  ],
})
export class AppModule {}

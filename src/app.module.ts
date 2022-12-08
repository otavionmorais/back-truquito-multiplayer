import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EventsModule } from './events/events.module';
import { HttpModule } from './http/http.module';
import { GameModule } from './game/game.module';
import { Constants } from './app.constants';

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
      ...CacheModule.registerAsync({
        useFactory: async () => {
          const store = (await redisStore({
            socket: {
              host: process.env.REDIS_HOST,
              port: +process.env.REDIS_PORT,
            },
          })) as unknown as CacheStore;

          return {
            store,
            ttl: Constants.DEFAULT_TTL,
          };
        },
      }),
      global: true,
    },
    GameModule,
    EventsModule,
    HttpModule,
  ],
})
export class AppModule {}

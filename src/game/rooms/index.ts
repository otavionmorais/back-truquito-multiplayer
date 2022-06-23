import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Constants } from 'src/app.constants';
import { IRoom } from './rooms.structures';

@Injectable()
export default class Rooms {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async add(room: IRoom): Promise<void> {
    await this.cacheManager.set(
      `${Constants.CACHE_ROOM_PREFIX}:${room.name}`,
      room,
      {
        ttl: Constants.DEFAULT_TTL,
      },
    );
  }

  public async remove(room: IRoom): Promise<void> {
    await this.cacheManager.del(`room:${room.name}`);
  }

  public async getAllNames(): Promise<string[]> {
    const redisKeys = (await this.cacheManager.store.keys()) as string[];
    const response = redisKeys.reduce((previousValue, currentValue) => {
      if (currentValue.includes(`${Constants.CACHE_ROOM_PREFIX}:`)) {
        previousValue.push(
          currentValue.replace(`${Constants.CACHE_ROOM_PREFIX}:`, ''),
        );
      }
      return previousValue;
    }, []);
    return response;
  }

  public get(name: string): Promise<IRoom | null> {
    return this.cacheManager.get(`${Constants.CACHE_ROOM_PREFIX}:${name}`);
  }
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Constants } from 'src/app.constants';
import { IPlayer } from './players.structures';

@Injectable()
export default class Players {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async add(player: IPlayer): Promise<void> {
    const existingPlayer = await this.cacheManager.get(
      `${Constants.CACHE_PLAYER_PREFIX}:${player.id}`,
    );

    if (!existingPlayer) {
      await this.cacheManager.set(
        `${Constants.CACHE_PLAYER_PREFIX}:${player.id}`,
        player,
      );
    }
  }

  public async remove(id: string): Promise<void> {
    await this.cacheManager.del(`${Constants.CACHE_PLAYER_PREFIX}:${id}`);
  }

  public async getAllNames(): Promise<string[]> {
    const redisKeys = (await this.cacheManager.store.keys()) as string[];
    const response = redisKeys.reduce((previousValue, currentValue) => {
      if (currentValue.includes('room:')) {
        previousValue.push(currentValue.replace('room:', ''));
      }
      return previousValue;
    }, []);
    return response;
  }

  public get(id: string): Promise<IPlayer | null> {
    return this.cacheManager.get(`${Constants.CACHE_PLAYER_PREFIX}:${id}`);
  }
}

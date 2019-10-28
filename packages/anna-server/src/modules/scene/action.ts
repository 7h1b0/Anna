import knex from '../../knexClient';
import TYPES from 'utils/type';
import { ToggleDio, ToggleHueLight, AnnaAction } from 'utils/actions';
import * as logger from 'utils/logger';

export const TABLE = 'actions';

export type HueLigthBody = {
  on: boolean;
  bri?: number;
  xy?: number[];
};

export type DioBody = { on: boolean };

export type Action = {
  sceneId: string;
  name: string;
  targetId: string;
  readonly type: TYPES.DIO;
  body: string;
};

export async function findBySceneId(sceneId: string): Promise<AnnaAction[]> {
  return knex(TABLE)
    .select(['type', 'body', 'targetId'])
    .where('sceneId', sceneId)
    .then((entries: Action[]) => {
      return entries.reduce((acc: AnnaAction[], entry: Action) => {
        try {
          const body = JSON.parse(entry.body);
          if (entry.type === TYPES.DIO) {
            return acc.concat([new ToggleDio(entry.targetId, body)]);
          }
          return acc.concat(new ToggleHueLight(entry.targetId, body));
        } catch (e) {
          logger.error(`Body of entry #${entry.name} is malformed`);
          return acc;
        }
      }, []);
    });
}

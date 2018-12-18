import knex from '../../knexClient';
import TYPES from '../type';
import { ToggleDio, ToggleHueLight, AnnaAction } from '../actions';
import * as logger from '../logger';

export const TABLE = 'actions';

export interface Action {
  sceneId: string;
  name: string;
  targetId: string;
  readonly type: TYPES.HUE_LIGHT | TYPES.DIO;
  body: string;
}

export async function findBySceneId(sceneId: string): Promise<AnnaAction[]> {
  return knex(TABLE)
    .select(['type', 'body', 'targetId'])
    .where('sceneId', sceneId)
    .then((entries: Action[]) => {
      return entries.reduce((acc: AnnaAction[], entry: Action) => {
        try {
          const body = JSON.parse(entry.body);
          if (entry.type === TYPES.DIO) {
            return acc.concat([new ToggleDio(entry.sceneId, body)]);
          }
          return acc.concat(new ToggleHueLight(entry.sceneId, body));
        } catch (e) {
          logger.error(`Body of entry #${entry.name} is malformed`);
          return acc;
        }
      }, []);
    });
}

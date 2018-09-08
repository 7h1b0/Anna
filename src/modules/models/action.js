import knex from '../../knexClient';
import * as logger from '../logger';

export const TABLE = 'actions';
export const COLUMNS = [
  'name',
  'type',
  'body',
  'targetId',
  'sceneId',
  'actionId',
];

export function findBySceneId(sceneId) {
  return knex(TABLE)
    .select(COLUMNS)
    .where('sceneId', sceneId)
    .then(entries => {
      return entries.reduce((acc, entry) => {
        try {
          return acc.concat({ ...entry, body: JSON.parse(entry.body) });
        } catch (e) {
          logger.error(`Body of entry #${entry.name} is malformed`);
          return acc;
        }
      }, []);
    });
}

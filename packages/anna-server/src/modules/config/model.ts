import knex from '../../knexClient';

export const TABLE = 'config';

export type Config = {
  isAway: boolean;
};

export async function fetchIsAway(): Promise<{ isAway: true }> {
  return knex(TABLE).first('isAway');
}

export function updateIsAway(isAway: boolean) {
  return knex(TABLE).update({ isAway });
}

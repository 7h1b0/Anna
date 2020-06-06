import knex from '../../knexClient';

export const TABLE = 'consumption';
export const COLUMNS = ['date', 'value'];

export type Consumption = {
  date: number;
  value: number;
};

export async function findLastEntries(limit: number): Promise<Consumption[]> {
  return knex(TABLE)
    .select(COLUMNS)
    .whereNotNull('value')
    .orderBy('date', 'desc')
    .limit(limit);
}

export async function findLastEntry(): Promise<Consumption> {
  return knex(TABLE)
    .first(COLUMNS)
    .whereNotNull('value')
    .orderBy('date', 'desc')
    .limit(1);
}

export async function save(consumptions: { date: Date; value: number }[]) {
  return knex.transaction((trx) => {
    return Promise.all(
      consumptions.map((consumption) => trx.insert(consumption).into(TABLE)),
    );
  });
}

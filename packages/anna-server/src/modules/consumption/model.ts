import addDays from 'date-fns/addDays';
import knex from '../../knexClient';

export const TABLE = 'consumption';
export const COLUMNS = ['date', 'value'];

export type Consumption = {
  date: number;
  value: number;
};

export async function findLastWeek(): Promise<Consumption[]> {
  const yesterday = addDays(new Date(), -1);
  const lastWeek = addDays(yesterday, -8);

  return knex(TABLE)
    .select(COLUMNS)
    .whereNotNull('value')
    .whereBetween('date', [lastWeek, yesterday])
    .orderBy('date', 'asc');
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

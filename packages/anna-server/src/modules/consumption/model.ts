import knex from '../../knexClient';

export const TABLE = 'consumption';
export const COLUMNS = ['date', 'power'];

export interface Consumption {
  date: number;
  power: number;
}

export async function findLastWeek(): Promise<Consumption[]> {
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);

  return knex(TABLE)
    .select(COLUMNS)
    .whereBetween('date', [lastWeek, today])
    .orderBy('date', 'asc');
}

export async function save(consumptions: Consumption[]) {
  return knex.transaction((trx) => {
    return Promise.all(
      consumptions.map((consumption) => trx.insert(consumption).into(TABLE)),
    );
  });
}

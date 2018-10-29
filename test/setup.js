import knex from '../src/knexClient';

afterAll(async () => {
  await knex.destroy();
});

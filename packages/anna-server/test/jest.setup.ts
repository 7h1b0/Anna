import knex from '../src/knexClient';
import matchers from './matchers';

expect.extend(matchers);

process.env.HUE_IP = 'testIP';
process.env.HUE_TOKEN = 'abcdefghijklmnopqrstuvwxywz';

afterAll(async () => {
  await knex.destroy();
});

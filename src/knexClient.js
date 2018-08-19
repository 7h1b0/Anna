import knex from 'knex';
import config from './knexfile';

export default knex(
  process.env.NODE_ENV === 'production'
    ? config.production
    : config.development,
);

import knex from 'knex';
import config from './knexfile';

const env = process.env.NODE_ENV || 'development';
export default knex(config[env]);

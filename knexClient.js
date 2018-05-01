const knex = require('knex');
const config = require('./knexfile');

module.exports = knex(
  process.env.NODE_ENV === 'production'
    ? config.production
    : config.development,
);

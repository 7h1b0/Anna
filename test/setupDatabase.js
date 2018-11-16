const path = require('path');
const knex = require('../src/knexClient');

module.exports = function() {
  const migrationPath = path.join(__dirname, '../migrations');
  return knex.migrate.latest({ directory: migrationPath });
};

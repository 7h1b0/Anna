const path = require('path');
const knex = require('../src/knexClient');

module.exports = async function() {
  const migrationPath = path.join(__dirname, '../migrations');
  await knex.migrate.latest({ directory: migrationPath });
  return knex.destroy();
};

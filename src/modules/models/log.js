const knex = require('../../../knexClient');
const TABLE_LOGS = 'logs';

module.exports = {
  save({ httpMethod, path, ip, username }) {
    return knex(TABLE_LOGS).insert({ httpMethod, path, ip, username });
  },

  findWithLimit(limit) {
    return knex(TABLE_LOGS)
      .select(['ip', 'httpMethod', 'path', 'created_at', 'username'])
      .orderBy('created_at', 'desc')
      .limit(limit);
  },
};

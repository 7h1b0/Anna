const knex = require('../../knexClient');
const TABLE = 'logs';
const COLUMNS = [
  'ip',
  'httpMethod',
  'path',
  { createdAt: 'created_at' },
  'username',
];

module.exports = {
  TABLE,
  COLUMNS,

  save({ httpMethod, path, ip, username, createdAt = new Date() }) {
    return knex(TABLE).insert({
      httpMethod,
      path,
      ip,
      username,
      created_at: createdAt,
    });
  },

  findWithLimit(limit) {
    return knex(TABLE)
      .select(...COLUMNS)
      .orderBy('id', 'desc')
      .limit(limit);
  },
};

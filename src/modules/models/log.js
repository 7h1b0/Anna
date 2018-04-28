const knex = require('../../../knexClient');

module.exports = {
  TABLE: 'logs',
  COLUMN: ['ip', 'httpMethod', 'path', { createdAt: 'created_at' }, 'username'],

  save({ httpMethod, path, ip, username, createdAt = new Date() }) {
    return knex(this.TABLE).insert({
      httpMethod,
      path,
      ip,
      username,
      created_at: createdAt,
    });
  },

  findWithLimit(limit) {
    return knex(this.TABLE)
      .select(...this.COLUMN)
      .orderBy('id', 'desc')
      .limit(limit);
  },
};

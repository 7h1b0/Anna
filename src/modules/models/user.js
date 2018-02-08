const Ajv = require('ajv');
const userSchema = require('../schemas/user');
const knex = require('../../../knexClient');
const { returnFirst } = require('../dbUtil');

module.exports = {
  TABLE: 'users',

  findByToken(token) {
    return returnFirst(
      knex(this.TABLE)
        .select({ userId: 'user_id' }, 'username')
        .where('token', '=', token),
    );
  },

  findAll() {
    return knex(this.TABLE).select('user_id', 'username');
  },

  findByUsername(username) {
    return returnFirst(
      knex(this.TABLE)
        .select({ userId: 'user_id' }, 'username', 'password', 'token')
        .where('username', username),
    );
  },

  findByIdAndUpdate(userId, payload) {
    return knex(this.TABLE)
      .update(payload)
      .where('user_id', userId);
  },

  save({ username, password, token }) {
    return knex(this.TABLE)
      .insert({ username, password, token })
      .then(([userId]) => {
        return { userId, token, username };
      });
  },

  delete(userId) {
    return knex(this.TABLE)
      .where('user_id', '=', userId)
      .del();
  },

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(userSchema, data);
  },
};

import Ajv from 'ajv';
import userSchema from '../schemas/user';
import knex from '../../knexClient';
import { returnFirst } from '../dbUtil';

export const TABLE = 'users';

export function findByToken(token) {
  return returnFirst(
    knex(TABLE)
      .select({ userId: 'user_id' }, 'username')
      .where('token', token),
  );
}

export function findAll() {
  return knex(TABLE).select({ userId: 'user_id' }, 'username');
}

export function findByUsername(username) {
  return returnFirst(
    knex(TABLE)
      .select({ userId: 'user_id' }, 'username', 'password', 'token')
      .where('username', username),
  );
}

export function findByIdAndUpdate(userId, payload) {
  return knex(TABLE)
    .update(payload)
    .where('user_id', userId);
}

export function save({ username, password, token }) {
  return knex(TABLE)
    .insert({ username, password, token })
    .then(([userId]) => {
      return { userId, token, username };
    });
}

export function remove(userId) {
  return knex(TABLE)
    .where('user_id', '=', userId)
    .del();
}

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(userSchema, data);
}

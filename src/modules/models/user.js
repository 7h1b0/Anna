import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import userSchema from '../schemas/user';
import knex from '../../knexClient';

export const TABLE = 'users';

export function findByToken(token) {
  return knex(TABLE)
    .first('userId', 'username')
    .where('token', token);
}

export function findAll() {
  return knex(TABLE).select('userId', 'username');
}

export function findByUsername(username) {
  return knex(TABLE)
    .first('userId', 'username', 'password', 'token')
    .where('username', username);
}

export function findByIdAndUpdate(userId, payload) {
  return knex(TABLE)
    .update(payload)
    .where('userId', userId);
}

export async function save({ username, password, token }) {
  const userId = uuidv4();
  await knex(TABLE).insert({ username, password, token, userId });
  return userId;
}

export function remove(userId) {
  return knex(TABLE)
    .where('userId', userId)
    .del();
}

export function validate(data) {
  const ajv = new Ajv();
  return ajv.validate(userSchema, data);
}

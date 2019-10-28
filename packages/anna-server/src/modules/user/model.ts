import Ajv from 'ajv';
import uuidv4 from 'uuid/v4';
import userSchema from './schema';
import knex from '../../knexClient';

export const TABLE = 'users';

export interface User {
  userId: string;
  username: string;
  password: string;
  token: string;
}

export function findByToken(token: string) {
  return knex(TABLE)
    .first('userId', 'username')
    .where('token', token);
}

export async function findAll(): Promise<{ userId: string; username: string }> {
  return knex(TABLE).select('userId', 'username');
}

export async function findByUsername(username: string): Promise<User> {
  return knex(TABLE)
    .first('userId', 'username', 'password', 'token')
    .where('username', username);
}

export function findByIdAndUpdate(
  userId: string,
  payload: Partial<Omit<User, 'userId'>>,
) {
  return knex(TABLE)
    .update(payload)
    .where('userId', userId);
}

export async function save(newUser: Omit<User, 'userId'>) {
  const userId = uuidv4();
  await knex(TABLE).insert({ ...newUser, userId });
  return userId;
}

export function remove(userId: string) {
  return knex(TABLE)
    .where('userId', userId)
    .del();
}

export function validate(data: object) {
  const ajv = new Ajv();
  return ajv.validate(userSchema, data);
}

import Ajv from 'ajv';
import { v4 as uuidv4 } from 'uuid';
import userSchema from './schema';
import knex from '../../knexClient';

export const TABLE = 'users';

export type User = {
  userId: string;
  username: string;
  password: string;
  token: string;
  isAway: boolean;
};

export async function isUserAway(userId: string): Promise<{ isAway: true }> {
  return knex(TABLE).first('isAway').where('userId', userId);
}

export function findByToken(token: string) {
  return knex(TABLE)
    .first('userId', 'username', 'isAway')
    .where('token', token);
}

export function findById(userId: string) {
  return knex(TABLE)
    .first('userId', 'username', 'isAway')
    .where('userId', userId);
}

export async function findAll(): Promise<{ userId: string; username: string }> {
  return knex(TABLE).select('userId', 'username');
}

export async function findByUsername(username: string): Promise<User> {
  return knex(TABLE)
    .first('userId', 'username', 'password', 'token', 'isAway')
    .where('username', username);
}

export function findByIdAndUpdate(
  userId: string,
  payload: Partial<Omit<User, 'userId'>>,
) {
  return knex(TABLE).update(payload).where('userId', userId);
}

export async function save(newUser: Omit<User, 'userId'>) {
  const userId = uuidv4();
  await knex(TABLE).insert({ ...newUser, userId });
  return userId;
}

export function remove(userId: string) {
  return knex(TABLE).where('userId', userId).del();
}

export function validate(data: Record<string, unknown>) {
  const ajv = new Ajv();
  return ajv.validate(userSchema, data);
}

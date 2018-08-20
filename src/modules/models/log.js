import knex from '../../knexClient';
export const TABLE = 'logs';
export const COLUMNS = [
  'ip',
  'httpMethod',
  'path',
  { createdAt: 'created_at' },
  'username',
];

export function save({
  httpMethod,
  path,
  ip,
  username,
  createdAt = new Date(),
}) {
  return knex(TABLE).insert({
    httpMethod,
    path,
    ip,
    username,
    created_at: createdAt,
  });
}

export function findWithLimit(limit) {
  return knex(TABLE)
    .select(...COLUMNS)
    .orderBy('id', 'desc')
    .limit(limit);
}

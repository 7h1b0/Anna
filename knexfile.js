/**
 * This file use module.exports in order to be
 * used by knex for migration/rollback
 */

function typeCast(field, next) {
  if (field.type === 'TINY' && field.length === 1) {
    return field.string() === '1';
  }
  if (field.type === 'TIMESTAMP') {
    const dateString = field.string();
    const dt = new Date(dateString).getTime();
    if (isNaN(dt)) {
      return 0;
    }
    return dt;
  }
  return next();
}

module.exports = {
  development: {
    migrations: {
      directory: './migrations',
    },
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'anna',
      typeCast,
    },
    pool: { min: 0, max: 4 },
  },
  test: {
    migrations: {
      directory: './migrations',
    },
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'anna_test',
      typeCast,
    },
    pool: { min: 0, max: 4 },
  },
  production: {
    client: 'mysql',
    migrations: {
      directory: './migrations',
    },
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      typeCast,
    },
    pool: { min: 0, max: 4 },
  },
};

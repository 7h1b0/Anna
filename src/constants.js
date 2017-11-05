module.exports = {
  PORT: process.env.PORT || 8181,
  DATABASE_IP: process.env.DATABASE_IP || '127.0.0.1',
  DATABASE_PORT: process.env.DATABASE_PORT || 27017,
  DATABASE_NAME: process.env.DATABASE_NAME || 'anna',
  HUE_IP: process.env.HUE_IP || '127.0.0.1',
  HUE_TOKEN: process.env.HUE_TOKEN || '',
  password: {
    iterations: 2000,
    hashBytes: 32,
    digest: 'sha512',
  },
};

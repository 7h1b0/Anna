module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'test',
      database: 'anna',
      typeCast: (field, next) => {
        if (field.type == 'TINY' && field.length == 1) {
          return field.string() == '1';
        }
        return next();
      },
    },
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: './prod.sqlite3',
      typeCast: function(field, next) {
        if (field.type == 'TINY' && field.length == 1) {
          return field.string() == '1';
        }
        return next();
      },
    },
    useNullAsDefault: true,
  },
};

exports.up = function(knex, Promise) {
  const addIndexOnToken = knex.schema.table('users', function(table) {
    table.index('token', 'index_token');
  });
  const addIndexOnNameAlias = knex.schema.table('alias', function(table) {
    table.index('name', 'index_name');
  });

  return Promise.all([addIndexOnToken, addIndexOnNameAlias]);
};

exports.down = function(knex, Promise) {
  const dropIndexOnToken = knex.schema.table('users', function(table) {
    table.dropIndex('token', 'index_token');
  });
  const dropIndexOnNameAlias = knex.schema.table('alias', function(table) {
    table.dropIndex('name', 'index_name');
  });
  return Promise.all([dropIndexOnToken, dropIndexOnNameAlias]);
};

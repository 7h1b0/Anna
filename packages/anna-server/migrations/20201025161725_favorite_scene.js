exports.up = function (knex) {
  const addFavoriteColumn = knex.schema.table('scenes', function (table) {
    table.boolean('favorite');
  });

  return Promise.all([addFavoriteColumn]);
};

exports.down = function (knex) {
  const dropFavoriteColumn = knex.schema.table('users', function (table) {
    table.dropColumn('favorite');
  });
  return Promise.all([dropFavoriteColumn]);
};

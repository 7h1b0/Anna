exports.up = function (knex) {
  const addTimeColumn = knex.schema.table('alias', function (table) {
    table.integer('startTime');
    table.integer('endTime');
  });

  return Promise.all([addTimeColumn]);
};

exports.down = function (knex) {
  const dropTimeColumn = knex.schema.table('alias', function (table) {
    table.dropColumn('startTime');
    table.dropColumn('endTime');
  });
  return Promise.all([dropTimeColumn]);
};

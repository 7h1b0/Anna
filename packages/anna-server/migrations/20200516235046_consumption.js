exports.up = function (knex) {
  const createConsumptionTable = knex.schema.createTable(
    'consumption',
    (table) => {
      table.timestamp('date');
      table.decimal('value');
    },
  );

  return createConsumptionTable;
};

exports.down = function (knex) {
  return knex.schema.dropTable('consumption');
};

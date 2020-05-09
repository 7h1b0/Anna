exports.up = function (knex) {
  const createHueSensorTable = knex.schema.createTable('sensors', (table) => {
    table.string('sensorId').primary().notNullable();
    table.uuid('roomId');
  });

  return createHueSensorTable;
};

exports.down = function (knex) {
  return knex.schema.dropTable('sensors');
};

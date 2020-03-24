exports.up = function (knex) {
  return knex.schema.dropTable('logs');
};

exports.down = function (knex) {
  return knex.schema.createTable('logs', (table) => {
    table.increments();
    table.string('ip');
    table.string('httpMethod');
    table.string('path');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.string('username');
  });
};

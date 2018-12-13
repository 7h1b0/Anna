exports.up = function(knex, Promise) {
  return knex.schema.dropTable('logs');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('logs', table => {
    table.increments();
    table.string('ip');
    table.string('httpMethod');
    table.string('path');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.string('username');
  });
};

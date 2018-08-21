exports.up = function(knex, Promise) {
  const createRoutinesTable = knex.schema.createTable('routines', table => {
    table.increments('routine_id');
    table.string('name').notNullable();
    table.string('scene_id').notNullable();
    table.string('schedule').notNullable();
    table.boolean('run_at_bank_holiday').defaultTo(true);
    table.boolean('enabled').defaultTo(true);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('failed_at');
    table.timestamp('last_run_at');
    table.timestamp('next_run_at');
    table
      .integer('created_by')
      .unsigned()
      .notNullable();
  });

  return createRoutinesTable;
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('routines');
};

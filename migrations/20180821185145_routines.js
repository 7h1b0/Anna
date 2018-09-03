exports.up = function(knex, Promise) {
  const createRoutinesTable = knex.schema.createTable('routines', table => {
    table.uuid('routineId').primary();
    table.string('name').notNullable();
    table.uuid('sceneId').notNullable();
    table.string('interval').notNullable();
    table.boolean('runAtBankHoliday').defaultTo(true);
    table.boolean('enabled').defaultTo(true);
    table
      .timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('lastFailedAt');
    table.timestamp('lastRunAt');
    table.timestamp('nextRunAt');
    table.string('failReason');
    table.uuid('createdBy').notNullable();
  });

  return createRoutinesTable;
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('routines');
};

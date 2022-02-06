exports.up = function (knex) {
  const updateRoutine = knex.schema.alterTable('routines', (table) => {
    table.dropColumns('failReason', 'lastFailedAt');
    table.boolean('runWhenUserIsAway').defaultTo(false);
    table.string('lastStatus');
  });

  const updateUser = knex.schema.alterTable('users', (table) => {
    table.boolean('isAway').defaultTo(false);
  });

  return Promise.all([updateRoutine, updateUser]);
};

exports.down = function (knex) {
  const updateRoutine = knex.schema.alterTable('routines', (table) => {
    table.timestamp('lastFailedAt');
    table.string('failReason');
    table.dropColumns('lastStatus', 'runWhenUserIsAway');
  });

  const updateUser = knex.schema.alterTable('users', (table) => {
    table.dropColumn('isAway');
  });

  return Promise.all([updateRoutine, updateUser]);
};

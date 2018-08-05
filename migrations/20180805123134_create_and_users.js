exports.up = function(knex, Promise) {
  const alterRooms = knex.schema.alterTable('rooms', function(t) {
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.integer('created_by')
      .unsigned()
      .notNullable();
  });

  const alterScenes = knex.schema.alterTable('scenes', function(t) {
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.integer('created_by')
      .unsigned()
      .notNullable();
  });

  const alterAlias = knex.schema.alterTable('alias', function(t) {
    t.timestamp('created_at').defaultTo(knex.fn.now());
    t.timestamp('updated_at').defaultTo(knex.fn.now());
    t.integer('created_by')
      .unsigned()
      .notNullable();
  });

  return Promise.all([alterRooms, alterScenes, alterAlias]);
};

exports.down = function(knex, Promise) {
  const dropColumns = ['created_at', 'updated_at', 'created_by'];

  const alterRooms = knex.schema.alterTable('rooms', function(t) {
    t.dropColumns(dropColumns);
  });
  const alterScenes = knex.schema.alterTable('scenes', function(t) {
    t.dropColumns(dropColumns);
  });
  const alterAlias = knex.schema.alterTable('alias', function(t) {
    t.dropColumns(dropColumns);
  });

  return Promise.all([alterRooms, alterScenes, alterAlias]);
};

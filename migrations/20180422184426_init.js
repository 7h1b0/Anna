exports.up = function(knex, Promise) {
  const createUsersTable = knex.schema.createTable('users', table => {
    table.increments('user_id');
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('token').notNullable();
    table.unique('username');
  });

  const createRoomsTable = knex.schema.createTable('rooms', table => {
    table.increments('room_id');
    table.string('name').notNullable();
    table.string('description');
  });

  const createLogsTable = knex.schema.createTable('logs', table => {
    table.increments();
    table.string('ip');
    table.string('httpMethod');
    table.string('path');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('username');
  });

  const createDioTable = knex.schema.createTable('dios', table => {
    table
      .integer('dio_id')
      .primary()
      .notNullable();
    table.string('name');
    table.integer('room_id').unsigned();
  });

  const createScenesTable = knex.schema.createTable('scenes', table => {
    table.increments('scene_id');
    table.string('name');
    table.string('description');
  });

  const createActionsTable = knex.schema.createTable('actions', table => {
    table.increments('action_id');
    table
      .integer('scene_id')
      .unsigned()
      .notNullable();
    table.string('name');
    table.enum('type', ['HUE_LIGHT', 'DIO', 'SCENE', 'ALIAS']);
    table.string('body');
  });

  const createAliasTable = knex.schema.createTable('alias', table => {
    table.increments('alias_id');
    table
      .integer('scene_id')
      .unsigned()
      .notNullable();
    table.string('name').notNullable();
    table.string('description');
    table.boolean('enabled').defaultTo(true);
    table.unique('name');
  });

  const createHueLightTable = knex.schema.createTable('lights', table => {
    table
      .integer('light_id')
      .primary()
      .notNullable();
    table.integer('room_id').unsigned();
  });

  return Promise.all([
    createUsersTable,
    createRoomsTable,
    createLogsTable,
    createDioTable,
    createScenesTable,
    createActionsTable,
    createAliasTable,
    createHueLightTable,
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('rooms'),
    knex.schema.dropTable('logs'),
    knex.schema.dropTable('dios'),
    knex.schema.dropTable('scenes'),
    knex.schema.dropTable('actions'),
    knex.schema.dropTable('alias'),
    knex.schema.dropTable('lights'),
  ]);
};

exports.up = function(knex, Promise) {
  const createUsersTable = knex.schema.createTable('users', table => {
    table.increments('userId');
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('token').notNullable();
  });

  const createRoomsTable = knex.schema.createTable('rooms', table => {
    table.increments('roomId');
    table.string('name').notNullable();
    table.string('description');
    table
      .timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table
      .integer('createdBy')
      .unsigned()
      .notNullable();
  });

  const createLogsTable = knex.schema.createTable('logs', table => {
    table.increments();
    table.string('ip');
    table.string('httpMethod');
    table.string('path');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.string('username');
  });

  const createDioTable = knex.schema.createTable('dios', table => {
    table
      .integer('dioId')
      .primary()
      .notNullable();
    table.string('name');
    table.integer('roomId').unsigned();
  });

  const createScenesTable = knex.schema.createTable('scenes', table => {
    table.increments('sceneId');
    table.string('name');
    table.string('description');
    table
      .timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table
      .integer('createdBy')
      .unsigned()
      .notNullable();
  });

  const createActionsTable = knex.schema.createTable('actions', table => {
    table.increments('actionId');
    table
      .integer('sceneId')
      .unsigned()
      .notNullable();
    table.string('name');
    table.integer('targetId').unsigned();
    table.enum('type', ['HUE_LIGHT', 'DIO', 'SCENE', 'ALIAS']);
    table.string('body');
  });

  const createAliasTable = knex.schema.createTable('alias', table => {
    table.increments('aliasId');
    table
      .integer('sceneId')
      .unsigned()
      .notNullable();
    table.string('name').notNullable();
    table.string('description');
    table.boolean('enabled').defaultTo(true);
    table
      .timestamp('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .timestamp('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table
      .integer('createdBy')
      .unsigned()
      .notNullable();
  });

  const createHueLightTable = knex.schema.createTable('lights', table => {
    table
      .integer('lightId')
      .primary()
      .notNullable();
    table.integer('roomId').unsigned();
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

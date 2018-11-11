exports.up = function(knex, Promise) {
  const createUsersTable = knex.schema.createTable('users', table => {
    table.uuid('userId').primary();
    table.string('username').notNullable();
    table.string('password').notNullable();
    table.string('token').notNullable();
  });

  const createRoomsTable = knex.schema.createTable('rooms', table => {
    table.uuid('roomId').primary();
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
    table.uuid('createdBy').notNullable();
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
    table.uuid('roomId');
  });

  const createScenesTable = knex.schema.createTable('scenes', table => {
    table.uuid('sceneId').primary();
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
    table.uuid('createdBy').notNullable();
  });

  // TODO
  // Use json when mariadb 10.2 will be available on RPI
  const createActionsTable = knex.schema.createTable('actions', table => {
    table.uuid('actionId').primary();
    table.uuid('sceneId').notNullable();
    table.string('name');
    table.integer('targetId');
    table.enum('type', ['HUE_LIGHT', 'DIO']);
    table.string('body');
  });

  const createAliasTable = knex.schema.createTable('alias', table => {
    table.uuid('aliasId').primary();
    table.uuid('sceneId').notNullable();
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
    table.uuid('createdBy').notNullable();
  });

  const createHueLightTable = knex.schema.createTable('lights', table => {
    table
      .integer('lightId')
      .primary()
      .notNullable();
    table.uuid('roomId');
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

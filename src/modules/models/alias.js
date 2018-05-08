const Ajv = require('ajv');
const aliasSchema = require('../schemas/alias');
const knex = require('../../knexClient');
const { returnFirst } = require('../dbUtil');

const TABLE = 'alias';
const COLUMNS = [
  { aliasId: 'alias_id' },
  { sceneId: 'scene_id' },
  'name',
  'description',
  'enabled',
];

module.exports = {
  TABLE,
  COLUMNS,

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(aliasSchema, data);
  },

  findAll() {
    return knex(TABLE).select(COLUMNS);
  },

  findById(aliasId) {
    return returnFirst(
      knex(TABLE)
        .select(COLUMNS)
        .where('alias_id', aliasId),
    );
  },

  findByName(name) {
    return returnFirst(
      knex(TABLE)
        .select(COLUMNS)
        .where('name', name),
    );
  },

  save({ sceneId, name, description, enabled = true }) {
    return knex(TABLE)
      .insert({
        scene_id: sceneId,
        description,
        name,
        enabled,
      })
      .then(([aliasId]) => {
        return { name, description, enabled, sceneId };
      });
  },

  delete(aliasId) {
    return knex(TABLE)
      .where('alias_id', aliasId)
      .del();
  },

  findByIdAndUpdate(aliasId, payload) {
    return knex(TABLE)
      .update(payload)
      .where('alias_id', aliasId);
  },
};

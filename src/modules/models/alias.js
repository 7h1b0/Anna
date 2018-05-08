const Ajv = require('ajv');
const aliasSchema = require('../schemas/alias');
const knex = require('../../knexClient');
const { returnFirst } = require('../dbUtil');

module.exports = {
  TABLE: 'alias',
  COLUMNS: [
    { aliasId: 'alias_id' },
    { sceneId: 'scene_id' },
    'name',
    'description',
    'enabled',
  ],

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(aliasSchema, data);
  },

  findAll() {
    return knex(this.TABLE).select(this.COLUMNS);
  },

  findById(aliasId) {
    return returnFirst(
      knex(this.TABLE)
        .select(this.COLUMNS)
        .where('alias_id', aliasId),
    );
  },

  findByName(name) {
    return returnFirst(
      knex(this.TABLE)
        .select(this.COLUMNS)
        .where('name', name),
    );
  },

  save({ sceneId, name, description, enabled = true }) {
    return knex(this.TABLE)
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
    return knex(this.TABLE)
      .where('alias_id', aliasId)
      .del();
  },

  findByIdAndUpdate(aliasId, payload) {
    return knex(this.TABLE)
      .update(payload)
      .where('alias_id', aliasId);
  },
};

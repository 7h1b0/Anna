const Ajv = require('ajv');
const knex = require('../../knexClient');
const sceneSchema = require('../schemas/scene');

module.exports = {
  TABLE: 'scenes',
  ACTION_TABLE: 'actions',
  COLUMNS: [{ sceneId: 'scene_id' }, 'name', 'description'],
  ACTIONS_COLUMNS: [
    'actions.name',
    'actions.type',
    'actions.body',
    { targetId: 'actions.target_id' },
  ],

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(sceneSchema, data);
  },

  findAll() {
    return knex(this.TABLE).select(this.COLUMNS);
  },

  findActionsBySceneId(sceneId) {
    return knex(this.ACTION_TABLE)
      .select(this.ACTIONS_COLUMNS)
      .where('scene_id', sceneId)
      .then(entries => {
        return entries.reduce((acc, entry) => {
          try {
            return acc.concat(
              Object.assign({}, entry, { body: JSON.parse(entry.body) }),
            );
          } catch (e) {
            return acc;
          }
        }, []);
      });
  },

  save({ name, description, actions }) {
    return knex.transaction(trx => {
      return trx
        .insert({ description, name })
        .into(this.TABLE)
        .then(([sceneId]) => {
          return Promise.all(
            actions.map(action => {
              const formatedAction = {
                type: action.type,
                name: action.name,
                scene_id: sceneId,
                body: JSON.stringify(action.body),
              };
              return trx.insert(formatedAction).into(this.ACTION_TABLE);
            }),
          );
        });
    });
  },

  delete(sceneId) {
    return knex.transaction(trx => {
      const removeScene = trx
        .del()
        .where('scene_id', sceneId)
        .into(this.TABLE);

      const removeActions = trx
        .del()
        .where('scene_id', sceneId)
        .into(this.ACTION_TABLE);

      return Promise.all([removeScene, removeActions]);
    });
  },
};

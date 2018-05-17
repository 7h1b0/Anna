const Ajv = require('ajv');
const knex = require('../../knexClient');
const sceneSchema = require('../schemas/scene');
const TABLE = 'scenes';
const ACTION_TABLE = 'actions';
const COLUMNS = [{ sceneId: 'scene_id' }, 'name', 'description'];
const ACTIONS_COLUMNS = [
  'actions.name',
  'actions.type',
  'actions.body',
  { targetId: 'actions.target_id' },
];

module.exports = {
  TABLE,
  ACTION_TABLE,
  COLUMNS,
  ACTIONS_COLUMNS,

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(sceneSchema, data);
  },

  findAll() {
    return knex(TABLE).select(COLUMNS);
  },

  findActionsBySceneId(sceneId) {
    return knex(ACTION_TABLE)
      .select(ACTIONS_COLUMNS)
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
        .into(TABLE)
        .then(([sceneId]) => {
          return Promise.all(
            actions.map(action => {
              const formatedAction = {
                type: action.type,
                name: action.name,
                scene_id: sceneId,
                body: JSON.stringify(action.body),
              };
              return trx.insert(formatedAction).into(ACTION_TABLE);
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
        .into(TABLE);

      const removeActions = trx
        .del()
        .where('scene_id', sceneId)
        .into(ACTION_TABLE);

      return Promise.all([removeScene, removeActions]);
    });
  },
};

const Ajv = require('ajv');
const knex = require('../../knexClient');
const sceneSchema = require('../schemas/scene');
const TABLE = 'scenes';
const COLUMNS = [
  { sceneId: 'scene_id' },
  'name',
  'description',
  { createdAt: 'created_at' },
  { updatedAt: 'updated_at' },
  { createdBy: 'created_by' },
];
const { TABLE: ACTION_TABLE, findBySceneId } = require('./action');

module.exports = {
  TABLE,
  COLUMNS,

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(sceneSchema, data);
  },

  findAll() {
    return knex(TABLE).select(COLUMNS);
  },

  findById(sceneId) {
    const fetchScene = knex(TABLE)
      .select(COLUMNS)
      .where('scene_id', sceneId);
    const fetchActions = findBySceneId(sceneId);

    return Promise.all([fetchScene, fetchActions]).then(([scene, actions]) => {
      if (scene.length > 0) {
        return Object.assign({}, scene[0], { actions });
      }
      return;
    });
  },

  findByIdAndUpdate({ sceneId, name, description, actions }) {
    return knex
      .transaction(trx => {
        return trx
          .update({ name, description, updated_at: new Date() })
          .where('scene_id', sceneId)
          .into(TABLE)
          .then(row => {
            if (row < 1) {
              throw new Error('No scene found');
            }
            return trx
              .del()
              .where('scene_id', sceneId)
              .into(ACTION_TABLE);
          })
          .then(() => {
            return Promise.all(
              actions.map(action => {
                const formatedAction = {
                  type: action.type,
                  name: action.name,
                  target_id: action.targetId,
                  scene_id: sceneId,
                  body: JSON.stringify(action.body),
                };
                return trx.insert(formatedAction).into(ACTION_TABLE);
              }),
            );
          });
      })
      .catch(err => {
        if (err.message === 'No scene found') {
          return 0;
        }
        throw err;
      });
  },

  save({ name, description, userId, actions }) {
    const date = new Date();
    return knex.transaction(trx => {
      return trx
        .insert({
          description,
          name,
          created_by: userId,
          updated_at: date,
          created_at: date,
        })
        .into(TABLE)
        .then(([sceneId]) => {
          return Promise.all(
            actions.map(action => {
              const formatedAction = {
                type: action.type,
                name: action.name,
                target_id: action.targetId,
                scene_id: sceneId,
                body: JSON.stringify(action.body),
              };
              return trx.insert(formatedAction).into(ACTION_TABLE);
            }),
          ).then(() => sceneId);
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

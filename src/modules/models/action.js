const knex = require('../../knexClient');

const TABLE = 'actions';
const COLUMNS = ['name', 'type', 'body', { targetId: 'target_id' }];

module.exports = {
  TABLE,
  COLUMNS,

  findBySceneId(sceneId) {
    return knex(TABLE)
      .select(COLUMNS)
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
};

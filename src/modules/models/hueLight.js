const knex = require('../../knexClient');
const { returnFirst } = require('../dbUtil');
const TABLE = 'lights';
const COLUMNS = [{ roomId: 'room_id' }, { lightId: 'light_id' }];

module.exports = {
  TABLE,
  COLUMNS,

  findRoomId(lightId) {
    return returnFirst(
      knex(TABLE)
        .select({ roomId: 'room_id' })
        .where('light_id', lightId),
    );
  },

  findAll() {
    return knex(TABLE).select(...COLUMNS);
  },

  save(lightId, roomId) {
    return knex(TABLE).insert({ light_id: lightId, room_id: roomId });
  },

  delete(lightId) {
    return knex(TABLE)
      .where('light_id', lightId)
      .del();
  },

  findByIdAndUpdate(lightId, roomId) {
    return knex(TABLE)
      .update({ room_id: roomId })
      .where('light_id', lightId);
  },
};

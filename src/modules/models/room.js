const Ajv = require('ajv');
const roomSchema = require('../schemas/room');
const knex = require('../../knexClient');
const { returnFirst } = require('../dbUtil');
const TABLE = 'rooms';
const COLUMNS = [{ roomId: 'room_id' }, 'description', 'name'];

module.exports = {
  TABLE,
  COLUMNS,

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(roomSchema, data);
  },

  findAll() {
    return knex(TABLE).select(COLUMNS);
  },

  findById(id) {
    return returnFirst(
      knex(TABLE)
        .select(COLUMNS)
        .where('room_id', id),
    );
  },

  save({ name, description }) {
    return knex(TABLE)
      .insert({ description, name })
      .then(([roomId]) => {
        return { description, roomId, name };
      });
  },

  delete(roomId) {
    return knex(TABLE)
      .where('room_id', roomId)
      .del();
  },

  findByIdAndUpdate(roomId, payload) {
    return knex(TABLE)
      .update(payload)
      .where('room_id', roomId);
  },
};

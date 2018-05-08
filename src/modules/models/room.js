const Ajv = require('ajv');
const roomSchema = require('../schemas/room');
const knex = require('../../knexClient');
const { returnFirst } = require('../dbUtil');

module.exports = {
  TABLE: 'rooms',
  COLUMNS: [{ roomId: 'room_id' }, 'description', 'name'],

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(roomSchema, data);
  },

  findAll() {
    return knex(this.TABLE).select(this.COLUMNS);
  },

  findById(id) {
    return returnFirst(
      knex(this.TABLE)
        .select(this.COLUMNS)
        .where('room_id', id),
    );
  },

  save({ name, description }) {
    return knex(this.TABLE)
      .insert({ description, name })
      .then(([roomId]) => {
        return { description, roomId, name };
      });
  },

  delete(roomId) {
    return knex(this.TABLE)
      .where('room_id', roomId)
      .del();
  },

  findByIdAndUpdate(roomId, payload) {
    return knex(this.TABLE)
      .update(payload)
      .where('room_id', roomId);
  },
};

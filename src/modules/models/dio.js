const Ajv = require('ajv');
const dioSchema = require('../schemas/dio');
const knex = require('../../knexClient');
const { returnFirst } = require('../dbUtil');
const TABLE = 'dios';

module.exports = {
  TABLE,

  validate(data) {
    const ajv = new Ajv();
    return ajv.validate(dioSchema, data);
  },

  findAll() {
    return knex(TABLE).select(
      { dioId: 'dio_id' },
      { roomId: 'room_id' },
      'name',
    );
  },

  findById(id) {
    return returnFirst(
      knex(TABLE)
        .select({ dioId: 'dio_id' }, { roomId: 'room_id' }, 'name')
        .where('dio_id', id),
    );
  },

  save({ dioId, roomId, name }) {
    return knex(TABLE)
      .insert({ dio_id: dioId, room_id: roomId, name })
      .then(() => {
        return { dioId, roomId, name };
      });
  },

  delete(dioId) {
    return knex(TABLE)
      .where('dio_id', dioId)
      .del();
  },

  findByIdAndUpdate(dioId, payload) {
    return knex(TABLE)
      .update(payload)
      .where('dio_id', dioId);
  },
};

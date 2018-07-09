const Ajv = require('ajv');
const roomSchema = require('../schemas/room');
const knex = require('../../knexClient');
const Dio = require('./dio');
const HueLight = require('./hueLight');
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

  async delete(roomId) {
    const res = await knex
      .select('room_id')
      .from(Dio.TABLE)
      .where('room_id', roomId)
      .unionAll(function() {
        this.select('room_id')
          .from(HueLight.TABLE)
          .where('room_id', roomId);
      });

    if (res.length === 0) {
      return knex(TABLE)
        .where('room_id', roomId)
        .del();
    }
    return Promise.resolve(0);
  },

  findByIdAndUpdate(roomId, payload) {
    return knex(TABLE)
      .update(payload)
      .where('room_id', roomId);
  },
};

const { TABLE: DIO } = require('../src/modules/models/dio');
const { TABLE: ROOM } = require('../src/modules/models/room');

exports.seed = function(knex, Promise) {
  const dios = knex(DIO)
    .del()
    .then(() => {
      return knex(DIO).insert([
        {
          dio_id: 1,
          name: 'dio_1',
          room_id: 1,
        },
        {
          dio_id: 2,
          name: 'dio_2',
          room_id: 1,
        },
        {
          dio_id: 3,
          name: 'dio_3',
          room_id: 2,
        },
      ]);
    });

  const rooms = knex(ROOM)
    .del()
    .then(() => {
      return knex(ROOM).insert([
        {
          room_id: 1,
          name: 'room_1',
          description: ' room 1',
        },
        {
          room_id: 2,
          name: 'room_2',
          description: ' room 2',
        },
        {
          room_id: 3,
          name: 'room_3',
          description: ' room 3',
        },
      ]);
    });

  return Promise.all([dios, rooms]);
};

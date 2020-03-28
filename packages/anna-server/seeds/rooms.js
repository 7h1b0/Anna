exports.seed = function (knex, Promise) {
  const TABLE = 'rooms';
  return knex(TABLE)
    .del()
    .then(() => {
      return knex(TABLE).insert([
        {
          roomId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          description: 'this is a test',
          name: 'room_1',
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
        {
          roomId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          description: 'this is a second test',
          name: 'room_2',
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
      ]);
    });
};

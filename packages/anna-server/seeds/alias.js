exports.seed = function (knex, Promise) {
  const TABLE = 'alias';
  return knex(TABLE)
    .del()
    .then(() => {
      return knex(TABLE).insert([
        {
          aliasId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          sceneId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test',
          description: 'test',
          enabled: true,
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
        {
          aliasId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          sceneId: '110c80e8-49e4-4d6b-b966-4fc9fb98879f',
          name: 'test_2',
          description: 'test',
          enabled: false,
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
      ]);
    });
};

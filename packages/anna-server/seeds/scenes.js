exports.seed = function (knex, Promise) {
  const TABLE = 'scenes';
  return knex(TABLE)
    .del()
    .then(() => {
      return knex(TABLE).insert([
        {
          sceneId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          description: 'this is a test',
          name: 'scene_1',
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
        {
          sceneId: '110c80e8-49e4-4d6b-b966-4fc9fb98879f',
          description: 'this is a second test',
          name: 'scene_2',
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
        {
          sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
          description: 'this is a second test',
          name: 'scene_3',
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
        },
      ]);
    });
};

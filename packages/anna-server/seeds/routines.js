exports.seed = function (knex, Promise) {
  const TABLE = 'routines';
  return knex(TABLE)
    .del()
    .then(() => {
      return knex(TABLE).insert([
        {
          routineId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          sceneId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test at 5am',
          interval: '0 5 * * *',
          enabled: true,
          runAtBankHoliday: true,
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
          nextRunAt: new Date('2018-01-02'),
        },
        {
          routineId: '110c80e8-49e4-4d6b-b966-4fc9fb98879f',
          sceneId: '10c1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test at 9am',
          interval: '0 9 * * *',
          enabled: true,
          runAtBankHoliday: false,
          createdBy: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          createdAt: new Date('2018-01-01'),
          updatedAt: new Date('2018-01-02'),
          nextRunAt: new Date('2018-01-02'),
        },
      ]);
    });
};

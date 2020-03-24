/**
 * Insert a fake user into user table
 * User is identified by test as username and anna as password
 */
exports.seed = function (knex, Promise) {
  const TABLE = 'users';
  return knex(TABLE)
    .del()
    .then(() => {
      return knex(TABLE).insert([
        {
          userId: 1,
          username: 'test',
          password:
            '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
          token: '8e6a76928f76d23665f78ff3688ca86422d5',
        },
      ]);
    });
};

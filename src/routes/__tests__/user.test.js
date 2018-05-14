const request = require('supertest');
const knex = require('../../knexClient');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

beforeAll(async () => {
  await knex(User.TABLE).truncate();
});

describe('User', () => {
  beforeEach(async () => {
    await knex(User.TABLE).insert(user);
  });

  afterEach(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/login', () => {
    it('should retun the token', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'anna' });

      expect(response.body).toEqual({
        username: user.username,
        token: user.token,
      });
    });

    it('should return 403 when providing a fake password', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'test', password: 'fake' });

      expect(response.status).toBe(403);
    });

    it('should return 403 when providing a fake username', async () => {
      const response = await request(app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ username: 'fake', password: 'test' });

      expect(response.status).toBe(403);
    });
  });
});

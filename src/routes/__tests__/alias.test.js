const request = require('supertest');
const knex = require('../../knexClient');
const Alias = require('../../modules/models/alias');
const User = require('../../modules/models/user');
const app = require('../../index.js');

const initAlias = [
  {
    alias_id: 1,
    scene_id: 1,
    name: 'test',
    description: 'test',
    enabled: true,
  },
  {
    alias_id: 2,
    scene_id: 1,
    name: 'test_2',
    description: 'test',
    enabled: false,
  },
];

const user = {
  user_id: 1,
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

describe('Alias', () => {
  beforeAll(async () => {
    await knex(Alias.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Alias.TABLE).insert(initAlias);
  });

  afterEach(async () => {
    await knex(Alias.TABLE).truncate();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
  });

  describe('/api/alias', () => {
    describe('GET', () => {
      it('should retun the token', async () => {
        const response = await request(app)
          .get('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/alias')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });
  });
});

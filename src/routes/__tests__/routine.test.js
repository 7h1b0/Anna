import request from 'supertest';
import knex from '../../knexClient';
import Routine from '../../modules/models/routine';
import * as User from '../../modules/models/user';
import app from '../../index.js';
import dispatch from '../../modules/dispatch';

jest
  .mock('../../modules/dispatch')
  .mock('../../modules/utils')
  .unmock('cron');

const initRoutines = [
  {
    routineId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
    name: 'test at 5am',
    interval: '0 5 * * *',
    enabled: true,
    runAtBankHoliday: true,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    routineId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: '10c1d78e-fd1c-4717-b610-65d2fa3d01b2',
    name: 'test at 9am',
    interval: '0 9 * * *',
    enabled: true,
    runAtBankHoliday: false,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

const user = {
  userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
  username: 'test',
  password: '$2a$10$4ftuQxquI/5NR3POJy.2O.DmscxoSdCBzUvlnX2iXGMxtpqhd3w6O', // anna
  token: '8e6a76928f76d23665f78ff3688ca86422d5',
};

describe('Routine API', () => {
  beforeAll(async () => {
    await knex(Routine.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Routine.TABLE).insert(initRoutines);
  });

  afterEach(async () => {
    await knex(Routine.TABLE).truncate();
    dispatch.mockClear();
  });

  afterAll(async () => {
    await knex(User.TABLE).truncate();
    await knex.destroy();
  });

  describe('/api/routines', () => {
    describe('GET', () => {
      it('should retun all routines', async () => {
        const response = await request(app)
          .get('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });
    });
  });

  describe('/api/routines/:routineId', () => {
    describe('GET', () => {
      it('should return one routine', async () => {
        const response = await request(app)
          .get(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.body).toMatchSnapshot();
      });

      it('should return 404 if routineId is unknow', async () => {
        const response = await request(app)
          .get('/api/routines/faked78e-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({});
      });
    });
  });
});

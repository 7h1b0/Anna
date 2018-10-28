import request from 'supertest';
import createUser from 'createUser';
import knex from '../../knexClient';
import * as Routine from '../../modules/models/routine';
import * as User from '../../modules/models/user';
import app from '../../index.js';
import * as RoutineService from '../../services/routineService';

jest.unmock('cron');

const user = createUser({ userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f' });
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

    describe('POST', () => {
      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
      });

      it('should retun 400 when routine is invalid', async () => {
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'room_updated',
          });

        expect(response.status).toBe(400);
      });

      it('should save and start a new routine', async () => {
        const spy = jest.spyOn(RoutineService, 'start');
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'new_routine',
            interval: '* * * * * *',
          });

        expect(response.status).toBe(201);
        expect(RoutineService.start.mock.calls).toMatchSnapshot();

        const routines = await knex(Routine.TABLE)
          .first()
          .where('routineId', response.body.routineId);

        expect(routines).toMatchSnapshot({
          routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

        spy.mockRestore();
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
          .get('/api/routines/faaed78e-fd1c-4717-b610-65d2fa3d01b2')
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

    describe('PATCH', () => {
      it('should return 404 if routineId is unknow', async () => {
        const response = await request(app)
          .patch('/api/routines/faaed78e-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'room_updated',
            interval: '* * * * * *',
          });

        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .patch(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake')
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'room_updated',
            interval: '* * * * * *',
          });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({});
      });

      it('should return 400 when routine is invalid', async () => {
        const response = await request(app)
          .patch(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'room_updated',
          });

        expect(response.status).toBe(400);
      });

      it('should update a routine', async () => {
        const spy = jest.spyOn(RoutineService, 'start');

        const response = await request(app)
          .patch(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'routine_updated',
            interval: '* * * * * *',
          });

        expect(response.status).toBe(204);
        expect(RoutineService.start.mock.calls).toMatchSnapshot();

        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', initRoutines[0].routineId);

        expect(routine).toMatchSnapshot({
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

        spy.mockRestore();
      });
    });

    describe('DELETE', () => {
      it('should return 404 if routineId is unknow', async () => {
        const response = await request(app)
          .delete('/api/routines/faaed78e-fd1c-4717-b610-65d2fa3d01b2')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(404);
        expect(response.body).toEqual({});
      });

      it('should return 401 when user is not authenticated', async () => {
        const response = await request(app)
          .delete(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBe(401);
        expect(response.body).toEqual({});
      });

      it('should delete and stop a routine', async () => {
        const spy = jest.spyOn(RoutineService, 'stop');

        const response = await request(app)
          .delete(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(204);
        expect(RoutineService.stop).toHaveBeenCalledWith(
          initRoutines[0].routineId,
        );

        const routines = await knex(Routine.TABLE)
          .select()
          .where('routineId', initRoutines[0].routineId);

        expect(routines).toHaveLength(0);

        spy.mockRestore();
      });
    });
  });

  describe('/api/routines/:routineId/action', () => {
    it('should run the routine', async () => {
      const spy = jest.spyOn(Routine, 'run');
      const response = await request(app)
        .get(`/api/routines/${initRoutines[0].routineId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
      expect(Routine.run).toHaveBeenCalled();
      expect(Routine.run.mock.calls).toMatchSnapshot();

      spy.mockRestore();
    });

    it('should return 404 if routineId is unknow', async () => {
      const response = await request(app)
        .get('/api/routines/faaed78e-fd1c-4717-b610-65d2fa3d01b2/action')
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({});
    });

    it('should return 401 when user is not authenticated', async () => {
      const response = await request(app)
        .get(`/api/routines/${initRoutines[0].routineId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', 'fake');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({});
    });
  });
});

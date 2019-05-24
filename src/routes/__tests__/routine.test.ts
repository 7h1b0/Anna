import request from 'supertest';
import lolex from 'lolex';
import { createUser } from 'factories';
import knex from '../../knexClient';
import * as Routine from '../../modules/models/routine';
import * as RoutineService from '../../services/routineService';
import * as User from '../../modules/models/user';
import app from '../../index';

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
  {
    routineId: '2fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
    sceneId: '10c1d78e-fd1c-4717-b610-65d2fa3d01b2',
    name: 'test at 12am',
    interval: '0 0 * * *',
    enabled: false,
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

        expect(response.status).toBeUnauthorized();
      });
    });

    describe('POST', () => {
      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toBeBadRequest();
      });

      it('should save and start a new routine', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:15') });
        const spy = jest.spyOn(Routine, 'run');
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'new_routine',
            interval: '30 * * * * *',
          });

        clock.next();
        clock.uninstall();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(response.status).toHaveStatusOk();

        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', response.body.routineId);

        expect(routine.nextRunAt).toEqual(
          new Date('2017-08-12T16:00:30').getTime(),
        );
        expect(routine).toMatchSnapshot({
          routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
          nextRunAt: expect.any(Number),
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

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toBeUnauthorized();
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

        expect(response.status).toBeBadRequest();
      });

      it('should disable routine', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:00') });
        const mock = jest.fn();

        await RoutineService.load(mock);
        expect(clock.countTimers()).toBe(2);

        const response = await request(app)
          .patch(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'routine_updated',
            interval: '0 5 * * *',
            enabled: false,
          });

        expect(response.status).toHaveStatusOk();
        expect(clock.countTimers()).toBe(1);

        clock.next();
        expect(Date.now()).toBe(new Date('2017-08-13T09:00:00').getTime());
        expect(mock).toHaveBeenCalledTimes(1);
        clock.uninstall();

        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', initRoutines[0].routineId);

        expect(routine.nextRunAt).toEqual(
          new Date('2017-08-13T05:00:00').getTime(),
        );
        expect(routine).toMatchSnapshot({
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
          nextRunAt: expect.any(Number),
        });
      });

      it('should enable routine and compute nextRunAt', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:00') });

        const response = await request(app)
          .patch(`/api/routines/${initRoutines[2].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'routine_updated',
            interval: '0 12 * * *',
            enabled: true,
          });

        expect(response.status).toHaveStatusOk();
        expect(clock.countTimers()).toBe(1);

        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', initRoutines[2].routineId);

        expect(routine.nextRunAt).toEqual(
          new Date('2017-08-13T12:00:00').getTime(),
        );
        expect(routine).toMatchSnapshot({
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
          nextRunAt: expect.any(Number),
        });

        clock.uninstall();
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

        expect(response.status).toBeUnauthorized();
        expect(response.body).toEqual({});
      });

      it('should delete and stop a routine', async () => {
        const clock = lolex.install();

        const response = await request(app)
          .delete(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toHaveStatusOk();
        expect(clock.countTimers()).toBe(0);
        clock.uninstall();

        const routines = await knex(Routine.TABLE).select('routineId');
        expect(routines).toHaveLength(2);
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

      expect(response.status).toHaveStatusOk();
      expect(response.body).toEqual({});
      expect(Routine.run).toHaveBeenCalled();

      // @ts-ignore
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

      expect(response.status).toBeUnauthorized();
      expect(response.body).toEqual({});
    });
  });
});

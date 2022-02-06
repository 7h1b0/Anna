import request from 'supertest';
import * as lolex from '@sinonjs/fake-timers';
import { setTimeout } from 'timers/promises';

import { createUser } from 'factories';
import knex from '../../knexClient';
import * as Routine from '../../modules/routine/model';
import * as User from '../../modules/user/model';
import app from '../../index';
import dispatch from '../../utils/dispatch';

jest.mock('../../utils/dispatch');

const user = createUser({ userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f' });
const useraway = createUser({
  userId: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879g',
  token: 'user_away_token',
  isAway: true,
});
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
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert([user, useraway]);
  });

  beforeEach(async () => {
    // @ts-expect-error dispatch is a mock
    dispatch.mockClear();
    await knex(Routine.TABLE).truncate();
    await knex(Routine.TABLE).insert(initRoutines);
  });

  describe('/api/routines', () => {
    describe('GET', () => {
      it('should retun all routines', async () => {
        const response = await request(app)
          .get('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);

        expect(response.status).toBe(200);
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

      it('should retun 400 when interval is invalid', async () => {
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'room_updated',
            interval: '30* * * * *',
          });

        expect(response.status).toBeBadRequest();
      });

      it('should save and start a new routine', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:15') });
        const payload = {
          sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'new_routine',
          interval: '30 * * * * *',
        };
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(payload);

        clock.next();
        clock.uninstall();

        // FIXME: Dispatch needs to fetch user status before calling dispatch
        await setTimeout(1000);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SCENE',
          targetId: payload.sceneId,
        });
        expect(response.status).toHaveStatusOk();

        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', response.body.routineId);

        expect(routine).toMatchSnapshot({
          routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
          createdAt: expect.any(Number),
          updatedAt: expect.any(Number),
          nextRunAt: expect.any(Number),
          lastRunAt: expect.any(Number),
        });
      });

      it('should skip a routine when user is away', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:15') });
        const payload = {
          sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'new_routine',
          interval: '30 * * * * *',
        };
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', useraway.token)
          .send(payload);

        clock.next();
        clock.uninstall();

        expect(response.status).toHaveStatusOk();
        expect(dispatch).not.toHaveBeenCalled();

        // FIXME: wait for routine run to update the object
        await setTimeout(1000);
        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', response.body.routineId);

        expect(routine.lastStatus).toBe('skipped');
      });

      it('should allow to run a routine even is user is away', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:15') });
        const payload = {
          sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'new_routine',
          interval: '30 * * * * *',
          runWhenUserIsAway: true,
        };
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', useraway.token)
          .send(payload);

        clock.next();
        clock.uninstall();

        expect(response.status).toHaveStatusOk();

        // FIXME: Dispatch needs to fetch user status before calling dispatch
        await setTimeout(1000);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SCENE',
          targetId: payload.sceneId,
        });
      });

      it('should create a temporary routine', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:00') });
        const payload = {
          sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01dd',
          name: 'new_routine',
          interval: `${Date.now() + 2000}`,
        };
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send(payload);

        expect(response.status).toHaveStatusOk();

        await clock.nextAsync();

        // FIXME: Dispatch needs to fetch user status before calling dispatch
        await setTimeout(1000);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: 'SCENE',
          targetId: payload.sceneId,
        });
        expect(clock.countTimers()).toBeFalsy();

        clock.uninstall();
      });

      it('should reject temporary routine in the past', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:00') });
        const response = await request(app)
          .post('/api/routines')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'new_routine',
            interval: `${Date.now() - 10000}`,
          });

        expect(response.status).toBeBadRequest();
        expect(clock.countTimers()).toBeFalsy();

        clock.uninstall();
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

      it('should return 400 when interval is invalid', async () => {
        const response = await request(app)
          .patch(`/api/routines/${initRoutines[0].routineId}`)
          .set('Accept', 'application/json')
          .set('x-access-token', user.token)
          .send({
            sceneId: 'faaed78e-fd1c-4717-b610-65d2fa3d01b2',
            name: 'room_updated',
            interval: '05* * *',
          });

        expect(response.status).toBeBadRequest();
      });

      it('should disable routine', async () => {
        const clock = lolex.install({ now: new Date('2017-08-12T16:00:00') });

        await Routine.load();
        expect(clock.countTimers()).toBe(2); // routines 0 and 1 should run

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
        expect(clock.countTimers()).toBe(1); // routine 0 should be disabled

        clock.next();
        expect(Date.now()).toBe(new Date('2017-08-13T09:00:00').getTime());

        // FIXME: Dispatch needs to fetch user status before calling dispatch
        await setTimeout(1000);
        expect(dispatch).toHaveBeenCalledTimes(1);
        clock.uninstall();

        const routine = await knex(Routine.TABLE)
          .first()
          .where('routineId', initRoutines[0].routineId);

        expect(routine.enabled).toBeFalsy();
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
      const runSpy = jest.spyOn(Routine, 'run');
      const response = await request(app)
        .get(`/api/routines/${initRoutines[0].routineId}/action`)
        .set('Accept', 'application/json')
        .set('x-access-token', user.token);

      expect(response.status).toHaveStatusOk();
      expect(response.body).toEqual({});
      expect(Routine.run).toHaveBeenCalled();

      expect(runSpy.mock.calls).toMatchSnapshot();
      runSpy.mockRestore();
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

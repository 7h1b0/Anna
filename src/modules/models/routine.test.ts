import * as lolex from 'lolex';
import knex from '../../knexClient';
import * as Routine from './routine';
import dispatch from '../dispatch';

jest.mock('../dispatch');

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
    nextRunAt: new Date('2018-01-02'),
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
    nextRunAt: new Date('2018-01-02'),
  },
];

describe('Routines', () => {
  beforeAll(async () => {
    await knex(Routine.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Routine.TABLE).insert(initRoutines);
  });

  afterEach(async () => {
    await knex(Routine.TABLE).truncate();
  });

  describe('findAll', () => {
    it('should return all routines', async () => {
      const result = await Routine.findAll();
      expect(result).toMatchSnapshot();
    });
  });

  describe('findById', () => {
    it('should return only one routine', async () => {
      const result = await Routine.findById(initRoutines[0].routineId);
      expect(result).toMatchSnapshot();
    });

    it('should return undefined', async () => {
      const result = await Routine.findById('-1');
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new routine and use default params', async () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const { routineId } = await Routine.save(
        'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
        'test_3',
        '20c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        '0 12 * * *',
      );
      clock.uninstall();

      const routine = await knex(Routine.TABLE)
        .first()
        .where('routineId', routineId);

      expect(routine.nextRunAt).toEqual(new Date('2017-08-15T12:00').getTime());
      expect(routine).toMatchSnapshot({
        routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        nextRunAt: expect.any(Number),
      });
    });

    it('should save a new routine', async () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const { routineId } = await Routine.save(
        'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
        'test_3',
        '20c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        '0 12 * * *',
        true,
        false,
      );
      clock.uninstall();

      const routine = await knex(Routine.TABLE)
        .first()
        .where('routineId', routineId);

      expect(routine.nextRunAt).toEqual(new Date('2017-08-16T12:00').getTime());
      expect(routine).toMatchSnapshot({
        routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        nextRunAt: expect.any(Number),
      });
    });
  });

  describe('remove', () => {
    it('should remove a routine', async () => {
      await Routine.remove(initRoutines[0].routineId);
      const routines = await knex(Routine.TABLE).select('routineId');

      expect(routines).toHaveLength(1);
    });

    it('should not remove a routine if routineId is unknow', async () => {
      await Routine.remove('fake-id');
      const routines = await knex(Routine.TABLE).select('routineId');

      expect(routines).toHaveLength(initRoutines.length);
    });
  });

  describe('validate', () => {
    it('should return true if routine is valid #1', () => {
      const routine = {
        name: 'My routine',
        sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        interval: '* * * * *',
      };

      expect(Routine.validate(routine)).toBeTruthy();
    });

    it('should return true if routine is valid #2', () => {
      const routine = {
        name: 'My routine',
        sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        interval: '* * * * *',
        runAtBankHoliday: true,
        enabled: true,
      };
      expect(Routine.validate(routine)).toBeTruthy();
    });

    it('should return false if a property is unknow', () => {
      const routine = {
        routineId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'My routine',
        sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        interval: '* * * * *',
        createdBy: 'test_user',
      };

      expect(Routine.validate(routine)).toBeFalsy();
    });
  });

  describe('computeNextRunAt', () => {
    it('should compute the next date', () => {
      const clock = lolex.install({ now: new Date('2017-08-12T16:00') });
      const nextRunAt = Routine.computeNextRunAt('0 12 * * *');
      clock.uninstall();

      expect(nextRunAt).toEqual(new Date('2017-08-13T12:00'));
    });

    it('should handle bank holiday to compute the next date', () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const nextRunAt = Routine.computeNextRunAt('0 12 * * *', false);
      clock.uninstall();

      expect(nextRunAt).toEqual(new Date('2017-08-16T12:00'));
    });

    it('should ignore bank holiday to compute the next date', () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const nextRunAt = Routine.computeNextRunAt('0 12 * * *', true);
      clock.uninstall();

      expect(nextRunAt).toEqual(new Date('2017-08-15T12:00'));
    });
  });

  describe('run', () => {
    it('should dispatch a sceneId and compute nextRunAt', async () => {
      const clock = lolex.install({ now: new Date('2017-08-14T16:00') });
      const res = await Routine.run(initRoutines[0]);
      clock.uninstall();

      expect(res).toEqual(1);
      const routine = await knex(Routine.TABLE)
        .first()
        .where('routineId', initRoutines[0].routineId);

      expect(routine).toEqual(
        expect.objectContaining({
          nextRunAt: new Date('2017-08-15T05:00').getTime(),
          lastRunAt: new Date('2017-08-14T16:00').getTime(),
        }),
      );
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SCENE',
        targetId: initRoutines[0].sceneId,
      });
    });

    it("should launch the routine even if it doesn't run on bank holiday", async () => {
      const clock = lolex.install({ now: new Date('2017-08-15T16:00') });
      await Routine.run(initRoutines[1]);
      clock.uninstall();

      expect(dispatch).toHaveBeenCalled();
    });
  });

  // TODO: Add test on findByIdAndUpdate
});

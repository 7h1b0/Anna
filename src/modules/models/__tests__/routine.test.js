import knex from '../../../knexClient';
import Routine from '../routine';
import dispatch from '../../dispatch';
import { isBankHoliday } from '../../utils';

jest
  .mock('../../dispatch')
  .mock('../../utils')
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
      const result = await Routine.findById(-1);
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new routine', async () => {
      const id = await Routine.save(
        'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
        'test_3',
        '20c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        'schedule',
      );
      const routine = await knex(Routine.TABLE)
        .first()
        .where('routineId', id);

      expect(routine).toMatchSnapshot({
        routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        sceneId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('remove', () => {
    it('should remove a routine', async () => {
      const res = await Routine.remove(initRoutines[0].routineId);
      expect(res).toBe(1);

      const routine = await knex(Routine.TABLE)
        .first()
        .where('routineId', initRoutines[0].routineId);

      expect(routine).toBeUndefined();
    });

    it('should not remove a routine if routineId is unknow', async () => {
      const res = await Routine.remove('fake-id');
      expect(res).toBe(0);
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
        routineId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'My routine',
        sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
        interval: '* * * * *',
        runAtBankHoliday: true,
        createdAt: Date.now(),
      };
      expect(Routine.validate(routine)).toBeTruthy();
    });

    it('should return false if a property is unknow', () => {
      const routine = {
        routineId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'My routine',
        sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
        interval: '* * * * *',
        admin: true,
      };

      expect(Routine.validate(routine)).toBeFalsy();
    });
  });

  describe('computeNextRunAt', () => {
    it('should compute the next date the routine will execute', () => {
      isBankHoliday.mockImplementation(() => false);
      Date.now = jest
        .fn()
        .mockImplementationOnce(cb => new Date('2017-09-01T16:00').getTime());

      const routine = {
        interval: '0 12 * * *',
        runAtBankHoliday: false,
      };

      const nextRunAt = Routine.computeNextRunAt(routine);
      expect(nextRunAt).toEqual(new Date('2017-09-02T12:00'));
    });

    it('should handle bank holiday to compute the next date the routine will execute', () => {
      isBankHoliday.mockImplementation(() => true);
      Date.now = jest
        .fn()
        .mockImplementationOnce(cb => new Date('2017-08-14T16:00').getTime());

      const routine = {
        interval: '0 12 * * *',
        runAtBankHoliday: false,
      };

      const nextRunAt = Routine.computeNextRunAt(routine);
      expect(nextRunAt).toEqual(new Date('2017-08-16T12:00'));
    });
  });

  describe('run', () => {
    beforeAll(async () => {
      Routine.computeNextRunAt = jest.fn(() => new Date(2010, 5, 5));
      Routine.findByIdAndUpdate = jest.fn(() => Promise.resolve());
    });

    it('should dispatch a sceneId and call findByIdAndUpdate', async () => {
      await Routine.run(initRoutines[0]);

      expect(Routine.computeNextRunAt).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: 'SCENE',
        id: initRoutines[0].sceneId,
      });

      expect(Routine.findByIdAndUpdate).toHaveBeenCalledWith(
        initRoutines[0].routineId,
        {
          routineId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          sceneId: '00c1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test at 5am',
          interval: '0 5 * * *',
          enabled: true,
          runAtBankHoliday: true,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: initRoutines[0].createdAt,
          updatedAt: expect.any(Date),
          lastRunAt: expect.any(Date),
          nextRunAt: new Date(2010, 5, 5),
          failReason: '""',
          lastFailedAt: undefined,
        },
      );
    });

    it("should return is routine don't run on bank holiday", async () => {
      isBankHoliday.mockImplementation(() => true);
      await Routine.run(initRoutines[1]);

      expect(dispatch).not.toHaveBeenCalled();
      expect(Routine.findByIdAndUpdate).not.toHaveBeenCalled();
    });
  });
});

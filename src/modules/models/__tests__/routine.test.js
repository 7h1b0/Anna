import knex from '../../../knexClient';
import Routine from '../routine';
import dispatch from '../../dispatch';
import { isBankHoliday } from '../../utils';

jest.mock('../../dispatch');
jest.mock('../../utils');

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
    dispatch.mockClear();
  });

  afterAll(async () => {
    await knex.destroy();
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
        .first('*')
        .where('routineId', id);

      expect(routine).toMatchSnapshot({
        routineId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        sceneId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('run', () => {
    beforeAll(async () => {
      Routine.computeNextRunAt = jest.fn(() => new Date(2010, 5, 5));
      Routine.findByIdAndUpdate = jest.fn(() => Promise.resolve());
    });

    afterEach(async () => {
      Routine.findByIdAndUpdate.mockClear();
      Routine.computeNextRunAt.mockClear();
      isBankHoliday.mockClear();
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

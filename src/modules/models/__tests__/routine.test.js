import MockDate from 'mockdate';
import knex from '../../../knexClient';
import * as Routine from '../routine';
const initRoutines = [
  {
    routine_id: 1,
    scene_id: 1,
    name: 'test at 5am',
    schedule: '0 5 * * *',
    enabled: true,
    run_at_bank_holiday: true,
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
  },
  {
    routine_id: 2,
    scene_id: 1,
    name: 'test at 9am',
    schedule: '0 9 * * *',
    enabled: true,
    run_at_bank_holiday: true,
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
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
    MockDate.reset();
    await knex(Routine.TABLE).truncate();
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
      const result = await Routine.findById(1);
      expect(result).toMatchSnapshot();
    });

    it('should return undefined', async () => {
      const result = await Routine.findById(-1);
      expect(result).toBe(undefined);
    });
  });

  describe('save', () => {
    it('should save a new routine', async () => {
      const id = await Routine.save(1, 'test_3', 1, 'schedule');
      const routine = await knex(Routine.TABLE)
        .select('*')
        .where('routine_id', id);
      expect(routine[0]).toMatchSnapshot({
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      });
    });
  });
});

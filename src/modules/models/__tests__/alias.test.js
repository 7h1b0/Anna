import knex from '../../../knexClient';
import * as Alias from '../alias';
const initAlias = [
  {
    aliasId: 1,
    sceneId: 1,
    name: 'test',
    description: 'test',
    enabled: true,
    createdBy: 1,
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    aliasId: 2,
    sceneId: 1,
    name: 'test_2',
    description: 'test',
    enabled: false,
    createdBy: 1,
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

describe('Alias', () => {
  beforeAll(async () => {
    await knex(Alias.TABLE).truncate();
  });

  beforeEach(async () => {
    await knex(Alias.TABLE).insert(initAlias);
  });

  afterEach(async () => {
    await knex(Alias.TABLE).truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('findAll', () => {
    it('should return all alias', async () => {
      const result = await Alias.findAll();
      expect(result).toEqual(initAlias);
    });
  });

  describe('findById', () => {
    it('should return only one alias', async () => {
      const result = await Alias.findById(1);
      expect(result).toMatchSnapshot(initAlias[0]);
    });

    it('should return undefined', async () => {
      const result = await Alias.findById(-1);
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new alias', async () => {
      const save = {
        aliasId: 3,
        sceneId: 1,
        name: 'test_3',
        description: 'test',
        enabled: false,
        userId: 1,
      };

      const res = await Alias.save(save);
      const alias = await knex(Alias.TABLE)
        .first('*')
        .where('aliasId', res.aliasId);

      expect(alias).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should accept when an alias as a name already taken', async () => {
      const save = {
        aliasId: 3,
        sceneId: 1,
        name: 'test',
        description: 'test',
        enabled: false,
      };

      await expect(Alias.save(save)).resolves.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete an alias', async () => {
      await Alias.remove(1);
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toEqual([initAlias[1]]);
    });

    it('should not delete an alias', async () => {
      await Alias.remove(-1);
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toEqual(initAlias);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a alias', async () => {
      await Alias.findByIdAndUpdate(1, { name: 'updated' });
      const alias = await knex(Alias.TABLE)
        .first('*')
        .where('aliasId', 1);
      expect(alias).toMatchSnapshot({
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should not update an alias if id is unknow', async () => {
      await Alias.findByIdAndUpdate(-1, { name: 'updated' });
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toEqual(initAlias);
    });
  });

  describe('validate', () => {
    it('should return true when an alias is valid', () => {
      const alias = {
        sceneId: 1,
        name: 'test_t',
        description: 'testtest',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeTruthy();
    });

    it('should return false when an alias is missing a props', () => {
      const alias = {
        sceneId: 1,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return false when an alias has unknow props', () => {
      const alias = {
        sceneId: 1,
        name: 'test_t',
        description: 'testtest',
        enabled: false,
        test: 2,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return false name is incorrect', () => {
      const alias = {
        sceneId: 1,
        name: 'tt',
        description: 'testtest',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return false description is too small', () => {
      const alias = {
        sceneId: 1,
        name: 'test_t',
        description: 'tt',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return true when an alias is valid even if description is missing', () => {
      const alias = {
        sceneId: 1,
        name: 'test_t',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeTruthy();
    });
  });
});

const MockDate = require('mockdate');
const knex = require('../../../knexClient');
const Alias = require('../alias');
const initAlias = [
  {
    alias_id: 1,
    scene_id: 1,
    name: 'test',
    description: 'test',
    enabled: true,
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
  },
  {
    alias_id: 2,
    scene_id: 1,
    name: 'test_2',
    description: 'test',
    enabled: false,
    created_by: 1,
    created_at: new Date('2018-01-01'),
    updated_at: new Date('2018-01-02'),
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
    MockDate.reset();
    await knex(Alias.TABLE).truncate();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  describe('findAll', () => {
    it('should return all alias', async () => {
      const result = await Alias.findAll();
      expect(result).toMatchSnapshot();
    });
  });

  describe('findById', () => {
    it('should return only one alias', async () => {
      const result = await Alias.findById(1);
      expect(result).toMatchSnapshot();
    });

    it('should return undefined', async () => {
      const result = await Alias.findById(-1);
      expect(result).toBe(undefined);
    });
  });

  describe('findByName', () => {
    it('should return only one alias', async () => {
      const result = await Alias.findByName('test');
      expect(result).toMatchSnapshot();
    });

    it('should return undefined', async () => {
      const result = await Alias.findByName('no');
      expect(result).toBe(undefined);
    });
  });

  describe('save', () => {
    it('should save a new alias', async () => {
      MockDate.set('2018-05-05');
      const save = {
        aliasId: 3,
        sceneId: 1,
        name: 'test_3',
        description: 'test',
        enabled: false,
        userId: 1,
      };

      await Alias.save(save);
      const alias = await knex(Alias.TABLE)
        .select('*')
        .where('alias_id', 3);
      expect(alias).toMatchSnapshot();
    });

    it('should reject when an alias as a name already taken', async () => {
      const save = {
        alias_id: 3,
        scene_id: 1,
        name: 'test',
        description: 'test',
        enabled: false,
      };

      await expect(Alias.save(save)).rejects.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete an alias', async () => {
      await Alias.delete(1);
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toMatchSnapshot();
    });

    it('should not delete an alias', async () => {
      await Alias.delete(-1);
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toEqual(initAlias);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a alias', async () => {
      MockDate.set('2018-05-05');
      await Alias.findByIdAndUpdate(1, { name: 'updated' });
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toMatchSnapshot();
    });

    it('should not update an alias if id is unknow', async () => {
      await Alias.findByIdAndUpdate(-1, { name: 'updated' });
      const alias = await knex(Alias.TABLE).select('*');
      expect(alias).toEqual(initAlias);
    });

    it('should reject when updated with a name already taken', async () => {
      await expect(
        Alias.findByIdAndUpdate(1, { name: 'test_2' }),
      ).rejects.toBeDefined();
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
        name: 'test_2',
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

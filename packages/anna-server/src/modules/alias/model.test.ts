import * as lolex from '@sinonjs/fake-timers';
import dispatch from '../../utils/dispatch';
import TYPES from '../../utils/type';

import knex from '../../knexClient';
import * as Alias from './model';

jest.mock('../../utils/dispatch');

const initAlias = [
  {
    aliasId: '0fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
    name: 'test',
    description: 'test',
    enabled: true,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
  {
    aliasId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
    sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
    name: 'test_2',
    description: 'test',
    enabled: false,
    createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
    createdAt: new Date('2018-01-01'),
    updatedAt: new Date('2018-01-02'),
  },
];

describe('Alias', () => {
  beforeEach(async () => {
    await knex(Alias.TABLE).truncate();
    await knex(Alias.TABLE).insert(initAlias);
  });

  describe('findAll', () => {
    it('should return all alias', async () => {
      const result = await Alias.findAll();
      expect(result).toMatchSnapshot();
    });
  });

  describe('findById', () => {
    it('should return only one alias', async () => {
      const result = await Alias.findById(initAlias[0].aliasId);
      expect(result).toMatchSnapshot();
    });

    it('should return undefined', async () => {
      const result = await Alias.findById('-1');
      expect(result).toBeUndefined();
    });
  });

  describe('save', () => {
    it('should save a new alias', async () => {
      const save = {
        sceneId: 'fa1834fe-40c8-4a6f-9b74-b79be7694644',
        name: 'test_3',
        description: 'test',
        enabled: false,
        createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
      };

      const aliasId = await Alias.save(save);
      const alias = await knex(Alias.TABLE).first().where('aliasId', aliasId);

      expect(alias).toMatchSnapshot({
        aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it('should accept when an alias as a name already taken', async () => {
      const save = {
        sceneId: '1',
        name: 'test',
        description: 'test',
        enabled: false,
        createdBy: '',
      };

      await expect(Alias.save(save)).resolves.toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete an alias', async () => {
      await Alias.remove(initAlias[0].aliasId);
      const alias = await knex(Alias.TABLE).select();
      expect(alias).toHaveLength(1);
      expect(alias[0]).toHaveProperty(
        'aliasId',
        '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
      );
    });

    it('should not delete an alias', async () => {
      await Alias.remove('-1');
      const alias = await knex(Alias.TABLE).select();
      expect(alias).toHaveLength(initAlias.length);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('should update a alias safely', async () => {
      await Alias.findByIdAndUpdate(initAlias[0].aliasId, {
        name: 'updated',
        aliasId: 'pwned',
        createdBy: 'Mr. Robot',
      });
      const alias = await knex(Alias.TABLE)
        .first()
        .where('aliasId', initAlias[0].aliasId);

      expect(alias).toMatchSnapshot({
        aliasId: expect.stringMatching(/[a-fA-F0-9-]{36}/),
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it('should not update an alias if id is unknow', async () => {
      await Alias.findByIdAndUpdate('-1', { name: 'updated' });
      const alias = await knex(Alias.TABLE).select();
      expect(alias).toMatchSnapshot();
    });
  });

  describe('validate', () => {
    it('should return true when an alias is valid', () => {
      const alias = {
        sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test_t',
        description: 'testtest',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeTruthy();
    });

    it('should return false when an alias is missing a props', () => {
      const alias = {
        sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return false when an alias has unknow props', () => {
      const alias = {
        sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test_t',
        description: 'testtest',
        enabled: false,
        test: 2,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return false name is incorrect', () => {
      const alias = {
        sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'TT',
        description: 'testtest',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return false description is too small', () => {
      const alias = {
        sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test_t',
        description: 'tt',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeFalsy();
    });

    it('should return true when an alias is valid even if description is missing', () => {
      const alias = {
        sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
        name: 'test_t',
        enabled: false,
      };

      expect(Alias.validate(alias)).toBeTruthy();
    });
  });

  describe('resolveActiveAlias', () => {
    it('should return nothing if no alias is enabled', () => {
      const aliases = [
        {
          aliasId: '1',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test_t',
          description: 'testtest',
          enabled: false,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
        {
          aliasId: '2',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'test_d',
          description: 'test',
          enabled: false,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
      ];

      expect(Alias.resolveActiveAlias(aliases)).not.toBeDefined();
    });

    it('should return false when an alias is missing a props', () => {
      const aliases = [
        {
          aliasId: '1',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test_t',
          description: 'testtest',
          enabled: false,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
        {
          aliasId: '2',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'test_d',
          description: 'test',
          enabled: true,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
      ];

      expect(Alias.resolveActiveAlias(aliases)).toEqual(aliases[1]);
    });

    it('should return the right alias depending on time condition', () => {
      const clock = lolex.install({ now: new Date('2017-08-14T08:00') });
      const aliases = [
        {
          aliasId: '1',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test_t',
          description: 'testtest',
          enabled: true,
          startTime: 8,
          endTime: 18,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
        {
          aliasId: '2',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'test_d',
          description: 'test',
          enabled: true,
          startTime: 18,
          endTime: 8,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
      ];

      const res = Alias.resolveActiveAlias(aliases);
      clock.uninstall();

      expect(res).toEqual(aliases[0]);
    });

    it('should return the right alias depending on time condition', () => {
      const clock = lolex.install({ now: new Date('2017-08-14T18:00') });
      const aliases = [
        {
          aliasId: '1',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b2',
          name: 'test_t',
          description: 'testtest',
          enabled: true,
          startTime: 8,
          endTime: 18,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
        {
          aliasId: '2',
          sceneId: '1fc1d78e-fd1c-4717-b610-65d2fa3d01b3',
          name: 'test_d',
          description: 'test',
          enabled: true,
          startTime: 18,
          endTime: 8,
          createdBy: 'c10c80e8-49e4-4d6b-b966-4fc9fb98879f',
          createdAt: new Date('2018-01-01').getTime(),
          updatedAt: new Date('2018-01-02').getTime(),
        },
      ];

      const res = Alias.resolveActiveAlias(aliases);
      clock.uninstall();

      expect(res).toEqual(aliases[1]);
    });
  });

  describe('processAlias', () => {
    it('should dispatch a scene action when an enabled alias is called', async () => {
      const aliasTarget = initAlias[0];
      const result = await Alias.processAlias(aliasTarget.name);

      expect(result).toBe('success');

      expect(dispatch).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledWith({
        type: TYPES.SCENE,
        targetId: aliasTarget.sceneId,
      });
    });

    it('should not call dispatch and return not_found is alias is disabled', async () => {
      const aliasTarget = initAlias[1];
      const result = await Alias.processAlias(aliasTarget.name);

      expect(result).toBe('not_found');
      expect(dispatch).not.toHaveBeenCalled();
    });
  });
});

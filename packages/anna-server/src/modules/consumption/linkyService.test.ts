import knex from '../../knexClient';
import * as lolex from '@sinonjs/fake-timers';
import linky from '@bokub/linky';

import * as scheduleService from 'services/scheduleService';
import * as Consumption from 'modules/consumption/model';
import { getRange, fetchLinkyData, run } from './linkyService';

const twentieth = {
  date: new Date(Date.UTC(2020, 7, 20)),
  value: 5.01,
};
const initConsumptions = [twentieth];

jest.mock('@bokub/linky', () => {
  return {
    login: jest.fn().mockResolvedValue({
      getDailyData: jest.fn().mockResolvedValue([
        {
          date: new Date(Date.UTC(2020, 7, 20)),
          value: 5.01,
        },
      ]),
    }),
  };
});
jest.mock('services/scheduleService', () => {
  return {
    schedule: jest.fn(),
  };
});

describe('LinkyService', () => {
  beforeEach(async () => {
    await knex(Consumption.TABLE).truncate();
    await knex(Consumption.TABLE).insert(initConsumptions);
  });

  describe('getRange', () => {
    it('should compute a range between today and the last entry in database', async () => {
      const clock = lolex.install({ now: new Date('2020-08-25T16:00') });
      const result = await getRange();
      clock.uninstall();

      expect(result).toEqual({
        start: '21/08/2020',
        end: '24/08/2020',
      });
    });

    it('should fallback to one week if there is no entry in the database', async () => {
      await knex(Consumption.TABLE).truncate();
      const clock = lolex.install({ now: new Date('2020-08-25T16:00') });
      const result = await getRange();
      clock.uninstall();

      expect(result).toEqual({
        start: '17/08/2020',
        end: '24/08/2020',
      });
    });

    it('should return null if last entry is yesterday or after', async () => {
      const clock = lolex.install({ now: new Date('2020-08-21T16:00') });
      const result = await getRange();
      clock.uninstall();

      expect(result).toBeNull();
    });
  });

  describe('fetchLinkyData', () => {
    it('should call getDailyData() and save', async () => {
      const saveSpy = jest.spyOn(Consumption, 'save');
      const clock = lolex.install({ now: new Date('2020-08-25T16:00') });
      await fetchLinkyData();
      clock.uninstall();

      expect(saveSpy).toHaveBeenCalledWith([twentieth]);
      expect(linky.login).toHaveBeenCalled();
    });

    it('should not call linky module if last entries if yesterday', async () => {
      const spy = jest.spyOn(Consumption, 'save');
      const clock = lolex.install({ now: new Date('2020-08-21T16:00') });
      await fetchLinkyData();
      clock.uninstall();

      expect(spy).not.toHaveBeenCalled();
      expect(linky.login).not.toHaveBeenCalled();
    });
  });

  describe('run', () => {
    xit('should call getDailyData() and save', async () => {
      run();
      expect(scheduleService.schedule).toHaveBeenCalledWith(
        'linky',
        '0 0 10 * * *',
        expect.anything(),
      );
    });
  });
});

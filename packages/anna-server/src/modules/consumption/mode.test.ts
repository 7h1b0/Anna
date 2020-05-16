import knex from '../../knexClient';
import * as lolex from '@sinonjs/fake-timers';
import * as Consumption from './model';
import type { Consumption as ConsumptionType } from './model';

const seventeenth = {
  date: new Date('2020-08-17T16:00'),
  power: 7.0,
};
const twentieth = {
  date: new Date('2020-08-20T16:00'),
  power: 5.01,
};
const twentyFirst = {
  date: new Date('2020-08-21T16:00'),
  power: 5.01,
};
const initConsumptions = [seventeenth, twentieth, twentyFirst];

function formatTimestamp(consumptions): ConsumptionType[] {
  return consumptions.map((consumption) => ({
    date: consumption.date.getTime(),
    power: consumption.power,
  }));
}

describe('Consumption', () => {
  beforeEach(async () => {
    await knex(Consumption.TABLE).truncate();
    await knex(Consumption.TABLE).insert(initConsumptions);
  });

  describe('findLastWeek', () => {
    it('should return all consumption for the last 7 days', async () => {
      const clock = lolex.install({ now: new Date('2020-08-25T16:00') });
      const result = await Consumption.findLastWeek();
      clock.uninstall();

      expect(result).toEqual(formatTimestamp([twentieth, twentyFirst]));
    });

    it('should return an empty list if there is no consumption during last 7 days', async () => {
      const clock = lolex.install({ now: new Date('2020-09-10T16:00') });
      const result = await Consumption.findLastWeek();
      clock.uninstall();

      expect(result).toHaveLength(0);
    });

    it('should return only consumption in the past', async () => {
      const clock = lolex.install({ now: new Date('2020-08-18T16:00') });
      const result = await Consumption.findLastWeek();
      clock.uninstall();

      expect(result).toEqual(formatTimestamp([seventeenth]));
    });
  });
});

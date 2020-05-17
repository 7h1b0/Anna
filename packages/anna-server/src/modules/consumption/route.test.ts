import request from 'supertest';
import * as lolex from '@sinonjs/fake-timers';
import { createUser } from 'factories';
import knex from 'knexClient';
import * as Consumption from 'modules/consumption/model';
import * as User from 'modules/user/model';
import app from '../../index';

const user = createUser();
const seventeenth = {
  date: new Date(Date.UTC(2020, 7, 17)),
  value: 7.0,
};
const twentieth = {
  date: new Date(Date.UTC(2020, 7, 20)),
  value: 5.01,
};
const twentyFirst = {
  date: new Date(Date.UTC(2020, 7, 21)),
  value: 5.01,
};
const initConsumptions = [seventeenth, twentieth, twentyFirst];

describe('Consumption API', () => {
  beforeAll(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(user);
  });

  beforeEach(async () => {
    await knex(Consumption.TABLE).truncate();
    await knex(Consumption.TABLE).insert(initConsumptions);
  });

  describe('/api/consumption', () => {
    describe('GET', () => {
      it('should return all consumptions for the last 7 days', async () => {
        const clock = lolex.install({ now: new Date('2020-08-25T16:00') });
        const response = await request(app)
          .get('/api/consumption')
          .set('Accept', 'application/json')
          .set('x-access-token', user.token);
        clock.uninstall();

        expect(response.body).toMatchSnapshot();
      });

      it('should retun 401 when user is not authenticated', async () => {
        const response = await request(app)
          .get('/api/consumption')
          .set('Accept', 'application/json')
          .set('x-access-token', 'fake');

        expect(response.status).toBeUnauthorized();
      });
    });
  });
});

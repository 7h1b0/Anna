import knex from 'knexClient';
import * as User from 'modules/user/model';
import authenticationMiddleware from './middleware';
import { createUser } from 'factories';

const userTest = createUser();

describe('authenticationMiddleware', () => {
  beforeEach(async () => {
    await knex(User.TABLE).truncate();
    await knex(User.TABLE).insert(userTest);
  });

  it('should call next when user exist', async () => {
    const req = {
      headers: {
        'x-access-token': userTest.token,
      },
    };
    const res = { sendStatus: jest.fn(), locals: {} };
    const next = jest.fn();

    // @ts-expect-error missing property to req
    await authenticationMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledTimes(0);
  });

  it('should save the current user into res.locals', async () => {
    const req = {
      headers: {
        'x-access-token': userTest.token,
      },
    };
    const res = { sendStatus: jest.fn(), locals: { user: null } };
    const next = jest.fn();

    // @ts-expect-error missing property to req
    await authenticationMiddleware(req, res, next);
    expect(res.locals.user).toEqual({
      userId: userTest.userId,
      username: userTest.username,
    });
  });

  it('should send 401 if token is invalid', async () => {
    const req = {
      headers: {
        'x-access-token': 'invalid-token',
      },
    };
    const res = { sendStatus: jest.fn() };
    const next = jest.fn();

    // @ts-expect-error missing property to req
    await authenticationMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(0);
  });

  it('should send 401 if token is missing', async () => {
    const req = {
      headers: {},
    };
    const res = {
      sendStatus: jest.fn(),
    };
    const next = jest.fn();

    // @ts-expect-error missing property to req
    await authenticationMiddleware(req, res, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledTimes(0);
  });
});

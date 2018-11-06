import knex from '../src/knexClient';

expect.extend({
  toHaveStatusOk(status) {
    if ([200, 201, 204].includes(status)) {
      return {
        message: () => `expected ${status} not to be 200, 201, 204`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${status} to be 200, 201, 204`,
        pass: false,
      };
    }
  },

  toBeBadRequest(status) {
    if (status === 400) {
      return {
        message: () => `expected ${status} not to be 400`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${status} to be 400`,
        pass: false,
      };
    }
  },

  toBeUnauthorized(status) {
    if (status === 401) {
      return {
        message: () => `expected ${status} not to be 401`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${status} to be 401`,
        pass: false,
      };
    }
  },
});

afterAll(async () => {
  await knex.destroy();
});

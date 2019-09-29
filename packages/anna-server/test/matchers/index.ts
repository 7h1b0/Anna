import toBeBadRequest from './toBeBadRequest';
import toBeUnauthorized from './toBeUnauthorized';
import toHaveStatusOk from './toHaveStatusOk';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeBadRequest: () => {};
      toBeUnauthorized: () => {};
      toHaveStatusOk: () => {};
    }
  }
}

export default {
  toBeBadRequest,
  toBeUnauthorized,
  toHaveStatusOk,
};

import { checkInternet } from './checkInternet';

import dispatch from '../utils/dispatch';
import TYPES from '../utils/type';

jest.mock('dns');
jest.mock('../utils/dispatch');

describe('checkInternet', () => {
  it('should dispatch alias "internet_down" after three failed attempts', async () => {
    await checkInternet('reject');
    expect(dispatch).toHaveBeenCalledTimes(0);

    await checkInternet('reject');
    expect(dispatch).toHaveBeenCalledTimes(0);

    await checkInternet('reject');

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: TYPES.ALIAS,
      targetId: 'internet_down',
    });

    await checkInternet('internet_is_back');

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenLastCalledWith({
      type: TYPES.ALIAS,
      targetId: 'internet_back',
    });
  });
});

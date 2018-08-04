const dioService = require('../dioService');

jest.mock('../execService');
const execService = require('../execService');

describe('dioService', () => {
  afterEach(() => {
    execService.mockClear();
  });

  it('should call radioEmission script with valid parameters', async () => {
    const res = await dioService.add(1, true);
    expect(res).toBeUndefined();
    expect(execService).toHaveBeenCalledTimes(1);
    expect(execService.mock.calls[0][0]).toEqual(`./radioEmission 1 1`);
  });

  it('should call radioEmission script with valid parameters', async () => {
    const res = await dioService.add(1, false);
    expect(res).toBeUndefined();
    expect(execService).toHaveBeenCalledTimes(1);
    expect(execService.mock.calls[0][0]).toEqual(`./radioEmission 1 0`);
  });
});

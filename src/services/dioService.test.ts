import dioAdd from './dioService';
import execService from './execService';

jest.mock('./execService');

describe('dioService', () => {
  it('should call radioEmission script with valid parameters', async () => {
    const res = await dioAdd('1', true);
    expect(res).toBeUndefined();
    expect(execService).toHaveBeenCalledTimes(1);
    expect(execService).toHaveBeenCalledWith(`./radioEmission 1 1`);
  });

  it('should call radioEmission script with valid parameters', async () => {
    const res = await dioAdd('1', false);
    expect(res).toBeUndefined();
    expect(execService).toHaveBeenCalledTimes(1);
    expect(execService).toHaveBeenCalledWith(`./radioEmission 1 0`);
  });
});

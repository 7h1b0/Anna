import dioAdd from './service';
import * as childProcess from 'child_process';

jest.mock('child_process');

describe('service', () => {
  it('should call radioEmission script with valid parameters', async () => {
    await dioAdd('1', true);
    expect(childProcess.exec).toHaveBeenCalledTimes(1);
    expect(childProcess.exec).toHaveBeenCalledWith(
      `./radioEmission 1 1`,
      expect.any(Function),
    );
  });

  it('should call radioEmission script with valid parameters', async () => {
    await dioAdd('1', false);
    expect(childProcess.exec).toHaveBeenCalledTimes(1);
    expect(childProcess.exec).toHaveBeenCalledWith(
      `./radioEmission 1 0`,
      expect.any(Function),
    );
  });
});

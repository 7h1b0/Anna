import execService from './execService';
import * as childProcess from 'child_process';

jest.mock('child_process');

describe('execService', () => {
  it('should return fake_test', () => {
    expect(execService('fake_script')).resolves.toBeDefined();
    expect(childProcess.exec).toHaveBeenCalledTimes(1);
    expect(childProcess.exec).toHaveBeenCalledWith(
      'fake_script',
      expect.any(Function),
    );
  });

  it('should return error', () => {
    expect(execService('reject')).rejects.toBeDefined();
    expect(childProcess.exec).toHaveBeenCalledTimes(1);
  });
});

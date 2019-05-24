import execService from '../execService';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('execService', () => {
  it('should return fake_test', () => {
    expect(execService('fake_script')).resolves.toBeDefined();
    expect(child_process.exec).toHaveBeenCalledTimes(1);
    expect(child_process.exec).toHaveBeenCalledWith(
      'fake_script',
      expect.any(Function),
    );
  });

  it('should return error', () => {
    expect(execService('reject')).rejects.toBeDefined();
    expect(child_process.exec).toHaveBeenCalledTimes(1);
  });
});

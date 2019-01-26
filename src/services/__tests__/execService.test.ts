import execService from '../execService';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('execService', () => {
  it('should return fake_test', () => {
    expect(execService('fake_script')).resolves.toBeDefined();
    expect(child_process.exec).toHaveBeenCalledTimes(1);
    expect(child_process.exec.mock.calls[0][0]).toEqual('fake_script');
  });

  it('should return error', () => {
    expect(execService('reject')).rejects.toBeDefined();
    expect(child_process.exec).toHaveBeenCalledTimes(1);
  });
});

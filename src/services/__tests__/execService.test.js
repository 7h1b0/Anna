import execService from '../execService';

jest.mock('child_process');
import * as child_process from 'child_process';

describe('execService', () => {
  afterEach(() => {
    child_process.exec.mockClear();
  });

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

import execService from './execService';
import * as childProcess from 'child_process';

jest.mock('child_process');

describe('execService', () => {
  it('should call child_process', async () => {
    await execService('fake_script');
    expect(childProcess.exec).toHaveBeenCalledTimes(1);
  });
});

import fetch from 'node-fetch';
import * as child from 'child_process';
import path from 'path';

xdescribe('User tests on binary', () => {
  let anna: child.ChildProcess;

  beforeAll(async () => {
    return new Promise((resolve, reject) => {
      anna = child.spawn(path.join(__dirname, '..', 'anna-x64'));

      anna.on('error', reject);
      if (anna.stdout) {
        anna.stdout.on('data', resolve);
      }
    });
  });

  afterAll(() => {
    anna.kill();
  });

  describe('when a user register', () => {
    it('should register a user', async () => {
      const res = await fetch('http://127.0.0.1:8181/api/register', {
        method: 'post',
        body: JSON.stringify({ username: 'test', password: 'test' }),
        headers: { 'Content-Type': 'application/json' },
      }).then((res) => res.json());

      expect(res).toHaveProperty('username', 'test');
      expect(res).toHaveProperty('token');
      expect(res).toHaveProperty('userId');
    });
  });
});

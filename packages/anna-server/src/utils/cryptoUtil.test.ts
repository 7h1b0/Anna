import * as crypto from './cryptoUtil';

describe('cryptoUtil', () => {
  describe('hash', () => {
    it('should return a new hash every time', () => {
      const password = 'test';
      const firstHash = crypto.hash(password);
      const secondHash = crypto.hash(password);

      expect(firstHash).not.toBe(secondHash);
      expect(password).not.toBe(secondHash);
      expect(password).not.toBe(firstHash);
    });
  });

  describe('verify', () => {
    it.concurrent(
      'should return true when a hash and password are equal',
      async () => {
        const password = 'test_compare';
        const hash = await crypto.hash(password);

        expect(await crypto.verify(password, hash)).toBeTruthy();
      },
    );

    it.concurrent(
      'should return false when a hash and password are not equal',
      async () => {
        const password = 'test_compare';
        const hash = await crypto.hash('test_fake');

        expect(await crypto.verify(password, hash)).toBeFalsy();
      },
    );
  });

  describe('random', () => {
    it.concurrent('should return a random string of 24 caracters', async () => {
      const first = await crypto.random();
      const second = await crypto.random();

      expect(first).not.toBe(second);
      expect(`${first}`).toHaveLength(24);
      expect(`${second}`).toHaveLength(24);
    });

    it.concurrent('should return a random string of 12 caracters', async () => {
      const random = await crypto.random(12);
      expect(random + '').toHaveLength(12);
    });
  });
});

import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { promisify } from 'util';

export function hash(password) {
  return bcrypt.genSalt(10).then(salt => {
    return bcrypt.hash(password, salt);
  });
}

export function verify(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function random(length = 24) {
  return promisify(randomBytes)(Math.ceil(length / 2)).then(buf =>
    buf.toString('hex'),
  );
}

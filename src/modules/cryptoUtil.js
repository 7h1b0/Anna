import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { promisify } from 'util';

export async function hash(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export function verify(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function random(length = 24) {
  const buf = await promisify(randomBytes)(Math.ceil(length / 2));
  return buf.toString('hex');
}

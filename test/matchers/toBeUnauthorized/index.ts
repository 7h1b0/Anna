import { printReceived } from 'jest-matcher-utils';
import predicate from './predicate';

const passMessage = (received: unknown) => () =>
  `Expected ${printReceived(received)} not to be 401`;

const failMessage = (received: unknown) => () =>
  `Expected ${printReceived(received)} to be 401`;

export default function toBeUnauthorized(receiver: unknown) {
  const pass = predicate(receiver);
  return {
    message: pass ? passMessage(receiver) : failMessage(receiver),
    pass,
  };
}

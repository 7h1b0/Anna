import { printReceived } from 'jest-matcher-utils';
import predicate from './predicate';

const passMessage = (received: any) => () =>
  `Expected ${printReceived(received)} not to be 401`;

const failMessage = (received: any) => () =>
  `Expected ${printReceived(received)} to be 401`;

export default function toBeUnauthorized(receiver: any) {
  const pass = predicate(receiver);
  return {
    message: pass ? passMessage(receiver) : failMessage(receiver),
    pass,
  };
}

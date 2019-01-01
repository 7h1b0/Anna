import { printReceived } from 'jest-matcher-utils';
import predicate from './predicate';

const passMessage = received => () =>
  `Expected ${printReceived(received)} not to be 400`;

const failMessage = received => () =>
  `Expected ${printReceived(received)} to be 400`;

export default function toBeBadRequest(receiver) {
  const pass = predicate(receiver);
  return {
    message: pass ? passMessage(receiver) : failMessage(receiver),
    pass,
  };
}

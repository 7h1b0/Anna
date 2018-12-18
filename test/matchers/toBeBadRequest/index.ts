import { printReceived } from 'jest-matcher-utils';
import predicate from './predicate';

const passMessage = (received: any) => () =>
  `Expected ${printReceived(received)} not to be 400`;

const failMessage = (received: any) => () =>
  `Expected ${printReceived(received)} to be 400`;

export default function toBeBadRequest(receiver: any) {
  const pass = predicate(receiver);
  return {
    message: pass ? passMessage(receiver) : failMessage(receiver),
    pass,
  };
}

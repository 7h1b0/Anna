import { exec } from 'child_process';
import { promisify } from 'util';
import * as logger from 'utils/logger';

function execPromisify(script: string) {
  return promisify(exec)(script);
}

let queue = Promise.resolve();
function run(script: string, onSuccess: Function, onError: Function) {
  queue = queue
    .then(() => execPromisify(script))
    .then(
      () => onSuccess(),
      (err) => {
        logger.error(err);
        onError();
      },
    );
}

export default function add(device: string, on = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const status = on ? 1 : 0;
    run(`./radioEmission ${device} ${status}`, resolve, reject);
  });
}

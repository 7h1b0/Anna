import execService from './execService';
import * as logger from 'modules/logger';

let queue = Promise.resolve();
function run(script: string, onSuccess: Function, onError: Function) {
  queue = queue
    .then(() => execService(script))
    .then(
      () => onSuccess(),
      err => {
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

import execService from './execService';
import * as logger from '../modules/logger';

let queue = Promise.resolve();
function run(script, onSuccess, onError) {
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

export default function add(device, on = false) {
  return new Promise((resolve, reject) => {
    const status = on ? 1 : 0;
    run(`./radioEmission ${device} ${status}`, resolve, reject);
  });
}

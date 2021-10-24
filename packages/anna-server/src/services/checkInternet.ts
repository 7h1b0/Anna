import dns from 'dns';
const dnsPromises = dns.promises;

import dispatch from '../utils/dispatch';
import { callAlias } from '../utils/actions';

let failAttempts = 0;
let hasInternet = true;

export function checkInternet(domainName = 'cloudflare.com') {
  return dnsPromises
    .lookup(domainName)
    .then(() => {
      if (!hasInternet) {
        hasInternet = true;
        failAttempts = 0;
        dispatch(callAlias('internet_back'));
      }
    })
    .catch((err) => {
      if (err.code == 'ENOTFOUND') {
        failAttempts++;
        if (failAttempts >= 3 && hasInternet) {
          dispatch(callAlias('internet_down'));
          hasInternet = false;
        }
      }
    });
}

// Call checkInternet every minutes
export function checkInternetConstantly() {
  setInterval(checkInternet, 1000 * 60);
}

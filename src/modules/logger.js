function getTime() {
  const date = new Date();

  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

function print(text, level, display) {
  if (process.env.NODE_ENV === 'production') {
    if (display || level === 'ERROR') {
      console.log(`${getTime()} [${level}] ${text}`);
    }
  } else {
    console.log(`${getTime()} [${level}] ${text}`);
  }
}

export function info(text, forceDisplay = false) {
  print(text, 'INFO', forceDisplay);
}

export function warn(text, forceDisplay = false) {
  print(text, 'WARN', forceDisplay);
}

export function error(text, forceDisplay = false) {
  print(text, 'ERROR', forceDisplay);
}

function getTime() {
  const date = new Date();

  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

function print(text, level, display = process.env.NODE_ENV === 'production') {
  if (display) {
    console.log(`${getTime()} [${level}] ${text}`);
  }
}

export function info(text, display) {
  print(text, 'INFO', display);
}

export function warn(text, display) {
  print(text, 'WARN', display);
}

export function error(text, display) {
  print(text, 'ERROR', display);
}

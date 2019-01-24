function print(text, level, display) {
  if (process.env.NODE_ENV === 'test') return;

  console.log(`[${level}] ${text}`);
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

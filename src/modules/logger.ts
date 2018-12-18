function print(text: string, level: string) {
  if (process.env.NODE_ENV === 'test') return;

  console.log(`[${level}] ${text}`);
}

export function info(text: string) {
  print(text, 'INFO');
}

export function warn(text: string) {
  print(text, 'WARN');
}

export function error(text: string) {
  print(text, 'ERROR');
}

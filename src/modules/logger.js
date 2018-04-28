function getTime() {
  const date = new Date();

  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

function print(text, level) {
  console.log(`${getTime()} [${level}] ${text}`);
}

module.exports = {
  info(text) {
    print(text, 'INFO');
  },

  warn(text) {
    print(text, 'WARN');
  },

  error(text) {
    print(text, 'ERROR');
  },
};

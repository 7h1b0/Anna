function getTime() {
  const date = new Date();

  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
  info(text) {
    console.log('%s [INFO] %s', getTime(), text);
  },

  warn(text) {
    console.log('%s [WARN] %s', getTime(), text);
  },

  error(text) {
    console.log('%s [ERROR] %s', getTime(), text);
  },
};

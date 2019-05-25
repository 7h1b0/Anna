const exec = jest.fn((script = 'reject', callback) => {
  if (script === 'reject') {
    return callback('error');
  }
  return callback(undefined, 'fake_test');
});

module.exports = {
  exec,
};

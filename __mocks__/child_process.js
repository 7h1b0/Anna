const exec = jest.fn((script = 'reject', callback) => {
  if (script === 'reject') {
    callback('error');
  } else {
    callback(undefined, 'fake_test');
  }
});

module.exports = {
  exec
};
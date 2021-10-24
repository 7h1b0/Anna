const lookup = jest.fn((domaineName = 'reject') => {
  return new Promise((resolve, reject) => {
    if (domaineName === 'reject') {
      return reject({ code: 'ENOTFOUND' });
    }
    return resolve('');
  });
});

module.exports = {
  promises: { lookup },
};

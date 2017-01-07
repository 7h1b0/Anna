const authenticationMiddlewares = require('./authenticationMiddlewares');
const logMiddlewares = require('./logMiddlewares');

module.exports = [
  authenticationMiddlewares,
  logMiddlewares,
];

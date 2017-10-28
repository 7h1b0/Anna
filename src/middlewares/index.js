const authenticationMiddleware = require('./authenticationMiddleware');
const logMiddleware = require('./logMiddleware');

module.exports = [authenticationMiddleware, logMiddleware];

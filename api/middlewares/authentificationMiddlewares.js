const tokenHelper = require('./../helpers/tokenHelper');

module.exports = function (req, res, next) {
	const token = req.headers['x-access-token'];
	tokenHelper.isValid(token).then(function () {
		next();
	}, function () {
		res.sendStatus(403);
	});
};
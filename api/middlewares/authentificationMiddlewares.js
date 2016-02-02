const tokenHelper = require('./../helpers/tokenHelper');

module.exports = (req, res, next) => {
	const token = req.headers['x-access-token'];
	tokenHelper.isValid(token)
		.then(() => next())
		.catch(() => res.sendStatus(401));
};
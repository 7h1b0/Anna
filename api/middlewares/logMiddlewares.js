const Log = require('./../models/log');

module.exports = (req, res, next) => {
	const log = new Log({
	    ip: req.ip,
	    httpMethod: req.method,
	    path: req.originalUrl
	});

	log.save();
	next();	
};
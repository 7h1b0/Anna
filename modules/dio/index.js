const dio = require('./controllers/dio');

exports.init = function(app) {
	dio.init(app);
}
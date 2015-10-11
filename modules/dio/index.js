var supply 		= require('./controllers/supply');
var group 		= require('./controllers/group');

exports.init = function(app){
	supply.init(app);
	group.init(app);
}
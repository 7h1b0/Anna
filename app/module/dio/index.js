var supply 		= require('./controller/supply');
var group 		= require('./controller/group');

exports.init = function(app){
	supply.init(app);
	group.init(app);
}
var supply 		= require('./controller/supply');
var group 		= require('./controller/group');

exports.init = function(app, db){
	supply.init(app,db);
	group.init(app,db);
}
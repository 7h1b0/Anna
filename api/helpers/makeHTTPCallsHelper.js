const Url 		= require('./../helpers/urlHelper');
const Request = require('./../services/requestService');

module.exports = function (actions, port, hostname) {
	if (!actions || !Array.isArray(actions)){
		return;
	}

	var port 			= port 		 || 8181;
	var hostname 	= hostname || 'localhost';
	var promises = [];

	actions.forEach(action => {
		const url = Url.getUrl(hostname, port, action.path);
		switch(action.method){
		case 'PUT':
			promises.push(Request.put(url, action.body));
			break;
		case 'POST':
			promises.push(Request.post(url, action.body));
			break;
		case 'DELETE':
			promises.push(Request.delete(url));
			break;
		default:
		case 'GET':
			promises.push(Request.get(url));
			break;
		}
	});

	return Promise.all(promises);
}
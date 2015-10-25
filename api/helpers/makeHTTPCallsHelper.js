const Url 		= require('./../helpers/urlHelper');
const Request = require('./../services/requestService');

module.exports = function (actions, port, hostname) {
	if (!actions){
		return;
	}

	var port 			= port 		 || 8181;
	var hostname 	= hostname || 'localhost';

	actions.forEach(action => {
		const url = Url.getUrl(hostname, port, action.path);
		switch(action.method){
		case 'PUT':
			Request.put(url, action.body);
			break;
		case 'POST':
			Request.post(url, action.body);
			break;
		case 'DELETE':
			Request.delete(url);
			break;
		default:
		case 'GET':
			Request.get(url);
			break;
		}
	});
}
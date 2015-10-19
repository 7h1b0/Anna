function Route(path, method, body){
    this.path = path;
    this.method = method;
    this.body = body;
    this.params = {}; // Define objects Params
    return this;
}

Route.prototype = {

    setBody: function (body){
        this.body = body;
        return this;
    },

    setParams: function (params){
        this.params = params;
        return this;
    },

    create: function (){
        var route = {};
        route.headers  = { Accept: 'application/json' };
    	route.method   = this.method || 'GET';
    	route.url      = this._getUrl();
    	route.timeout  = this.params.timeout || 2000;

        if (this.body !== undefined && typeof this.body === 'object') {
            route.json = true;
            route.body = this.body;
        }

    	return route;
    },

    _getUrl: function (){
        var protocol    = this.params.https ? 'https://' : 'http://';
        var hostname    = this.params.hostname || 'localhost'; 
        var port        = this.params.port || 80;
        var path        = getPath(this.path, this.params);

        return protocol + hostname + ":" + port + path;
    }
}

module.exports = Route;

function extractParameters(url){
    var parameters  = [];
    var matches     = url.match(/<[a-zA-Z_]+>/g);

    if (matches) {
        matches.forEach(match => {
            var parameter = match.substr(1, match.length-2); // Remove < and >
            parameters.push(parameter);
        });
    }

    return parameters;
}

function getPath(path, params){
	var requiredParameters = extractParameters(path);
    var resolvedPath = path;

    requiredParameters.forEach(reqParam => {
        if (params[reqParam] === undefined) {
            throw new Error("The required parameter '" + reqParam + "' was missing a value.");
        }

        resolvedPath = resolvedPath.replace("<" + reqParam + ">", params[reqParam]);
    });

    return resolvedPath;
}
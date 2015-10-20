function Route(path, method, body){
    this.path = path;
    this.method = method;
    this.body = body;
    this.params = {}; // Define objects Params
    return this;
}

Route.prototype = {

    setBody(body) {
        this.body = body;
        return this;
    },

    setParams(params) {
        this.params = params;
        return this;
    },

    create() {
        var route = {
            headers:    { Accept: 'application/json' },
            method:     this.method || 'GET',
            url:        this._getUrl(),
            timeout:    this.params.timeout || 2000
        };

        if (typeof this.body === 'object') {
            route.json = true;
            route.body = this.body;
        }

    	return route;
    },

    _getUrl() {
        const hostname    = this.params.hostname || 'localhost'; 
        const port        = this.params.port || 80;
        const path        = getPath(this.path, this.params);

        return `http://${hostname}:${port}${path}`;
    }
}

module.exports = Route;

function extractParameters(url) {
    var parameters  = [];
    const matches   = url.match(/<[a-zA-Z_]+>/g);

    if (matches) {
        matches.forEach(match => {
            const parameter = match.substr(1, match.length-2); // Remove < and >
            parameters.push(parameter);
        });
    }

    return parameters;
}

function getPath(path, parameters) {
	const requiredParameters = extractParameters(path);
    var resolvedPath = path;

    requiredParameters.forEach(requiredParameter => {
        if (parameters[requiredParameter] === undefined) {
            const msgError = `The required parameter ${requiredParameter} was missing.`
            throw new Error(msgError);
        }

        resolvedPath = resolvedPath.replace(`<${requiredParameter}>`, parameters[requiredParameter]);
    });

    return resolvedPath;
}
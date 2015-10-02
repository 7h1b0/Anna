function Route(route){
    this.url = route.url;
    this.method = route.method;
}

Route.prototype = {
	url : "",
	method: "",
    route: {},

    create: function (options, content) {
    	var uri = {
    		path: getPath(this.url, options),
    		hostname: options.hostname,
    		port: options.port
    	};

        this.route.headers = { Accept: 'application/json' };
    	this.route.method = this.method;
    	this.route.url = getUrl(uri);
    	this.route.timeout = options.timeout;

        if(this.method == 'PUT' || this.method == 'POST'){
            this.addData(content);
        }

    	return this.route;
    },

    addData: function(content){
        if(content === undefined){
            throw new Error("No data provided");
        }
        this.route.json = true;
        this.route.body = content;
    }
}

module.exports = Route;

function extractParameters(str) {
    var parameters = [],
        currentParameter = null,
        currentChar,
        idx = 0;

    if (str) {
        while (idx < str.length) {
            currentChar = str.charAt(idx);

            if (currentChar === "<") {
                // The beginning of a parameter
                currentParameter = "";
            } else if (currentChar === ">") {
                // The end of a parameter, maybe
                if (currentParameter !== null) {
                    parameters.push(currentParameter);
                    // Reset the current parameter
                    currentParameter = null;
                }
            } else if (currentParameter !== null) {
                // Append the character to the parameter name
                currentParameter += currentChar;
            }

            idx += 1;
        }
    }

    return parameters;
}

function getPath(path, params){
	if(params === undefined){
		return path;
	}else{
		var requiredParameters = extractParameters(path);
	    var resolvedPath = path;

	    requiredParameters.forEach(function (reqParam) {
	        if (params[reqParam] === undefined) {
	            throw new Error("The required parameter '" + reqParam + "' was missing a value.");
	        }

	        resolvedPath = resolvedPath.replace("<" + reqParam + ">", params[reqParam]);
	    });

	    return resolvedPath;
	}	
}

function getUrl(uri){
	return "http://" + uri.hostname + ":" + uri.port + uri.path;
}
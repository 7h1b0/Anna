module.exports = {
	
	getUrl(hostname, port, path, parameters) {
		port = port || 80;

        if (path) {
            path = this.getPath(path, parameters)
        } else {
            path = '';
        }

        return `http://${hostname}:${port}${path}`;
    },

    extractParameters(url) {
        var parameters  = [];
        const matches   = url.match(/<[a-zA-Z_]+>/g);

        if (matches) {
            matches.forEach(match => {
                const parameter = match.substr(1, match.length-2); // Remove < and >
                parameters.push(parameter);
            });
        }

        return parameters;
    },

    getPath(path, parameters) {
        const requiredParameters = this.extractParameters(path);
        var resolvedPath = path;

        if (parameters === undefined && requiredParameters.length > 0) {
            const msgError = 'The required parameters are missing.'
            throw new Error(msgError);
        }

        requiredParameters.forEach(requiredParameter => {
            if (parameters[requiredParameter] === undefined) {
                const msgError = `The required parameter ${requiredParameter} is missing.`
                throw new Error(msgError);
            }

            resolvedPath = resolvedPath.replace(`<${requiredParameter}>`, parameters[requiredParameter]);
        });

        return resolvedPath;
    }
}
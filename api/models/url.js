module.exports =  {
	
	getUrl(hostname, port, path, parameters) {
		const port = port || 80;
		const path = getPath(path, parameters);

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
        const requiredParameters = this._extractParameters(path);
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
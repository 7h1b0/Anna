exports.init = function(app){

    const DEFAULT_LIMIT = 20;
    var Log             = require('./../models/log');

    app.use(function (req, res, next){
        var log = new Log({
            ip: req.ip,
            httpMethod: req.method,
            path: req.originalUrl
        });

        log.save();
        next();
    });

	app.route('/log')
        .get(function (req, res){
            var query = getQuery(DEFAULT_LIMIT);
            query.exec(function onFind(err, logs){
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(logs);
                }
            });
	   });

    app.route('/log/:limit([0-9]{1,3})')
        .get(function (req, res){
            var query = getQuery(req.params.limit);
            query.exec(function onFind(err, logs){
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.send(logs);
                }
            });
        });

    app.route('/log/search')
        .post(function (req, res){
            if (req.body === undefined) {
                res.sendStatus(400);
            }
            
            Log.find(req.body, function onFind(err, logs){
                if (err) {
                    res.status(500).send(err); 
                } else if (logs === undefined){
                    res.sendStatus(404);
                } else {
                    res.send(logs);
                }
            });
        });

    function getQuery(limit){
        if (limit === undefined) {
            limit = DEFAULT_LIMIT;
        }

        return Log.find({}).sort({'date': 'desc'}).limit(limit);
    }
}
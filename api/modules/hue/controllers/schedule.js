exports.init = function (app, api){

	app.route('/hue/schedule')

		.get(function (req,res){
			api.getSchedules(function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.send(body);
			    }
			});
		})

		.post(function (req,res){
			api.addSchedule(req.body, function (err, result, body){
				if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.sendStatus(204);
			    }
			});
		})

	app.route('/hue/schedule/:id_schedule([0-9]{1,})')

		.get(function (req,res){
			api.getSchedule(req.params.id_schedule, function (err, result, body) {
			    if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.send(body);
			    }
			});
		})

		.put(function (req,res){
			api.setSchedule(req.params.id_schedule, req.body, function (err, result, body){
				if (err) {
			    	res.status(404).send(err);
			    } else {
			    	res.sendStatus(204);
			    }
			});
		})

		.delete(function (req,res){
			api.deleteSchedule(req.params.id_schedule, function (err, result) {
			    if (err) {
			    	res.status(404).send(err);
			   	} else {
			   		res.end();
			   	}
			});
		})
}
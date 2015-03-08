	var fs = require('fs');

exports.init = function(app,connection){
	app.route('/event')

		.get(function(req,res){
			connection.query('SELECT * FROM event', function(err, results) {
				if (err){
					res.status(500).send(err).end();
				}else{
					res.json(results);
				}
			});
		})

		.post(function(req,res){	

			if(req.body.title === undefined || req.body.url === undefined || req.body.date === undefined || req.body.repeat === undefined || req.body.hour === undefined || req.body.min === undefined){
				res.status(400).json({response: 'Error'});
				
			}else{
				connection.query('INSERT INTO event(id,title,url,repeat,date,hour,min) VALUES (NULL, ?,?,?,?,?,?)', [req.body.title,req.body.url,req.body.repeat, req.body.date,req.body.hour,req.body.min], function(err,results){
					if (err){
						res.status(500).send(err).end();
					}else{
						res.status(204).end();
					}
				});		
			}
		});

	// app.route('/event/:id_event')

	// 	.get(function(req,res){
	// 		Event.findById(req.params.id_event, function(err, event) {
	// 			if (err){
	// 				res.send(err).end();
	// 			}else{
	// 				res.json(event);
	// 			}

	// 		});
	// 	})

	// 	.put(function(req,res){
	// 		Event.findById(req.params.id_event, function(err, event) {
	// 			if (err){
	// 				res.send(err).end();
	// 			}else{		

	// 				event.name = (req.body.name === undefined) ? event.name : req.body.name;
	// 				event.hour = (req.body.hour === undefined) ? event.hour : req.body.hour;
	// 				event.min = (req.body.min === undefined) ? event.min : req.body.min;
	// 				event.command = (req.body.command === undefined) ? event.command : req.body.command;
	// 				event.recursive = (req.body.recursive === undefined) ? event.recursive : req.body.recursive;
	// 				event.activate = (req.body.activate === undefined) ? event.activate : req.body.activate;

	// 				event.save(function(err) {
	// 					if (err){
	// 						res.send(err).end();
	// 					}else{
	// 						res.json({response: 'Event updated' });
	// 					}

	// 				});
	// 			}

	// 		});
	// 	})

	// 	.delete(function(req, res){
	// 		Event.remove({_id: req.params.id_event}, function(err, commands) {
	// 			if (err){
	// 				res.send(err).end();
	// 			}else{
	// 				res.json({response: 'Successfully deleted' });
	// 			}

	// 		});
	//	});
};


exports.check = function(){
	var date,
		hour_now,
		min_now,
		i,
		l,
		http = require('http');

	setInterval(function(){
		date = new Date(),
		day = date.getDate(),
		hour_now = date.getHours(),
		min_now = date.getMinutes();

		Event.find(function(err,data){
			if(err){
				throw err;
			}else{
				for(i=0,l = data.length; i<l; i++){

					if(day == data[i].date.getDate() && hour_now == data[i].date.getHours() && min_now == data[i].date.getMinutes()){

						// Call action
						http.get(data[i].command,function(res){ }).on('error', function(e) {
						  	console.log("Got error: " + e.message);
						});

						// Delete evenf if is not recursive
						if(data[i].recursive == 0){
							Event.remove({_id: data[i]._id}, function(err, commands) {
								if (err){
									throw err;
								}
							});
						}
					}
				}
			}
		});

	},1000*60); // Every 1 minutes
};
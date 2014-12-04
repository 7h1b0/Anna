var Event = require('./../models/events'),
	fs = require('fs');

exports.init = function(app){
	app.route('/event')

		.get(function(req,res){
			Event.find(function(err, events) {
				if (err){
					res.send(err).end();
				}else{
					res.json(events);
				}

			});
		})

		.post(function(req,res){	

			if(req.body.name === undefined && req.body.date === undefined && req.body.command === undefined && req.body.recursive === undefined){
				res.json({response: 'Error'});
				
			}else{
				var event = new Event(); 

				event.name = req.body.name;
				event.command = req.body.command;
				event.recursive = req.body.recursive;
				event.date =  req.body.date;
				event.activate = 1;

				event.save(function(err) {
					if (err){
						res.send(err).end();
					}else{
						res.json({response: 'Event created' });
					}

				});
			}
		});

	app.route('/event/:id_event')

		.get(function(req,res){
			Event.findById(req.params.id_event, function(err, event) {
				if (err){
					res.send(err).end();
				}else{
					res.json(event);
				}

			});
		})

		.put(function(req,res){
			Event.findById(req.params.id_event, function(err, event) {
				if (err){
					res.send(err).end();
				}else{		

					event.name = (req.body.name === undefined) ? event.name : req.body.name;
					event.hour = (req.body.hour === undefined) ? event.hour : req.body.hour;
					event.min = (req.body.min === undefined) ? event.min : req.body.min;
					event.command = (req.body.command === undefined) ? event.command : req.body.command;
					event.recursive = (req.body.recursive === undefined) ? event.recursive : req.body.recursive;
					event.activate = (req.body.activate === undefined) ? event.activate : req.body.activate;

					event.save(function(err) {
						if (err){
							res.send(err).end();
						}else{
							res.json({response: 'Event updated' });
						}

					});
				}

			});
		})

		.delete(function(req, res){
			Event.remove({_id: req.params.id_event}, function(err, commands) {
				if (err){
					res.send(err).end();
				}else{
					res.json({response: 'Successfully deleted' });
				}

			});
		});
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
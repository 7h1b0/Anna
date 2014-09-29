var Event = require('./../models/events');

exports.init = function(app){
	app.route('/event')

		.get(function(req,res){
			Event.find(function(err, bears) {
				if (err)
					res.send(err);

				res.json(bears);
			});
		})

		.post(function(req,res){
			var event = new Event(); 		
				event.name = "test";
				event.date = Date.now();
				event.command = "test.sh"

			event.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Event created!' });
			});
		});

	app.route('/event/:id_event')

		.get(function(req,res){
			Event.findById(req.params.id_event, function(err, commands) {
				if (err)
					res.send(err);

				res.json(commands);
			});
		})

		.delete(function(req, res){
			Event.remove({_id: req.params.id_event}, function(err, commands) {
				if (err)
					res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});
}
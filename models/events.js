var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	EventsSchema   = new Schema({
		name: String,
		date: Date,
		command: String
	});

module.exports = mongoose.model('Event', EventsSchema);
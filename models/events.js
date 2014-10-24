var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	EventsSchema   = new Schema({
		name: String,
		hour: { type: Number, min: 0, max: 23},
		min : { type: Number, min: 0, max: 59},
		command: String,
		recursive: { type: Number, default: 0 },
		activate: { type: Number, default: 1 }
	});

module.exports = mongoose.model('Event', EventsSchema);
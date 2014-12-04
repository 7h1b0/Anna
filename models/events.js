var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	EventsSchema   = new Schema({
		name: String,
		date : { type: Date, default: Date.now },
		command: String,
		recursive: { type: Number, default: 0 },
		activate: { type: Number, default: 1 }
	});

module.exports = mongoose.model('Event', EventsSchema);